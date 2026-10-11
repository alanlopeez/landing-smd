import { NextRequest, NextResponse } from "next/server";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "multiagentes_smd_secret_token_2026";
const ACCESS_TOKEN = process.env.WHATSAPP_PERMANENT_ACCESS_TOKEN || "EAAT7c4ZB9HGQBSprZCS2af1JUoYpuyVpuFP3WK8DP0HoUvvsPRrnZAnRGoI39DjFarudwdPw40HdtKN37GeWmP12WWxVzUj2jLNJ1a88PVonoBrrZC2watfrocWosyQR1Nul747FXsqNcdDcFW5cizo3ZCtvPXZBnctwpcrW23QFvz25DA3g05h35fQ4E0leeTIwZDZD";
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "1254834877724483";

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

// POST para recepción de mensajes de leads y prospectos
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📩 [WHATSAPP WEBHOOK] Evento entrante:", JSON.stringify(body, null, 2));

    const entry = body?.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const messages = value?.messages;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ status: "NO_MESSAGES" }, { status: 200 });
    }

    const message = messages[0];
    const fromPhone = message.from;
    const messageText = message.text?.body || "";
    const contactName = value?.contacts?.[0]?.profile?.name || "Prospecto";

    console.log(`💬 Lead entrante: ${contactName} (${fromPhone}) -> "${messageText}"`);

    // Notificar por Google Apps Script si está disponible
    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_LEAD_URL;
    if (scriptUrl) {
      try {
        await fetch(scriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            origen: "WhatsApp Bot Inbound",
            nombre: contactName,
            telefono: fromPhone,
            mensaje: messageText,
            timestamp: new Date().toISOString()
          })
        });
      } catch (err) {
        console.error("Error notificando a Google Script:", err);
      }
    }

    // Respuesta con oferta comercial y garantía de 500 leads
    const replyBody = `¡Hola ${contactName}! Un gusto saludarte.\n\nRecibí tu consulta sobre nuestro Sistema de 500 Leads Calificados Garantizados.\n\n🛡️ *Nuestra Garantía por Contrato (CUIT 20-39210016-5):*\nInstalamos tu máquina de captación en 72hs. Si en 3 meses no alcanzamos los 500 prospectos calificados para tu rubro, seguimos trabajando 100% sin costo o devolución total.\n\n🚀 *Cupo de Exclusividad Territorial:*\nTrabajamos con 1 solo cliente por rubro/zona. Podés congelar tu zona con la seña de $350.000 ARS vía Mercado Pago:\n👉 https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=3724152558-04c4dcd1-4592-4c02-8ac1-504c13b09ead\n\n¿De qué rubro es tu empresa y en qué ciudad estás operando?`;

    // Despacho a través de Meta WhatsApp Cloud API
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
        to: fromPhone,
        type: "text",
        text: {
          preview_url: true,
          body: replyBody
        }
      })
    });

    return NextResponse.json({ status: "OK", lead: contactName, phone: fromPhone }, { status: 200 });
  } catch (error: any) {
    console.error("Error procesando mensaje de WhatsApp:", error);
    return NextResponse.json({ status: "ERROR", error: error.message }, { status: 200 });
  }
}
