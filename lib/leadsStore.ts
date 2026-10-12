export interface Interaction {
  id: string;
  channel: "email" | "whatsapp" | "web";
  direction: "inbound" | "outbound";
  message: string;
  timestamp: string;
}

export interface UnifiedLead {
  id: string;
  name: string;
  company: string;
  email: string | null;
  phone: string | null;
  channels: ("email" | "whatsapp" | "web")[];
  funnelId: "p1" | "p2" | "p3";
  stage: 0 | 1 | 2 | 3 | 4;
  lastTouch: string;
  ticketEstimated: string;
  tags?: string[];
  history: Interaction[];
  createdAt: string;
  updatedAt: string;
}

// In-memory persistent array for the container
export const UNIFIED_LEADS: UnifiedLead[] = [
  {
    id: "lead-alan-01",
    name: "Alan López",
    company: "Náutica Delta (Venta de Lanchas & Embarcaciones)",
    email: "alan.ezequiel95@gmail.com",
    phone: "5491127887093",
    channels: ["whatsapp", "email"],
    funnelId: "p2",
    stage: 1,
    lastTouch: "WHATSAPP (inbound): Hola! Vendemos lanchas y embarcaciones en Tigre...",
    ticketEstimated: "$3.500.000 ARS (Seña $350k)",
    tags: ["etapa-1", "lead-calificado-icp", "interes-500leads", "rubro-nautica"],
    history: [
      {
        id: "msg-101",
        channel: "whatsapp",
        direction: "outbound",
        message: "¡Hola Alan! Qué bueno que escribas. ¿De qué rubro es tu empresa y en qué zona están operando actualmente?",
        timestamp: "2026-10-12T09:15:00.000Z"
      },
      {
        id: "msg-102",
        channel: "whatsapp",
        direction: "inbound",
        message: "Hola! Vendemos lanchas y embarcaciones deportivas en Tigre y San Fernando. Nos interesa el servicio de 500 leads garantizados.",
        timestamp: "2026-10-12T09:16:30.000Z"
      },
      {
        id: "msg-103",
        channel: "whatsapp",
        direction: "outbound",
        message: "Excelente Alan. En náutica el dolor principal son los curiosos sin presupuesto. Para saber si el sistema te encaja perfecto: ¿cuál es el ticket promedio de las lanchas y si cuentan con asesores para atender los contactos en el día?",
        timestamp: "2026-10-12T09:17:10.000Z"
      }
    ],
    createdAt: "2026-10-12T09:00:00.000Z",
    updatedAt: "2026-10-12T09:17:10.000Z"
  },
  {
    id: "lead-carlos-02",
    name: "Carlos Mendizábal",
    company: "Mendizábal Maquinarias Viales & Agro",
    email: "carlos.mendizabal@maquinarias.com.ar",
    phone: "5491138491022",
    channels: ["whatsapp"],
    funnelId: "p2",
    stage: 2,
    lastTouch: "WHATSAPP (inbound): Tractores y retroexcavadoras. El ticket promedio ronda...",
    ticketEstimated: "$3.500.000 ARS",
    tags: ["etapa-2", "lead-calificado-icp", "interes-500leads", "objecion-garantia"],
    history: [
      {
        id: "msg-201",
        channel: "whatsapp",
        direction: "inbound",
        message: "Buenas tardes, vi su propuesta de 500 prospectos garantizados. ¿Cómo funciona exactamente la garantía si no llegan a la meta?",
        timestamp: "2026-10-12T09:30:00.000Z"
      },
      {
        id: "msg-202",
        channel: "whatsapp",
        direction: "outbound",
        message: "¡Hola Carlos! Totalmente. Si no alcanzamos los 500 leads calificados en los 90 días, seguimos trabajando sin costo adicional hasta completarlos o te devolvemos la diferencia proporcional por contrato firmado. ¿Qué maquinaria comercializan ustedes?",
        timestamp: "2026-10-12T09:31:15.000Z"
      },
      {
        id: "msg-203",
        channel: "whatsapp",
        direction: "inbound",
        message: "Tractores y retroexcavadoras. El ticket promedio ronda los 45.000 USD. Me parece razonable el esquema.",
        timestamp: "2026-10-12T09:34:00.000Z"
      }
    ],
    createdAt: "2026-10-12T09:25:00.000Z",
    updatedAt: "2026-10-12T09:34:00.000Z"
  },
  {
    id: "lead-sofia-03",
    name: "Arq. Sofía Valenzuela",
    company: "Valenzuela Desarrollos Inmobiliarios",
    email: "sofia@valenzuelaprop.com",
    phone: "5491167239011",
    channels: ["whatsapp", "email"],
    funnelId: "p1",
    stage: 3,
    lastTouch: "WHATSAPP (inbound): Perfecto, me anoto para mañana a las 11hs...",
    ticketEstimated: "$3.500.000 ARS",
    tags: ["etapa-3", "lead-calificado-icp", "interes-landing-web", "solicita-llamada"],
    history: [
      {
        id: "msg-301",
        channel: "whatsapp",
        direction: "inbound",
        message: "¿Podríamos coordinar una llamada corta para ver ejemplos de embudos y páginas que hayan hecho para desarrollos inmobiliarios?",
        timestamp: "2026-10-12T09:40:00.000Z"
      },
      {
        id: "msg-302",
        channel: "whatsapp",
        direction: "outbound",
        message: "¡Hola Sofía! De una. Podés elegir el horario que más te convenga en el calendario de Alan acá: https://cal.com/alan-lopez/15min ¿Te queda más cómodo hoy o mañana?",
        timestamp: "2026-10-12T09:41:20.000Z"
      },
      {
        id: "msg-303",
        channel: "whatsapp",
        direction: "inbound",
        message: "Genial, agendé para mañana a las 11:00 hs. Muchas gracias!",
        timestamp: "2026-10-12T09:45:00.000Z"
      }
    ],
    createdAt: "2026-10-12T09:35:00.000Z",
    updatedAt: "2026-10-12T09:45:00.000Z"
  },
  {
    id: "lead-martin-04",
    name: "Martín Gómez",
    company: "Distribuidora MG Alimentos B2B",
    email: "ventas@mgalimentos.com.ar",
    phone: "5491149208341",
    channels: ["whatsapp"],
    funnelId: "p2",
    stage: 0,
    lastTouch: "WHATSAPP (inbound): Hola, ¿cuánto sale el servicio por mes?",
    ticketEstimated: "$3.500.000 ARS (Seña $350k)",
    tags: ["etapa-0", "contacto-inicial", "consulta-precio"],
    history: [
      {
        id: "msg-401",
        channel: "whatsapp",
        direction: "inbound",
        message: "Hola, ¿cuánto sale el servicio por mes?",
        timestamp: "2026-10-12T10:05:00.000Z"
      },
      {
        id: "msg-402",
        channel: "whatsapp",
        direction: "outbound",
        message: "¡Hola Martín! El sistema llave en mano de 500 leads garantizados es de $3.500.000 ARS por los 3 meses (o seña de $350.000 ARS para reservar plaza). Para ver si aplica a tu rubro: ¿comercializan mayorista a comercios o al público final?",
        timestamp: "2026-10-12T10:06:40.000Z"
      }
    ],
    createdAt: "2026-10-12T10:00:00.000Z",
    updatedAt: "2026-10-12T10:06:40.000Z"
  }
];

export function stitchOrCreateLead(data: {
  email?: string | null;
  phone?: string | null;
  name?: string;
  company?: string;
  channel: "email" | "whatsapp" | "web";
  direction: "inbound" | "outbound";
  message: string;
}): UnifiedLead {
  const cleanPhone = data.phone ? data.phone.replace(/\D/g, "") : null;
  const cleanEmail = data.email ? data.email.trim().toLowerCase() : null;

  let existing = UNIFIED_LEADS.find(l => {
    const matchPhone = cleanPhone && l.phone && (
      l.phone === cleanPhone ||
      cleanPhone.endsWith(l.phone.slice(-8)) ||
      l.phone.endsWith(cleanPhone.slice(-8))
    );
    const matchEmail = cleanEmail && l.email && l.email.toLowerCase() === cleanEmail;
    return matchPhone || matchEmail;
  });

  const now = new Date().toISOString();
  const interaction: Interaction = {
    id: `int-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    channel: data.channel,
    direction: data.direction,
    message: data.message,
    timestamp: now
  };

  if (existing) {
    if (cleanEmail && !existing.email) existing.email = cleanEmail;
    if (cleanPhone && !existing.phone) existing.phone = cleanPhone;
    if (data.name && (!existing.name || existing.name === "Prospecto")) existing.name = data.name;
    if (data.company && !existing.company) existing.company = data.company;
    if (!existing.channels.includes(data.channel)) existing.channels.push(data.channel);
    
    existing.history.push(interaction);
    existing.lastTouch = `${data.channel.toUpperCase()} (${data.direction}): ${data.message.slice(0, 75)}...`;
    existing.updatedAt = now;
    return existing;
  } else {
    const newLead: UnifiedLead = {
      id: `lead-${Date.now()}`,
      name: data.name || "Prospecto " + (cleanPhone ? cleanPhone.slice(-4) : "Web"),
      company: data.company || "Rubro a calificar",
      email: cleanEmail,
      phone: cleanPhone,
      channels: [data.channel],
      funnelId: "p2",
      stage: 0,
      tags: ["contacto-inicial", "etapa-0"],
      lastTouch: `${data.channel.toUpperCase()} (${data.direction}): ${data.message.slice(0, 75)}...`,
      ticketEstimated: "$3.500.000 ARS (Seña $350k)",
      history: [interaction],
      createdAt: now,
      updatedAt: now
    };
    UNIFIED_LEADS.push(newLead);
    return newLead;
  }
}
