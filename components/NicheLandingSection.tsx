"use client";

import React, { useState, useMemo } from "react";
import {
  Stethoscope,
  Scale,
  Calculator,
  Building2,
  Compass,
  HeartHandshake,
  Dumbbell,
  PawPrint,
  Smile,
  Briefcase,
  Sparkles,
  Camera,
  Wrench,
  Sparkle,
  Search,
  ExternalLink,
  Target,
  Eye,
  Lightbulb,
  Route,
  CheckCircle2,
  Zap,
  ArrowRight,
} from "lucide-react";

interface NicheItem {
  id: string;
  name: string;
  category: "salud" | "legal-finanzas" | "inmobiliaria-arquitectura" | "negocios-servicios" | "creativos-fitness";
  categoryLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  whatsappMessage: string;
}

const WHATSAPP_PHONE = "5491127887093";

const NICHES: NicheItem[] = [
  {
    id: "salud",
    name: "Profesionales de salud",
    category: "salud",
    categoryLabel: "Salud & Bienestar",
    icon: Stethoscope,
    tagline: "Médicos, especialistas y centros de atención",
    whatsappMessage: "Hola, soy profesional de la salud y quiero cotizar una página web.",
  },
  {
    id: "abogados",
    name: "Abogados",
    category: "legal-finanzas",
    categoryLabel: "Legal & Finanzas",
    icon: Scale,
    tagline: "Estudios jurídicos, letrados y bufetes",
    whatsappMessage: "Hola, tengo un estudio jurídico y quiero cotizar una página web.",
  },
  {
    id: "contables",
    name: "Estudios contables",
    category: "legal-finanzas",
    categoryLabel: "Legal & Finanzas",
    icon: Calculator,
    tagline: "Contadores, auditorías y asesorías tributarias",
    whatsappMessage: "Hola, tengo un estudio contable y quiero cotizar una página web.",
  },
  {
    id: "inmobiliarias",
    name: "Inmobiliarias",
    category: "inmobiliaria-arquitectura",
    categoryLabel: "Inmobiliaria & Diseño",
    icon: Building2,
    tagline: "Bienes raíces, tasaciones y propiedades",
    whatsappMessage: "Hola, tengo una inmobiliaria y quiero cotizar una página web.",
  },
  {
    id: "arquitectos",
    name: "Arquitectos",
    category: "inmobiliaria-arquitectura",
    categoryLabel: "Inmobiliaria & Diseño",
    icon: Compass,
    tagline: "Estudios de arquitectura y desarrollos urbanos",
    whatsappMessage: "Hola, tengo un estudio de arquitectura y quiero cotizar una página web.",
  },
  {
    id: "psicologos",
    name: "Psicólogos y Terapeutas",
    category: "salud",
    categoryLabel: "Salud & Bienestar",
    icon: HeartHandshake,
    tagline: "Terapia clínica, coaching y salud mental",
    whatsappMessage: "Hola, ofrezco servicios de terapia y quiero cotizar una página web.",
  },
  {
    id: "entrenadores",
    name: "Entrenadores Personales",
    category: "creativos-fitness",
    categoryLabel: "Creativos & Fitness",
    icon: Dumbbell,
    tagline: "Personal trainers, coaches fitness y rutinas",
    whatsappMessage: "Hola, soy personal trainer y quiero cotizar una página web.",
  },
  {
    id: "veterinarias",
    name: "Veterinarias",
    category: "salud",
    categoryLabel: "Salud & Bienestar",
    icon: PawPrint,
    tagline: "Clínicas veterinarias y cuidado de mascotas",
    whatsappMessage: "Hola, tengo una clínica veterinaria y quiero cotizar una página web.",
  },
  {
    id: "odontologos",
    name: "Odontólogos",
    category: "salud",
    categoryLabel: "Salud & Bienestar",
    icon: Smile,
    tagline: "Consultorios dentales y estética bucal",
    whatsappMessage: "Hola, tengo un consultorio odontológico y quiero cotizar una página web.",
  },
  {
    id: "consultores",
    name: "Consultores de Negocios",
    category: "negocios-servicios",
    categoryLabel: "Negocios & Asesoría",
    icon: Briefcase,
    tagline: "Estrategas de negocios y consultoría B2B",
    whatsappMessage: "Hola, soy consultor independiente y quiero cotizar una página web.",
  },
  {
    id: "esteticas",
    name: "Estéticas y Centros de Belleza",
    category: "salud",
    categoryLabel: "Salud & Belleza",
    icon: Sparkles,
    tagline: "Spas, cosmiatría y estética corporal",
    whatsappMessage: "Hola, tengo un centro de estética y quiero cotizar una página web.",
  },
  {
    id: "fotografos",
    name: "Fotógrafos y Videógrafos",
    category: "creativos-fitness",
    categoryLabel: "Creativos & Audiovisual",
    icon: Camera,
    tagline: "Producción audiovisual, eventos y marcas",
    whatsappMessage: "Hola, ofrezco servicios audiovisuales y quiero cotizar una página web.",
  },
  {
    id: "mecanicos",
    name: "Mecánicos y Talleres Automotrices",
    category: "negocios-servicios",
    categoryLabel: "Servicios Técnicos",
    icon: Wrench,
    tagline: "Talleres mecánicos, service y diagnóstico",
    whatsappMessage: "Hola, tengo un taller mecánico y quiero cotizar una página web.",
  },
  {
    id: "limpieza",
    name: "Empresas de Limpieza",
    category: "negocios-servicios",
    categoryLabel: "Servicios Generales",
    icon: Sparkle,
    tagline: "Limpieza corporativa, residencial e industrial",
    whatsappMessage: "Hola, tengo una empresa de limpieza y quiero cotizar una página web.",
  },
];

const CATEGORIES = [
  { id: "all", label: "Todos los Nichos (14)" },
  { id: "salud", label: "Salud & Bienestar" },
  { id: "legal-finanzas", label: "Legal & Finanzas" },
  { id: "inmobiliaria-arquitectura", label: "Inmobiliaria & Diseño" },
  { id: "negocios-servicios", label: "Negocios & Servicios" },
  { id: "creativos-fitness", label: "Creativos & Fitness" },
];

export default function NicheLandingSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredNiches = useMemo(() => {
    return NICHES.filter((niche) => {
      const matchesCategory =
        selectedCategory === "all" || niche.category === selectedCategory;
      const matchesSearch =
        niche.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        niche.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        niche.whatsappMessage.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const getWhatsAppLink = (message: string) => {
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section
      id="nichos"
      aria-labelledby="nichos-heading"
      className="relative w-full bg-liquid-abyss py-24 sm:py-32 px-6 border-t border-white/5 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 -left-40 w-[600px] h-[600px] bg-bioluminescent-lime/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 -right-40 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        {/* Section Top Header & Pitch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-[0.12em] text-silver-mist">
              <span className="w-2 h-2 rounded-full bg-bioluminescent-lime animate-pulse" />
              Especialización por Nicho · Decisiones Rápidas
            </div>

            <h2
              id="nichos-heading"
              className="text-3xl sm:text-5xl lg:text-6xl font-medium text-platinum font-matter tracking-tight leading-[1.08]"
            >
              Creo una página web de una sola página con diseño especializado para{" "}
              <span className="bg-gradient-to-r from-bioluminescent-lime via-platinum to-teal-200 bg-clip-text text-transparent">
                decisiones rápidas.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-silver-mist font-matter leading-relaxed max-w-2xl">
              Diseñada estratégicamente para ofrecer tu servicio más vendido y agregar un canal directo para comunicarse contigo al instante, eliminando distracciones y puntos de fuga.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-mono text-liquid-mist/90 bg-liquid-deep/80 px-3.5 py-2 rounded-lg border border-white/10">
                <Zap className="w-3.5 h-3.5 text-bioluminescent-lime" />
                <span>Tiempo de Carga &lt; 0.8s</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-liquid-mist/90 bg-liquid-deep/80 px-3.5 py-2 rounded-lg border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-bioluminescent-lime" />
                <span>100% Mobile First & WhatsApp Direct</span>
              </div>
            </div>
          </div>

          {/* Embedded Showcase Video: Robot creando una landing */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-liquid-deep/90 shadow-2xl p-2 group hover:border-bioluminescent-lime/40 transition-colors duration-300">
              {/* Header bar of the video player card */}
              <div className="flex items-center justify-between px-3 py-2 bg-liquid-abyss/80 rounded-t-xl border-b border-white/10 text-[11px] font-mono text-silver-mist">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 inline-block" />
                  <span className="ml-2 text-platinum font-medium">landing-ia-engine.mp4</span>
                </div>
                <div className="flex items-center gap-1.5 text-bioluminescent-lime">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bioluminescent-lime opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-bioluminescent-lime" />
                  </span>
                  <span>EN VIVO</span>
                </div>
              </div>

              {/* Video Element */}
              <div className="relative aspect-video w-full overflow-hidden rounded-b-xl bg-black">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover filter brightness-[0.95] contrast-[1.05]"
                  aria-label="Video del Robot de Inteligencia Artificial creando una página web de una sola página"
                >
                  <source src="/videos/robot-creando-landing.mp4" type="video/mp4" />
                  Tu navegador no soporta la reproducción de video HTML5.
                </video>

                {/* Subtle overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-liquid-deep/70 via-transparent to-transparent pointer-events-none" />

                {/* Micro caption over video */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="text-[11px] font-mono bg-liquid-abyss/90 backdrop-blur-md px-2.5 py-1 rounded border border-white/15 text-platinum">
                    IA Multi-Agente en Acción
                  </span>
                  <span className="text-[11px] font-mono text-bioluminescent-lime bg-liquid-abyss/90 backdrop-blur-md px-2.5 py-1 rounded border border-white/15">
                    1 Solo Camino · Cero Fugas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The 4 Conversion Pillars */}
        <div className="space-y-6">
          <div className="text-center sm:text-left">
            <p className="text-xs uppercase font-mono tracking-widest text-bioluminescent-lime">
              ARQUITECTURA DE PERSUASIÓN & CIERRE
            </p>
            <h3 className="text-2xl sm:text-3xl font-medium text-platinum font-matter tracking-tight mt-1">
              Los 4 pilares fundamentales de tu página web de una sola página
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Pilar 1 */}
            <div className="surface-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-bioluminescent-lime/40 transition-all duration-300">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-liquid-deep border border-white/10 flex items-center justify-center text-bioluminescent-lime">
                  <Target className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono text-bioluminescent-lime uppercase tracking-wider font-semibold">
                  01 · Focalización
                </div>
                <h4 className="text-lg font-medium text-platinum font-matter">
                  Estaciona a la audiencia correcta
                </h4>
                <p className="text-xs sm:text-sm text-silver-mist font-matter leading-relaxed">
                  El texto le habla a una sola persona con un dolor muy específico. Tu cliente ideal siente que la página fue redactada exactamente para su situación.
                </p>
              </div>
            </div>

            {/* Pilar 2 */}
            <div className="surface-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-bioluminescent-lime/40 transition-all duration-300">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-liquid-deep border border-white/10 flex items-center justify-center text-cyan-300">
                  <Eye className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono text-cyan-300 uppercase tracking-wider font-semibold">
                  02 · Retención
                </div>
                <h4 className="text-lg font-medium text-platinum font-matter">
                  Impacta visualmente
                </h4>
                <p className="text-xs sm:text-sm text-silver-mist font-matter leading-relaxed">
                  Un diseño inmersivo, pulido y profesional que retiene la atención de inmediato desde el primer segundo sin saturar con elementos innecesarios.
                </p>
              </div>
            </div>

            {/* Pilar 3 */}
            <div className="surface-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-bioluminescent-lime/40 transition-all duration-300">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-liquid-deep border border-white/10 flex items-center justify-center text-amber-300">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono text-amber-300 uppercase tracking-wider font-semibold">
                  03 · Claridad
                </div>
                <h4 className="text-lg font-medium text-platinum font-matter">
                  Presenta una solución
                </h4>
                <p className="text-xs sm:text-sm text-silver-mist font-matter leading-relaxed">
                  Tu servicio como la única salida lógica. Desarrollamos la propuesta de valor para resolver su problema de raíz con total transparencia y contundencia.
                </p>
              </div>
            </div>

            {/* Pilar 4 */}
            <div className="surface-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-bioluminescent-lime/40 transition-all duration-300">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-liquid-deep border border-white/10 flex items-center justify-center text-emerald-400">
                  <Route className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                  04 · Conversión
                </div>
                <h4 className="text-lg font-medium text-platinum font-matter">
                  Un solo camino
                </h4>
                <p className="text-xs sm:text-sm text-silver-mist font-matter leading-relaxed">
                  No hay enlaces secundarios que distraigan. El único llamado a la acción es comunicarse contigo directamente por WhatsApp para cerrar el trato.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Niche Selector & CTAs Section */}
        <div className="space-y-8 pt-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-bioluminescent-lime mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-bioluminescent-lime" />
                Elegí tu perfil y escribinos por WhatsApp
              </div>
              <h3 className="text-2xl sm:text-4xl font-medium text-platinum font-matter tracking-tight">
                ¿En qué rubro está tu negocio?
              </h3>
              <p className="text-sm text-silver-mist font-matter mt-1">
                Tocá tu perfil para iniciar una conversación en WhatsApp con el mensaje pre-diseñado para tu nicho.
              </p>
            </div>

            {/* Search input for instant filtration */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-mist/60" />
              <input
                type="text"
                placeholder="Buscar tu rubro..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-liquid-deep/90 border border-white/10 text-xs text-platinum placeholder:text-silver-mist/50 focus:outline-none focus:border-bioluminescent-lime transition-colors"
                aria-label="Filtrar nicho o profesión"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-matter whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-bioluminescent-lime text-liquid-abyss font-semibold shadow-md shadow-bioluminescent-lime/20"
                      : "bg-liquid-deep/70 text-silver-mist hover:text-platinum hover:bg-white/10 border border-white/5"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Niches Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNiches.map((niche) => {
              const IconComp = niche.icon;
              const waUrl = getWhatsAppLink(niche.whatsappMessage);

              return (
                <div
                  key={niche.id}
                  className="surface-card p-6 rounded-2xl flex flex-col justify-between group hover:border-bioluminescent-lime/40 transition-all duration-300 relative bg-liquid-deep/60"
                >
                  <div className="space-y-4">
                    {/* Top Row: Icon & Category Tag */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-10 h-10 rounded-xl bg-liquid-abyss border border-white/10 flex items-center justify-center text-bioluminescent-lime group-hover:scale-105 group-hover:border-bioluminescent-lime/50 transition-all">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-silver-mist/70 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                        {niche.categoryLabel}
                      </span>
                    </div>

                    {/* Niche Title & Tagline */}
                    <div>
                      <h4 className="text-lg font-medium text-platinum font-matter tracking-tight group-hover:text-bioluminescent-lime transition-colors">
                        {niche.name}
                      </h4>
                      <p className="text-xs text-silver-mist font-matter mt-0.5">
                        {niche.tagline}
                      </p>
                    </div>

                    {/* Pre-designed message quote preview */}
                    <div className="p-3 rounded-xl bg-liquid-abyss/80 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-silver-mist/60 block">
                        Mensaje predeterminado de WhatsApp:
                      </span>
                      <p className="text-xs text-liquid-mist/90 italic font-matter leading-relaxed">
                        “{niche.whatsappMessage}”
                      </p>
                    </div>
                  </div>

                  {/* Qualification CTA Button (Reemplaza WhatsApp directo) */}
                  <div className="pt-5 mt-4 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          window.dispatchEvent(
                            new CustomEvent("open-qualification-modal", {
                              detail: { businessType: niche.name },
                            })
                          );
                        }
                      }}
                      aria-label={`Calificar proyecto para ${niche.name}`}
                      className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-lg bg-bioluminescent-lime/10 hover:bg-bioluminescent-lime text-bioluminescent-lime hover:text-liquid-abyss border border-bioluminescent-lime/30 hover:border-bioluminescent-lime text-xs font-matter font-semibold tracking-wide transition-all duration-200 group/btn cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Calificar Proyecto para {niche.name}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredNiches.length === 0 && (
            <div className="p-8 text-center rounded-2xl bg-liquid-deep/60 border border-white/5 space-y-3">
              <p className="text-sm text-silver-mist">
                No encontramos ningún nicho con el término “{searchQuery}”.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="text-xs text-bioluminescent-lime hover:underline font-mono uppercase"
              >
                Ver todos los nichos
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
