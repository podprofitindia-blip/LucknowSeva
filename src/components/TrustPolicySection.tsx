import React from 'react';
import { ShieldCheck, EyeOff, UserCheck, MessageSquare, BadgePercent, CheckCircle2 } from 'lucide-react';

export const TrustPolicySection: React.FC = () => {
  return (
    <section className="py-12 bg-linear-to-b from-slate-900 via-slate-850 to-slate-900 text-white relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>लखनऊ सेवा सत्यनिष्ठा व नीति</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
            हम कभी फर्जी रेटिंग या नकली रिव्यू क्यों नहीं दिखाते?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            इंटरनेट पर कई ऐप्स 5-स्टार की फर्जी रेटिंग दिखाकर ग्राहकों को धोखा देते हैं। लखनऊ सेवा का सिद्धांत अलग है — 100% स्थानीय सच्चाई और सीधी जवाबदेही।
          </p>
        </div>

        {/* 4 Pillars of LucknowSeva Policy */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
                <EyeOff className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">शून्य फर्जी रिव्यू नीति</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                हम बॉट या पैसे देकर खरीदे गए 5.0 रिव्यू कभी नहीं लगाते। जो काम हुआ है, उसकी गुणवत्ता ही हमारी पहचान है।
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center gap-1.5 text-xs text-rose-300 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>100% ईमानदारी की गारंटी</span>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">मालिक द्वारा भौतिक सत्यापन</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                हर इलेक्ट्रीशियन, प्लंबर और शिक्षक के आधार कार्ड, स्थायी पते और कार्य अनुभव की व्यक्तिगत जांच की जाती है।
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center gap-1.5 text-xs text-amber-300 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>सुरक्षित पारिवारिक सेवा</span>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">सीधी व्हाट्सएप बातचीत</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                किसी अनजान कॉल सेंटर से बात करने के बजाय सीधे लखनऊ सेवा के मुख्य समन्वयक से 918303806214 पर व्हाट्सएप पर बात करें।
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center gap-1.5 text-xs text-emerald-300 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>त्वरित प्रतिक्रिया (Fast Response)</span>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <BadgePercent className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">पारदर्शी व उचित दरें</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                विजिटिंग चार्ज ₹149 से शुरू। काम से पहले एस्टीमेट और वास्तविक बिलिंग — कोई गुप्त शुल्क या मनमाना बिल नहीं।
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center gap-1.5 text-xs text-blue-300 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>किफायती एवं वाजिब दाम</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
