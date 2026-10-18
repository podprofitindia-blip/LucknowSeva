export const LUCKNOW_SEVA_WHATSAPP = '918303806214';
export const LUCKNOW_SEVA_DISPLAY_PHONE = '+91 83038 06214';

export interface BookingFormData {
  customerName: string;
  phone: string;
  area: string;
  service: string;
  workDetails: string;
  preferredTime?: string;
  landmark?: string;

  // चुने गए मिस्त्री की जानकारी
  assignedProviderId?: string;
  assignedProviderName?: string;
}

export interface ProviderRegistrationData {
  providerName: string;
  phone: string;
  serviceCategory: string;
  experienceYears: string;
  coveredAreas: string;
  currentAddress: string;
  aadhaarConfirmed: boolean;
  notes?: string;
}

export function generateBookingWhatsAppUrl(
  data: BookingFormData,
  bookingId?: string
): string {
  const message = `*लखनऊ सेवा (LucknowSeva) - नई बुकिंग*
─────────────────────
🎫 *बुकिंग आईडी:* ${bookingId || 'बुकिंग आईडी उपलब्ध नहीं'}
👤 *ग्राहक:* ${data.customerName.trim()}
📱 *मोबाइल:* ${data.phone.trim()}
📍 *इलाका:* ${data.area.trim()}
${data.landmark?.trim() ? `🏢 *लैंडमार्क:* ${data.landmark.trim()}\n` : ''}🔧 *सेवा:* ${data.service}
👨‍🔧 *चुने गए मिस्त्री:* ${data.assignedProviderName || 'अभी मिस्त्री नहीं चुना गया'}
🆔 *मिस्त्री ID:* ${data.assignedProviderId || 'अभी निर्धारित नहीं'}
📝 *काम:* ${data.workDetails.trim()}
⏰ *पसंदीदा समय:* ${data.preferredTime?.trim() || 'यथाशीघ्र'}
─────────────────────
_कृपया ग्राहक से संपर्क करके बुकिंग की पुष्टि करें।_`;

  return `https://wa.me/${LUCKNOW_SEVA_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export function generateProviderRegistrationWhatsAppUrl(
  data: ProviderRegistrationData
): string {
  const message = `*लखनऊ सेवा - कारीगर पंजीकरण*
─────────────────────
👷 *कारीगर का नाम:* ${data.providerName.trim()}
📱 *मोबाइल:* ${data.phone.trim()}
🛠️ *सेवा:* ${data.serviceCategory.trim()}
⏳ *अनुभव:* ${data.experienceYears.trim()} वर्ष
📍 *कार्यक्षेत्र:* ${data.coveredAreas.trim()}
🏠 *पता:* ${data.currentAddress.trim()}
✅ *पहचान सत्यापन:* ${data.aadhaarConfirmed ? 'सत्यापन हेतु तैयार' : 'अभी अपुष्ट'}
${data.notes?.trim() ? `💬 *अन्य जानकारी:* ${data.notes.trim()}\n` : ''}─────────────────────
_लखनऊ सेवा पार्टनर पंजीकरण अनुरोध_`;

  return `https://wa.me/${LUCKNOW_SEVA_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export function openWhatsAppUrl(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer');
}
