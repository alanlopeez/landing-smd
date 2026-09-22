"use client";

import React, { useState } from "react";
import HeaderHero from "@/components/HeaderHero";
import ValueProposition from "@/components/ValueProposition";
import AutomationTypesSection from "@/components/AutomationTypesSection";
import InteractiveDemo from "@/components/InteractiveDemo";
import NicheLandingSection from "@/components/NicheLandingSection";
import DesignShowcase from "@/components/DesignShowcase";
import AboutMeSection from "@/components/AboutMeSection";
import FaqSection from "@/components/FaqSection";
import LeadMagnetSection from "@/components/LeadMagnetSection";
import FinalCtaSection from "@/components/FinalCtaSection";
import FooterLegal from "@/components/FooterLegal";
import ConversionModals, { ModalType } from "@/components/ConversionModals";
import AboutMeModal from "@/components/AboutMeModal";

export default function HomePage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-liquid-abyss text-silver-mist selection:bg-bioluminescent-lime selection:text-liquid-abyss">
      {/* 1. Header / Hero Section (Integrated Biosciences Theme) */}
      <HeaderHero
        onOpenLeadModal={() => setActiveModal("lead")}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
        onOpenMagnetModal={() => setActiveModal("magnet")}
      />

      {/* 2. Value Proposition & Multi-Agent Architecture (Auros Theme) */}
      <ValueProposition onOpenLeadModal={() => setActiveModal("lead")} />

      {/* 3. Automation Types & Agent Levels (Express, Conversacional, Autónomo) */}
      <AutomationTypesSection onOpenLeadModal={() => setActiveModal("lead")} />

      {/* 4. Interactive Demo Simulator ("¿Cómo funciona? - Vea un proyecto DEMO") */}
      <InteractiveDemo onOpenLeadModal={() => setActiveModal("lead")} />

      {/* 5. Niche Specialization & Rapid Decisions (14 Profiles with Custom WhatsApp CTAs & AI Video) */}
      <NicheLandingSection />

      {/* 6. Design Models & Produced Live Projects (Refero & Alan López Projects) */}
      <DesignShowcase onOpenLeadModal={() => setActiveModal("lead")} />

      {/* 6. About Me Section (Alan López Bio & Lavender Phosphor Stats) */}
      <AboutMeSection onOpenLeadModal={() => setActiveModal("lead")} />

      {/* 7. Frequently Asked Questions (FAQ Accordion with Schema.org & GEO) */}
      <FaqSection onOpenLeadModal={() => setActiveModal("lead")} />

      {/* 8. Lead Magnet Section (Free Multi-Agent AI Guide) */}
      <LeadMagnetSection onOpenMagnetModal={() => setActiveModal("magnet")} />

      {/* 9. Final Call to Action Section (Recessed Liquid Deep Card) */}
      <FinalCtaSection onOpenLeadModal={() => setActiveModal("lead")} />

      {/* 10. Footer with Complete Legal Framework & Cybersecurity Protocols */}
      <FooterLegal />

      {/* Pop-up Modals */}
      <ConversionModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
      />

      {/* About Me Popup Modal (Pestaña Emergente) */}
      <AboutMeModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        onOpenLeadModal={() => setActiveModal("lead")}
      />
    </main>
  );
}
