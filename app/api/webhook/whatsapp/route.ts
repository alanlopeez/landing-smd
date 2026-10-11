import { NextRequest, NextResponse } from "next/server";
import { stitchOrCreateLead } from "../leads/route";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "multiagentes_smd_secret_token_2026";
const ACCESS_TOKEN = process.env.WHATSAPP_PERMANENT_ACCESS_TOKEN || "EAAT7c4ZB9HGQBSprZCS2af1JUoYpuyVpuFP3WK8DP0HoUvvsPRrnZAnRGoI39DjFarudwdPw40HdtKN37GeWmP12WWxVzUj2jLNJ1a88PVonoBrrZC2watfrocWosyQR1Nul747FXsqNcdDcFW5cizo3ZCtvPXZBnctwpcrW23QFvz25DA3g05h35fQ4E0leeTIwZDZD";
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "1254834877724483";

// Función generadora de respuesta progresiva (Progressive Disclosure Funnel Engine)
function generateProgressiveResponse(lead: any, userMessage: string): { text: string; newStage: 0 | 1 | 2 | 3 | 4 } {
  const msgLower = userMessage.toLowerCase().trim();
  const historyLen = lead.history?.length || 0;
  const currentStage = lead.stage || 0;
  const name = lead.name && lead.name !== "Prospecto" ? lead.name.split(" ")[0] : "estimado";

  // Detección de intenciones clave
  const asksPriceOrGuarantee = msgLower.includes("precio") || msgLower.includes("cuanto") || msgLower.includes("costo") || msgLower.includes("garantia") || msgLower.includes("garantía") || msgLower.includes("contrato") || msgLower.includes("seña");
  const asksMeeting = msgLower.includes("reunion") || msgLower.includes("reunión") || msgLower.includes("llamada") || msgLower.includes("agendar") || msgLower.includes("cal.com") || msgLower.includes("zoom");
  const expressesInterest = msgLower.includes("si") || msgLower.includes("sí") || msgLower.includes("dale") || msgLower.includes("me interesa") || msgLower.includes("como funciona") || msgLower.includes("cómo funciona") || msgLower.includes("contame");
  const confirmsPayment = msgLower.includes("pague") || msgLower.includes("pagué") || msgLower.includes("transferi") || msgLower.includes("transferí") || msgLower.includes("comprobante");

  // ETAPA 4: ONBOARDING / PAGO CONFIRMADO
  if (confirmsPayment || currentStage === 4) {
    return {
      text: `¡Excelente ${name}! 🎉 Registro de seña recibido. Tu zona territorial queda formalmente BLOQUEADA y blindada.\n\n📦 *Próximos pasos inmediatos (SLA 72hs):*\n1. En menos de 2 horas te entrego tu Welcome Pack en PDF con las credenciales.\n2. Te sumo a nuestro grupo privado de WhatsApp operativo con los especialistas.\n3. Lanzamos tu máquina de captación llave en mano.`,
      newStage: 4
    };
  }

  // ETAPA 3: DECISIÓN & GARANTÍA CONTRACTUAL ($350k ARS y Contrato formal)
  if (asksPriceOrGuarantee || currentStage === 3) {
    return {
      text: `${name}, nuestra propuesta es el *Plan de 500 Leads Calificados en 90 Días Garantizados* por contrato formal (CUIT 20-39210016-5):\n\n🛡️ *Garantía Total:*\nInstalamos tu máquina de captación llave en mano en 72hs. Si en 90 días no alcanzamos los 500 prospectos calificados para tu rubro, seguimos trabajando *100% sin costo hasta alcanzarlos (gratis)* o devolución total de la seña.\n\n🚀 *Exclusividad Territorial:*\nSolo trabajamos con 1 empresa por rubro y zona. Podés congelar y bloquear tu zona hoy con la seña inicial de *$350.000 ARS* vía Mercado Pago protegido:\n👉 https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=3724152558-04c4dcd1-4592-4c02-8ac1-504c13b09ead\n\n¿Querés que te reserve la exclusividad de tu zona antes de que entre otro competidor?`,
      newStage: 3
    };
  }

  // ETAPA 2: INTERÉS & CAL.COM (Invitación a llamada o chat enfocado)
  if (asksMeeting || (expressesInterest && historyLen >= 2) || currentStage === 2) {
    return {
      text: `Genial ${name}. Para evaluar tu caso puntual y ver si tu zona sigue disponible en exclusiva, podemos coordinar una videollamada de 15 minutos enfocada (o seguir por acá si preferís):\n\n📅 *Podés elegir el horario que mejor te quede en mi calendario oficial:*\n👉 https://cal.com/alan-lopez/15min\n\n¿Te queda mejor conectar por videollamada o querés que te presente la propuesta con garantía directamente por acá?`,
      newStage: 2
    };
  }

  // ETAPA 1: CONSCIENCIA & MOFU (Demostración de retorno y fugas de tráfico)
  if (expressesInterest || historyLen >= 2 || currentStage === 1) {
    return {
      text: `Totalmente ${name}. En rubros de ticket medio/alto (como venta de embarcaciones, maquinaria o servicios especializados), cerrar solo 1 o 2 ventas extra al mes te cambia por completo el semestre.\n\nEl gran problema es que las campañas tradicionales atraen curiosos sin poder adquisitivo. Lo que nosotros hacemos es instalar un embudo con filtro que califica por capacidad de compra en 3 pasos antes de derivártelos.\n\n¿Hoy qué volumen de consultas mensuales estás manejando y qué porcentaje sentís que realmente califica para comprar?`,
      newStage: 1
    };
  }

  // ETAPA 0: CONTACTO FRÍO (Cero venta agresiva, diagnóstico sin costo, validación de dolor)
  return {
    text: `¡Hola ${name}! Un gusto saludarte.\n\nVi tu consulta. En nuestro equipo nos especializamos en instalar sistemas llave en mano de atracción y filtrado de prospectos de alto poder adquisitivo.\n\nCero venta agresiva por acá: primero analizamos si tu mercado tiene el volumen necesario para garantizarte 500 clientes potenciales por contrato.\n\n¿De qué rubro específico es tu negocio y en qué zona geográfica estás operando actualmente?`,
    newStage: 0
  };
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

// POST para recepción de mensajes de leads y prospectos
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📩 [WHATSAPP WEBHOOK] Evento entrante:", JSON.stringify(body, null, 2));

    const entries = body?.entry || [];
    let processedCount = 0;

    for (const entry of entries) {
      for (const change of entry?.changes || []) {
        const value = change?.value;
        const messages = value?.messages;

        if (messages && messages.length > 0) {
          for (const msg of messages) {
            const fromPhone = msg.from;
            const messageText = msg.text?.body || "[Mensaje]";
            const contactName = value?.contacts?.[0]?.profile?.name || "Prospecto";

            console.log(`💬 Lead entrante: ${contactName} (${fromPhone}) -> "${messageText}"`);

            // Extraer email del texto si el usuario lo menciona (Detección de Cross-Channel)
            const emailMatch = messageText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            const extractedEmail = emailMatch ? emailMatch[0].toLowerCase() : null;

            // Fusión e ingestión omnicanal en memoria / CRM
            const lead = stitchOrCreateLead({
              phone: fromPhone,
              email: extractedEmail,
              name: contactName !== "Prospecto" ? contactName : undefined,
              channel: "whatsapp",
              direction: "inbound",
              message: messageText
            });

            // Generar respuesta progresiva adaptada a la etapa del lead
            const { text: replyBody, newStage } = generateProgressiveResponse(lead, messageText);
            lead.stage = newStage;

            // Registrar interacción saliente en la memoria del lead
            stitchOrCreateLead({
              phone: fromPhone,
              email: extractedEmail,
              channel: "whatsapp",
              direction: "outbound",
              message: replyBody
            });

            // Despacho a través de Meta WhatsApp Cloud API
            const cleanTo = fromPhone.replace(/\D/g, "");
            const metaUrl = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;
            
            await fetch(metaUrl, {
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
                  body: replyBody
                }
              })
            });

            processedCount++;
          }
        }
      }
    }

    return NextResponse.json({ status: "OK", processed_count: processedCount }, { status: 200 });
  } catch (error: any) {
    console.error("Error procesando mensaje de WhatsApp:", error);
    return NextResponse.json({ status: "ERROR", error: error.message }, { status: 200 });
  }
}
