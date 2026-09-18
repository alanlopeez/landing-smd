"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles, ShieldCheck, Clock, Layers, DollarSign, Search } from "lucide-react";

interface FaqSectionProps {
  onOpenLeadModal: () => void;
}

export interface FaqItem {
  id: string;
  category: "entrega" | "ia" | "pagos" | "garantias" | "inversion";
  categoryLabel: string;
  question: string;
  answer: string;
  highlight?: string;
}

export const faqData: FaqItem[] = [
  {
    id: "faq-entrega",
    category: "entrega",
    categoryLabel: "Tiempos y Entrega",
    question: "¿Cuánto tiempo tarda el desarrollo y entrega de mi página web?",
    answer:
      "Gracias a nuestra metodología orientada a resultados, podemos estructurar y crear la primera versión de tu sitio web en 24 horas. A partir de ese momento, iniciamos una etapa de revisión donde tienes el derecho de solicitar todas las modificaciones y optimizaciones que precises hasta que el proyecto se adapte exactamente a tus expectativas.",
    highlight: "Primera versión funcional lista en 24 horas con revisiones ilimitadas.",
  },
  {
    id: "faq-multiagentes",
    category: "ia",
    categoryLabel: "Inteligencia Artificial",
    question: "¿Qué significa integrar \"sistemas multi-agentes\" en mi sitio web?",
    answer:
      "Implementar sistemas multi-agentes impulsados por Inteligencia Artificial permite integrar un ecosistema tecnológico automatizado directamente en tu página. Esto incluye embudos de ventas con formularios lógicos que filtran información en tiempo real, como el nivel de urgencia o el tipo de presupuesto del cliente. Esto te permite ahorrar recursos en tareas repetitivas y cerrar ventas mucho más rápido al cotizar al instante.",
    highlight: "Automatización con formularios lógicos en tiempo real y cotizaciones automáticas.",
  },
  {
    id: "faq-pagos",
    category: "pagos",
    categoryLabel: "Pagos y Aprobación",
    question: "¿Cuándo debo realizar el pago por el servicio de diseño web?",
    answer:
      "Nuestro modelo de trabajo asegura tu entera conformidad antes de facturar. Una vez confirmada la primera fase del servicio, iniciamos el diseño y desarrollo estructural. Solo procederemos a la instancia de pago luego de que el diseño cumpla con todas tus expectativas y nos confirmes tu aprobación de manera explícita por correo electrónico. Al acreditarse el pago, el sitio será publicado oficialmente en su dominio.",
    highlight: "Conformidad garantizada: pagas únicamente tras aprobar el diseño final por escrito.",
  },
  {
    id: "faq-soporte",
    category: "entrega",
    categoryLabel: "Soporte y Evolución",
    question: "¿Ofrecen soporte o mantenimiento una vez que la página está publicada?",
    answer:
      "Sí, nuestro servicio no termina con la publicación de la plataforma. Como usuario, mantendrás un acceso libre y directo para solicitar nuevas modificaciones, optimizaciones o cambios futuros que tu sitio web requiera para continuar evolucionando y creciendo en el entorno digital.",
    highlight: "Canal directo y permanente para mejoras, actualizaciones y escalabilidad técnica.",
  },
  {
    id: "faq-lider",
    category: "ia",
    categoryLabel: "Estrategia y Dirección",
    question: "¿Quién está a cargo del diseño, estrategia y posicionamiento de mi sitio?",
    answer:
      "Cada proyecto es liderado por Alan López, Productor Digital especializado en marketing estratégico, diseño y prompt engineering. La producción se enfoca en crear soluciones escalables que han optimizado recursos, generado ecosistemas de alta tasa de conversión y logrado un posicionamiento orgánico líder en motores de búsqueda.",
    highlight: "Dirección integral por Alan López: diseño, estrategia de conversión y SEO de élite.",
  },
  {
    id: "faq-inversion",
    category: "inversion",
    categoryLabel: "Inversión y Presupuesto",
    question: "¿Qué rango de inversión se requiere para desarrollar una solución web?",
    answer:
      "Adaptamos nuestra propuesta técnica a la escala exacta de tu negocio y a tus tiempos operativos. Gestionamos proyectos de distintos niveles de complejidad, abarcando inversiones para negocios emergentes (menos de u$d 1500), escalas intermedias (entre u$d 1500 y u$d 3000), y ecosistemas corporativos avanzados (más de u$d 5000).",
    highlight: "Escalas transparentes: emergente (< u$d 1500), intermedia (u$d 1500 - 3000) y corporativa (> u$d 5000).",
  },
  {
    id: "faq-garantias",
    category: "garantias",
    categoryLabel: "Garantías y Seguridad",
    question: "¿Qué garantías de seguridad y fidelidad de diseño ofrecen?",
    answer:
      "Garantizamos la máxima fidelidad: tienes el pleno derecho a solicitar una devolución si el sitio final entregado y publicado presenta distorsiones frente a la versión que aprobaste previamente. A nivel técnico, tu sitio cuenta con protocolos prioritarios de ciberseguridad; ante cualquier vulneración o ataque externo emergente, priorizaremos la investigación y la restitución inmediata de un nuevo sitio con las amenazas neutralizadas para garantizarte un entorno seguro para operar. Además, toda la información personal proporcionada se resguarda bajo estrictos estándares de confidencialidad.",
    highlight: "Garantía total de fidelidad, restitución prioritaria ante amenazas y confidencialidad estricta.",
  },
];

const categoryFilters = [
  { id: "all", label: "Todas las preguntas", icon: HelpCircle },
  { id: "entrega", label: "Tiempos & Entrega", icon: Clock },
  { id: "ia", label: "IA & Multi-Agentes", icon: Sparkles },
  { id: "inversion", label: "Inversión", icon: DollarSign },
  { id: "pagos", label: "Pagos & Conformidad", icon: Layers },
  { id: "garantias", label: "Seguridad & Garantías", icon: ShieldCheck },
];

export default function FaqSection({ onOpenLeadModal }: FaqSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "faq-entrega": true, // Default first item open for instant value
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs = faqData.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section
      id="faq"
      className="relative w-full bg-liquid-deep py-24 sm:py-32 px-6 border-t border-white/5"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      {/* Glow orb */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-bioluminescent-lime/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-[0.12em] text-silver-mist">
            <span className="w-2 h-2 rounded-full bg-bioluminescent-lime" />
            Transparencia & Resolución de Dudas
          </div>
          <h2 className="text-3xl sm:text-5xl font-medium text-platinum font-matter tracking-tight">
            Preguntas Frecuentes (FAQ)
          </h2>
          <p className="text-sm sm:text-base text-silver-mist font-matter leading-relaxed">
            Todo lo que necesitas saber sobre los tiempos de entrega, la tecnología multi-agentes con IA, los esquemas de pago y nuestras garantías de satisfacción técnica.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="space-y-4">
          {/* Real-time search bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="w-4 h-4 text-silver-mist/60 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por palabra clave (ej. 24 horas, pago, garantías, u$d)..."
              className="w-full bg-liquid-abyss/80 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-platinum placeholder-silver-mist/40 focus:outline-none focus:border-bioluminescent-lime/60 transition-colors font-matter"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-silver-mist hover:text-platinum"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categoryFilters.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-matter transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-bioluminescent-lime text-liquid-abyss font-semibold shadow-md shadow-bioluminescent-lime/20"
                      : "bg-liquid-abyss/80 text-silver-mist hover:text-platinum border border-white/10 hover:border-white/20"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-liquid-abyss" : "text-bioluminescent-lime"}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-4 pt-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 surface-card p-8">
              <p className="text-silver-mist text-sm">
                No encontramos preguntas que coincidan con &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-4 text-xs text-bioluminescent-lime hover:underline font-mono"
              >
                Ver todas las preguntas frecuentes
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = !!openItems[faq.id];
              return (
                <article
                  key={faq.id}
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                  className="surface-card overflow-hidden transition-colors duration-200 border border-white/10 hover:border-white/20"
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                    className="w-full p-6 sm:p-7 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none focus:ring-1 focus:ring-bioluminescent-lime rounded-xl"
                  >
                    <div className="space-y-1.5 flex-1 pr-2">
                      <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-bioluminescent-lime font-semibold">
                        {faq.categoryLabel}
                      </span>
                      <h3
                        itemProp="name"
                        className="text-base sm:text-lg font-medium text-platinum font-matter leading-snug"
                      >
                        {faq.question}
                      </h3>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-platinum flex-shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? "rotate-180 bg-bioluminescent-lime text-liquid-abyss border-bioluminescent-lime"
                          : "bg-liquid-abyss"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Collapsible Answer Body */}
                  {isOpen && (
                    <div
                      id={`faq-answer-${faq.id}`}
                      itemScope
                      itemProp="acceptedAnswer"
                      itemType="https://schema.org/Answer"
                      className="px-6 sm:px-7 pb-7 pt-1 text-sm text-silver-mist leading-relaxed font-matter border-t border-white/5 space-y-3"
                    >
                      {faq.highlight && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-bioluminescent-lime/10 border border-bioluminescent-lime/20 text-xs text-bioluminescent-lime font-medium">
                          <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{faq.highlight}</span>
                        </div>
                      )}
                      <p itemProp="text" className="text-silver-mist leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>

        {/* Footer Question Assistance Banner */}
        <div className="surface-card p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-dashed border-white/15">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-medium text-platinum">
              ¿Tienes una pregunta específica sobre tu proyecto?
            </h4>
            <p className="text-xs text-silver-mist">
              Habla directamente con Alan López y obtén asesoramiento técnico personalizado para tu sitio web.
            </p>
          </div>
          <button
            onClick={onOpenLeadModal}
            className="btn-aurora text-xs uppercase tracking-wider whitespace-nowrap flex-shrink-0"
          >
            Hacer Una Consulta Directa
          </button>
        </div>
      </div>
    </section>
  );
}
