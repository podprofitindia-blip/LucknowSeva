import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BookingFormData } from '../utils/whatsapp';

export interface Booking {
  bookingId: string;
  customerName: string;
  phone: string;
  service: string;
  area: string;
  landmark?: string;
  workDetails: string;
  preferredTime?: string;
  status: 'pending' | 'confirmed' | 'assigned' | 'completed' | 'cancelled';
  assignedProviderId?: string;
  assignedProviderName?: string;
  createdAt: string;
  updatedAt?: string;
  source: string;
  notes?: string;
}

const LOCAL_STORAGE_BOOKINGS_KEY = 'lucknowseva_actual_bookings_v1';
const RECENT_SUBMISSION_WINDOW_MS = 60000; // 60 seconds duplicate debounce window

// Read locally cached bookings
export function getLocalBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Failed to read local bookings', err);
  }
  return [];
}

// Save locally cached bookings
export function saveLocalBookings(bookings: Booking[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(bookings));
  } catch (err) {
    console.error('Failed to save local bookings', err);
  }
}

// Check for recent duplicate booking
export function checkIsDuplicate(phone: string, service: string): Booking | null {
  const cleanPhone = phone.replace(/\D/g, '');
  const existing = getLocalBookings();
  const now = Date.now();

  const found = existing.find((b) => {
    const bPhone = b.phone.replace(/\D/g, '');
    const isSamePhone = bPhone === cleanPhone;
    const isSameService = b.service === service;
    const timeDiff = now - new Date(b.createdAt).getTime();
    return isSamePhone && isSameService && timeDiff < RECENT_SUBMISSION_WINDOW_MS;
  });

  return found || null;
}

// Generate human-friendly sequential-style Booking ID (e.g. LKO-2610-4821)
export function generateUniqueBookingId(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `LKO-${month}${day}-${randomDigits}`;
}

export interface BookingSaveResult {
  booking: Booking;
  cloudSaved: boolean;
  cloudError?: string | null;
}

export type BookingsSource = 'firestore' | 'offline_cache';

export interface FirestoreErrorInfo {
  code: string;
  message: string;
}

// Create and store genuine customer booking
export async function createBooking(formData: BookingFormData): Promise<BookingSaveResult> {
  // 1. Strict Duplicate Check
  const duplicate = checkIsDuplicate(formData.phone, formData.service);
  if (duplicate) {
    throw new Error(`यह बुकिंग पहले ही दर्ज हो चुकी है (आईडी: ${duplicate.bookingId})। दोबारा फॉर्म भरने की आवश्यकता नहीं है।`);
  }

  const bookingId = generateUniqueBookingId();
  const now = new Date().toISOString();

  const newBooking: Booking = {
    bookingId,
    customerName: formData.customerName.trim(),
    phone: formData.phone.trim(),
    service: formData.service.trim(),
    area: formData.area.trim(),
    landmark: formData.landmark ? formData.landmark.trim() : '',
    workDetails: formData.workDetails.trim(),
    preferredTime: formData.preferredTime ? formData.preferredTime.trim() : 'यथाशीघ्र',
    status: 'pending',
    createdAt: now,
    updatedAt: now,
    source: 'lucknowseva-web'
  };

  // 2. Persist to local cache as immediate safety fallback
  const currentList = getLocalBookings();
  const updatedList = [newBooking, ...currentList.filter(b => b.bookingId !== bookingId)];
  saveLocalBookings(updatedList);

  let cloudSaved = false;
  let cloudError: string | null = null;

  // 3. Persist to Firestore shared database
  try {
    const bookingDocRef = doc(db, 'bookings', bookingId);
    await setDoc(bookingDocRef, newBooking);
    cloudSaved = true;
    console.log('Booking successfully written to Firestore collection "bookings":', bookingId);
  } catch (err: any) {
    cloudSaved = false;
    cloudError = err?.message || 'Firestore write permission or network error';
    console.warn('Firestore write response (saved locally in buffer):', err?.code, err?.message);
  }

  return {
    booking: newBooking,
    cloudSaved,
    cloudError
  };
}

// Subscribe to real bookings (for LucknowSeva AI Assistant & Booking Manager)
// Transparently passes the exact source and any permission-denied errors without masking
export function subscribeToBookings(
  onUpdate: (
    bookings: Booking[], 
    source: BookingsSource, 
    errorInfo: FirestoreErrorInfo | null
  ) => void
): () => void {
  // Emit initial cached bookings immediately with 'offline_cache' tag
  const initial = getLocalBookings();
  onUpdate(initial, 'offline_cache', null);

  try {
    const bookingsCol = collection(db, 'bookings');
    const q = query(bookingsCol, orderBy('createdAt', 'desc'), limit(100));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const remoteBookings: Booking[] = [];
        snapshot.forEach((docSnap) => {
          remoteBookings.push(docSnap.data() as Booking);
        });

        // Save fresh remote copy to local cache
        saveLocalBookings(remoteBookings);
        // Explicitly report that this data came directly from LIVE Firestore
        onUpdate(remoteBookings, 'firestore', null);
      },
      (error) => {
        console.warn('Firestore read listener encountered error:', error.code, error.message);
        // DO NOT mask the permission error: inform caller with exact error details
        const cached = getLocalBookings();
        onUpdate(cached, 'offline_cache', {
          code: error.code,
          message: error.message
        });
      }
    );

    return unsubscribe;
  } catch (e: any) {
    console.warn('Could not initialize snapshot listener:', e);
    const cached = getLocalBookings();
    onUpdate(cached, 'offline_cache', {
      code: 'initialization-failed',
      message: e?.message || 'Listener setup failed'
    });
    return () => {};
  }
}

// Update booking status in Firestore & local cache
export async function updateBookingStatus(
  bookingId: string,
  newStatus: Booking['status'],
  notes?: string,
  assignedProviderId?: string,
  assignedProviderName?: string
): Promise<void> {
  const local = getLocalBookings();
  const now = new Date().toISOString();

  const updated = local.map((b) => {
    if (b.bookingId === bookingId) {
      return {
        ...b,
        status: newStatus,
        updatedAt: now,
        ...(notes !== undefined ? { notes } : {}),
        ...(assignedProviderId ? { assignedProviderId } : {}),
        ...(assignedProviderName ? { assignedProviderName } : {})
      };
    }
    return b;
  });

  saveLocalBookings(updated);

  try {
    const bookingDocRef = doc(db, 'bookings', bookingId);
    const updates: Partial<Booking> = {
      status: newStatus,
      updatedAt: now,
      ...(notes !== undefined ? { notes } : {}),
      ...(assignedProviderId ? { assignedProviderId } : {}),
      ...(assignedProviderName ? { assignedProviderName } : {})
    };
    await updateDoc(bookingDocRef, updates);
  } catch (err) {
    console.warn('Could not update remote doc (updated locally):', err);
  }
}
