import { NextRequest, NextResponse } from "next/server";
import { stitchOrCreateLead, UNIFIED_LEADS } from "@/lib/leadsStore";
import { syncLeadWithChatwoot } from "@/lib/chatwootClient";

export const dynamic = "force-dynamic";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "multiagentes_smd_secret_token_2026";
const ACCESS_TOKEN =
  process.env.WHATSAPP_PERMANENT_ACCESS_TOKEN ||
  "EAAT7c4ZB9HGQBSprZCS2af1JUoYpuyVpuFP3WK8DP0HoUvvsPRrnZAnRGoI39DjFarudwdPw40HdtKN37GeWmP12WWxVzUj2jLNJ1a88PVonoBrrZC2watfrocWosyQR1Nul747FXsqNcdDcFW5cizo3ZCtvPXZBnctwpcrW23QFvz25DA3g05h35fQ4E0leeTIwZDZD";
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "1254834877724483";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

// Búfer de ráfagas en memoria para esperar ráfagas de mensajes (Debounce Buffer de 4s)
interface BurstItem {
  messages: string[];
  contactName: string;
  lastArrival: number;
}
const burstBuffer = new Map<string, BurstItem>();

// SYSTEM PROMPT OFICIAL: ASISTENTE DE VENTAS Y CALIFICACIÓN (WHATSAPP)
const SYSTEM_PROMPT = `# SYSTEM PROMPT: ASISTENTE DE VENTAS Y CALIFICACIÓN (WHATSAPP)

## 1. ROL E IDENTIDAD
Eres el asistente de admisiones y ventas de Alan López en **Servicio de Marketing Digital (SMD)**.
Tu función es atender a los contactos que llegan por WhatsApp, diagnosticar rápidamente su necesidad comercial, recomendar el servicio adecuado entre los 3 disponibles, guiarlos por las etapas del embudo de calificación y derivar oportunamente con Alan para el cierre.

### Tono y estilo de comunicación:
- **Profesional, ágil y conversacional:** Escribes como un asesor humano en WhatsApp.
- **Conciso:** No envíes bloques largos de texto. Máximo 2 a 4 párrafos cortos por mensaje.
- **Una pregunta por turno:** Cada interacción debe terminar con una única pregunta clara para mantener el control de la conversación.
- **Formato WhatsApp:** Usa negritas con *texto* para resaltar palabras clave. No utilices tablas, títulos con almohadillas (#) ni listas interminables.

---

## 2. CATÁLOGO DE SERVICIOS

### Servicio 1: Rediseño / Landing Page Interactiva
- **Para quién es:** Negocios, profesionales o startups que no tienen página web o cuya web actual no genera conversiones, o que preparan un lanzamiento.
- **Oferta:** Diseño interactivo de alta conversión con prototipo navegable entregado en 48 horas y versión final lista en 3 a 5 días hábiles.
- **Precio:** USD $490 (pago único).
- **Garantía:** Fidelidad total de diseño y optimización de velocidad.

### Servicio 2: Máquina de Ventas Digital (500 Leads en 90 Días)
- **Para quién es:** Empresas B2B, marcas consolidadas o servicios de ticket medio/alto que ya cuentan con equipo comercial activo para atender llamadas y WhatsApp.
- **Oferta:** Sistema llave en mano instalado en 72 horas (embudo Next.js en Vercel Edge + Chatbot WhatsApp con IA + campañas en Meta/Google).
- **Precio:** Inversión total de $3.500.000 ARS (o equivalente en USD). Opciones: Seña de reserva de $350.000 ARS (10%) para exclusividad de nicho, o 2 cuotas de $1.750.000 ARS.
- **Garantía contractual:** 500 prospectos calificados en 90 días o se reembolsa el 100% del dinero por contrato legal, o se trabaja gratis hasta cumplirlos.

### Servicio 3: Video Repurposing DFY (Clips Cortos Virales)
- **Para quién es:** Creadores, podcasters, YouTubers, coaches y marcas con videos largos existentes (webinars, podcast, entrevistas) que no tienen tiempo de editar.
- **Oferta:** Transformación de video largo a clips verticales (9:16) con ganchos virales, subtítulos dinámicos y diseño de sonido. Entregas en 48-72h.
- **Gancho de entrada:** 1 clip demo 100% gratuito y sin compromiso a partir de un video del cliente.
- **Precio:** Cotización según volumen de clips mensuales, sin contratos de permanencia.

---

## 3. ETAPAS DEL EMBUDO Y REGLAS DE CALIFICACIÓN

Debes evaluar el avance de cada conversación y asignarle estrictamente una de las siguientes etapas:

1. `nuevo contacto`
   - El usuario inicia la conversación o saluda.
   - **Acción:** Dar la bienvenida amablemente y hacer una pregunta abierta para identificar su modelo de negocio y necesidad principal.

2. `solicito una demo`
   - El usuario muestra interés en ver cómo funciona un servicio (pide ver prototipos de landing, solicita el video explicativo de la máquina de 500 leads o pide el clip de prueba de video).
   - **Acción:** Si es video, pedir el enlace de su video largo para la demo gratuita. Si es landing o leads, compartir el enlace al proyecto/video demostrativo correspondiente.

3. `demo enviada`
   - Ya se le proporcionó el enlace de prueba, el video demostrativo de 3 minutos de la máquina de leads o el cliente envió el material para procesar su clip gratuito.
   - **Acción:** Preguntar qué le pareció el material y validar si se adapta a lo que busca implementar.

4. `solicito un presupuesto`
   - El usuario pregunta explícitamente por precios, modalidades de pago, planes mensuales o condiciones de contratación.
   - **Acción:** Presentar los valores oficiales con total transparencia y explicar qué incluye la inversión.

5. `presupuesto enviado`
   - Se le detallaron los importes (ej. USD $490 para Landing, los planes del servicio 500 leads o los paquetes de video).
   - **Acción:** Resolver dudas puntuales y consultar la fecha estimada en la que desean poner en marcha el proyecto.

6. `cliente cerrado`
   - El cliente confirma que desea contratar, pide datos bancarios, enlace de pago (Mercado Pago / Stripe) o solicita el contrato legal.
   - **Acción:** Facilitar los datos de pago/reserva o coordinar el traspaso con Alan para la firma del acuerdo.

7. `cliente mensual`
   - El cliente contrató un plan recurrente (mantenimiento de funnels, pauta publicitaria continua o paquete mensual de clips de video).
   - **Acción:** Brindar soporte de seguimiento y canalizar solicitudes operativas.

---

## 4. PROTOCOLO DE INTERACCIÓN PASO A PASO

1. **Fase de Diagnóstico Inicial:**
   - Averigua a qué se dedica su negocio y cuál es su cuello de botella actual:
     * ¿Falta de visitas/conversión en su web? -> Rediseño Landing ($490 USD).
     * ¿Tienen equipo comercial pero faltan prospectos B2B calificados? -> Máquina 500 Leads.
     * ¿Generan contenido largo pero no tienen presencia en Reels/TikTok/Shorts? -> Video Repurposing (Demo Gratis).

2. **Manejo de Dudas Frecuentes:**
   - **Sobre la garantía de 500 leads:** Explicar que está respaldada por contrato legal. Si no se alcanza la cifra en 90 días, se devuelve el 100% de los fondos o se continúa trabajando sin coste.
   - **Sobre los plazos de la landing:** El prototipo navegable se entrega en 48 horas para revisión y la web se despliega en 3 a 5 días hábiles.
   - **Sobre el clip de video:** Reiterar que el primer clip es sin coste ni tarjeta de crédito, simplemente enviando un enlace de Drive o YouTube.

3. **Derivación Humana:**
   - Si el cliente solicita una llamada personalizada previa al contrato, plantea requisitos atípicos o desea abonar mediante transferencia corporativa específica, indícale que Alan tomará el chat directamente para coordinar los detalles.

---

## 5. FORMATO OBLIGATORIO DE RESPUESTA

En **cada mensaje que generes**, debes incluir un encabezado técnico en la primera línea para que el CRM procese el estado del lead, seguido del mensaje destinado al usuario.

Usa exactamente esta estructura:

[TAGS_CRM: {"etapa": "<nombre_de_la_etapa>", "servicio_sugerido": "<Landing | 500 Leads | Video Repurposing | Indeciso>", "accion_requerida": "<esperar_respuesta | enviar_link_pago | notificar_a_alan>"}]
(dos saltos de línea y el mensaje para el usuario)`;

// Mapa de etapas a índices numéricos
const STAGE_NAME_MAP: Record<string, number> = {
  "nuevo contacto": 0,
  "solicito una demo": 1,
  "demo enviada": 2,
  "solicito un presupuesto": 3,
  "presupuesto enviado": 4,
  "cliente cerrado": 5,
  "cliente mensual": 6,
};

// Función para llamar a Gemini Flash con inyección del nuevo system prompt
async function callGeminiFlash(
  lead: any,
  contactName: string,
  burstText: string
): Promise<{ cleanReply: string; tagsCrm: { etapa: string; servicio_sugerido: string; accion_requerida: string } }> {
  const historySnippet = (lead?.history || [])
    .slice(-8)
    .map((h: any) => `${h.direction === "inbound" ? "Usuario" : "Asesor"}: ${h.message}`)
    .join("\n");

  const promptText = `${SYSTEM_PROMPT}

---
CONTEXTO DEL PROSPECTO:
Nombre: ${lead?.name || contactName}
Rubro/Empresa actual: ${lead?.company || "Por calificar"}
Etapa previa en CRM: ${lead?.stageName || "nuevo contacto"}
Etiquetas previas: ${(lead?.tags || []).join(", ") || "Ninguna"}

HISTORIAL RECIENTE DE LA CONVERSACIÓN:
${historySnippet || "Sin historial previo (primer contacto)."}

MENSAJE(S) ENVIADO(S) AHORA POR EL USUARIO:
${burstText}

INSTRUCCIÓN:
Genera tu respuesta en el formato obligatorio:
Línea 1: [TAGS_CRM: {"etapa": "...", "servicio_sugerido": "...", "accion_requerida": "..."}]
Líneas siguientes: Tu respuesta concisa en tono humano conversacional de WhatsApp (2 a 4 párrafos cortos, usando *negritas*, terminando con UNA sola pregunta clara):`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: promptText }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 250,
      temperature: 0.6,
    },
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data: any = await res.json();
    let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    // Parsear encabezado [TAGS_CRM: {...}]
    let tagsCrm = {
      etapa: "nuevo contacto",
      servicio_sugerido: "Indeciso",
      accion_requerida: "esperar_respuesta",
    };

    const tagMatch = rawText.match(/\[TAGS_CRM:\s*(\{.*?\})\s*\]/i);
    if (tagMatch) {
      try {
        const parsed = JSON.parse(tagMatch[1]);
        tagsCrm = {
          etapa: parsed.etapa || "nuevo contacto",
          servicio_sugerido: parsed.servicio_sugerido || "Indeciso",
          accion_requerida: parsed.accion_requerida || "esperar_respuesta",
        };
      } catch (err) {}
    }

    // Limpiar mensaje para enviar al usuario de WhatsApp sin el header técnico
    let cleanReply = rawText.replace(/\[TAGS_CRM:\s*\{.*?\}\s*\]\s*/gi, "").trim();

    // Fallback si vino vacío
    if (!cleanReply) {
      cleanReply = "¡Hola! Un gusto saludarte. 👋 Soy el asesor del equipo de Alan López en *Servicio de Marketing Digital*.\n\nPara orientarte de la forma más precisa, ¿a qué rubro se dedica tu negocio y qué objetivo te gustaría acelerar este mes?";
    }

    return { cleanReply, tagsCrm };
  } catch (err: any) {
    console.error("Error llamando a Gemini Flash:", err.message);
    return {
      cleanReply: "¡Hola! Un gusto saludarte. 👋 Soy el asesor del equipo de Alan López en *Servicio de Marketing Digital*.\n\nPara orientarte de la forma más precisa, ¿a qué rubro se dedica tu negocio y qué objetivo te gustaría acelerar este mes?",
      tagsCrm: {
        etapa: "nuevo contacto",
        servicio_sugerido: "Indeciso",
        accion_requerida: "esperar_respuesta",
      },
    };
  }
}

// GET para validación del Webhook por Meta Graph API
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✔ Webhook de WhatsApp verificado con éxito por Meta");
    return new Response(challenge, { status: 200 });
  }

  return new Response("Forbidden", { status: 403 });
}

// POST para recepción de mensajes con Debounce Buffer y Sistema de Calificación
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const entries = body?.entry || [];

    for (const entry of entries) {
      for (const change of entry?.changes || []) {
        const value = change?.value;
        const messages = value?.messages;

        if (messages && messages.length > 0) {
          for (const msg of messages) {
            const fromPhone = msg.from;
            const messageId = msg.id;
            const messageText = msg.text?.body || "[Mensaje]";
            const contactName = value?.contacts?.[0]?.profile?.name || "Prospecto";

            console.log(`📩 [INBOUND] ${contactName} (${fromPhone}): "${messageText}"`);

            // 1. Marcar mensaje como LEÍDO en WhatsApp Cloud API (Tilde azul inmediata)
            const cleanTo = fromPhone.replace(/\D/g, "");
            const readUrl = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;
            fetch(readUrl, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                messaging_product: "whatsapp",
                status: "read",
                message_id: messageId,
              }),
            }).catch((e) => console.warn("Error marcando leído:", e));

            // 2. Acumular en el Debounce Buffer por teléfono (4 segundos)
            let item = burstBuffer.get(cleanTo);
            const now = Date.now();
            if (!item) {
              item = {
                messages: [messageText],
                contactName,
                lastArrival: now,
              };
              burstBuffer.set(cleanTo, item);
            } else {
              item.messages.push(messageText);
              item.lastArrival = now;
            }

            // 3. Ventana de espera inteligente
            await new Promise((r) => setTimeout(r, 4000));

            // Si llegó un mensaje más nuevo durante los 4 segundos, este hilo cede el turno
            const currentItem = burstBuffer.get(cleanTo);
            if (!currentItem || Date.now() - currentItem.lastArrival < 3800) {
              console.log(`⏳ [DEBOUNCE] Esperando que ${contactName} termine de escribir...`);
              continue;
            }

            // 4. Se consolidó la ráfaga completa: procesar todo junto
            const consolidatedBurst = currentItem.messages.join("\n");
            burstBuffer.delete(cleanTo);

            console.log(`🚀 [PROCESANDO RÁFAGA] ${contactName}: "${consolidatedBurst}"`);

            // Extraer email si fue mencionado en alguno de los mensajes
            const emailMatch = consolidatedBurst.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            const extractedEmail = emailMatch ? emailMatch[0].toLowerCase() : null;

            // Ingestión y fusión omnicanal en memoria / CRM
            const lead = stitchOrCreateLead({
              phone: cleanTo,
              email: extractedEmail,
              name: contactName !== "Prospecto" ? contactName : undefined,
              channel: "whatsapp",
              direction: "inbound",
              message: consolidatedBurst,
            });

            // 5. Generar respuesta consultiva con el nuevo SYSTEM PROMPT de Calificación
            const { cleanReply, tagsCrm } = await callGeminiFlash(lead, contactName, consolidatedBurst);

            console.log(
              `🏷️ [TAGS CRM DETECTADOS]: Etapa: "${tagsCrm.etapa}" | Servicio: "${tagsCrm.servicio_sugerido}" | Acción: "${tagsCrm.accion_requerida}"`
            );

            // Actualizar etapa y etiquetas en el CRM
            const stageNum = STAGE_NAME_MAP[tagsCrm.etapa.toLowerCase()] ?? 0;
            lead.stage = stageNum;
            (lead as any).stageName = tagsCrm.etapa;

            const newTags = [
              `etapa: ${tagsCrm.etapa}`,
              `servicio: ${tagsCrm.servicio_sugerido}`,
              `accion: ${tagsCrm.accion_requerida}`,
            ];
            lead.tags = Array.from(new Set([...(lead.tags || []), ...newTags]));

            // Guardar respuesta del bot en el historial del lead
            stitchOrCreateLead({
              phone: cleanTo,
              email: extractedEmail,
              channel: "whatsapp",
              direction: "outbound",
              message: cleanReply,
            });

            // 6. Sincronizar en segundo plano con Chatwoot (Labels + Mensajes)
            syncLeadWithChatwoot({
              phone: cleanTo,
              name: contactName,
              email: extractedEmail,
              inboundMessage: consolidatedBurst,
              outboundMessage: cleanReply,
              labels: lead.tags,
              stage: stageNum,
            }).catch((err) => console.warn("[Chatwoot Sync Error]:", err));

            // 7. Enviar mensaje de vuelta vía Meta WhatsApp Cloud API
            const metaRes = await fetch(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: cleanTo,
                type: "text",
                text: {
                  preview_url: true,
                  body: cleanReply,
                },
              }),
            });

            const metaData: any = await metaRes.json();
            console.log(
              `✔ [RESPUESTA ENVIADA A ${cleanTo}]: "${cleanReply.slice(0, 50)}..." (Meta:`,
              metaData?.messages?.[0]?.id || "OK",
              ")"
            );
          }
        }
      }
    }

    return NextResponse.json({ status: "OK" }, { status: 200 });
  } catch (error: any) {
    console.error("Error en Webhook de WhatsApp:", error);
    return NextResponse.json({ status: "ERROR", error: error.message }, { status: 200 });
  }
}
