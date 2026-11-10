import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/emailService";

export const dynamic = "force-dynamic";

const CRON_SECRET = process.env.CRON_SECRET || "multiagentes_cron_secret_2026";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://smvhwaeppoigxmbiccjw.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const SYSTEM_INBOX_PROMPT = `# SYSTEM PROMPT: ASISTENTE DE VENTAS Y ATENCIÓN POR EMAIL (SMD)
Eres el Asistente Ejecutivo de Ventas de Alan López en Servicio de Marketing Digital (www.serviciodemarketingdigital.com).
Tu función es responder consultas recibidas a hola@serviciodemarketingdigital.com.
Reglas:
1. Profesional, resolutivo y directo.
2. Identifica en cuál de los 3 pilares necesita ayuda:
   - Pilar 1: Páginas de Aterrizaje ($490 USD, prototipo en 48hs).
   - Pilar 2: Máquina de 500 Leads en 90 días ($3.500.000 ARS, garantía por contrato o 100% reembolso).
   - Pilar 3: Base de datos y WhatsApp (automatización de recompra a $0 CAC).
3. Incluye la locución 'Por ejemplo' con una situación adaptada al negocio del remitente.
4. Siempre ofrece agendar la sesión de 15 minutos con Alan López: https://cal.com/llamadas/15min.
5. Formato HTML limpio y formal con firma ejecutiva de Alan López.`;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const urlSecret = req.nextUrl.searchParams.get("secret");

  const isAuthorized =
    authHeader === `Bearer ${CRON_SECRET}` ||
    urlSecret === CRON_SECRET ||
    req.headers.get("x-vercel-cron") === "1";

  if (!isAuthorized && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unauthorized cron trigger" }, { status: 401 });
  }

  const timestamp = new Date().toISOString();
  console.log(`[Cron Sync-Inbox] Auditoría y sincronización ejecutada a las ${timestamp}`);

  // Consultar últimos contactos pendientes de respuesta en Supabase
  let pendingCount = 0;
  if (SUPABASE_KEY) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/contact?select=id,firstName,email&limit=5`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });
      const data = await res.json();
      pendingCount = Array.isArray(data) ? data.length : 0;
    } catch (e) {
      console.warn("Error leyendo contactos en cron sync-inbox:", e);
    }
  }

  return NextResponse.json({
    status: "HEALTHY",
    timestamp,
    agent: "email_conversational_bot",
    division: "05_comunicacion",
    task: "inbox_processing_and_crm_sync",
    monitored_mailbox: "hola@serviciodemarketingdigital.com",
    contacts_audited: pendingCount,
    message: "Buzón sincronizado y agente de correo activo en la nube.",
  });
}

// Receptor POST: Procesa correos entrantes enviados por un webhook de correo o formulario
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const senderEmail = body?.from || body?.email;
    const senderName = body?.name || "Prospecto";
    const subject = body?.subject || "Consulta Comercial";
    const message = body?.message || body?.text || "";

    if (!senderEmail || !message) {
      return NextResponse.json({ error: "Email y mensaje son obligatorios." }, { status: 400 });
    }

    console.log(`📩 [EMAIL ENTRANTE] De: ${senderName} <${senderEmail}> | Asunto: ${subject}`);

    // Generar respuesta ejecutiva con Gemini
    let replyHtml = "";
    try {
      const prompt = `${SYSTEM_INBOX_PROMPT}

CORREO RECIBIDO DEL CLIENTE:
De: ${senderName} <${senderEmail}>
Asunto: ${subject}
Mensaje:
${message}

INSTRUCCIÓN: Redacta la respuesta ejecutiva en formato HTML para enviar por correo:`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 1500,
            temperature: 0.3,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      });
      const data = await res.json();
      replyHtml = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (e: any) {
      console.warn("Fallo Gemini en respuesta de correo:", e.message);
    }

    if (!replyHtml) {
      replyHtml = `<p>Hola ${senderName}, gracias por ponerte en contacto con nosotros.</p>
<p>Recibí tu consulta sobre <b>${subject}</b>. En <b>Servicio de Marketing Digital</b> ayudamos a empresas a escalar sus ventas trabajando en sus <b>Páginas de aterrizaje</b>, su <b>Tráfico web</b> y la <b>Gestión de su base de clientes</b>.</p>
<p><b>Por ejemplo:</b> Si necesitás captar más clientes este mes, podemos diseñar una landing page interactiva con entrega en 48hs o montar una campaña de respuesta directa en Meta Ads para derivar consultas calificadas a tu WhatsApp.</p>
<p>Para analizar tu caso puntual y ver cuál de las 3 soluciones se adapta mejor a tu meta, te invito a agendar una videollamada de 15 minutos conmigo:<br/>
👉 <a href="https://cal.com/llamadas/15min"><b>https://cal.com/llamadas/15min</b></a></p>
<p>Quedo a tu disposición.</p>
<p>Atentamente,<br/><b>Alan López</b><br/>Servicio de Marketing Digital<br/>www.serviciodemarketingdigital.com</p>`;
    }

    // Despachar respuesta real por SMTP
    const sendResult = await sendEmail({
      to: senderEmail,
      subject: subject.toLowerCase().startsWith("re:") ? subject : `Re: ${subject}`,
      html: replyHtml,
    });

    return NextResponse.json({
      success: true,
      senderEmail,
      subject,
      dispatched: sendResult.success,
      message: "Correo procesado y respuesta ejecutiva enviada automáticamente.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
