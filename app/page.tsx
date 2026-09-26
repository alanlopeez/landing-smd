"use client";

import React, { useState } from "react";
import HeaderHero from "@/components/HeaderHero";
import RevenueLeakCalculator from "@/components/RevenueLeakCalculator";
import ValueProposition from "@/components/ValueProposition";
import InteractiveDemo from "@/components/InteractiveDemo";
import AutomationTypesSection from "@/components/AutomationTypesSection";
import SpecializedServicesSection from "@/components/SpecializedServicesSection";
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
  const [modalContext, setModalContext] = useState<{
    businessType?: string;
    sourceContext?: string;
    initialVolume?: string;
    initialBudget?: string;
  }>({});

  const handleOpenLeadModal = (context?: {
    volume?: string;
    budget?: string;
    servicePreset?: string;
    source?: string;
  }) => {
    setModalContext({
      businessType: context?.servicePreset || "Servicios B2B / Consultoría empresarial",
      sourceContext: context?.source || "Landing B2B North Star CTA",
      initialVolume: context?.volume,
      initialBudget: context?.budget,
    });
    setActiveModal("lead");
  };

  return (
    <main className="min-h-screen bg-liquid-abyss text-silver-mist selection:bg-bioluminescent-lime selection:text-liquid-abyss">
      {/* 1. Header / Hero Section con North Star CTA: Evaluar Viabilidad y Cotizar con IA */}
      <HeaderHero
        onOpenLeadModal={() => handleOpenLeadModal({ source: "Header Hero CTA" })}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
        onOpenMagnetModal={() => setActiveModal("magnet")}
      />

      {/* 2. Calculadora Interactiva de Fuga de Ingresos / ROI */}
      <RevenueLeakCalculator
        onOpenQualification={(calcData) =>
          handleOpenLeadModal({
            volume: calcData?.volume,
            budget: calcData?.budget,
            source: calcData?.source || "Calculadora de Fuga de Ingresos",
          })
        }
      />

      {/* 3. Dogfooding Interactivo: Cotizador y Evaluador de Proyectos con IA en Vivo + Demo */}
      <InteractiveDemo
        onOpenLeadModal={(demoData) =>
          handleOpenLeadModal({
            servicePreset: demoData?.servicePreset,
            budget: demoData?.budgetPreset,
            source: "Simulador Interactivo Dogfooding",
          })
        }
      />

      {/* 4. Value Proposition & Arquitectura de Automatización B2B */}
      <ValueProposition
        onOpenLeadModal={() =>
          handleOpenLeadModal({ source: "Propuesta de Valor B2B" })
        }
      />

      {/* 5. Niveles de Agentes con CTAs Unificados */}
      <AutomationTypesSection
        onOpenLeadModal={(autoData) =>
          handleOpenLeadModal({
            servicePreset: autoData?.servicePreset,
            source: "Niveles de Automatización",
          })
        }
      />

      {/* 6. Servicios Llave en Mano y Auditoría Técnica */}
      <SpecializedServicesSection
        onOpenLeadModal={(serviceData) =>
          handleOpenLeadModal({
            servicePreset: serviceData?.servicePreset,
            source: "Servicios Especializados B2B",
          })
        }
      />

      {/* 7. Especialización por Nichos B2B */}
      <NicheLandingSection />

      {/* 8. Casos de Estudio con Formato Problema -> Arquitectura -> Resultado Medible */}
      <DesignShowcase
        onOpenLeadModal={() =>
          handleOpenLeadModal({ source: "Portafolio y Casos de Estudio" })
        }
      />

      {/* 9. Sobre Mí (Alan López - Productor Digital) */}
      <AboutMeSection
        onOpenLeadModal={() =>
          handleOpenLeadModal({ source: "Sección Sobre Mí" })
        }
      />

      {/* 10. Preguntas Frecuentes con Schema.org */}
      <FaqSection
        onOpenLeadModal={() =>
          handleOpenLeadModal({ source: "Preguntas Frecuentes" })
        }
      />

      {/* 11. Lead Magnet (Guía Estratégica de Multi-Agentes para Empresas) */}
      <LeadMagnetSection onOpenMagnetModal={() => setActiveModal("magnet")} />

      {/* 12. Final CTA Maestro */}
      <FinalCtaSection
        onOpenLeadModal={() =>
          handleOpenLeadModal({ source: "Sección Final CTA" })
        }
      />

      {/* 13. Footer Legal y Protocolos de Ciberseguridad */}
      <FooterLegal />

      {/* Modales de Conversión (Calificador BANT en 5 pasos & Lead Magnet) */}
      <ConversionModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        defaultBusinessType={modalContext.businessType}
        sourceContext={modalContext.sourceContext}
        initialVolume={modalContext.initialVolume}
        initialBudget={modalContext.initialBudget}
      />

      {/* Modal Sobre Mí */}
      <AboutMeModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        onOpenLeadModal={() =>
          handleOpenLeadModal({ source: "Modal Sobre Mí" })
        }
      />
    </main>
  );
}
