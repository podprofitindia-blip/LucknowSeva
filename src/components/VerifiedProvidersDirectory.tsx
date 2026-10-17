import React, { useState } from 'react';
import { ShieldCheck, UserCheck, MapPin, Briefcase, Award, MessageSquare, PlusCircle } from 'lucide-react';
import { VerifiedProvider } from '../data/initialProviders';

interface VerifiedProvidersDirectoryProps {
  providers: VerifiedProvider[];
  onBookProvider: (provider: VerifiedProvider) => void;
  onOpenOwnerModal: () => void;
}

export const VerifiedProvidersDirectory: React.FC<VerifiedProvidersDirectoryProps> = ({
  providers,
  onBookProvider,
  onOpenOwnerModal
}) => {
  const [selectedServiceFilter, setSelectedServiceFilter] = useState<string>('all');

  const activeProviders = providers.filter((p) => p.isActive);

  const filtered = selectedServiceFilter === 'all'
    ? activeProviders
    : activeProviders.filter((p) => p.serviceId === selectedServiceFilter);

  const filterOptions = [
    { id: 'all', label: 'सभी सत्यापित कारीगर' },
    { id: 'electrician', label: 'इलेक्ट्रीशियन' },
    { id: 'plumber', label: 'प्लंबर' },
    { id: 'ac-repair', label: 'एसी रिपेयर' },
    { id: 'carpenter', label: 'बढ़ई' },
    { id: 'painter', label: 'पेंटर' },
    { id: 'cleaning', label: 'सफाई' },
    { id: 'appliance-repair', label: 'उपकरण मरम्मत' },
    { id: 'home-tutor', label: 'होम ट्यूटर' }
  ];

  return (
    <section id="verified-providers-section" className="py-12 bg-amber-50/50 border-y border-amber-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header with Anti-Fake Notice */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>मालिक द्वारा सत्यापित डायरेक्टरी</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading">
              हमारे सत्यापित कारीगर व विशेषज्ञ
            </h2>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl">
              केवल वही स्थानीय पेशेवर जो लखनऊ सेवा के संस्थापक द्वारा व्यक्तिगत रूप से आंके और अनुमोदित किए गए हैं।
            </p>
          </div>

          <button
            onClick={onOpenOwnerModal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-amber-100 text-amber-900 font-bold text-xs sm:text-sm border border-amber-300 shadow-xs transition-all cursor-pointer self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4 text-amber-600" />
            <span>+ नया कारीगर जोड़ें (मालिक पैनल)</span>
          </button>
        </div>

        {/* Anti-Fake Reviews Transparency Box */}
        <div className="mb-8 p-4 rounded-2xl bg-white border-2 border-amber-300 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                100% पारदर्शी नीति: कोई बनावटी 5-स्टार रेटिंग या फर्जी रिव्यू नहीं
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                हम ग्राहकों को गुमराह करने वाले बॉट या नकली रिव्यू प्रदर्शित नहीं करते। लखनऊ सेवा के हर पार्टनर की पहचान, निवास और कार्य-कौशल की भौतिक पुष्टि की जाती है।
              </p>
            </div>
          </div>
          <span className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            ✓ शारीरिक सत्यापन पूर्ण
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none text-xs font-semibold">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedServiceFilter(opt.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                selectedServiceFilter === opt.id
                  ? 'bg-amber-700 text-white font-bold shadow-xs'
                  : 'bg-white hover:bg-amber-100/60 text-slate-700 border border-amber-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Verified Providers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((prov) => (
            <div
              key={prov.id}
              className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Header with Verification Code & Badge */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    कोड: {prov.verificationCode}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <UserCheck className="w-3.5 h-3.5" />
                    {prov.policeVerificationStatus}
                  </span>
                </div>

                {/* Name & Trade */}
                <div className="mt-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {prov.name}
                  </h3>
                  <p className="text-xs font-semibold text-amber-700 mt-0.5">
                    {prov.serviceNameHi}
                  </p>
                </div>

                {/* Experience & Areas */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <p className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span><strong>अनुभव:</strong> {prov.experienceYears} वर्ष का व्यावहारिक कार्य</span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>कार्यक्षेत्र:</strong> {prov.coveredAreas.join(', ')}</span>
                  </p>
                </div>

                {/* Specialization */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <p className="text-[10px] uppercase font-bold text-slate-500">विशेषज्ञता:</p>
                  <p className="text-slate-700 mt-0.5 leading-snug">{prov.specialization}</p>
                </div>

                {prov.notes && (
                  <p className="mt-2 text-[11px] text-slate-500 italic">
                    "{prov.notes}"
                  </p>
                )}
              </div>

              {/* Action */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => onBookProvider(prov)}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer shadow-xs"
                >
                  <MessageSquare className="w-4 h-4 fill-white/20" />
                  <span>इन्हें बुक करें (WhatsApp पर)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
