"use client";

import React from "react";
import { ExternalLink, ArrowUpRight, Sparkles, Layers, Globe } from "lucide-react";

interface PortfolioSectionProps {
  onOpenLeadModal: () => void;
}

interface ProjectItem {
  id: number;
  title: string;
  tagline: string;
  category: string;
  url: string;
  displayUrl: string;
  badge: string;
}

const projects: ProjectItem[] = [
  {
    id: 1,
    title: "Cérum AquaGlow",
    tagline: "Landing page de alta gama para lanzamiento de producto cosmético y captación de clientes.",
    category: "Lanzamiento de Producto & E-Commerce",
    url: "https://landing-cerum-aquaglow.vercel.app/",
    displayUrl: "landing-cerum-aquaglow.vercel.app",
    badge: "E-Commerce",
  },
  {
    id: 2,
    title: "DramaFlow MVP",
    tagline: "Plataforma web con renderizado dinámico, onboarding optimizado y experiencia de usuario fluida.",
    category: "Plataforma Web SaaS & Media",
    url: "https://dramaflow-mvp-web-anfp.vercel.app/",
    displayUrl: "dramaflow-mvp-web-anfp.vercel.app",
    badge: "SaaS & Media",
  },
  {
    id: 3,
    title: "Aion Neural",
    tagline: "Arquitectura interactiva en modo oscuro abisal para consultoría de inteligencia artificial y tecnología.",
    category: "Deep Tech & Inteligencia Artificial",
    url: "https://aion-neural.vercel.app/",
    displayUrl: "aion-neural.vercel.app",
    badge: "Deep Tech",
  },
  {
    id: 4,
    title: "CalFlow Reserva",
    tagline: "Sistema conversacional y triaje web conectado para automatizar reservas y captar prospectos 24/7.",
    category: "Automatización & Servicios Médicos",
    url: "https://calflow-reserva.vercel.app/",
    displayUrl: "calflow-reserva.vercel.app",
    badge: "Conversacional",
  },
  {
    id: 5,
    title: "Blog Relatos Alan López",
    tagline: "Portal editorial de alto rendimiento con optimización SEO extrema y velocidad de carga instantánea.",
    category: "Editorial & Posicionamiento SEO",
    url: "https://blog-relatos-alan-lopez.vercel.app/",
    displayUrl: "blog-relatos-alan-lopez.vercel.app",
    badge: "Editorial & SEO",
  },
  {
    id: 6,
    title: "App Fundar",
    tagline: "Embudo corporativo y sistema de calificación de prospectos para acelerar cierres comerciales.",
    category: "Servicios Corporativos & B2B",
    url: "https://app-fundar.vercel.app/",
    displayUrl: "app-fundar.vercel.app",
    badge: "Corporativo B2B",
  },
];

export default function PortfolioSection({ onOpenLeadModal }: PortfolioSectionProps) {
  return (
    <section
      id="portfolio"
      className="relative w-full bg-liquid-abyss py-24 sm:py-32 px-6 border-t border-white/5 overflow-hidden scroll-mt-16"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 w-[600px] h-[300px] bg-[#00827c]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4 border-b border-white/5">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-liquid-kelp border border-white/10 text-xs font-mono uppercase tracking-widest text-bioluminescent-lime">
              <Layers className="w-3.5 h-3.5" />
              <span>Portfolio Oficial</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-medium text-platinum font-matter tracking-tight">
              Webs y proyectos producidos
            </h2>
            <p className="text-sm sm:text-base text-silver-mist leading-relaxed font-matter">
              Proyectos reales diseñados y desarrollados en producción con altos estándares de velocidad, interacción y conversión.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLeadModal}
              className="bg-liquid-kelp hover:bg-bioluminescent-lime hover:text-liquid-abyss text-platinum text-xs font-semibold px-5 py-2.5 rounded-full border border-white/15 hover:border-bioluminescent-lime transition-all uppercase tracking-wider cursor-pointer"
            >
              Comenzar mi rediseño
            </button>
          </div>
        </div>

        {/* 6 Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project) => (
            <article
              key={project.id}
              className="surface-card p-6 sm:p-7 flex flex-col justify-between group transition-all duration-300 hover:border-bioluminescent-lime/40 relative overflow-hidden bg-liquid-kelp/40 hover:bg-liquid-kelp/60"
            >
              <div className="space-y-4">
                {/* Meta Badge Bar */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-silver-mist uppercase">
                    0{project.id} / 06
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-bioluminescent-lime px-2.5 py-0.5 rounded-full bg-liquid-abyss border border-bioluminescent-lime/20">
                    {project.badge}
                  </span>
                </div>

                {/* Project Title and Category */}
                <div className="space-y-1.5 pt-2">
                  <h3 className="text-xl font-medium text-platinum font-matter tracking-tight group-hover:text-white transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs uppercase font-mono tracking-wider text-bioluminescent-lime/80">
                    {project.category}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-silver-mist leading-relaxed font-matter">
                  {project.tagline}
                </p>

                {/* Simulated URL preview bar */}
                <div className="p-2.5 rounded-lg bg-liquid-abyss/80 border border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-deep group-hover:text-silver-mist transition-colors">
                  <span className="flex items-center gap-1.5 truncate">
                    <Globe className="w-3.5 h-3.5 text-bioluminescent-lime flex-shrink-0" />
                    <span className="truncate">{project.displayUrl}</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-silver-mist flex-shrink-0" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-3">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2.5 px-4 rounded-lg bg-liquid-abyss hover:bg-white/10 text-platinum text-xs font-semibold uppercase tracking-wider border border-white/10 hover:border-white/20 transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Ver en vivo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={onOpenLeadModal}
                  aria-label={`Comenzar rediseño inspirado en ${project.title}`}
                  className="py-2.5 px-3 rounded-lg bg-bioluminescent-lime/10 hover:bg-bioluminescent-lime hover:text-liquid-abyss text-bioluminescent-lime text-xs font-semibold uppercase tracking-wider border border-bioluminescent-lime/30 transition-all cursor-pointer"
                >
                  Rediseñar
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
