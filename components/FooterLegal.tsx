"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Shield,
  FileText,
  RefreshCw,
  Mail,
  ChevronDown,
  ChevronUp,
  Instagram,
  Youtube,
  Sparkles,
  ExternalLink,
  MessageCircle,
} from "lucide-react";

function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.96-4.49V8.6a8.28 8.28 0 0 0 5.18 1.83V7.02c-.48 0-.96-.11-1.37-.33z" />
    </svg>
  );
}

export default function FooterLegal() {
  const [openPolicy, setOpenPolicy] = useState<"privacy" | "terms" | "refund" | null>("privacy");

  const togglePolicy = (policy: "privacy" | "terms" | "refund") => {
    setOpenPolicy(openPolicy === policy ? null : policy);
  };

  useEffect(() => {
    const handleHash = () => {
      if (typeof window === "undefined") return;
      const hash = window.location.hash.toLowerCase();

      if (
        hash === "#politicas-de-privacidad" ||
        hash === "#politica-de-privacidad" ||
        hash === "#privacidad" ||
        hash === "#privacy"
      ) {
        setOpenPolicy("privacy");
        setTimeout(() => {
          const el = document.getElementById("politicas-de-privacidad") || document.getElementById("privacidad");
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      } else if (
        hash === "#terminos-del-servicio" ||
        hash === "#terminos-de-servicio" ||
        hash === "#condiciones-del-servicio" ||
        hash === "#terminos" ||
        hash === "#terms" ||
        hash === "#condiciones"
      ) {
        setOpenPolicy("terms");
        setTimeout(() => {
          const el = document.getElementById("terminos-del-servicio") || document.getElementById("condiciones-del-servicio");
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      } else if (
        hash === "#politicas-de-devolucion" ||
        hash === "#devoluciones" ||
        hash === "#reembolso" ||
        hash === "#refund"
      ) {
        setOpenPolicy("refund");
        setTimeout(() => {
          const el = document.getElementById("politicas-de-devolucion") || document.getElementById("devoluciones");
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      } else if (hash === "#marco-legal" || hash === "#legal") {
        setTimeout(() => {
          const el = document.getElementById("marco-legal");
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  return (
    <footer id="marco-legal" className="w-full bg-liquid-deep text-silver-mist border-t border-white/5 pt-16 pb-12 px-6 scroll-mt-16">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Social Media & Official Channels Row */}
        <div className="p-6 sm:p-8 rounded-2xl bg-liquid-abyss/80 border border-white/10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-bioluminescent-lime">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Canales Oficiales & Redes Sociales</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-medium text-platinum font-matter">
                Conéctate con nosotros en redes sociales
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-silver-mist max-w-md font-matter">
              Estrategias de rediseño web, proyectos en vivo y contenidos interactivos de alto impacto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/aureliussistemiza/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-xl bg-liquid-deep/90 border border-white/10 flex items-center justify-between hover:border-bioluminescent-lime/40 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-105 transition-transform">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-platinum">Instagram</h4>
                  <p className="text-xs text-silver-mist">@aureliussistemiza</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-silver-mist group-hover:text-bioluminescent-lime transition-colors" />
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/@serviciodemarketingdigital"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-xl bg-liquid-deep/90 border border-white/10 flex items-center justify-between hover:border-bioluminescent-lime/40 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:scale-105 transition-transform">
                  <Youtube className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-platinum">YouTube</h4>
                  <p className="text-xs text-silver-mist">@serviciodemarketingdigital</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-silver-mist group-hover:text-bioluminescent-lime transition-colors" />
            </a>

            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@aurelius.ia"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-xl bg-liquid-deep/90 border border-white/10 flex items-center justify-between hover:border-bioluminescent-lime/40 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                  <TikTokIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-platinum">TikTok</h4>
                  <p className="text-xs text-silver-mist">@aurelius.ia</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-silver-mist group-hover:text-bioluminescent-lime transition-colors" />
            </a>
          </div>
        </div>

        {/* Main Footer Grid: Identity and Legal Framework */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand & Direct Contact */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-abyssal-ink overflow-hidden p-1">
                <Image
                  src="/logo.png"
                  alt="Logo Alan López SMD"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-sm font-semibold tracking-tight text-platinum font-matter block">
                  ALAN LÓPEZ
                </span>
                <span className="text-[10px] uppercase tracking-wide text-silver-mist">
                  Servicio de Marketing Digital
                </span>
              </div>
            </div>

            <p className="text-xs text-silver-mist leading-relaxed font-matter max-w-sm">
              Rediseño y creación de landing pages interactivas de alto impacto para lanzamiento de producto o captación de leads.
            </p>

            <div className="pt-2 space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-silver-mist">
                <span className="text-platinum font-semibold">© 2026</span>
                <span>Servicio de Marketing Digital</span>
              </div>

              <a
                href="mailto:hola@serviciodemarketingdigital.com"
                className="text-bioluminescent-lime hover:underline inline-flex items-center gap-2 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-bioluminescent-lime" />
                <span>hola@serviciodemarketingdigital.com</span>
              </a>

              <a
                href="https://wa.me/5491127887093"
                target="_blank"
                rel="noopener noreferrer"
                className="text-silver-mist hover:text-white flex items-center gap-2 transition-colors pt-1"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp: +54 9 11 2788-7093</span>
              </a>
            </div>
          </div>

          {/* Quick Legal Accordion */}
          <div className="md:col-span-7 space-y-3">
            <p className="text-xs uppercase tracking-[0.12em] text-silver-mist font-matter font-medium mb-3">
              MARCO LEGAL & POLÍTICAS OFICIALES
            </p>

            {/* Accordion 1: Políticas de privacidad */}
            <div
              id="politicas-de-privacidad"
              className={`border rounded-xl overflow-hidden bg-liquid-abyss/60 scroll-mt-28 transition-all duration-300 ${
                openPolicy === "privacy"
                  ? "border-bioluminescent-lime/40 shadow-sm shadow-bioluminescent-lime/10"
                  : "border-white/10"
              }`}
            >
              <button
                onClick={() => togglePolicy("privacy")}
                aria-expanded={openPolicy === "privacy"}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs uppercase tracking-wide text-platinum hover:text-bioluminescent-lime transition-colors"
              >
                <span className="flex items-center gap-2 font-medium">
                  <Shield className="w-3.5 h-3.5 text-bioluminescent-lime" />
                  Políticas de privacidad
                </span>
                {openPolicy === "privacy" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openPolicy === "privacy" && (
                <div className="px-5 pb-5 pt-1 text-xs text-silver-mist leading-relaxed border-t border-white/5 space-y-2">
                  <p>
                    Toda tu información personal está completamente protegida y resguardada bajo los más altos estándares de seguridad. Los datos que proporciones serán utilizados de manera estrictamente confidencial y únicamente bajo tu consentimiento expreso. Su uso exclusivo será para mantener una comunicación bidireccional directa referida a la consulta, gestión y prestación de los servicios propuestos en esta página web. No compartiremos, cederemos ni utilizaremos tu información para ningún otro fin de terceros.
                  </p>
                </div>
              )}
            </div>

            {/* Accordion 2: Condiciones del servicio */}
            <div
              id="terminos-del-servicio"
              className={`border rounded-xl overflow-hidden bg-liquid-abyss/60 scroll-mt-28 transition-all duration-300 ${
                openPolicy === "terms"
                  ? "border-bioluminescent-lime/40 shadow-sm shadow-bioluminescent-lime/10"
                  : "border-white/10"
              }`}
            >
              <button
                onClick={() => togglePolicy("terms")}
                aria-expanded={openPolicy === "terms"}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs uppercase tracking-wide text-platinum hover:text-bioluminescent-lime transition-colors"
              >
                <span className="flex items-center gap-2 font-medium">
                  <FileText className="w-3.5 h-3.5 text-bioluminescent-lime" />
                  Condiciones del servicio
                </span>
                {openPolicy === "terms" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openPolicy === "terms" && (
                <div className="px-5 pb-5 pt-1 text-xs text-silver-mist leading-relaxed border-t border-white/5 space-y-3">
                  <div>
                    <strong className="text-platinum block mb-0.5">Inicio y Desarrollo:</strong>
                    Una vez confirmado el servicio, se procede al pago y facturación. Luego se dará inicio inmediato a la etapa de diseño y desarrollo estructural de tu sitio web.
                  </div>
                  <div>
                    <strong className="text-platinum block mb-0.5">Optimizaciones y Cambios:</strong>
                    Incluye hasta 2 rondas completas de revisiones y ajustes durante el desarrollo. Cambios estructurales posteriores se cotizan por separado o mediante plan de mantenimiento.
                  </div>
                  <div>
                    <strong className="text-platinum block mb-0.5">Aprobación del Cliente:</strong>
                    Una vez que el diseño cumpla con todas tus expectativas, deberás confirmar tu entera conformidad con el sitio de manera explícita vía correo electrónico o whastapp.
                  </div>
                  <div>
                    <strong className="text-platinum block mb-0.5">Condiciones de pago:</strong>
                    Pago del total al incio, o también con la opción del 50% de anticipo para iniciar el desarrollo y 50% restante contra entrega y aprobación final antes de la publicación definitiva.
                  </div>
                  <div>
                    <strong className="text-platinum block mb-0.5">Soporte y Evolución Continua:</strong>
                    El servicio no termina con la publicación. Como usuario, mantendrás un acceso libre y directo para solicitar hasta 3 nuevas modificaciones, optimizaciones o cambios futuros que tu sitio web requiera para seguir creciendo. A partir del 3er cambio solicitado se procederá a la cotización actualizada de los mismos.
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 3: Políticas de devolución */}
            <div
              id="politicas-de-devolucion"
              className={`border rounded-xl overflow-hidden bg-liquid-abyss/60 scroll-mt-28 transition-all duration-300 ${
                openPolicy === "refund"
                  ? "border-bioluminescent-lime/40 shadow-sm shadow-bioluminescent-lime/10"
                  : "border-white/10"
              }`}
            >
              <button
                onClick={() => togglePolicy("refund")}
                aria-expanded={openPolicy === "refund"}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs uppercase tracking-wide text-platinum hover:text-bioluminescent-lime transition-colors"
              >
                <span className="flex items-center gap-2 font-medium">
                  <RefreshCw className="w-3.5 h-3.5 text-bioluminescent-lime" />
                  Políticas de devolución & Ciberseguridad
                </span>
                {openPolicy === "refund" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openPolicy === "refund" && (
                <div className="px-5 pb-5 pt-1 text-xs text-silver-mist leading-relaxed border-t border-white/5 space-y-3">
                  <div>
                    <strong className="text-platinum block mb-0.5">Garantía de Fidelidad del Diseño:</strong>
                    El cliente tiene el pleno derecho de solicitar una devolución en caso de que el sitio web final entregado y publicado presente distorsiones o sea sustancialmente distinto a la versión que confirmó y aprobó previamente.
                  </div>
                  <div>
                    <strong className="text-platinum block mb-0.5">Protocolo ante Incidentes de Ciberseguridad:</strong>
                    En el caso hipotético de sufrir un ataque cibernético o vulneración externa emergente, <code className="text-bioluminescent-lime">hola@serviciodemarketingdigital.com</code> iniciará de inmediato una investigación y la correspondiente denuncia ante las autoridades oficiales. Este procedimiento es estricto y necesario para evaluar detalladamente el caso y los daños ocasionados antes de procesar cualquier gestión de devolución.
                  </div>
                  <div>
                    <strong className="text-platinum block mb-0.5">Resolución Prioritaria de Amenazas:</strong>
                    Frente a escenarios de ataques externos, nuestra prioridad es la protección e integridad de tu proyecto. Por ello, antes de proceder con un reembolso, se evaluará como primera medida la reelaboración y restitución de un nuevo sitio web con todas las amenazas neutralizadas, garantizando un entorno seguro para operar.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
