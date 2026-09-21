"use client";

import React, { useState } from "react";
import { X, CheckCircle2, AlertCircle, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import LeadMagnetForm from "./LeadMagnetForm";

export type ModalType = "lead" | "magnet" | "about" | "privacy" | "terms" | "refund" | null;

interface ConversionModalsProps {
  activeModal: ModalType;
  onClose: () => void;
}

// Sanitization to prevent XSS / malicious injection
function sanitizeInput(str: string): string {
  return str
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .trim();
}

export default function ConversionModals({ activeModal, onClose }: ConversionModalsProps) {
  // Form 1: Lead Qualifier State
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    volume: "1 a 10",
    budget: "Entre u$d1500 y u$d3000",
    timeline: "Lo antes posible",
    consent: true,
    honeypot: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!activeModal) return null;

  // Endpoint fallback or environment variables
  const LEAD_SCRIPT_URL =
    process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_LEAD_URL ||
    process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL ||
    "https://script.google.com/macros/s/AKfycbzbD3jkCnbEuRVGZZrdPxPtJLZ_fTrtfhDDf2W7YPQN3xHut5nldiyae1ljCQ1VXYzBfw/exec";

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (leadForm.honeypot) return; // Anti-bot honeypot caught a bot

    if (!leadForm.name || !leadForm.email || !leadForm.phone || !leadForm.whatsapp) {
      setErrorMessage("Por favor complete todos los campos obligatorios.");
      return;
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leadForm.email)) {
      setErrorMessage("Por favor ingrese un correo electrónico válido.");
      return;
    }

    if (!leadForm.consent) {
      setErrorMessage("Debe aceptar los términos de contacto para continuar.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    const payload = {
      type: "lead",
      name: sanitizeInput(leadForm.name),
      email: sanitizeInput(leadForm.email),
      phone: sanitizeInput(leadForm.phone),
      whatsapp: sanitizeInput(leadForm.whatsapp),
      volume: sanitizeInput(leadForm.volume),
      budget: sanitizeInput(leadForm.budget),
      timeline: sanitizeInput(leadForm.timeline),
      timestamp: new Date().toISOString(),
    };

    try {
      // Send as POST JSON
      await fetch(LEAD_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      // Redirección directa a la URL de conversión para Google Ads
      window.location.href = "/gracias";
    } catch {
      // Apps Script redirection may trigger catch in browser while still successfully recording
      window.location.href = "/gracias";
    }
  };

  const resetAndClose = () => {
    setStatus("idle");
    setErrorMessage("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={resetAndClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-liquid-kelp border border-white/10 rounded-2xl p-6 sm:p-8 text-silver-mist shadow-none transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-5 right-5 p-2 text-silver-mist/70 hover:text-white transition-colors rounded-full hover:bg-white/5"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Screen for Lead Qualifier */}
        {status === "success" && activeModal === "lead" && (
          <div className="py-8 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 mx-auto rounded-full bg-bioluminescent-lime/10 flex items-center justify-center text-bioluminescent-lime">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-medium text-platinum font-matter">
              ¡Solicitud Recibida con Éxito!
            </h3>
            <p className="text-silver-mist text-sm max-w-md mx-auto leading-relaxed">
              Gracias por tu confianza. Alan López revisará tu información técnica y te contactará en menos de 24 horas para coordinar tu propuesta.
            </p>
            <div className="pt-4">
              <button onClick={resetAndClose} className="btn-aurora text-xs">
                Entendido, volver a la página
              </button>
            </div>
          </div>
        )}

        {/* MODAL 1: CALIFICADOR DE LEAD COMPLETO */}
        {activeModal === "lead" && status !== "success" && (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bioluminescent-lime/10 text-bioluminescent-lime text-xs tracking-wide uppercase font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Oferta Especial 24 Horas
              </div>
              <h2 className="text-2xl sm:text-3xl font-medium text-platinum font-matter tracking-tight">
                Solicitar una llamada
              </h2>
              <p className="text-sm text-silver-mist mt-1">
                Comienza hoy, creamos tu sitio en 24 hs con sistemas multi-agentes y diseño alta gama.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLeadSubmit} className="space-y-4">
              {/* Honeypot anti-spam */}
              <input
                type="text"
                name="website_url_hp"
                value={leadForm.honeypot}
                onChange={(e) => setLeadForm({ ...leadForm, honeypot: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-platinum mb-1.5 uppercase tracking-wide">
                    * Nombre:
                  </label>
                  <input
                    type="text"
                    required
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                    placeholder="Ej. Martín González"
                    className="w-full px-3.5 py-2.5 rounded-md bg-liquid-abyss border border-white/10 text-platinum text-sm focus:outline-none focus:border-bioluminescent-lime transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-platinum mb-1.5 uppercase tracking-wide">
                    * E-mail:
                  </label>
                  <input
                    type="email"
                    required
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    placeholder="nombre@empresa.com"
                    className="w-full px-3.5 py-2.5 rounded-md bg-liquid-abyss border border-white/10 text-platinum text-sm focus:outline-none focus:border-bioluminescent-lime transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-platinum mb-1.5 uppercase tracking-wide">
                    * Teléfono:
                  </label>
                  <input
                    type="tel"
                    required
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                    placeholder="+54 9 11 ..."
                    className="w-full px-3.5 py-2.5 rounded-md bg-liquid-abyss border border-white/10 text-platinum text-sm focus:outline-none focus:border-bioluminescent-lime transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-platinum mb-1.5 uppercase tracking-wide">
                    * Número de WhatsApp:
                  </label>
                  <input
                    type="tel"
                    required
                    value={leadForm.whatsapp}
                    onChange={(e) => setLeadForm({ ...leadForm, whatsapp: e.target.value })}
                    placeholder="+54 9 11 ..."
                    className="w-full px-3.5 py-2.5 rounded-md bg-liquid-abyss border border-white/10 text-platinum text-sm focus:outline-none focus:border-bioluminescent-lime transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-platinum mb-1.5">
                  * Actualmente, ¿cuál es el volumen de consultas o solicitudes que gestiona su equipo por día?
                </label>
                <select
                  value={leadForm.volume}
                  onChange={(e) => setLeadForm({ ...leadForm, volume: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-md bg-liquid-abyss border border-white/10 text-platinum text-sm focus:outline-none focus:border-bioluminescent-lime transition-colors"
                >
                  <option value="1 a 10">1 a 10 consultas por día</option>
                  <option value="11 a 50">11 a 50 consultas por día</option>
                  <option value="Más de 50">Más de 50 consultas por día</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-platinum mb-1.5">
                  * Para adaptar la propuesta técnica a la escala de su negocio, ¿qué rango de inversión tiene contemplado para este proyecto?
                </label>
                <select
                  value={leadForm.budget}
                  onChange={(e) => setLeadForm({ ...leadForm, budget: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-md bg-liquid-abyss border border-white/10 text-platinum text-sm focus:outline-none focus:border-bioluminescent-lime transition-colors"
                >
                  <option value="Menos de u$d1500">Menos de u$d1500</option>
                  <option value="Entre u$d1500 y u$d3000">Entre u$d1500 y u$d3000</option>
                  <option value="Más de u$d5000">Más de u$d5000</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-platinum mb-1.5">
                  * ¿Cuál es su horizonte de tiempo ideal para tener esta solución operativa?
                </label>
                <select
                  value={leadForm.timeline}
                  onChange={(e) => setLeadForm({ ...leadForm, timeline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-md bg-liquid-abyss border border-white/10 text-platinum text-sm focus:outline-none focus:border-bioluminescent-lime transition-colors"
                >
                  <option value="Lo antes posible">Lo antes posible (Prioridad 24 hs)</option>
                  <option value="En los próximos 30 días">En los próximos 30 días</option>
                  <option value="De 1 a 3 meses">De 1 a 3 meses</option>
                  <option value="Solo estoy evaluando opciones">Solo estoy evaluando opciones</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer text-xs text-silver-mist leading-relaxed select-none">
                  <input
                    type="checkbox"
                    checked={leadForm.consent}
                    onChange={(e) => setLeadForm({ ...leadForm, consent: e.target.checked })}
                    className="mt-0.5 rounded border-white/20 text-bioluminescent-lime focus:ring-0 focus:ring-offset-0 bg-liquid-abyss"
                  />
                  <span>
                    Acepto recibir material promocional, ofertas del servicio y ser contactado para la coordinación de la propuesta técnica.
                  </span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-silver-mist/70">
                  <ShieldCheck className="w-4 h-4 text-bioluminescent-lime" />
                  <span>Datos encriptados bajo CSP & SSL</span>
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-aurora text-xs disabled:opacity-50"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    "Enviar Solicitud"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL 2: LEAD MAGNET */}
        {activeModal === "magnet" && (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bioluminescent-lime/10 text-bioluminescent-lime text-xs tracking-wide uppercase font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Guía Gratuita Exclusiva
              </div>
              <h2 className="text-2xl sm:text-3xl font-medium text-platinum font-matter tracking-tight">
                Integración de Sistemas Multi-Agentes
              </h2>
              <p className="text-sm text-silver-mist mt-1">
                Descubre cómo automatizar la atención al cliente, cotizaciones en tiempo real y filtrado de leads sin escribir código complejo.
              </p>
            </div>

            <LeadMagnetForm idPrefix="modal-" />
          </div>
        )}
      </div>
    </div>
  );
}
