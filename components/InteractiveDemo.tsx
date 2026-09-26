"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Bot,
  Layers,
  Cpu,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Mail,
  Database,
  Play,
  Zap,
} from "lucide-react";

interface InteractiveDemoProps {
  onOpenLeadModal: (context?: {
    servicePreset?: string;
    budgetPreset?: string;
    notes?: string;
  }) => void;
}

export default function InteractiveDemo({ onOpenLeadModal }: InteractiveDemoProps) {
  const [activeTab, setActiveTab] = useState<"live-estimator" | "video-demo">("live-estimator");

  // Estados del simulador interactivo
  const [selectedObjective, setSelectedObjective] = useState<"triage" | "calculator" | "ecosystem">("calculator");
  const [selectedChannels, setSelectedChannels] = useState<{
    whatsapp: boolean;
    email: boolean;
    crm: boolean;
    calendar: boolean;
  }>({
    whatsapp: true,
    email: true,
    crm: true,
    calendar: true,
  });

  const objectives = {
    triage: {
      id: "triage",
      title: "Triaje y Calificación de Leads 24/7",
      shortTitle: "Triaje 24/7",
      description: "Agente conversacional que atiende en 30 segundos, filtra curiosos y califica con metodología BANT antes de agendar.",
      recommendedTier: "Nivel 1: Asistente Especializado",
      deliveryDays: "5 a 7 días hábiles",
      estimatedInvestment: "USD $600 - $1.200",
      targetRoi: "Recuperación estimada en el primer mes evitando el abandono del 45% de leads fuera de hora.",
      techStack: ["Next.js App Router", "Typebot / Open-Source Engine", "Supabase DB", "Google Calendar Sync"],
    },
    calculator: {
      id: "calculator",
      title: "Cotizador Automático Paramétrico",
      shortTitle: "Cotizador Paramétrico",
      description: "Herramienta interactiva que calcula presupuestos en tiempo real según las variables del cliente y genera ficha técnica previa a la reunión.",
      recommendedTier: "Nivel 2: Sistema con Cotizador Inteligente",
      deliveryDays: "7 a 12 días hábiles",
      estimatedInvestment: "USD $1.200 - $2.500",
      targetRoi: "Reduce hasta un 85% las reuniones con prospectos fuera de presupuesto y triplica la tasa de cierre.",
      techStack: ["Next.js SSR / Tailwind", "Algoritmo de Scoring FAINT", "Activepieces / n8n Webhook", "CRM Passthrough"],
    },
    ecosystem: {
      id: "ecosystem",
      title: "Ecosistema Multi-Agente Autónomo",
      shortTitle: "Ecosistema Multi-Agente",
      description: "Orquestación completa con agentes de IA autónomos que investigan el prospecto, sincronizan el CRM y redactan briefs previos.",
      recommendedTier: "Nivel 3: Ecosistema Autónomo Completo",
      deliveryDays: "14 a 21 días hábiles",
      estimatedInvestment: "USD $2.500 - $4.800+",
      targetRoi: "Operación de ventas y atención sin fricción manual, escalando a cientos de leads mensuales con cero personal extra.",
      techStack: ["Arquitectura Multi-Agente", "CRM Integrado con IA de Correo", "RAG Empresarial", "Notificaciones Multicanal"],
    },
  };

  const currentConfig = objectives[selectedObjective];

  const toggleChannel = (channel: keyof typeof selectedChannels) => {
    setSelectedChannels((prev) => ({
      ...prev,
      [channel]: !prev[channel],
    }));
  };

  const handleProceedToQualification = () => {
    onOpenLeadModal({
      servicePreset: currentConfig.title,
      budgetPreset: currentConfig.estimatedInvestment,
      notes: `Canales seleccionados: ${Object.entries(selectedChannels)
        .filter(([, active]) => active)
        .map(([name]) => name)
        .join(", ")}`,
    });
  };

  return (
    <section
      id="demo"
      className="relative w-full bg-liquid-abyss py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 scroll-mt-20"
      aria-labelledby="interactive-demo-title"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bioluminescent-lime/10 border border-bioluminescent-lime/20 text-bioluminescent-lime text-xs font-semibold uppercase tracking-wide">
            <Cpu className="w-3.5 h-3.5" />
            Demostración en Vivo & Dogfooding
          </div>
          <h2
            id="interactive-demo-title"
            className="text-3xl sm:text-5xl font-medium text-platinum font-matter tracking-tight"
          >
            Experimenta el Cotizador y Evaluador con IA en Tiempo Real
          </h2>
          <p className="text-sm sm:text-base text-silver-mist leading-relaxed font-matter">
            No te quedes con una promesa en texto. Configura aquí los requerimientos de tu empresa y observa cómo un sistema inteligente analiza tu caso, estima tiempos de desarrollo y define la arquitectura óptima.
          </p>
        </div>

        {/* Tab Selector: Live Estimator vs Video */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-xl bg-liquid-deep border border-white/10 text-xs sm:text-sm font-matter">
            <button
              type="button"
              onClick={() => setActiveTab("live-estimator")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                activeTab === "live-estimator"
                  ? "bg-bioluminescent-lime text-abyssal-ink font-semibold shadow-md shadow-bioluminescent-lime/20"
                  : "text-silver-mist hover:text-white"
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Cotizador & Evaluador en Vivo</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("video-demo")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                activeTab === "video-demo"
                  ? "bg-bioluminescent-lime text-abyssal-ink font-semibold shadow-md shadow-bioluminescent-lime/20"
                  : "text-silver-mist hover:text-white"
              }`}
            >
              <Play className="w-4 h-4" />
              <span>Ver Video Demostración (2 min)</span>
            </button>
          </div>
        </div>

        {/* PESTAÑA 1: COTIZADOR INTERACTIVO EN VIVO */}
        {activeTab === "live-estimator" && (
          <div className="bg-liquid-kelp/40 border border-white/10 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-md animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Columna Izquierda: Configuración Interactiva */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <label className="text-xs uppercase tracking-wider text-bioluminescent-lime font-mono block mb-2">
                    Paso 1: Selecciona el objetivo de automatización
                  </label>
                  <div className="space-y-3">
                    {(Object.keys(objectives) as (keyof typeof objectives)[]).map((key) => {
                      const obj = objectives[key];
                      const isSelected = selectedObjective === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setSelectedObjective(key)}
                          className={`w-full text-left p-4 rounded-xl border transition-all text-xs sm:text-sm ${
                            isSelected
                              ? "bg-bioluminescent-lime/15 border-bioluminescent-lime text-platinum shadow-md shadow-bioluminescent-lime/5"
                              : "bg-liquid-deep/70 border-white/5 text-silver-mist hover:border-white/20 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold font-matter mb-1">
                            <span>{obj.title}</span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-bioluminescent-lime shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-silver-mist/80 leading-relaxed font-matter">
                            {obj.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Paso 2: Canales Integrados */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-bioluminescent-lime font-mono block mb-2">
                    Paso 2: Canales e integraciones requeridas
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { key: "whatsapp", label: "WhatsApp", icon: MessageSquare },
                      { key: "email", label: "Email AI", icon: Mail },
                      { key: "crm", label: "CRM Sync", icon: Database },
                      { key: "calendar", label: "Calendar", icon: Calendar },
                    ].map((ch) => {
                      const Icon = ch.icon;
                      const isActive = selectedChannels[ch.key as keyof typeof selectedChannels];
                      return (
                        <button
                          key={ch.key}
                          type="button"
                          onClick={() => toggleChannel(ch.key as keyof typeof selectedChannels)}
                          className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 text-xs font-matter ${
                            isActive
                              ? "bg-bioluminescent-lime/20 border-bioluminescent-lime text-platinum"
                              : "bg-liquid-deep/60 border-white/5 text-silver-mist/60 hover:border-white/10"
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? "text-bioluminescent-lime" : "text-silver-mist/50"}`} />
                          <span className="text-[11px] font-medium">{ch.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Output y Estimación en Vivo */}
              <div className="lg:col-span-6 bg-liquid-deep/90 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2 text-xs font-mono text-bioluminescent-lime">
                    <span className="w-2 h-2 rounded-full bg-bioluminescent-lime animate-ping" />
                    <span>DIAGNÓSTICO PRELIMINAR DE ARQUITECTURA</span>
                  </div>
                  <span className="text-[11px] text-silver-mist font-mono">Estimación en tiempo real</span>
                </div>

                <div>
                  <span className="text-xs text-silver-mist block font-mono">Arquitectura Sugerida:</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-platinum font-matter mt-0.5">
                    {currentConfig.recommendedTier}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-liquid-kelp/30 border border-white/5">
                    <span className="text-silver-mist/70 block text-[11px]">Plazo de Implementación:</span>
                    <span className="text-sm font-semibold text-bioluminescent-lime font-matter mt-0.5 block">
                      {currentConfig.deliveryDays}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-liquid-kelp/30 border border-white/5">
                    <span className="text-silver-mist/70 block text-[11px]">Inversión Proyectada:</span>
                    <span className="text-sm font-semibold text-platinum font-matter mt-0.5 block">
                      {currentConfig.estimatedInvestment}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-liquid-abyss/80 border border-white/5 space-y-2">
                  <span className="text-[11px] uppercase tracking-wider text-bioluminescent-lime font-mono flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5" />
                    Impacto en ROI Proyectado:
                  </span>
                  <p className="text-xs text-silver-mist leading-relaxed font-matter">
                    {currentConfig.targetRoi}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] uppercase tracking-wider text-silver-mist font-mono block mb-2">
                    Componentes Técnicos Desplegados:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentConfig.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] text-silver-mist font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Maestro */}
                <button
                  type="button"
                  onClick={handleProceedToQualification}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-bioluminescent-lime text-abyssal-ink font-semibold text-sm sm:text-base font-matter shadow-lg shadow-bioluminescent-lime/20 hover:bg-[#b8eb80] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-abyssal-ink" />
                  <span>Evaluar Viabilidad y Cotizar Proyecto con IA</span>
                  <ArrowRight className="w-4 h-4 text-abyssal-ink" />
                </button>

                <div className="flex items-center justify-center gap-4 text-[11px] text-silver-mist/70 pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-bioluminescent-lime" />
                    Sin compromiso comercial
                  </span>
                  <span>•</span>
                  <span>Respuesta técnica en 24h</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 2: DEMOSTRACIÓN EN VIDEO */}
        {activeTab === "video-demo" && (
          <div className="surface-card p-6 sm:p-8 lg:p-10 max-w-5xl mx-auto space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-white/5">
              <div className="flex items-center gap-2.5 text-xs font-mono uppercase tracking-wider text-bioluminescent-lime">
                <span className="w-2 h-2 rounded-full bg-bioluminescent-lime animate-pulse" />
                <span>CASO EN PRODUCCIÓN · FLUJO MULTI-AGENTE</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-silver-mist">
                <Play className="w-3 h-3 text-bioluminescent-lime fill-current" />
                <span>Demostración de Arquitectura</span>
              </div>
            </div>

            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-liquid-deep border border-white/10 shadow-2xl">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/DhF6n7KLbns?si=ZuSGY2B_HKFP_Yoo"
                title="Demostración de sistema multi-agentes y cotizador automático"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-base font-medium text-platinum font-matter">
                  ¿Te gustaría desplegar este sistema en tu negocio?
                </h3>
                <p className="text-xs text-silver-mist font-matter">
                  Estructuramos tu sitio web con cotizadores automáticos y asistentes conversacionales listo en 24 a 48 horas.
                </p>
              </div>

              <button
                type="button"
                onClick={handleProceedToQualification}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-bioluminescent-lime text-abyssal-ink font-semibold text-xs sm:text-sm font-matter uppercase tracking-wider shadow-lg shadow-bioluminescent-lime/10 hover:bg-[#b8eb80] transition-all cursor-pointer"
              >
                <span>Evaluar Viabilidad y Cotizar Proyecto con IA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
