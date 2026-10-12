import { NextRequest, NextResponse } from "next/server";
import { UNIFIED_LEADS, stitchOrCreateLead } from "@/lib/leadsStore";
import { syncLeadWithChatwoot } from "@/lib/chatwootClient";

export const dynamic = "force-dynamic";

const ACCESS_TOKEN =
  process.env.WHATSAPP_PERMANENT_ACCESS_TOKEN ||
  "EAAT7c4ZB9HGQBSprZCS2af1JUoYpuyVpuFP3WK8DP0HoUvvsPRrnZAnRGoI39DjFarudwdPw40HdtKN37GeWmP12WWxVzUj2jLNJ1a88PVonoBrrZC2watfrocWosyQR1Nul747FXsqNcdDcFW5cizo3ZCtvPXZBnctwpcrW23QFvz25DA3g05h35fQ4E0leeTIwZDZD";
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "1254834877724483";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, phone, message, tags, stage } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ status: "ERROR", error: "Mensaje vacío" }, { status: 400 });
    }

    const cleanTo = (phone || "").replace(/\D/g, "");
    if (!cleanTo) {
      return NextResponse.json({ status: "ERROR", error: "Teléfono no válido" }, { status: 400 });
    }

    console.log(`📤 [MANUAL OUTBOUND] Enviando WhatsApp a ${cleanTo}: "${message.slice(0, 60)}..."`);

    // 1. Enviar mensaje por Meta WhatsApp Cloud API
    let metaMessageId = "local-sim-" + Date.now();
    try {
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
            body: message.trim(),
          },
        }),
      });

      const metaData = await metaRes.json();
      if (metaData?.messages?.[0]?.id) {
        metaMessageId = metaData.messages[0].id;
        console.log(`✔ [META SENT OK] ID: ${metaMessageId}`);
      } else {
        console.warn(`[META RESPONSE]`, metaData);
      }
    } catch (metaErr: any) {
      console.warn("Error enviando por Meta Graph API:", metaErr.message);
    }

    // 2. Guardar mensaje en el historial unificado del CRM
    const updatedLead = stitchOrCreateLead({
      phone: cleanTo,
      channel: "whatsapp",
      direction: "outbound",
      message: message.trim(),
    });

    if (tags && Array.isArray(tags)) {
      updatedLead.tags = Array.from(new Set([...(updatedLead.tags || []), ...tags]));
    }
    if (stage !== undefined && stage >= 0 && stage <= 4) {
      updatedLead.stage = stage;
    }

    // 3. Sincronizar en segundo plano con Chatwoot
    syncLeadWithChatwoot({
      phone: cleanTo,
      name: updatedLead.name,
      email: updatedLead.email,
      outboundMessage: message.trim(),
      labels: updatedLead.tags || [],
      stage: updatedLead.stage,
    }).catch((err) => console.warn("[Chatwoot Manual Sync Warn]:", err));

    return NextResponse.json({
      status: "SENT",
      messageId: metaMessageId,
      lead: updatedLead,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error en /api/messages/send:", error);
    return NextResponse.json({ status: "ERROR", error: error.message }, { status: 500 });
  }
}
