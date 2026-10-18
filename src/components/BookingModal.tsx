import React, { useState, useEffect } from 'react';
import {
  X,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

import { SERVICES_DATA, ServiceItem } from '../data/servicesData';
import { LUCKNOW_AREAS } from '../data/lucknowAreas';

import {
  BookingFormData,
  generateBookingWhatsAppUrl,
  openWhatsAppUrl
} from '../utils/whatsapp';

import {
  createBooking,
  Booking
} from '../services/bookingService';

import { VerifiedProvider } from '../data/initialProviders';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: ServiceItem | null;
  initialArea?: string;
  initialProvider?: VerifiedProvider | null;
  onBookingSuccess?: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialService,
  initialArea,
  initialProvider,
  onBookingSuccess
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    customerName: '',
    phone: '',
    area: initialArea || '',
    service: initialProvider?.serviceNameHi ||
      initialService?.nameHi ||
      'इलेक्ट्रीशियन (Electrician)',
    workDetails: '',
    preferredTime: 'यथाशीघ्र (As soon as possible)',
    landmark: '',
    assignedProviderId: initialProvider?.id || '',
    assignedProviderName: initialProvider?.name || ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [savedBooking, setSavedBooking] = useState<Booking | null>(null);

  const [cloudStatus, setCloudStatus] = useState<{
    saved: boolean;
    error: string | null;
  }>({
    saved: false,
    error: null
  });

  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState('');

  // चुनी हुई सेवा, मिस्त्री और इलाके के अनुसार फॉर्म अपडेट करें
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      service:
        initialProvider?.serviceNameHi ||
        initialService?.nameHi ||
        prev.service,

      area: initialArea || prev.area,

      workDetails:
        prev.workDetails ||
        (initialProvider
          ? `${initialProvider.serviceNameHi} सेवा चाहिए। चुने गए मिस्त्री: ${initialProvider.name}`
          : initialService
            ? `${initialService.nameHi} सेवा की आवश्यकता है`
            : ''),

      assignedProviderId: initialProvider?.id || '',
      assignedProviderName: initialProvider?.name || ''
    }));
  }, [initialService, initialArea, initialProvider]);

  // बंद मोडल का UI न दिखाएँ
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.customerName.trim()) {
      setErrorMsg('कृपया अपना नाम दर्ज करें।');
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');

    if (cleanPhone.length !== 10) {
      setErrorMsg('कृपया 10 अंकों का मोबाइल नंबर दर्ज करें।');
      return;
    }

    if (!formData.area.trim()) {
      setErrorMsg('कृपया अपना इलाका चुनें।');
      return;
    }

    if (!formData.workDetails.trim()) {
      setErrorMsg('कृपया काम का विवरण लिखें।');
      return;
    }

    try {
      setIsSaving(true);

      // बुकिंग और चुने गए मिस्त्री की जानकारी सेव करें
      const result = await createBooking({
        ...formData,
        phone: cleanPhone
      });

      setSavedBooking(result.booking);

      setCloudStatus({
        saved: result.cloudSaved,
        error: result.cloudError || null
      });

      // बुकिंग ID सहित WhatsApp संदेश बनाएँ
      const waUrl = generateBookingWhatsAppUrl(
        {
          ...formData,
          phone: cleanPhone
        },
        result.booking.bookingId
      );

      setLastWhatsAppUrl(waUrl);
      setIsSubmitted(true);

      if (onBookingSuccess) {
        onBookingSuccess(result.booking);
      }
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'बुकिंग दर्ज नहीं हो सकी। कृपया दोबारा प्रयास करें।'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickDetail = (text: string) => {
    setFormData((prev) => ({
      ...prev,
      workDetails: prev.workDetails
        ? `${prev.workDetails}, ${text}`
        : text
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-amber-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-linear-to-r from-amber-700 via-amber-600 to-amber-700 text-white p-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-xl">
              सेवा बुकिंग फॉर्म
            </h3>
            <p className="text-xs text-amber-100">
              LucknowSeva — आधिकारिक बुकिंग
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
            aria-label="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-6 text-center space-y-4">
            <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />

            <h4 className="text-xl font-bold text-slate-900">
              बुकिंग अनुरोध दर्ज हो गया
            </h4>

            <p className="text-sm text-slate-600">
              बुकिंग ID: <strong>{savedBooking?.bookingId}</strong>
            </p>

            {cloudStatus.saved ? (
              <p className="text-sm text-emerald-700">
                ✓ Firebase में बुकिंग सेव हो गई।
              </p>
            ) : (
              <p className="text-sm text-amber-800">
                ⚠️ बुकिंग केवल इस डिवाइस के स्थानीय स्टोरेज में सेव हुई है।
                Firebase में सेव होने की पुष्टि नहीं हुई।
                {cloudStatus.error ? ` विवरण: ${cloudStatus.error}` : ''}
              </p>
            )}

            <div className="text-left bg-amber-50 rounded-xl p-4 space-y-2 text-sm">
              <p>
                <strong>ग्राहक:</strong> {formData.customerName}
              </p>

              <p>
                <strong>मोबाइल:</strong> {formData.phone}
              </p>

              <p>
                <strong>सेवा:</strong> {formData.service}
              </p>

              <p>
                <strong>इलाका:</strong> {formData.area}
              </p>

              <p>
                <strong>मिस्त्री:</strong>{' '}
                {formData.assignedProviderName || 'अभी नहीं चुना गया'}
              </p>

              <p>
                <strong>मिस्त्री ID:</strong>{' '}
                {formData.assignedProviderId || 'उपलब्ध नहीं'}
              </p>

              <p>
                <strong>काम:</strong> {formData.workDetails}
              </p>
            </div>

            <button
              type="button"
              onClick={() => openWhatsAppUrl(lastWhatsAppUrl)}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              WhatsApp पर बुकिंग भेजें
            </button>

            <p className="text-xs text-slate-500">
              WhatsApp खुलने के बाद संदेश भेजने के लिए Send दबाएँ।
            </p>

            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold"
            >
              बंद करें
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-6 space-y-4"
          >
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* चुना गया मिस्त्री */}
            {initialProvider && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <p className="text-sm font-bold text-emerald-800">
                  ✓ चुने गए मिस्त्री: {initialProvider.name}
                </p>
                <p className="text-xs text-emerald-700 mt-1">
                  सेवा: {initialProvider.serviceNameHi}
                </p>
                <p className="text-xs text-emerald-700">
                  मिस्त्री ID: {initialProvider.id}
                </p>
              </div>
            )}

            {/* सेवा */}
            <div>
              <label htmlFor="booking-service" className="block text-sm font-bold mb-1">
                आवश्यक सेवा *
              </label>

              <select
                id="booking-service"
                value={formData.service}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    service: e.target.value
                  }))
                }
                className="w-full h-12 px-3 rounded-xl border border-slate-300 bg-white"
                required
              >
                {SERVICES_DATA.map((srv) => (
                  <option key={srv.id} value={srv.nameHi}>
                    {srv.nameHi} — शुरुआती {srv.startingPrice}
                  </option>
                ))}
              </select>
            </div>

            {/* ग्राहक का नाम और मोबाइल */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="customer-name" className="block text-sm font-bold mb-1">
                  आपका नाम *
                </label>

                <input
                  id="customer-name"
                  type="text"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      customerName: e.target.value
                    }))
                  }
                  className="w-full h-12 px-3 rounded-xl border border-slate-300"
                  placeholder="अपना नाम लिखें"
                  required
                />
              </div>

              <div>
                <label htmlFor="customer-phone" className="block text-sm font-bold mb-1">
                  मोबाइल नंबर *
                </label>

                <input
                  id="customer-phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phone: e.target.value.replace(/\D/g, '').slice(0, 10)
                    }))
                  }
                  className="w-full h-12 px-3 rounded-xl border border-slate-300"
                  placeholder="10 अंकों का नंबर"
                  required
                />
              </div>
            </div>

            {/* इलाका और लैंडमार्क */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="booking-area" className="block text-sm font-bold mb-1">
                  लखनऊ का इलाका *
                </label>

                <select
                  id="booking-area"
                  value={formData.area}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      area: e.target.value
                    }))
                  }
                  className="w-full h-12 px-3 rounded-xl border border-slate-300 bg-white"
                  required
                >
                  <option value="">इलाका चुनें</option>

                  {LUCKNOW_AREAS.map((area) => (
                    <option key={area.id} value={area.nameHi}>
                      {area.nameHi} ({area.zone})
                    </option>
                  ))}

                  <option value="अन्य इलाका">अन्य इलाका</option>
                </select>
              </div>

              <div>
                <label htmlFor="customer-landmark" className="block text-sm font-bold mb-1">
                  नजदीकी लैंडमार्क
                </label>

                <input
                  id="customer-landmark"
                  type="text"
                  value={formData.landmark || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      landmark: e.target.value
                    }))
                  }
                  className="w-full h-12 px-3 rounded-xl border border-slate-300"
                  placeholder="नजदीकी चौराहा"
                />
              </div>
            </div>

            {/* काम का विवरण */}
            <div>
              <label htmlFor="work-details" className="block text-sm font-bold mb-1">
                काम का विवरण *
              </label>

              <textarea
                id="work-details"
                rows={3}
                value={formData.workDetails}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    workDetails: e.target.value
                  }))
                }
                className="w-full p-3 rounded-xl border border-slate-300 resize-none"
                placeholder="क्या काम करवाना है?"
                required
              />

              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  'तुरंत आवश्यकता है',
                  'लीकेज ठीक करना',
                  'नई फिटिंग',
                  'गैस चार्जिंग',
                  'डेमो क्लास'
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleQuickDetail(tag)}
                    className="text-xs px-2 py-1 rounded-md bg-slate-100 border border-slate-200"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* पसंदीदा समय */}
            <div>
              <label htmlFor="preferred-time" className="block text-sm font-bold mb-1">
                पसंदीदा समय
              </label>

              <select
                id="preferred-time"
                value={formData.preferredTime || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    preferredTime: e.target.value
                  }))
                }
                className="w-full h-12 px-3 rounded-xl border border-slate-300 bg-white"
              >
                <option value="यथाशीघ्र (As soon as possible)">
                  यथाशीघ्र
                </option>
                <option value="आज दोपहर (12 PM - 3 PM)">
                  आज दोपहर
                </option>
                <option value="आज शाम (4 PM - 7 PM)">
                  आज शाम
                </option>
                <option value="कल सुबह (9 AM - 12 PM)">
                  कल सुबह
                </option>
                <option value="रविवार / छुट्टी के दिन">
                  रविवार / छुट्टी
                </option>
              </select>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex gap-2">
              <ShieldCheck className="w-5 h-5 shrink-0" />

              <span>
                बुकिंग का संदेश आपके आधिकारिक WhatsApp नंबर
                <strong> +91 83038 06214 </strong>
                पर तैयार होगा।
              </span>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className={`w-full h-14 rounded-2xl text-white font-bold flex items-center justify-center gap-2 ${
                isSaving
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {isSaving ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  बुकिंग सेव हो रही है...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  बुकिंग सुरक्षित दर्ज करें
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
