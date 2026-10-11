import { NextRequest, NextResponse } from "next/server";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "multiagentes_smd_secret_token_2026";
const ACCESS_TOKEN = process.env.WHATSAPP_PERMANENT_ACCESS_TOKEN || "EAAT7c4ZB9HGQBSprZCS2af1JUoYpuyVpuFP3WK8DP0HoUvvsPRrnZAnRGoI39DjFarudwdPw40HdtKN37GeWmP12WWxVzUj2jLNJ1a88PVonoBrrZC2watfrocWosyQR1Nul747FXsqNcdDcFW5cizo3ZCtvPXZBnctwpcrW23QFvz25DA3g05h35fQ4E0leeTIwZDZD";
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "1254834877724483";

// Buffer de depuración en memoria (últimos 20 eventos)
const recentEvents: any[] = [];

// GET para validación del Webhook por Meta Graph API y visor de logs
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (searchParams.get("debug") === "1") {
    return NextResponse.json({
      status: "OK",
      events_count: recentEvents.length,
      events: recentEvents,
      active_phone_number_id: PHONE_NUMBER_ID
    });
  }

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

    // Guardar en buffer de depuración
    recentEvents.unshift({
      timestamp: new Date().toISOString(),
      body
    });
    if (recentEvents.length > 20) recentEvents.pop();

    const entries = body?.entry || [];
    let processedCount = 0;

    for (const entry of entries) {
      for (const change of entry?.changes || []) {
        const value = change?.value;
        const messages = value?.messages;

        if (messages && messages.length > 0) {
          for (const msg of messages) {
            const fromPhone = msg.from;
            const messageText = msg.text?.body || "[Mensaje no textual]";
            const contactName = value?.contacts?.[0]?.profile?.name || "Prospecto";

            console.log(`💬 Lead entrante: ${contactName} (${fromPhone}) -> "${messageText}"`);

            // Notificar por Google Apps Script si está disponible
            const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_LEAD_URL;
            if (scriptUrl) {
              fetch(scriptUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  origen: "WhatsApp Bot Inbound",
                  nombre: contactName,
                  telefono: fromPhone,
                  mensaje: messageText,
                  timestamp: new Date().toISOString()
                })
              }).catch(err => console.error("Error enviando a Google Script:", err));
            }

            // Construir respuesta comercial con garantía de 500 leads y seña
            const replyBody = `¡Hola ${contactName}! Un gusto saludarte.\n\nRecibí tu consulta sobre nuestro Sistema de 500 Leads Calificados Garantizados.\n\n🛡️ *Nuestra Garantía por Contrato (CUIT 20-39210016-5):*\nInstalamos tu máquina de captación en 72hs. Si en 3 meses no alcanzamos los 500 prospectos calificados para tu rubro, seguimos trabajando 100% sin costo o devolución total.\n\n🚀 *Cupo de Exclusividad Territorial:*\nTrabajamos con 1 solo cliente por rubro/zona. Podés congelar tu zona con la seña de $350.000 ARS vía Mercado Pago:\n👉 https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=3724152558-04c4dcd1-4592-4c02-8ac1-504c13b09ead\n\n¿De qué rubro es tu empresa y en qué ciudad estás operando?`;

            // Despacho a través de Meta WhatsApp Cloud API
            const cleanTo = fromPhone.replace(/\D/g, "");
            const metaUrl = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;
            
            const metaRes = await fetch(metaUrl, {
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

            const metaData = await metaRes.json();
            console.log("✔ Respuesta de Meta Cloud API:", metaData);
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
