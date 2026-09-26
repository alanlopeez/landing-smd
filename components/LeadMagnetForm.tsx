"use client";

import React, { useState } from "react";
import { Download, Loader2, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";

interface LeadMagnetFormProps {
  idPrefix?: string;
  className?: string;
}

// Sanitization to prevent XSS / script injection
function sanitizeInput(str: string): string {
  return str
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .trim();
}

export default function LeadMagnetForm({
  idPrefix = "magnet-",
  className = "",
}: LeadMagnetFormProps) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(true);
  const [honeypot, setHoneypot] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const SCRIPT_URL =
    process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_MAGNET_URL ||
    "https://script.google.com/macros/s/AKfycbxSUGeN38Y-FN5TRMe8s2KrQx8IaQYbHP2-sWIAqleMRxHXkDy_QzUeHLNXjD47bkY6/exec";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // Silent discard if honeypot was filled by bot

    const valorCampoNombre = sanitizeInput(nombre);
    const valorCampoEmail = sanitizeInput(email);

    if (!valorCampoNombre) {
      setStatus("error");
      setErrorMessage("Por favor ingresa tu nombre y verifica el correo ingresado.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!valorCampoEmail || !emailRegex.test(valorCampoEmail)) {
      setStatus("error");
      setErrorMessage("Por favor, verifica el correo ingresado para asegurarte de que sea válido.");
      return;
    }

    if (!consent) {
      setStatus("error");
      setErrorMessage("Por favor acepta los términos para recibir la guía.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          type: "magnet",
          tipo: "magnet",
          name: valorCampoNombre,
          nombre: valorCampoNombre,
          email: valorCampoEmail,
          origen: "Lead Magnet - Guía Multi-Agentes",
          source: "Lead Magnet - Guía Multi-Agentes",
          timestamp: new Date().toISOString(),
        }),
      });

      // Estado de éxito
      setStatus("success");
      setSuccessMessage(
        "¡Guía enviada! Revisa tu bandeja de entrada o spam en los próximos minutos."
      );
      // Limpiar campos del formulario
      setNombre("");
      setEmail("");
      setErrorMessage("");

      // Tracking analítico si gtag está disponible
      if (typeof window !== "undefined" && (window as unknown as { gtag?: Function }).gtag) {
        (window as unknown as { gtag: Function }).gtag("event", "lead_magnet_download", {
          event_category: "Lead Magnet",
          event_label: "Guia Multi-Agentes",
        });
      }
    } catch {
      setStatus("error");
      setErrorMessage(
        "Hubo un problema al procesar el envío. Por favor, verifica el correo ingresado e inténtalo nuevamente."
      );
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Alerta de Error */}
      {status === "error" && errorMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-4 p-3.5 rounded-lg bg-red-900/30 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5 animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
          <span className="font-matter">{errorMessage}</span>
        </div>
      )}

      {/* Alerta de Éxito / Confirmación */}
      {status === "success" && successMessage && (
        <div
          role="status"
          aria-live="polite"
          className="mb-4 p-4 rounded-xl bg-bioluminescent-lime/10 border border-bioluminescent-lime/40 text-platinum text-xs sm:text-sm flex items-start gap-3 animate-fadeIn shadow-lg shadow-bioluminescent-lime/5"
        >
          <CheckCircle2 className="w-5 h-5 text-bioluminescent-lime flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-bioluminescent-lime font-matter">
              ¡Guía enviada!
            </p>
            <p className="text-silver-mist text-xs sm:text-sm font-matter mt-0.5">
              Revisa tu bandeja de entrada o spam en los próximos minutos.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Campo invisible Honeypot anti-bots */}
        <input
          type="text"
          name="magnet_hp_code"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label
              htmlFor={`${idPrefix}nombre`}
              className="block text-xs font-medium text-platinum mb-1.5 uppercase tracking-wide font-matter"
            >
              * Nombre:
            </label>
            <input
              id={`${idPrefix}nombre`}
              name="nombre"
              type="text"
              required
              disabled={status === "loading"}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre completo"
              className="w-full px-3.5 py-2.5 rounded-md bg-liquid-abyss border border-white/10 text-platinum text-sm focus:outline-none focus:border-bioluminescent-lime transition-colors placeholder:text-silver-mist/40 disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor={`${idPrefix}email`}
              className="block text-xs font-medium text-platinum mb-1.5 uppercase tracking-wide font-matter"
            >
              * E-mail:
            </label>
            <input
              id={`${idPrefix}email`}
              name="email"
              type="email"
              required
              disabled={status === "loading"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@empresa.com"
              className="w-full px-3.5 py-2.5 rounded-md bg-liquid-abyss border border-white/10 text-platinum text-sm focus:outline-none focus:border-bioluminescent-lime transition-colors placeholder:text-silver-mist/40 disabled:opacity-50"
            />
          </div>
        </div>

        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-silver-mist leading-relaxed select-none">
            <input
              type="checkbox"
              checked={consent}
              disabled={status === "loading"}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 rounded border-white/20 text-bioluminescent-lime focus:ring-0 focus:ring-offset-0 bg-liquid-abyss"
            />
            <span>
              Acepto recibir la guía gratuita y novedades sobre automatizaciones con IA en mi bandeja de entrada.
            </span>
          </label>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-silver-mist/70">
            <ShieldCheck className="w-4 h-4 text-bioluminescent-lime flex-shrink-0" />
            <span>Sin spam. Cero trackers invasivos.</span>
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-aurora text-xs py-3 px-6 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enviando guía...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Descargar Guía Ahora</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
