import React from 'react';
import { Phone, MessageSquare, UserPlus } from 'lucide-react';
import { LUCKNOW_SEVA_WHATSAPP } from '../utils/whatsapp';

interface BottomMobileBarProps {
  onOpenBooking: () => void;
  onOpenProviderReg: () => void;
}

export const BottomMobileBar: React.FC<BottomMobileBarProps> = ({
  onOpenBooking,
  onOpenProviderReg
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/95 backdrop-blur-md border-t border-amber-300 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] px-3 py-2">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        {/* Direct Call on Android */}
        <a
          href={`tel:${LUCKNOW_SEVA_WHATSAPP}`}
          className="flex-1 h-12 rounded-xl bg-amber-50 active:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs flex flex-col items-center justify-center transition-all"
          aria-label="Call LucknowSeva"
        >
          <Phone className="w-4 h-4 text-amber-700" />
          <span className="text-[10px] mt-0.5">तुरंत कॉल</span>
        </a>

        {/* Primary Booking Trigger */}
        <button
          onClick={onOpenBooking}
          className="flex-[2.2] h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30 active:scale-98 transition-all cursor-pointer"
          aria-label="Book on WhatsApp"
        >
          <MessageSquare className="w-4 h-4 fill-white/20" />
          <span>व्हाट्सएप बुकिंग</span>
        </button>

        {/* Provider Join Form */}
        <button
          onClick={onOpenProviderReg}
          className="flex-1 h-12 rounded-xl bg-slate-100 active:bg-slate-200 text-slate-800 font-semibold text-xs flex flex-col items-center justify-center transition-all cursor-pointer"
          aria-label="Provider Register"
        >
          <UserPlus className="w-4 h-4 text-slate-600" />
          <span className="text-[10px] mt-0.5">कारीगर जुड़ें</span>
        </button>
      </div>
    </div>
  );
};
