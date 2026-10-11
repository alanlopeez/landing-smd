"use client";

import React from "react";
import { ShieldCheck, Zap, TrendingUp, CheckCircle2, ArrowUpRight, Sparkles } from "lucide-react";

interface RecurringCarePlansSectionProps {
  onOpenLeadModal: () => void;
}

export default function RecurringCarePlansSection({ onOpenLeadModal }: RecurringCarePlansSectionProps) {
  return (
    <section
      id="planes-recurrentes"
      className="relative w-full bg-liquid-deep py-20 sm:py-28 px-6 border-t border-white/5 overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-bioluminescent-lime/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-14 relative z-10">
        
        {/* Header de Sección */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-liquid-abyss border border-white/10 text-xs font-mono uppercase tracking-widest text-bioluminescent-lime">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mantenimiento, CRO Continuo & Retorno de Inversión</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-medium text-platinum font-matter tracking-tight">
            Tu Web No Es Un Proyecto Estático. <br className="hidden sm:block" />
            <span className="text-bioluminescent-lime">Es Tu Máquina Viva de Facturación.</span>
          </h2>

          <p className="text-base sm:text-lg text-silver-mist font-matter leading-relaxed">
            Una web sin optimización pierde hasta un 25% de efectividad al año. Asegura la salud técnica de tus servidores Edge, experimenta con tests A/B continuos y multiplica el valor de cada visita con nuestros planes mensuales.
          </p>
        </div>

        {/* Grid de 3 Planes Recurrentes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          
          {/* Plan 1: Care & Performance */}
          <div className="rounded-3xl p-7 sm:p-8 flex flex-col justify-between bg-abyssal-ink/80 border border-white/10 hover:border-white/20 transition-all shadow-xl">
            <div className="space-y-5">
              <div>
                <span className="text-xs font-mono text-silver-mist uppercase tracking-widest">Tranquilidad Total</span>
                <h3 className="text-2xl font-semibold text-platinum font-matter mt-1">Care & Performance</h3>
                <p className="text-xs text-liquid-mist mt-2 leading-relaxed">
                  Monitoreo 24/7 y estabilidad técnica para que tu web jamás pierda un cliente por lentitud o caídas.
                </p>
              </div>

              <div className="py-4 border-y border-white/10">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-bold text-platinum font-matter">$180</span>
                  <span className="text-xs text-silver-mist font-mono uppercase">USD / mes</span>
                </div>
                <span className="text-[11px] text-liquid-mist block mt-1">(o $220.000 ARS/mes con Factura)</span>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-silver-mist font-matter">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-bioluminescent-lime shrink-0 mt-0.5" />
                  <span>Monitoreo 24/7 de Core Web Vitals (Puntaje 95-100 en Google)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-bioluminescent-lime shrink-0 mt-0.5" />
                  <span>Parches de ciberseguridad OWASP y cabeceras CSP automáticas</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-bioluminescent-lime shrink-0 mt-0.5" />
                  <span>Copias de seguridad diarias en infraestructura Vercel Edge</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-bioluminescent-lime shrink-0 mt-0.5" />
                  <span>Hasta 2 horas de ajustes menores de contenido y copy al mes</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-bioluminescent-lime shrink-0 mt-0.5" />
                  <span>Soporte técnico por WhatsApp en menos de 4 horas hábiles</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenLeadModal}
              className="mt-8 w-full py-3 px-5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-platinum text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Elegir Plan Care
            </button>
          </div>

          {/* Plan 2: CRO & A/B Testing Growth (Destacado) */}
          <div className="rounded-3xl p-7 sm:p-8 flex flex-col justify-between bg-liquid-abyss/95 border-2 border-bioluminescent-lime shadow-2xl shadow-bioluminescent-lime/10 relative transform md:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-bioluminescent-lime text-liquid-abyss text-[11px] font-bold font-mono uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
              Más Recomendado // Máximo ROI
            </div>

            <div className="space-y-5 pt-2">
              <div>
                <span className="text-xs font-mono text-bioluminescent-lime uppercase tracking-widest">Optimización de Conversión</span>
                <h3 className="text-2xl font-semibold text-platinum font-matter mt-1">CRO & Growth Lab</h3>
                <p className="text-xs text-liquid-mist mt-2 leading-relaxed">
                  Experimentos activos mensuales para duplicar tu tasa de conversión y exprimir cada dólar de pauta publicitaria.
                </p>
              </div>

              <div className="py-4 border-y border-white/10">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-bold text-platinum font-matter">$450</span>
                  <span className="text-xs text-silver-mist font-mono uppercase">USD / mes</span>
                </div>
                <span className="text-[11px] text-bioluminescent-lime/90 block mt-1">(o $550.000 ARS/mes con Factura)</span>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-silver-mist font-matter">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-bioluminescent-lime shrink-0 mt-0.5" />
                  <span><strong>Todo lo incluido</strong> en el Plan Care & Performance</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-bioluminescent-lime shrink-0 mt-0.5" />
                  <span><strong>Tests A/B continuos:</strong> 2 experimentos mensuales en titulares, botones y ofertas</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-bioluminescent-lime shrink-0 mt-0.5" />
                  <span>Mapas de calor (Heatmaps) y grabaciones de sesión para detectar fugas</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-bioluminescent-lime shrink-0 mt-0.5" />
                  <span>Creación de 1 nueva sección o variante de landing por trimestre</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-bioluminescent-lime shrink-0 mt-0.5" />
                  <span>Reporte mensual ejecutivo con análisis de conversiones e insights</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-bioluminescent-lime shrink-0 mt-0.5" />
                  <span>Soporte prioritario VIP directo con Alan por WhatsApp</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenLeadModal}
              className="mt-8 w-full py-3.5 px-5 rounded-full bg-bioluminescent-lime hover:bg-bioluminescent-lime/90 text-liquid-abyss text-xs font-bold uppercase tracking-wider shadow-lg shadow-bioluminescent-lime/25 transition-all hover:scale-[1.02]"
            >
              Comenzar Optimización Continua
            </button>
          </div>

          {/* Plan 3: Partner Omnicanal 360 */}
          <div className="rounded-3xl p-7 sm:p-8 flex flex-col justify-between bg-abyssal-ink/80 border border-white/10 hover:border-white/20 transition-all shadow-xl">
            <div className="space-y-5">
              <div>
                <span className="text-xs font-mono text-silver-mist uppercase tracking-widest">Escala B2B</span>
                <h3 className="text-2xl font-semibold text-platinum font-matter mt-1">Partner Omnicanal 360</h3>
                <p className="text-xs text-liquid-mist mt-2 leading-relaxed">
                  Equipo completo de ingeniería, copy y CRO actuando como tu departamento técnico in-house.
                </p>
              </div>

              <div className="py-4 border-y border-white/10">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-bold text-platinum font-matter">$890</span>
                  <span className="text-xs text-silver-mist font-mono uppercase">USD / mes</span>
                </div>
                <span className="text-[11px] text-liquid-mist block mt-1">(o $1.080.000 ARS/mes con Factura)</span>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-silver-mist font-matter">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-bioluminescent-lime shrink-0 mt-0.5" />
                  <span><strong>Todo lo incluido</strong> en CRO & Growth Lab</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-bioluminescent-lime shrink-0 mt-0.5" />
                  <span>Desarrollo de hasta 2 nuevas landing pages completas por trimestre</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-bioluminescent-lime shrink-0 mt-0.5" />
                  <span>Ajustes y entrenamiento continuo de Agentes IA en WhatsApp y CRM</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-bioluminescent-lime shrink-0 mt-0.5" />
                  <span>Auditoría de sincronización de eventos de conversión (Meta CAPI + GTM)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-bioluminescent-lime shrink-0 mt-0.5" />
                  <span>Sesión quincenal de estrategia y roadmap con directores comerciales</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenLeadModal}
              className="mt-8 w-full py-3 px-5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-platinum text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Consultar Disponibilidad Partner
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
