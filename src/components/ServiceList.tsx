import React, { useState } from 'react';
import { ServiceItem, SERVICES_DATA } from '../data/servicesData';
import { ServiceCard } from './ServiceCard';
import { Search, Sparkles, Filter, RefreshCw } from 'lucide-react';

interface ServiceListProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  onBookService: (service: ServiceItem) => void;
}

export const ServiceList: React.FC<ServiceListProps> = ({
  searchQuery,
  setSearchQuery,
  selectedArea,
  setSelectedArea,
  onBookService
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'सभी 8 सेवाएं' },
    { id: 'electrician', label: '⚡ इलेक्ट्रीशियन' },
    { id: 'plumber', label: '🔧 प्लंबर' },
    { id: 'ac-repair', label: '❄️ एसी रिपेयर' },
    { id: 'cleaning', label: '✨ सफाई' },
    { id: 'carpenter', label: '🪚 बढ़ई' },
    { id: 'painter', label: '🎨 पेंटर' },
    { id: 'appliance-repair', label: '🔌 उपकरण मरम्मत' },
    { id: 'home-tutor', label: '📚 होम ट्यूटर' }
  ];

  // Filtering logic
  const filteredServices = SERVICES_DATA.filter((service) => {
    // Category filter
    if (activeCategory !== 'all' && service.id !== activeCategory) {
      return false;
    }

    // Search query filter (search both Hindi and English terms)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNameHi = service.nameHi.toLowerCase().includes(q);
      const matchNameEn = service.nameEn.toLowerCase().includes(q);
      const matchShortDesc = service.shortDesc.toLowerCase().includes(q);
      const matchTasks = service.popularTasks.some((t) => t.toLowerCase().includes(q));
      if (!matchNameHi && !matchNameEn && !matchShortDesc && !matchTasks) {
        return false;
      }
    }

    return true;
  });

  return (
    <section id="services-section" className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>लखनऊ के लिए समर्पित सेवाएं</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            हमारी 8 प्रमुख स्थानीय सेवाएं
          </h2>
          <p className="mt-1 text-sm sm:text-base text-slate-600">
            {selectedArea ? (
              <span>
                <strong className="text-amber-800 font-bold">{selectedArea}</strong> में उपलब्ध सभी सत्यापित सेवाएं
              </span>
            ) : (
              'लखनऊ के सभी इलाकों में उपलब्ध उचित और पारदर्शी दरों पर सेवाएं'
            )}
          </p>
        </div>

        {/* Clear Filters indicator if active */}
        {(searchQuery || selectedArea || activeCategory !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedArea('');
              setActiveCategory('all');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-100/70 hover:bg-amber-100 rounded-lg self-start md:self-auto cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>फ़िल्टर रीसेट करें</span>
          </button>
        )}
      </div>

      {/* Category Pills Slider / Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none text-xs sm:text-sm font-semibold">
        <span className="text-slate-400 flex items-center gap-1 shrink-0 px-1">
          <Filter className="w-3.5 h-3.5" />
          <span>श्रेणी:</span>
        </span>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20 font-bold scale-102'
                : 'bg-white hover:bg-amber-50 text-slate-700 border border-amber-200/60'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              selectedArea={selectedArea}
              onBook={onBookService}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-4 bg-white rounded-2xl border-2 border-dashed border-amber-300 max-w-lg mx-auto">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-700 mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">कोई सेवा नहीं मिली</h3>
          <p className="text-xs text-slate-500 mt-1">
            "{searchQuery}" के लिए कोई परिणाम नहीं मिला। कृपया दूसरा शब्द खोजें या सभी सेवाएं देखें।
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 cursor-pointer"
          >
            सभी सेवाएं देखें
          </button>
        </div>
      )}
    </section>
  );
};
