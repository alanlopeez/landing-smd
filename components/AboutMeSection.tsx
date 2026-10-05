"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight, Sparkles, CheckCircle2 } from "lucide-react";

interface AboutMeSectionProps {
  onOpenLeadModal: () => void;
}

export default function AboutMeSection({ onOpenLeadModal }: AboutMeSectionProps) {
  return (
    <section
      id="sobre-mi"
      className="relative w-full bg-liquid-abyss py-20 sm:py-28 px-6 border-t border-white/5 overflow-hidden scroll-mt-16"
    >
      {/* Background soft ambient glow */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[300px] bg-bioluminescent-lime/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        {/* Section Tag */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-liquid-kelp border border-white/10 text-xs font-mono uppercase tracking-widest text-bioluminescent-lime">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Perfil Profesional</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-medium text-platinum font-matter tracking-tight">
            Sobre mí
          </h2>
        </div>

        {/* Bio Card */}
        <div className="surface-card p-5 sm:p-8 md:p-12 lg:p-14 bg-liquid-deep/90 border border-white/10 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            {/* Alan López Photo */}
            <div className="md:col-span-5 flex flex-col items-center text-center space-y-3">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-2 border-bioluminescent-lime/30 bg-liquid-kelp p-1 shadow-2xl">
                <Image
                  src="/images/alan-lopez.png"
                  alt="Alan López - Productor Digital"
                  fill
                  sizes="(max-width: 768px) 220px, 260px"
                  className="rounded-full object-cover"
                  priority
                />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-lg font-medium text-platinum font-matter">
                  Alan López
                </h3>
                <p className="text-xs uppercase tracking-wider text-bioluminescent-lime font-mono">
                  Productor Digital
                </p>
              </div>
            </div>

            {/* Exact Content from Rediseño de landing.pdf */}
            <div className="md:col-span-7 space-y-6 text-center md:text-left">
              <p className="text-lg sm:text-2xl text-platinum font-matter leading-relaxed font-normal">
                Soy <strong className="text-bioluminescent-lime font-medium">Alan López</strong>, Productor Digital. Mi enfoque es 100% práctico y orientado a resultados.
              </p>

              <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-liquid-abyss border border-white/10 text-xs text-silver-mist font-matter">
                  <CheckCircle2 className="w-3.5 h-3.5 text-bioluminescent-lime" />
                  <span>Enfoque 100% Práctico</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-liquid-abyss border border-white/10 text-xs text-silver-mist font-matter">
                  <CheckCircle2 className="w-3.5 h-3.5 text-bioluminescent-lime" />
                  <span>Orientado a Resultados</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4 flex items-center justify-center md:justify-start gap-3">
                <button
                  onClick={onOpenLeadModal}
                  className="btn-aurora text-xs sm:text-sm font-semibold tracking-wider px-7 py-3.5 rounded-full transition-transform hover:scale-[1.02] cursor-pointer shadow-lg inline-flex items-center gap-2 text-liquid-abyss"
                >
                  <span>+ Comenzar mi rediseño</span>
                </button>
                <button
                  onClick={onOpenLeadModal}
                  aria-label="Comenzar mi rediseño con Alan López"
                  className="btn-lime w-11 h-11 rounded-full cursor-pointer hover:scale-105 transition-transform shrink-0"
                >
                  <ArrowUpRight className="w-5 h-5 text-liquid-abyss" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
