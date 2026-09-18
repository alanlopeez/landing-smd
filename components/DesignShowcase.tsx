"use client";

import React, { useState } from "react";
import { ExternalLink, Sparkles, Layers, ArrowUpRight } from "lucide-react";

interface DesignShowcaseProps {
  onOpenLeadModal: () => void;
}

export default function DesignShowcase({ onOpenLeadModal }: DesignShowcaseProps) {
  const [activeTab, setActiveTab] = useState<"produced" | "refero">("produced");

  // Real projects produced by Alan López (from PDF page 2)
  const producedProjects = [
    {
      title: "Cérum AquaGlow",
      url: "https://landing-cerum-aquaglow.vercel.app/",
      category: "E-Commerce & Alta Conversión",
      desc: "Landing page de venta directa para cosmética premium con optimización de checkout y embudo persuasivo.",
      metrics: "+78% Conversión",
    },
    {
      title: "DramaFlow MVP",
      url: "https://dramaflow-mvp-web-anfp.vercel.app/",
      category: "Plataforma SaaS & MVP",
      desc: "Arquitectura escalable para visualización de guiones y gestión de producción con autenticación rápida.",
      metrics: "Carga < 0.6s",
    },
    {
      title: "Aion Neural",
      url: "https://aion-neural.vercel.app/",
      category: "IA & Deep Tech",
      desc: "Interfaz cinematográfica oscura con animaciones de partículas y presentación de modelos de lenguaje.",
      metrics: "100/100 SEO",
    },
    {
      title: "CalFlow Reserva",
      url: "https://calflow-reserva.vercel.app/",
      category: "Automatización & Agendamiento",
      desc: "Sistema interactivo de reservas y calificación de turnos con sincronización de calendario y pagos.",
      metrics: "0 Fricción",
    },
    {
      title: "Blog Relatos Alan López",
      url: "https://blog-relatos-alan-lopez.vercel.app/",
      category: "Editorial & Posicionamiento",
      desc: "Ecosistema de contenidos optimizado para posicionamiento orgánico en motores de búsqueda (SEO) y branding.",
      metrics: "Top Google",
    },
    {
      title: "App Fundar",
      url: "https://app-fundar.vercel.app/",
      category: "Aplicación Web Empresarial",
      desc: "Panel corporativo de gestión con formularios dinámicos y base de datos en tiempo real.",
      metrics: "Fullstack",
    },
  ];

  // 10 Curated Design Models from styles.refero.design (from PDF page 2)
  const referoModels = [
    {
      id: 1,
      title: "Abyssal Terminal",
      style: "Fintech Dark Mode",
      referoUrl: "https://styles.refero.design",
      accent: "#003734",
      desc: "Paleta abisal en tonos petróleo con micro-interacciones bioluminiscentes y sin sombras.",
    },
    {
      id: 2,
      title: "Cinematic Biotech",
      style: "Laboratorio Oscuro",
      referoUrl: "https://styles.refero.design",
      accent: "#222f30",
      desc: "Video orgánico de fondo, tipografía de display masiva y acentos lime de alta precisión.",
    },
    {
      id: 3,
      title: "Minimalist Grid",
      style: "Neo-Brutalismo Pulido",
      referoUrl: "https://styles.refero.design",
      accent: "#0d2b29",
      desc: "Retícula estructurada con líneas milimétricas y tipografía monoespaciada para desarrolladores.",
    },
    {
      id: 4,
      title: "Aurora Glow SaaS",
      style: "Gradiente Dinámico",
      referoUrl: "https://styles.refero.design",
      accent: "#103c39",
      desc: "Transiciones de cyan a lavanda con botones en píldora y tipografía sans geométrica.",
    },
    {
      id: 5,
      title: "Cyber Kinetic 3D",
      style: "Modelado Tridimensional",
      referoUrl: "https://styles.refero.design",
      accent: "#06312e",
      desc: "Objetos 3D interactivos y esferas de partículas reactivas al scroll del usuario.",
    },
    {
      id: 6,
      title: "Luxury Monochrome",
      style: "Editorial de Alto Valor",
      referoUrl: "https://styles.refero.design",
      accent: "#142827",
      desc: "Contraste riguroso entre platino y negro con espaciado generoso de respiración.",
    },
    {
      id: 7,
      title: "Glassmorphism Pro",
      style: "Superficies Traslúcidas",
      referoUrl: "https://styles.refero.design",
      accent: "#0a3835",
      desc: "Desenfocado de fondo (backdrop-blur) con bordes de luz difusa y profundidad de agua.",
    },
    {
      id: 8,
      title: "Bento Grid Dashboard",
      style: "Módulos Asimétricos",
      referoUrl: "https://styles.refero.design",
      accent: "#022e2c",
      desc: "Cajas informativas modulares que jerarquizan métricas, gráficos y llamadas a la acción.",
    },
    {
      id: 9,
      title: "Dynamic Dark E-Commerce",
      style: "Conversión Inmersiva",
      referoUrl: "https://styles.refero.design",
      accent: "#123e3b",
      desc: "Exhibición de producto a gran escala con micro-animaciones en tarjetas de compra rápida.",
    },
    {
      id: 10,
      title: "Executive Instrument",
      style: "Consola de Datos",
      referoUrl: "https://styles.refero.design",
      accent: "#082927",
      desc: "Diseño para fundadores con números gigantes en lavender phosphor y etiquetas técnicas.",
    },
  ];

  return (
    <section
      id="proyectos"
      className="relative w-full bg-liquid-abyss py-24 sm:py-32 px-6 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <p className="text-xs uppercase tracking-[0.12em] text-silver-mist font-matter font-medium">
              PORTFOLIO & INSPIRACIÓN GLOBAL
            </p>
            <h2 className="text-3xl sm:text-5xl font-medium text-platinum font-matter tracking-tight">
              Diseño de página web con estándares internacionales.
            </h2>
            <p className="text-sm sm:text-base text-silver-mist leading-relaxed font-matter">
              Explora las aplicaciones web desarrolladas y desplegadas en producción, además de la curaduría de modelos visuales basados en <strong className="text-platinum font-normal">styles.refero.design</strong>.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="inline-flex p-1.5 rounded-full bg-liquid-kelp border border-white/10 self-start md:self-auto">
            <button
              onClick={() => setActiveTab("produced")}
              className={`px-5 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "produced"
                  ? "bg-liquid-abyss text-platinum shadow-none border border-white/10"
                  : "text-silver-mist hover:text-white"
              }`}
            >
              Proyectos Producidos ({producedProjects.length})
            </button>
            <button
              onClick={() => setActiveTab("refero")}
              className={`px-5 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "refero"
                  ? "bg-liquid-abyss text-platinum shadow-none border border-white/10"
                  : "text-silver-mist hover:text-white"
              }`}
            >
              10 Modelos Refero ({referoModels.length})
            </button>
          </div>
        </div>

        {/* TAB 1: PROYECTOS PRODUCIDOS */}
        {activeTab === "produced" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {producedProjects.map((proj, idx) => (
              <div
                key={idx}
                className="surface-card p-6 sm:p-8 flex flex-col justify-between group transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-bioluminescent-lime px-2.5 py-1 rounded bg-liquid-abyss border border-bioluminescent-lime/20">
                      {proj.category}
                    </span>
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-[6px] bg-[rgba(3,81,75,0.5)] group-hover:bg-bioluminescent-lime group-hover:text-liquid-abyss flex items-center justify-center text-platinum transition-colors"
                      aria-label={`Ver proyecto en vivo ${proj.title}`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>

                  <h3 className="text-xl font-medium text-platinum font-matter pt-2">
                    {proj.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-silver-mist leading-relaxed font-matter">
                    {proj.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-silver-mist/70 font-mono">Vercel Deploy</span>
                  <span className="font-semibold text-lavender-phosphor">{proj.metrics}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: 10 MODELOS DE EJEMPLO DE REFERO */}
        {activeTab === "refero" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="p-4 rounded-xl bg-liquid-deep border border-white/5 text-xs text-silver-mist flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-bioluminescent-lime" />
                <span>
                  Curaduría extraída de <strong>styles.refero.design</strong> para adaptar a tu marca y necesidades de conversión.
                </span>
              </div>
              <a
                href="https://styles.refero.design"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bioluminescent-lime hover:underline inline-flex items-center gap-1 font-semibold"
              >
                Visitar refero.design <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {referoModels.map((model) => (
                <div
                  key={model.id}
                  className="surface-card p-5 flex flex-col justify-between group hover:border-bioluminescent-lime/40 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-silver-mist uppercase">
                        #{String(model.id).padStart(2, "0")}
                      </span>
                      <a
                        href={model.referoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-silver-mist/70 hover:text-white"
                        aria-label={`Ver referencia ${model.title}`}
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <h4 className="text-base font-medium text-platinum font-matter">
                      {model.title}
                    </h4>
                    <span className="inline-block text-[11px] text-bioluminescent-lime font-mono">
                      {model.style}
                    </span>
                    <p className="text-xs text-silver-mist leading-relaxed">
                      {model.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/5">
                    <button
                      onClick={onOpenLeadModal}
                      className="w-full text-center text-[11px] uppercase tracking-wider font-semibold py-1.5 rounded bg-liquid-abyss text-liquid-mist hover:text-white hover:bg-white/5 transition-colors"
                    >
                      Quiero este estilo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
