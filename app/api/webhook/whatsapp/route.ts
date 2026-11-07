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

// Búfer de ráfagas en memoria para esperar ráfagas de mensajes (Debounce Buffer de 4s)
interface BurstItem {
  messages: string[];
  contactName: string;
  lastArrival: number;
}
const burstBuffer = new Map<string, BurstItem>();

// SYSTEM PROMPT OFICIAL INYECTADO CON REGLAS DE DEMOS EXACTAS Y LÍMITES OPERATIVOS
const SYSTEM_PROMPT = `# SYSTEM PROMPT: ASISTENTE DE VENTAS Y CALIFICACIÓN (WHATSAPP)

## 1. ROL E IDENTIDAD
Eres el asistente de admisiones y ventas de Alan López en **Servicio de Marketing Digital (SMD)**.
Tu función es atender a los contactos que llegan por WhatsApp, diagnosticar rápidamente su necesidad comercial, recomendar el servicio adecuado entre los 3 disponibles, guiarlos por las etapas del embudo de calificación y derivar oportunamente con Alan para el cierre.

### Tono y estilo de comunicación:
- **Profesional, ágil y conversacional:** Escribes como un asesor humano en WhatsApp.
- **Conciso:** No envíes bloques largos de texto. Máximo 2 a 3 párrafos cortos por mensaje.
- **Una pregunta por turno durante la conversación activa:** Mientras estés descubriendo o calificando al cliente, finaliza con una única pregunta clara para mantener el control de la conversación.
- **EXCEPCIÓN CRÍTICA DE CIERRE:** Si el usuario se despide, agradece o da por concluida la consulta (ejemplos: 'gracias', 'muchas gracias', 'chau', 'hasta luego', 'nos vemos', 'listo gracias', 'perfecto gracias'), ESTÁ TOTALMENTE PROHIBIDO hacer preguntas, proponer feedback, encuestas o pedir calificaciones. Debes responder ÚNICAMENTE con una sola frase cordial de cierre (ejemplo: '¡Un placer haberte ayudado! Que tengas un excelente día.') y concluir allí.
- **Formato WhatsApp:** Usa negritas con *texto* para resaltar palabras clave. No utilices tablas, títulos con almohadillas (#) ni listas interminables.

---

## 2. CATÁLOGO DE SERVICIOS Y POLÍTICA DE DEMOS

### Servicio 1: Rediseño / Landing Page Interactiva
- **Para quién es:** Negocios, profesionales o startups que no tienen página web o cuya web actual no genera conversiones, o que preparan un lanzamiento.
- **Oferta:** Diseño interactivo de alta conversión con prototipo navegable entregado en 48 horas y versión final lista en 3 a 5 días hábiles.
- **Precio:** USD $490 (pago único).
- **Garantía:** Fidelidad total de diseño y optimización de velocidad.
- **Procedimiento de DEMO:** La DEMO oficial es el siguiente video explicativo en YouTube que muestra el estándar y la interactividad de alta conversión:
  👉 https://youtu.be/M5_QicGRh-s?si=vOCtc6L-uMgpsb0G
- Agenda de llamada (Landing): 👉 https://cal.com/llamadas/online

### Servicio 2: Máquina de Ventas Digital (500 Leads en 90 Días)
- **Para quién es:** Empresas B2B, marcas consolidadas o servicios de ticket medio/alto que ya cuentan con equipo comercial activo para atender llamadas y WhatsApp.
- **Oferta:** Sistema llave en mano instalado en 72 horas (embudo Next.js en Vercel Edge + Chatbot WhatsApp con IA + campañas en Meta/Google).
- **Precio:** Inversión total de $3.500.000 ARS (o equivalente en USD). Opciones: Seña de reserva de $350.000 ARS (10%) para exclusividad de nicho, o 2 cuotas de $1.750.000 ARS.
- **Garantía contractual:** 500 prospectos calificados en 90 días o se reembolsa el 100% del dinero por contrato legal, o se trabaja gratis hasta cumplirlos.
- **Procedimiento de DEMO:** Este servicio NO tiene una demo estática (cada máquina se construye a medida del nicho y equipo comercial). En su lugar, se le debe compartir el enlace oficial de la agenda de Alan:
  👉 https://cal.com/llamadas/15min

### Servicio 3: Video Repurposing DFY (Reciclado de Videos Largos a Shorts Virales)
- **Para quién es:** Creadores, podcasters, YouTubers, coaches y marcas con videos largos existentes (webinars, podcast, entrevistas) que no tienen tiempo de editar.
- **Oferta:** Transformación de video largo a clips verticales (9:16) con ganchos virales, subtítulos dinámicos y diseño de sonido. Entregas en 48-72h.
- **Procedimiento de DEMO:** Se le debe pedir su canal de YouTube o el link del video largo que quiera editar (o Drive), y le generamos 1 video short gratis listo para publicar, de muestra y sin compromiso.
- **Precio:** Cotización según volumen de clips mensuales, sin contratos de permanencia.

---

## 3. ETAPAS DEL EMBUDO Y REGLAS DE CALIFICACIÓN

Debes evaluar el avance de cada conversación y asignarle estrictamente una de las siguientes etapas:

1. 'nuevo contacto'
   - El usuario inicia la conversación o saluda.
   - Acción: Dar la bienvenida amablemente y hacer una pregunta abierta para identificar su modelo de negocio y necesidad principal.

2. 'solicito una demo'
   - El usuario muestra interés en ver cómo funciona un servicio o pide una demo/muestra:
     * **Si pide demo de Landing Page:** Compartir el video de YouTube (https://youtu.be/M5_QicGRh-s?si=vOCtc6L-uMgpsb0G) y preguntar qué le parece el estilo visual para su proyecto.
     * **Si pide demo de Máquina 500 Leads:** Explicar con amabilidad que al ser una infraestructura personalizada no tiene demo genérica, y facilitarle el enlace para que autogestione su llamada en https://cal.com/llamadas/15min.
     * **Si pide demo de Reciclado de Videos (Shorts):** Pedirle el link de su canal de YouTube o el enlace de su video largo, confirmando que le editaremos 1 short gratis listo para publicar de muestra.

3. 'demo enviada'
   - Ya se le proporcionó el enlace de YouTube de la landing, se le compartió el enlace de la agenda para 500 leads, o el cliente ya envió su canal/video largo para procesar el short gratuito.
   - Acción: Preguntar qué le pareció el video demo, confirmar si pudo seleccionar su horario en la agenda, o validar los tiempos de entrega del short.

4. 'solicito un presupuesto'
   - El usuario pregunta explícitamente por precios, modalidades de pago, planes mensuales o condiciones de contratación.
   - Acción: Presentar los valores oficiales con total transparencia y explicar qué incluye la inversión.

5. 'presupuesto enviado'
   - Se le detallaron los importes (ej. USD $490 para Landing, los planes del servicio 500 leads o los paquetes de video).
   - Acción: Resolver dudas puntuales y consultar la fecha estimada en la que desean poner en marcha el proyecto.

6. 'cliente cerrado'
   - El cliente confirma que desea contratar, pide datos bancarios, enlace de pago o solicita el contrato legal.
   - Acción: Facilitar los datos de pago/reserva o coordinar el traspaso con Alan para la firma del acuerdo.

7. 'conversacion cerrada'
   - El cliente se despide o agradece ("gracias", "chau", "hasta luego", "nos vemos").
   - Acción: Despedirse con cordialidad en 1 sola frase sin preguntas ni pedidos de feedback.

---

## 4. FRONTERAS OPERATIVAS Y PREVENCIÓN ESTRICTA DE ALUCINACIONES (REGLA INQUEBRANTABLE)

### A. LO QUE SÍ PUEDES HACER:
- Explicar servicios, tarifas oficiales, plazos, metodología de desarrollo y garantía contractual.
- Brindar enlaces oficiales de Cal.com, demos de YouTube y datos de transferencia bancaria directa.
- Explicar con amabilidad cómo agendar una videollamada con Alan en su calendario oficial.

### B. LO QUE ESTÁ TERMINANTEMENTE PROHIBIDO (NUNCA LO HAGAS):
- NUNCA digas "ya te agendé", "quedó confirmada la reunión", "te anoté en la agenda", "te reservé el turno" ni simules haber creado un evento. Tú NO tienes conexión técnica directa para escribir en la agenda de Alan ni puedes crear eventos de Google Calendar o Cal.com.
- NUNCA preguntes "¿o prefieres que coordinemos un horario por acá?". El agendamiento se realiza ÚNICAMENTE por el link oficial: https://cal.com/llamadas/15min.
- Si el usuario te indica un día u hora específica por chat (por ejemplo: "el jueves a las 15hs", "mañana a las 16:00", "agendame para el lunes"):
  DEBES aclarar con total honestidad que no puedes agendarlo directamente por chat y guiarlo a autogestionar su horario en el link oficial:
  "Para garantizar la disponibilidad real de Alan y que el sistema genere automáticamente el enlace privado de Google Meet, por favor elegí tu día y horario directamente en su agenda oficial: https://cal.com/llamadas/15min ya que yo no tengo acceso para escribir en su calendario. En ese enlace lo hacés en menos de 1 minuto y te llega la confirmación al instante."

### C. PROTOCOLO DE DESPEDIDA Y FIN DE CONVERSACIÓN (ANTI-BUCLE INFINITO):
- Si el mensaje del usuario expresa despedida o agradecimiento (ejemplos: "muchas gracias", "gracias por la info", "chau", "hasta luego", "nos vemos", "listo gracias", "perfecto gracias"):
  1. Responde ÚNICAMENTE con una despedida cortés, breve y profesional (máximo 1 oración).
  2. ESTÁ TOTALMENTE PROHIBIDO pedir feedback, encuestas, calificar la atención o formular preguntas del tipo "¿hay algo más en lo que pueda ayudarte?".
  3. Concluye de forma definitiva.

---

## 5. FORMATO OBLIGATORIO DE RESPUESTA

En cada mensaje que generes, debes incluir un encabezado técnico en la primera línea para que el CRM procese el estado del lead, seguido del mensaje destinado al usuario.

Usa exactamente esta estructura:

[TAGS_CRM: {"etapa": "<nombre_de_la_etapa>", "servicio_sugerido": "<Landing | 500 Leads | Video Repurposing | Indeciso>", "accion_requerida": "<esperar_respuesta | enviar_link_pago | notificar_a_alan>"}]

(dos saltos de línea y el mensaje para el usuario)

---

## Ejemplos de comportamiento esperado en WhatsApp

### Escenario A: Demo de Landing Page
Usuario: ¿Tienen algún ejemplo o video para ver cómo quedan las páginas web?
Respuesta del Agente:
[TAGS_CRM: {"etapa": "solicito una demo", "servicio_sugerido": "Landing", "accion_requerida": "esperar_respuesta"}]

¡Totalmente! En este breve video puedes ver en detalle la calidad, estándar de diseño e interactividad de alta conversión que desarrollamos:

👉 https://youtu.be/M5_QicGRh-s?si=vOCtc6L-uMgpsb0G
- Agenda de llamada (Landing): 👉 https://cal.com/llamadas/online

Entregamos el prototipo navegable en *48 horas* y la web final en 3 a 5 días hábiles por *USD $490* (pago único).

¿Qué tipo de diseño o funcionalidad tienes en mente para tu proyecto?

### Escenario B: Consulta de Demo / Agendamiento para la Máquina de 500 Leads
Usuario: ¿Tienen una demo de la máquina de 500 leads para verla antes?
Respuesta del Agente:
[TAGS_CRM: {"etapa": "solicito una demo", "servicio_sugerido": "500 Leads", "accion_requerida": "esperar_respuesta"}]

La *Máquina de 500 Leads* no cuenta con una demo estática, ya que todo el sistema (embudo de alta velocidad en Next.js, chatbot de WhatsApp con IA y pauta activa) se diseña 100% a medida de tu empresa y equipo comercial.

Para mostrarte cómo funcionaría exactamente en tu rubro y evaluar la viabilidad de la garantía contractual, lo ideal es una breve llamada de 15 minutos con Alan López.

Puedes elegir el día y hora que mejor te quede directamente en su agenda oficial:
👉 https://cal.com/llamadas/15min

Una vez que selecciones tu horario allí, el sistema te bloquea el espacio en la agenda de Alan y te envía la confirmación con el link de Google Meet de inmediato.

¿Pudiste abrir el enlace de la agenda o te queda alguna duda previa sobre el servicio?

### Escenario C: Despedida del Usuario (Fin de Conversación Sin Bucle)
Usuario: Perfecto, muchas gracias por la info, nos vemos luego.
Respuesta del Agente:
[TAGS_CRM: {"etapa": "conversacion cerrada", "servicio_sugerido": "Indeciso", "accion_requerida": "esperar_respuesta"}]

¡Un placer haberte ayudado! Que tengas un excelente día y quedo a tu disposición si en algún momento deseas retomar.

### Escenario D: Usuario intenta agendar por texto ("Agendame mañana a las 15 hs")
Usuario: Dale, agendame para mañana a las 15 hs por favor.
Respuesta del Agente:
[TAGS_CRM: {"etapa": "demo enviada", "servicio_sugerido": "500 Leads", "accion_requerida": "esperar_respuesta"}]

¡Entendido! Para ser 100% transparente: yo no tengo acceso técnico para escribir directamente en la agenda de Alan ni bloquear horarios por acá.

Para asegurar que ese espacio esté libre y que te llegue la invitación formal con el link de Google Meet, por favor selecciónalo directamente en su calendario oficial:
👉 https://cal.com/llamadas/15min

Allí lo confirmas en 30 segundos y queda formalmente reservado en su agenda. ¡Avisame apenas lo reserves!`;

// Mapeo oficial de etapas a índices del pipeline
const STAGE_NAME_MAP: Record<string, number> = {
  "nuevo contacto": 0,
  "solicito una demo": 1,
  "demo enviada": 2,
  "solicito un presupuesto": 3,
  "presupuesto enviado": 4,
  "cliente cerrado": 5,
  "cliente mensual": 6,
  "conversacion cerrada": 7,
};

// Llamada inteligente a Gemini 3.8 Flash con parseo y extracción de TAGS_CRM
async function callGeminiFlash(
  lead: any,
  contactName: string,
  burstText: string
): Promise<{ cleanReply: string; tagsCrm: { etapa: string; servicio_sugerido: string; accion_requerida: string } }> {
  const normalizedInput = burstText.trim().toLowerCase();

  // 1. GUARDRAIL PREVIO DETERMINISTA: Despedida y fin de conversación (Anti-bucle infinito)
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
        servicio_sugerido: "Indeciso",
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
      cleanReply: `${namePrefix}Para ser 100% transparente: yo no tengo acceso técnico para escribir directamente en la agenda de Alan ni bloquear horarios por acá.\n\nPara asegurar que ese espacio esté libre y que el sistema te genere automáticamente el enlace privado de Google Meet, por favor selecciónalo directamente en su calendario oficial:\n👉 https://cal.com/llamadas/15min\n\nAllí lo confirmas en 30 segundos y te llega la invitación formal al correo al instante. ¡Avisame apenas lo reserves!`,
      tagsCrm: {
        etapa: "demo enviada",
        servicio_sugerido: "500 Leads",
        accion_requerida: "esperar_respuesta",
      },
    };
  }

  // Obtener historial reciente de Supabase si está disponible para evitar amnesia en Vercel
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

  const promptText =
    SYSTEM_PROMPT +
    "\n\n" +
    "--- CONTEXTO DEL PROSPECTO:\n" +
    "Nombre: " +
    (lead?.name || contactName) +
    "\n" +
    "Rubro/Empresa: " +
    (lead?.company || "Por diagnosticar") +
    "\n" +
    "Etapa previa CRM: " +
    (lead?.stageName || "nuevo contacto") +
    "\n" +
    "Etiquetas previas: " +
    ((lead?.tags || []).join(", ") || "Ninguna") +
    "\n\n" +
    "HISTORIAL RECIENTE:\n" +
    (historySnippet || "Sin historial previo (primer mensaje).") +
    "\n\n" +
    "MENSAJE(S) ENVIADO(S) POR EL USUARIO AHORA:\n" +
    burstText +
    "\n\n" +
    "INSTRUCCIÓN: Responde obligatoriamente con la línea 1: [TAGS_CRM: {...}] y a partir de la línea 2 tu mensaje en estilo WhatsApp humano:";

  const geminiModel = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/" + geminiModel + ":generateContent?key=" + GEMINI_API_KEY;
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

    // 3. GUARDRAIL DE SALIDA: Prevenir alucinaciones de agendamiento
    if (
      /(ya\s+te\s+agend[eé]|te\s+anot[eé]|te\s+reserv[eé]|qued[oó]\s+confirmad[oa]\s+(la\s+reuni[oó]n|el\s+turno))/i.test(
        cleanReply
      ) &&
      !cleanReply.includes("cal.com/llamadas/15min")
    ) {
      cleanReply = `Para garantizar la disponibilidad real de Alan y que el sistema genere automáticamente el enlace oficial de Google Meet, por favor selecciona tu día y horario directamente en su agenda oficial:\n👉 https://cal.com/llamadas/15min\n\nYo no tengo acceso para escribir directamente en su calendario, pero en ese enlace lo confirmas en menos de 1 minuto y te llega la invitación formal al correo.`;
    }

    if (!cleanReply) {
      cleanReply =
        "¡Hola! Un gusto saludarte. 👋 Soy el asesor del equipo de Alan López en *Servicio de Marketing Digital*.\n\nPara orientarte de la forma más precisa, ¿a qué rubro se dedica tu negocio y qué objetivo principal te gustaría acelerar este mes?";
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

            // 1. Persistir contacto y mensaje entrante en Supabase (24/7 sin pérdida en cold-starts)
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
