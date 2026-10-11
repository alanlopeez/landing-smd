"use client";

import React from "react";
import { Database, LineChart, Cpu, CreditCard, Sparkles, CheckCircle2 } from "lucide-react";

export default function MarketingStackIntegrationSection() {
  const stackCategories = [
    {
      title: "CRMs y Gestión de Prospectos",
      icon: Database,
      description: "Tus leads ingresan en menos de 2 segundos a tu embudo comercial con todos sus datos y atribución.",
      tools: ["HubSpot", "ActiveCampaign", "Salesforce", "Zoho CRM", "Twenty CRM", "Chatwoot", "Pipedrive"]
    },
    {
      title: "Analítica y Tracking Server-Side",
      icon: LineChart,
      description: "Medición de alta fidelidad sin pérdidas por bloqueadores de anuncios ni restricciones de iOS.",
      tools: ["Google Tag Manager (GTM)", "Meta Pixel & CAPI", "Google Analytics 4", "PostHog", "Mixpanel", "Hotjar"]
    },
    {
      title: "Automatizaciones & Webhooks",
      icon: Cpu,
      description: "Flujos de eventos en tiempo real conectados con tus herramientas internas y mensajería.",
      tools: ["Make (Integromat)", "n8n Self-Hosted", "Zapier", "Webhooks REST Seguros", "Resend API"]
    },
    {
      title: "Pasarelas de Pago Globales",
      icon: CreditCard,
      description: "Checkouts optimizados con tokenización segura y aprobación instantánea multimoneda.",
      tools: ["Stripe Checkout", "Mercado Pago SDK", "PayPal", "Transferencias SWIFT / CBU"]
    }
  ];

  return (
    <section
      id="stack-integraciones"
      className="relative w-full bg-liquid-abyss py-20 sm:py-28 px-6 border-t border-white/5 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto space-y-14 relative z-10">
        
        {/* Header de Sección */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-liquid-deep border border-white/10 text-xs font-mono uppercase tracking-widest text-bioluminescent-lime">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interoperabilidad & Cero Silos de Datos</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-medium text-platinum font-matter tracking-tight">
            Se Integra Nativamente Con Tu <br className="hidden sm:block" />
            <span className="text-bioluminescent-lime">Stack Tecnológico Existente.</span>
          </h2>

          <p className="text-base sm:text-lg text-silver-mist font-matter leading-relaxed">
            No reinventamos tu operación comercial. Construimos sobre código puro Next.js para conectarnos en tiempo real a tus plataformas de ventas, analítica y cobros existentes.
          </p>
        </div>

        {/* Grid de 4 Bloques de Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {stackCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="p-7 sm:p-8 rounded-3xl bg-abyssal-ink/80 border border-white/10 hover:border-white/20 transition-all space-y-5 shadow-xl"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-liquid-abyss border border-white/15 flex items-center justify-center text-bioluminescent-lime shrink-0 shadow-lg">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-platinum font-matter">{cat.title}</h3>
                    <p className="text-xs text-liquid-mist mt-0.5">{cat.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                  {cat.tools.map((tool, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-silver-mist font-mono hover:text-platinum hover:border-bioluminescent-lime/40 transition-colors"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner de Garantía de Integración */}
        <div className="p-5 sm:p-6 rounded-2xl bg-liquid-deep/90 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-silver-mist font-matter">
          <div className="flex items-center gap-3 text-left">
            <CheckCircle2 className="w-5 h-5 text-bioluminescent-lime shrink-0" />
            <span>¿Usas una herramienta propietaria o un CRM interno? Proveemos endpoints REST y webhooks con autenticación JWT para sincronización a medida.</span>
          </div>
          <span className="px-3.5 py-1.5 rounded-lg bg-white/5 text-platinum font-semibold border border-white/15 whitespace-nowrap">
            Setup en 24 Horas
          </span>
        </div>

      </div>
    </section>
  );
}
