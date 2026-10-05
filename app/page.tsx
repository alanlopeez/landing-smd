"use client";

import React, { useState } from "react";
import HeaderHero from "../components/HeaderHero";
import HowItWorksSection from "../components/HowItWorksSection";
import PortfolioSection from "../components/PortfolioSection";
import AboutMeSection from "../components/AboutMeSection";
import FooterLegal from "../components/FooterLegal";
import RedesignLeadModal from "../components/RedesignLeadModal";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenLeadModal = () => {
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-liquid-abyss text-silver-mist selection:bg-bioluminescent-lime selection:text-liquid-abyss">
      {/* 1. Portada / Hero con Efectos 3D Flotantes y CTA */}
      <HeaderHero onOpenLeadModal={handleOpenLeadModal} />

      {/* 2. Sección: ¿Cómo funciona? con Video DEMO de YouTube y CTA */}
      <HowItWorksSection onOpenLeadModal={handleOpenLeadModal} />

      {/* 3. Sección: Portfolio Oficial (Webs y proyectos producidos) */}
      <PortfolioSection onOpenLeadModal={handleOpenLeadModal} />

      {/* 4. Sección: Sobre mí (Alan López, Productor Digital) */}
      <AboutMeSection onOpenLeadModal={handleOpenLeadModal} />

      {/* 5. Footer: Políticas de Privacidad, Condiciones del Servicio, Devolución y Redes */}
      <FooterLegal />

      {/* Modal Interactivo: Comenzar mi rediseño con resumen automático a WhatsApp */}
      <RedesignLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
