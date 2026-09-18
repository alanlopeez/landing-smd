"use client";

import React, { useState, useRef, useEffect } from "react";
import { ExternalLink, Sparkles, ArrowUpRight, Play, Pause } from "lucide-react";

interface DesignShowcaseProps {
  onOpenLeadModal: () => void;
}

interface ReferoModel {
  id: number;
  title: string;
  style: string;
  badge: string;
  referoUrl: string;
  video: string;
  poster: string;
  desc: string;
}

const referoModels: ReferoModel[] = [
  {
    id: 1,
    title: "Auros",
    style: "Abyssal Terminal · Fintech Dark Mode",
    badge: "Inspiración Principal",
    referoUrl: "https://styles.refero.design/style/21cfe0c1-778d-4613-9f47-a5718eb929b3",
    video: "https://images.refero.design/styles/refero.design/video/55288795-6ee8-4950-acf1-49bbdbbba5de.mp4",
    poster: "https://images.refero.design/styles/refero.design/image/274bd266-522b-4eae-a08a-d8d9643a3d1e.jpg",
    desc: "Paleta abisal en tonos petróleo con micro-interacciones bioluminiscentes, tipografía sans geométrica y sin sombras sucias.",
  },
  {
    id: 2,
    title: "Authkit",
    style: "Frosted Glass Cathedral at Midnight",
    badge: "Glassmorphism",
    referoUrl: "https://styles.refero.design/style/e80231a2-e4d6-406a-a2c9-2e6109679690",
    video: "https://images.refero.design/styles/refero.design/video/21baed16-33d4-4346-b784-59fae33b3365.mp4",
    poster: "https://images.refero.design/styles/refero.design/image/d95d6cba-f685-4f9b-962f-7b67be573e3b.jpg",
    desc: "Superficies de cristal esmerilado con sombras ambientales profundas y foco absoluto en flujos de autenticación de alta gama.",
  },
  {
    id: 3,
    title: "Resend",
    style: "Black Velvet with Violet Neon",
    badge: "Developer First",
    referoUrl: "https://styles.refero.design/style/0d914ef0-fa84-4c60-a9aa-cef0b5eb6e5d",
    video: "https://images.refero.design/styles/refero.design/video/7b76f1c1-600b-444f-a1a1-c51c831ec51a.mp4",
    poster: "https://images.refero.design/styles/refero.design/image/22c6d308-8e89-4895-9c72-a0bdf0cc0ebf.jpg",
    desc: "Terciopelo negro con acentos violeta neón y tipografía monoespaciada para productos tecnológicos de alta conversión.",
  },
  {
    id: 4,
    title: "Superpower",
    style: "Bioluminescent Health Command",
    badge: "Deep Tech & Salud",
    referoUrl: "https://styles.refero.design/style/5d34568d-4bdc-445d-a527-c6f5249fa8fb",
    video: "https://images.refero.design/styles/refero.design/video/cfd6c51a-803c-499f-a854-e688324246f9.mp4",
    poster: "https://images.refero.design/styles/refero.design/image/17a65f9d-b0f9-4a92-8b56-62323cd3d6c9.jpg",
    desc: "Consola interactiva de visualización de datos biométricos con acentos verde esmeralda y gráficos en tiempo real.",
  },
  {
    id: 5,
    title: "Apple",
    style: "White Room with a Single Blue",
    badge: "Minimalismo Escultórico",
    referoUrl: "https://styles.refero.design/style/aecac5da-f397-4ddf-b71f-de1efc434cb8",
    video: "https://images.refero.design/styles/refero.design/video/1f887521-04e4-41f5-ba4f-ef578bd2940b.mp4",
    poster: "https://images.refero.design/styles/refero.design/image/db890fdc-1c11-4b3e-8775-038a56523506.jpg",
    desc: "Espacio amplio con respiración visual generosa, tipografía de élite y exhibición escultórica para productos de alto valor.",
  },
  {
    id: 6,
    title: "Ventriloc",
    style: "Editorial Data Observatory",
    badge: "Analítica & Finanzas",
    referoUrl: "https://styles.refero.design/style/f99aca3e-5289-4595-a7cc-77a72052f4b8",
    video: "https://images.refero.design/styles/refero.design/video/892d30ae-09fd-4caf-b286-816ab2910a77.mp4",
    poster: "https://images.refero.design/styles/refero.design/image/b67fcb00-4cc2-4e53-85c1-7e91cbd26a46.jpg",
    desc: "Observatorio de métricas sobre fondo cálido con módulos asimétricos y visualización editorial sin recargas innecesarias.",
  },
  {
    id: 7,
    title: "Shop",
    style: "Floating Shopping Constellation",
    badge: "E-Commerce Inmersivo",
    referoUrl: "https://styles.refero.design/style/4fa67bd1-f01d-454a-b522-4a0359ff9815",
    video: "https://images.refero.design/styles/refero.design/video/7b4e3209-f303-4b00-9c45-a15af3602309.mp4",
    poster: "https://images.refero.design/styles/refero.design/image/edca446a-36c3-4176-930c-cc17eb941808.jpg",
    desc: "Catálogo interactivo con micro-animaciones fluidas al añadir productos y checkout sin fricción optimizado para venta móvil.",
  },
  {
    id: 8,
    title: "Dub",
    style: "Frosted Link Dashboard",
    badge: "SaaS Dashboard",
    referoUrl: "https://styles.refero.design/style/b0d80806-b724-4ed1-a1d1-074edd3c9bc9",
    video: "https://images.refero.design/styles/refero.design/video/75d5176d-6a7b-4383-bbdf-02cfe6d83a08.mp4",
    poster: "https://images.refero.design/styles/refero.design/image/50a07e77-0304-40d5-a0f6-8f6eab45fd36.jpg",
    desc: "Panel de control translúcido con gestión analítica de enlaces, navegación ultrarrápida y gráficos modulares limpios.",
  },
  {
    id: 9,
    title: "AgentQL",
    style: "Aurora Glow AI & Scraping",
    badge: "IA & Automatización",
    referoUrl: "https://styles.refero.design/style/d5307f56-76de-4d13-9741-f969c42e9aa5",
    video: "https://images.refero.design/styles/refero.design/video/3b99d502-7912-4b58-9b49-351a6d803752.mp4",
    poster: "https://images.refero.design/styles/refero.design/image/9c36064a-4995-4f89-b841-8386f5f031b0.jpg",
    desc: "Atmósfera nocturna con gradiente de aurora boreal para agentes inteligentes que procesan datos de la web en tiempo real.",
  },
  {
    id: 10,
    title: "GSAP",
    style: "Animated Kinetic Canvas",
    badge: "Animación Avanzada",
    referoUrl: "https://styles.refero.design/style/00537a20-e99e-4ef2-b119-c6f532c44cc9",
    video: "https://images.refero.design/styles/refero.design/video/e8588409-43c0-4d73-8aa0-479693ca8e24.mp4",
    poster: "https://images.refero.design/styles/refero.design/image/0a28e803-1d33-4974-8ea3-251ecdd77bef.jpg",
    desc: "Pizarra de animación cinemática de 60 fps que demuestra el poder de las transiciones fluidas sin sobrecargar la CPU del cliente.",
  },
];

// Interactive Video Card Component with IntersectionObserver scroll auto-play
function ReferoVideoCard({
  model,
  onOpenLeadModal,
}: {
  model: ReferoModel;
  onOpenLeadModal: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {
                // Autoplay may be deferred by browser until user gesture
              });
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      {
        threshold: 0.3, // Plays when 30% of card is in view
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <article className="surface-card p-6 sm:p-7 flex flex-col justify-between group transition-all duration-300 hover:border-bioluminescent-lime/30 relative overflow-hidden">
      <div className="space-y-4">
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-silver-mist uppercase">
              #{String(model.id).padStart(2, "0")}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-bioluminescent-lime px-2 py-0.5 rounded bg-liquid-abyss border border-bioluminescent-lime/20">
              {model.badge}
            </span>
          </div>

          <a
            href={model.referoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ver referencia en Refero de ${model.title}`}
            className="text-silver-mist hover:text-white transition-colors inline-flex items-center gap-1 text-xs"
          >
            <span className="hidden sm:inline text-[10px] uppercase font-mono">Refero</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Video Preview Container with Native Scroll Playback */}
        <div
          onClick={togglePlayback}
          className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-liquid-deep border border-white/10 group-hover:border-white/20 transition-all cursor-pointer shadow-lg"
        >
          {/* Native HTML5 Video Stream */}
          <video
            ref={videoRef}
            src={model.video}
            poster={model.poster}
            muted
            playsInline
            loop
            preload="metadata"
            onLoadedData={() => setIsLoaded(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            aria-label={`Previsualización del sitio ${model.title}`}
          />

          {/* Live Playing State Indicator */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-liquid-abyss/85 backdrop-blur-md border border-white/10 text-[10px] font-mono text-platinum pointer-events-none">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isPlaying ? "bg-bioluminescent-lime animate-pulse" : "bg-silver-mist/50"
              }`}
            />
            <span>{isPlaying ? "Reproduciendo al scroll" : "Pausado"}</span>
          </div>

          {/* Quick Play/Pause Hover Overlay Icon */}
          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-liquid-abyss/80 backdrop-blur-sm border border-white/10 flex items-center justify-center text-platinum opacity-0 group-hover:opacity-100 transition-opacity">
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </div>
        </div>

        {/* Title and Style Description */}
        <div className="space-y-1.5 pt-1">
          <h4 className="text-lg sm:text-xl font-medium text-platinum font-matter tracking-tight">
            {model.title}
          </h4>
          <p className="text-xs uppercase font-mono tracking-wider text-bioluminescent-lime/90">
            {model.style}
          </p>
          <p className="text-xs sm:text-sm text-silver-mist leading-relaxed font-matter pt-1">
            {model.desc}
          </p>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
        <button
          onClick={onOpenLeadModal}
          className="w-full text-center text-xs font-semibold uppercase tracking-wider py-2.5 px-4 rounded-[6px] bg-liquid-kelp/50 hover:bg-bioluminescent-lime text-platinum hover:text-liquid-abyss border border-white/10 hover:border-bioluminescent-lime transition-all duration-200"
        >
          Quiero Diseñar con Este Estilo
        </button>
      </div>
    </article>
  );
}

export default function DesignShowcase({ onOpenLeadModal }: DesignShowcaseProps) {
  const [activeTab, setActiveTab] = useState<"refero" | "produced">("refero");

  // Real projects produced by Alan López
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

  return (
    <section
      id="proyectos"
      className="relative w-full bg-liquid-abyss py-24 sm:py-32 px-6 border-t border-white/5 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/3 w-[600px] h-[300px] bg-bioluminescent-lime/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <p className="text-xs uppercase tracking-[0.12em] text-silver-mist font-matter font-medium">
              PORTFOLIO & INSPIRACIÓN GLOBAL
            </p>
            <h2 className="text-3xl sm:text-5xl font-medium text-platinum font-matter tracking-tight">
              Diseño de página web con estándares internacionales
            </h2>
            <p className="text-sm sm:text-base text-silver-mist leading-relaxed font-matter">
              Explora la previsualización interactiva de <strong className="text-platinum font-medium">10 modelos Refero</strong> que se reproducen automáticamente a medida que scrolleas, además de los proyectos reales desplegados en producción.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="inline-flex p-1.5 rounded-full bg-liquid-kelp border border-white/10 self-start md:self-auto">
            <button
              onClick={() => setActiveTab("refero")}
              className={`px-5 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "refero"
                  ? "bg-liquid-abyss text-platinum shadow-none border border-white/10"
                  : "text-silver-mist hover:text-white"
              }`}
            >
              10 Modelos Refero con Video ({referoModels.length})
            </button>
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
          </div>
        </div>

        {/* TAB 1: 10 MODELOS REFERO CON VIDEO NATIVO POR SCROLL */}
        {activeTab === "refero" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Banner info */}
            <div className="p-4 sm:p-5 rounded-xl bg-liquid-deep border border-white/10 text-xs text-silver-mist flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-bioluminescent-lime flex-shrink-0" />
                <span>
                  <strong className="text-platinum">Previsualización activa al scroll:</strong> los videos se reproducen de forma fluida a medida que entran en pantalla.
                </span>
              </div>
              <a
                href="https://styles.refero.design"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bioluminescent-lime hover:underline inline-flex items-center gap-1.5 font-semibold font-mono text-[11px]"
              >
                styles.refero.design <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* 10 Models Grid with Responsive 2-column wide layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {referoModels.map((model) => (
                <ReferoVideoCard
                  key={model.id}
                  model={model}
                  onOpenLeadModal={onOpenLeadModal}
                />
              ))}
            </div>

            {/* Callout Footer */}
            <div className="surface-card p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-dashed border-white/15">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-base font-medium text-platinum">
                  ¿Te interesa un estilo visual específico para tu sitio web?
                </h4>
                <p className="text-xs text-silver-mist">
                  Adaptamos la arquitectura y la paleta de cualquiera de estos referentes de Refero para tu marca.
                </p>
              </div>
              <button
                onClick={onOpenLeadModal}
                className="btn-aurora text-xs uppercase tracking-wider whitespace-nowrap flex-shrink-0"
              >
                Cotizar Mi Sitio Con Este Estilo
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: PROYECTOS PRODUCIDOS */}
        {activeTab === "produced" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {producedProjects.map((proj, idx) => (
              <div
                key={idx}
                className="surface-card p-6 sm:p-8 flex flex-col justify-between group transition-all duration-200 hover:border-bioluminescent-lime/30"
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
      </div>
    </section>
  );
}
