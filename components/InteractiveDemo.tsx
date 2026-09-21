"use client";

import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, Play } from "lucide-react";

interface InteractiveDemoProps {
  onOpenLeadModal: () => void;
}

export default function InteractiveDemo({ onOpenLeadModal }: InteractiveDemoProps) {
  return (
    <section
      id="demo"
      className="relative w-full bg-liquid-abyss py-24 px-6 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <p className="text-xs uppercase tracking-[0.15em] text-silver-mist font-matter font-medium">
            SIMULADOR EN TIEMPO REAL · PROYECTO DEMO
          </p>
          <h2 className="text-3xl sm:text-5xl font-medium text-platinum font-matter tracking-tight">
            ¿Cómo funciona un sitio con sistemas multi-agentes y cotizadores automáticos?
          </h2>
          <p className="text-sm sm:text-base text-silver-mist leading-relaxed font-matter">
            Comprueba en vivo cómo la automatización de ventas califica prospectos, delega la recolección de datos y aumenta la tasa de conversión en milisegundos.
          </p>
        </div>

        {/* Video Embed Card Container */}
        <div className="surface-card p-6 sm:p-8 lg:p-10 max-w-5xl mx-auto space-y-6">
          {/* Top Bar inside the Card */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-white/5">
            <div className="flex items-center gap-2.5 text-xs font-mono uppercase tracking-wider text-bioluminescent-lime">
              <span className="w-2 h-2 rounded-full bg-bioluminescent-lime animate-pulse" />
              <span>PROYECTO DEMO EN VIVO · SISTEMA MULTI-AGENTES</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-silver-mist">
              <Play className="w-3 h-3 text-bioluminescent-lime fill-current" />
              <span>Demostración en Video</span>
            </div>
          </div>

          {/* 16:9 Responsive Video Player Container */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-liquid-deep border border-white/10 shadow-2xl">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/DhF6n7KLbns?si=ZuSGY2B_HKFP_Yoo"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>

          {/* Bottom Card CTA Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-base font-medium text-platinum font-matter">
                ¿Te gustaría implementar este sistema en tu negocio?
              </h3>
              <p className="text-xs text-silver-mist font-matter">
                Estructuramos tu sitio web con cotizadores automáticos y asistentes conversacionales listo en 24 horas.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-shrink-0">
              <button
                onClick={onOpenLeadModal}
                className="w-full sm:w-auto btn-aurora text-xs py-3 px-6 justify-center uppercase tracking-wider cursor-pointer"
              >
                <span>Solicitar una llamada con esta DEMO</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Trust Footnote */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 pt-2 border-t border-white/5 text-[11px] text-silver-mist/70">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-bioluminescent-lime" />
              <span>Sin compromiso de compra. Cotización transparente.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-bioluminescent-lime" />
              <span>Entrega de primera versión en 24 horas.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
