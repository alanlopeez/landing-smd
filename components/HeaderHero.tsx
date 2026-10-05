"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight, Sparkles, Clock, ShieldCheck, Zap } from "lucide-react";
import Floating3DEffects from "./Floating3DEffects";

interface HeaderHeroProps {
  onOpenLeadModal: () => void;
}

export default function HeaderHero({ onOpenLeadModal }: HeaderHeroProps) {
  return (
    <header className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-liquid-abyss">
      {/* Background Cinematic Video with optimized overlay */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-[0.45] contrast-[1.10]"
      >
        <source src="/videos/fondo-header.mp4" type="video/mp4" />
      </video>

      {/* Cinematic Dark Lab Overlay (Auros Deep Petroleum palette) */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#222f30]/75 via-[#012624]/60 to-[#012624] pointer-events-none" />

      {/* 3D Floating Elements with organic motion and cursor parallax */}
      <Floating3DEffects className="z-[2]" />

      {/* Top Floating Navigation Bar */}
      <nav
        aria-label="Navegación principal"
        className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between gap-3"
      >
        {/* Brand Identity */}
        <a
          href="#inicio"
          className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus:ring-1 focus:ring-bioluminescent-lime rounded-md"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/20 flex items-center justify-center bg-abyssal-ink/80 backdrop-blur-md group-hover:border-bioluminescent-lime transition-colors overflow-hidden p-1.5 shadow-lg shrink-0">
            <Image
              src="/logo.png"
              alt="Logo Alan López SMD"
              width={26}
              height={26}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-semibold tracking-tight text-platinum font-matter">
              ALAN LÓPEZ
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-wide text-silver-mist uppercase">
              Servicio de Marketing Digital
            </span>
          </div>
        </a>

        {/* Center / Right Floating Navigation Capsule */}
        <div className="flex items-center gap-2 sm:gap-6 bg-abyssal-ink/80 backdrop-blur-md border border-white/10 rounded-full px-3 sm:px-6 py-1.5 sm:py-2 shadow-lg">
          <div className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider font-matter">
            <a
              href="#como-funciona"
              className="text-silver-mist hover:text-platinum transition-colors"
            >
              ¿Cómo funciona?
            </a>
            <a
              href="#portfolio"
              className="text-silver-mist hover:text-platinum transition-colors"
            >
              Portfolio
            </a>
            <a
              href="#sobre-mi"
              className="text-silver-mist hover:text-platinum transition-colors"
            >
              Sobre mí
            </a>
            <a
              href="#marco-legal"
              className="text-silver-mist hover:text-platinum transition-colors"
            >
              Legal
            </a>
          </div>

          <button
            onClick={onOpenLeadModal}
            className="bg-liquid-abyss/90 hover:bg-bioluminescent-lime hover:text-liquid-abyss text-platinum text-[11px] sm:text-xs font-semibold px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10 hover:border-bioluminescent-lime transition-all uppercase tracking-wider cursor-pointer whitespace-nowrap"
          >
            Comenzar mi rediseño
          </button>
        </div>
      </nav>

      {/* Main Massive Title Area (Official PDF Title) */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-12 pb-6 flex-1 flex flex-col justify-center">
        {/* Eyebrow badge */}
        <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 self-start px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-bioluminescent-lime animate-pulse" />
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-silver-mist font-matter font-medium">
            Propuesta Interactiva de Alto Impacto
          </span>
        </div>

        {/* Exact Title from Rediseño de landing.pdf */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[76px] font-aspekta font-normal text-platinum tracking-tight leading-[1.1] sm:leading-[1.06] max-w-5xl select-none break-words">
          Rediseño / creación de landing page interactiva de alto impacto para lanzamiento de producto o captación de leads
        </h1>

        {/* Service badges & delivery commitments */}
        <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-liquid-deep/90 border border-white/10 text-xs sm:text-sm text-platinum font-matter backdrop-blur-md">
            <Clock className="w-4 h-4 text-bioluminescent-lime" />
            <span>Primera propuesta interactiva en <strong>48 hs</strong></span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-liquid-deep/90 border border-white/10 text-xs sm:text-sm text-platinum font-matter backdrop-blur-md">
            <Zap className="w-4 h-4 text-bioluminescent-lime" />
            <span>Entrega final afinada en <strong>3 a 5 días hábiles</strong></span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-liquid-deep/90 border border-white/10 text-xs sm:text-sm text-platinum font-matter backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-bioluminescent-lime" />
            <span>Garantía de fidelidad del diseño</span>
          </div>
        </div>
      </div>

      {/* Hero Bottom Bar: Action Block */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pb-12 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-white/10">
        <p className="text-sm sm:text-base text-liquid-mist font-matter max-w-xl">
          Diseño web de alta gama y arquitectura interactiva orientada 100% a resultados y conversión.
        </p>

        {/* Primary CTA Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenLeadModal}
            className="btn-aurora text-xs sm:text-sm font-semibold tracking-wider px-7 py-3.5 rounded-full transition-transform hover:scale-[1.02] cursor-pointer shadow-lg inline-flex items-center gap-2 text-liquid-abyss"
          >
            <span>+ Comenzar mi rediseño</span>
          </button>
          <button
            onClick={onOpenLeadModal}
            aria-label="Abrir formulario de rediseño"
            className="btn-lime w-11 h-11 rounded-full cursor-pointer hover:scale-105 transition-transform shrink-0"
          >
            <ArrowUpRight className="w-5 h-5 text-liquid-abyss" />
          </button>
        </div>
      </div>
    </header>
  );
}
