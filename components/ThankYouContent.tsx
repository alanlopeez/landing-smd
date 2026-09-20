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
} from "lucide-react";

export default function ThankYouContent() {
  const searchParams = useSearchParams();
  const tipoParam = searchParams.get("tipo");
  const isGuia = tipoParam === "guia" || tipoParam === "magnet";

  const [referralId, setReferralId] = useState("");

  useEffect(() => {
    // Generate a clean confirmation code for user reassurance and tracking
    const randomCode =
      "SMD-" +
      Math.floor(100000 + Math.random() * 900000);
    setReferralId(randomCode);
  }, []);

  const whatsappMessage = isGuia
    ? encodeURIComponent(
        "Hola Alan, solicité la guía de sistemas multi-agentes en la web y me gustaría hacerte una consulta."
      )
    : encodeURIComponent(
        "Hola Alan, acabo de enviar mi solicitud técnica en la web y me gustaría coordinar mi propuesta de página web."
      );

  const whatsappUrl = `https://wa.me/5491127887099?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-liquid-abyss text-silver-mist flex flex-col justify-between selection:bg-bioluminescent-lime selection:text-liquid-abyss relative overflow-hidden">
      {/* Glow effects in background */}
      <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-bioluminescent-lime/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[300px] bg-[#00827c]/15 blur-[140px] rounded-full pointer-events-none" />

      {/* Top Navigation */}
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
                Servicio de Marketing Digital
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-liquid-deep border border-white/10 text-[11px] text-silver-mist">
              <span className="w-2 h-2 rounded-full bg-bioluminescent-lime animate-pulse" />
              <span>Canal de Conversión Activo</span>
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

      {/* Main Content Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16 relative z-10">
        <div className="w-full max-w-2xl bg-liquid-kelp/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 text-center relative shadow-none">
          {/* Subtle Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bioluminescent-lime/10 border border-bioluminescent-lime/20 text-bioluminescent-lime text-xs font-semibold tracking-wide uppercase mb-6 animate-fadeIn">
            {isGuia ? (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Guía Exclusiva Despachada
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                Conversión Exitosa • Prioridad 24 Horas
              </>
            )}
          </div>

          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto rounded-full bg-bioluminescent-lime/10 border border-bioluminescent-lime/30 flex items-center justify-center text-bioluminescent-lime mb-6">
            <CheckCircle2 className="w-11 h-11" />
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl font-medium text-platinum font-matter tracking-tight mb-3">
            {isGuia
              ? "¡Tu Guía está en camino!"
              : "¡Solicitud Recibida con Éxito!"}
          </h1>

          {/* Subtitle / Reassurance */}
          <p className="text-silver-mist text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-6 font-matter">
            {isGuia
              ? "Hemos registrado tu solicitud. Te enviaremos el enlace de descarga de la guía de sistemas multi-agentes directamente a tu bandeja de entrada."
              : "Gracias por tu confianza. Alan López revisará tu información técnica y te contactará en menos de 24 horas para coordinar tu propuesta personalizada."}
          </p>

          {/* Confirmation Code */}
          {referralId && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-liquid-deep/80 border border-white/5 text-xs text-silver-mist/80 font-mono mb-8">
              <span>Código de seguimiento:</span>
              <strong className="text-platinum">{referralId}</strong>
            </div>
          )}

          {/* Steps Timeline Box */}
          <div className="text-left bg-liquid-abyss/80 border border-white/5 rounded-2xl p-5 sm:p-6 mb-8 space-y-4">
            <h3 className="text-xs font-medium uppercase tracking-wider text-platinum font-matter flex items-center gap-2">
              <Clock className="w-4 h-4 text-bioluminescent-lime" />
              ¿Qué sucederá a partir de ahora?
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-bioluminescent-lime/10 text-bioluminescent-lime font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-platinum block font-medium">
                    Análisis técnico y requerimientos
                  </strong>
                  <p className="text-silver-mist/80 mt-0.5 leading-relaxed">
                    Evaluamos tu proyecto, volumen de consultas y nivel de automatización para diseñar la solución más rentable para tu negocio.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-bioluminescent-lime/10 text-bioluminescent-lime font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-platinum block font-medium">
                    Contacto directo en menos de 24 hs
                  </strong>
                  <p className="text-silver-mist/80 mt-0.5 leading-relaxed">
                    Te escribiremos por WhatsApp o correo con la propuesta técnica detallada, tiempos de ejecución y alternativas de presupuesto.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-bioluminescent-lime/10 text-bioluminescent-lime font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-platinum block font-medium">
                    Garantía de diseño y entrega ágil
                  </strong>
                  <p className="text-silver-mist/80 mt-0.5 leading-relaxed">
                    Comenzamos el desarrollo en 24 horas. Recuerda: tienes derecho a solicitar revisiones ilimitadas y solo abonas al estar 100% satisfecho con el resultado final.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fast Track / Direct Contact */}
          <div className="mb-8 p-4 rounded-xl bg-liquid-deep/60 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-xs font-medium text-platinum block">
                ¿Prefieres coordinar ahora mismo?
              </span>
              <span className="text-[11px] text-silver-mist/70">
                Escríbele directamente a Alan para atención con prioridad inmediata.
              </span>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold tracking-wide transition-all shadow-none shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chatear por WhatsApp</span>
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="btn-aurora w-full sm:w-auto text-xs"
            >
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
              <span>Sin cobros por adelantado</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-4 h-4 text-bioluminescent-lime shrink-0" />
              <span>hola@serviciodemarketingdigital.com</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="w-full py-6 text-center text-xs text-silver-mist/50 border-t border-white/5 relative z-10">
        <p>© 2026 Servicio de Marketing Digital · Alan López. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
