import React from 'react';
import { Search, MapPin, ShieldCheck, CheckCircle2, MessageSquare, PhoneCall, Sparkles } from 'lucide-react';
import { LUCKNOW_AREAS } from '../data/lucknowAreas';
import { LUCKNOW_SEVA_WHATSAPP } from '../utils/whatsapp';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  onOpenBooking: () => void;
  onOpenProviderReg: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedArea,
  setSelectedArea,
  onOpenBooking,
  onOpenProviderReg
}) => {
  const quickAreas = ['गोमती नगर', 'हज़रतगंज', 'इंदिरा नगर', 'अलीगंज', 'आलमबाग', 'चौक'];

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-amber-100/60 via-amber-50/40 to-transparent pt-6 pb-12 sm:pt-10 sm:pb-16 border-b border-amber-200/50">
      {/* Decorative subtle backdrop elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-amber-300/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-300/20 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* City Greeting Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300/80 text-amber-900 text-xs sm:text-sm font-semibold mb-4 shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>मुस्कुराइए, आप लखनऊ में हैं — और सेवा की चिंता हम पर छोड़ दीजिए</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 font-heading leading-tight tracking-tight">
          लखनऊ की अपनी <span className="text-amber-600 underline decoration-amber-400 decoration-wavy decoration-2">विश्वसनीय</span> होम सर्विसेज
        </h1>

        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-700 max-w-2xl mx-auto font-normal leading-relaxed">
          इलेक्ट्रीशियन, प्लंबर, एसी रिपेयर, कारपेंटर, सफाई, पेंटर, उपकरण मरम्मत और होम ट्यूटर — सीधे आपके घर, उचित दरों और पूरी जिम्मेदारी के साथ।
        </p>

        {/* Search & Area Filter Bar - Highlighted for easy mobile access */}
        <div className="mt-7 sm:mt-9 max-w-3xl mx-auto bg-white rounded-2xl p-2 sm:p-2.5 shadow-xl shadow-amber-900/10 border-2 border-amber-400/80 ring-4 ring-amber-100">
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Area Selector Dropdown */}
            <div className="flex items-center gap-2 bg-amber-50/70 rounded-xl px-3 py-2.5 sm:w-1/3 border border-amber-200">
              <MapPin className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="w-full text-left">
                <label htmlFor="area-select" className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  इलाका चुनें
                </label>
                <select
                  id="area-select"
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer truncate"
                >
                  <option value="">सम्पूर्ण लखनऊ (सभी इलाके)</option>
                  {LUCKNOW_AREAS.map((area) => (
                    <option key={area.id} value={area.nameHi}>
                      {area.nameHi} ({area.nameEn})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Service Name Search Input */}
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5 sm:w-2/3 border border-slate-200">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <div className="w-full text-left">
                <label htmlFor="service-search" className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  सेवा खोजें
                </label>
                <input
                  id="service-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="जैसे: एसी, पंखा, प्लंबर, ट्यूटर, पेंटर..."
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none placeholder:text-slate-400"
                />
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded-md cursor-pointer"
                >
                  साफ करें
                </button>
              )}
            </div>
          </div>

          {/* Quick Area Chips */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 flex-wrap text-xs text-slate-600 px-1">
            <span className="font-semibold text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              लोकप्रिय क्षेत्र:
            </span>
            <button
              onClick={() => setSelectedArea('')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                selectedArea === ''
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              सभी
            </button>
            {quickAreas.map((area) => (
              <button
                key={area}
                onClick={() => setSelectedArea(selectedArea === area ? '' : area)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedArea === area
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Trust Highlights & Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-700/20 active:scale-98 transition-all cursor-pointer"
          >
            <MessageSquare className="w-5 h-5" />
            <span>व्हाट्सएप पर तुरंत बुक करें</span>
          </button>

          <a
            href={`tel:${LUCKNOW_SEVA_WHATSAPP}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 font-bold text-base shadow-sm active:scale-98 transition-all"
          >
            <PhoneCall className="w-5 h-5 text-amber-700" />
            <span>सीधे फोन करें: 8303806214</span>
          </a>

          <button
            onClick={onOpenProviderReg}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-semibold text-sm active:scale-98 transition-all cursor-pointer"
          >
            <span>👷 कारीगर पार्टनर बनें</span>
          </button>
        </div>

        {/* Anti-Fake Reviews / Transparency badges */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 max-w-4xl mx-auto pt-4 border-t border-amber-200/50">
          <div className="bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-amber-200/70 text-left flex items-start gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-900">100% सत्यापित कारीगर</p>
              <p className="text-[11px] text-slate-500">पहचान व कार्य की भौतिक जांच</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-amber-200/70 text-left flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-900">कोई फर्जी रिव्यू नहीं</p>
              <p className="text-[11px] text-slate-500">पारदर्शी व प्रामाणिक नीति</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-amber-200/70 text-left flex items-start gap-2">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-900">₹149 से शुरुआत</p>
              <p className="text-[11px] text-slate-500">उचित दरें, कोई छुपा शुल्क नहीं</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-amber-200/70 text-left flex items-start gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-900">व्हाट्सएप बुकिंग</p>
              <p className="text-[11px] text-slate-500">सीधा मालिक से समन्वय</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
