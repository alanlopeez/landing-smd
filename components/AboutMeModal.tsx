"use client";

import React from "react";
import Image from "next/image";
import { X, Cpu, Search, PlayCircle, Award } from "lucide-react";

interface AboutMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLeadModal: () => void;
}

export default function AboutMeModal({ isOpen, onClose, onOpenLeadModal }: AboutMeModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-liquid-kelp border border-white/10 rounded-2xl p-6 sm:p-10 text-silver-mist shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-silver-mist hover:text-white rounded-full hover:bg-white/5"
          aria-label="Cerrar modal de Sobre Mí"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border border-white/20 bg-liquid-abyss flex-shrink-0">
              <Image
                src="/images/alan-lopez.png"
                alt="Alan López - Productor Digital"
                fill
                sizes="144px"
                className="object-cover"
              />
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] uppercase tracking-widest text-bioluminescent-lime font-mono">
                Pestaña Emergente Oficial
              </span>
              <h3 className="text-2xl font-medium text-platinum font-matter">
                Soy Alan López, Productor Digital
              </h3>
              <p className="text-xs text-silver-mist">
                Especialista en Marketing Estratégico, Diseño Alta Gama y Prompt Engineering con IA.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-liquid-mist leading-relaxed font-matter border-t border-white/10 pt-4">
            <p>
              Mi enfoque es 100% práctico, autodidacta y orientado a resultados. Me apasiona integrarme a proyectos desafiantes donde pueda fusionar el marketing estratégico, el diseño y el prompt engineering para crear soluciones escalables impulsadas por Inteligencia Artificial.
            </p>
            <p>
              No solo diseño estrategias; las convierto en crecimiento comercial tangible. Mi experiencia se traduce en los siguientes hitos:
            </p>
          </div>

          {/* Key Achievements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-lg bg-liquid-abyss border border-white/5 space-y-1">
              <div className="text-xl font-matter font-medium text-lavender-phosphor">
                +$500 Millones
              </div>
              <p className="text-[11px] text-silver-mist">De pesos de facturación generada en ventas.</p>
            </div>

            <div className="p-3.5 rounded-lg bg-liquid-abyss border border-white/5 space-y-1">
              <div className="text-xl font-matter font-medium text-lavender-phosphor">
                +70%
              </div>
              <p className="text-[11px] text-silver-mist">De tasa de conversión, optimizando cada etapa.</p>
            </div>

            <div className="p-3.5 rounded-lg bg-liquid-abyss border border-white/5 space-y-1">
              <div className="text-xl font-matter font-medium text-lavender-phosphor">
                +5.000
              </div>
              <p className="text-[11px] text-silver-mist">Clientes gestionados de manera eficiente.</p>
            </div>

            <div className="p-3.5 rounded-lg bg-liquid-abyss border border-white/5 space-y-1">
              <div className="text-sm font-matter font-medium text-platinum flex items-center gap-1.5">
                <Search className="w-4 h-4 text-bioluminescent-lime" />
                SEO Orgánico Líder
              </div>
              <p className="text-[11px] text-silver-mist">Ubicando la marca en el top de los motores de búsqueda.</p>
            </div>
          </div>

          <p className="text-xs text-silver-mist pt-2">
            Combino la creatividad visual con el análisis de datos y la automatización para escalar negocios. Si buscas llevar tu proyecto al siguiente nivel con una visión digital integral, hagámoslo realidad.
          </p>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => {
                onClose();
                onOpenLeadModal();
              }}
              className="btn-aurora text-xs w-full sm:w-auto"
            >
              Solicitar Propuesta a Alan López
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
