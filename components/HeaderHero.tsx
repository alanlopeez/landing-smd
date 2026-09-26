"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight, ShieldCheck, Zap, Bot } from "lucide-react";

interface HeaderHeroProps {
  onOpenLeadModal: () => void;
  onOpenAboutModal: () => void;
  onOpenMagnetModal: () => void;
}

export default function HeaderHero({
  onOpenLeadModal,
  onOpenAboutModal,
  onOpenMagnetModal,
}: HeaderHeroProps) {
  return (
    <header className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-liquid-abyss">
      {/* Background Cinematic Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-[0.55] contrast-[1.05]"
      >
        <source src="/videos/fondo-header.mp4" type="video/mp4" />
      </video>

      {/* Cinematic Dark Lab Overlay (Integrated Biosciences reference) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#222f30]/65 via-[#222f30]/40 to-[#012624] pointer-events-none" />

      {/* Top Floating Navigation Bar */}
      <nav
        aria-label="Navegación principal"
        className="relative z-20 w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-between"
      >
        {/* Logo / Brand Name */}
        <a
          href="#inicio"
          className="flex items-center gap-3 group focus:outline-none focus:ring-1 focus:ring-bioluminescent-lime rounded-md"
        >
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-abyssal-ink/60 backdrop-blur-sm group-hover:border-bioluminescent-lime transition-colors overflow-hidden p-1">
            <Image
              src="/logo.png"
              alt="Logo Penrose Alan López"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-platinum font-matter">
              ALAN LÓPEZ
            </span>
            <span className="text-[10px] tracking-wide text-silver-mist uppercase">
              Sistemas Web B2B & Agentes IA
            </span>
          </div>
        </a>

        {/* Center / Right Floating Capsule */}
        <div className="flex items-center gap-2 sm:gap-6 bg-abyssal-ink/80 backdrop-blur-md border border-white/10 rounded-full px-4 py-2">
          <div className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wide font-matter">
            <a
              href="#servicios"
              className="text-silver-mist hover:text-platinum transition-colors"
            >
              Servicios
            </a>
            <a
              href="#automatizaciones"
              className="text-silver-mist hover:text-platinum transition-colors"
            >
              Automatizaciones
            </a>
            <a
              href="#soluciones-autonomas"
              className="text-silver-mist hover:text-platinum transition-colors"
            >
              Sistemas IA
            </a>
            <a
              href="#nichos"
              className="text-silver-mist hover:text-platinum transition-colors"
            >
              Nichos B2B
            </a>
            <a
              href="#demo"
              className="text-silver-mist hover:text-platinum transition-colors"
            >
              Demo
            </a>
            <a
              href="#proyectos"
              className="text-silver-mist hover:text-platinum transition-colors"
            >
              Proyectos
            </a>
            <a
              href="#faq"
              className="text-silver-mist hover:text-platinum transition-colors"
            >
              FAQ
            </a>
            <button
              onClick={onOpenAboutModal}
              className="text-silver-mist hover:text-platinum transition-colors cursor-pointer"
            >
              Sobre Mí
            </button>
            <button
              onClick={onOpenMagnetModal}
              className="text-silver-mist hover:text-platinum transition-colors cursor-pointer"
            >
              Guía IA
            </button>
          </div>

          <button
            onClick={onOpenLeadModal}
            className="bg-liquid-abyss/90 hover:bg-white/10 text-platinum text-xs font-semibold px-4 py-2 rounded-full border border-white/10 transition-colors uppercase tracking-wider hover:border-bioluminescent-lime/40 cursor-pointer"
          >
            Evaluar con IA
          </button>
        </div>
      </nav>

      {/* Main Massive Title Area (Above the Fold con Propuesta B2B Específica) */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pt-12 sm:pt-16 pb-8 flex-1 flex flex-col justify-center">
        {/* Eyebrow Target Definition */}
        <div className="mb-4 inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-bioluminescent-lime animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-silver-mist font-matter">
            Infraestructura Web & Agentes Autónomos · B2B & Marcas Consolidadas
          </span>
        </div>

        {/* Powerful Value-Focused H1 */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[98px] xl:text-[112px] font-aspekta font-normal text-platinum tracking-[-0.03em] leading-[0.94] max-w-6xl select-none">
          Sistemas Web y Agentes IA para Empresas B2B.
        </h1>

        {/* Feature Badges for Business Value */}
        <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-platinum font-matter">
            <Bot className="w-3.5 h-3.5 text-bioluminescent-lime" />
            <span>Filtro y Cotización Automática 24/7</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-platinum font-matter">
            <Zap className="w-3.5 h-3.5 text-bioluminescent-lime" />
            <span>Primera Versión Operativa en 24 Horas</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-platinum font-matter">
            <ShieldCheck className="w-3.5 h-3.5 text-bioluminescent-lime" />
            <span>Sin Pagos por Adelantado · Con Garantía</span>
          </div>
        </div>
      </div>

      {/* Hero Bottom Bar: Subtext and Action Combination */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pb-12 pt-4 flex flex-col md:flex-row md:items-end justify-between gap-8">
        {/* Left Subtext: Specific Business Problem Solved */}
        <div className="max-w-2xl">
          <p className="text-base sm:text-lg text-liquid-mist font-matter leading-relaxed">
            <strong className="text-platinum font-semibold">
              Eliminamos la fuga de prospectos calificados y los cuellos de botella comerciales.
            </strong>{" "}
            Diseñamos plataformas web ultrarrápidas con sistemas multi-agentes que filtran consultas,
            cotizan requerimientos al instante y derivan llamadas con alta intención de compra directamente
            a tu equipo de ventas.
          </p>
        </div>

        {/* Right CTA Button Pair */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <a
            href="#calculadora-roi"
            className="text-xs text-silver-mist hover:text-white underline underline-offset-4 font-matter py-2 px-3 transition-colors"
          >
            Calcular fuga de ingresos ↓
          </a>
          <button
            onClick={onOpenLeadModal}
            className="bg-[#222f30] hover:bg-[#2c3d3e] text-platinum text-xs sm:text-sm font-semibold uppercase tracking-wider px-6 py-3.5 rounded-full border border-white/15 transition-all cursor-pointer shadow-lg hover:border-bioluminescent-lime/40 inline-flex items-center gap-2"
          >
            <span>Evaluar Viabilidad y Cotizar con IA</span>
          </button>
          <button
            onClick={onOpenLeadModal}
            aria-label="Abrir evaluación y cotización con IA"
            className="btn-lime w-11 h-11 rounded-full cursor-pointer hover:scale-105 transition-transform shrink-0"
          >
            <ArrowUpRight className="w-5 h-5 text-liquid-abyss" />
          </button>
        </div>
      </div>
    </header>
  );
}
