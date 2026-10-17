import React, { useState } from 'react';
import { Phone, MessageSquare, ShieldCheck, UserPlus, HelpCircle, Menu, X, Sparkles, MapPin } from 'lucide-react';
import { LUCKNOW_SEVA_DISPLAY_PHONE, LUCKNOW_SEVA_WHATSAPP } from '../utils/whatsapp';

interface HeaderProps {
  onOpenBooking: () => void;
  onOpenProviderReg: () => void;
  onOpenHostingGuide: () => void;
  onOpenOwnerModal: () => void;
  onOpenAIAssistant: () => void;
  onScrollToSection: (sectionId: string) => void;
  activeBookingsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBooking,
  onOpenProviderReg,
  onOpenHostingGuide,
  onOpenOwnerModal,
  onOpenAIAssistant,
  onScrollToSection,
  activeBookingsCount = 0
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/60 shadow-xs">
      {/* Top Banner with Lucknow Heritage motif */}
      <div className="bg-linear-to-r from-amber-700 via-amber-600 to-amber-700 text-amber-50 px-3 py-1.5 text-xs text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse shrink-0" />
        <span>तहज़ीब और भरोसे का प्रतीक — <strong>लखनऊ सेवा</strong> • 100% सत्यापित कारीगर, कोई फर्जी रिव्यू नहीं!</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <a 
          href="#" 
          className="flex items-center gap-3 group"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-600/20 ring-2 ring-amber-400/30">
            <span className="font-heading font-bold text-2xl tracking-tighter">ल</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                Lucknow<span className="text-amber-600">Seva</span>
              </span>
              <span className="inline-flex items-center gap-0.5 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                सत्यापित
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 -mt-0.5">
              <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
              <span>लखनऊ, उत्तर प्रदेश</span>
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
          <button 
            onClick={() => onScrollToSection('services-section')}
            className="hover:text-amber-600 transition-colors cursor-pointer py-1"
          >
            सभी 8 सेवाएं
          </button>
          <button 
            onClick={() => onScrollToSection('verified-providers-section')}
            className="hover:text-amber-600 transition-colors cursor-pointer py-1 flex items-center gap-1"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            सत्यापित कारीगर
          </button>
          <button 
            onClick={() => onScrollToSection('areas-section')}
            className="hover:text-amber-600 transition-colors cursor-pointer py-1"
          >
            लखनऊ के इलाके
          </button>
          <button 
            onClick={onOpenProviderReg}
            className="hover:text-amber-600 transition-colors cursor-pointer py-1 flex items-center gap-1 text-amber-800 font-semibold"
          >
            <UserPlus className="w-4 h-4 text-amber-600" />
            कारीगर जुड़ें
          </button>
          <button 
            onClick={onOpenHostingGuide}
            className="hover:text-amber-600 transition-colors cursor-pointer py-1 flex items-center gap-1 text-slate-600"
            title="फ्री में वेबसाइट लाइव करने का तरीका"
          >
            <HelpCircle className="w-4 h-4 text-blue-600" />
            फ्री होस्टिंग गाइड
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* AI Assistant / Booking Manager Trigger */}
          <button
            onClick={onOpenAIAssistant}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-400 bg-amber-500/10 hover:bg-amber-500/20 text-amber-950 text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
            title="AI सहायक व बुकिंग प्रबंधक खोलें"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span>🤖 AI सहायक</span>
            {activeBookingsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-600 text-white text-[10px] font-mono">
                {activeBookingsCount}
              </span>
            )}
          </button>

          {/* Direct Call Button */}
          <a
            href={`tel:${LUCKNOW_SEVA_WHATSAPP}`}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-amber-300 bg-amber-50/80 hover:bg-amber-100/90 text-amber-900 text-sm font-semibold transition-all active:scale-95"
            title="तुरंत कॉल करें"
          >
            <Phone className="w-4 h-4 text-amber-700 fill-amber-700/20" />
            <span>{LUCKNOW_SEVA_DISPLAY_PHONE}</span>
          </a>

          {/* Book on WhatsApp CTA */}
          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 fill-white/20" />
            <span>सेवा बुक करें</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-xs active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>बुक करें</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 hover:bg-amber-100/60 active:bg-amber-100"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-amber-200 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
            <a
              href={`tel:${LUCKNOW_SEVA_WHATSAPP}`}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs"
            >
              <Phone className="w-4 h-4 text-amber-700" />
              <span>कॉल: 8303806214</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>व्हाट्सएप बुकिंग</span>
            </button>
          </div>

          <div className="space-y-1 text-sm font-medium text-slate-700">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onScrollToSection('services-section');
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-amber-50 flex items-center justify-between"
            >
              <span>उपलब्ध सेवाएं (इलेक्ट्रीशियन, प्लंबर, एसी...)</span>
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">8 सेवाएं</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onScrollToSection('verified-providers-section');
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-amber-50 flex items-center gap-2 text-emerald-800 font-semibold"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>सत्यापित कारीगर सूची (No Fake Reviews)</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onScrollToSection('areas-section');
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-amber-50 flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>लखनऊ के 20+ इलाके</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenProviderReg();
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-amber-50 flex items-center gap-2 text-amber-900 font-semibold"
            >
              <UserPlus className="w-4 h-4 text-amber-600" />
              <span>कारीगर / पार्टनर पंजीकरण (Join Us)</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenHostingGuide();
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-amber-50 flex items-center gap-2 text-blue-700"
            >
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>वेबसाइट फ्री में कैसे लाइव करें? (गाइड)</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAIAssistant();
              }}
              className="w-full text-left py-2.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 flex items-center justify-between text-amber-950 font-bold border border-amber-300 mt-2"
            >
              <div className="flex items-center gap-2">
                <span>🤖 LucknowSeva AI Assistant</span>
              </div>
              <span className="text-xs bg-amber-600 text-white px-2 py-0.5 rounded-full font-mono">
                {activeBookingsCount} बुकिंग्स
              </span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOwnerModal();
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-100 flex items-center gap-2 text-slate-500 text-xs mt-1 pt-2 border-t border-slate-100"
            >
              <span>⚙️ संचालक / एडमिन पैनल (कारीगर प्रबंधन)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
