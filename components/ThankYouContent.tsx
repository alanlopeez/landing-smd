"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
  FileCheck2,
  Sparkles,
  ArrowLeft,
  Mail,
  Zap,
  BookOpen,
  Download,
  Calendar,
  Layers,
  Video,
} from "lucide-react";

export default function ThankYouContent() {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status") || "qualified";
  const nameParam = searchParams.get("name") || "";
  const customWaUrl = searchParams.get("wa") || "";
  const tipoParam = searchParams.get("tipo");
  const isGuia = tipoParam === "guia" || tipoParam === "magnet";

  const isQualified = statusParam === "qualified";

  const [referralId, setReferralId] = useState("");

  useEffect(() => {
    // Generate a tracking reference code
    const randomCode =
      "SMD-" + Math.floor(100000 + Math.random() * 900000);
    setReferralId(randomCode);

    // Si es calificado y tiene gtag disponible, asegurar el disparo del evento de conversión en la página de gracias
    if (typeof window !== "undefined" && isQualified) {
      if (typeof window.gtag === "function") {
        window.gtag("event", "qualified_lead", {
          event_category: "Leads",
          event_label: "Página de Gracias - Lead Calificado",
          lead_status: "qualified",
        });
        window.gtag("event", "generate_lead", {
          lead_quality: "qualified",
        });
        window.gtag("event", "conversion_page_qualified", {
          event_category: "Leads",
          event_label: "Página de Gracias - Lead Calificado",
          lead_status: "qualified",
        });

        const adsConversionId = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID;
        const adsConversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
        if (adsConversionId && adsConversionLabel) {
          window.gtag("event", "conversion", {
            send_to: `${adsConversionId}/${adsConversionLabel}`,
          });
        }
      }
      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push({
          event: "thank_you_page_qualified",
          lead_status: "qualified",
        });
      }
    }
  }, [isQualified]);

  // Fallback WhatsApp URL si no viene precargada
  const defaultWaMessage = encodeURIComponent(
    `Hola Alan, completé el formulario de calificación en la web (Ref: ${referralId}) y me gustaría coordinar mi propuesta técnica.`
  );
  const whatsappUrl =
    customWaUrl || `https://wa.me/5491127887093?text=${defaultWaMessage}`;

  return (
    <div className="min-h-screen bg-liquid-abyss text-silver-mist flex flex-col justify-between selection:bg-bioluminescent-lime selection:text-liquid-abyss relative overflow-hidden">
      {/* Background Lighting Elements */}
      <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-bioluminescent-lime/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[300px] bg-[#00827c]/15 blur-[140px] rounded-full pointer-events-none" />

      {/* Top Header */}
      <header className="w-full border-b border-white/5 py-4 px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group transition-opacity hover:opacity-85"
          >
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-liquid-deep overflow-hidden p-1">
              <Image
                src="/logo.png"
                alt="Logo Alan López"
                width={22}
                height={22}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold tracking-tight text-platinum font-matter uppercase">
                Alan López
              </span>
              <span className="text-[10px] text-silver-mist/70 tracking-wider">
                Sistemas Web B2B & Agentes IA
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-liquid-deep border border-white/10 text-[11px] text-silver-mist">
              <span
                className={`w-2 h-2 rounded-full ${
                  isQualified ? "bg-bioluminescent-lime animate-pulse" : "bg-cyan-400"
                }`}
              />
              <span>
                {isQualified
                  ? "Lead Calificado · Prioridad Comercial"
                  : "Acceso a Recursos Formativos"}
              </span>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-silver-mist hover:text-platinum transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la web</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-16 relative z-10">
        <div className="w-full max-w-2xl bg-liquid-kelp/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 text-center relative shadow-2xl">
          {/* =========================================================================
              CASO 1: LEAD CALIFICADO (O GUÍA MAGNET)
             ========================================================================= */}
          {isQualified && !isGuia && (
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bioluminescent-lime/10 border border-bioluminescent-lime/20 text-bioluminescent-lime text-xs font-semibold tracking-wide uppercase mb-6 animate-fadeIn">
                <Zap className="w-3.5 h-3.5" />
                Perfil Calificado • Atención Prioritaria en 24 Horas
              </div>

              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-bioluminescent-lime/10 border border-bioluminescent-lime/30 flex items-center justify-center text-bioluminescent-lime mb-6">
                <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11" />
              </div>

              <h1 className="text-2xl sm:text-4xl font-medium text-platinum font-matter tracking-tight mb-3">
                {nameParam
                  ? `¡Excelente, ${nameParam}! Tu proyecto ha sido calificado.`
                  : "¡Tu Proyecto ha sido Calificado con Éxito!"}
              </h1>

              <p className="text-silver-mist text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-6 font-matter">
                Tu empresa cumple con los criterios para implementar nuestros sistemas de alta conversión y agentes autónomos. Alan López revisará tus especificaciones para enviarte una propuesta personalizada.
              </p>

              {referralId && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-liquid-deep/80 border border-white/5 text-xs text-silver-mist/80 font-mono mb-6">
                  <span>Código de seguimiento:</span>
                  <strong className="text-platinum">{referralId}</strong>
                </div>
              )}

              {/* Action Box: WhatsApp Direct Connection */}
              <div className="mb-6 p-5 rounded-2xl bg-liquid-deep/90 border border-bioluminescent-lime/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-lg">
                <div>
                  <span className="text-xs font-semibold text-platinum block">
                    Paso Inmediato: Continuar por WhatsApp
                  </span>
                  <span className="text-[11px] text-silver-mist/80 block mt-0.5">
                    Tus datos ya están cargados para agilizar la respuesta técnica de Alan.
                  </span>
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold tracking-wide transition-all shadow-md shrink-0 hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Abrir WhatsApp Ahora</span>
                </a>
              </div>

              {/* Secondary Option: Calendar appointment */}
              <div className="mb-8 p-4 rounded-xl bg-liquid-deep/50 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-bioluminescent-lime shrink-0" />
                  <span className="text-xs text-silver-mist">
                    ¿Prefieres fijar una videollamada formal de 20 minutos?
                  </span>
                </div>
                <a
                  href="https://calendar.app.google/dhGQgyMUs2eHBPgN9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-bioluminescent-lime hover:underline font-matter font-medium whitespace-nowrap"
                >
                  Agendar en Google Calendar &rarr;
                </a>
              </div>

              {/* Timeline Steps */}
              <div className="text-left bg-liquid-abyss/80 border border-white/5 rounded-2xl p-5 mb-8 space-y-3.5 text-xs">
                <h3 className="text-xs font-medium uppercase tracking-wider text-platinum font-matter flex items-center gap-2">
                  <Clock className="w-4 h-4 text-bioluminescent-lime" />
                  Próximos pasos de tu proyecto:
                </h3>
                <div className="space-y-3 text-silver-mist/85">
                  <div className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-bioluminescent-lime/15 text-bioluminescent-lime text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <span>Evaluación de arquitectura técnica y requerimientos de tu rubro.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-bioluminescent-lime/15 text-bioluminescent-lime text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <span>Contacto directo de Alan López vía WhatsApp en menos de 24 horas.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-bioluminescent-lime/15 text-bioluminescent-lime text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <span>Entrega de versión inicial en 24 horas. Solo abonas al estar 100% satisfecho.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              CASO 2: LEAD NO CALIFICADO (RECURSOS FORMATIVOS Y MATERIAL GRATUITO)
              Evita saturar la atención comercial directa
             ========================================================================= */}
          {!isQualified && !isGuia && (
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wide uppercase mb-6 animate-fadeIn">
                <BookOpen className="w-3.5 h-3.5" />
                Diagnóstico & Recursos de Crecimiento
              </div>

              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
                <Layers className="w-9 h-9 sm:w-11 sm:h-11" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-medium text-platinum font-matter tracking-tight mb-3">
                {nameParam
                  ? `Gracias por contactarnos, ${nameParam}.`
                  : "¡Gracias por tu interés en nuestras soluciones!"}
              </h1>

              <p className="text-silver-mist text-xs sm:text-sm max-w-lg mx-auto leading-relaxed mb-6 font-matter">
                Actualmente nuestros servicios de desarrollo a medida y sistemas multi-agentes llave en mano están optimizados para empresas con estructuras de inversión activas. Sin embargo, para ayudarte a dar el siguiente salto, te obsequiamos este paquete de recursos estratégicos:
              </p>

              {/* Free Resources Grid */}
              <div className="text-left space-y-3.5 mb-8">
                {/* Recurso 1: Guía de Sistemas Multi-Agentes */}
                <div className="p-4 rounded-2xl bg-liquid-deep/80 border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-platinum">
                        Guía Práctica: Sistemas Multi-Agentes con IA
                      </h4>
                      <p className="text-[11px] text-silver-mist/70 mt-0.5">
                        Blueprint de automatización para filtrar consultas y cotizar sin programar código complejo.
                      </p>
                    </div>
                  </div>
                  <a
                    href="/Contenido.pdf"
                    download
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-platinum text-xs font-medium transition-colors shrink-0"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Descargar PDF</span>
                  </a>
                </div>

                {/* Recurso 2: Checklist B2B */}
                <div className="p-4 rounded-2xl bg-liquid-deep/80 border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-platinum">
                        Checklist: 10 Claves de Conversión Web
                      </h4>
                      <p className="text-[11px] text-silver-mist/70 mt-0.5">
                        Guía de velocidad, jerarquía visual y copywriting para no perder visitantes antes de pautar.
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://blog-relatos-alan-lopez.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-platinum text-xs font-medium transition-colors shrink-0"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Leer Artículos</span>
                  </a>
                </div>

                {/* Recurso 3: Canal Formativo en Video */}
                <div className="p-4 rounded-2xl bg-liquid-deep/80 border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-platinum">
                        Masterclasses & Videos Formativos
                      </h4>
                      <p className="text-[11px] text-silver-mist/70 mt-0.5">
                        Aprende sobre prompts, modelos de IA y herramientas no-code con tutoriales paso a paso.
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://www.youtube.com/@serviciodemarketingdigital"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-platinum text-xs font-medium transition-colors shrink-0"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Ver Tutoriales</span>
                  </a>
                </div>
              </div>

              {/* Informative Note */}
              <div className="p-4 rounded-xl bg-liquid-abyss/80 border border-white/5 text-[11px] text-silver-mist/70 text-left mb-6 leading-relaxed">
                💡 <strong className="text-platinum">¿Tu empresa supera el presupuesto inicial o expande operaciones en el futuro?</strong> Puedes volver a postularte cuando dispongas del presupuesto requerido para soluciones de alta gama.
              </div>
            </div>
          )}

          {/* =========================================================================
              CASO 3: LEAD MAGNET DESCARGADO
             ========================================================================= */}
          {isGuia && (
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bioluminescent-lime/10 border border-bioluminescent-lime/20 text-bioluminescent-lime text-xs font-semibold tracking-wide uppercase mb-6 animate-fadeIn">
                <Sparkles className="w-3.5 h-3.5" />
                Guía Exclusiva Despachada
              </div>

              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-bioluminescent-lime/10 border border-bioluminescent-lime/30 flex items-center justify-center text-bioluminescent-lime mb-6">
                <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-medium text-platinum font-matter tracking-tight mb-3">
                ¡Tu Guía de Sistemas Multi-Agentes está en camino!
              </h1>

              <p className="text-silver-mist text-xs sm:text-sm max-w-lg mx-auto leading-relaxed mb-6 font-matter">
                Hemos registrado tu solicitud. Te enviaremos el enlace de descarga directamente a tu correo. También puedes descargar una copia de respaldo aquí:
              </p>

              <div className="mb-8">
                <a
                  href="/Contenido.pdf"
                  download
                  className="btn-aurora inline-flex items-center gap-2 text-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Guía en PDF Ahora</span>
                </a>
              </div>
            </div>
          )}

          {/* Back to Home Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/" className="btn-aurora w-full sm:w-auto text-xs">
              <span>Volver a la Página Principal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-silver-mist/70">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-bioluminescent-lime shrink-0" />
              <span>Confidencialidad 100% SSL</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <FileCheck2 className="w-4 h-4 text-bioluminescent-lime shrink-0" />
              <span>Garantía de Satisfacción</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-4 h-4 text-bioluminescent-lime shrink-0" />
              <span>hola@serviciodemarketingdigital.com</span>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full py-6 text-center text-xs text-silver-mist/50 border-t border-white/5 relative z-10">
        <p>© 2026 Servicio de Marketing Digital · Alan López. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
