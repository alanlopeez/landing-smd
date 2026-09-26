"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight, Zap, MessageSquare, Cpu, CheckCircle2 } from "lucide-react";

interface AutomationTypesSectionProps {
  onOpenLeadModal: (context?: { servicePreset?: string }) => void;
}

const automations = [
  {
    id: "express",
    level: "NIVEL 01 · RESPUESTA INMEDIATA",
    title: "Express",
    subtitle: "Cotizadores automáticos y respuestas al segundo exacto",
    description:
      "No dejes enfriar ninguna venta. Este nivel conecta tus formularios con cotizadores automáticos para generar respuestas y presupuestos al instante. Diseñado para cerrar ventas más rápido y aumentar tu tasa de conversión sin demoras.",
    image: "/images/automations/express.png",
    imageAlt: "Automatización Express con envío y cálculo de cotizaciones automáticas",
    icon: Zap,
    accentColor: "text-amber-300",
    badgeBg: "bg-amber-400/10 text-amber-300 border-amber-400/20",
    glowBg: "from-amber-400/20 via-amber-400/5 to-transparent",
    features: [
      "Cotizadores automáticos y presupuestos al instante",
      "Formularios inteligentes conectados en tiempo real",
      "Cierra ventas más rápido sin tiempos muertos",
      "Aumenta la tasa de conversión de tus prospectos",
    ],
    ctaText: "Evaluar Viabilidad y Cotizar con IA",
  },
  {
    id: "conversacional",
    level: "NIVEL 02 · ATENCIÓN OMNICANAL",
    title: "Asistentes conversacionales",
    subtitle: "Atención omnicanal inteligente que aprende y razona",
    description:
      "Atención inteligente en todas tus plataformas y redes sociales. Asistentes conversacionales que no solo responden, sino que aprenden, razonan y delegan la recolección de datos, cualificando al prospecto y derivando el contacto a un humano cuando la venta lo requiere.",
    image: "/images/automations/conversacional.png",
    imageAlt: "Asistente conversacional omnicanal conectado a WhatsApp, Instagram, Telegram y redes sociales",
    icon: MessageSquare,
    accentColor: "text-bioluminescent-lime",
    badgeBg: "bg-bioluminescent-lime/10 text-bioluminescent-lime border-bioluminescent-lime/20",
    glowBg: "from-bioluminescent-lime/20 via-bioluminescent-lime/5 to-transparent",
    features: [
      "Omnicanalidad: WhatsApp, Instagram, TikTok y web",
      "Delega la recolección de datos y filtrado de clientes",
      "Razonamiento contextual y respuestas naturales 24/7",
      "Derivación inteligente a humanos para cerrar ventas",
    ],
    ctaText: "Evaluar Viabilidad y Cotizar con IA",
    popularBadge: "Más Solicitado",
  },
  {
    id: "autonomo",
    level: "NIVEL 03 · ECOSISTEMA 24/7",
    title: "Ecosistema Autónomo",
    subtitle: "Automatización de ventas y red de agentes 24/7",
    description:
      "El ecosistema definitivo de máxima rentabilidad. Despliega un orquestador y múltiples sistemas multi-agentes operando en la nube 24/7. Se integran a tu automatización de ventas, marketing digital y administración para devolverte resultados concretos listos para tu aprobación.",
    image: "/images/automations/autonomo.png",
    imageAlt: "Ecosistema autónomo con orquestador y múltiples agentes de IA operando 24/7",
    icon: Cpu,
    accentColor: "text-sky-300",
    badgeBg: "bg-sky-400/10 text-sky-300 border-sky-400/20",
    glowBg: "from-sky-400/20 via-sky-400/5 to-transparent",
    features: [
      "Orquestador de sistemas multi-agentes 24/7",
      "Automatización de ventas, marketing digital y gestión",
      "Investigación autónoma y reportes ejecutivos",
      "Máxima rentabilidad y escalabilidad comercial",
    ],
    ctaText: "Evaluar Viabilidad y Cotizar con IA",
  },
];

export default function AutomationTypesSection({
  onOpenLeadModal,
}: AutomationTypesSectionProps) {
  return (
    <section
      id="automatizaciones"
      className="relative w-full bg-liquid-abyss py-24 sm:py-32 px-6 border-t border-white/5 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-bioluminescent-lime/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-[0.12em] text-silver-mist">
            <span className="w-2 h-2 rounded-full bg-bioluminescent-lime animate-pulse" />
            Automatización de Ventas & Sistemas Multi-Agentes
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-medium text-platinum font-matter tracking-tight leading-[1.08]">
            Niveles de agentes según tus necesidades
          </h2>
          <p className="text-base sm:text-lg text-silver-mist font-matter leading-relaxed">
            Desde cotizadores automáticos y asistentes conversacionales hasta ecosistemas autónomos que gestionan áreas enteras de tu negocio. Conoce los 3 tipos de automatización de ventas diseñados por <strong className="text-platinum font-medium">Alan López</strong> para aumentar tu tasa de conversión.
          </p>
        </div>

        {/* 3 Automations Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {automations.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className="surface-card p-8 sm:p-9 flex flex-col justify-between group transition-all duration-300 hover:border-bioluminescent-lime/30 relative"
              >
                {/* Popular Pill */}
                {item.popularBadge && (
                  <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-bioluminescent-lime text-liquid-abyss text-[11px] font-semibold tracking-wider uppercase shadow-lg shadow-bioluminescent-lime/20">
                    {item.popularBadge}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Top Level Badge & Icon */}
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={`inline-flex items-center text-[11px] font-mono font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md border ${item.badgeBg}`}
                    >
                      {item.level}
                    </span>
                    <div className="w-9 h-9 rounded-md bg-[#011d1c] border border-white/10 flex items-center justify-center text-platinum group-hover:scale-110 transition-transform">
                      <IconComponent className={`w-4 h-4 ${item.accentColor}`} />
                    </div>
                  </div>

                  {/* 3D Image Container */}
                  <div className="relative w-full h-64 sm:h-72 rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 flex items-center justify-center overflow-hidden p-3 group-hover:border-white/20 transition-all duration-300">
                    {/* Ambient glow matching level color */}
                    <div
                      className={`absolute inset-0 bg-radial ${item.glowBg} opacity-25 group-hover:opacity-70 transition-opacity duration-500 blur-2xl pointer-events-none`}
                    />
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Image
                        src={item.image}
                        alt={item.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 380px"
                        className="object-contain p-2 drop-shadow-[0_15px_30px_rgba(0,0,0,0.65)] transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-2">
                    <h3 className="text-2xl sm:text-3xl font-medium text-platinum font-matter tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs uppercase font-mono tracking-wider text-bioluminescent-lime">
                      {item.subtitle}
                    </p>
                    <p className="text-sm text-silver-mist leading-relaxed font-matter pt-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="pt-4 border-t border-white/5 space-y-2.5">
                    {item.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-liquid-mist font-matter"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-bioluminescent-lime flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Bottom CTA Button */}
                <div className="pt-8">
                  <button
                    onClick={() => onOpenLeadModal({ servicePreset: `Nivel: ${item.title}` })}
                    className="w-full group/btn relative inline-flex items-center justify-between px-5 py-3 rounded-[6px] bg-liquid-kelp/50 hover:bg-bioluminescent-lime text-platinum hover:text-liquid-abyss text-xs font-semibold uppercase tracking-wider border border-white/10 hover:border-bioluminescent-lime transition-all duration-200 cursor-pointer"
                  >
                    <span>{item.ctaText}</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner / Advisory Callout */}
        <div className="p-6 sm:p-8 rounded-2xl bg-liquid-deep/70 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-medium text-platinum">
              ¿No sabes qué nivel de automatización necesita tu empresa?
            </h4>
            <p className="text-xs sm:text-sm text-silver-mist">
              Evaluamos la infraestructura de tu negocio y te recomendamos la solución más rentable sin costos innecesarios.
            </p>
          </div>
          <button
            onClick={() => onOpenLeadModal({ servicePreset: "Diagnóstico General B2B" })}
            className="btn-aurora text-xs uppercase tracking-wider whitespace-nowrap flex-shrink-0 cursor-pointer"
          >
            Evaluar Viabilidad y Cotizar con IA
          </button>
        </div>
      </div>
    </section>
  );
}
