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

export function generateBookingWhatsAppUrl(data: BookingFormData): string {
  const message = `*लखनऊ सेवा (LucknowSeva) - नई बुकिंग अनुरोध*
─────────────────────
👤 *ग्राहक का नाम:* ${data.customerName.trim()}
📱 *मोबाइल नंबर:* ${data.phone.trim()}
📍 *लखनऊ इलाका / क्षेत्र:* ${data.area.trim()}
${data.landmark?.trim() ? `🏢 *नजदीकी लैंडमार्क:* ${data.landmark.trim()}\n` : ''}🔧 *आवश्यक सेवा:* ${data.service}
📝 *काम का विवरण:* ${data.workDetails.trim()}
⏰ *पसंदीदा समय/तारीख:* ${data.preferredTime?.trim() || 'यथाशीघ्र (As soon as possible)'}
─────────────────────
_कृपया मुझे कॉल करें या व्हाट्सएप पर पुष्टि करें।_`;

  return `https://wa.me/${LUCKNOW_SEVA_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export function generateProviderRegistrationWhatsAppUrl(data: ProviderRegistrationData): string {
  const message = `*लखनऊ सेवा (LucknowSeva) - कारीगर/पार्टनर पंजीकरण*
─────────────────────
👷‍♂️ *कारीगर का नाम:* ${data.providerName.trim()}
📱 *मोबाइल नंबर:* ${data.phone.trim()}
🛠️ *काम का प्रकार (सेवा):* ${data.serviceCategory.trim()}
⏳ *अनुभव:* ${data.experienceYears.trim()} वर्ष
📍 *कार्यक्षेत्र (इलाके):* ${data.coveredAreas.trim()}
🏠 *वर्तमान पता:* ${data.currentAddress.trim()}
✅ *आधार/पहचान पत्र सत्यापन:* ${data.aadhaarConfirmed ? 'हाँ, सत्यापन हेतु तैयार' : 'अपुष्ट'}
${data.notes?.trim() ? `💬 *अतिरिक्त विवरण:* ${data.notes.trim()}\n` : ''}─────────────────────
_सादर, लखनऊ सेवा पार्टनर टीम से जुड़ने हेतु आवेदन।_`;

  return `https://wa.me/${LUCKNOW_SEVA_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export function openWhatsAppUrl(url: string): void {
  // Safe on Android, iOS, and desktop browsers
  window.open(url, '_blank', 'noopener,noreferrer');
}
