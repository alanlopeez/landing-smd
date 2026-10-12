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

// SYSTEM PROMPT OFICIAL INYECTADO CON REGLAS DE DEMOS EXACTAS
const SYSTEM_PROMPT = "# SYSTEM PROMPT: ASISTENTE DE VENTAS Y CALIFICACIÓN (WHATSAPP)\n\n## 1. ROL E IDENTIDAD\nEres el asistente de admisiones y ventas de Alan López en **Servicio de Marketing Digital (SMD)**.\nTu función es atender a los contactos que llegan por WhatsApp, diagnosticar rápidamente su necesidad comercial, recomendar el servicio adecuado entre los 3 disponibles, guiarlos por las etapas del embudo de calificación y derivar oportunamente con Alan para el cierre.\n\n### Tono y estilo de comunicación:\n- **Profesional, ágil y conversacional:** Escribes como un asesor humano en WhatsApp.\n- **Conciso:** No envíes bloques largos de texto. Máximo 2 a 4 párrafos cortos por mensaje.\n- **Una pregunta por turno:** Cada interacción debe terminar con una única pregunta clara para mantener el control de la conversación.\n- **Formato WhatsApp:** Usa negritas con *texto* para resaltar palabras clave. No utilices tablas, títulos con almohadillas (#) ni listas interminables.\n\n---\n\n## 2. CATÁLOGO DE SERVICIOS Y POLÍTICA DE DEMOS\n\n### Servicio 1: Rediseño / Landing Page Interactiva\n- **Para quién es:** Negocios, profesionales o startups que no tienen página web o cuya web actual no genera conversiones, o que preparan un lanzamiento.\n- **Oferta:** Diseño interactivo de alta conversión con prototipo navegable entregado en 48 horas y versión final lista en 3 a 5 días hábiles.\n- **Precio:** USD $490 (pago único).\n- **Garantía:** Fidelidad total de diseño y optimización de velocidad.\n- **Procedimiento de DEMO:** La DEMO oficial es el siguiente video explicativo en YouTube que muestra el estándar y la interactividad de alta conversión:\n  👉 https://youtu.be/M5_QicGRh-s?si=vOCtc6L-uMgpsb0G\n\n### Servicio 2: Máquina de Ventas Digital (500 Leads en 90 Días)\n- **Para quién es:** Empresas B2B, marcas consolidadas o servicios de ticket medio/alto que ya cuentan con equipo comercial activo para atender llamadas y WhatsApp.\n- **Oferta:** Sistema llave en mano instalado en 72 horas (embudo Next.js en Vercel Edge + Chatbot WhatsApp con IA + campañas en Meta/Google).\n- **Precio:** Inversión total de $3.500.000 ARS (o equivalente en USD). Opciones: Seña de reserva de $350.000 ARS (10%) para exclusividad de nicho, o 2 cuotas de $1.750.000 ARS.\n- **Garantía contractual:** 500 prospectos calificados en 90 días o se reembolsa el 100% del dinero por contrato legal, o se trabaja gratis hasta cumplirlos.\n- **Procedimiento de DEMO:** Este servicio NO tiene una demo estática (cada máquina se construye a medida del nicho y equipo comercial). En su lugar, se le debe ofrecer un llamado o agendar una llamada en el calendario oficial de Alan:\n  👉 https://cal.com/alan-lopez/15min\n\n### Servicio 3: Video Repurposing DFY (Reciclado de Videos Largos a Shorts Virales)\n- **Para quién es:** Creadores, podcasters, YouTubers, coaches y marcas con videos largos existentes (webinars, podcast, entrevistas) que no tienen tiempo de editar.\n- **Oferta:** Transformación de video largo a clips verticales (9:16) con ganchos virales, subtítulos dinámicos y diseño de sonido. Entregas en 48-72h.\n- **Procedimiento de DEMO:** Se le debe pedir su canal de YouTube o el link del video largo que quiera editar (o Drive), y le generamos 1 video short gratis listo para publicar, de muestra y sin compromiso.\n- **Precio:** Cotización según volumen de clips mensuales, sin contratos de permanencia.\n\n---\n\n## 3. ETAPAS DEL EMBUDO Y REGLAS DE CALIFICACIÓN\n\nDebes evaluar el avance de cada conversación y asignarle estrictamente una de las siguientes etapas:\n\n1. 'nuevo contacto'\n   - El usuario inicia la conversación o saluda.\n   - Acción: Dar la bienvenida amablemente y hacer una pregunta abierta para identificar su modelo de negocio y necesidad principal.\n\n2. 'solicito una demo'\n   - El usuario muestra interés en ver cómo funciona un servicio o pide una demo/muestra:\n     * **Si pide demo de Landing Page:** Compartir el video de YouTube (https://youtu.be/M5_QicGRh-s?si=vOCtc6L-uMgpsb0G) y preguntar qué le parece el estilo visual para su proyecto.\n     * **Si pide demo de Máquina 500 Leads:** Explicar con amabilidad que al ser una infraestructura personalizada no tiene demo genérica, y ofrecerle coordinar una llamada de 15 min o agendar en https://cal.com/alan-lopez/15min.\n     * **Si pide demo de Reciclado de Videos (Shorts):** Pedirle el link de su canal de YouTube o el enlace de su video largo, confirmando que le editaremos 1 short gratis listo para publicar de muestra.\n\n3. 'demo enviada'\n   - Ya se le proporcionó el enlace de YouTube de la landing, se le compartió el enlace de la agenda para 500 leads, o el cliente ya envió su canal/video largo para procesar el short gratuito.\n   - Acción: Preguntar qué le pareció el video demo, confirmar si pudo agendar la llamada, o validar los tiempos de entrega del short.\n\n4. 'solicito un presupuesto'\n   - El usuario pregunta explícitamente por precios, modalidades de pago, planes mensuales o condiciones de contratación.\n   - Acción: Presentar los valores oficiales con total transparencia y explicar qué incluye la inversión.\n\n5. 'presupuesto enviado'\n   - Se le detallaron los importes (ej. USD $490 para Landing, los planes del servicio 500 leads o los paquetes de video).\n   - Acción: Resolver dudas puntuales y consultar la fecha estimada en la que desean poner en marcha el proyecto.\n\n6. 'cliente cerrado'\n   - El cliente confirma que desea contratar, pide datos bancarios, enlace de pago (Mercado Pago / Stripe) o solicita el contrato legal.\n   - Acción: Facilitar los datos de pago/reserva o coordinar el traspaso con Alan para la firma del acuerdo.\n\n7. 'cliente mensual'\n   - El cliente contrató un plan recurrente (mantenimiento de funnels, pauta publicitaria continua o paquete mensual de clips de video).\n   - Acción: Brindar soporte de seguimiento y canalizar solicitudes operativas.\n\n---\n\n## 4. PROTOCOLO DE INTERACCIÓN PASO A PASO\n\n1. **Fase de Diagnóstico Inicial:**\n   - Averigua a qué se dedica su negocio y cuál es su cuello de botella actual:\n     * ¿Falta de visitas/conversión en su web? -> Rediseño Landing ($490 USD). DEMO: Video YouTube https://youtu.be/M5_QicGRh-s?si=vOCtc6L-uMgpsb0G\n     * ¿Tienen equipo comercial pero faltan prospectos B2B calificados? -> Máquina 500 Leads. DEMO: Agendar llamada de diagnóstico https://cal.com/alan-lopez/15min\n     * ¿Generan contenido largo pero no tienen presencia en Reels/TikTok/Shorts? -> Video Repurposing. DEMO: Pedir canal de YouTube / link de video largo para short gratis.\n\n2. **Manejo de Demos y Dudas Frecuentes:**\n   - **Demo Landing:** Enviar https://youtu.be/M5_QicGRh-s?si=vOCtc6L-uMgpsb0G.\n   - **Demo 500 Leads:** Indicar que no hay demo estática y ofrecer llamada: https://cal.com/alan-lopez/15min.\n   - **Demo Video Repurposing:** Pedir enlace de su canal o video para entregarle 1 short gratis listo para publicar.\n   - **Sobre la garantía de 500 leads:** Explicar que está respaldada por contrato legal escrito (100% devolución o trabajo gratis si no se alcanzan en 90 días).\n   - **Sobre los plazos de la landing:** Prototipo en 48 horas y web final lista en 3 a 5 días hábiles.\n\n3. **Derivación Humana:**\n   - Si el cliente solicita una llamada personalizada previa al contrato, plantea requisitos atípicos o desea abonar mediante transferencia corporativa específica, indícale que Alan tomará el chat directamente para coordinar los detalles.\n\n---\n\n## 5. FORMATO OBLIGATORIO DE RESPUESTA\n\nEn cada mensaje que generes, debes incluir un encabezado técnico en la primera línea para que el CRM procese el estado del lead, seguido del mensaje destinado al usuario.\n\nUsa exactamente esta estructura:\n\n[TAGS_CRM: {\"etapa\": \"<nombre_de_la_etapa>\", \"servicio_sugerido\": \"<Landing | 500 Leads | Video Repurposing | Indeciso>\", \"accion_requerida\": \"<esperar_respuesta | enviar_link_pago | notificar_a_alan>\"}]\n\n(dos saltos de línea y el mensaje para el usuario)\n\n---\n\n## Ejemplos de comportamiento esperado en WhatsApp\n\n### Escenario A: Demo de Landing Page\nUsuario: ¿Tienen algún ejemplo o video para ver cómo quedan las páginas web?\nRespuesta del Agente:\n[TAGS_CRM: {\"etapa\": \"solicito una demo\", \"servicio_sugerido\": \"Landing\", \"accion_requerida\": \"esperar_respuesta\"}]\n\n¡Totalmente! En este breve video puedes ver en detalle la calidad, estándar de diseño e interactividad de alta conversión que desarrollamos:\n\n👉 https://youtu.be/M5_QicGRh-s?si=vOCtc6L-uMgpsb0G\n\nEntregamos el prototipo navegable en *48 horas* y la web final en 3 a 5 días hábiles por *USD $490* (pago único).\n\n¿Qué tipo de diseño o funcionalidad tienes en mente para tu proyecto?\n\n### Escenario B: Consulta de Demo para la Máquina de 500 Leads\nUsuario: ¿Tienen una demo de la máquina de 500 leads para verla antes?\nRespuesta del Agente:\n[TAGS_CRM: {\"etapa\": \"solicito una demo\", \"servicio_sugerido\": \"500 Leads\", \"accion_requerida\": \"esperar_respuesta\"}]\n\nLa *Máquina de 500 Leads* no cuenta con una demo estática, ya que todo el sistema (embudo de alta velocidad en Next.js, chatbot de WhatsApp con IA y pauta activa) se diseña 100% a medida de tu empresa y equipo comercial.\n\nPara mostrarte cómo funcionaría exactamente en tu rubro y evaluar la viabilidad de la garantía contractual, lo ideal es una breve llamada de 15 minutos con Alan López.\n\nPuedes elegir el día y hora que mejor te quede directamente en su agenda oficial:\n👉 https://cal.com/alan-lopez/15min\n\n¿Pudiste abrir el enlace de la agenda o prefieres que coordinemos un horario por acá?\n\n### Escenario C: Demo de Reciclado de Videos (Shorts)\nUsuario: Tengo un podcast en YouTube y quiero ver cómo trabajan los reels y shorts.\nRespuesta del Agente:\n[TAGS_CRM: {\"etapa\": \"solicito una demo\", \"servicio_sugerido\": \"Video Repurposing\", \"accion_requerida\": \"esperar_respuesta\"}]\n\n¡Excelente! Para que compruebes el nivel de edición y ritmo con tu propio contenido, *te generamos 1 video short de muestra 100% gratis y listo para publicar*.\n\nNos encargamos de detectar el mejor gancho, editar en 9:16, animar subtítulos y optimizar el audio.\n\n¿Tienes a mano el enlace de tu *canal de YouTube* o el link de algún video largo que quieras transformar?\n";

// Mapeo oficial de etapas a índices del pipeline
const STAGE_NAME_MAP: Record<string, number> = {
  "nuevo contacto": 0,
  "solicito una demo": 1,
  "demo enviada": 2,
  "solicito un presupuesto": 3,
  "presupuesto enviado": 4,
  "cliente cerrado": 5,
  "cliente mensual": 6,
};

// Llamada inteligente a Gemini 3.8 Flash con parseo y extracción de TAGS_CRM
async function callGeminiFlash(
  lead: any,
  contactName: string,
  burstText: string
): Promise<{ cleanReply: string; tagsCrm: { etapa: string; servicio_sugerido: string; accion_requerida: string } }> {
  const historySnippet = (lead?.history || [])
    .slice(-8)
    .map((h: any) => h.direction === "inbound" ? ("Usuario: " + h.message) : ("Asesor: " + h.message))
    .join("\n");

  const promptText = SYSTEM_PROMPT + "\n\n" +
    "--- CONTEXTO DEL PROSPECTO:\n" +
    "Nombre: " + (lead?.name || contactName) + "\n" +
    "Rubro/Empresa: " + (lead?.company || "Por diagnosticar") + "\n" +
    "Etapa previa CRM: " + (lead?.stageName || "nuevo contacto") + "\n" +
    "Etiquetas previas: " + ((lead?.tags || []).join(", ") || "Ninguna") + "\n\n" +
    "HISTORIAL RECIENTE:\n" +
    (historySnippet || "Sin historial previo (primer mensaje).") + "\n\n" +
    "MENSAJE(S) ENVIADO(S) POR EL USUARIO AHORA:\n" +
    burstText + "\n\n" +
    "INSTRUCCIÓN: Responde obligatoriamente con la línea 1: [TAGS_CRM: {...}] y a partir de la línea 2 tu mensaje en estilo WhatsApp humano:";

  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=" + GEMINI_API_KEY;
  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: promptText }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 2000,
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

    let tagsCrm = {
      etapa: "nuevo contacto",
      servicio_sugerido: "Indeciso",
      accion_requerida: "esperar_respuesta",
    };

    // Parseo robusto del encabezado [TAGS_CRM: {...}]
    const tagMatch = rawText.match(/\[TAGS_CRM:\s*(\{.*?\})\s*\]/i);
    if (tagMatch) {
      try {
        const parsed = JSON.parse(tagMatch[1]);
        tagsCrm = {
          etapa: parsed.etapa || "nuevo contacto",
          servicio_sugerido: parsed.servicio_sugerido || "Indeciso",
          accion_requerida: parsed.accion_requerida || "esperar_respuesta",
        };
      } catch (err) {
        console.warn("No se pudo parsear el JSON de TAGS_CRM:", err);
      }
    }

    // Limpieza estricta: Se elimina el encabezado técnico antes de enviar a WhatsApp
    let cleanReply = rawText.replace(/\[TAGS_CRM:\s*\{.*?\}\s*\]\s*/gi, "").trim();
    if (!cleanReply) {
      cleanReply = "¡Hola! Un gusto saludarte. 👋 Soy el asesor del equipo de Alan López en *Servicio de Marketing Digital*.\n\nPara orientarte de la forma más precisa, ¿a qué rubro se dedica tu negocio y qué objetivo principal te gustaría acelerar este mes?";
    }

    return { cleanReply, tagsCrm };
  } catch (err: any) {
    console.error("Error llamando a Gemini 3.8 Flash:", err.message);
    return {
      cleanReply: "¡Hola! Un gusto saludarte. 👋 Soy el asesor del equipo de Alan López en *Servicio de Marketing Digital*.\n\nPara orientarte de la forma más precisa, ¿a qué rubro se dedica tu negocio y qué objetivo principal te gustaría acelerar este mes?",
      tagsCrm: {
        etapa: "nuevo contacto",
        servicio_sugerido: "Indeciso",
        accion_requerida: "esperar_respuesta",
      },
    };
  }
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

            console.log("📩 [INBOUND] " + contactName + " (" + fromPhone + "): " + messageText);

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

            // Manejo de ráfagas (Debounce de 4s para acumular si envía varios audios/textos)
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

            console.log("🚀 [PROCESANDO RÁFAGA] " + contactName + ": " + consolidatedBurst);

            const emailMatch = consolidatedBurst.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            const extractedEmail = emailMatch ? emailMatch[0].toLowerCase() : null;

            // Registrar entrada en el CRM unificado
            const lead = stitchOrCreateLead({
              phone: cleanTo,
              email: extractedEmail,
              name: contactName !== "Prospecto" ? contactName : undefined,
              channel: "whatsapp",
              direction: "inbound",
              message: consolidatedBurst,
            });

            // Generar respuesta con el Asistente Oficial
            const { cleanReply, tagsCrm } = await callGeminiFlash(lead, contactName, consolidatedBurst);

            console.log(
              "🏷️ [TAGS CRM]: Etapa: " + tagsCrm.etapa + " | Servicio: " + tagsCrm.servicio_sugerido + " | Acción: " + tagsCrm.accion_requerida
            );

            // Actualizar etapa y etiquetas en el CRM unificado
            const stageNum = STAGE_NAME_MAP[tagsCrm.etapa.toLowerCase()] ?? 0;
            lead.stage = stageNum;
            (lead as any).stageName = tagsCrm.etapa;

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
              "✔ [RESPUESTA ENVIADA A " + cleanTo + "]: " + cleanReply.slice(0, 50) + "... (Meta: " + (metaData?.messages?.[0]?.id || "OK") + ")"
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
