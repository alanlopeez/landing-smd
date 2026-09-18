"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight, Cpu, Zap, Filter, Check } from "lucide-react";

interface ValuePropositionProps {
  onOpenLeadModal: () => void;
}

export default function ValueProposition({ onOpenLeadModal }: ValuePropositionProps) {
  return (
    <section
      id="servicios"
      className="relative w-full bg-liquid-abyss py-24 sm:py-32 px-6 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <p className="text-xs uppercase tracking-[0.12em] text-silver-mist font-matter font-medium">
            AUROS ECOSYSTEM · ARQUITECTURA DIGITAL
          </p>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-medium text-platinum font-matter tracking-[-0.04em] leading-[1.05]">
            Tu negocio online, con mayor eficiencia y diseño de alta gama.
          </h2>
          <p className="text-base sm:text-lg text-silver-mist font-matter leading-relaxed">
            Como <strong className="text-platinum font-medium">diseñador de página web</strong> y productor digital, integro sistemas multi-agentes que convierten tu sitio en un motor de ventas autónomo. Si te preguntas <span className="text-liquid-mist">cómo crear mi página web</span> para destacar frente a la competencia, la respuesta es ingeniería visual y automatización.
          </p>
        </div>

        {/* 3 Main Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="surface-card p-8 sm:p-10 flex flex-col justify-between group">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-md bg-[#012624] flex items-center justify-center text-bioluminescent-lime">
                  <Cpu className="w-5 h-5" />
                </div>
                <button
                  onClick={onOpenLeadModal}
                  aria-label="Más información sobre ahorro de recursos"
                  className="w-8 h-8 rounded-[6px] bg-[rgba(3,81,75,0.5)] hover:bg-[rgba(3,81,75,0.8)] flex items-center justify-center text-platinum transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl sm:text-3xl font-medium text-platinum font-matter tracking-tight">
                  Ahorra recursos en tareas repetitivas
                </h3>
                <p className="text-sm text-silver-mist leading-relaxed font-matter">
                  Delega la recolección de datos, la cualificación inicial de prospectos y el agendamiento a agentes autónomos que trabajan las 24 horas del día.
                </p>
              </div>
            </div>

            <ul className="mt-8 pt-6 border-t border-white/5 space-y-2.5 text-xs text-liquid-mist">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-bioluminescent-lime flex-shrink-0" />
                <span>Atención y filtrado sin demoras</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-bioluminescent-lime flex-shrink-0" />
                <span>Cero fricción en la captura de datos</span>
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="surface-card p-8 sm:p-10 flex flex-col justify-between group">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-md bg-[#012624] flex items-center justify-center text-bioluminescent-lime">
                  <Zap className="w-5 h-5" />
                </div>
                <button
                  onClick={onOpenLeadModal}
                  aria-label="Más información sobre cotización instantánea"
                  className="w-8 h-8 rounded-[6px] bg-[rgba(3,81,75,0.5)] hover:bg-[rgba(3,81,75,0.8)] flex items-center justify-center text-platinum transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl sm:text-3xl font-medium text-platinum font-matter tracking-tight">
                  Cierra ventas más rápido al cotizar al instante
                </h3>
                <p className="text-sm text-silver-mist leading-relaxed font-matter">
                  Evita que tus clientes potenciales se vayan con la competencia mientras esperan un presupuesto manual. Un <strong className="text-platinum font-normal">creador de página web</strong> con lógica en tiempo real.
                </p>
              </div>
            </div>

            <ul className="mt-8 pt-6 border-t border-white/5 space-y-2.5 text-xs text-liquid-mist">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-bioluminescent-lime flex-shrink-0" />
                <span>Propuestas dinámicas según parámetros</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-bioluminescent-lime flex-shrink-0" />
                <span>Aumento inmediato de la tasa de conversión</span>
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="surface-card p-8 sm:p-10 flex flex-col justify-between group">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-md bg-[#012624] flex items-center justify-center text-bioluminescent-lime">
                  <Filter className="w-5 h-5" />
                </div>
                <button
                  onClick={onOpenLeadModal}
                  aria-label="Más información sobre embudos lógicos"
                  className="w-8 h-8 rounded-[6px] bg-[rgba(3,81,75,0.5)] hover:bg-[rgba(3,81,75,0.8)] flex items-center justify-center text-platinum transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl sm:text-3xl font-medium text-platinum font-matter tracking-tight">
                  Embudo con formularios lógicos en tiempo real
                </h3>
                <p className="text-sm text-silver-mist leading-relaxed font-matter">
                  Filtra a cada cliente según su rango de inversión, urgencia y requerimientos técnicos, enviando los prospectos calificados directamente a tu CRM o base de datos.
                </p>
              </div>
            </div>

            <ul className="mt-8 pt-6 border-t border-white/5 space-y-2.5 text-xs text-liquid-mist">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-bioluminescent-lime flex-shrink-0" />
                <span>Segmentación automática de presupuestos</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-bioluminescent-lime flex-shrink-0" />
                <span>Conexión directa con Google Sheets</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Feature Highlight Banner with 3D Robot Visual */}
        <div className="surface-card p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden relative">
          <div className="space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bioluminescent-lime/10 text-bioluminescent-lime text-xs uppercase tracking-wider font-semibold">
              Arquitectura de Cero Código Basura
            </div>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-platinum font-matter tracking-tight leading-tight">
              Sin plantillas lentas de WordPress. Construido para velocidad extrema.
            </h3>
            <p className="text-sm sm:text-base text-silver-mist leading-relaxed">
              Cada <strong className="text-platinum font-normal">diseño de página web</strong> se programa a mano con código modular, semántica HTML5 estricta y microservicios sin servidor. Esto garantiza tiempos de carga inferiores a 0.8 segundos y una experiencia fluida que enamora tanto a los usuarios como a los algoritmos de Google.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button onClick={onOpenLeadModal} className="btn-aurora text-xs">
                Comenzar Mi Proyecto Hoy
              </button>
              <span className="text-xs text-silver-mist">
                Entrega garantizada en 24 horas para proyectos seleccionados.
              </span>
            </div>
          </div>

          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex-shrink-0 flex items-center justify-center">
            {/* Subtle glow orb */}
            <div className="absolute inset-0 bg-bioluminescent-lime/10 rounded-full filter blur-3xl pointer-events-none" />
            <Image
              src="/images/robot.png"
              alt="Robot con inteligencia artificial y sistemas multi-agentes de Alan López"
              width={340}
              height={340}
              className="relative z-10 object-contain drop-shadow-none animate-float"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
