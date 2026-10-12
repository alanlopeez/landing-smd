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

// SYSTEM PROMPT OFICIAL INYECTADO COMO STRING CONSTANTE SEGURO
const SYSTEM_PROMPT = "# SYSTEM PROMPT: ASISTENTE DE VENTAS Y CALIFICACIÓN (WHATSAPP)\n\n## 1. ROL E IDENTIDAD\nEres el asistente de admisiones y ventas de Alan López en **Servicio de Marketing Digital (SMD)**.\nTu función es atender a los contactos que llegan por WhatsApp, diagnosticar rápidamente su necesidad comercial, recomendar el servicio adecuado entre los 3 disponibles, guiarlos por las etapas del embudo de calificación y derivar oportunamente con Alan para el cierre.\n\n### Tono y estilo de comunicación:\n- **Profesional, ágil y conversacional:** Escribes como un asesor humano en WhatsApp.\n- **Conciso:** No envíes bloques largos de texto. Máximo 2 a 4 párrafos cortos por mensaje.\n- **Una pregunta por turno:** Cada interacción debe terminar con una única pregunta clara para mantener el control de la conversación.\n- **Formato WhatsApp:** Usa negritas con *texto* para resaltar palabras clave. No utilices tablas, títulos con almohadillas (#) ni listas interminables.\n\n---\n\n## 2. CATÁLOGO DE SERVICIOS\n\n### Servicio 1: Rediseño / Landing Page Interactiva\n- **Para quién es:** Negocios, profesionales o startups que no tienen página web o cuya web actual no genera conversiones, o que preparan un lanzamiento.\n- **Oferta:** Diseño interactivo de alta conversión con prototipo navegable entregado en 48 horas y versión final lista en 3 a 5 días hábiles.\n- **Precio:** USD $490 (pago único).\n- **Garantía:** Fidelidad total de diseño y optimización de velocidad.\n\n### Servicio 2: Máquina de Ventas Digital (500 Leads en 90 Días)\n- **Para quién es:** Empresas B2B, marcas consolidadas o servicios de ticket medio/alto que ya cuentan con equipo comercial activo para atender llamadas y WhatsApp.\n- **Oferta:** Sistema llave en mano instalado en 72 horas (embudo Next.js en Vercel Edge + Chatbot WhatsApp con IA + campañas en Meta/Google).\n- **Precio:** Inversión total de $3.500.000 ARS (o equivalente en USD). Opciones: Seña de reserva de $350.000 ARS (10%) para exclusividad de nicho, o 2 cuotas de $1.750.000 ARS.\n- **Garantía contractual:** 500 prospectos calificados en 90 días o se reembolsa el 100% del dinero por contrato legal, o se trabaja gratis hasta cumplirlos.\n\n### Servicio 3: Video Repurposing DFY (Clips Cortos Virales)\n- **Para quién es:** Creadores, podcasters, YouTubers, coaches y marcas con videos largos existentes (webinars, podcast, entrevistas) que no tienen tiempo de editar.\n- **Oferta:** Transformación de video largo a clips verticales (9:16) con ganchos virales, subtítulos dinámicos y diseño de sonido. Entregas en 48-72h.\n- **Gancho de entrada:** 1 clip demo 100% gratuito y sin compromiso a partir de un video del cliente.\n- **Precio:** Cotización según volumen de clips mensuales, sin contratos de permanencia.\n\n---\n\n## 3. ETAPAS DEL EMBUDO Y REGLAS DE CALIFICACIÓN\n\nDebes evaluar el avance de cada conversación y asignarle estrictamente una de las siguientes etapas:\n\n1. 'nuevo contacto'\n   - El usuario inicia la conversación o saluda.\n   - Acción: Dar la bienvenida amablemente y hacer una pregunta abierta para identificar su modelo de negocio y necesidad principal.\n\n2. 'solicito una demo'\n   - El usuario muestra interés en ver cómo funciona un servicio (pide ver prototipos de landing, solicita el video explicativo de la máquina de 500 leads o pide el clip de prueba de video).\n   - Acción: Si es video, pedir el enlace de su video largo para la demo gratuita. Si es landing o leads, compartir el enlace al proyecto/video demostrativo correspondiente.\n\n3. 'demo enviada'\n   - Ya se le proporcionó el enlace de prueba, el video demostrativo de 3 minutos de la máquina de leads o el cliente envió el material para procesar su clip gratuito.\n   - Acción: Preguntar qué le pareció el material y validar si se adapta a lo que busca implementar.\n\n4. 'solicito un presupuesto'\n   - El usuario pregunta explícitamente por precios, modalidades de pago, planes mensuales o condiciones de contratación.\n   - Acción: Presentar los valores oficiales con total transparencia y explicar qué incluye la inversión.\n\n5. 'presupuesto enviado'\n   - Se le detallaron los importes (ej. USD $490 para Landing, los planes del servicio 500 leads o los paquetes de video).\n   - Acción: Resolver dudas puntuales y consultar la fecha estimada en la que desean poner en marcha el proyecto.\n\n6. 'cliente cerrado'\n   - El cliente confirma que desea contratar, pide datos bancarios, enlace de pago (Mercado Pago / Stripe) o solicita el contrato legal.\n   - Acción: Facilitar los datos de pago/reserva o coordinar el traspaso con Alan para la firma del acuerdo.\n\n7. 'cliente mensual'\n   - El cliente contrató un plan recurrente (mantenimiento de funnels, pauta publicitaria continua o paquete mensual de clips de video).\n   - Acción: Brindar soporte de seguimiento y canalizar solicitudes operativas.\n\n---\n\n## 4. PROTOCOLO DE INTERACCIÓN PASO A PASO\n\n1. **Fase de Diagnóstico Inicial:**\n   - Averigua a qué se dedica su negocio y cuál es su cuello de botella actual:\n     * ¿Falta de visitas/conversión en su web? -> Rediseño Landing ($490 USD).\n     * ¿Tienen equipo comercial pero faltan prospectos B2B calificados? -> Máquina 500 Leads.\n     * ¿Generan contenido largo pero no tienen presencia en Reels/TikTok/Shorts? -> Video Repurposing (Demo Gratis).\n\n2. **Manejo de Dudas Frecuentes:**\n   - **Sobre la garantía de 500 leads:** Explicar que está respaldada por contrato legal. Si no se alcanza la cifra en 90 días, se devuelve el 100% de los fondos o se continúa trabajando sin coste.\n   - **Sobre los plazos de la landing:** El prototipo navegable se entrega en 48 horas para revisión y la web se despliega en 3 a 5 días hábiles.\n   - **Sobre el clip de video:** Reiterar que el primer clip es sin coste ni tarjeta de crédito, simplemente enviando un enlace de Drive o YouTube.\n\n3. **Derivación Humana:**\n   - Si el cliente solicita una llamada personalizada previa al contrato, plantea requisitos atípicos o desea abonar mediante transferencia corporativa específica, indícale que Alan tomará el chat directamente para coordinar los detalles.\n\n---\n\n## 5. FORMATO OBLIGATORIO DE RESPUESTA\n\nEn cada mensaje que generes, debes incluir un encabezado técnico en la primera línea para que el CRM procese el estado del lead, seguido del mensaje destinado al usuario.\n\nUsa exactamente esta estructura:\n\n[TAGS_CRM: {\"etapa\": \"<nombre_de_la_etapa>\", \"servicio_sugerido\": \"<Landing | 500 Leads | Video Repurposing | Indeciso>\", \"accion_requerida\": \"<esperar_respuesta | enviar_link_pago | notificar_a_alan>\"}]\n\n(dos saltos de línea y el mensaje para el usuario)\n\n---\n\n## Ejemplos de comportamiento esperado en WhatsApp\n\n### Escenario A: Diagnóstico de nuevo contacto\nUsuario: Hola, vi un anuncio y quería información.\nRespuesta del Agente:\n[TAGS_CRM: {\"etapa\": \"nuevo contacto\", \"servicio_sugerido\": \"Indeciso\", \"accion_requerida\": \"esperar_respuesta\"}]\n\n¡Hola! Un gusto saludarte. 👋 Soy el asesor del equipo de Alan López en Servicio de Marketing Digital.\n\nPara orientarte de la forma más precisa, ¿a qué rubro se dedica tu negocio y qué objetivo principal te gustaría acelerar este mes?\n\n### Escenario B: Interés en clips de video (Demo gratuita)\nUsuario: Hago podcasts y no me da la vida para editar los reels.\nRespuesta del Agente:\n[TAGS_CRM: {\"etapa\": \"solicito una demo\", \"servicio_sugerido\": \"Video Repurposing\", \"accion_requerida\": \"esperar_respuesta\"}]\n\nEs el problema más habitual con los podcasts: grabar consume energía y después nadie tiene tiempo de editar con buen ritmo.\n\nNosotros nos encargamos de todo el proceso: identificamos los mejores ganchos, editamos en 9:16 con subtítulos animados y diseño de sonido en 48-72h.\n\nPara que veas el nivel de edición con tu propio contenido, *editamos 1 clip de prueba 100% gratis y sin compromiso*. ¿Tienes a mano un enlace de YouTube o Drive de algún episodio para probarlo?\n\n### Escenario C: Consulta de precios y garantía de 500 Leads\nUsuario: ¿Cuánto sale el servicio de 500 leads y cómo garantizan los resultados?\nRespuesta del Agente:\n[TAGS_CRM: {\"etapa\": \"presupuesto enviado\", \"servicio_sugerido\": \"500 Leads\", \"accion_requerida\": \"esperar_respuesta\"}]\n\nTe comento con total claridad:\n\nEl sistema completo comienza a instalarse en *72 horas hábiles* (embudo de alta velocidad en Next.js, chatbot de WhatsApp con IA y campañas activas).\n\nLa inversión del plan integral es de *$3.500.000 ARS* (o puedes iniciar bloqueando exclusividad en tu zona con una seña del 10% de *$350.000 ARS*).\n\nLa garantía es legal por contrato escrito: si en 90 días no tienes los 500 prospectos calificados en tu CRM, *se te reembolsa el 100% del dinero* o seguimos trabajando sin costo adicional hasta alcanzarlos.\n\n¿Cuentan actualmente con un equipo o vendedor activo para contactar a los prospectos apenas ingresen por WhatsApp?\n";

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
