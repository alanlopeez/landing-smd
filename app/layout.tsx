import type { Metadata, Viewport } from "next";
import { Inter_Tight, Inter } from "next/font/google";
import "./globals.css";

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
  ],
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
    logo: "https://serviciodemarketingdigital.com/images/alan-lopez.png",
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

  return (
    <html lang="es" className={`${interTight.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-liquid-abyss text-silver-mist antialiased selection:bg-bioluminescent-lime selection:text-liquid-abyss">
        {children}
      </body>
    </html>
  );
}
