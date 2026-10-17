import React from 'react';
import { ShieldCheck, Phone, MessageSquare, MapPin, Globe, Sparkles, Settings } from 'lucide-react';
import { SERVICES_DATA, ServiceItem } from '../data/servicesData';
import { LUCKNOW_SEVA_DISPLAY_PHONE, LUCKNOW_SEVA_WHATSAPP } from '../utils/whatsapp';

interface FooterProps {
  onSelectService: (service: ServiceItem) => void;
  onOpenBooking: () => void;
  onOpenProviderReg: () => void;
  onOpenHostingGuide: () => void;
  onOpenOwnerModal: () => void;
  onOpenAIAssistant?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectService,
  onOpenBooking,
  onOpenProviderReg,
  onOpenHostingGuide,
  onOpenOwnerModal,
  onOpenAIAssistant
}) => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-12 pb-24 sm:pb-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          {/* Brand info (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-heading font-bold text-xl">
                ल
              </div>
              <span className="font-heading font-extrabold text-xl text-white">
                Lucknow<span className="text-amber-500">Seva</span>
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                सत्यापित
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              लखनऊ सेवा — उत्तर प्रदेश की राजधानी लखनऊ के हर घर तक विश्वसनीय, सत्यापित एवं कुशल इलेक्ट्रीशियन, प्लंबर, एसी टेक्नीशियन, बढ़ई, पेंटर और होम ट्यूटर्स पहुंचाने का प्रामाणिक मंच।
            </p>

            <div className="space-y-2 pt-1 text-slate-300">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>हज़रतगंज, गोमती नगर व समस्त लखनऊ, उत्तर प्रदेश</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href={`tel:${LUCKNOW_SEVA_WHATSAPP}`} className="hover:text-white transition-colors">
                  कॉल: {LUCKNOW_SEVA_DISPLAY_PHONE}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`https://wa.me/${LUCKNOW_SEVA_WHATSAPP}`} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  व्हाट्सएप: +91 83038 06214
                </a>
              </p>
            </div>
          </div>

          {/* Core Services (8 items) */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200">
              8 प्रमुख सेवाएं
            </h4>
            <ul className="space-y-1.5">
              {SERVICES_DATA.map((srv) => (
                <li key={srv.id}>
                  <button
                    onClick={() => onSelectService(srv)}
                    className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                  >
                    {srv.nameHi}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Areas in Lucknow */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200">
              प्रमुख कार्यक्षेत्र
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>गोमती नगर व विस्तार</li>
              <li>हज़रतगंज व जीपीओ</li>
              <li>इंदिरा नगर व मुंशी पुलिया</li>
              <li>अलीगंज व कपूरथला</li>
              <li>आलमबाग व आशियाना</li>
              <li>चौक व पुराना लखनऊ</li>
              <li>जानकीपुरम व विकास नगर</li>
              <li>सुशांत गोल्फ सिटी (लूलू मॉल)</li>
            </ul>
          </div>

          {/* Quick Actions & Free Hosting Guide */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200">
              त्वरित लिंक व गाइड
            </h4>
            <div className="space-y-2">
              <button
                onClick={onOpenBooking}
                className="w-full py-2 px-3 rounded-lg bg-emerald-700/50 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>सेवा बुक करें</span>
              </button>

              <button
                onClick={onOpenProviderReg}
                className="w-full py-2 px-3 rounded-lg bg-amber-900/40 hover:bg-amber-900/60 text-amber-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>👷 कारीगर पार्टनर पंजीकरण</span>
              </button>

              {onOpenAIAssistant && (
                <button
                  onClick={onOpenAIAssistant}
                  className="w-full py-2 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-amber-500/40"
                >
                  <span>🤖 AI सहायक व बुकिंग प्रबंधक</span>
                </button>
              )}

              <button
                onClick={onOpenHostingGuide}
                className="w-full py-2 px-3 rounded-lg bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>वेबसाइट फ्री में लाइव करें</span>
              </button>

              <button
                onClick={onOpenOwnerModal}
                className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>मालिक / एडमिन पैनल</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright & anti-slop notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} लखनऊ सेवा (LucknowSeva). सर्वाधिकार सुरक्षित।</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>सत्यापित कारीगर नीति</span>
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% फ्री टूल्स आर्किटेक्चर</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
