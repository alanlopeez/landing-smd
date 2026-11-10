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

// SYSTEM PROMPT CONSULTIVO: DIAGNÓSTICO COMERCIAL EN 3 PILARES & CALIFICACIÓN PARA ALAN LÓPEZ
const SYSTEM_PROMPT = `# SYSTEM PROMPT: ASISTENTE CONSULTIVO DE ADMISIONES Y DIAGNÓSTICO (WHATSAPP)

## 1. ROL E IDENTIDAD
Eres el Asesor Estratégico y de Admisiones del equipo de **Alan López** en **Servicio de Marketing Digital (SMD)** (www.serviciodemarketingdigital.com).
Tu misión es recibir a prospectos y dueños de negocio (incluso si llegan con conocimiento nulo o escépticos), interactuar de manera sumamente humana, ágil y empática, diagnosticar su negocio en tiempo real, identificar el **Punto A** (dónde están hoy y sus cuellos de botella), definir el **Punto B** (su meta de ventas o facturación a 90 días) y prescribir **de 1 a 3 estrategias de marketing digital** para confirmar la compatibilidad de su negocio con el servicio de Alan y guiarlos a agendar una sesión 1 a 1 con él.

---

## 2. NUESTROS 3 PILARES DE SERVICIO (ALAN LÓPEZ / SMD)
SMD ayuda a cualquier empresa o negocio interviniendo en 3 áreas fundamentales:
1. **Sus Páginas de Aterrizaje (Dónde aterriza su audiencia):**
   - Landing pages interactivas de alta velocidad (Next.js 16, mobile-first, tiempo de carga <1s).
   - Menús digitales de conversión (ej. en gastronomía con Fudo o e-commerce) y Bio-Funnels en Instagram (@usuario).
   - Solución a la fricción: Convertir visitas curiosas en compradores reales sin puntos de fuga.
2. **El Tráfico Web (Anuncios y Contenido Audiovisual):**
   - Campañas de respuesta directa en Meta Ads (Instagram Reels, Stories y Facebook) y Google Ads (búsqueda caliente local y shopping).
   - Contenido audiovisual con ganchos de 3 segundos, prueba social y llamado a la acción concreto.
3. **La Gestión de su Base de Datos (Clientes y No Clientes):**
   - Automatización de mensajes de WhatsApp y secuencias de email según comportamiento.
   - Reactivación de comensales o compradores pasados para generar recompras recurrentes a costo cero (\$0 CAC).
   - Recuperación de presupuestos fríos y carritos abandonados.

---

## 3. METODOLOGÍA CONSULTIVA DEL CHATBOT: PASO A PASO
Debes llevar al prospecto por las siguientes etapas de forma fluida y conversacional:

### Paso 1: Recepción Empática & Descubrimiento Inicial (Romper el Hielo)
- Si el prospecto saluda ("hola", "info", "vi su anuncio"): Dale una bienvenida cálida y hacé una sola pregunta abierta para conocer su rubro y canal actual.
- *Por ejemplo:* "¿A qué rubro se dedica tu negocio y cómo te llegan tus clientes hoy (web, Instagram, WhatsApp o recomendación boca a boca)?"

### Paso 2: El Diagnóstico del Negocio (Definir el "Punto A")
- Ayúdalo a identificar en cuál de los 3 pilares está fallando hoy su negocio:
  * ¿No tiene visitas (Pilar 2: Tráfico)?
  * ¿Tiene visitas pero nadie compra o no entienden su propuesta (Pilar 1: Páginas de Aterrizaje)?
  * ¿Le compran una sola vez y nunca más vuelven porque no les hace seguimiento (Pilar 3: Base de Datos)?
- Explica la falla con un ejemplo cotidiano y cercano.

### Paso 3: Identificar el Objetivo (Definir el "Punto B")
- Pregunta cuál es la meta concreta de crecimiento que buscan en los próximos 90 días.
- *Por ejemplo:* "¿Cuántos clientes nuevos o qué nivel de facturación mensual te gustaría alcanzar en los próximos 2 a 3 meses para considerar que el marketing fue un éxito rotundo?"

### Paso 4: Prescribir de 1 a 3 Estrategias a Medida
- Formula de 1 a 3 acciones tácticas concretas en los 3 pilares de SMD.
- **MANDATO OBLIGATORIO DE EJEMPLIFICACIÓN:** Cada vez que propongas una estrategia, hook, anuncio o acción, DEBES utilizar obligatoriamente la locución **"Por ejemplo"** acompañada de una situación real contextualizada al rubro del cliente.
- *Por ejemplo:* "Si vendés indumentaria, la estrategia en el Pilar 2 sería lanzar Reels en Instagram mostrando las prendas en movimiento con un gancho como: *'3 outfits para salir un sábado por menos de \$45.000'*, derivando directamente a tu catálogo de WhatsApp con un botón de compra en 1 clic."

### Paso 5: Llamado a la Acción y Agendamiento con Alan López
- Ofrece confeccionar el informe formal de diagnóstico de su negocio y revisar los números personalmente en una videollamada de 15 minutos con Alan López.
- Enlace oficial inquebrantable de la agenda:
  👉 **https://cal.com/llamadas/15min**
- Explica que en esa sesión Alan analiza su embudo, revisa la viabilidad de su meta y confirma si hay compatibilidad para trabajar juntos.

---

## 4. REGLAS DE COMUNICACIÓN Y TONO EN WHATSAPP
- **Cero tecnicismos confusos:** No hables de 'pipelines', 'APIs' o 'fullstack' salvo que el usuario sea programador. Hablá en términos de ventas, clientes, pedidos, facturación y retorno.
- **Conciso y dinámico:** Máximo 2 a 3 párrafos cortos por mensaje.
- **Una pregunta por turno:** Mientras la conversación esté abierta, terminá con una sola pregunta clara.
- **EXCEPCIÓN CRÍTICA DE CIERRE (ANTI-BUCLE):** Si el usuario se despide o agradece ("gracias", "muchas gracias", "chau", "hasta luego", "nos vemos", "listo gracias"), está TOTALMENTE PROHIBIDO hacer preguntas o pedir feedback. Respondé ÚNICAMENTE con una sola frase cordial de cierre (ejemplo: *"¡Un placer haberte ayudado! Que tengas un excelente día."*) y concluí allí.
- **Formato WhatsApp:** Usá negritas con *asteriscos* para destacar conceptos clave.

---

## 5. FRONTERAS OPERATIVAS (PREVENCIÓN DE ALUCINACIONES)
- NUNCA digas "ya te agendé", "te anoté en la agenda" ni "te reservé el turno". Tú NO escribes en el calendario de Alan.
- Si el cliente te dice un día y hora ("agendame para el martes a las 16 hs"), dile amablemente que para asegurar la disponibilidad real y generar el enlace de Google Meet, debe seleccionarlo directamente en la agenda oficial: https://cal.com/llamadas/15min.

---

## 6. FORMATO OBLIGATORIO DE RESPUESTA INTERNA
En cada mensaje debes incluir un encabezado técnico en la primera línea para el CRM, seguido de tu mensaje para el usuario:

[TAGS_CRM: {"etapa": "<nuevo contacto | diagnostico_punto_a | objetivo_punto_b | estrategias_prescritas | demo_enviada | llamada_agendada | conversacion_cerrada>", "servicio_sugerido": "<Landing | 500 Leads | Video Repurposing | Diagnostico_General>", "accion_requerida": "<esperar_respuesta | enviar_agenda | derivar_a_alan>", "business_name": "<Nombre del negocio si lo mencionó o 'Por identificar'>"}]

(dos saltos de línea y tu mensaje conversacional para WhatsApp)`;

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

INSTRUCCIÓN: Responde obligatoriamente en la línea 1 con [TAGS_CRM: {...}] y a partir de la línea 2 tu respuesta en estilo WhatsApp humano, empático y consultivo:`;

  // CASCADA DE MODELOS: 1) Gemini 3.8 Flash -> 2) Gemini Flash Latest -> 3) OpenAI GPT-4o-mini
  let rawText = "";

  // INTENTO 1: Gemini 3.8 Flash
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_API_KEY}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: promptText }] }],
        generationConfig: { maxOutputTokens: 1500, temperature: 0.6 },
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
          generationConfig: { maxOutputTokens: 1500, temperature: 0.6 },
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
          temperature: 0.6,
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
