import React from 'react';
import { 
  Zap, 
  Wrench, 
  Wind, 
  Sparkles, 
  Hammer, 
  Paintbrush, 
  Cpu, 
  GraduationCap, 
  ArrowRight, 
  MessageSquare, 
  Check, 
  MapPin,
  Clock
} from 'lucide-react';
import { ServiceItem } from '../data/servicesData';

interface ServiceCardProps {
  service: ServiceItem;
  selectedArea: string;
  onBook: (service: ServiceItem) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-6 h-6 text-amber-600" />,
  Wrench: <Wrench className="w-6 h-6 text-cyan-600" />,
  Wind: <Wind className="w-6 h-6 text-sky-600" />,
  Sparkles: <Sparkles className="w-6 h-6 text-violet-600" />,
  Hammer: <Hammer className="w-6 h-6 text-amber-700" />,
  Paintbrush: <Paintbrush className="w-6 h-6 text-rose-600" />,
  Cpu: <Cpu className="w-6 h-6 text-indigo-600" />,
  GraduationCap: <GraduationCap className="w-6 h-6 text-emerald-600" />
};

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, selectedArea, onBook }) => {
  return (
    <div className="group relative bg-white rounded-2xl border border-amber-200/80 shadow-md hover:shadow-xl hover:border-amber-400 transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Top Banner & Badge */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            {ICON_MAP[service.iconName] || <Wrench className="w-6 h-6 text-amber-600" />}
          </div>
          
          <div className="text-right">
            {service.badge && (
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                {service.badge}
              </span>
            )}
            <div className="mt-1">
              <span className="text-xs text-slate-500 font-medium">शुरुआती दर:</span>
              <p className="text-lg font-extrabold text-amber-800 leading-none">{service.startingPrice}</p>
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-3.5 text-lg sm:text-xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
          {service.nameHi}
        </h3>
        
        <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {service.shortDesc}
        </p>

        {/* Selected Area Availability Indicator */}
        <div className="mt-3 py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-600 flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{selectedArea ? `${selectedArea} में उपलब्ध` : 'पूरे लखनऊ में उपलब्ध'}</span>
          </span>
          <span className="text-emerald-700 font-bold flex items-center gap-0.5">
            <Clock className="w-3 h-3 text-emerald-600" />
            30-45 मि.
          </span>
        </div>

        {/* Key Tasks List */}
        <div className="mt-3.5 space-y-1.5">
          <p className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">मुख्य कार्य:</p>
          <ul className="space-y-1 text-xs text-slate-700">
            {service.popularTasks.slice(0, 3).map((task, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{task}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-4 bg-amber-50/40 border-t border-amber-100 flex items-center gap-2">
        <button
          onClick={() => onBook(service)}
          className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 fill-white/20" />
          <span>व्हाट्सएप पर बुक करें</span>
        </button>

        <button
          onClick={() => onBook(service)}
          className="p-2.5 rounded-xl border border-amber-300 bg-white hover:bg-amber-100 text-amber-800 transition-colors"
          title="विवरण देखें और बुक करें"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
