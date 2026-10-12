import { NextRequest, NextResponse } from "next/server";
import { stitchOrCreateLead, UNIFIED_LEADS } from "@/lib/leadsStore";
import { findBestResponse, ConversationResponse } from "@/lib/conversationRepository";
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

// Prompt del Asesor Comercial Consultivo Humano con Repositorio de Respuestas
const SYSTEM_PROMPT = `Sos el asesor comercial consultivo de Alan López en Servicio de Marketing Digital (Buenos Aires, Argentina).
Estás chateando por WhatsApp con un dueño de negocio o prospecto real.

REGLAS DE ORO OBLIGATORIAS:
1. RESPUESTAS ULTRACORTAS: Máximo 2 a 3 oraciones cortas (35 a 45 palabras en total). En WhatsApp los mensajes largos parecen spam y nadie los lee.
2. TONO 100% HUMANO Y NATURAL: Cercano, empático, profesional argentino ("Hola Alan, ¿cómo estás?", "Totalmente", "De una", "Te entiendo"). Cero lenguaje corporativo rígido.
3. DIVULGACIÓN PROGRESIVA Y BASADA EN EL REPOSITORIO:
   - Apoyate siempre en la "Respuesta Canónica Aprobada" del repositorio que se te proporciona para cada intención.
   - NUNCA pegues links de pago de entrada, a menos que el usuario pregunte explícitamente precios o cómo reservar.
   - Si pregunta por la garantía: explicá la extensión gratis sin costo o devolución proporcional, firmado por contrato (CUIT 20-39210016-5).
   - Si pregunta por ad spend: explicá que la pauta publicitaria corre por cuenta del cliente directo en sus cuentas de Meta/Google para deducir impuestos.
   - Si pide llamada o coordinar: pasale el link oficial de Cal.com: https://cal.com/alan-lopez/15min
4. CIERRE CONVERSACIONAL: Cada respuesta tuya DEBE terminar siempre con UNA sola pregunta corta para mantener la conversación viva y fácil de contestar.`;

/**
 * Función para inferir etiquetas (labels) a partir del texto y la categoría detectada
 */
function inferLabels(text: string, category: string, stage: number): string[] {
  const lower = text.toLowerCase();
  const labels: Set<string> = new Set();

  // Etiqueta de Etapa Comercial
  labels.add(`etapa-${stage}`);

  // Etiquetas por Categoría e Intención
  if (category === "saludo") labels.add("contacto-inicial");
  if (category === "calificacion") labels.add("en-calificacion");
  if (category === "oferta_500leads" || lower.includes("500") || lower.includes("leads")) {
    labels.add("interes-500leads");
  }
  if (category === "oferta_landing" || lower.includes("landing") || lower.includes("web") || lower.includes("sitio")) {
    labels.add("interes-landing-web");
  }
  if (category === "oferta_video" || lower.includes("video") || lower.includes("reels") || lower.includes("tiktok")) {
    labels.add("interes-video-social");
  }
  if (category === "objecion_garantia" || lower.includes("garantia") || lower.includes("garantía")) {
    labels.add("objecion-garantia");
  }
  if (category === "objecion_adspend" || lower.includes("publicidad") || lower.includes("pauta") || lower.includes("anuncio")) {
    labels.add("consulta-adspend");
  }
  if (category === "objecion_precio" || lower.includes("precio") || lower.includes("cuanto sale") || lower.includes("costo") || lower.includes("cuánto")) {
    labels.add("consulta-precio");
  }
  if (category === "cierre_reserva" || lower.includes("seña") || lower.includes("pagar") || lower.includes("transferencia") || lower.includes("tarjeta")) {
    labels.add("intencion-pago-seña");
  }
  if (category === "cierre_llamada" || lower.includes("llamada") || lower.includes("reunion") || lower.includes("reunión") || lower.includes("zoom")) {
    labels.add("solicita-llamada");
  }

  // Criterios de Calificación ICP
  if (
    lower.includes("empresa") ||
    lower.includes("fabrica") ||
    lower.includes("fábrica") ||
    lower.includes("distribuidora") ||
    lower.includes("lanchas") ||
    lower.includes("inmobiliaria") ||
    lower.includes("constructora")
  ) {
    labels.add("lead-calificado-icp");
  }

  return Array.from(labels);
}

// Función para llamar a Gemini Flash con inyección del Repositorio de Respuestas y contexto histórico
async function callGeminiFlash(
  lead: any,
  contactName: string,
  burstText: string,
  repositoryMatch: {
    matchedResponse: ConversationResponse;
    recommendedText: string;
    suggestedStage: number;
  }
): Promise<string> {
  const historySnippet = (lead?.history || [])
    .slice(-8)
    .map((h: any) => `${h.direction === "inbound" ? "Usuario" : "Asesor"}: ${h.message}`)
    .join("\n");

  const promptText = `${SYSTEM_PROMPT}

DATOS DEL CONTACTO:
Nombre: ${lead?.name || contactName}
Rubro/Empresa: ${lead?.company || "Negocio"}
Etapa Actual del Lead: Etapa ${lead?.stage ?? 0} (0: Saludo -> 1: Calificado -> 2: Oferta -> 3: Objeción -> 4: Cierre)

REPOSITORIO DE RESPUESTAS APROBADAS (GUÍA EXACTA PARA ESTA INTENCIÓN):
- Título: ${repositoryMatch.matchedResponse.title}
- Categoría: ${repositoryMatch.matchedResponse.category}
- Respuesta Canónica Aprobada: "${repositoryMatch.recommendedText}"
- Datos Clave Inmutables: ${repositoryMatch.matchedResponse.keyFacts.join(", ")}

HISTORIAL RECIENTE:
${historySnippet || "Sin historial previo."}

MENSAJES RECIÉN ENVIADOS POR EL USUARIO:
${burstText}

INSTRUCCIÓN: Respondé al usuario utilizando la guía de la Respuesta Canónica Aprobada. Máximo 2 a 3 oraciones cortas en tono argentino natural, terminando con 1 sola pregunta:`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: promptText }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 120,
      temperature: 0.65,
    },
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data: any = await res.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    // Fallback defensivo: si Gemini falla o devuelve vacío, usamos directamente la respuesta aprobada del repositorio
    if (!text) {
      text = repositoryMatch.recommendedText;
    }

    return text;
  } catch (err) {
    console.error("Error llamando a Gemini Flash:", err);
    return repositoryMatch.recommendedText;
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

// POST para recepción de mensajes con Debounce Buffer, Repositorio de Respuestas y Sincronización Chatwoot
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

            // 2. Acumular en el Debounce Buffer por teléfono
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

            // 3. Ventana de espera inteligente (4 segundos para captar mensajes múltiples en ráfaga)
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

            // 5. Consultar el Repositorio de Respuestas para esta intención y etapa
            const repositoryMatch = findBestResponse(
              consolidatedBurst,
              lead?.stage ?? 0,
              contactName,
              lead?.company ?? "Negocio"
            );

            console.log(
              `📚 [REPOSITORIO MATCH] Intención: "${repositoryMatch.matchedResponse.title}" (Score: ${repositoryMatch.score}) -> Sugiere Etapa ${repositoryMatch.suggestedStage}`
            );

            // Actualizar etapa del lead en el CRM según el repositorio
            const targetStage = Math.max(lead.stage ?? 0, repositoryMatch.suggestedStage);
            lead.stage = targetStage;

            // Inferir etiquetas (labels) automáticas
            const labels = inferLabels(consolidatedBurst, repositoryMatch.matchedResponse.category, targetStage);
            lead.tags = Array.from(new Set([...(lead.tags || []), ...labels]));

            // 6. Generar respuesta contextual corta con Gemini Flash guiado por el Repositorio
            const replyText = await callGeminiFlash(lead, contactName, consolidatedBurst, repositoryMatch);

            // Guardar respuesta del bot en el historial del lead
            stitchOrCreateLead({
              phone: cleanTo,
              email: extractedEmail,
              channel: "whatsapp",
              direction: "outbound",
              message: replyText,
            });

            // 7. Sincronizar en segundo plano con Chatwoot (Conversación, Mensajes y Etiquetas)
            syncLeadWithChatwoot({
              phone: cleanTo,
              name: contactName,
              email: extractedEmail,
              inboundMessage: consolidatedBurst,
              outboundMessage: replyText,
              labels,
              stage: targetStage,
            }).catch((err) => console.warn("[Chatwoot Sync Error]:", err));

            // 8. Enviar mensaje de vuelta vía Meta WhatsApp Cloud API
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
                  body: replyText,
                },
              }),
            });

            const metaData: any = await metaRes.json();
            console.log(
              `✔ [RESPUESTA ENVIADA A ${cleanTo}]: "${replyText}" (Labels: ${labels.join(", ")}) (Meta:`,
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
