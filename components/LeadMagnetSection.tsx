"use client";

import React from "react";
import Image from "next/image";
import { Download, Sparkles, CheckCircle } from "lucide-react";

interface LeadMagnetSectionProps {
  onOpenMagnetModal?: () => void;
}

export default function LeadMagnetSection({ onOpenMagnetModal }: LeadMagnetSectionProps) {
  return (
    <section
      id="guia-ia"
      className="relative w-full bg-liquid-abyss py-24 px-6 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        <div className="surface-card p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-bioluminescent-lime/5 rounded-full filter blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bioluminescent-lime/10 text-bioluminescent-lime text-xs uppercase tracking-wider font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Recurso Gratuito para Emprendedores y Empresas
              </div>

              <h2 className="text-3xl sm:text-5xl font-medium text-platinum font-matter tracking-tight leading-tight">
                ¿Te interesa saber más sobre las soluciones con Inteligencia Artificial en tu negocio?
              </h2>

              <p className="text-base sm:text-lg text-silver-mist leading-relaxed font-matter">
                Descarga la guía gratuita de cómo integrar sistemas multi-agentes en tu negocio. Aprende a estructurar un flujo automatizado de atención, cotización y cierre sin conocimientos de programación.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-liquid-mist">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-bioluminescent-lime flex-shrink-0" />
                  <span>Casos de estudio reales y arquitecturas probadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-bioluminescent-lime flex-shrink-0" />
                  <span>Plantillas de prompts para agentes cotizadores</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-bioluminescent-lime flex-shrink-0" />
                  <span>Conexión de formularios inteligentes a Google Sheets</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-bioluminescent-lime flex-shrink-0" />
                  <span>Guía paso a paso en formato PDF descargable</span>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={onOpenMagnetModal}
                  className="btn-aurora text-xs py-3.5 px-7 cursor-pointer uppercase tracking-wider font-semibold flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>DESCARGAR GUÍA GRATUITA AHORA</span>
                </button>
              </div>
            </div>

            {/* Right Visual (Mockup PDF Asset) */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div
                onClick={onOpenMagnetModal}
                className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-square flex items-center justify-center cursor-pointer group"
                title="Haz clic para descargar la guía gratuita"
              >
                <div className="absolute inset-0 bg-bioluminescent-lime/15 rounded-2xl filter blur-2xl pointer-events-none group-hover:bg-bioluminescent-lime/25 transition-all duration-500" />
                <Image
                  src="/images/mockup-guia-pdf.jpg"
                  alt="Mockup de la Guía: Cómo integrar Sistemas Multi-Agentes en tu Negocio"
                  width={340}
                  height={340}
                  className="relative z-10 w-full h-auto object-cover rounded-xl border border-white/10 shadow-2xl shadow-black/80 transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
