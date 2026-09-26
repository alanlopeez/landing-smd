"use client";

import React from "react";
import { X, Sparkles } from "lucide-react";
import LeadMagnetForm from "./LeadMagnetForm";
import QualificationModal from "./QualificationModal";

export type ModalType = "lead" | "magnet" | "about" | "privacy" | "terms" | "refund" | null;

interface ConversionModalsProps {
  activeModal: ModalType;
  onClose: () => void;
  defaultBusinessType?: string;
  sourceContext?: string;
  initialVolume?: string;
  initialBudget?: string;
}

export default function ConversionModals({
  activeModal,
  onClose,
  defaultBusinessType = "Servicios B2B / Consultoría empresarial",
  sourceContext = "Landing CTA Modal",
  initialVolume,
  initialBudget,
}: ConversionModalsProps) {
  if (!activeModal) return null;

  // Si el modal activo es "lead", renderizamos el nuevo Calificador B2B
  if (activeModal === "lead") {
    return (
      <QualificationModal
        isOpen={true}
        onClose={onClose}
        defaultBusinessType={defaultBusinessType}
        sourceContext={sourceContext}
        initialVolume={initialVolume}
        initialBudget={initialBudget}
      />
    );
  }

  // Si el modal activo es "magnet", renderizamos el descargador de Guía
  if (activeModal === "magnet") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="magnet-modal-title"
      >
        <div
          className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-liquid-kelp border border-white/10 rounded-2xl p-6 sm:p-8 text-silver-mist shadow-2xl transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-silver-mist/70 hover:text-white transition-colors rounded-full hover:bg-white/5"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bioluminescent-lime/10 text-bioluminescent-lime text-xs tracking-wide uppercase font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Guía Gratuita Exclusiva
            </div>
            <h2
              id="magnet-modal-title"
              className="text-2xl sm:text-3xl font-medium text-platinum font-matter tracking-tight"
            >
              Integración de Sistemas Multi-Agentes
            </h2>
            <p className="text-sm text-silver-mist mt-1 leading-relaxed">
              Descubre cómo automatizar la atención a clientes, cotizaciones en tiempo real y filtrado de leads sin fricción operativa.
            </p>
          </div>

          <LeadMagnetForm idPrefix="modal-" />
        </div>
      </div>
    );
  }

  return null;
}
