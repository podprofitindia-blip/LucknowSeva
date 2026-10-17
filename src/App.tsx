/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ServiceList } from './components/ServiceList';
import { VerifiedProvidersDirectory } from './components/VerifiedProvidersDirectory';
import { AreasDirectorySection } from './components/AreasDirectorySection';
import { TrustPolicySection } from './components/TrustPolicySection';
import { BookingModal } from './components/BookingModal';
import { ProviderRegistrationModal } from './components/ProviderRegistrationModal';
import { FreeHostingGuideModal } from './components/FreeHostingGuideModal';
import { OwnerAdminModal } from './components/OwnerAdminModal';
import { AIAssistantManager } from './components/AIAssistantManager';
import { BottomMobileBar } from './components/BottomMobileBar';
import { Footer } from './components/Footer';

import { ServiceItem } from './data/servicesData';
import { VerifiedProvider, getVerifiedProviders } from './data/initialProviders';
import { Booking, subscribeToBookings, BookingsSource, FirestoreErrorInfo } from './services/bookingService';
import { testFirestoreConnection } from './lib/firebase';
import { AuthProvider } from './contexts/AuthContext';

function LucknowSevaApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  
  // Modals
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<ServiceItem | null>(null);
  const [providerRegModalOpen, setProviderRegModalOpen] = useState(false);
  const [hostingGuideModalOpen, setHostingGuideModalOpen] = useState(false);
  const [ownerModalOpen, setOwnerModalOpen] = useState(false);
  const [aiAssistantModalOpen, setAiAssistantModalOpen] = useState(false);

  // Real Bookings (Shared with AI Assistant & Firestore)
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsSource, setBookingsSource] = useState<BookingsSource>('offline_cache');
  const [firestoreError, setFirestoreError] = useState<FirestoreErrorInfo | null>(null);

  // Verified Providers (Owner managed, persisted in localStorage)
  const [verifiedProviders, setVerifiedProviders] = useState<VerifiedProvider[]>([]);

  useEffect(() => {
    setVerifiedProviders(getVerifiedProviders());
    testFirestoreConnection();

    // Subscribe to live bookings in shared database with transparent error reporting
    const unsubscribe = subscribeToBookings((updatedBookings, source, errorInfo) => {
      setBookings(updatedBookings);
      setBookingsSource(source);
      setFirestoreError(errorInfo);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenBooking = (service?: ServiceItem) => {
    if (service) {
      setSelectedServiceForBooking(service);
    } else {
      setSelectedServiceForBooking(null);
    }
    setBookingModalOpen(true);
  };

  const handleBookProvider = (provider: VerifiedProvider) => {
    // Open booking modal prefilled with this verified professional
    setBookingModalOpen(true);
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectArea = (areaName: string) => {
    setSelectedArea(areaName);
    // Smooth scroll to services
    handleScrollToSection('services-section');
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/20 text-slate-800 font-sans selection:bg-amber-200 selection:text-amber-900 pb-16 sm:pb-0">
      {/* Header */}
      <Header
        onOpenBooking={() => handleOpenBooking()}
        onOpenProviderReg={() => setProviderRegModalOpen(true)}
        onOpenHostingGuide={() => setHostingGuideModalOpen(true)}
        onOpenOwnerModal={() => setOwnerModalOpen(true)}
        onOpenAIAssistant={() => setAiAssistantModalOpen(true)}
        onScrollToSection={handleScrollToSection}
        activeBookingsCount={bookings.filter(b => b.status === 'pending').length}
      />

      <main className="flex-1">
        {/* Hero Section with Area + Service search */}
        <HeroSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
          onOpenBooking={() => handleOpenBooking()}
          onOpenProviderReg={() => setProviderRegModalOpen(true)}
        />

        {/* 8 Core Services List */}
        <ServiceList
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
          onBookService={(srv) => handleOpenBooking(srv)}
        />

        {/* Verified Providers Section (Owner vetted, zero fake reviews) */}
        <VerifiedProvidersDirectory
          providers={verifiedProviders}
          onBookProvider={handleBookProvider}
          onOpenOwnerModal={() => setOwnerModalOpen(true)}
        />

        {/* Lucknow Areas Section */}
        <AreasDirectorySection
          selectedArea={selectedArea}
          onSelectArea={handleSelectArea}
        />

        {/* Anti-Fake Reviews and Trust Policy Section */}
        <TrustPolicySection />
      </main>

      {/* Footer */}
      <Footer
        onSelectService={(srv) => handleOpenBooking(srv)}
        onOpenBooking={() => handleOpenBooking()}
        onOpenProviderReg={() => setProviderRegModalOpen(true)}
        onOpenHostingGuide={() => setHostingGuideModalOpen(true)}
        onOpenOwnerModal={() => setOwnerModalOpen(true)}
        onOpenAIAssistant={() => setAiAssistantModalOpen(true)}
      />

      {/* Android and Mobile Sticky Bottom Bar */}
      <BottomMobileBar
        onOpenBooking={() => handleOpenBooking()}
        onOpenProviderReg={() => setProviderRegModalOpen(true)}
      />

      {/* Customer Booking Modal with direct WhatsApp integration */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialService={selectedServiceForBooking}
        initialArea={selectedArea}
        onBookingSuccess={() => {
          // Booking already synced via subscribeToBookings
        }}
      />

      {/* Provider Registration Modal with direct WhatsApp integration */}
      <ProviderRegistrationModal
        isOpen={providerRegModalOpen}
        onClose={() => setProviderRegModalOpen(false)}
      />

      {/* Free Hosting & Deployment Guide Modal */}
      <FreeHostingGuideModal
        isOpen={hostingGuideModalOpen}
        onClose={() => setHostingGuideModalOpen(false)}
      />

      {/* Owner Admin Modal for adding verified providers */}
      <OwnerAdminModal
        isOpen={ownerModalOpen}
        onClose={() => setOwnerModalOpen(false)}
        providers={verifiedProviders}
        onUpdateProviders={(updated) => setVerifiedProviders(updated)}
      />

      {/* LucknowSeva AI Assistant & Booking Manager (Shared Firebase database) */}
      <AIAssistantManager
        isOpen={aiAssistantModalOpen}
        onClose={() => setAiAssistantModalOpen(false)}
        bookings={bookings}
        bookingsSource={bookingsSource}
        firestoreError={firestoreError}
        providers={verifiedProviders}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LucknowSevaApp />
    </AuthProvider>
  );
}
