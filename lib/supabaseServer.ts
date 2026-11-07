/**
 * Cliente de Servidor para Supabase (PostgREST API nativa sin dependencias pesadas)
 * Persiste contactos, eventos de agentes, conversaciones de WhatsApp y submissions 24/7.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://smvhwaeppoigxmbiccjw.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

async function supabaseFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  if (!SUPABASE_KEY) {
    console.warn("[Supabase] Advertencia: SUPABASE_SERVICE_ROLE_KEY no está configurada.");
    return null;
  }

  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const headers: Record<string, string> = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation",
    ...(options.headers as Record<string, string> || {})
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errText = await res.text();
      console.error(`[Supabase Error] ${res.status} ${res.statusText} en ${endpoint}:`, errText);
      return null;
    }
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    }
    return true;
  } catch (err) {
    console.error(`[Supabase Network Error] en ${endpoint}:`, err);
    return null;
  }
}

export interface SupabaseContact {
  id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  source?: string;
  lastActivityAt?: string;
}

export async function findOrCreateContactByPhone(phone: string, name?: string): Promise<string | null> {
  const cleanPhone = phone.replace(/[^0-9+]/g, "");
  
  // 1. Buscar si ya existe por teléfono
  const existing = await supabaseFetch(`contact?phone=eq.${encodeURIComponent(cleanPhone)}&select=id,firstName,phone&limit=1`);
  if (Array.isArray(existing) && existing.length > 0) {
    return existing[0].id;
  }

  // 2. Si no existe, crear nuevo contacto
  const nameParts = (name || "Contacto WhatsApp").trim().split(" ");
  const firstName = nameParts[0] || "Contacto";
  const lastName = nameParts.slice(1).join(" ") || "WhatsApp";

  const newContact = await supabaseFetch("contact", {
    method: "POST",
    body: JSON.stringify({
      phone: cleanPhone,
      firstName,
      lastName,
      source: "whatsapp_cloud_api",
      lastActivityAt: new Date().toISOString()
    })
  });

  if (Array.isArray(newContact) && newContact.length > 0) {
    return newContact[0].id;
  }
  return null;
}

export async function logWhatsAppEvent(contactId: string, message: string, direction: "inbound" | "outbound", rawPayload?: any): Promise<boolean> {
  const res = await supabaseFetch("agentEvent", {
    method: "POST",
    body: JSON.stringify({
      contactId,
      type: direction === "inbound" ? "whatsapp_message_inbound" : "whatsapp_message_outbound",
      data: {
        channel: "whatsapp",
        direction,
        message,
        timestamp: new Date().toISOString(),
        raw: rawPayload || null
      },
      emittedAt: new Date().toISOString()
    })
  });

  // Actualizar lastActivityAt en contacto
  await supabaseFetch(`contact?id=eq.${contactId}`, {
    method: "PATCH",
    body: JSON.stringify({
      lastActivityAt: new Date().toISOString()
    })
  });

  return Boolean(res);
}

export async function getContactRecentMessages(contactId: string, limit = 6): Promise<Array<{ role: "user" | "assistant"; content: string }>> {
  const events = await supabaseFetch(`agentEvent?contactId=eq.${contactId}&order=emittedAt.desc&limit=${limit}`);
  if (!Array.isArray(events)) return [];

  const history: Array<{ role: "user" | "assistant"; content: string }> = [];
  for (const ev of events.reverse()) {
    if (ev.data && ev.data.message) {
      history.push({
        role: ev.data.direction === "inbound" ? "user" : "assistant",
        content: ev.data.message
      });
    }
  }
  return history;
}

export async function saveFormLead(email: string, name?: string, phone?: string, company?: string, fields?: any): Promise<string | null> {
  let contactId: string | null = null;

  if (email) {
    const existing = await supabaseFetch(`contact?email=eq.${encodeURIComponent(email)}&select=id&limit=1`);
    if (Array.isArray(existing) && existing.length > 0) {
      contactId = existing[0].id;
    }
  }

  if (!contactId) {
    const nameParts = (name || "Prospecto Web").trim().split(" ");
    const created = await supabaseFetch("contact", {
      method: "POST",
      body: JSON.stringify({
        email,
        phone,
        firstName: nameParts[0] || "Prospecto",
        lastName: nameParts.slice(1).join(" ") || "Web",
        title: company || "Interesado",
        source: "landing_smd_form",
        lastActivityAt: new Date().toISOString()
      })
    });
    if (Array.isArray(created) && created.length > 0) {
      contactId = created[0].id;
    }
  }

  // Registrar envío en formSubmission
  if (contactId) {
    await supabaseFetch("formSubmission", {
      method: "POST",
      body: JSON.stringify({
        contactId,
        email,
        host: "serviciodemarketingdigital.com",
        path: "/",
        fields: fields || {},
        filedAt: new Date().toISOString()
      })
    });
  }

  return contactId;
}
