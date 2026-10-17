import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Phone, MapPin, CheckCircle2, AlertCircle, Clock, ShieldCheck } from 'lucide-react';
import { SERVICES_DATA, ServiceItem } from '../data/servicesData';
import { LUCKNOW_AREAS } from '../data/lucknowAreas';
import { 
  BookingFormData, 
  generateBookingWhatsAppUrl, 
  LUCKNOW_SEVA_WHATSAPP, 
  LUCKNOW_SEVA_DISPLAY_PHONE, 
  openWhatsAppUrl 
} from '../utils/whatsapp';

import { createBooking, Booking } from '../services/bookingService';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: ServiceItem | null;
  initialArea?: string;
  onBookingSuccess?: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialService,
  initialArea,
  onBookingSuccess
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    customerName: '',
    phone: '',
    area: initialArea || '',
    service: initialService ? initialService.nameHi : 'इलेक्ट्रीशियन (Electrician)',
    workDetails: '',
    preferredTime: 'यथाशीघ्र (As soon as possible)',
    landmark: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [savedBooking, setSavedBooking] = useState<Booking | null>(null);
  const [cloudStatus, setCloudStatus] = useState<{ saved: boolean; error: string | null }>({ saved: false, error: null });
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState('');

  // Sync state when initial props change
  useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({
        ...prev,
        service: initialService.nameHi,
        workDetails: prev.workDetails || `${initialService.nameHi} सेवा की आवश्यकता है`
      }));
    }
    if (initialArea) {
      setFormData((prev) => ({
        ...prev,
        area: initialArea
      }));
    }
  }, [initialService, initialArea]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (!formData.customerName.trim()) {
      setErrorMsg('कृपया अपना शुभ नाम दर्ज करें।');
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें।');
      return;
    }

    if (!formData.area.trim()) {
      setErrorMsg('कृपया लखनऊ का अपना इलाका/क्षेत्र चुनें।');
      return;
    }

    if (!formData.workDetails.trim()) {
      setErrorMsg('कृपया काम या समस्या का थोड़ा विवरण लिखें।');
      return;
    }

    try {
      setIsSaving(true);
      // Save real booking into shared database with duplicate prevention
      const result = await createBooking(formData);
      setSavedBooking(result.booking);
      setCloudStatus({ saved: result.cloudSaved, error: result.cloudError || null });

      // Build WhatsApp message with unique booking ID
      const waUrl = generateBookingWhatsAppUrl(formData);
      setLastWhatsAppUrl(waUrl);
      setIsSubmitted(true);

      if (onBookingSuccess) {
        onBookingSuccess(result.booking);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'बुकिंग दर्ज करने में समस्या आई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickDetail = (text: string) => {
    setFormData((prev) => ({
      ...prev,
      workDetails: prev.workDetails ? `${prev.workDetails}, ${text}` : text
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-amber-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bg-linear-to-r from-amber-700 via-amber-600 to-amber-700 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-white">
                सेवा बुकिंग फॉर्म
              </h3>
              <p className="text-xs text-amber-100 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>सीधे लखनऊ सेवा आधिकारिक व्हाट्सएप पर कनेक्ट</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          /* Confirmation State with Booking ID & Storage Confirmation */
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-4 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-2">
                आईडी: {savedBooking?.bookingId}
              </span>
              <h4 className="text-xl font-bold text-slate-900 font-heading">
                बुकिंग सफलतापूर्वक सुरक्षित दर्ज हुई!
              </h4>
              {cloudStatus.saved ? (
                <p className="text-xs text-emerald-700 font-semibold mt-1">
                  ✓ Firestore क्लाउड डेटाबेस (bookings) में लाइव सुरक्षित
                </p>
              ) : (
                <p className="text-xs text-amber-800 font-semibold mt-1">
                  ✓ सुरक्षित स्थानीय बफ़र में दर्ज • कोई डेटा लॉस नहीं {cloudStatus.error ? `(क्लाउड: ${cloudStatus.error})` : ''}
                </p>
              )}
            </div>

            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-left text-xs text-slate-700 space-y-1.5">
              <div className="flex justify-between border-b border-amber-200/60 pb-1">
                <span className="text-slate-500">बुकिंग आईडी:</span>
                <span className="font-mono font-bold text-slate-900">{savedBooking?.bookingId}</span>
              </div>
              <div className="flex justify-between border-b border-amber-200/60 pb-1">
                <span className="text-slate-500">ग्राहक का नाम:</span>
                <strong className="text-slate-900">{formData.customerName}</strong>
              </div>
              <div className="flex justify-between border-b border-amber-200/60 pb-1">
                <span className="text-slate-500">मोबाइल नंबर:</span>
                <span className="font-mono font-bold text-slate-900">{formData.phone}</span>
              </div>
              <div className="flex justify-between border-b border-amber-200/60 pb-1">
                <span className="text-slate-500">इलाका:</span>
                <span className="font-semibold text-slate-900">{formData.area}</span>
              </div>
              <div className="flex justify-between border-b border-amber-200/60 pb-1">
                <span className="text-slate-500">सेवा:</span>
                <span className="font-bold text-amber-800">{formData.service}</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-slate-500">काम का विवरण:</span>
                <span className="text-slate-800 text-right max-w-[200px] truncate">{formData.workDetails}</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => openWhatsAppUrl(lastWhatsAppUrl)}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-98 transition-all cursor-pointer"
              >
                <MessageSquare className="w-5 h-5" />
                <span>WhatsApp पर भी भेजें (वैकल्पिक)</span>
              </button>

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                विंडो बंद करें
              </button>
            </div>
          </div>
        ) : (
          /* Form Inputs */
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Service Selection */}
            <div>
              <label htmlFor="booking-service" className="block text-xs font-bold text-slate-700 mb-1">
                आवश्यक सेवा चुनें <span className="text-rose-500">*</span>
              </label>
              <select
                id="booking-service"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full h-12 px-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm font-semibold bg-white text-slate-800"
                required
              >
                {SERVICES_DATA.map((srv) => (
                  <option key={srv.id} value={srv.nameHi}>
                    {srv.nameHi} — शुरुआती {srv.startingPrice}
                  </option>
                ))}
              </select>
            </div>

            {/* Name & Phone in 2-cols or 1-col on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="customer-name" className="block text-xs font-bold text-slate-700 mb-1">
                  आपका शुभ नाम <span className="text-rose-500">*</span>
                </label>
                <input
                  id="customer-name"
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="उदा. राहुल वर्मा"
                  className="w-full h-12 px-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm text-slate-900"
                  required
                />
              </div>

              <div>
                <label htmlFor="customer-phone" className="block text-xs font-bold text-slate-700 mb-1">
                  मोबाइल नंबर (WhatsApp) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="customer-phone"
                  type="tel"
                  inputMode="tel"
                  maxLength={12}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="10 अंकों का नंबर"
                  className="w-full h-12 px-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm text-slate-900 font-medium"
                  required
                />
              </div>
            </div>

            {/* Area Dropdown + Landmark */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="booking-area" className="block text-xs font-bold text-slate-700 mb-1">
                  लखनऊ का इलाका <span className="text-rose-500">*</span>
                </label>
                <select
                  id="booking-area"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full h-12 px-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm text-slate-900 bg-white"
                  required
                >
                  <option value="">-- इलाका चुनें --</option>
                  {LUCKNOW_AREAS.map((a) => (
                    <option key={a.id} value={a.nameHi}>
                      {a.nameHi} ({a.zone})
                    </option>
                  ))}
                  <option value="अन्य इलाका">अन्य इलाका (Other area in Lucknow)</option>
                </select>
              </div>

              <div>
                <label htmlFor="customer-landmark" className="block text-xs font-bold text-slate-700 mb-1">
                  नजदीकी चौराहा / लैंडमार्क
                </label>
                <input
                  id="customer-landmark"
                  type="text"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  placeholder="उदा. पत्रकारपुरम चौराहा / भूतनाथ"
                  className="w-full h-12 px-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm text-slate-900"
                />
              </div>
            </div>

            {/* Work Details */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="work-details" className="block text-xs font-bold text-slate-700">
                  काम का विवरण / क्या समस्या है? <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400">विस्तार से लिखें</span>
              </div>
              <textarea
                id="work-details"
                rows={3}
                value={formData.workDetails}
                onChange={(e) => setFormData({ ...formData, workDetails: e.target.value })}
                placeholder="उदा. पंखा नहीं चल रहा है, एसी में गैस भरवानी है, बाथरूम में नल लीकेज है..."
                className="w-full p-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm text-slate-900 resize-none"
                required
              />

              {/* Quick Tags for fast filling on mobile */}
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                <span className="text-[10px] font-semibold text-slate-500 self-center">त्वरित टैग:</span>
                {['तुरंत आवश्यकता है', 'लीकेज ठीक करना', 'नई फिटिंग', 'गैस चार्जिंग', 'डेमो क्लास'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleQuickDetail(tag)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Time */}
            <div>
              <label htmlFor="preferred-time" className="block text-xs font-bold text-slate-700 mb-1">
                पसंदीदा समय
              </label>
              <select
                id="preferred-time"
                value={formData.preferredTime}
                onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                className="w-full h-11 px-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 bg-white"
              >
                <option value="यथाशीघ्र (अगले 1-2 घंटे में)">यथाशीघ्र (अगले 1-2 घंटे में / इमरजेंसी)</option>
                <option value="आज दोपहर (12 PM - 3 PM)">आज दोपहर (12 PM - 3 PM)</option>
                <option value="आज शाम (4 PM - 7 PM)">आज शाम (4 PM - 7 PM)</option>
                <option value="कल सुबह (9 AM - 12 PM)">कल सुबह (9 AM - 12 PM)</option>
                <option value="रविवार / छुट्टी के दिन">रविवार / छुट्टी के दिन</option>
              </select>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                बटन दबाते ही यह विवरण सीधे <strong>918303806214</strong> पर व्हाट्सएप में खुल जाएगा। कोई थर्ड-पार्टी चार्ज नहीं!
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSaving}
              className={`w-full h-14 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                isSaving 
                  ? 'bg-slate-400 cursor-not-allowed opacity-80' 
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30 active:scale-98'
              }`}
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>सुरक्षित दर्ज हो रहा है...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-emerald-200" />
                  <span>बुकिंग सुरक्षित दर्ज करें (Book Service)</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
