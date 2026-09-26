"use client";

import React from "react";
import {
  ArrowUpRight,
  Zap,
  Bot,
  Search,
  Share2,
  Sliders,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
  PhoneCall,
  Activity,
  ShieldCheck,
  Clock,
  Building2,
} from "lucide-react";

interface SpecializedServicesSectionProps {
  onOpenLeadModal?: (context?: { servicePreset?: string }) => void;
}

export default function SpecializedServicesSection({
  onOpenLeadModal,
}: SpecializedServicesSectionProps) {
  return (
    <section
      id="soluciones-autonomas"
      className="relative w-full bg-liquid-abyss py-24 sm:py-32 px-6 border-t border-white/5 overflow-hidden"
      aria-label="Servicios especializados de automatización e infraestructura con IA"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[350px] bg-bioluminescent-lime/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[350px] bg-sky-400/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-[0.12em] text-silver-mist">
            <span className="w-2 h-2 rounded-full bg-bioluminescent-lime animate-pulse" />
            Servicios Llave en Mano · Ofertas de Validación
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-medium text-platinum font-matter tracking-tight leading-[1.08]">
            Sistemas autónomos diseñados para multiplicar tus clientes.
          </h2>
          <p className="text-base sm:text-lg text-silver-mist font-matter leading-relaxed">
            Sin la lentitud de una agencia tradicional ni la complejidad de contratar desarrolladores internos. Implementamos motores de captación y departamentos completos con agentes de IA listos para operar.
          </p>
        </div>

        {/* 2 Flagship Services Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* ============================================================ */}
          {/* SERVICIO 1: MOTOR AUTÓNOMO DE MARKETING Y SEO LOCAL CON IA */}
          {/* ============================================================ */}
          <article className="surface-card p-8 sm:p-10 flex flex-col justify-between group transition-all duration-300 hover:border-bioluminescent-lime/40 relative rounded-2xl">
            {/* Top Pill / Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                <Clock className="w-3.5 h-3.5" />
                Setup Express en 72 Horas
              </span>
              <span className="text-[11px] font-mono text-silver-mist uppercase tracking-widest">
                Profesionales & Pymes
              </span>
            </div>

            <div className="space-y-6">
              {/* Icon & Category */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#012624] border border-white/10 flex items-center justify-center text-bioluminescent-lime group-hover:scale-105 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-bioluminescent-lime">
                    Instalación de automatizaciones
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-medium text-platinum font-matter tracking-tight">
                    Motor Autónomo de Marketing y SEO Local con IA
                  </h3>
                </div>
              </div>

              {/* Value Proposition Quote */}
              <blockquote className="p-4 rounded-xl bg-liquid-deep/80 border-l-2 border-bioluminescent-lime text-sm sm:text-base text-platinum/90 italic font-matter leading-relaxed">
                «Multiplica tu presencia orgánica y capta clientes calificados sin contratar una agencia ni dedicar 4 horas al día a crear contenido.»
              </blockquote>

              {/* Target Audience Tag */}
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-mono uppercase tracking-wider text-silver-mist">
                  ¿Para quién está diseñado?
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-platinum">
                    Estudios contables
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-platinum">
                    Consultores y clínicas
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-platinum">
                    Contratistas
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-platinum">
                    Creadores B2B
                  </span>
                </div>
              </div>

              {/* Inclusions / Deliverables */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <p className="text-xs font-mono uppercase tracking-wider text-silver-mist">
                  Qué incluye esta implementación:
                </p>

                <ul className="space-y-3 text-xs sm:text-sm text-silver-mist font-matter">
                  <li className="flex items-start gap-3">
                    <Search className="w-4 h-4 text-bioluminescent-lime flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-platinum font-medium">Investigación continua:</strong> Agente de IA que monitorea tendencias de búsqueda y competidores locales semanalmente.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-bioluminescent-lime flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-platinum font-medium">Generación y SEO:</strong> Redacción y publicación automática de artículos optimizados para posicionar en Google.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Share2 className="w-4 h-4 text-bioluminescent-lime flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-platinum font-medium">Distribución multicanal:</strong> Adaptación y programación de contenidos en redes sociales (LinkedIn, Instagram/Meta) vía orquestador.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sliders className="w-4 h-4 text-bioluminescent-lime flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-platinum font-medium">Memoria y tono de marca:</strong> Configuración del contexto específico de tu negocio para evitar contenido genérico de IA.
                    </div>
                  </li>
                </ul>
              </div>

              {/* Price Block */}
              <div className="p-4 rounded-xl bg-liquid-deep/70 border border-white/10 space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-silver-mist">
                    Setup único de validación:
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-platinum font-matter">
                    $1.200 <span className="text-xs font-normal text-silver-mist">USD</span>
                  </span>
                </div>
                <p className="text-[11px] text-silver-mist font-mono">
                  + costo de consumo de APIs (~$30–$50/mes a cargo del cliente)
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-8">
              <button
                type="button"
                onClick={() =>
                  onOpenLeadModal
                    ? onOpenLeadModal({ servicePreset: "Nivel 1: Asistente Conversacional B2B" })
                    : window.open("https://calendar.app.google/dhGQgyMUs2eHBPgN9", "_blank")
                }
                className="w-full group/btn relative inline-flex items-center justify-between px-6 py-4 rounded-xl bg-bioluminescent-lime hover:bg-bioluminescent-lime/90 text-liquid-abyss text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-bioluminescent-lime/20 cursor-pointer"
                aria-label="Evaluar Viabilidad y Cotizar Nivel 1 con IA"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-liquid-abyss" />
                  <span>Evaluar Viabilidad y Cotizar con IA</span>
                </div>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </button>
              <p className="text-center text-[11px] text-silver-mist/70 pt-2 font-mono">
                Evaluación en 5 preguntas • Desbloquea agenda en Google Calendar
              </p>
            </div>
          </article>

          {/* ============================================================ */}
          {/* SERVICIO 2: DEPARTAMENTO DE MARKETING 100% AUTÓNOMO CON IA */}
          {/* ============================================================ */}
          <article className="surface-card p-8 sm:p-10 flex flex-col justify-between group transition-all duration-300 hover:border-sky-400/40 relative rounded-2xl border-white/15">
            {/* Top Pill / Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-sky-400/10 text-sky-300 border border-sky-400/20">
                <Building2 className="w-3.5 h-3.5" />
                Infraestructura Integral Corporativa
              </span>
              <span className="text-[11px] font-mono text-silver-mist uppercase tracking-widest">
                Tickets Altos & Firmas
              </span>
            </div>

            <div className="space-y-6">
              {/* Icon & Category */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#01222e] border border-sky-400/20 flex items-center justify-center text-sky-300 group-hover:scale-105 transition-transform">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-sky-300">
                    Servicio Llave en Mano
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-medium text-platinum font-matter tracking-tight">
                    Departamento de Marketing y Captación 100% Autónomo con Agentes de IA
                  </h3>
                </div>
              </div>

              {/* Value Proposition Quote */}
              <blockquote className="p-4 rounded-xl bg-liquid-deep/80 border-l-2 border-sky-400 text-sm sm:text-base text-platinum/90 italic font-matter leading-relaxed">
                «Sustituye la fricción y el costo de un equipo tradicional de marketing por un ecosistema de agentes inteligentes que investigan, publican, optimizan pauta y derivan llamadas calificadas a tu equipo comercial.»
              </blockquote>

              {/* Target Audience Tag */}
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-mono uppercase tracking-wider text-silver-mist">
                  ¿Para quién está diseñado?
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-platinum">
                    Firmas legales y abogados
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-platinum">
                    Empresas constructoras y refacción
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-platinum">
                    Servicios B2B de alto ticket
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-platinum">
                    Clínicas de cirugía estética
                  </span>
                </div>
              </div>

              {/* Inclusions / Deliverables */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <p className="text-xs font-mono uppercase tracking-wider text-silver-mist">
                  Qué incluye esta infraestructura integral:
                </p>

                <ul className="space-y-3 text-xs sm:text-sm text-silver-mist font-matter">
                  <li className="flex items-start gap-3">
                    <Layers className="w-4 h-4 text-sky-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-platinum font-medium">Orquestador centralizado:</strong> Coordinación de agentes con aprobaciones automáticas y alertas por excepción.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <TrendingUp className="w-4 h-4 text-sky-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-platinum font-medium">Módulo de Tráfico Pagado & SEO:</strong> Creación de campañas de búsqueda en Google/Meta y optimización continua de páginas de aterrizaje.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <PhoneCall className="w-4 h-4 text-sky-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-platinum font-medium">Call Tracking y Calificación de Leads:</strong> Enrutamiento inteligente de llamadas y formularios directo al CRM con resumen previo del caso.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Activity className="w-4 h-4 text-sky-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-platinum font-medium">Panel de control ejecutivo:</strong> Métricas de costo por adquisición (CPA) y retorno de inversión en tiempo real.
                    </div>
                  </li>
                </ul>
              </div>

              {/* Price Block */}
              <div className="p-4 rounded-xl bg-liquid-deep/70 border border-white/10 space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-silver-mist">
                    Implementación corporativa:
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-platinum font-matter">
                    $8.000 <span className="text-xs font-normal text-silver-mist">USD</span>
                  </span>
                </div>
                <p className="text-[11px] text-sky-200/90 font-mono">
                  + retainer mensual de soporte/optimización de $800 – $1.500 USD/mes
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-8">
              <button
                type="button"
                onClick={() =>
                  onOpenLeadModal
                    ? onOpenLeadModal({ servicePreset: "Nivel 2: Ecosistema Multi-Agente Autónomo" })
                    : window.open("https://calendar.app.google/xo1qqYbiVVpQTzCP8", "_blank")
                }
                className="w-full group/btn relative inline-flex items-center justify-between px-6 py-4 rounded-xl bg-gradient-to-r from-sky-400 to-teal-400 hover:from-sky-300 hover:to-teal-300 text-liquid-abyss text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-sky-400/20 cursor-pointer"
                aria-label="Evaluar Viabilidad y Cotizar Arquitectura Enterprise con IA"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-liquid-abyss" />
                  <span>Evaluar Viabilidad y Cotizar con IA</span>
                </div>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </button>
              <p className="text-center text-[11px] text-silver-mist/70 pt-2 font-mono">
                Evaluación en 5 preguntas • Desbloquea sesión estratégica de arquitectura
              </p>
            </div>
          </article>
        </div>

        {/* Confidence / Trust Guarantee Strip */}
        <div className="p-6 rounded-2xl bg-liquid-deep/50 border border-white/5 flex flex-wrap items-center justify-around gap-6 text-xs text-silver-mist">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-bioluminescent-lime" />
            <span>Infraestructura probada sin lock-in tecnológico</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-bioluminescent-lime" />
            <span>Aprobaciones humanas para acciones críticas</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-bioluminescent-lime" />
            <span>Adaptación completa a la identidad de tu marca</span>
          </div>
        </div>
      </div>
    </section>
  );
}
