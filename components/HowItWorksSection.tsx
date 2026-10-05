"use client";

import React from "react";
import { Play, Clock, ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react";

interface HowItWorksSectionProps {
  onOpenLeadModal: () => void;
}

export default function HowItWorksSection({ onOpenLeadModal }: HowItWorksSectionProps) {
  return (
    <section
      id="como-funciona"
      className="relative w-full bg-liquid-deep py-20 sm:py-28 px-6 border-t border-white/5 overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-bioluminescent-lime/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-liquid-abyss border border-white/10 text-xs font-mono uppercase tracking-widest text-bioluminescent-lime">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Metodología Ágil</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-medium text-platinum font-matter tracking-tight">
            ¿Cómo funciona?
          </h2>

          <p className="text-base sm:text-lg text-silver-mist font-matter">
            Vea un proyecto DEMO:
          </p>
        </div>

        {/* YouTube Video Container (16:9 Responsive Cinema Player) */}
        <div className="relative mx-auto w-full max-w-4xl rounded-2xl overflow-hidden bg-liquid-abyss border border-white/15 p-2 sm:p-3 shadow-2xl group">
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/60">
            <iframe
              className="w-full h-full border-0"
              src="https://www.youtube.com/embed/M5_QicGRh-s?si=STNEorh4u72SuDNJ"
              title="YouTube video player - Proyecto DEMO"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>

        {/* Bottom CTA Block with exact copy from PDF */}
        <div className="p-5 sm:p-8 md:p-10 rounded-2xl bg-liquid-abyss/80 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-medium text-platinum font-matter">
              Hablame hoy para tener tu sitio web publicado
            </h3>
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-bioluminescent-lime">
              <Clock className="w-4 h-4" />
              <span>Tiempo de Entrega: 3 a 5 días hábiles.</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLeadModal}
              className="btn-aurora text-xs sm:text-sm font-semibold tracking-wider px-7 py-3.5 rounded-full transition-transform hover:scale-[1.02] cursor-pointer shadow-lg inline-flex items-center gap-2 text-liquid-abyss"
            >
              <span>+ Comenzar mi rediseño</span>
            </button>
            <button
              onClick={onOpenLeadModal}
              aria-label="Comenzar mi rediseño"
              className="btn-lime w-11 h-11 rounded-full cursor-pointer hover:scale-105 transition-transform shrink-0"
            >
              <ArrowUpRight className="w-5 h-5 text-liquid-abyss" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
