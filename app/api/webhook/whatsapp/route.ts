import { NextRequest, NextResponse } from "next/server";
import { stitchOrCreateLead, UNIFIED_LEADS } from "@/lib/leadsStore";

export const dynamic = "force-dynamic";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "multiagentes_smd_secret_token_2026";
const ACCESS_TOKEN = process.env.WHATSAPP_PERMANENT_ACCESS_TOKEN || "EAAT7c4ZB9HGQBSprZCS2af1JUoYpuyVpuFP3WK8DP0HoUvvsPRrnZAnRGoI39DjFarudwdPw40HdtKN37GeWmP12WWxVzUj2jLNJ1a88PVonoBrrZC2watfrocWosyQR1Nul747FXsqNcdDcFW5cizo3ZCtvPXZBnctwpcrW23QFvz25DA3g05h35fQ4E0leeTIwZDZD";
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "1254834877724483";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

// Búfer de ráfagas en memoria para esperar ráfagas de mensajes (Debounce Buffer)
interface BurstItem {
  messages: string[];
  contactName: string;
  lastArrival: number;
}
const burstBuffer = new Map<string, BurstItem>();

// Prompt del Asesor Comercial Consultivo Humano
const SYSTEM_PROMPT = `Sos el asesor comercial consultivo de Alan López en Servicio de Marketing Digital (Buenos Aires, Argentina).
Estás chateando por WhatsApp con un dueño de negocio o prospecto real.

REGLAS DE ORO OBLIGATORIAS:
1. RESPUESTAS ULTRACORTAS: Máximo 2 a 3 oraciones cortas (35 a 45 palabras en total). En WhatsApp los mensajes largos parecen spam y nadie los lee.
2. TONO 100% HUMANO Y NATURAL: Cercano, empático, profesional argentino ("Hola Alan, ¿cómo estás?", "Totalmente", "De una", "Te entiendo"). Cero lenguaje corporativo rígido.
3. DIVULGACIÓN PROGRESIVA:
   - Si el prospecto recién te saluda o cuenta sobre su negocio (ej. venta de lanchas, maquinarias, servicios): mostrá interés genuino, validá su dolor (la cantidad de curiosos sin presupuesto que hacen perder tiempo) y hacé 1 sola pregunta corta para conocer cómo capta hoy.
   - NUNCA pegues links de pago ni hables de la seña de $350.000 ARS de entrada, a menos que el usuario pregunte explícitamente "¿Cuánto sale?", "Precios", "¿Cómo se paga?" o "¿Cómo contrato?".
   - Si pregunta precios o garantía: explicá en 2 oraciones que son 500 leads calificados en 90 días con contrato y CUIT 20-39210016-5, y que la exclusividad de zona se bloquea con seña de $350.000 ARS vía Mercado Pago: https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=3724152558-04c4dcd1-4592-4c02-8ac1-504c13b09ead
   - Si pide llamada o coordinar: pasale el link oficial de Cal.com: https://cal.com/alan-lopez/15min
4. CIERRE CONVERSACIONAL: Cada respuesta tuya DEBE terminar siempre con UNA sola pregunta corta para mantener la conversación viva y fácil de contestar.`;

// Función para llamar a Gemini Flash con contexto histórico
async function callGeminiFlash(lead: any, contactName: string, burstText: string): Promise<string> {
  const historySnippet = (lead?.history || [])
    .slice(-8)
    .map((h: any) => `${h.direction === "inbound" ? "Usuario" : "Asesor"}: ${h.message}`)
    .join("\n");

  const promptText = `${SYSTEM_PROMPT}\n\nDATOS DEL CONTACTO:\nNombre: ${lead?.name || contactName}\nRubro/Empresa: ${lead?.company || "Negocio"}\n\nHISTORIAL RECIENTE:\n${historySnippet || "Sin historial previo."}\n\nMENSAJES RECIÉN ENVIADOS POR EL USUARIO:\n${burstText}\n\nRespuesta (máximo 2 a 3 oraciones cortas, terminando con 1 sola pregunta):`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: promptText }]
      }
    ],
    generationConfig: {
      maxOutputTokens: 120,
      temperature: 0.65
    }
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    
    // Fallback defensivo si Gemini devuelve vacío
    if (!text) {
      text = `¡Hola ${contactName.split(" ")[0]}! Qué bueno que escribas. ¿De qué rubro es tu negocio y en qué zona estás operando actualmente?`;
    }

    return text;
  } catch (err) {
    console.error("Error llamando a Gemini Flash:", err);
    return `¡Hola ${contactName.split(" ")[0]}! Qué bueno que escribas. ¿De qué rubro es tu negocio y en qué zona estás operando actualmente?`;
  }
}

// GET para validación del Webhook por Meta Graph API y visor de logs
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

// POST para recepción de mensajes con Debounce Buffer (4 segundos de espera para ráfagas)
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
                "Authorization": `Bearer ${ACCESS_TOKEN}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                messaging_product: "whatsapp",
                status: "read",
                message_id: messageId
              })
            }).catch(e => console.warn("Error marcando leído:", e));

            // 2. Acumular en el Debounce Buffer por teléfono
            let item = burstBuffer.get(cleanTo);
            const now = Date.now();
            if (!item) {
              item = {
                messages: [messageText],
                contactName,
                lastArrival: now
              };
              burstBuffer.set(cleanTo, item);
            } else {
              item.messages.push(messageText);
              item.lastArrival = now;
            }

            // 3. Ventana de espera inteligente (4 segundos para captar mensajes múltiples en ráfaga)
            await new Promise(r => setTimeout(r, 4000));

            // Si llegó un mensaje más nuevo durante los 4 segundos, este hilo cede el turno
            const currentItem = burstBuffer.get(cleanTo);
            if (!currentItem || Date.now() - currentItem.lastArrival < 3800) {
              console.log(`⏳ [DEBOUNCE] Esperando que ${contactName} termine de escribir...`);
              continue;
            }

            // 4. Se consolidó la ráfaga completa: procesar todo junto
            const consolidatedBurst = currentItem.messages.join("\n");
            burstBuffer.delete(cleanTo);

            console.log(`🤖 [PROCESANDO RÁFAGA] ${contactName}: "${consolidatedBurst}"`);

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
              message: consolidatedBurst
            });

            // 5. Generar respuesta contextual corta con Gemini Flash
            const replyText = await callGeminiFlash(lead, contactName, consolidatedBurst);

            // Guardar respuesta del bot en el historial del lead
            stitchOrCreateLead({
              phone: cleanTo,
              email: extractedEmail,
              channel: "whatsapp",
              direction: "outbound",
              message: replyText
            });

            // 6. Enviar mensaje de vuelta vía Meta WhatsApp Cloud API
            const metaRes = await fetch(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${ACCESS_TOKEN}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: cleanTo,
                type: "text",
                text: {
                  preview_url: true,
                  body: replyText
                }
              })
            });

            const metaData = await metaRes.json();
            console.log(`✔ [RESPUESTA ENVIADA A ${cleanTo}]: "${replyText}" (Meta:`, metaData?.messages?.[0]?.id || "OK", ")");
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
