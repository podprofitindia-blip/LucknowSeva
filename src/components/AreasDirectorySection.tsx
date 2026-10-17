import React from 'react';
import { MapPin, Navigation, ArrowUpRight, Compass } from 'lucide-react';
import { LUCKNOW_AREAS, LucknowArea } from '../data/lucknowAreas';

interface AreasDirectorySectionProps {
  selectedArea: string;
  onSelectArea: (areaName: string) => void;
}

export const AreasDirectorySection: React.FC<AreasDirectorySectionProps> = ({
  selectedArea,
  onSelectArea
}) => {
  // Group areas by zone
  const zones = Array.from(new Set(LUCKNOW_AREAS.map((a) => a.zone)));

  return (
    <section id="areas-section" className="py-12 bg-white border-t border-amber-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
            <Compass className="w-4 h-4 text-amber-600" />
            <span>विस्तृत कवरेज नेटवर्क</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            लखनऊ के सभी प्रमुख क्षेत्रों में उपलब्ध
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            अपने मोहल्ले या इलाके पर क्लिक करें और देखें कि आपके निकट कौन-कौन सी सेवाएं और कारीगर सक्रिय हैं।
          </p>
        </div>

        {/* Zones and Areas */}
        <div className="space-y-8">
          {zones.map((zone) => {
            const zoneAreas = LUCKNOW_AREAS.filter((a) => a.zone === zone);
            return (
              <div key={zone} className="bg-amber-50/30 rounded-2xl p-4 sm:p-6 border border-amber-200/60">
                <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-amber-200/50">
                  <Navigation className="w-4 h-4 text-amber-700" />
                  <h3 className="text-sm sm:text-base font-bold text-amber-950 font-heading">
                    {zone} ({zoneAreas.length} मुख्य क्षेत्र)
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                  {zoneAreas.map((area: LucknowArea) => {
                    const isSelected = selectedArea === area.nameHi;
                    return (
                      <button
                        key={area.id}
                        onClick={() => onSelectArea(area.nameHi)}
                        className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between group ${
                          isSelected
                            ? 'bg-amber-600 text-white border-amber-600 shadow-md scale-102 font-bold'
                            : 'bg-white hover:bg-amber-100/60 border-amber-200/80 text-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-bold text-xs sm:text-sm">{area.nameHi}</span>
                          <ArrowUpRight className={`w-3.5 h-3.5 shrink-0 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform ${isSelected ? 'text-white' : 'text-amber-700'}`} />
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[10px]">
                          <span className={isSelected ? 'text-amber-100' : 'text-slate-500'}>
                            {area.nameEn}
                          </span>
                          {area.popularPincode && (
                            <span className={`font-mono ${isSelected ? 'text-amber-200' : 'text-slate-400'}`}>
                              {area.popularPincode}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
