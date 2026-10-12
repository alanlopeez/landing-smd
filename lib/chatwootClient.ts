// Cliente de Integración Omnicanal con Chatwoot API (Open-Source)
// Permite sincronizar conversaciones de WhatsApp y asignar etiquetas (labels) para clasificar leads.

export interface ChatwootConfig {
  baseUrl: string;
  apiToken: string;
  accountId: string;
  inboxId: string;
}

const config: ChatwootConfig = {
  baseUrl: process.env.CHATWOOT_BASE_URL || "http://localhost:3001",
  apiToken: process.env.CHATWOOT_API_TOKEN || "3PNYzfr43XXJApJmHQT67ji3",
  accountId: process.env.CHATWOOT_ACCOUNT_ID || "1",
  inboxId: process.env.CHATWOOT_INBOX_ID || "1",
};

function getHeaders() {
  return {
    api_access_token: config.apiToken,
    "Content-Type": "application/json",
  };
}

/**
 * Busca un contacto por teléfono o lo crea en Chatwoot si no existe.
 */
export async function findOrCreateChatwootContact(
  phone: string,
  name: string = "Prospecto WhatsApp",
  email?: string | null
): Promise<{ id: number; name: string } | null> {
  try {
    const formattedPhone = `+${phone.replace(/\D/g, "")}`;
    const searchUrl = `${config.baseUrl}/api/v1/accounts/${config.accountId}/contacts/search?q=${encodeURIComponent(
      formattedPhone
    )}`;

    const searchRes = await fetch(searchUrl, {
      method: "GET",
      headers: getHeaders(),
    });

    if (searchRes.ok) {
      const data: any = await searchRes.json();
      const existing = data?.payload?.[0];
      if (existing?.id) {
        return { id: existing.id, name: existing.name };
      }
    }

    // Si no existe, crear contacto
    const createUrl = `${config.baseUrl}/api/v1/accounts/${config.accountId}/contacts`;
    const payload: any = {
      name: name || "Prospecto WhatsApp",
      phone_number: formattedPhone,
    };
    if (email) payload.email = email;

    const createRes = await fetch(createUrl, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (createRes.ok) {
      const created: any = await createRes.json();
      const contact = created?.payload?.contact || created?.payload;
      return { id: contact?.id, name: contact?.name };
    }
  } catch (err: any) {
    console.warn("[Chatwoot] No se pudo buscar/crear contacto (servidor local posiblemente iniciando):", err.message);
  }
  return null;
}

/**
 * Obtiene la conversación activa de un contacto o crea una nueva en el buzón de WhatsApp.
 */
export async function getOrCreateChatwootConversation(
  contactId: number
): Promise<number | null> {
  try {
    const listUrl = `${config.baseUrl}/api/v1/accounts/${config.accountId}/contacts/${contactId}/conversations`;
    const listRes = await fetch(listUrl, {
      method: "GET",
      headers: getHeaders(),
    });

    if (listRes.ok) {
      const data: any = await listRes.json();
      const openConv = data?.payload?.find((c: any) => c.status === "open" || c.status === "snoozed");
      if (openConv?.id) {
        return openConv.id;
      }
    }

    // Crear nueva conversación
    const createConvUrl = `${config.baseUrl}/api/v1/accounts/${config.accountId}/conversations`;
    const createRes = await fetch(createConvUrl, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        contact_id: contactId,
        inbox_id: parseInt(config.inboxId, 10),
        status: "open",
      }),
    });

    if (createRes.ok) {
      const created: any = await createRes.json();
      return created?.id || created?.payload?.id || null;
    }
  } catch (err: any) {
    console.warn("[Chatwoot] Error obteniendo conversación:", err.message);
  }
  return null;
}

/**
 * Agrega un mensaje al hilo de la conversación en Chatwoot (entrante o saliente).
 */
export async function addMessageToChatwoot(
  conversationId: number,
  content: string,
  messageType: "incoming" | "outgoing" = "incoming"
): Promise<boolean> {
  try {
    const url = `${config.baseUrl}/api/v1/accounts/${config.accountId}/conversations/${conversationId}/messages`;
    const res = await fetch(url, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        content,
        message_type: messageType,
        private: false,
      }),
    });
    return res.ok;
  } catch (err: any) {
    console.warn("[Chatwoot] Error guardando mensaje en conversación:", err.message);
    return false;
  }
}

/**
 * Asigna etiquetas (labels) a la conversación para clasificar al lead.
 */
export async function assignLabelsToConversation(
  conversationId: number,
  labels: string[]
): Promise<boolean> {
  try {
    if (!labels || labels.length === 0) return true;
    const url = `${config.baseUrl}/api/v1/accounts/${config.accountId}/conversations/${conversationId}/labels`;
    const res = await fetch(url, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        labels,
      }),
    });
    return res.ok;
  } catch (err: any) {
    console.warn("[Chatwoot] Error asignando etiquetas a la conversación:", err.message);
    return false;
  }
}

/**
 * Orquestador principal de sincronización no-bloqueante entre WhatsApp y Chatwoot.
 */
export async function syncLeadWithChatwoot(params: {
  phone: string;
  name?: string;
  email?: string | null;
  inboundMessage?: string;
  outboundMessage?: string;
  labels: string[];
  stage?: number;
}): Promise<void> {
  try {
    const contact = await findOrCreateChatwootContact(params.phone, params.name, params.email);
    if (!contact?.id) return;

    const convId = await getOrCreateChatwootConversation(contact.id);
    if (!convId) return;

    // Registrar mensaje del usuario si existe
    if (params.inboundMessage) {
      await addMessageToChatwoot(convId, params.inboundMessage, "incoming");
    }

    // Registrar respuesta del bot si existe
    if (params.outboundMessage) {
      await addMessageToChatwoot(convId, params.outboundMessage, "outgoing");
    }

    // Aplicar etiquetas clasificatorias
    if (params.labels && params.labels.length > 0) {
      await assignLabelsToConversation(convId, params.labels);
    }
  } catch (e: any) {
    console.warn("[Chatwoot Sync Background] Error:", e.message);
  }
}
