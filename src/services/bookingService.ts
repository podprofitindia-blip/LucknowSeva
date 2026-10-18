import {
  collection,
  doc,
  setDoc,
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
const RECENT_SUBMISSION_WINDOW_MS = 60000;

// स्थानीय बुकिंग पढ़ें
export function getLocalBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);

    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Failed to read local bookings:', err);
  }

  return [];
}

// स्थानीय बुकिंग सेव करें
export function saveLocalBookings(bookings: Booking[]): void {
  try {
    localStorage.setItem(
      LOCAL_STORAGE_BOOKINGS_KEY,
      JSON.stringify(bookings)
    );
  } catch (err) {
    console.error('Failed to save local bookings:', err);
  }
}

// हाल की डुप्लिकेट बुकिंग जाँचें
export function checkIsDuplicate(
  phone: string,
  service: string
): Booking | null {
  const cleanPhone = phone.replace(/\D/g, '');
  const now = Date.now();

  const found = getLocalBookings().find((booking) => {
    const existingPhone = booking.phone.replace(/\D/g, '');
    const timeDiff = now - new Date(booking.createdAt).getTime();

    return (
      existingPhone === cleanPhone &&
      booking.service === service &&
      timeDiff >= 0 &&
      timeDiff < RECENT_SUBMISSION_WINDOW_MS
    );
  });

  return found || null;
}

// बुकिंग ID बनाएँ
export function generateUniqueBookingId(): string {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
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

// नई ग्राहक बुकिंग बनाएँ
export async function createBooking(
  formData: BookingFormData
): Promise<BookingSaveResult> {
  const duplicate = checkIsDuplicate(
    formData.phone,
    formData.service
  );

  if (duplicate) {
    throw new Error(
      `यह बुकिंग पहले ही दर्ज हो चुकी है (आईडी: ${duplicate.bookingId})। कृपया दोबारा बुकिंग न करें।`
    );
  }

  const bookingId = generateUniqueBookingId();
  const now = new Date().toISOString();

  const newBooking: Booking = {
    bookingId,
    customerName: formData.customerName.trim(),
    phone: formData.phone.trim(),
    service: formData.service.trim(),
    area: formData.area.trim(),
    landmark: formData.landmark?.trim() || '',
    workDetails: formData.workDetails.trim(),
    preferredTime: formData.preferredTime?.trim() || 'यथाशीघ्र',
    status: 'pending',

    // चुने गए मिस्त्री की जानकारी
    assignedProviderId: formData.assignedProviderId || '',
    assignedProviderName: formData.assignedProviderName || '',

    createdAt: now,
    updatedAt: now,
    source: 'lucknowseva-web'
  };

  // पहले स्थानीय ब्राउज़र में सेव करें
  const currentBookings = getLocalBookings();

  saveLocalBookings([
    newBooking,
    ...currentBookings.filter(
      (booking) => booking.bookingId !== bookingId
    )
  ]);

  let cloudSaved = false;
  let cloudError: string | null = null;

  // Firebase Firestore में सेव करें
  try {
    const bookingRef = doc(db, 'bookings', bookingId);

    await setDoc(bookingRef, newBooking);

    cloudSaved = true;

    console.log('Booking saved to Firestore:', bookingId);
  } catch (err: unknown) {
    cloudSaved = false;

    cloudError =
      err instanceof Error
        ? err.message
        : 'Firebase में बुकिंग सेव नहीं हो सकी।';

    console.error('Firestore booking save failed:', err);
  }

  return {
    booking: newBooking,
    cloudSaved,
    cloudError
  };
}

// Firebase की बुकिंग में लाइव बदलाव प्राप्त करें
export function subscribeToBookings(
  onUpdate: (
    bookings: Booking[],
    source: BookingsSource,
    errorInfo: FirestoreErrorInfo | null
  ) => void
): () => void {
  onUpdate(getLocalBookings(), 'offline_cache', null);

  try {
    const bookingsCollection = collection(db, 'bookings');

    const bookingsQuery = query(
      bookingsCollection,
      orderBy('createdAt', 'desc'),
      limit(100)
    );

    return onSnapshot(
      bookingsQuery,
      (snapshot) => {
        const remoteBookings: Booking[] = [];

        snapshot.forEach((documentSnapshot) => {
          remoteBookings.push(
            documentSnapshot.data() as Booking
          );
        });

        saveLocalBookings(remoteBookings);

        onUpdate(remoteBookings, 'firestore', null);
      },
      (error) => {
        console.error('Firestore listener error:', error);

        onUpdate(getLocalBookings(), 'offline_cache', {
          code: error.code,
          message: error.message
        });
      }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : 'बुकिंग listener शुरू नहीं हो सका।';

    onUpdate(getLocalBookings(), 'offline_cache', {
      code: 'initialization-failed',
      message
    });

    return () => {};
  }
}

// बुकिंग का स्टेटस या मिस्त्री अपडेट करें
export async function updateBookingStatus(
  bookingId: string,
  newStatus: Booking['status'],
  notes?: string,
  assignedProviderId?: string,
  assignedProviderName?: string
): Promise<void> {
  const now = new Date().toISOString();

  const updates: Partial<Booking> = {
    status: newStatus,
    updatedAt: now
  };

  if (notes !== undefined) {
    updates.notes = notes;
  }

  if (assignedProviderId !== undefined) {
    updates.assignedProviderId = assignedProviderId;
  }

  if (assignedProviderName !== undefined) {
    updates.assignedProviderName = assignedProviderName;
  }

  // स्थानीय रिकॉर्ड अपडेट करें
  const localBookings = getLocalBookings();

  const updatedBookings = localBookings.map((booking) =>
    booking.bookingId === bookingId
      ? { ...booking, ...updates }
      : booking
  );

  saveLocalBookings(updatedBookings);

  // Firebase रिकॉर्ड अपडेट करें
  try {
    const bookingRef = doc(db, 'bookings', bookingId);

    await updateDoc(bookingRef, updates);
  } catch (err) {
    console.error('Firebase booking update failed:', err);
    throw err;
  }
}
