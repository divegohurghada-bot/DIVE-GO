import React, { useState } from 'react';
import { AppState } from '../../services/store';
import { WebsiteNavbar } from './WebsiteNavbar';
import { WebsiteHero } from './WebsiteHero';
import { WebsiteExcursions } from './WebsiteExcursions';
import { WebsiteDiveSites } from './WebsiteDiveSites';
import { WebsiteAbout } from './WebsiteAbout';
import { WebsiteReviews } from './WebsiteReviews';
import { WebsiteFaq } from './WebsiteFaq';
import { WebsiteFooter } from './WebsiteFooter';
import { FloatingAiConcierge } from './FloatingAiConcierge';
import { BookingDrawer } from './BookingDrawer';
import { ScrollToTopButton } from './ScrollToTopButton';

interface WebsiteHomeProps {
  state: AppState;
  onSwitchToCommandCenter?: () => void;
}

export const WebsiteHome: React.FC<WebsiteHomeProps> = ({ state }) => {
  const [bookingDrawerOpen, setBookingDrawerOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [selectedPax, setSelectedPax] = useState<number | undefined>();

  const [aiConciergeOpen, setAiConciergeOpen] = useState(false);
  const [initialAiQuery, setInitialAiQuery] = useState<string | undefined>();

  const handleOpenBooking = (serviceId?: string, date?: string, pax?: number) => {
    setSelectedServiceId(serviceId);
    setSelectedDate(date);
    setSelectedPax(pax);
    setBookingDrawerOpen(true);
  };

  const handleOpenAiChat = (prefilledQuery?: string) => {
    if (prefilledQuery) {
      setInitialAiQuery(prefilledQuery);
    }
    setAiConciergeOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* 1. Public Top Navigation Bar (3-Zone Contract) */}
      <WebsiteNavbar
        state={state}
        onOpenBooking={() => handleOpenBooking()}
        onOpenAiChat={() => handleOpenAiChat()}
      />

      {/* 2. Hero Section with Trip Finder & Generated Red Sea Imagery */}
      <WebsiteHero
        state={state}
        onOpenBooking={handleOpenBooking}
        onOpenAiChat={handleOpenAiChat}
      />

      {/* 3. Excursions Showcase with Direct Booking & AI Inquiry */}
      <WebsiteExcursions
        state={state}
        onOpenBooking={handleOpenBooking}
        onOpenAiChat={handleOpenAiChat}
      />

      {/* 4. Famous Red Sea Dive Sites & Marine Highlights */}
      <WebsiteDiveSites />

      {/* 5. About Dive Go Hurghada & PADI Safety Standards */}
      <WebsiteAbout />

      {/* 6. Verified Traveler Reviews */}
      <WebsiteReviews />

      {/* 7. FAQ & Policies */}
      <WebsiteFaq />

      {/* 8. Footer with Marina Location & Contact Details */}
      <WebsiteFooter
        state={state}
      />

      {/* 9. Floating 24/7 Multilingual AI Concierge */}
      <FloatingAiConcierge
        state={state}
        isOpen={aiConciergeOpen}
        onToggle={() => setAiConciergeOpen(!aiConciergeOpen)}
        onOpenBooking={(sId) => {
          setAiConciergeOpen(false);
          handleOpenBooking(sId);
        }}
        initialQuery={initialAiQuery}
      />

      {/* 10. Direct Online Booking Voucher Drawer */}
      <BookingDrawer
        state={state}
        isOpen={bookingDrawerOpen}
        onClose={() => setBookingDrawerOpen(false)}
        preselectedServiceId={selectedServiceId}
        preselectedDate={selectedDate}
        preselectedPax={selectedPax}
      />

      {/* 11. Jump Up Floating Button */}
      <ScrollToTopButton />
    </div>
  );
};
