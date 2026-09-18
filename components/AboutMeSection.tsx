"use client";

import React from "react";
import Image from "next/image";
import { Award, TrendingUp, Users, Search, PlayCircle, Cpu, ArrowUpRight } from "lucide-react";

interface AboutMeSectionProps {
  onOpenLeadModal: () => void;
}

export default function AboutMeSection({ onOpenLeadModal }: AboutMeSectionProps) {
  return (
    <section
      id="sobre-mi"
      className="relative w-full bg-liquid-abyss py-24 sm:py-32 px-6 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Top Header */}
        <div className="max-w-3xl space-y-4">
          <p className="text-xs uppercase tracking-[0.12em] text-silver-mist font-matter font-medium">
            PRODUCTOR DIGITAL · TRAYECTORIA & ENFOQUE
          </p>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-medium text-platinum font-matter tracking-[-0.04em] leading-[1.05]">
            No solo diseño estrategias; las convierto en crecimiento comercial tangible.
          </h2>
        </div>

        {/* Bio & Profile Card */}
        <div className="surface-card p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Alan López Photo */}
            <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden border-2 border-white/10 bg-liquid-deep p-1">
                <Image
                  src="/images/alan-lopez.png"
                  alt="Alan López - Productor Digital y Diseñador Web Freelance"
                  fill
                  sizes="(max-width: 768px) 256px, 320px"
                  className="rounded-full object-cover"
                  priority
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-medium text-platinum font-matter">
                  Alan López
                </h3>
                <p className="text-xs uppercase tracking-wider text-bioluminescent-lime font-mono">
                  Productor Digital & Diseñador Web
                </p>
              </div>
            </div>

            {/* Narrative Copy (from PDF Page 2) */}
            <div className="lg:col-span-8 space-y-6">
              <p className="text-base sm:text-lg text-platinum font-matter leading-relaxed">
                Soy <strong className="text-bioluminescent-lime font-medium">Alan López</strong>, Productor Digital. Mi enfoque es 100% práctico, autodidacta y orientado a resultados. Me apasiona integrarme a proyectos desafiantes donde pueda fusionar el marketing estratégico, el diseño y el prompt engineering para crear soluciones escalables impulsadas por Inteligencia Artificial.
              </p>

              <p className="text-sm sm:text-base text-silver-mist leading-relaxed font-matter">
                Combino la creatividad visual con el análisis de datos y la automatización para escalar negocios. Si buscas llevar tu proyecto al siguiente nivel con una visión digital integral, hagámoslo realidad.
              </p>

              <div className="pt-4 flex items-center gap-4">
                <button onClick={onOpenLeadModal} className="btn-aurora text-xs">
                  Agendar Consulta Estratégica
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Auros Statistic Counters Grid (Large numbers in Lavender Phosphor #fde9ff) */}
        <div>
          <div className="mb-8">
            <h3 className="text-xs uppercase tracking-[0.15em] text-silver-mist font-matter font-medium">
              HITOS COMERCIALES & RESULTADOS PROBADOS
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stat 1 */}
            <div className="surface-card p-8 flex flex-col justify-between">
              <div>
                <div className="text-4xl sm:text-5xl lg:text-6xl font-medium text-lavender-phosphor font-matter tracking-tight-display mb-3">
                  +$500M
                </div>
                <div className="text-xs uppercase tracking-wide text-liquid-mist font-matter font-medium">
                  Pesos de facturación generada en ventas
                </div>
              </div>
              <p className="mt-4 text-xs text-silver-mist border-t border-white/5 pt-4">
                Campañas y embudos de conversión optimizados para retorno de inversión (ROI).
              </p>
            </div>

            {/* Stat 2 */}
            <div className="surface-card p-8 flex flex-col justify-between">
              <div>
                <div className="text-4xl sm:text-5xl lg:text-6xl font-medium text-lavender-phosphor font-matter tracking-tight-display mb-3">
                  +70%
                </div>
                <div className="text-xs uppercase tracking-wide text-liquid-mist font-matter font-medium">
                  Tasa de conversión optimizada
                </div>
              </div>
              <p className="mt-4 text-xs text-silver-mist border-t border-white/5 pt-4">
                Auditoría y perfeccionamiento de cada micro-etapa del recorrido del usuario (UX).
              </p>
            </div>

            {/* Stat 3 */}
            <div className="surface-card p-8 flex flex-col justify-between">
              <div>
                <div className="text-4xl sm:text-5xl lg:text-6xl font-medium text-lavender-phosphor font-matter tracking-tight-display mb-3">
                  +5.000
                </div>
                <div className="text-xs uppercase tracking-wide text-liquid-mist font-matter font-medium">
                  Clientes gestionados eficientemente
                </div>
              </div>
              <p className="mt-4 text-xs text-silver-mist border-t border-white/5 pt-4">
                Flujos de trabajo escalables sin saturar equipos de soporte o ventas.
              </p>
            </div>

            {/* Stat 4 */}
            <div className="surface-card p-8 flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-3">
                <Cpu className="w-6 h-6 text-bioluminescent-lime" />
                <span className="text-xs font-mono uppercase text-silver-mist">Ecosistemas IA</span>
              </div>
              <div className="text-lg font-medium text-platinum font-matter mb-2">
                Automatización Tecnológica
              </div>
              <p className="text-xs text-silver-mist leading-relaxed">
                Implementación de arquitecturas automatizadas para optimizar tiempos, recursos y flujos de trabajo.
              </p>
            </div>

            {/* Stat 5 */}
            <div className="surface-card p-8 flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-3">
                <Search className="w-6 h-6 text-bioluminescent-lime" />
                <span className="text-xs font-mono uppercase text-silver-mist">SEO Técnico</span>
              </div>
              <div className="text-lg font-medium text-platinum font-matter mb-2">
                Posicionamiento Orgánico Líder
              </div>
              <p className="text-xs text-silver-mist leading-relaxed">
                Ubicando la marca en el top absoluto de los motores de búsqueda mediante arquitectura técnica limpia.
              </p>
            </div>

            {/* Stat 6 */}
            <div className="surface-card p-8 flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-3">
                <PlayCircle className="w-6 h-6 text-bioluminescent-lime" />
                <span className="text-xs font-mono uppercase text-silver-mist">Audiovisual</span>
              </div>
              <div className="text-lg font-medium text-platinum font-matter mb-2">
                Miles de Reproducciones
              </div>
              <p className="text-xs text-silver-mist leading-relaxed">
                Diseño y producción de contenido audiovisual de alto impacto visual y narrativa persuasiva.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
