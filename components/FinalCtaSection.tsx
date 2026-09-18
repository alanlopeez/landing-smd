"use client";

import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, Clock } from "lucide-react";

interface FinalCtaSectionProps {
  onOpenLeadModal: () => void;
}

export default function FinalCtaSection({ onOpenLeadModal }: FinalCtaSectionProps) {
  return (
    <section className="relative w-full bg-liquid-abyss py-24 sm:py-32 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Recessed Well (Auros Liquid Deep surface #011d1c) */}
        <div className="surface-recessed py-20 sm:py-28 px-6 sm:px-12 lg:px-20 text-center relative overflow-hidden">
          {/* Subtle Ambient Water Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#003734]/10 to-transparent pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bioluminescent-lime/10 border border-bioluminescent-lime/20 text-bioluminescent-lime text-xs uppercase tracking-widest font-mono">
              <Clock className="w-3.5 h-3.5" />
              DESPLIEGUE PRIORITARIO EN 24 HORAS
            </div>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-medium text-platinum font-matter tracking-[-0.04em] leading-[1.02]">
              ¿Le interesa tener su sitio web publicado?
            </h2>

            <p className="text-base sm:text-xl text-liquid-mist font-matter leading-relaxed max-w-2xl mx-auto">
              Oferta especial: <span className="text-platinum font-semibold">Comienza hoy, creamos tu sitio en 24 hs</span> con sistemas multi-agentes de captación y diseño de alta gama.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onOpenLeadModal}
                className="btn-aurora text-xs py-4 px-8 w-full sm:w-auto cursor-pointer"
              >
                <span>Solicitar una llamada ahora</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-silver-mist/80">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-bioluminescent-lime" />
                <span>Garantía de Fidelidad de Diseño</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-bioluminescent-lime" />
                <span>Sin costos ocultos ni permanencia</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
