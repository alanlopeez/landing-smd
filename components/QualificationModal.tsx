"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, ShieldCheck, Loader2, AlertCircle, ArrowRight, Building2, UserCheck, DollarSign, Briefcase } from "lucide-react";
import {
  evaluateLeadQualification,
  buildWhatsAppPreloadedUrl,
  trackLeadConversion,
  QualificationData,
} from "@/lib/analytics";

interface QualificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBusinessType?: string;
  sourceContext?: string;
}

function sanitizeInput(str: string): string {
  return str
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .trim();
}

export default function QualificationModal({
  isOpen,
  onClose,
  defaultBusinessType = "Servicios B2B / Consultoría empresarial",
  sourceContext = "B2B Qualifier",
}: QualificationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    businessType: defaultBusinessType,
    adBudget: "USD 500 – USD 1.500",
    companyRole: "Dueño / Fundador / Socio",
    whatsapp: "",
    email: "",
    consent: true,
    honeypot: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Update default business type if changed externally (e.g. niche click)
  useEffect(() => {
    if (defaultBusinessType) {
      setFormData((prev) => ({ ...prev, businessType: defaultBusinessType }));
    }
  }, [defaultBusinessType]);

  if (!isOpen) return null;

  const LEAD_SCRIPT_URL =
    process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_LEAD_URL ||
    process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL ||
    "https://script.google.com/macros/s/AKfycbzbD3jkCnbEuRVGZZrdPxPtJLZ_fTrtfhDDf2W7YPQN3xHut5nldiyae1ljCQ1VXYzBfw/exec";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Anti-bot honeypot check
    if (formData.honeypot) {
      onClose();
      return;
    }

    if (!formData.name || !formData.company || !formData.whatsapp || !formData.email) {
      setErrorMessage("Por favor completa todos los campos requeridos para evaluar tu solicitud.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Por favor ingresa un correo electrónico corporativo válido.");
      return;
    }

    if (!formData.consent) {
      setErrorMessage("Debes aceptar el tratamiento de datos para coordinar la propuesta.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    // Evaluar calificación estricta
    const isQualified = evaluateLeadQualification(formData.adBudget, formData.companyRole);

    const payload: QualificationData = {
      name: sanitizeInput(formData.name),
      company: sanitizeInput(formData.company),
      businessType: sanitizeInput(formData.businessType),
      adBudget: sanitizeInput(formData.adBudget),
      companyRole: sanitizeInput(formData.companyRole),
      whatsapp: sanitizeInput(formData.whatsapp),
      email: sanitizeInput(formData.email),
      isQualified,
      notes: `Origen: ${sourceContext}`,
      timestamp: new Date().toISOString(),
    };

    // 1. Disparar tracking para Google Ads Smart Bidding y GA4
    trackLeadConversion(payload, isQualified);

    // 2. Generar URL de WhatsApp pre-cargado si es calificado
    const prefilledWhatsAppUrl = isQualified ? buildWhatsAppPreloadedUrl(payload) : "";

    // 3. Envío al webhook backend (Google Apps Script)
    try {
      await fetch(LEAD_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          type: "lead",
          tipo: "lead",
          ...payload,
          nombre: payload.name,
          empresa: payload.company,
          telefono: payload.whatsapp,
          phone: payload.whatsapp,
          rubro: payload.businessType,
          presupuesto: payload.adBudget,
          rol: payload.companyRole,
          qualification_status: isQualified ? "Calificado" : "No Calificado",
          estado_calificacion: isQualified ? "Calificado" : "No Calificado",
        }),
      });
    } catch {
      // Las redirecciones de Google Apps Script pueden disparar CORS en fetch cliente,
      // pero la petición se procesa en el script. Continuamos con la redirección.
    }

    // 4. Redirección condicional según estado de calificación
    if (isQualified) {
      // Calificado: Redirigir a la página de gracias con WhatsApp pre-cargado
      const targetUrl = `/gracias?status=qualified&name=${encodeURIComponent(
        payload.name
      )}&wa=${encodeURIComponent(prefilledWhatsAppUrl)}`;
      window.location.href = targetUrl;
    } else {
      // No Calificado: Redirigir a página con recursos formativos gratuitos sin WhatsApp comercial
      const targetUrl = `/gracias?status=unqualified&name=${encodeURIComponent(
        payload.name
      )}`;
      window.location.href = targetUrl;
    }
  };

  const handleClose = () => {
    setStatus("idle");
    setErrorMessage("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="qualification-modal-title"
    >
      <div
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-liquid-kelp border border-white/10 rounded-2xl p-5 sm:p-8 text-silver-mist shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-silver-mist/70 hover:text-white transition-colors rounded-full hover:bg-white/5"
          aria-label="Cerrar formulario de calificación"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-5 sm:mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bioluminescent-lime/10 text-bioluminescent-lime text-[11px] sm:text-xs tracking-wider uppercase font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Calificación de Proyecto B2B
          </div>
          <h2
            id="qualification-modal-title"
            className="text-xl sm:text-2xl font-medium text-platinum font-matter tracking-tight"
          >
            Evaluación Previa de Compatibilidad
          </h2>
          <p className="text-xs sm:text-sm text-silver-mist mt-1 leading-relaxed">
            Completa estos 5 breves campos antes de agendar o iniciar conversación por WhatsApp para derivarte con el asesor adecuado.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
          {/* Honeypot field for anti-spam */}
          <input
            type="text"
            name="company_url_hp"
            value={formData.honeypot}
            onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          {/* Campo 1: Nombre y Sitio Web / Red Social */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-[11px] font-medium text-platinum mb-1 uppercase tracking-wide">
                * Tu Nombre Completo:
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej. Martín Gómez"
                className="w-full px-3 py-2 rounded-md bg-liquid-abyss border border-white/10 text-platinum text-xs sm:text-sm focus:outline-none focus:border-bioluminescent-lime transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-platinum mb-1 uppercase tracking-wide flex items-center gap-1.5">
                <Building2 className="w-3 h-3 text-bioluminescent-lime" />
                <span>* Empresa y Web / Red Social:</span>
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Ej. Acme Corp · acme.com / @acme"
                className="w-full px-3 py-2 rounded-md bg-liquid-abyss border border-white/10 text-platinum text-xs sm:text-sm focus:outline-none focus:border-bioluminescent-lime transition-colors"
              />
            </div>
          </div>

          {/* Campo 2: Rubro o Modelo de Negocio */}
          <div>
            <label className="block text-[11px] font-medium text-platinum mb-1 uppercase tracking-wide flex items-center gap-1.5">
              <Briefcase className="w-3 h-3 text-bioluminescent-lime" />
              <span>* Rubro o Modelo de Negocio:</span>
            </label>
            <select
              value={formData.businessType}
              onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
              className="w-full px-3 py-2.5 rounded-md bg-liquid-abyss border border-white/10 text-platinum text-xs sm:text-sm focus:outline-none focus:border-bioluminescent-lime transition-colors"
            >
              <option value="Servicios B2B / Consultoría empresarial">
                Servicios B2B / Consultoría empresarial
              </option>
              <option value="E-commerce / Venta de productos">
                E-commerce / Venta de productos
              </option>
              <option value="Servicios Profesionales (Salud, Legal, etc.)">
                Servicios Profesionales (Clínicas, Abogados, Arquitectura)
              </option>
              <option value="Inmobiliaria / Bienes Raíces">
                Inmobiliaria / Bienes Raíces
              </option>
              <option value="Software / SaaS / Tecnología">
                Software / SaaS / Tecnología
              </option>
              <option value="Marcas y Negocios en Expansión">
                Marcas y Negocios en Expansión
              </option>
              <option value="Otro modelo comercial">
                Otro modelo comercial
              </option>
            </select>
          </div>

          {/* Campo 3: Rango de facturación o presupuesto mensual para pauta */}
          <div>
            <label className="block text-[11px] font-medium text-platinum mb-1 uppercase tracking-wide flex items-center gap-1.5">
              <DollarSign className="w-3 h-3 text-bioluminescent-lime" />
              <span>* Presupuesto mensual para pauta o facturación estimada:</span>
            </label>
            <select
              value={formData.adBudget}
              onChange={(e) => setFormData({ ...formData, adBudget: e.target.value })}
              className="w-full px-3 py-2.5 rounded-md bg-liquid-abyss border border-white/10 text-platinum text-xs sm:text-sm focus:outline-none focus:border-bioluminescent-lime transition-colors font-mono"
            >
              <option value="Más de USD 1.500">
                Más de USD 1.500 / mes (Empresas consolidadas / Escala activa)
              </option>
              <option value="USD 500 – USD 1.500">
                USD 500 – USD 1.500 / mes (Crecimiento sostenido)
              </option>
              <option value="Menos de USD 500">
                Menos de USD 500 / mes (Fase inicial o validación temprana)
              </option>
            </select>
          </div>

          {/* Campo 4: Rol en la Empresa */}
          <div>
            <label className="block text-[11px] font-medium text-platinum mb-1 uppercase tracking-wide flex items-center gap-1.5">
              <UserCheck className="w-3 h-3 text-bioluminescent-lime" />
              <span>* Tu Rol en la Empresa:</span>
            </label>
            <select
              value={formData.companyRole}
              onChange={(e) => setFormData({ ...formData, companyRole: e.target.value })}
              className="w-full px-3 py-2.5 rounded-md bg-liquid-abyss border border-white/10 text-platinum text-xs sm:text-sm focus:outline-none focus:border-bioluminescent-lime transition-colors"
            >
              <option value="Dueño / Fundador / Socio">
                Dueño / Fundador / Socio (Toma de decisiones)
              </option>
              <option value="Director / Gerente de Área">
                Director / Gerente de Área (Líder de proyecto)
              </option>
              <option value="Responsable de Ventas / Marketing">
                Responsable de Ventas o Marketing
              </option>
              <option value="Empleado / Asistente">
                Empleado / Asistente
              </option>
            </select>
          </div>

          {/* Campo 5: Teléfono / WhatsApp y Correo Corporativo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-[11px] font-medium text-platinum mb-1 uppercase tracking-wide">
                * WhatsApp / Teléfono:
              </label>
              <input
                type="tel"
                required
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="+54 9 11 ..."
                className="w-full px-3 py-2 rounded-md bg-liquid-abyss border border-white/10 text-platinum text-xs sm:text-sm focus:outline-none focus:border-bioluminescent-lime transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-platinum mb-1 uppercase tracking-wide">
                * Correo Corporativo:
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="nombre@empresa.com"
                className="w-full px-3 py-2 rounded-md bg-liquid-abyss border border-white/10 text-platinum text-xs sm:text-sm focus:outline-none focus:border-bioluminescent-lime transition-colors"
              />
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-[11px] sm:text-xs text-silver-mist leading-relaxed select-none">
              <input
                type="checkbox"
                checked={formData.consent}
                onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                className="mt-0.5 rounded border-white/20 text-bioluminescent-lime focus:ring-0 focus:ring-offset-0 bg-liquid-abyss"
              />
              <span>
                Acepto la evaluación de mi solicitud y la recepción de propuesta técnica confidencial.
              </span>
            </label>
          </div>

          {/* Submit Button & Security badge */}
          <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/5">
            <div className="flex items-center gap-1.5 text-[11px] text-silver-mist/70">
              <ShieldCheck className="w-4 h-4 text-bioluminescent-lime" />
              <span>Verificación B2B segura · SSL 256-bit</span>
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-aurora w-full sm:w-auto text-xs disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluando perfil...</span>
                </>
              ) : (
                <>
                  <span>Enviar y Continuar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
