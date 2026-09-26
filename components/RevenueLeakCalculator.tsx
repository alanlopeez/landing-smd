"use client";

import React, { useState, useId } from "react";
import {
  TrendingDown,
  Clock,
  DollarSign,
  Users,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

interface RevenueLeakCalculatorProps {
  onOpenQualification: (context?: {
    volume?: string;
    budget?: string;
    estimatedLoss?: number;
    source?: string;
  }) => void;
}

export default function RevenueLeakCalculator({
  onOpenQualification,
}: RevenueLeakCalculatorProps) {
  const [monthlyLeads, setMonthlyLeads] = useState<number>(75);
  const [avgTicket, setAvgTicket] = useState<number>(650);
  const [responseTimeKey, setResponseTimeKey] = useState<
    "fast" | "moderate" | "slow" | "critical"
  >("slow");

  const leadsId = useId();
  const ticketId = useId();

  // Factores de fuga basados en estudios de Harvard Business Review y Drift
  const responseTimeProfiles = {
    fast: {
      label: "< 15 min (Rápido)",
      leakRate: 0.15,
      description: "Pérdida mínima, pero con sobrecarga manual si no hay IA.",
      badgeColor: "text-emerald-400 bg-emerald-950/40 border-emerald-500/30",
    },
    moderate: {
      label: "1 a 4 horas (Típico)",
      leakRate: 0.35,
      description: "El 35% de los prospectos cotiza con un competidor antes.",
      badgeColor: "text-amber-300 bg-amber-950/40 border-amber-500/30",
    },
    slow: {
      label: "4 a 24 horas (Lento)",
      leakRate: 0.55,
      description: "Más de la mitad de tus prospectos se enfrían o resuelven con otro.",
      badgeColor: "text-orange-400 bg-orange-950/40 border-orange-500/30",
    },
    critical: {
      label: "+24h o Fines de semana desatendidos",
      leakRate: 0.75,
      description: "El 75% del tráfico publicitario y orgánico fuera de hora se desperdicia.",
      badgeColor: "text-red-400 bg-red-950/40 border-red-500/30",
    },
  };

  const currentProfile = responseTimeProfiles[responseTimeKey];

  // Supuesto conservador: tasa de cierre base del 12% sobre leads atendidos a tiempo
  const baseConversionRate = 0.12;
  const potentialClientsWithoutLeak = monthlyLeads * baseConversionRate;
  const lostClientsPerMonth = Math.round(potentialClientsWithoutLeak * currentProfile.leakRate * 10) / 10;
  const monthlyRevenueLeak = Math.round(lostClientsPerMonth * avgTicket);
  const annualRevenueLeak = monthlyRevenueLeak * 12;
  const humanHoursSaved = Math.round((monthlyLeads * 18) / 60); // 18 min de triaje, seguimiento y calificación manual por lead

  const handleCtaClick = () => {
    let volumeCategory = "50 a 200 consultas/mes";
    if (monthlyLeads < 20) volumeCategory = "Menos de 20 consultas/mes";
    else if (monthlyLeads <= 50) volumeCategory = "20 a 50 consultas/mes";
    else if (monthlyLeads > 200) volumeCategory = "Más de 200 consultas/mes";

    onOpenQualification({
      volume: volumeCategory,
      budget: avgTicket >= 1500 ? "Más de USD 1.500" : "USD 500 a USD 1.500",
      estimatedLoss: monthlyRevenueLeak,
      source: "Calculadora de Fuga de Ingresos",
    });
  };

  return (
    <section
      id="calculadora-roi"
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20"
      aria-labelledby="calculator-heading"
    >
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bioluminescent-lime/10 border border-bioluminescent-lime/20 text-bioluminescent-lime text-xs font-semibold uppercase tracking-wide mb-4">
          <TrendingDown className="w-3.5 h-3.5" />
          Diagnóstico Financiero Interactivo
        </div>
        <h2
          id="calculator-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-medium text-platinum font-matter tracking-tight"
        >
          ¿Cuánto dinero pierde tu empresa por responder fuera de tiempo?
        </h2>
        <p className="mt-4 text-silver-mist text-base sm:text-lg leading-relaxed">
          En ventas B2B, el <strong className="text-platinum font-medium">78% de los compradores</strong> contrata al primer proveedor que responde con una propuesta clara. Ajusta tus métricas y calcula la fuga oculta en tu operación actual.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controles de Entrada */}
        <div className="lg:col-span-7 bg-liquid-kelp/40 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
          <div className="space-y-7">
            {/* Control 1: Volumen de leads */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <label
                  htmlFor={leadsId}
                  className="text-sm sm:text-base font-medium text-platinum flex items-center gap-2 font-matter"
                >
                  <Users className="w-4 h-4 text-bioluminescent-lime" />
                  Consultas o leads recibidos por mes:
                </label>
                <span className="text-lg font-bold text-bioluminescent-lime font-matter px-3 py-0.5 rounded-md bg-liquid-abyss/80 border border-white/5">
                  {monthlyLeads} <span className="text-xs text-silver-mist font-normal">prospectos</span>
                </span>
              </div>
              <input
                id={leadsId}
                type="range"
                min="10"
                max="400"
                step="5"
                value={monthlyLeads}
                onChange={(e) => setMonthlyLeads(Number(e.target.value))}
                className="w-full h-2 bg-liquid-deep rounded-lg appearance-none cursor-pointer accent-bioluminescent-lime"
                aria-label="Consultas o leads recibidos por mes"
              />
              <div className="flex justify-between text-[11px] text-silver-mist/70 mt-1 font-matter">
                <span>10 (Boutique)</span>
                <span>100 (Mediana)</span>
                <span>250+ (Alto flujo)</span>
                <span>400+</span>
              </div>
            </div>

            {/* Control 2: Ticket promedio */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <label
                  htmlFor={ticketId}
                  className="text-sm sm:text-base font-medium text-platinum flex items-center gap-2 font-matter"
                >
                  <DollarSign className="w-4 h-4 text-bioluminescent-lime" />
                  Ticket promedio de tu servicio o venta (USD):
                </label>
                <span className="text-lg font-bold text-bioluminescent-lime font-matter px-3 py-0.5 rounded-md bg-liquid-abyss/80 border border-white/5">
                  ${avgTicket.toLocaleString()} <span className="text-xs text-silver-mist font-normal">USD</span>
                </span>
              </div>
              <input
                id={ticketId}
                type="range"
                min="150"
                max="4000"
                step="50"
                value={avgTicket}
                onChange={(e) => setAvgTicket(Number(e.target.value))}
                className="w-full h-2 bg-liquid-deep rounded-lg appearance-none cursor-pointer accent-bioluminescent-lime"
                aria-label="Ticket promedio en dólares"
              />
              <div className="flex justify-between text-[11px] text-silver-mist/70 mt-1 font-matter">
                <span>$150 USD</span>
                <span>$1.000 USD</span>
                <span>$2.500 USD</span>
                <span>$4.000+ USD</span>
              </div>
            </div>

            {/* Control 3: Tiempo promedio de respuesta */}
            <div>
              <label className="text-sm sm:text-base font-medium text-platinum flex items-center gap-2 mb-3 font-matter">
                <Clock className="w-4 h-4 text-bioluminescent-lime" />
                Tiempo promedio actual de primera respuesta comercial:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(
                  [
                    "fast",
                    "moderate",
                    "slow",
                    "critical",
                  ] as (keyof typeof responseTimeProfiles)[]
                ).map((key) => {
                  const item = responseTimeProfiles[key];
                  const isSelected = responseTimeKey === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setResponseTimeKey(key)}
                      className={`text-left p-3 rounded-xl border text-xs sm:text-sm transition-all duration-200 ${
                        isSelected
                          ? "bg-bioluminescent-lime/15 border-bioluminescent-lime text-platinum shadow-md shadow-bioluminescent-lime/5"
                          : "bg-liquid-deep/60 border-white/5 text-silver-mist hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <div className="font-semibold flex items-center justify-between">
                        <span>{item.label}</span>
                        {isSelected && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-bioluminescent-lime shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-silver-mist/80 mt-1 leading-snug">
                        {item.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Benchmark Nota */}
            <div className="p-3.5 rounded-xl bg-liquid-deep/50 border border-white/5 flex items-start gap-2.5 text-xs text-silver-mist/90">
              <ShieldCheck className="w-4 h-4 text-bioluminescent-lime shrink-0 mt-0.5" />
              <span>
                <strong>Benchmark HBR / MIT:</strong> Responder en menos de 5 minutos incrementa <strong>21 veces</strong> la probabilidad de calificar y cerrar un prospecto frente a demorar 30 minutos.
              </span>
            </div>
          </div>
        </div>

        {/* Panel de Resultados y Fuga */}
        <div className="lg:col-span-5 bg-gradient-to-b from-liquid-deep via-liquid-kelp/50 to-liquid-deep border border-red-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Luz de fondo sutil */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-red-300 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            Fuga Financiera Estimada
          </div>

          <div className="mt-2 mb-6">
            <div className="text-4xl sm:text-5xl font-bold font-matter text-platinum tracking-tight">
              ${monthlyRevenueLeak.toLocaleString()}
              <span className="text-sm font-normal text-silver-mist ml-1.5">
                USD / mes
              </span>
            </div>
            <div className="text-xs text-red-300/80 font-matter mt-1">
              Equivalente a ≈ <strong className="text-red-200">${annualRevenueLeak.toLocaleString()} USD</strong> al año en ventas no cerradas.
            </div>
          </div>

          {/* Métricas secundarias */}
          <div className="grid grid-cols-2 gap-3 mb-6 pt-4 border-t border-white/10 text-xs">
            <div className="p-3 rounded-lg bg-liquid-abyss/80 border border-white/5">
              <span className="text-silver-mist/70 block">Clientes perdidos:</span>
              <span className="text-base font-semibold text-platinum font-matter">
                ≈ {lostClientsPerMonth} clientes / mes
              </span>
            </div>
            <div className="p-3 rounded-lg bg-liquid-abyss/80 border border-white/5">
              <span className="text-silver-mist/70 block">Horas manuales:</span>
              <span className="text-base font-semibold text-bioluminescent-lime font-matter">
                ≈ {humanHoursSaved}h / mes
              </span>
            </div>
          </div>

          {/* Lo que soluciona el sistema con IA */}
          <div className="space-y-2 mb-7 text-xs text-silver-mist">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-bioluminescent-lime shrink-0" />
              <span>Respuesta inmediata en <strong>30 segundos</strong> 24/7/365.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-bioluminescent-lime shrink-0" />
              <span>Calificación B2B con descarte automático de curiosos.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-bioluminescent-lime shrink-0" />
              <span>Agendamiento directo sincronizado con Google Calendar.</span>
            </div>
          </div>

          {/* CTA Maestro */}
          <button
            type="button"
            onClick={handleCtaClick}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-bioluminescent-lime text-abyssal-ink font-semibold text-sm sm:text-base font-matter shadow-lg shadow-bioluminescent-lime/20 hover:bg-[#b8eb80] hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <Sparkles className="w-4 h-4 text-abyssal-ink" />
            <span>Automatizar este proceso ahora</span>
            <ArrowRight className="w-4 h-4 text-abyssal-ink" />
          </button>

          <p className="text-[11px] text-center text-silver-mist/60 mt-3 font-matter">
            Evaluación técnica sin compromiso • Respuesta y diagnóstico preliminar en 24h
          </p>
        </div>
      </div>
    </section>
  );
}
