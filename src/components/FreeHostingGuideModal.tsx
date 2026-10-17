import React, { useState } from 'react';
import { X, Globe, CheckCircle, ExternalLink, Terminal, Shield, Zap, Sparkles, Copy, Check } from 'lucide-react';

interface FreeHostingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FreeHostingGuideModal: React.FC<FreeHostingGuideModalProps> = ({ isOpen, onClose }) => {
  const [activePlatform, setActivePlatform] = useState<'vercel' | 'netlify' | 'github' | 'tools'>('vercel');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-blue-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Header */}
        <div className="bg-linear-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-white">
                वेबसाइट को फ्री में कैसे लाइव करें? (Free Hosting Guide)
              </h3>
              <p className="text-xs text-blue-100 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>₹0 खर्च • बिना किसी पेड टूल के 2 मिनट में अपनी वेबसाइट इंटरनेट पर चलाएं</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-1 overflow-x-auto text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActivePlatform('vercel')}
            className={`py-2 px-3 border-b-2 rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activePlatform === 'vercel'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>1. Vercel (सबसे आसान - 2 मिनट)</span>
          </button>

          <button
            onClick={() => setActivePlatform('netlify')}
            className={`py-2 px-3 border-b-2 rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activePlatform === 'netlify'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>2. Netlify (ड्रैग एंड ड्रॉप)</span>
          </button>

          <button
            onClick={() => setActivePlatform('github')}
            className={`py-2 px-3 border-b-2 rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activePlatform === 'github'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>3. GitHub Pages</span>
          </button>

          <button
            onClick={() => setActivePlatform('tools')}
            className={`py-2 px-3 border-b-2 rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activePlatform === 'tools'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% फ्री टूल्स नीति</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700">
          {activePlatform === 'vercel' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                <h4 className="font-bold text-blue-900 text-sm flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  अनुशंसित तरीका: Vercel पर 100% मुफ्त लाइव करें
                </h4>
                <p className="mt-1 text-blue-800 text-xs">
                  Vercel दुनिया का सबसे तेज और पूर्णतः निशुल्क होस्टिंग प्लेटफॉर्म है। यह हमेशा के लिए फ्री है (Free SSL, Unlimited Bandwidth for personal projects)।
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">1</span>
                  <div>
                    <p className="font-bold text-slate-900">GitHub पर कोड अपलोड करें:</p>
                    <p className="text-slate-600 text-xs mt-0.5">
                      अपने कंप्यूटर पर टर्मिनल में यह कमांड चलाएं या GitHub.com पर नई रिपोजिटरी बनाकर कोड पुश करें:
                    </p>
                    <div className="mt-1.5 p-2.5 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs flex items-center justify-between">
                      <code>git add . && git commit -m "LucknowSeva live" && git push</code>
                      <button
                        onClick={() => handleCopy('git add . && git commit -m "LucknowSeva live" && git push', 'cmd1')}
                        className="text-slate-400 hover:text-white p-1"
                      >
                        {copiedCode === 'cmd1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">2</span>
                  <div>
                    <p className="font-bold text-slate-900">Vercel.com पर जाएं:</p>
                    <p className="text-slate-600 text-xs mt-0.5">
                      <a href="https://vercel.com/signup" target="_blank" rel="noreferrer" className="text-blue-600 font-bold underline inline-flex items-center gap-0.5">
                        vercel.com <ExternalLink className="w-3 h-3" />
                      </a> पर जाएं और <strong>"Continue with GitHub"</strong> से फ्री अकाउंट बनाएं।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">3</span>
                  <div>
                    <p className="font-bold text-slate-900">"Add New Project" पर क्लिक करें:</p>
                    <p className="text-slate-600 text-xs mt-0.5">
                      अपनी <strong>LucknowSeva</strong> रिपॉजिटरी चुनें और <strong>"Import"</strong> पर क्लिक करें।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">4</span>
                  <div>
                    <p className="font-bold text-slate-900">"Deploy" दबाएं:</p>
                    <p className="text-slate-600 text-xs mt-0.5">
                      Vercel अपने-आप Vite को डिटेक्ट कर लेगा। किसी भी सेटिंग को बदलने की जरूरत नहीं है। 30 सेकंड में आपकी साइट <code>https://lucknowseva.vercel.app</code> पर लाइव हो जाएगी!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">5</span>
                  <div>
                    <p className="font-bold text-slate-900">कस्टम डोमेन (वैकल्पिक):</p>
                    <p className="text-slate-600 text-xs mt-0.5">
                      यदि आप <code>lucknowseva.in</code> या <code>.com</code> लगाना चाहते हैं, तो Vercel Settings &gt; Domains में जाकर 1 क्लिक में मुफ्त SSL के साथ जोड़ सकते हैं।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePlatform === 'netlify' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200">
                <h4 className="font-bold text-teal-900 text-sm">
                  Netlify Drag & Drop (बिना किसी कोडिंग या GitHub के)
                </h4>
                <p className="mt-1 text-teal-800 text-xs">
                  यदि आप GitHub का उपयोग नहीं करना चाहते, तो आप सीधे फोल्डर ड्रैग करके भी 1 मिनट में साइट लाइव कर सकते हैं।
                </p>
              </div>

              <ol className="space-y-3 list-decimal list-inside">
                <li>
                  अपने कंप्यूटर टर्मिनल में प्रोजेक्ट का बिल्ड बनाएं:
                  <div className="mt-1 p-2 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs flex items-center justify-between">
                    <code>npm run build</code>
                    <button
                      onClick={() => handleCopy('npm run build', 'cmd2')}
                      className="text-slate-400 hover:text-white p-1"
                    >
                      {copiedCode === 'cmd2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <span className="text-slate-500 text-xs block mt-1">
                    इससे आपके प्रोजेक्ट में <code>dist/</code> नाम का फोल्डर तैयार हो जाएगा।
                  </span>
                </li>
                <li>
                  <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="text-teal-700 underline font-bold inline-flex items-center gap-1">
                    app.netlify.com/drop <ExternalLink className="w-3 h-3" />
                  </a> पर जाएं।
                </li>
                <li>
                  अपने कंप्यूटर से <code>dist</code> फोल्डर को खींचकर (Drag & Drop) नेटलिफाई के बॉक्स में छोड़ दें।
                </li>
                <li>
                  आपकी वेबसाइट तुरंत लाइव हो जाएगी और आपको मुफ्त <code>.netlify.app</code> लिंक मिल जाएगा!
                </li>
              </ol>
            </div>
          )}

          {activePlatform === 'github' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-300">
                <h4 className="font-bold text-slate-900 text-sm">
                  GitHub Pages (100% Free)
                </h4>
                <p className="mt-1 text-slate-600 text-xs">
                  गिटहब द्वारा प्रदान की जाने वाली आजीवन मुफ्त होस्टिंग।
                </p>
              </div>
              <ul className="space-y-2 text-xs">
                <li>1. अपने GitHub रिपॉजिटरी की <strong>Settings &gt; Pages</strong> में जाएं।</li>
                <li>2. Source में <strong>"GitHub Actions"</strong> चुनें।</li>
                <li>3. "Vite" टेम्पलेट चुनें और Deploy पर क्लिक करें।</li>
                <li>4. आपकी साइट <code>username.github.io/lucknowseva</code> पर एक्टिव हो जाएगी।</li>
              </ul>
            </div>
          )}

          {activePlatform === 'tools' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  इस प्रोजेक्ट में प्रयुक्त सभी टूल्स 100% मुफ्त हैं
                </h4>
                <p className="mt-1 text-emerald-800 text-xs">
                  आपको किसी भी पेड सॉफ्टवेयर, पेड एपीआई या डेटाबेस सब्सक्रिप्शन की आवश्यकता नहीं है:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <strong>💬 WhatsApp API (wa.me):</strong>
                  <p className="text-slate-500 mt-0.5">बिना किसी शुल्क या एसएमएस गेटवे के डायरेक्ट 918303806214 पर बुकिंग प्राप्त करें।</p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <strong>💾 LocalStorage डाटा:</strong>
                  <p className="text-slate-500 mt-0.5">मालिक द्वारा जोड़े गए सत्यापित कारीगर बिना किसी महंगे क्लाउड डेटाबेस के सुरक्षित रहते हैं।</p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <strong>🔐 जीरो पासवर्ड/की लीकेज:</strong>
                  <p className="text-slate-500 mt-0.5">क्लाइंट साइड कोई सीक्रेट की एक्सपोज नहीं की गई है। कोड 100% सुरक्षित है।</p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <strong>📱 Android मोबाइल रेडी:</strong>
                  <p className="text-slate-500 mt-0.5">हर फोन पर बिना किसी ऐप डाउनलोड के ब्राउज़र में तुरंत खुलता है।</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            मदद चाहिए? कॉल करें: <strong>+91 83038 06214</strong>
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold cursor-pointer"
          >
            समझ गया (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
