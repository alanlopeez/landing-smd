"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, Bot, Sliders, ShieldCheck } from "lucide-react";

interface InteractiveDemoProps {
  onOpenLeadModal: () => void;
}

export default function InteractiveDemo({ onOpenLeadModal }: InteractiveDemoProps) {
  const [projectType, setProjectType] = useState<"landing" | "ecommerce" | "saas">("landing");
  const [automationLevel, setAutomationLevel] = useState<"standard" | "pro" | "enterprise">("pro");
  const [timeline, setTimeline] = useState<"24h" | "30d">("24h");

  const calculateEstimate = () => {
    let baseTime = timeline === "24h" ? "24 Horas" : "15 - 30 Días";
    let conversionRate = "+72%";
    let weeklySaved = "22 Horas / semana";

    if (projectType === "saas") {
      conversionRate = "+84%";
      weeklySaved = "35 Horas / semana";
    } else if (projectType === "ecommerce") {
      conversionRate = "+68%";
      weeklySaved = "28 Horas / semana";
    }

    return { baseTime, conversionRate, weeklySaved };
  };

  const metrics = calculateEstimate();

  return (
    <section
      id="demo"
      className="relative w-full bg-liquid-abyss py-24 px-6 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <p className="text-xs uppercase tracking-[0.15em] text-silver-mist font-matter font-medium">
            SIMULADOR EN TIEMPO REAL · PROYECTO DEMO
          </p>
          <h2 className="text-3xl sm:text-5xl font-medium text-platinum font-matter tracking-tight">
            ¿Cómo funciona un sitio con sistemas multi-agentes?
          </h2>
          <p className="text-sm sm:text-base text-silver-mist leading-relaxed font-matter">
            Experimenta cómo la lógica de calificación y cotización instantánea filtra a tus prospectos y entrega un diagnóstico técnico en milisegundos.
          </p>
        </div>

        {/* Interactive Playground Card */}
        <div className="surface-card p-6 sm:p-10 lg:p-12 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-bioluminescent-lime font-semibold">
                <Sliders className="w-4 h-4" />
                Configurador de Demostración
              </div>

              {/* Selector 1: Tipo de Sitio */}
              <div>
                <label className="block text-xs uppercase tracking-wide text-platinum mb-2 font-medium">
                  1. Modelo de Negocio:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setProjectType("landing")}
                    className={`py-2.5 px-3 text-xs rounded-md border text-center transition-all ${
                      projectType === "landing"
                        ? "bg-liquid-abyss border-bioluminescent-lime text-bioluminescent-lime font-medium"
                        : "bg-liquid-abyss/40 border-white/10 text-silver-mist hover:text-white"
                    }`}
                  >
                    Landing Freelance
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectType("ecommerce")}
                    className={`py-2.5 px-3 text-xs rounded-md border text-center transition-all ${
                      projectType === "ecommerce"
                        ? "bg-liquid-abyss border-bioluminescent-lime text-bioluminescent-lime font-medium"
                        : "bg-liquid-abyss/40 border-white/10 text-silver-mist hover:text-white"
                    }`}
                  >
                    E-Commerce
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectType("saas")}
                    className={`py-2.5 px-3 text-xs rounded-md border text-center transition-all ${
                      projectType === "saas"
                        ? "bg-liquid-abyss border-bioluminescent-lime text-bioluminescent-lime font-medium"
                        : "bg-liquid-abyss/40 border-white/10 text-silver-mist hover:text-white"
                    }`}
                  >
                    SaaS / App Web
                  </button>
                </div>
              </div>

              {/* Selector 2: Nivel de Automatización */}
              <div>
                <label className="block text-xs uppercase tracking-wide text-platinum mb-2 font-medium">
                  2. Nivel de Sistemas Multi-Agentes:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAutomationLevel("standard")}
                    className={`py-2.5 px-3 text-xs rounded-md border text-center transition-all ${
                      automationLevel === "standard"
                        ? "bg-liquid-abyss border-bioluminescent-lime text-bioluminescent-lime font-medium"
                        : "bg-liquid-abyss/40 border-white/10 text-silver-mist hover:text-white"
                    }`}
                  >
                    Formulario Lógico
                  </button>
                  <button
                    type="button"
                    onClick={() => setAutomationLevel("pro")}
                    className={`py-2.5 px-3 text-xs rounded-md border text-center transition-all ${
                      automationLevel === "pro"
                        ? "bg-liquid-abyss border-bioluminescent-lime text-bioluminescent-lime font-medium"
                        : "bg-liquid-abyss/40 border-white/10 text-silver-mist hover:text-white"
                    }`}
                  >
                    Multi-Agente Pro
                  </button>
                  <button
                    type="button"
                    onClick={() => setAutomationLevel("enterprise")}
                    className={`py-2.5 px-3 text-xs rounded-md border text-center transition-all ${
                      automationLevel === "enterprise"
                        ? "bg-liquid-abyss border-bioluminescent-lime text-bioluminescent-lime font-medium"
                        : "bg-liquid-abyss/40 border-white/10 text-silver-mist hover:text-white"
                    }`}
                  >
                    Ecosistema Total
                  </button>
                </div>
              </div>

              {/* Selector 3: Plazo de entrega */}
              <div>
                <label className="block text-xs uppercase tracking-wide text-platinum mb-2 font-medium">
                  3. Plazo de Entrega Requerido:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTimeline("24h")}
                    className={`py-2.5 px-3 text-xs rounded-md border text-center transition-all flex items-center justify-center gap-2 ${
                      timeline === "24h"
                        ? "bg-liquid-abyss border-bioluminescent-lime text-bioluminescent-lime font-medium"
                        : "bg-liquid-abyss/40 border-white/10 text-silver-mist hover:text-white"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Oferta Especial (24 Horas)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeline("30d")}
                    className={`py-2.5 px-3 text-xs rounded-md border text-center transition-all ${
                      timeline === "30d"
                        ? "bg-liquid-abyss border-bioluminescent-lime text-bioluminescent-lime font-medium"
                        : "bg-liquid-abyss/40 border-white/10 text-silver-mist hover:text-white"
                    }`}
                  >
                    Desarrollo en 30 Días
                  </button>
                </div>
              </div>
            </div>

            {/* Right Output Terminal */}
            <div className="lg:col-span-5 bg-liquid-abyss border border-white/10 rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-bioluminescent-lime" />
                  <span className="text-xs font-mono text-platinum">DIAGNÓSTICO EN TIEMPO REAL</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-bioluminescent-lime animate-ping" />
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-silver-mist block">
                    Tiempo de despliegue:
                  </span>
                  <span className="text-2xl font-matter font-medium text-platinum">
                    {metrics.baseTime}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] uppercase tracking-wider text-silver-mist block">
                    Impacto en Tasa de Conversión:
                  </span>
                  <span className="text-3xl font-matter font-medium text-lavender-phosphor tracking-tight">
                    {metrics.conversionRate}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] uppercase tracking-wider text-silver-mist block">
                    Tiempo Ahorrado en Operaciones:
                  </span>
                  <span className="text-base font-matter text-liquid-mist">
                    {metrics.weeklySaved}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenLeadModal}
                  className="w-full btn-aurora text-xs py-3 justify-center"
                >
                  <span>Solicitar una llamada con esta DEMO</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-silver-mist/70">
                <ShieldCheck className="w-3.5 h-3.5 text-bioluminescent-lime" />
                <span>Sin compromiso de compra. Cotización transparente.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
