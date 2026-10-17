/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';

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
import {
  VerifiedProvider,
  getVerifiedProviders,
} from './data/initialProviders';

import {
  Booking,
  subscribeToBookings,
  BookingsSource,
  FirestoreErrorInfo,
} from './services/bookingService';

import { testFirestoreConnection } from './lib/firebase';
import { AuthProvider } from './contexts/AuthContext';

function LucknowSevaApp() {
  // Search and area selection
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  // Modal visibility
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [providerRegModalOpen, setProviderRegModalOpen] = useState(false);
  const [hostingGuideModalOpen, setHostingGuideModalOpen] = useState(false);
  const [ownerModalOpen, setOwnerModalOpen] = useState(false);
  const [aiAssistantModalOpen, setAiAssistantModalOpen] = useState(false);

  // Selected service and provider for booking
  const [selectedServiceForBooking, setSelectedServiceForBooking] =
    useState<ServiceItem | null>(null);

  const [selectedProviderForBooking, setSelectedProviderForBooking] =
    useState<VerifiedProvider | null>(null);

  // Firebase booking state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsSource, setBookingsSource] =
    useState<BookingsSource>('offline_cache');

  const [firestoreError, setFirestoreError] =
    useState<FirestoreErrorInfo | null>(null);

  // Verified providers
  const [verifiedProviders, setVerifiedProviders] =
    useState<VerifiedProvider[]>([]);

  // Load providers and subscribe to bookings
  useEffect(() => {
    let mounted = true;

    try {
      const savedProviders = getVerifiedProviders();

      if (mounted) {
        setVerifiedProviders(savedProviders);
      }
    } catch (error) {
      console.error(
        'LucknowSeva: Unable to load verified providers.',
        error
      );
    }

    // Check Firebase connectivity.
    // The booking subscription below is responsible for booking updates.
    try {
      void Promise.resolve(testFirestoreConnection()).catch((error) => {
        console.error(
          'LucknowSeva: Firebase connection check failed.',
          error
        );
      });
    } catch (error) {
      console.error(
        'LucknowSeva: Firebase connection check failed.',
        error
      );
    }

    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = subscribeToBookings(
        (updatedBookings, source, errorInfo) => {
          if (!mounted) {
            return;
          }

          setBookings(updatedBookings);
          setBookingsSource(source);
          setFirestoreError(errorInfo);
        }
      );
    } catch (error) {
      console.error(
        'LucknowSeva: Unable to subscribe to bookings.',
        error
      );
    }

    return () => {
      mounted = false;

      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Open booking form for a service or general booking
  const handleOpenBooking = useCallback(
    (service?: ServiceItem) => {
      setSelectedServiceForBooking(service ?? null);

      // A normal service booking should not retain a previously
      // selected provider.
      setSelectedProviderForBooking(null);

      setBookingModalOpen(true);
    },
    []
  );

  // Open booking form for a particular verified provider
  const handleBookProvider = useCallback(
    (provider: VerifiedProvider) => {
      setSelectedProviderForBooking(provider);
      setSelectedServiceForBooking(null);
      setBookingModalOpen(true);
    },
    []
  );

  // Close booking form and reset the selected provider/service
  const handleCloseBooking = useCallback(() => {
    setBookingModalOpen(false);
    setSelectedServiceForBooking(null);
    setSelectedProviderForBooking(null);
  }, []);

  // Scroll to a page section
  const handleScrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, []);

  // Select a Lucknow service area
  const handleSelectArea = useCallback(
    (areaName: string) => {
      setSelectedArea(areaName);
      handleScrollToSection('services-section');
    },
    [handleScrollToSection]
  );

  // Update verified providers managed by the owner
  const handleUpdateProviders = useCallback(
    (updatedProviders: VerifiedProvider[]) => {
      setVerifiedProviders(updatedProviders);
    },
    []
  );

  // Count pending bookings for the header
  const pendingBookingsCount = bookings.filter(
    (booking) => booking.status === 'pending'
  ).length;

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
        activeBookingsCount={pendingBookingsCount}
      />

      <main className="flex-1">

        {/* Main banner and search */}
        <HeroSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
          onOpenBooking={() => handleOpenBooking()}
          onOpenProviderReg={() => setProviderRegModalOpen(true)}
        />

        {/* Eight core service categories */}
        <ServiceList
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
          onBookService={(service) => handleOpenBooking(service)}
        />

        {/* Verified provider directory */}
        <VerifiedProvidersDirectory
          providers={verifiedProviders}
          onBookProvider={handleBookProvider}
          onOpenOwnerModal={() => setOwnerModalOpen(true)}
        />

        {/* Lucknow service areas */}
        <AreasDirectorySection
          selectedArea={selectedArea}
          onSelectArea={handleSelectArea}
        />

        {/* Trust and verification policy */}
        <TrustPolicySection />

      </main>

      {/* Footer */}
      <Footer
        onSelectService={(service) => handleOpenBooking(service)}
        onOpenBooking={() => handleOpenBooking()}
        onOpenProviderReg={() => setProviderRegModalOpen(true)}
        onOpenHostingGuide={() => setHostingGuideModalOpen(true)}
        onOpenOwnerModal={() => setOwnerModalOpen(true)}
        onOpenAIAssistant={() => setAiAssistantModalOpen(true)}
      />

      {/* Mobile bottom navigation */}
      <BottomMobileBar
        onOpenBooking={() => handleOpenBooking()}
        onOpenProviderReg={() => setProviderRegModalOpen(true)}
      />

      {/* Customer booking modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={handleCloseBooking}
        initialService={selectedServiceForBooking}
        initialArea={selectedArea}

        /*
         * IMPORTANT:
         * BookingModal must support initialProvider.
         * Its implementation must use this provider when preparing
         * the booking form and saving the booking.
         */
        initialProvider={selectedProviderForBooking}

        onBookingSuccess={() => {
          // The booking subscription updates the booking list.
          // Do not create a duplicate booking here.
          setBookingModalOpen(false);
        }}
      />

      {/* Provider registration */}
      <ProviderRegistrationModal
        isOpen={providerRegModalOpen}
        onClose={() => setProviderRegModalOpen(false)}
      />

      {/* Free hosting and deployment guide */}
      <FreeHostingGuideModal
        isOpen={hostingGuideModalOpen}
        onClose={() => setHostingGuideModalOpen(false)}
      />

      {/* Owner dashboard */}
      <OwnerAdminModal
        isOpen={ownerModalOpen}
        onClose={() => setOwnerModalOpen(false)}
        providers={verifiedProviders}
        onUpdateProviders={handleUpdateProviders}
      />

      {/* AI assistant and booking manager */}
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
