import { NextRequest, NextResponse } from "next/server";
import { stitchOrCreateLead, UNIFIED_LEADS } from "@/lib/leadsStore";
import { syncLeadWithChatwoot } from "@/lib/chatwootClient";
import { findOrCreateContactByPhone, logWhatsAppEvent, getContactRecentMessages } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "multiagentes_smd_secret_token_2026";
const ACCESS_TOKEN =
  process.env.WHATSAPP_PERMANENT_ACCESS_TOKEN ||
  "EAAT7c4ZB9HGQBSprZCS2af1JUoYpuyVpuFP3WK8DP0HoUvvsPRrnZAnRGoI39DjFarudwdPw40HdtKN37GeWmP12WWxVzUj2jLNJ1a88PVonoBrrZC2watfrocWosyQR1Nul747FXsqNcdDcFW5cizo3ZCtvPXZBnctwpcrW23QFvz25DA3g05h35fQ4E0leeTIwZDZD";
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "1254834877724483";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

// Búfer de ráfagas en memoria para esperar ráfagas de mensajes (Debounce Buffer de 4s)
interface BurstItem {
  messages: string[];
  contactName: string;
  lastArrival: number;
}
const burstBuffer = new Map<string, BurstItem>();

// SYSTEM PROMPT ULTRA CONCRETO Y DIRECTO: ASISTENTE COMERCIAL Y ESTRATÉGICO EN WHATSAPP
const SYSTEM_PROMPT = `# SYSTEM PROMPT: ASISTENTE COMERCIAL Y ESTRATÉGICO (WHATSAPP)

## 1. ROL Y MISIÓN
Eres el Asesor Estratégico del equipo de **Alan López** en **Servicio de Marketing Digital (SMD)** (www.serviciodemarketingdigital.com).
Tu misión es diagnosticar el negocio del prospecto (Punto A), validar su objetivo de ventas (Punto B) y agendar una videollamada de 15 min con Alan (https://cal.com/llamadas/15min).

## 2. NUESTROS 3 PILARES DE SERVICIO (ALAN LÓPEZ / SMD)
1. **Páginas de Aterrizaje:** Embudos rápidos para celular con catálogo y botón directo a WhatsApp para que compren sin vueltas.
2. **Tráfico Web:** Anuncios directos en Instagram y Google hacia personas con intención de compra.
3. **Gestión de Base de Datos:** Mensajes automáticos de WhatsApp a clientes anteriores para recompra a $0 costo.

## 3. REGLAS ESTRICTAS DE RESPUESTA EN WHATSAPP (MANDATORIAS)
- **CERO JUSTIFICACIONES TEÓRICAS:** NUNCA expliques psicología de ventas ni des lecciones académicas ("al ser un producto de ticket alto...", "las webs tradicionales no convierten porque..."). Ve DIRECTO al grano.
- **ULTRA CONCRETO Y BREVE:** Máximo 2 párrafos cortos (entre 30 y 55 palabras en total).
- **RESPUESTAS CERTERAS Y COMPLETAS:** Responde exactamente a lo que plantea el usuario y asegúrate de que cada oración termine con su punto o signo de interrogación. Jamás dejes oraciones abiertas ni a medio terminar.
- **OBLIGATORIO 'POR EJEMPLO':** Si sugieres una acción o anuncio, pon un ejemplo concreto en una sola línea usando "Por ejemplo".
- **UNA SOLA PREGUNTA O CIERRE:**
  * Si te falta saber cómo vende hoy (Punto A), termina con una sola pregunta clara.
  * Si ya te dijo su rubro y meta y canal, invítalo directamente a la videollamada con Alan: https://cal.com/llamadas/15min.
- **ANTI-BUCLE EN DESPEDIDAS:** Si el usuario agradece o se despide ("gracias", "chau"), responde solo con una frase de cierre cordial y no hagas preguntas.

## 4. FRONTERAS OPERATIVAS (PREVENCIÓN DE ALUCINACIONES)
- NUNCA digas "ya te agendé" ni "te anoté". Tú NO reservas turnos directamente. Siempre derívalo al enlace oficial: https://cal.com/llamadas/15min.

## 5. FORMATO OBLIGATORIO DE SALIDA
Línea 1: [TAGS_CRM: {"etapa": "<nuevo contacto | diagnostico_punto_a | objetivo_punto_b | llamada_agendada | conversacion_cerrada>", "servicio_sugerido": "<Trafico Web | Landing Pages | Base de Datos | Diagnostico_General>", "accion_requerida": "<esperar_respuesta | enviar_agenda | derivar_a_alan>", "business_name": "<Nombre del negocio o rubro>"}]
Línea 2: (en blanco)
Línea 3 en adelante: Tu mensaje de WhatsApp (máximo 2 párrafos cortos, respuesta certera, completa y sin rodeos teóricos).`;

// Mapeo oficial de etapas a índices del pipeline
const STAGE_NAME_MAP: Record<string, number> = {
  "nuevo contacto": 0,
  "diagnostico_punto_a": 1,
  "objetivo_punto_b": 2,
  "estrategias_prescritas": 3,
  "solicito una demo": 4,
  "demo enviada": 5,
  "llamada_agendada": 6,
  "cliente cerrado": 7,
  "conversacion cerrada": 8,
};

// LLAMADA RESILIENTE CON CASCADA MULTI-MODELO (Gemini 3.8 Flash -> Gemini Flash Latest -> OpenAI GPT-4o-mini)
async function callLLMWithFallback(
  lead: any,
  contactName: string,
  burstText: string
): Promise<{ cleanReply: string; tagsCrm: { etapa: string; servicio_sugerido: string; accion_requerida: string; business_name?: string } }> {
  const normalizedInput = burstText.trim().toLowerCase();

  // 1. GUARDRAIL PREVIO: Despedida y fin de conversación (Anti-bucle infinito)
  const isPureFarewell =
    /^(gracias|muchas\s+gracias|mil\s+gracias|chau|chau\s+chau|hasta\s+luego|nos\s+vemos|listo\s+gracias|perfecto\s+gracias|ok\s+gracias|genial\s+chau|genial\s+gracias|saludos|un\s+abrazo|abrazo|👍|🙏|👋)[\.\!\s]*$/i.test(
      normalizedInput
    );

  if (isPureFarewell) {
    const firstName = contactName && contactName !== "Prospecto" ? contactName.split(" ")[0] : "";
    const greeting = firstName ? `¡Un placer haberte ayudado, ${firstName}!` : "¡Un placer haberte ayudado!";
    return {
      cleanReply: `${greeting} Que tengas un excelente día y quedo a tu entera disposición si en algún momento deseas retomar.`,
      tagsCrm: {
        etapa: "conversacion cerrada",
        servicio_sugerido: "Diagnostico_General",
        accion_requerida: "esperar_respuesta",
      },
    };
  }

  // 2. GUARDRAIL DE LÍMITES OPERATIVOS: Solicitud de agendamiento directo por texto
  const isDirectScheduleAttempt =
    /(agendame|anotame|reservame|poneme\s+la\s+reuni[oó]n|agendame\s+para)/i.test(normalizedInput) ||
    (/(lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bado|mañana|hoy)/i.test(normalizedInput) &&
      /(a\s+las\s+\d{1,2}|hs|horas)/i.test(normalizedInput));

  if (isDirectScheduleAttempt) {
    const firstName = contactName && contactName !== "Prospecto" ? contactName.split(" ")[0] : "";
    const namePrefix = firstName ? `¡Entendido, ${firstName}! ` : "¡Entendido! ";
    return {
      cleanReply: `${namePrefix}Para garantizar que ese horario esté libre y que el sistema te genere automáticamente el enlace privado de Google Meet, por favor selecciónalo directamente en la agenda oficial de Alan López:\n👉 https://cal.com/llamadas/15min\n\nAllí elegís el día en menos de 1 minuto y te llega la confirmación por correo de inmediato. ¡Avisame apenas lo reserves para preparar tu diagnóstico!`,
      tagsCrm: {
        etapa: "llamada_agendada",
        servicio_sugerido: "Diagnostico_General",
        accion_requerida: "esperar_respuesta",
      },
    };
  }

  // Obtener historial reciente de Supabase si está disponible
  let supabaseHistoryText = "";
  if (lead?.contactId) {
    try {
      const recent = await getContactRecentMessages(lead.contactId, 6);
      if (recent.length > 0) {
        supabaseHistoryText = recent
          .map((r) => (r.role === "user" ? "Usuario: " + r.content : "Asesor: " + r.content))
          .join("\n");
      }
    } catch (e) {
      console.warn("Error leyendo historial de Supabase:", e);
    }
  }

  const historySnippet =
    supabaseHistoryText ||
    (lead?.history || [])
      .slice(-8)
      .map((h: any) => (h.direction === "inbound" ? "Usuario: " + h.message : "Asesor: " + h.message))
      .join("\n");

  const promptText = `${SYSTEM_PROMPT}

--- CONTEXTO DEL PROSPECTO:
Nombre: ${lead?.name || contactName}
Rubro/Empresa: ${lead?.company || "Por identificar"}
Etapa previa CRM: ${lead?.stageName || "nuevo contacto"}
Etiquetas previas: ${(lead?.tags || []).join(", ") || "Ninguna"}

HISTORIAL RECIENTE:
${historySnippet || "Sin historial previo (primer mensaje del usuario)."}

MENSAJE(S) ENVIADO(S) POR EL USUARIO AHORA:
${burstText}

INSTRUCCIÓN: Responde obligatoriamente en la línea 1 con [TAGS_CRM: {...}] y a partir de la línea 2 tu respuesta en estilo WhatsApp humano, ultra concreto, directo, certero, sin justificaciones teóricas y con idea 100% cerrada:`;

  // CASCADA DE MODELOS: 1) Gemini 3.8 Flash (Thinking 0, Ultra Rápido) -> 2) Gemini Flash Latest -> 3) OpenAI GPT-4o-mini
  let rawText = "";

  // INTENTO 1: Gemini 3.8 Flash (modo directo sin gastar tokens en razonamiento interno)
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_API_KEY}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: promptText }] }],
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.3,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    });
    const data: any = await res.json();
    rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
  } catch (err1: any) {
    console.warn("Fallo intento 1 (gemini-3.8-flash):", err1.message);
  }

  // INTENTO 2: Gemini Flash Latest (si falló el 1)
  if (!rawText) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: promptText }] }],
          generationConfig: { maxOutputTokens: 2048, temperature: 0.3 },
        }),
      });
      const data: any = await res.json();
      rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    } catch (err2: any) {
      console.warn("Fallo intento 2 (gemini-flash-latest):", err2.message);
    }
  }

  // INTENTO 3: OpenAI GPT-4o-mini (Resiliencia total)
  if (!rawText && OPENAI_API_KEY) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: promptText },
          ],
          temperature: 0.3,
          max_tokens: 1500,
        }),
      });
      const data: any = await res.json();
      rawText = data?.choices?.[0]?.message?.content?.trim() || "";
    } catch (err3: any) {
      console.warn("Fallo intento 3 (OpenAI gpt-4o-mini):", err3.message);
    }
  }

  let tagsCrm = {
    etapa: "nuevo contacto",
    servicio_sugerido: "Diagnostico_General",
    accion_requerida: "esperar_respuesta",
    business_name: "Por identificar",
  };

  // Parseo del encabezado [TAGS_CRM: {...}]
  const tagMatch = rawText.match(/\[TAGS_CRM:\s*(\{.*?\})\s*\]/i);
  if (tagMatch) {
    try {
      const parsed = JSON.parse(tagMatch[1]);
      tagsCrm = {
        etapa: parsed.etapa || "nuevo contacto",
        servicio_sugerido: parsed.servicio_sugerido || "Diagnostico_General",
        accion_requerida: parsed.accion_requerida || "esperar_respuesta",
        business_name: parsed.business_name || "Por identificar",
      };
    } catch (err) {
      console.warn("No se pudo parsear TAGS_CRM JSON:", err);
    }
  }

  let cleanReply = rawText.replace(/\[TAGS_CRM:\s*\{.*?\}\s*\]\s*/gi, "").trim();

  // Guardrail de seguridad: Garantizar que NUNCA quede una oración a medio camino o truncada
  if (cleanReply) {
    const trimmed = cleanReply.trim();
    if (!/[.?!]$/.test(trimmed)) {
      const lastPunctuation = Math.max(
        trimmed.lastIndexOf("."),
        trimmed.lastIndexOf("?"),
        trimmed.lastIndexOf("!")
      );
      if (lastPunctuation > 25) {
        cleanReply = trimmed.slice(0, lastPunctuation + 1).trim();
      } else {
        cleanReply = trimmed + ".";
      }
    }
  }

  // Guardrail de salida: Prevenir alucinación de agendamiento
  if (
    /(ya\s+te\s+agend[eé]|te\s+anot[eé]|te\s+reserv[eé]|qued[oó]\s+confirmad[oa]\s+(la\s+reuni[oó]n|el\s+turno))/i.test(
      cleanReply
    ) &&
    !cleanReply.includes("cal.com/llamadas/15min")
  ) {
    cleanReply = `Para garantizar la disponibilidad real de Alan y que el sistema genere automáticamente el enlace privado de Google Meet, por favor elegí tu horario directamente en su agenda oficial:\n👉 https://cal.com/llamadas/15min\n\nAllí lo confirmás en 30 segundos y te llega la confirmación por correo al instante.`;
  }

  // Fallback inteligente contextual si todos los LLM fallaron (NUNCA repetir el saludo inicial a ciegas)
  if (!cleanReply) {
    const isFirstTime = !historySnippet || historySnippet.length < 20;
    if (isFirstTime) {
      cleanReply = `¡Hola! Un gusto saludarte. 👋 Soy el asesor estratégico del equipo de Alan López en *Servicio de Marketing Digital*.\n\nAyudamos a negocios a escalar sus ventas trabajando en sus *Páginas de aterrizaje*, su *Tráfico web* y la *Gestión de su base de clientes*.\n\nPara orientarte con exactitud, ¿a qué rubro se dedica tu negocio y cómo te llegan tus clientes hoy en día?`;
    } else {
      cleanReply = `¡Excelente! Para darte un diagnóstico certero de tu negocio (el Punto A) y armarte de 1 a 3 estrategias para alcanzar tu meta de ventas (Punto B), lo más efectivo es agendar una breve videollamada de 15 minutos directamente con Alan López:\n\n👉 https://cal.com/llamadas/15min\n\nEn esa sesión Alan analiza tus números en vivo y te muestra cómo optimizar tu embudo. ¿Pudiste abrir el enlace de la agenda?`;
    }
  }

  return { cleanReply, tagsCrm };
}

// 1. Verificación del Webhook por Meta
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

// 2. Recepción de mensajes en vivo desde Meta WhatsApp Cloud API
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

            console.log("📩 [INBOUND WHATSAPP] " + contactName + " (" + fromPhone + "): " + messageText);

            const cleanTo = fromPhone.replace(/\D/g, "");

            // Marcar mensaje como leído en WhatsApp
            const readUrl = "https://graph.facebook.com/v21.0/" + PHONE_NUMBER_ID + "/messages";
            fetch(readUrl, {
              method: "POST",
              headers: {
                Authorization: "Bearer " + ACCESS_TOKEN,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                messaging_product: "whatsapp",
                status: "read",
                message_id: messageId,
              }),
            }).catch((e) => console.warn("Error marcando leído:", e));

            // Manejo de ráfagas (Debounce de 4s para acumular textos múltiples o audios)
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

            // Esperar 4 segundos para consolidar ráfaga
            await new Promise((r) => setTimeout(r, 4000));

            const currentItem = burstBuffer.get(cleanTo);
            if (!currentItem || Date.now() - currentItem.lastArrival < 3800) {
              console.log("⏳ [DEBOUNCE] Esperando que " + contactName + " termine de escribir...");
              continue;
            }

            const consolidatedBurst = currentItem.messages.join("\n");
            burstBuffer.delete(cleanTo);

            console.log("🚀 [PROCESANDO WHATSAPP] " + contactName + ": " + consolidatedBurst);

            const emailMatch = consolidatedBurst.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            const extractedEmail = emailMatch ? emailMatch[0].toLowerCase() : null;

            // 1. Persistir contacto y mensaje entrante en Supabase
            let contactId: string | null = null;
            try {
              contactId = await findOrCreateContactByPhone(cleanTo, contactName);
              if (contactId) {
                await logWhatsAppEvent(contactId, consolidatedBurst, "inbound", msg);
              }
            } catch (errDbIn) {
              console.warn("[Supabase Inbound Log Error]:", errDbIn);
            }

            // Registrar entrada en el CRM unificado
            const lead = stitchOrCreateLead({
              phone: cleanTo,
              email: extractedEmail,
              name: contactName !== "Prospecto" ? contactName : undefined,
              channel: "whatsapp",
              direction: "inbound",
              message: consolidatedBurst,
            });
            if (contactId) {
              (lead as any).contactId = contactId;
            }

            // Generar respuesta con la cascada resiliente de IA
            const { cleanReply, tagsCrm } = await callLLMWithFallback(lead, contactName, consolidatedBurst);

            console.log(
              "🏷️ [TAGS CRM]: Etapa: " +
                tagsCrm.etapa +
                " | Servicio: " +
                tagsCrm.servicio_sugerido +
                " | Acción: " +
                tagsCrm.accion_requerida +
                " | Negocio: " +
                (tagsCrm.business_name || "N/A")
            );

            // Actualizar etapa y etiquetas en el CRM
            const stageNum = STAGE_NAME_MAP[tagsCrm.etapa.toLowerCase()] ?? 0;
            lead.stage = stageNum;
            (lead as any).stageName = tagsCrm.etapa;
            if (tagsCrm.business_name && tagsCrm.business_name !== "Por identificar") {
              lead.company = tagsCrm.business_name;
            }

            const newTags = [
              "etapa: " + tagsCrm.etapa,
              "servicio: " + tagsCrm.servicio_sugerido,
              "accion: " + tagsCrm.accion_requerida,
            ];
            lead.tags = Array.from(new Set([...(lead.tags || []), ...newTags]));

            // Registrar mensaje saliente en el historial del lead
            stitchOrCreateLead({
              phone: cleanTo,
              email: extractedEmail,
              channel: "whatsapp",
              direction: "outbound",
              message: cleanReply,
            });

            // Sincronizar etiquetas y estado con Chatwoot Cloud
            syncLeadWithChatwoot({
              phone: cleanTo,
              name: contactName,
              email: extractedEmail,
              inboundMessage: consolidatedBurst,
              outboundMessage: cleanReply,
              labels: lead.tags,
              stage: stageNum,
            }).catch((err) => console.warn("[Chatwoot Sync Error]:", err));

            // Enviar respuesta a WhatsApp a través de Meta Graph API
            const metaRes = await fetch("https://graph.facebook.com/v21.0/" + PHONE_NUMBER_ID + "/messages", {
              method: "POST",
              headers: {
                Authorization: "Bearer " + ACCESS_TOKEN,
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
              "✔ [WHATSAPP ENVIADO A " +
                cleanTo +
                "]: " +
                cleanReply.slice(0, 60) +
                "... (Meta ID: " +
                (metaData?.messages?.[0]?.id || "OK") +
                ")"
            );

            // 2. Persistir mensaje saliente en Supabase
            if (contactId) {
              try {
                await logWhatsAppEvent(contactId, cleanReply, "outbound", metaData);
              } catch (errDbOut) {
                console.warn("[Supabase Outbound Log Error]:", errDbOut);
              }
            }
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
