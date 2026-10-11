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
    channels: ["email", "whatsapp"],
    funnelId: "p2",
    stage: 0,
    lastTouch: "Contacto inicial multicanal: Email enviado y WhatsApp de prueba entregado",
    ticketEstimated: "$3.500.000 ARS (Seña $350k)",
    history: [
      {
        id: "msg-1",
        channel: "email",
        direction: "outbound",
        message: "Propuesta de 500 leads en 90 días garantizados enviada a alan.ezequiel95@gmail.com",
        timestamp: "2026-10-11T16:20:00.000Z"
      },
      {
        id: "msg-2",
        channel: "whatsapp",
        direction: "outbound",
        message: "Prueba de conexión exitosa enviada desde el número oficial +54 9 11 7812-2565",
        timestamp: "2026-10-11T17:29:45.000Z"
      }
    ],
    createdAt: "2026-10-11T16:00:00.000Z",
    updatedAt: new Date().toISOString()
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
