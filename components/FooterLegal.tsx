"use client";

import React, { useState } from "react";
import { Shield, FileText, RefreshCw, Mail, ChevronDown, ChevronUp } from "lucide-react";

export default function FooterLegal() {
  const [openPolicy, setOpenPolicy] = useState<"privacy" | "terms" | "refund" | null>(null);

  const togglePolicy = (policy: "privacy" | "terms" | "refund") => {
    setOpenPolicy(openPolicy === policy ? null : policy);
  };

  return (
    <footer className="w-full bg-liquid-deep text-silver-mist border-t border-white/5 pt-16 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center bg-liquid-abyss">
                <div className="w-2 h-2 rounded-full bg-bioluminescent-lime" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-platinum font-matter uppercase">
                Alan López · Servicio de Marketing Digital
              </span>
            </div>
            <p className="text-xs text-silver-mist/80 leading-relaxed font-matter max-w-sm">
              Desarrollo y diseño de página web con sistemas multi-agentes de inteligencia artificial. Arquitectura ultra veloz orientada a conversión y posicionamiento orgánico líder.
            </p>
            <div className="pt-2">
              <a
                href="mailto:hola@serviciodemarketingdigital.com"
                className="inline-flex items-center gap-2 text-xs text-platinum hover:text-bioluminescent-lime transition-colors font-mono"
              >
                <Mail className="w-3.5 h-3.5 text-bioluminescent-lime" />
                <span>hola@serviciodemarketingdigital.com</span>
              </a>
            </div>
          </div>

          {/* Quick Legal Accordion Buttons */}
          <div className="md:col-span-7 space-y-3">
            <p className="text-xs uppercase tracking-[0.12em] text-silver-mist font-matter font-medium mb-3">
              MARCO LEGAL & TRANSPARENCIA CONTRACTUAL
            </p>

            {/* Accordion 1: Políticas de Privacidad */}
            <div className="border border-white/10 rounded-xl overflow-hidden bg-liquid-abyss/60">
              <button
                onClick={() => togglePolicy("privacy")}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs uppercase tracking-wide text-platinum hover:text-bioluminescent-lime transition-colors"
              >
                <span className="flex items-center gap-2 font-medium">
                  <Shield className="w-3.5 h-3.5 text-bioluminescent-lime" />
                  Políticas de Privacidad
                </span>
                {openPolicy === "privacy" ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {openPolicy === "privacy" && (
                <div className="px-5 pb-5 pt-1 text-xs text-silver-mist leading-relaxed border-t border-white/5 space-y-2">
                  <p>
                    Toda tu información personal está completamente protegida y resguardada bajo los más altos estándares de seguridad. Los datos que proporciones serán utilizados de manera estrictamente confidencial y únicamente bajo tu consentimiento expreso.
                  </p>
                  <p>
                    Su uso exclusivo será para mantener una comunicación bidireccional directa referida a la consulta, gestión y prestación de los servicios propuestos en esta página web. No compartiremos, cederemos ni utilizaremos tu información para ningún otro fin de terceros.
                  </p>
                </div>
              )}
            </div>

            {/* Accordion 2: Condiciones del Servicio */}
            <div className="border border-white/10 rounded-xl overflow-hidden bg-liquid-abyss/60">
              <button
                onClick={() => togglePolicy("terms")}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs uppercase tracking-wide text-platinum hover:text-bioluminescent-lime transition-colors"
              >
                <span className="flex items-center gap-2 font-medium">
                  <FileText className="w-3.5 h-3.5 text-bioluminescent-lime" />
                  Condiciones del Servicio
                </span>
                {openPolicy === "terms" ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {openPolicy === "terms" && (
                <div className="px-5 pb-5 pt-1 text-xs text-silver-mist leading-relaxed border-t border-white/5 space-y-3">
                  <div>
                    <strong className="text-platinum block mb-0.5">Inicio y Desarrollo:</strong>
                    Una vez confirmado el servicio, se dará inicio inmediato a la etapa de diseño y desarrollo estructural de tu sitio web.
                  </div>
                  <div>
                    <strong className="text-platinum block mb-0.5">Optimizaciones y Cambios:</strong>
                    Al finalizar la primera versión del sitio, tendrás el derecho de solicitar todas las modificaciones, ajustes y optimizaciones que precises para que el proyecto se adapte exactamente a tus necesidades.
                  </div>
                  <div>
                    <strong className="text-platinum block mb-0.5">Aprobación del Cliente:</strong>
                    Una vez que el diseño cumpla con todas tus expectativas, deberás confirmar tu entera conformidad con el sitio de manera explícita vía correo electrónico.
                  </div>
                  <div>
                    <strong className="text-platinum block mb-0.5">Gestión de Pago y Lanzamiento:</strong>
                    Tras recibir tu confirmación de conformidad por escrito, se procederá a la instancia de pago. Al confirmar la acreditación del mismo, el sitio será liberado, publicado oficialmente en su dominio y puesto en marcha para su etapa de producción.
                  </div>
                  <div>
                    <strong className="text-platinum block mb-0.5">Soporte y Evolución Continua:</strong>
                    El servicio no termina con la publicación. Como usuario, mantendrás un acceso libre y directo para solicitar nuevas modificaciones, optimizaciones o cambios futuros que tu sitio web requiera para seguir creciendo.
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 3: Políticas de Devolución & Protocolo de Ciberseguridad */}
            <div className="border border-white/10 rounded-xl overflow-hidden bg-liquid-abyss/60">
              <button
                onClick={() => togglePolicy("refund")}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs uppercase tracking-wide text-platinum hover:text-bioluminescent-lime transition-colors"
              >
                <span className="flex items-center gap-2 font-medium">
                  <RefreshCw className="w-3.5 h-3.5 text-bioluminescent-lime" />
                  Políticas de Devolución & Protocolo de Ciberseguridad
                </span>
                {openPolicy === "refund" ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
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

        {/* Copyright and Legal Notice */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-silver-mist/60 font-matter">
          <p>© 2026 Servicio de Marketing Digital. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <span>Diseñado con Auros & Integrated Bio Architecture</span>
            <a
              href="mailto:hola@serviciodemarketingdigital.com"
              className="text-silver-mist hover:text-platinum transition-colors"
            >
              Contacto directo
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
