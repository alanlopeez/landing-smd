"use client";

import React, { useState } from "react";
import { X, Sparkles, Send, CheckCircle2, MessageCircle, Clock, ShieldCheck } from "lucide-react";

interface RedesignLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRIORITY_OPTIONS = [
  "Rediseñar mi página actual (se ve anticuada o no refleja la calidad del producto).",
  "Lanzamiento de un nuevo producto o colección.",
  "Mejorar la conversión de mis campañas publicitarias activas.",
  "Solo estoy explorando opciones / precios por ahora.",
];

const BUDGET_OPTIONS = [
  "Menos de $150 USD",
  "$200 – $400 USD",
  "$500 – $1.000+ USD",
];

const WHATSAPP_PHONE = "5491127887093";

function sanitizeInput(str: string): string {
  return str.replace(/[<>]/g, "").replace(/javascript:/gi, "").trim();
}

export function buildRedesignWhatsAppUrl(data: {
  name: string;
  websiteOrProfile: string;
  projectPriority: string;
  budgetRange: string;
}): string {
  const lines = [
    "Hola Alan, completé el formulario de rediseño de landing page en tu web:",
    `• Nombre: ${data.name.trim()}`,
    `• Enlace / Perfil: ${data.websiteOrProfile.trim()}`,
    `• Prioridad: ${data.projectPriority}`,
    `• Rango de inversión: ${data.budgetRange}`,
    "",
    "Me gustaría coordinar la primera propuesta interactiva en 48 hs.",
  ];
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export default function RedesignLeadModal({ isOpen, onClose }: RedesignLeadModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    websiteOrProfile: "",
    projectPriority: PRIORITY_OPTIONS[0],
    budgetRange: BUDGET_OPTIONS[1],
    honeypot: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [generatedWaUrl, setGeneratedWaUrl] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Anti-bot check
    if (formData.honeypot) {
      return;
    }

    const cleanName = sanitizeInput(formData.name);
    const cleanLink = sanitizeInput(formData.websiteOrProfile);

    if (!cleanName) {
      setErrorMessage("Por favor ingresa tu nombre.");
      return;
    }

    if (!cleanLink) {
      setErrorMessage("Por favor ingresa el enlace a tu sitio web o perfil principal.");
      return;
    }

    setStatus("loading");

    const payload = {
      name: cleanName,
      websiteOrProfile: cleanLink,
      projectPriority: formData.projectPriority,
      budgetRange: formData.budgetRange,
      submittedAt: new Date().toISOString(),
      source: "Landing SMD - Rediseño Modal",
    };

    const waUrl = buildRedesignWhatsAppUrl({
      name: cleanName,
      websiteOrProfile: cleanLink,
      projectPriority: formData.projectPriority,
      budgetRange: formData.budgetRange,
    });
    setGeneratedWaUrl(waUrl);

    // Background sync with Google Apps Script if configured
    const scriptUrl =
      process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_LEAD_URL ||
      process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL ||
      "https://script.google.com/macros/s/AKfycbzbD3jkCnbEuRVGZZrdPxPtJLZ_fTrtfhDDf2W7YPQN3xHut5nldiyae1ljCQ1VXYzBfw/exec";

    try {
      await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});
    } catch {
      // Ignorar fallback de red para no detener la redirección a WhatsApp
    }

    setStatus("success");

    // Open WhatsApp automatically
    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setErrorMessage("");
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-redesign-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-liquid-abyss/85 backdrop-blur-md animate-fadeIn"
    >
      {/* Backdrop overlay to close when clicking outside */}
      <div
        className="fixed inset-0"
        onClick={handleReset}
        aria-hidden="true"
      />

      {/* Modal Dialog with Max-Height and Internal Scrolling for All Screens */}
      <div className="relative z-10 w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl bg-liquid-deep border border-white/15 text-silver-mist shadow-2xl overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-bioluminescent-lime/10 blur-[50px] pointer-events-none" />

        {/* Modal Header (Fixed at top of dialog) */}
        <div className="relative shrink-0 p-5 sm:p-6 pb-4 border-b border-white/10 flex items-start justify-between gap-4">
          <div className="space-y-1.5 pr-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-bioluminescent-lime/10 border border-bioluminescent-lime/20 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-bioluminescent-lime">
              <Sparkles className="w-3 h-3" />
              <span>Comenzar mi rediseño</span>
            </div>
            <h3 id="modal-redesign-title" className="text-lg sm:text-xl md:text-2xl font-matter font-medium text-platinum tracking-tight leading-snug">
              Impulsa tu presencia digital con alto impacto
            </h3>
            <p className="text-xs sm:text-sm text-bioluminescent-lime/90 font-matter leading-normal">
              Primera propuesta interactiva en 48 hs. Entrega final afinada en 3 a 5 días hábiles.
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={handleReset}
            aria-label="Cerrar ventana"
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-silver-mist hover:text-white transition-colors cursor-pointer shrink-0 mt-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {status === "success" ? (
            /* SUCCESS STATE */
            <div className="py-4 text-center space-y-5">
              <div className="w-14 h-14 mx-auto rounded-full bg-bioluminescent-lime/20 border border-bioluminescent-lime/40 flex items-center justify-center text-bioluminescent-lime">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xl sm:text-2xl font-matter font-medium text-platinum">
                  ¡Solicitud Registrada con Éxito!
                </h4>
                <p className="text-xs sm:text-sm text-silver-mist max-w-md mx-auto">
                  Hemos preparado el resumen de tus respuestas para iniciar de inmediato la evaluación técnica.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-liquid-abyss/80 border border-white/10 text-left text-xs space-y-2 font-matter">
                <div className="flex items-center gap-2 text-bioluminescent-lime font-mono uppercase text-[11px] pb-1 border-b border-white/5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Primera propuesta interactiva en 48 hs</span>
                </div>
                <p><strong className="text-platinum">Nombre:</strong> {formData.name}</p>
                <p><strong className="text-platinum">Enlace / Perfil:</strong> {formData.websiteOrProfile}</p>
                <p><strong className="text-platinum">Prioridad:</strong> {formData.projectPriority}</p>
                <p><strong className="text-platinum">Inversión prevista:</strong> {formData.budgetRange}</p>
              </div>

              <div className="space-y-3 pt-1">
                <a
                  href={generatedWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 py-3 px-5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-liquid-abyss font-semibold text-xs sm:text-sm transition-all shadow-lg hover:shadow-[#25D366]/30 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Continuar por WhatsApp (5491127887093)</span>
                </a>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-2 text-xs text-silver-mist hover:text-white transition-colors"
                >
                  Cerrar ventana
                </button>
              </div>
            </div>
          ) : (
            /* FORM STATE */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot field for bot protection */}
              <input
                type="text"
                name="website_honeypot_field"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/30 text-red-200 text-xs font-matter">
                  {errorMessage}
                </div>
              )}

              {/* Field 1: Nombre */}
              <div className="space-y-1">
                <label htmlFor="lead-name" className="block text-xs font-matter font-medium text-platinum">
                  *Nombre:
                </label>
                <input
                  id="lead-name"
                  type="text"
                  required
                  placeholder="Tu nombre y apellido"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-liquid-abyss/90 border border-white/10 text-platinum text-xs sm:text-sm placeholder:text-slate-deep focus:outline-none focus:border-bioluminescent-lime transition-colors"
                />
              </div>

              {/* Field 2: Enlace a sitio web actual o perfil */}
              <div className="space-y-1">
                <label htmlFor="lead-link" className="block text-xs font-matter font-medium text-platinum">
                  *¿Cuál es el enlace a tu sitio web actual o perfil principal de producto? (Instagram, tienda, etc.)
                </label>
                <input
                  id="lead-link"
                  type="text"
                  required
                  placeholder="https://... o @usuario-de-instagram"
                  value={formData.websiteOrProfile}
                  onChange={(e) => setFormData({ ...formData, websiteOrProfile: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-liquid-abyss/90 border border-white/10 text-platinum text-xs sm:text-sm placeholder:text-slate-deep focus:outline-none focus:border-bioluminescent-lime transition-colors"
                />
              </div>

              {/* Field 3: Prioridad principal */}
              <div className="space-y-1.5">
                <label className="block text-xs font-matter font-medium text-platinum">
                  *¿Cuál es la prioridad principal para este proyecto?
                </label>
                <div className="space-y-1.5">
                  {PRIORITY_OPTIONS.map((option) => (
                    <label
                      key={option}
                      className={`flex items-start gap-2.5 p-2 sm:p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                        formData.projectPriority === option
                          ? "bg-liquid-kelp/60 border-bioluminescent-lime/40 text-platinum"
                          : "bg-liquid-abyss/60 border-white/5 text-silver-mist hover:border-white/15"
                      }`}
                    >
                      <input
                        type="radio"
                        name="projectPriority"
                        checked={formData.projectPriority === option}
                        onChange={() => setFormData({ ...formData, projectPriority: option })}
                        className="mt-0.5 accent-[#cef79e]"
                      />
                      <span className="leading-snug">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Field 4: Rango de inversión */}
              <div className="space-y-1.5">
                <label className="block text-xs font-matter font-medium text-platinum">
                  *¿Qué rango de inversión tienes asignado para el desarrollo de la página?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {BUDGET_OPTIONS.map((budget) => (
                    <label
                      key={budget}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                        formData.budgetRange === budget
                          ? "bg-liquid-kelp/60 border-bioluminescent-lime/40 text-platinum font-medium"
                          : "bg-liquid-abyss/60 border-white/5 text-silver-mist hover:border-white/15"
                      }`}
                    >
                      <input
                        type="radio"
                        name="budgetRange"
                        checked={formData.budgetRange === budget}
                        onChange={() => setFormData({ ...formData, budgetRange: budget })}
                        className="accent-[#cef79e]"
                      />
                      <span>{budget}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3 px-5 rounded-xl bg-bioluminescent-lime hover:bg-[#d8fba9] text-liquid-abyss font-semibold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {status === "loading" ? (
                    <span>Procesando solicitud...</span>
                  ) : (
                    <>
                      <span>Enviar y Abrir WhatsApp (+54 9 11 2788-7093)</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-deep">
                  <ShieldCheck className="w-3.5 h-3.5 text-bioluminescent-lime" />
                  <span>Tus datos son 100% confidenciales. Sin spam.</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
