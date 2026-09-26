"use client";

import React, { useState, useEffect } from "react";
import QualificationModal from "./QualificationModal";

export default function WhatsAppButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>(
    "Servicios B2B / Consultoría empresarial"
  );

  // Listen to custom trigger event to open the qualification modal from any CTA
  useEffect(() => {
    const handleCustomOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ businessType?: string }>;
      if (customEvent.detail?.businessType) {
        setSelectedBusinessType(customEvent.detail.businessType);
      }
      setIsModalOpen(true);
    };

    window.addEventListener("open-qualification-modal", handleCustomOpen);
    return () => {
      window.removeEventListener("open-qualification-modal", handleCustomOpen);
    };
  }, []);

  return (
    <>
      <aside aria-label="Contacto calificado con Alan López">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          aria-label="Evaluar viabilidad y cotizar con IA antes de chatear por WhatsApp"
          title="Evaluar viabilidad y cotizar con IA antes de chatear por WhatsApp"
          className="floating-whatsapp-container fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-liquid-abyss rounded-full border-0 bg-transparent p-0"
        >
          {/* Tooltip on Mobile */}
          <span className="floating-whatsapp-badge sm:hidden absolute right-full mr-2.5 pointer-events-none opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-focus:opacity-100 group-focus:translate-x-0 transition-all duration-200 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-liquid-deep/95 border border-white/10 backdrop-blur-md text-platinum text-[11px] font-matter font-medium whitespace-nowrap shadow-xl">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#25D366]" />
            </span>
            <span>Evaluar con IA</span>
          </span>

          {/* Discreet Badge on Desktop */}
          <span className="floating-whatsapp-badge hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-liquid-deep/95 border border-white/10 backdrop-blur-md text-platinum text-xs font-matter font-medium tracking-wide transition-all duration-300 group-hover:border-[#25D366]/50 group-hover:text-white group-hover:-translate-y-0.5 shadow-xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]" />
            </span>
            <span>Evaluar con IA</span>
          </span>

          {/* WhatsApp Floating Icon Button */}
          <div className="floating-whatsapp-btn w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] transition-all flex items-center justify-center text-white shrink-0 shadow-xl group-hover:scale-105">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 sm:w-7 sm:h-7 text-white"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.2.3-.778.978-.954 1.179-.175.2-.351.226-.652.075s-1.272-.469-2.423-1.496c-.895-.798-1.5-1.784-1.676-2.085-.175-.3-.019-.463.132-.612.136-.135.301-.351.452-.527.15-.175.201-.3.301-.501.101-.2.05-.376-.025-.527s-.678-1.631-.929-2.234c-.244-.587-.492-.507-.678-.517l-.578-.01c-.2 0-.527.075-.803.376s-1.054 1.029-1.054 2.509 1.079 2.91 1.23 3.11c.15.201 2.122 3.24 5.141 4.542.718.31 1.279.495 1.716.634.721.229 1.377.197 1.896.12.578-.086 1.78-.728 2.031-1.431.251-.703.251-1.305.176-1.431-.076-.126-.277-.201-.578-.351zM12.004 0C5.378 0 .008 5.37.008 11.996c0 2.112.551 4.17 1.598 5.984L0 24l6.192-1.624c1.75 1.01 3.754 1.542 5.807 1.543 6.626 0 11.996-5.37 11.996-11.997 0-3.205-1.248-6.218-3.515-8.486C18.212 1.248 15.202 0 12.004 0zm0 21.968c-1.786 0-3.535-.48-5.059-1.388l-.363-.215-3.673.963.98-3.58-.236-.375c-.998-1.587-1.524-3.424-1.524-5.357 0-5.503 4.478-9.98 9.98-9.98 2.666 0 5.172 1.038 7.057 2.924 1.886 1.886 2.924 4.392 2.924 7.056-.002 5.503-4.48 9.98-9.985 9.98z" />
            </svg>
          </div>
        </button>
      </aside>

      {/* Qualification Modal Triggered by WhatsApp Floating Button */}
      <QualificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultBusinessType={selectedBusinessType}
        sourceContext="Floating WhatsApp Qualifier"
      />
    </>
  );
}
