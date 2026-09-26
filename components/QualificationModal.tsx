"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  ShieldCheck,
  Loader2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Building2,
  DollarSign,
  Clock,
  Layers,
  Users,
  Send,
} from "lucide-react";
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
  initialVolume?: string;
  initialBudget?: string;
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
  sourceContext = "Evaluador con IA",
  initialVolume,
  initialBudget,
}: QualificationModalProps) {
  // Estado del paso actual (1 al 5)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Datos del Cuestionario BANT / FAINT
  const [formData, setFormData] = useState({
    monthlyVolume: initialVolume || "50 a 200 consultas/mes",
    currentSystem: "WhatsApp manual / Notas personales",
    timeline: "Inmediato (próximos 15 días)",
    adBudget: initialBudget || "USD 500 – USD 1.500",
    name: "",
    company: "",
    businessType: defaultBusinessType,
    email: "",
    whatsapp: "",
    companyRole: "Dueño / Fundador / Socio",
    consent: true,
    honeypot: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [qualifiedResult, setQualifiedResult] = useState<{
    isQualified: boolean;
    name: string;
    waUrl: string;
  } | null>(null);

  useEffect(() => {
    if (defaultBusinessType) {
      setFormData((prev) => ({ ...prev, businessType: defaultBusinessType }));
    }
  }, [defaultBusinessType]);

  useEffect(() => {
    if (initialVolume) {
      setFormData((prev) => ({ ...prev, monthlyVolume: initialVolume }));
    }
    if (initialBudget) {
      setFormData((prev) => ({ ...prev, adBudget: initialBudget }));
    }
  }, [initialVolume, initialBudget]);

  if (!isOpen) return null;

  const LEAD_SCRIPT_URL =
    process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_LEAD_URL ||
    process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL ||
    "https://script.google.com/macros/s/AKfycbzbD3jkCnbEuRVGZZrdPxPtJLZ_fTrtfhDDf2W7YPQN3xHut5nldiyae1ljCQ1VXYzBfw/exec";

  const MAGNET_SCRIPT_URL =
    process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_MAGNET_URL ||
    "https://script.google.com/macros/s/AKfycbxSUGeN38Y-FN5TRMe8s2KrQx8IaQYbHP2-sWIAqleMRxHXkDy_QzUeHLNXjD47bkY6/exec";

  const handleNextStep = () => {
    setErrorMessage("");
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setErrorMessage("");
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Anti-bot honeypot check
    if (formData.honeypot) {
      onClose();
      return;
    }

    if (!formData.name || !formData.company || !formData.whatsapp || !formData.email) {
      setErrorMessage("Por favor completa tu nombre, empresa, WhatsApp y correo corporativo.");
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

    // Evaluar calificación con metodología BANT / FAINT
    const isQualified = evaluateLeadQualification(
      formData.adBudget,
      formData.companyRole,
      formData.monthlyVolume
    );

    const payload: QualificationData = {
      name: sanitizeInput(formData.name),
      company: sanitizeInput(formData.company),
      businessType: sanitizeInput(formData.businessType),
      adBudget: sanitizeInput(formData.adBudget),
      companyRole: sanitizeInput(formData.companyRole),
      monthlyVolume: sanitizeInput(formData.monthlyVolume),
      currentSystem: sanitizeInput(formData.currentSystem),
      timeline: sanitizeInput(formData.timeline),
      whatsapp: sanitizeInput(formData.whatsapp),
      email: sanitizeInput(formData.email),
      isQualified,
      notes: `Origen: ${sourceContext} | Sistema: ${formData.currentSystem} | Plazo: ${formData.timeline}`,
      timestamp: new Date().toISOString(),
    };

    // 1. Disparar tracking para Google Ads Smart Bidding y GA4
    trackLeadConversion(payload, isQualified);

    // 2. Generar URL de WhatsApp pre-cargado
    const prefilledWhatsAppUrl = isQualified ? buildWhatsAppPreloadedUrl(payload) : "";

    // 3. Envío al webhook backend según estado de calificación
    try {
      if (isQualified) {
        // Enviar a hoja de Leads Calificados
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
            volumen: payload.monthlyVolume,
            sistema_actual: payload.currentSystem,
            plazo: payload.timeline,
            presupuesto: payload.adBudget,
            rol: payload.companyRole,
            qualification_status: "Calificado",
            estado_calificacion: "Calificado",
          }),
        });

        // Notificar al CRM para que los agentes de IA de correo inicien la conversación
        try {
          fetch("https://crm-api-smd.vercel.app/api/webhooks/lead", {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({
              event: "qualified_lead",
              ...payload,
            }),
          }).catch(() => {});
        } catch {}
      } else {
        // No Calificado: Enviar a la hoja de Lead Magnet para secuencia de nutrición
        await fetch(MAGNET_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            type: "magnet",
            tipo: "magnet",
            name: payload.name,
            nombre: payload.name,
            email: payload.email,
            company: payload.company,
            origen: "Calificador - Recurso Educativo Nurture",
            source: "Calificador - Recurso Educativo Nurture",
            timestamp: payload.timestamp,
          }),
        });
      }
    } catch {
      // Las redirecciones de Apps Script continúan
    }

    setStatus("success");
    setQualifiedResult({
      isQualified,
      name: payload.name,
      waUrl: prefilledWhatsAppUrl,
    });

    // Redirección suave a la página de confirmación adecuada
    setTimeout(() => {
      if (isQualified) {
        window.location.href = `/gracias?status=qualified&name=${encodeURIComponent(
          payload.name
        )}&wa=${encodeURIComponent(prefilledWhatsAppUrl)}`;
      } else {
        window.location.href = `/gracias?status=unqualified&name=${encodeURIComponent(
          payload.name
        )}`;
      }
    }, 1500);
  };

  const handleClose = () => {
    setStatus("idle");
    setErrorMessage("");
    setCurrentStep(1);
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
        {/* Botón Cerrar */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-silver-mist/70 hover:text-white transition-colors rounded-full hover:bg-white/5"
          aria-label="Cerrar ventana de evaluación"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado del Modal */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bioluminescent-lime/10 text-bioluminescent-lime text-xs tracking-wide uppercase font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Evaluación de Viabilidad con IA
          </div>
          <h2
            id="qualification-modal-title"
            className="text-2xl sm:text-3xl font-medium text-platinum font-matter tracking-tight"
          >
            Evaluar Viabilidad y Cotizar Proyecto
          </h2>
          <p className="text-xs sm:text-sm text-silver-mist mt-1 leading-relaxed">
            Completa 5 breves preguntas técnicas para evaluar el nivel de arquitectura óptimo y agendar con el equipo de Alan López.
          </p>
        </div>

        {/* Barra de Progreso */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-xs font-mono mb-1.5 text-silver-mist">
            <span>Paso {currentStep} de 5</span>
            <span className="text-bioluminescent-lime font-bold">{currentStep * 20}% completado</span>
          </div>
          <div className="w-full h-1.5 bg-liquid-deep rounded-full overflow-hidden">
            <div
              className="h-full bg-bioluminescent-lime transition-all duration-300 ease-out"
              style={{ width: `${currentStep * 20}%` }}
            />
          </div>
        </div>

        {/* Mensaje de Error */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-500/40 text-red-200 text-xs flex items-center gap-2 animate-fadeIn"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Estado de Éxito / Redirección */}
        {status === "success" && qualifiedResult && (
          <div className="p-6 rounded-xl bg-liquid-deep border border-bioluminescent-lime/40 text-center space-y-4 animate-fadeIn">
            <CheckCircle2 className="w-12 h-12 text-bioluminescent-lime mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-platinum font-matter">
              {qualifiedResult.isQualified
                ? "¡Proyecto Calificado con Éxito!"
                : "¡Información Recibida!"}
            </h3>
            <p className="text-sm text-silver-mist leading-relaxed font-matter">
              {qualifiedResult.isQualified
                ? "Tu caso cumple con los requisitos técnicos. Te estamos redirigiendo a la agenda de Google Calendar y WhatsApp VIP..."
                : "Estamos preparando tu guía estratégica y recursos formativos sin costo. Redirigiendo..."}
            </p>
            <div className="flex justify-center">
              <Loader2 className="w-6 h-6 text-bioluminescent-lime animate-spin" />
            </div>
          </div>
        )}

        {/* Formulario por Pasos */}
        {status !== "success" && (
          <form onSubmit={handleSubmit} noValidate>
            {/* Campo invisible Honeypot */}
            <input
              type="text"
              name="company_fax"
              value={formData.honeypot}
              onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            {/* PASO 1: VOLUMEN DE LEADS */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2 text-sm font-semibold text-platinum font-matter">
                  <Users className="w-4 h-4 text-bioluminescent-lime" />
                  <span>1. ¿Qué volumen mensual de consultas o prospectos recibe tu negocio?</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    { value: "Menos de 20 consultas/mes", label: "Menos de 20 consultas / mes", desc: "Flujo inicial o fase de validación" },
                    { value: "20 a 50 consultas/mes", label: "20 a 50 consultas / mes", desc: "Flujo moderado con pérdida recurrente por demora" },
                    { value: "50 a 200 consultas/mes", label: "50 a 200 consultas / mes", desc: "Flujo consolidado, alta necesidad de triaje 24/7" },
                    { value: "Más de 200 consultas/mes", label: "Más de 200 consultas / mes", desc: "Flujo intensivo, equipo saturado manualmente" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, monthlyVolume: item.value })}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                        formData.monthlyVolume === item.value
                          ? "bg-bioluminescent-lime/15 border-bioluminescent-lime text-platinum shadow-md shadow-bioluminescent-lime/5"
                          : "bg-liquid-deep/70 border-white/5 text-silver-mist hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-semibold flex items-center justify-between font-matter">
                        <span>{item.label}</span>
                        {formData.monthlyVolume === item.value && (
                          <CheckCircle2 className="w-4 h-4 text-bioluminescent-lime" />
                        )}
                      </div>
                      <p className="text-[11px] text-silver-mist/70 mt-0.5">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PASO 2: SISTEMA ACTUAL DE GESTIÓN */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2 text-sm font-semibold text-platinum font-matter">
                  <Layers className="w-4 h-4 text-bioluminescent-lime" />
                  <span>2. ¿Cómo gestionan actualmente la atención y seguimiento de prospectos?</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    { value: "WhatsApp manual / Notas personales", label: "WhatsApp manual / Notas personales", desc: "Respuestas manuales una a una con alta probabilidad de olvidos" },
                    { value: "Hojas de cálculo (Excel / Google Sheets)", label: "Hojas de cálculo (Excel / Google Sheets)", desc: "Registro manual en tablas sin automatización de avisos" },
                    { value: "CRM comercial implementado", label: "CRM comercial implementado (HubSpot, Zoho, etc.)", desc: "Usan CRM pero falta sincronización inteligente de agentes" },
                    { value: "Múltiples herramientas desconectadas", label: "Múltiples herramientas desconectadas", desc: "Datos dispersos en correo, calendarios y mensajes" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, currentSystem: item.value })}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                        formData.currentSystem === item.value
                          ? "bg-bioluminescent-lime/15 border-bioluminescent-lime text-platinum shadow-md shadow-bioluminescent-lime/5"
                          : "bg-liquid-deep/70 border-white/5 text-silver-mist hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-semibold flex items-center justify-between font-matter">
                        <span>{item.label}</span>
                        {formData.currentSystem === item.value && (
                          <CheckCircle2 className="w-4 h-4 text-bioluminescent-lime" />
                        )}
                      </div>
                      <p className="text-[11px] text-silver-mist/70 mt-0.5">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PASO 3: PLAZO DE IMPLEMENTACIÓN */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2 text-sm font-semibold text-platinum font-matter">
                  <Clock className="w-4 h-4 text-bioluminescent-lime" />
                  <span>3. ¿En qué plazo estimado necesitan tener operativo el sistema?</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    { value: "Inmediato (próximos 15 días)", label: "Inmediato (próximos 15 días)", desc: "Prioridad operativa alta, requerimos despliegue urgente" },
                    { value: "1 a 3 meses", label: "1 a 3 meses", desc: "Planificación del próximo trimestre para optimizar ventas" },
                    { value: "Solo explorando viabilidad futura", label: "Solo explorando viabilidad futura", desc: "Investigando soluciones para el mediano/largo plazo" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, timeline: item.value })}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                        formData.timeline === item.value
                          ? "bg-bioluminescent-lime/15 border-bioluminescent-lime text-platinum shadow-md shadow-bioluminescent-lime/5"
                          : "bg-liquid-deep/70 border-white/5 text-silver-mist hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-semibold flex items-center justify-between font-matter">
                        <span>{item.label}</span>
                        {formData.timeline === item.value && (
                          <CheckCircle2 className="w-4 h-4 text-bioluminescent-lime" />
                        )}
                      </div>
                      <p className="text-[11px] text-silver-mist/70 mt-0.5">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PASO 4: PRESUPUESTO PREVISTO */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2 text-sm font-semibold text-platinum font-matter">
                  <DollarSign className="w-4 h-4 text-bioluminescent-lime" />
                  <span>4. ¿Qué rango de inversión tienen previsto para el desarrollo de esta infraestructura?</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    { value: "Menos de USD 500", label: "Menos de USD 500", desc: "Acceso a recursos formativos y plantillas base" },
                    { value: "USD 500 – USD 1.500", label: "USD 500 a USD 1.500", desc: "Nivel 1: Asistente Conversacional B2B con triaje y agenda" },
                    { value: "USD 1.500 – USD 3.500", label: "USD 1.500 a USD 3.500", desc: "Nivel 2: Sistema Inteligente con Cotizador y RAG documental" },
                    { value: "Más de USD 3.500", label: "Más de USD 3.500 (Enterprise)", desc: "Nivel 3: Ecosistema Multi-Agente Autónomo a medida" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, adBudget: item.value })}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                        formData.adBudget === item.value
                          ? "bg-bioluminescent-lime/15 border-bioluminescent-lime text-platinum shadow-md shadow-bioluminescent-lime/5"
                          : "bg-liquid-deep/70 border-white/5 text-silver-mist hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-semibold flex items-center justify-between font-matter">
                        <span>{item.label}</span>
                        {formData.adBudget === item.value && (
                          <CheckCircle2 className="w-4 h-4 text-bioluminescent-lime" />
                        )}
                      </div>
                      <p className="text-[11px] text-silver-mist/70 mt-0.5">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PASO 5: DATOS DE CONTACTO PROFESIONAL */}
            {currentStep === 5 && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="flex items-center gap-2 text-sm font-semibold text-platinum font-matter mb-1">
                  <Building2 className="w-4 h-4 text-bioluminescent-lime" />
                  <span>5. Datos profesionales para coordinar tu propuesta técnica</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-matter text-platinum mb-1">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Laura Rossi"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-liquid-deep/90 border border-white/10 rounded-lg px-3 py-2 text-xs sm:text-sm text-platinum placeholder-silver-mist/40 focus:border-bioluminescent-lime focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-matter text-platinum mb-1">
                      Empresa o Sitio Web *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Clínica Dental Norte / clinica.com"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-liquid-deep/90 border border-white/10 rounded-lg px-3 py-2 text-xs sm:text-sm text-platinum placeholder-silver-mist/40 focus:border-bioluminescent-lime focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-matter text-platinum mb-1">
                      Email corporativo *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="tu.correo@empresa.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-liquid-deep/90 border border-white/10 rounded-lg px-3 py-2 text-xs sm:text-sm text-platinum placeholder-silver-mist/40 focus:border-bioluminescent-lime focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-matter text-platinum mb-1">
                      WhatsApp con código de país *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+54 9 11 1234 5678"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full bg-liquid-deep/90 border border-white/10 rounded-lg px-3 py-2 text-xs sm:text-sm text-platinum placeholder-silver-mist/40 focus:border-bioluminescent-lime focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-matter text-platinum mb-1">
                    Rol en la toma de decisiones
                  </label>
                  <select
                    value={formData.companyRole}
                    onChange={(e) => setFormData({ ...formData, companyRole: e.target.value })}
                    className="w-full bg-liquid-deep/90 border border-white/10 rounded-lg px-3 py-2 text-xs sm:text-sm text-platinum focus:border-bioluminescent-lime focus:outline-none"
                  >
                    <option value="Dueño / Fundador / Socio">Dueño / Fundador / Socio</option>
                    <option value="Director General / CEO">Director General / CEO</option>
                    <option value="Gerente Comercial / Operaciones">Gerente Comercial / Operaciones</option>
                    <option value="Responsable Técnico / IT">Responsable Técnico / IT</option>
                    <option value="Otro">Otro rol corporativo</option>
                  </select>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-silver-mist/90">
                    <input
                      type="checkbox"
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-0.5 rounded border-white/20 bg-liquid-deep text-bioluminescent-lime focus:ring-bioluminescent-lime"
                    />
                    <span>
                      Acepto la <a href="/privacidad" target="_blank" className="underline hover:text-white">política de privacidad</a> para recibir el diagnóstico técnico y coordinar la propuesta.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Botones de Navegación del Wizard */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-white/10 text-xs sm:text-sm text-silver-mist hover:text-white hover:border-white/20 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-bioluminescent-lime text-abyssal-ink font-semibold text-xs sm:text-sm font-matter shadow-md hover:bg-[#b8eb80] transition-all ml-auto"
                >
                  <span>Siguiente</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-bioluminescent-lime text-abyssal-ink font-bold text-xs sm:text-sm font-matter uppercase tracking-wider shadow-lg shadow-bioluminescent-lime/20 hover:bg-[#b8eb80] transition-all disabled:opacity-50 ml-auto cursor-pointer"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Evaluando Viabilidad...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar y Evaluar Viabilidad</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
