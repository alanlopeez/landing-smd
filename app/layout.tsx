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
    default: "Servicio de Página Web y Diseño de Alta Gama | Alan López - Diseñador Web Freelance",
    template: "%s | Alan López - Servicio de Marketing Digital",
  },
  description:
    "Servicio de página web y creador de página web con sistemas multi-agentes y diseño de alta gama. Ahorra recursos, cierra ventas cotizando al instante y escala con Alan López, diseñador de página web.",
  keywords: [
    "Servicio de página web",
    "Diseño de página web",
    "diseñador web freelance",
    "diseñador de página web",
    "creador de página web",
    "cómo crear mi página web",
    "desarrollo web con inteligencia artificial",
    "sistemas multi-agentes",
    "embudos de venta automatizados",
    "automatizaciones con inteligencia artificial",
    "agentes autonomos ia",
    "asistente omnicanal",
    "preguntas frecuentes diseño web",
    "garantias diseño web",
    "costo pagina web dolares",
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
  publisher: "Servicio de Marketing Digital",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://serviciodemarketingdigital.com",
  },
  openGraph: {
    title: "Servicio de Página Web y Diseño Alta Gama | Alan López",
    description:
      "Tu página web con sistemas multi-agentes y diseño alta gama. Ahorra recursos, cotiza al instante y convierte visitas en clientes.",
    url: "https://serviciodemarketingdigital.com",
    siteName: "Alan López - Servicio de Marketing Digital",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/images/alan-lopez.png",
        width: 800,
        height: 800,
        alt: "Alan López - Diseñador Web Freelance y Productor Digital",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Diseño de Página Web de Alta Gama | Alan López",
    description:
      "Webs ultraligeras con IA y sistemas multi-agentes. Oferta especial: Comienza hoy, creamos tu sitio en 24 hs.",
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
      "Servicio de página web y diseño de alta gama con integración de sistemas multi-agentes con IA. Oferta especial: creamos tu sitio web en 24 hs.",
    telephone: "+54 9 11 0000-0000",
    email: "hola@serviciodemarketingdigital.com",
    priceRange: "$$ - $$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "AR",
    },
    founder: {
      "@type": "Person",
      name: "Alan López",
      jobTitle: "Productor Digital & Diseñador Web Freelance",
      sameAs: [
        "https://blog-relatos-alan-lopez.vercel.app/",
        "https://app-fundar.vercel.app/",
      ],
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios de Desarrollo y Diseño Web",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Servicio de página web con sistemas multi-agentes",
            description:
              "Diseño de página web ultraligera con embudo de ventas y cotización automatizada en tiempo real.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Diseño de página web de alta gama",
            description:
              "Desarrollo frontend a medida sin plantillas lentas, optimizado para 100/100 en Google PageSpeed.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Consultoría cómo crear mi página web",
            description:
              "Asesoramiento estratégico y entrega garantizada en 24 horas con soporte continuo.",
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
