import type { Metadata, Viewport } from "next";
import { Inter_Tight, Inter } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-aspekta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-matter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#012624",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://serviciodemarketingdigital.com"),
  title: {
    default: "Webs de Alta Conversión y Agentes IA para Empresas B2B | Alan López",
    template: "%s | Alan López - Sistemas Web B2B",
  },
  description:
    "Desarrollamos sistemas web de alta gama y agentes multi-agente para empresas B2B y marcas consolidadas. Automatiza cotizaciones, califica prospectos y escala ventas 24/7 sin fricción operativa.",
  keywords: [
    "Sistemas Web B2B",
    "Páginas web para empresas B2B",
    "Agentes de IA para ventas",
    "Calificación de leads B2B",
    "Automatización de cotizaciones",
    "Diseño y desarrollo web",
    "Diseño de páginas web",
    "Diseño web y marketing digital",
    "Diseño Web Profesional",
    "Servicios de Desarrollo Web",
    "Diseño de alta gama",
    "Asistentes conversacionales",
    "Cierra ventas más rápido",
    "Delega la recolección de datos",
    "Automatización de ventas",
    "Aumenta la tasa de conversión",
    "Cotizadores automáticos",
    "Páginas web para empresas con diseño de alta gama",
    "Servicios de Desarrollo Web y Diseño de Páginas Web",
    "Diseño de páginas web y landing pages de ultra alta conversión",
    "Desarrollamos sitios web y creamos páginas web profesionales",
    "Aurelius Sistemiza influencer IA",
    "Motor Autónomo de Marketing y SEO Local con IA",
    "Departamento de Marketing y Captación Autónomo con Agentes de IA",
  ],
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  authors: [{ name: "Alan López", url: "https://serviciodemarketingdigital.com" }],
  creator: "Alan López",
  publisher: "Alan López - Sistemas Web B2B",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://serviciodemarketingdigital.com",
  },
  openGraph: {
    title: "Webs de Alta Conversión y Agentes IA para Empresas B2B | Alan López",
    description:
      "Infraestructura web de alta gama y sistemas multi-agentes para empresas B2B y marcas consolidadas. Filtra prospectos calificados y automatiza cotizaciones 24/7.",
    url: "https://serviciodemarketingdigital.com",
    siteName: "Alan López - Sistemas Web B2B",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/images/alan-lopez.png",
        width: 800,
        height: 800,
        alt: "Alan López - Sistemas Web B2B y Agentes Autónomos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sistemas Web de Alta Conversión y Agentes IA B2B | Alan López",
    description:
      "Webs corporativas ultrarrápidas con sistemas multi-agentes y calificación automática de prospectos. Entrega V1 en 24 horas.",
    images: ["/images/alan-lopez.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    "@id": "https://serviciodemarketingdigital.com/#service",
    name: "Alan López - Servicio de Diseño de Página Web & Multi-Agentes",
    alternateName: "Servicio de Marketing Digital",
    url: "https://serviciodemarketingdigital.com",
    logo: "https://serviciodemarketingdigital.com/logo.png",
    image: "https://serviciodemarketingdigital.com/images/alan-lopez.png",
    description:
      "Ofrecemos automatización de ventas, diseño y desarrollo web. Páginas web para empresas con diseño de alta gama y sistemas multi-agentes. Oferta especial: creamos tu sitio web en 24 hs.",
    telephone: "+54 9 11 0000-0000",
    email: "hola@serviciodemarketingdigital.com",
    priceRange: "$$ - $$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "AR",
    },
    sameAs: [
      "https://www.instagram.com/aureliussistemiza/",
      "https://www.tiktok.com/@aurelius.ia",
      "https://www.youtube.com/@serviciodemarketingdigital",
      "https://blog-relatos-alan-lopez.vercel.app/",
      "https://app-fundar.vercel.app/",
    ],
    founder: {
      "@type": "Person",
      name: "Alan López",
      jobTitle: "Productor Digital & Diseñador Web Freelance",
      sameAs: [
        "https://blog-relatos-alan-lopez.vercel.app/",
        "https://app-fundar.vercel.app/",
        "https://www.instagram.com/aureliussistemiza/",
        "https://www.tiktok.com/@aurelius.ia",
        "https://www.youtube.com/@serviciodemarketingdigital",
      ],
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios de Desarrollo Web y Diseño de Páginas Web",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Páginas web de una sola página para decisiones rápidas",
            description:
              "Diseño hiper-enfocado para ofrecer el servicio más vendido y conectar directamente por WhatsApp con el cliente ideal.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Servicios de Desarrollo Web y Diseño de Páginas Web",
            description:
              "Diseño y desarrollo web profesional de alta gama con carga ultrarrápida y semántica HTML5 estricta.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Páginas web para empresas con diseño de alta gama",
            description:
              "Desarrollamos sitios web y creamos páginas web profesionales con sistemas multi-agentes.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Automatización de ventas, cotizadores automáticos y asistentes conversacionales",
            description:
              "Embudos de venta interactivos que delegan la recolección de datos, aumentan la tasa de conversión y cierran ventas más rápido.",
          },
        },
        {
          "@type": "Offer",
          price: "1200",
          priceCurrency: "USD",
          url: "https://calendar.app.google/dhGQgyMUs2eHBPgN9",
          itemOffered: {
            "@type": "Service",
            name: "Motor Autónomo de Marketing y SEO Local con IA (Setup en 72 horas)",
            description:
              "Multiplica tu presencia orgánica y capta clientes calificados sin contratar una agencia ni dedicar 4 horas al día a crear contenido. Incluye investigación continua, generación SEO, distribución multicanal y memoria de marca.",
          },
        },
        {
          "@type": "Offer",
          price: "8000",
          priceCurrency: "USD",
          url: "https://calendar.app.google/xo1qqYbiVVpQTzCP8",
          itemOffered: {
            "@type": "Service",
            name: "Departamento de Marketing y Captación de Clientes 100% Autónomo con Agentes de IA",
            description:
              "Sustituye la fricción y el costo de un equipo tradicional de marketing por un ecosistema de agentes inteligentes que investigan, publican, optimizan pauta y derivan llamadas calificadas a tu equipo comercial.",
          },
        },
      ],
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Cuánto tiempo tarda el desarrollo y entrega de mi página web?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Gracias a nuestra metodología orientada a resultados, podemos estructurar y crear la primera versión de tu sitio web en 24 horas. A partir de ese momento, iniciamos una etapa de revisión donde tienes el derecho de solicitar todas las modificaciones y optimizaciones que precises hasta que el proyecto se adapte exactamente a tus expectativas.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué significa integrar \"sistemas multi-agentes\" en mi sitio web?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Implementar sistemas multi-agentes impulsados por Inteligencia Artificial permite integrar un ecosistema tecnológico automatizado directamente en tu página. Esto incluye embudos de ventas con formularios lógicos que filtran información en tiempo real, como el nivel de urgencia o el tipo de presupuesto del cliente. Esto te permite ahorrar recursos en tareas repetitivas y cerrar ventas mucho más rápido al cotizar al instante.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuándo debo realizar el pago por el servicio de diseño web?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nuestro modelo de trabajo asegura tu entera conformidad antes de facturar. Una vez confirmada la primera fase del servicio, iniciamos el diseño y desarrollo estructural. Solo procederemos a la instancia de pago luego de que el diseño cumpla con todas tus expectativas y nos confirmes tu aprobación de manera explícita por correo electrónico. Al acreditarse el pago, el sitio será publicado oficialmente en su dominio.",
        },
      },
      {
        "@type": "Question",
        name: "¿Ofrecen soporte o mantenimiento una vez que la página está publicada?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí, nuestro servicio no termina con la publicación de la plataforma. Como usuario, mantendrás un acceso libre y directo para solicitar nuevas modificaciones, optimizaciones o cambios futuros que tu sitio web requiera para continuar evolucionando y creciendo en el entorno digital.",
        },
      },
      {
        "@type": "Question",
        name: "¿Quién está a cargo del diseño, estrategia y posicionamiento de mi sitio?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cada proyecto es liderado por Alan López, Productor Digital especializado en marketing estratégico, diseño y prompt engineering. La producción se enfoca en crear soluciones escalables que han optimizado recursos, generado ecosistemas de alta tasa de conversión y logrado un posicionamiento orgánico líder en motores de búsqueda.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué rango de inversión se requiere para desarrollar una solución web?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Adaptamos nuestra propuesta técnica a la escala exacta de tu negocio y a tus tiempos operativos. Gestionamos proyectos de distintos niveles de complejidad, abarcando inversiones para negocios emergentes (menos de u$d 1500), escalas intermedias (entre u$d 1500 y u$d 3000), y ecosistemas corporativos avanzados (más de u$d 5000).",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué garantías de seguridad y fidelidad de diseño ofrecen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Garantizamos la máxima fidelidad: tienes el pleno derecho a solicitar una devolución si el sitio final entregado y publicado presenta distorsiones frente a la versión que aprobaste previamente. A nivel técnico, tu sitio cuenta con protocolos prioritarios de ciberseguridad; ante cualquier vulneración o ataque externo emergente, priorizaremos la investigación y la restitución inmediata de un nuevo sitio con las amenazas neutralizadas para garantizarte un entorno seguro para operar. Además, toda la información personal proporcionada se resguarda bajo estrictos estándares de confidencialidad.",
        },
      },
    ],
  };

  return (
    <html lang="es" className={`${interTight.variable} ${inter.variable}`}>
      <head>
        {/* CRM Tracking */}
        <script
          src="https://crm.serviciodemarketingdigital.com/t/crm.js"
          data-site="cmp_452cc6a6"
          async
          defer
        />
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-BN895RKRF7"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-BN895RKRF7');
              ${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ? `gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}');` : ""}
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className="bg-liquid-abyss text-silver-mist antialiased selection:bg-bioluminescent-lime selection:text-liquid-abyss">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
