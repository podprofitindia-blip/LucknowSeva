import React, { useState } from 'react';
import { X, UserPlus, MessageSquare, ShieldCheck, AlertCircle, CheckCircle2, Phone } from 'lucide-react';
import { SERVICES_DATA } from '../data/servicesData';
import { 
  ProviderRegistrationData, 
  generateProviderRegistrationWhatsAppUrl, 
  LUCKNOW_SEVA_WHATSAPP, 
  LUCKNOW_SEVA_DISPLAY_PHONE, 
  openWhatsAppUrl 
} from '../utils/whatsapp';

interface ProviderRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProviderRegistrationModal: React.FC<ProviderRegistrationModalProps> = ({
  isOpen,
  onClose
}) => {
  const [formData, setFormData] = useState<ProviderRegistrationData>({
    providerName: '',
    phone: '',
    serviceCategory: 'इलेक्ट्रीशियन (Electrician)',
    experienceYears: '5',
    coveredAreas: 'गोमती नगर, हज़रतगंज, इंदिरा नगर',
    currentAddress: '',
    aadhaarConfirmed: true,
    notes: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.providerName.trim()) {
      setErrorMsg('कृपया अपना पूरा नाम दर्ज करें।');
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें।');
      return;
    }

    if (!formData.currentAddress.trim()) {
      setErrorMsg('कृपया लखनऊ में अपना वर्तमान पता या मोहल्ला लिखें।');
      return;
    }

    if (!formData.aadhaarConfirmed) {
      setErrorMsg('पंजीकरण के लिए पहचान पत्र सत्यापन की सहमति आवश्यक है।');
      return;
    }

    const waUrl = generateProviderRegistrationWhatsAppUrl(formData);
    setLastWhatsAppUrl(waUrl);
    setIsSubmitted(true);

    openWhatsAppUrl(waUrl);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-amber-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-linear-to-r from-amber-800 via-amber-700 to-amber-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-white">
                कारीगर / पार्टनर पंजीकरण
              </h3>
              <p className="text-xs text-amber-200">
                लखनऊ सेवा से जुड़ें और सीधे ग्राहक पाएं
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
          /* Confirmation */
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 font-heading">
              आवेदन तैयार है!
            </h4>
            <p className="text-sm text-slate-600">
              आपके विवरण लखनऊ सेवा प्रशासन के व्हाट्सएप (<strong>{LUCKNOW_SEVA_WHATSAPP}</strong>) पर भेजे जा रहे हैं। सत्यापन के बाद आपको अधिकृत सूची में जोड़ा जाएगा।
            </p>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-left text-xs space-y-1">
              <p><strong>आवेदक:</strong> {formData.providerName}</p>
              <p><strong>कार्य:</strong> {formData.serviceCategory}</p>
              <p><strong>अनुभव:</strong> {formData.experienceYears} वर्ष</p>
              <p><strong>क्षेत्र:</strong> {formData.coveredAreas}</p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => openWhatsAppUrl(lastWhatsAppUrl)}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-98 transition-all cursor-pointer"
              >
                <MessageSquare className="w-5 h-5" />
                <span>व्हाट्सएप पर पुनः भेजें ({LUCKNOW_SEVA_WHATSAPP})</span>
              </button>

              <a
                href={`tel:${LUCKNOW_SEVA_WHATSAPP}`}
                className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-amber-700" />
                <span>संचालक से बात करें: {LUCKNOW_SEVA_DISPLAY_PHONE}</span>
              </a>

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  onClose();
                }}
                className="text-xs text-slate-500 hover:text-slate-800 underline pt-2 cursor-pointer"
              >
                विंडो बंद करें
              </button>
            </div>
          </div>
        ) : (
          /* Input Form */
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
            {/* Strict Quality Notice */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>सत्यापन नीति:</strong> लखनऊ सेवा पर केवल वही कारीगर लिस्ट होते हैं जिनकी पहचान और काम की भौतिक जांच मालिक द्वारा की जाती है। हम कोई फर्जी प्रोफाइल नहीं बनाते।
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="provider-name" className="block text-xs font-bold text-slate-700 mb-1">
                  आपका पूरा नाम <span className="text-rose-500">*</span>
                </label>
                <input
                  id="provider-name"
                  type="text"
                  value={formData.providerName}
                  onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                  placeholder="उदा. मोहम्मद आरिफ़ / सुनील कश्यप"
                  className="w-full h-12 px-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm text-slate-900"
                  required
                />
              </div>

              <div>
                <label htmlFor="provider-phone" className="block text-xs font-bold text-slate-700 mb-1">
                  मोबाइल नंबर (WhatsApp) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="provider-phone"
                  type="tel"
                  inputMode="tel"
                  maxLength={12}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="10 अंकों का नंबर"
                  className="w-full h-12 px-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm text-slate-900"
                  required
                />
              </div>
            </div>

            {/* Service & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="provider-service" className="block text-xs font-bold text-slate-700 mb-1">
                  आप क्या काम करते हैं? <span className="text-rose-500">*</span>
                </label>
                <select
                  id="provider-service"
                  value={formData.serviceCategory}
                  onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
                  className="w-full h-12 px-3 rounded-xl border border-slate-300 text-sm font-semibold bg-white text-slate-800"
                  required
                >
                  {SERVICES_DATA.map((srv) => (
                    <option key={srv.id} value={srv.nameHi}>
                      {srv.nameHi}
                    </option>
                  ))}
                  <option value="अन्य कुशल सेवा">अन्य कुशल सेवा (Other Trade)</option>
                </select>
              </div>

              <div>
                <label htmlFor="provider-exp" className="block text-xs font-bold text-slate-700 mb-1">
                  काम का अनुभव (वर्ष) <span className="text-rose-500">*</span>
                </label>
                <select
                  id="provider-exp"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                  className="w-full h-12 px-3 rounded-xl border border-slate-300 text-sm bg-white text-slate-800"
                >
                  <option value="1">1-2 वर्ष</option>
                  <option value="3">3-5 वर्ष</option>
                  <option value="5">5-8 वर्ष</option>
                  <option value="10">10+ वर्ष</option>
                  <option value="15">15+ वर्ष (मास्टर कारीगर)</option>
                </select>
              </div>
            </div>

            {/* Areas you can cover */}
            <div>
              <label htmlFor="provider-areas" className="block text-xs font-bold text-slate-700 mb-1">
                लखनऊ के किन इलाकों में काम कर सकते हैं? <span className="text-rose-500">*</span>
              </label>
              <input
                id="provider-areas"
                type="text"
                value={formData.coveredAreas}
                onChange={(e) => setFormData({ ...formData, coveredAreas: e.target.value })}
                placeholder="उदा. गोमती नगर, हज़रतगंज, इंदिरा नगर, संपूर्ण लखनऊ"
                className="w-full h-12 px-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm text-slate-900"
                required
              />
            </div>

            {/* Current Address */}
            <div>
              <label htmlFor="provider-address" className="block text-xs font-bold text-slate-700 mb-1">
                लखनऊ में आपका निवास / पता <span className="text-rose-500">*</span>
              </label>
              <input
                id="provider-address"
                type="text"
                value={formData.currentAddress}
                onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
                placeholder="उदा. मकान नं. 14, सेक्टर 8, जानकीपुरम, लखनऊ"
                className="w-full h-12 px-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm text-slate-900"
                required
              />
            </div>

            {/* Aadhaar Checkbox */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.aadhaarConfirmed}
                  onChange={(e) => setFormData({ ...formData, aadhaarConfirmed: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <span>
                  <strong>आधार/पहचान पत्र सहमति:</strong> मेरे पास वैध पहचान पत्र व आधार है और मैं लखनऊ सेवा द्वारा भौतिक सत्यापन के लिए तैयार हूँ।
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-14 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20 active:scale-98 transition-all cursor-pointer"
            >
              <MessageSquare className="w-5 h-5 fill-white/20" />
              <span>व्हाट्सएप पर विवरण भेजें (918303806214)</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
