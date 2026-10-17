import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  ShieldCheck, 
  Clock, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  FileText, 
  Database, 
  Copy, 
  Check, 
  UserCheck, 
  Filter, 
  TrendingUp, 
  RefreshCw,
  Search,
  MessageSquare
} from 'lucide-react';
import { Booking, updateBookingStatus, BookingsSource, FirestoreErrorInfo } from '../services/bookingService';
import { VerifiedProvider } from '../data/initialProviders';
import firebaseConfig from '../../firebase-applet-config.json';
import { openWhatsAppUrl } from '../utils/whatsapp';
import { useAuth } from '../contexts/AuthContext';
import { ADMIN_EMAIL } from '../lib/firebase';
import { LogIn, LogOut, Lock, ExternalLink } from 'lucide-react';

interface AIAssistantManagerProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  bookingsSource: BookingsSource;
  firestoreError: FirestoreErrorInfo | null;
  providers: VerifiedProvider[];
  onRefreshBookings?: () => void;
}

export const AIAssistantManager: React.FC<AIAssistantManagerProps> = ({
  isOpen,
  onClose,
  bookings,
  bookingsSource,
  firestoreError,
  providers,
  onRefreshBookings
}) => {
  const { currentUser, isAdmin, isLoading: authLoading, authError, loginWithGoogle, logout, clearAuthError } = useAuth();
  const [activeTab, setActiveTab] = useState<'bookings' | 'reports' | 'database'>('bookings');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedConfig, setCopiedConfig] = useState(false);

  // Message Confirmation Gate State (Requirement 6: ग्राहक या मिस्त्री को संदेश भेजने से पहले मेरी पुष्टि लें)
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    recipientName: string;
    recipientRole: 'मिस्त्री (Technician)' | 'ग्राहक (Customer)';
    recipientPhone: string;
    messageDraft: string;
    booking: Booking;
    actionType: 'dispatch_provider' | 'notify_customer';
    assignedProvider?: VerifiedProvider;
  } | null>(null);

  if (!isOpen) return null;

  // Filter bookings based on status and search query
  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = b.customerName.toLowerCase().includes(q);
      const matchPhone = b.phone.includes(q);
      const matchArea = b.area.toLowerCase().includes(q);
      const matchId = b.bookingId.toLowerCase().includes(q);
      const matchService = b.service.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchArea && !matchId && !matchService) return false;
    }
    return true;
  });

  // Calculate Real Reports Metrics (Requirement 5: वास्तविक बुकिंग ही रिपोर्ट में दिखाई दे)
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const assignedCount = bookings.filter((b) => b.status === 'assigned').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;

  // Breakdown by Service
  const serviceStats: Record<string, number> = {};
  bookings.forEach((b) => {
    serviceStats[b.service] = (serviceStats[b.service] || 0) + 1;
  });

  // Breakdown by Area
  const areaStats: Record<string, number> = {};
  bookings.forEach((b) => {
    areaStats[b.area] = (areaStats[b.area] || 0) + 1;
  });

  // Handle Dispatch to Provider (Prepares Draft and opens Confirmation Gate)
  const handleInitiateDispatch = (booking: Booking) => {
    // Find matching verified providers for this service category
    const matchingProviders = providers.filter((p) => p.isActive && (
      p.serviceNameHi.toLowerCase().includes(booking.service.toLowerCase()) ||
      booking.service.toLowerCase().includes(p.serviceNameHi.toLowerCase())
    ));

    const selectedProvider = matchingProviders[0] || providers.find(p => p.isActive) || null;
    const providerName = selectedProvider ? selectedProvider.name : 'लखनऊ सेवा अधिकृत मिस्त्री';

    const draftMessage = `*नमस्ते ${providerName} जी (लखनऊ सेवा)*
नया कार्य असाइन किया गया है:
──────────────────────
📋 *बुकिंग आईडी:* ${booking.bookingId}
👤 *ग्राहक का नाम:* ${booking.customerName}
📱 *ग्राहक का फोन:* ${booking.phone}
📍 *इलाका:* ${booking.area} ${booking.landmark ? `(${booking.landmark})` : ''}
🔧 *सेवा:* ${booking.service}
📝 *समस्या:* ${booking.workDetails}
⏰ *समय:* ${booking.preferredTime || 'यथाशीघ्र'}
──────────────────────
_कृपया ग्राहक से संपर्क कर समय पर पहुंचे।_`;

    setConfirmationModal({
      isOpen: true,
      recipientName: providerName,
      recipientRole: 'मिस्त्री (Technician)',
      recipientPhone: '918303806214',
      messageDraft: draftMessage,
      booking,
      actionType: 'dispatch_provider',
      assignedProvider: selectedProvider || undefined
    });
  };

  // Handle Notify Customer (Prepares Draft and opens Confirmation Gate)
  const handleInitiateCustomerNotify = (booking: Booking) => {
    const draftMessage = `*नमस्ते ${booking.customerName} जी!*
लखनऊ सेवा में आपकी बुकिंग स्वीकार कर ली गई है।
──────────────────────
📋 *बुकिंग आईडी:* ${booking.bookingId}
🔧 *सेवा:* ${booking.service}
📍 *इलाका:* ${booking.area}
⏰ *समय:* ${booking.preferredTime || 'यथाशीघ्र'}
──────────────────────
हमारा सत्यापित कारीगर जल्द ही आपसे संपर्क करेगा। किसी भी प्रश्न हेतु कॉल करें: +91 83038 06214।`;

    setConfirmationModal({
      isOpen: true,
      recipientName: booking.customerName,
      recipientRole: 'ग्राहक (Customer)',
      recipientPhone: booking.phone.replace(/\D/g, ''),
      messageDraft: draftMessage,
      booking,
      actionType: 'notify_customer'
    });
  };

  // User Approval Action (Only executed when owner clicks "अनुमति दें")
  const handleConfirmAndSend = async () => {
    if (!confirmationModal) return;

    const { booking, actionType, assignedProvider, messageDraft, recipientPhone } = confirmationModal;

    // Update status in shared database
    if (actionType === 'dispatch_provider') {
      await updateBookingStatus(
        booking.bookingId,
        'assigned',
        'मिस्त्री को कार्य सौंपा गया',
        assignedProvider?.id,
        assignedProvider?.name
      );
    } else if (actionType === 'notify_customer') {
      await updateBookingStatus(
        booking.bookingId,
        'confirmed',
        'ग्राहक को पुष्टि भेजी गई'
      );
    }

    // Open WhatsApp with confirmed message
    const targetPhone = recipientPhone.startsWith('91') ? recipientPhone : `91${recipientPhone}`;
    const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(messageDraft)}`;
    openWhatsAppUrl(waUrl);

    setConfirmationModal(null);
    if (onRefreshBookings) onRefreshBookings();
  };

  const copyConfigDetails = () => {
    const text = JSON.stringify({
      projectId: firebaseConfig.projectId,
      firestoreDatabaseId: firebaseConfig.firestoreDatabaseId,
      collection: 'bookings',
      sharedNote: 'LucknowSeva Customer App & AI Assistant shared Firestore database'
    }, null, 2);

    navigator.clipboard.writeText(text);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-amber-300 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Top Header */}
        <div className="bg-linear-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-400 flex items-center justify-center shadow-inner">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white">
                  LucknowSeva AI Assistant
                </h3>
                {bookingsSource === 'firestore' ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    लाइव Firestore
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    स्थानीय बफ़र ({firestoreError ? 'क्लाउड पेंडिंग' : 'ऑफ़लाइन'})
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-200/80">
                बुकिंग प्रबंधक • {ADMIN_EMAIL} अधिकृत नियंत्रण
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Google Admin Login / Logout Button */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/15 text-xs text-white">
                <div className="text-right hidden sm:block">
                  <p className="font-bold text-[11px] leading-tight text-white">{currentUser.displayName || 'एडमिन'}</p>
                  <p className="text-[10px] text-amber-200 leading-tight">
                    {isAdmin ? '✓ अधिकृत एडमिन' : 'अनधिकृत खाता'}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 transition-colors cursor-pointer"
                  title="लॉगआउट करें"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                disabled={authLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all active:scale-95 shadow-md cursor-pointer"
                title="Google से एडमिन लॉगिन करें"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{authLoading ? 'लॉगिन...' : 'Google एडमिन लॉगिन'}</span>
              </button>
            )}

            {onRefreshBookings && (
              <button
                onClick={onRefreshBookings}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="रिफ्रेश करें"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-2.5 px-3.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bookings'
                ? 'border-amber-600 text-amber-800 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-600" />
            <span>वास्तविक बुकिंग्स ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`py-2.5 px-3.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reports'
                ? 'border-amber-600 text-amber-800 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>वास्तविक रिपोर्ट (Real Reports)</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`py-2.5 px-3.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'database'
                ? 'border-amber-600 text-amber-800 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4 text-blue-600" />
            <span>साझा डेटाबेस कॉन्फ़िग</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{authError}</span>
              </div>
              <button onClick={clearAuthError} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-4">
              {/* Transparent Firestore Status Notice (Requirement 5: Permission error को छिपाकर न दिखाएं) */}
              {firestoreError ? (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-950">
                        Firestore क्लाउड स्टेटस: <span className="font-mono text-rose-700">{firestoreError.code}</span>
                      </p>
                      <p className="text-amber-800 mt-0.5">
                        {firestoreError.code === 'permission-denied'
                          ? 'क्लाउड डेटाबेस से लाइव पढ़ने की अनुमति अस्वीकृत है। नीचे प्रदर्शित बुकिंग्स केवल स्थानीय बफ़र से हैं।'
                          : firestoreError.message}
                      </p>
                    </div>
                  </div>
                  {!currentUser ? (
                    <button
                      onClick={loginWithGoogle}
                      disabled={authLoading}
                      className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs whitespace-nowrap cursor-pointer shadow-xs active:scale-95"
                    >
                      {authLoading ? 'लॉगिन...' : 'Google एडमिन लॉगिन करें'}
                    </button>
                  ) : !isAdmin ? (
                    <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-lg">
                      खाता अनधिकृत ({currentUser.email})
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                      प्रमाणित एडमिन
                    </span>
                  )}
                </div>
              ) : bookingsSource === 'firestore' ? (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>लाइव Firestore सक्रिय:</strong> सभी बुकिंग्स सीधे Google Cloud Firestore डेटाबेस से लोड हो रही हैं।</span>
                  </div>
                  <span className="font-mono text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                    Cloud Synced
                  </span>
                </div>
              ) : null}

              {/* Admin Gate Notice if not authenticated (Requirement 10: ग्राहक के फोन सुरक्षित रहें) */}
              {!currentUser && (
                <div className="p-3.5 rounded-2xl bg-white border-2 border-slate-300 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Lock className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900 text-xs sm:text-sm">
                        अधिकृत एडमिन प्रमाणीकरण ({ADMIN_EMAIL})
                      </p>
                      <p className="text-slate-600 text-xs mt-0.5">
                        ग्राहक के फोन नंबर और पूर्ण विवरण की सुरक्षा हेतु केवल अधिकृत एडमिन ही सभी क्रियाएं कर सकते हैं।
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={loginWithGoogle}
                    disabled={authLoading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md active:scale-95 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4 text-amber-400" />
                    <span>{authLoading ? 'कृपया प्रतीक्षा करें...' : 'Sign in with Google'}</span>
                  </button>
                </div>
              )}

              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="नाम, फोन, इलाका या बुकिंग आईडी खोजें..."
                    className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto text-xs font-semibold">
                  {['all', 'pending', 'assigned', 'completed'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                        statusFilter === st
                          ? 'bg-amber-700 text-white font-bold'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {st === 'all' && `सभी (${bookings.length})`}
                      {st === 'pending' && `लंबित (${pendingCount})`}
                      {st === 'assigned' && `असाइन (${assignedCount})`}
                      {st === 'completed' && `पूर्ण (${completedCount})`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookings List */}
              {filteredBookings.length > 0 ? (
                <div className="grid grid-cols-1 gap-3.5">
                  {filteredBookings.map((b) => (
                    <div
                      key={b.bookingId}
                      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Card Header */}
                        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md">
                              {b.bookingId}
                            </span>
                            <span className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(b.createdAt).toLocaleDateString('hi-IN', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>

                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                            b.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : b.status === 'assigned'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {b.status === 'pending' && 'लंबित (Pending)'}
                            {b.status === 'assigned' && 'मिस्त्री असाइन'}
                            {b.status === 'completed' && 'पूर्ण (Done)'}
                            {b.status === 'confirmed' && 'स्वीकृत'}
                            {b.status === 'cancelled' && 'रद्द'}
                          </span>
                        </div>

                        {/* Customer & Job Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
                          <div className="space-y-1">
                            <p className="text-slate-900 font-bold text-sm">
                              👤 {b.customerName}
                            </p>
                            <p className="text-slate-600 flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-amber-700" />
                              <span className="font-mono font-semibold">{b.phone}</span>
                            </p>
                            <p className="text-slate-600 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-amber-600" />
                              <span>{b.area} {b.landmark ? `(${b.landmark})` : ''}</span>
                            </p>
                          </div>

                          <div className="p-2.5 bg-amber-50/50 rounded-xl border border-amber-100 text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="text-slate-500">सेवा:</span>
                              <strong className="text-amber-900">{b.service}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">पसंदीदा समय:</span>
                              <span className="text-slate-700">{b.preferredTime}</span>
                            </div>
                            {b.assignedProviderName && (
                              <div className="flex justify-between text-blue-800 font-medium">
                                <span>असाइन मिस्त्री:</span>
                                <span>{b.assignedProviderName}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Work description */}
                        <div className="mt-2.5 p-2 bg-slate-50 rounded-lg text-xs text-slate-700">
                          <strong className="text-slate-500 text-[10px] uppercase block">काम का विवरण:</strong>
                          <p className="mt-0.5">{b.workDetails}</p>
                        </div>
                      </div>

                      {/* AI Assistant Guided Actions */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                        {/* Assign to tradesperson button (Confirmation Gate) */}
                        <button
                          onClick={() => handleInitiateDispatch(b)}
                          className="py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>मिस्त्री को काम सौंपें</span>
                        </button>

                        {/* Customer Confirmation button (Confirmation Gate) */}
                        <button
                          onClick={() => handleInitiateCustomerNotify(b)}
                          className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>ग्राहक को पुष्टि भेजें</span>
                        </button>

                        {/* Mark completed */}
                        {b.status !== 'completed' && (
                          <button
                            onClick={() => updateBookingStatus(b.bookingId, 'completed', 'कार्य सफलतापूर्वक पूर्ण')}
                            className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer border border-slate-200"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>कार्य पूर्ण मार्क करें</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">कोई बुकिंग नहीं मिली</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {searchQuery ? 'सर्च मानदंड बदलें।' : 'ग्राहक वेबसाइट पर फॉर्म सबमिट करते ही बुकिंग यहाँ रीयल-टाइम में दिखाई देगी।'}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-5">
              {/* Strict Zero-Fake Notice */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>100% वास्तविक रिपोर्ट नीति (Zero Fake Data):</strong>
                  <p className="mt-0.5 text-emerald-800">
                    यहाँ प्रदर्शित सभी आंकड़े केवल ग्राहक वेबसाइट पर दर्ज वास्तविक बुकिंग्स पर आधारित हैं। कोई भी डमी या टेस्ट डेटा शामिल नहीं किया गया है।
                  </p>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <p className="text-[11px] text-slate-500 font-bold uppercase">कुल वास्तविक बुकिंग्स</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalBookings}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs">
                  <p className="text-[11px] text-amber-700 font-bold uppercase">लंबित बुकिंग्स</p>
                  <p className="text-2xl font-extrabold text-amber-800 mt-1">{pendingCount}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-xs">
                  <p className="text-[11px] text-blue-700 font-bold uppercase">मिस्त्री को असाइन</p>
                  <p className="text-2xl font-extrabold text-blue-800 mt-1">{assignedCount}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs">
                  <p className="text-[11px] text-emerald-700 font-bold uppercase">पूर्ण कार्य</p>
                  <p className="text-2xl font-extrabold text-emerald-800 mt-1">{completedCount}</p>
                </div>
              </div>

              {/* Breakdown tables */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* By Service */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-xs uppercase text-slate-700 tracking-wider mb-3">
                    सेवा के अनुसार मांग
                  </h4>
                  {Object.keys(serviceStats).length > 0 ? (
                    <div className="space-y-2 text-xs">
                      {Object.entries(serviceStats).map(([srv, count]) => (
                        <div key={srv} className="flex justify-between items-center py-1 border-b border-slate-100">
                          <span className="text-slate-800 font-medium">{srv}</span>
                          <span className="font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md">
                            {count} बुकिंग
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">अभी कोई बुकिंग दर्ज नहीं हुई है।</p>
                  )}
                </div>

                {/* By Area */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-xs uppercase text-slate-700 tracking-wider mb-3">
                    लखनऊ के इलाकों में मांग
                  </h4>
                  {Object.keys(areaStats).length > 0 ? (
                    <div className="space-y-2 text-xs">
                      {Object.entries(areaStats).map(([area, count]) => (
                        <div key={area} className="flex justify-between items-center py-1 border-b border-slate-100">
                          <span className="text-slate-800 font-medium">{area}</span>
                          <span className="font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md">
                            {count} बुकिंग
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">अभी कोई बुकिंग दर्ज नहीं हुई है।</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1.5">
                <h4 className="font-bold text-sm text-blue-950 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-blue-700" />
                  साझा Firebase Firestore डेटाबेस विवरण
                </h4>
                <p>
                  यह वेबसाइट और आपका LucknowSeva AI Assistant इस साझा डेटाबेस से जुड़े हैं। जब कोई ग्राहक फॉर्म भरता है, वह सीधे <code>bookings</code> कलेक्शन में सुरक्षित हो जाता है।
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500">Firebase प्रोजेक्ट आईडी:</label>
                  <p className="font-mono font-bold text-slate-900 text-sm mt-0.5">{firebaseConfig.projectId}</p>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500">Firestore डेटाबेस आईडी:</label>
                  <p className="font-mono text-slate-800 mt-0.5">{firebaseConfig.firestoreDatabaseId}</p>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500">मुख्य कलेक्शन (Collection):</label>
                  <p className="font-mono text-slate-800 mt-0.5">bookings</p>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500">सुरक्षा नियम स्थिति:</label>
                  <p className="text-emerald-700 font-semibold mt-0.5">
                    ✓ केवल अधिकृत एडमिन ({ADMIN_EMAIL}) ही बुकिंग्स देख व अपडेट कर सकते हैं।
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={copyConfigDetails}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs cursor-pointer"
                  >
                    {copiedConfig ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedConfig ? 'कॉपी हो गया!' : 'दूसरे AI Assistant के लिए कनेक्शन कॉपी करें'}</span>
                  </button>
                </div>
              </div>

              {/* Step-by-Step Rules Publishing Guide (Requirement 2 & 12) */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">
                    Firebase Console में Security Rules प्रकाशित करने का तरीका
                  </h4>
                  <a
                    href="https://console.firebase.google.com/project/gen-lang-client-0733001989/firestore/databases/ai-studio-lucknowseva-f46edd57-b14b-47e3-b690-90e2aa1637eb/rules"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline font-bold"
                  >
                    <span>Firebase Rules Console खोलें</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <p className="text-slate-600 leading-relaxed">
                  चूँकि Google AI Studio का आंतरिक RPC कस्टम नाम वाले डेटाबेस पर <code>GraphQL invalid argument</code> एरर देता है, इसलिए नीचे दिए गए सुरक्षित नियमों को सीधे Firebase Console के Rules एडिटर में पेस्ट करके <strong>"Publish"</strong> दबाएं:
                </p>

                <div className="relative">
                  <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] overflow-x-auto max-h-56 leading-relaxed">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }

    function isSignedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return isSignedIn() && (
        request.auth.token.email.lower() == 'creationsaifali@gmail.com'
      );
    }

    function isValidBooking(data) {
      return data.keys().hasAll(['bookingId', 'customerName', 'phone', 'service', 'area', 'workDetails', 'status', 'createdAt']) &&
        data.bookingId is string && data.bookingId.size() <= 64 &&
        data.customerName is string && data.customerName.size() <= 100 &&
        data.phone is string && data.phone.size() >= 10 && data.phone.size() <= 15 &&
        data.service is string && data.area is string &&
        data.workDetails is string && data.workDetails.size() <= 1000 &&
        data.status == 'pending' &&
        data.createdAt is string;
    }

    // Customer Bookings
    match /bookings/{bookingId} {
      allow create: if isValidBooking(request.resource.data) &&
        request.resource.data.bookingId == bookingId;
      allow read, update, delete: if isAdmin();
    }

    // Verified Providers
    match /providers/{providerId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Gate Modal (Requirement 6: ग्राहक या मिस्त्री को संदेश भेजने से पहले मेरी पुष्टि लें) */}
        {confirmationModal && confirmationModal.isOpen && (
          <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3">
            <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl border-2 border-amber-400 animate-in fade-in zoom-in-95">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    मालिक की अनुमति आवश्यक: संदेश भेजने से पहले समीक्षा करें
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    नियम अनुसार, आपके 'अनुमति दें' दबाने से पहले कोई भी संदेश नहीं भेजा जाएगा।
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <p><strong>प्राप्तकर्ता:</strong> {confirmationModal.recipientName} ({confirmationModal.recipientRole})</p>
                <p><strong>नंबर:</strong> {confirmationModal.recipientPhone}</p>
                <p><strong>बुकिंग आईडी:</strong> {confirmationModal.booking.bookingId}</p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  तैयार किया गया संदेश ड्राफ्ट:
                </label>
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl font-mono text-xs whitespace-pre-wrap max-h-48 overflow-y-auto text-slate-800">
                  {confirmationModal.messageDraft}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleConfirmAndSend}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30 active:scale-95 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>अनुमति दें और भेजें (Approve & Send)</span>
                </button>

                <button
                  onClick={() => setConfirmationModal(null)}
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                >
                  रद्द करें
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
