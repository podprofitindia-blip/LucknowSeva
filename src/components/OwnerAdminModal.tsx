import React, { useState } from 'react';
import { X, Plus, ShieldCheck, Trash2, CheckCircle2, RotateCcw } from 'lucide-react';
import { VerifiedProvider, saveVerifiedProviders, resetToDefaultProviders } from '../data/initialProviders';
import { SERVICES_DATA } from '../data/servicesData';

interface OwnerAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  providers: VerifiedProvider[];
  onUpdateProviders: (updated: VerifiedProvider[]) => void;
}

export const OwnerAdminModal: React.FC<OwnerAdminModalProps> = ({
  isOpen,
  onClose,
  providers,
  onUpdateProviders
}) => {
  const [activeTab, setActiveTab] = useState<'add' | 'list'>('add');
  const [name, setName] = useState('');
  const [serviceId, setServiceId] = useState('electrician');
  const [experience, setExperience] = useState('5');
  const [areas, setAreas] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [policeStatus, setPoliceStatus] = useState<'सत्यापित (Police Verified)' | 'आधार व निवास सत्यापित'>('आधार व निवास सत्यापित');
  const [notes, setNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleAddProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !areas.trim()) return;

    const matchedService = SERVICES_DATA.find((s) => s.id === serviceId);
    const serviceName = matchedService ? matchedService.nameHi : 'अन्य सेवा';

    const newProvider: VerifiedProvider = {
      id: `prov-${Date.now()}`,
      verificationCode: `LK-${serviceId.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim(),
      serviceId,
      serviceNameHi: serviceName,
      experienceYears: Number(experience) || 5,
      coveredAreas: areas.split(',').map((a) => a.trim()).filter(Boolean),
      verificationDate: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      verifiedBy: 'लखनऊ सेवा एडमिन (व्यक्तिगत जांच)',
      policeVerificationStatus: policeStatus,
      specialization: specialization.trim() || 'अनुभवी व कुशल सेवा प्रदाता',
      isActive: true,
      notes: notes.trim()
    };

    const updated = [newProvider, ...providers];
    onUpdateProviders(updated);
    saveVerifiedProviders(updated);

    // Reset fields
    setName('');
    setAreas('');
    setSpecialization('');
    setNotes('');
    setSuccessMsg(`कारीगर "${newProvider.name}" को सफलतापूर्वक अधिकृत सूची में जोड़ दिया गया है!`);
    setTimeout(() => setSuccessMsg(''), 4000);
    setActiveTab('list');
  };

  const handleDelete = (id: string) => {
    const updated = providers.filter((p) => p.id !== id);
    onUpdateProviders(updated);
    saveVerifiedProviders(updated);
  };

  const handleReset = () => {
    if (window.confirm('क्या आप सत्यापित सूची को डिफ़ॉल्ट पर रीसेट करना चाहते हैं?')) {
      const def = resetToDefaultProviders();
      onUpdateProviders(def);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-amber-300 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                मालिक / एडमिन पैनल (सत्यापित कारीगर प्रबंधन)
              </h3>
              <p className="text-xs text-slate-400">
                केवल वास्तविक, भौतिक रूप से सत्यापित कारीगरों को सूची में जोड़ें
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('add')}
            className={`py-2 px-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'add'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            + नया कारीगर जोड़ें
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`py-2 px-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'list'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            मौजूदा सत्यापित कारीगर ({providers.length})
          </button>
        </div>

        <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === 'add' ? (
            <form onSubmit={handleAddProvider} className="space-y-3.5 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 leading-relaxed">
                📌 <strong>मालिक नियम:</strong> यहाँ जोड़ा गया कारीगर तुरंत मुख्य वेबसाइट पर दिखने लगेगा। ग्राहक सीधे व्हाट्सएप पर इन्हें बुक कर सकेंगे। किसी भी फर्जी प्रोफाइल की अनुमति नहीं है।
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">कारीगर का नाम *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="उदा. रमेश कुमार"
                    className="w-full h-11 px-3 rounded-xl border border-slate-300 text-sm text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">सेवा (ट्रेड) *</label>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-slate-300 text-sm bg-white text-slate-900"
                  >
                    {SERVICES_DATA.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nameHi}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">अनुभव (वर्ष)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-slate-300 text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">सत्यापन स्थिति</label>
                  <select
                    value={policeStatus}
                    onChange={(e) => setPoliceStatus(e.target.value as any)}
                    className="w-full h-11 px-3 rounded-xl border border-slate-300 text-sm bg-white text-slate-900"
                  >
                    <option value="सत्यापित (Police Verified)">सत्यापित (Police Verified)</option>
                    <option value="आधार व निवास सत्यापित">आधार व निवास सत्यापित</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  कार्यक्षेत्र / लखनऊ के इलाके (कॉमा लगाकर लिखें) *
                </label>
                <input
                  type="text"
                  value={areas}
                  onChange={(e) => setAreas(e.target.value)}
                  placeholder="उदा. गोमती नगर, हज़रतगंज, अलीगंज"
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 text-sm text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">विशेषज्ञता</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="उदा. इन्वर्टर, मोटर वायरिंग, लीकेज का पक्का काम"
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">मालिक की टिप्पणी / विशेष नोट</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="उदा. समय के पाबंद, 5 साल से हमारे साथ कार्यरत"
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 text-sm text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>सत्यापित सूची में जोड़ें</span>
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-600">कुल कारीगर: {providers.length}</span>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-rose-600 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>डिफ़ॉल्ट पर रीसेट करें</span>
                </button>
              </div>

              {providers.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 text-sm">{p.name}</strong>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-mono">
                        {p.verificationCode}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5">
                      {p.serviceNameHi} • {p.experienceYears} वर्ष अनुभव
                    </p>
                    <p className="text-[11px] text-slate-500">
                      क्षेत्र: {p.coveredAreas.join(', ')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                    title="हटाएं"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
