import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/emailService";
import { fetchNewEmailsSinceUid } from "@/lib/imapClient";

export const dynamic = "force-dynamic";

const CRON_SECRET = process.env.CRON_SECRET || "multiagentes_cron_secret_2026";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://smvhwaeppoigxmbiccjw.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const BASELINE_ID = "IMAP_BASELINE_UID";
const DEFAULT_START_UID = 6947;

const SYSTEM_INBOX_PROMPT = `# SYSTEM PROMPT: AGENTE EJECUTIVO DE VENTAS Y ATENCIÓN POR EMAIL 24/7 (SMD - MODO B)
Eres el Asistente Ejecutivo de Ventas de Alan López en Servicio de Marketing Digital (www.serviciodemarketingdigital.com).
Tu misión es responder de forma inmediata, cálida, concreta y comercial a cada potencial cliente que escribe a hola@serviciodemarketingdigital.com.

REGLAS OBLIGATORIAS:
1. Tono cercano, profesional, directo y enfocado en resultados comerciales reales (sin tecnicismos).
2. Conecta la consulta del remitente con nuestros 3 pilares (más posicionamiento en IA / AEO):
   - Pilar 1: Páginas de Aterrizaje Mobile-First de alta conversión (con demo/prototipo en 48hs y optimización AEO/GEO para aparecer en Google y ChatGPT).
   - Pilar 2: Tráfico Web (Campañas de anuncios en Meta/Google Ads y contenido audiovisual enfocado en ventas).
   - Pilar 3: Gestión de Base de Datos y Automatización WhatsApp/Email (reactivación de clientes a $0 CAC).
3. Incluye obligatoriamente la locución "Por ejemplo" con una idea o aplicación práctica adaptada a lo que consulta el remitente.
4. Invita siempre a agendar una reunión online gratuita de diagnóstico de 15 minutos con Alan López en: https://cal.com/llamadas/15min (o responder este mismo correo con su número de WhatsApp y rubro).
5. Devuelve únicamente el cuerpo en HTML limpio (<p>, <ul>, <li>, <b>, <a href="https://cal.com/llamadas/15min">) con firma ejecutiva de Alan López - Servicio de Marketing Digital. No uses bloques markdown \`\`\`html.`;

async function getLastProcessedUid(): Promise<number> {
  if (!SUPABASE_KEY) return DEFAULT_START_UID;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/verification?id=eq.${BASELINE_ID}&select=value`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        cache: "no-store",
      }
    );
    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0) {
        const parsed = parseInt(rows[0].value, 10);
        if (!isNaN(parsed) && parsed >= DEFAULT_START_UID) {
          return parsed;
        }
      }
    }
  } catch (e) {
    console.warn("Error leyendo IMAP_BASELINE_UID:", e);
  }
  return DEFAULT_START_UID;
}

async function saveLastProcessedUid(uid: number): Promise<void> {
  if (!SUPABASE_KEY) return;
  try {
    const now = new Date().toISOString();
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    await fetch(`${SUPABASE_URL}/rest/v1/verification`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        id: BASELINE_ID,
        identifier: "smd_imap_cursor",
        value: String(uid),
        expiresAt: expires,
        createdAt: now,
        updatedAt: now,
      }),
    });
  } catch (e) {
    console.warn("Error guardando IMAP_BASELINE_UID:", e);
  }
}

function isAutomatedOrInternalEmail(fromEmail: string, subject: string): boolean {
  const emailLower = fromEmail.toLowerCase();
  const subjLower = subject.toLowerCase();

  // Ignorar correos enviados por nuestra propia cuenta o notificaciones automáticas
  if (emailLower === "hola@serviciodemarketingdigital.com") return true;
  const blockedSenders = [
    "noreply",
    "no-reply",
    "mailer-daemon",
    "postmaster",
    "linkedin.com",
    "supabase.com",
    "useomnia.com",
    "vercel.com",
    "github.com",
    "cron-job.org",
    "google.com",
    "accounts.google.com",
    "notifications@",
    "newsletter@",
    "bounce@",
  ];
  if (blockedSenders.some((b) => emailLower.includes(b))) return true;

  const blockedSubjects = [
    "[auto-respuesta modo b",
    "[pendiente de tu aprobación]",
    "misión aprobada",
    "manual maestro",
    "delivery status notification",
    "undeliverable:",
  ];
  if (blockedSubjects.some((s) => subjLower.includes(s))) return true;

  return false;
}

async function generateCommercialReply(senderName: string, senderEmail: string, subject: string, message: string): Promise<string> {
  let replyHtml = "";
  try {
    const prompt = `${SYSTEM_INBOX_PROMPT}

CORREO ENTRANTE DEL PROSPECTO:
De: ${senderName} <${senderEmail}>
Asunto: ${subject}
Mensaje:
${message}

INSTRUCCIÓN: Redacta la respuesta comercial en HTML limpio lista para enviar:`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_API_KEY}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 1200,
          temperature: 0.3,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    });
    const data = await res.json();
    replyHtml = (data?.candidates?.[0]?.content?.parts?.[0]?.text || "")
      .replace(/```html/gi, "")
      .replace(/```/g, "")
      .trim();
  } catch (e: any) {
    console.warn("Fallo Gemini en respuesta automática Modo B:", e.message);
  }

  if (!replyHtml) {
    replyHtml = `<p>Hola <b>${senderName}</b>, ¡gracias por escribirnos!</p>
<p>Recibí tu mensaje sobre <b>${subject}</b>. En <b>Servicio de Marketing Digital (SMD)</b> ayudamos a negocios de Argentina y el exterior hispanohablante a escalar sus ventas trabajando sobre 3 pilares: <b>Páginas de Aterrizaje de alta conversión</b>, <b>Tráfico Web (Anuncios + Posicionamiento en Buscadores e IA)</b> y <b>Gestión de Base de Datos</b>.</p>
<p><b>Por ejemplo:</b> Podemos armar para tu negocio una página de aterrizaje rápida pensada para celulares o activar una campaña directa hacia tu WhatsApp con diagnóstico comercial para transformar consultas en ventas reales.</p>
<p>Para analizar tu caso puntual sin costo y definir el Punto A y el Punto B de tu negocio, agendá acá una breve reunión online de 15 minutos conmigo o respondé este correo contándome a qué rubro te dedicás:<br/>
👉 <a href="https://cal.com/llamadas/15min"><b>https://cal.com/llamadas/15min</b></a></p>
<p>Un cordial saludo,<br/><b>Alan López</b><br/>Director • Servicio de Marketing Digital<br/><a href="https://www.serviciodemarketingdigital.com">www.serviciodemarketingdigital.com</a></p>`;
  }

  return replyHtml;
}

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
  const lastUid = await getLastProcessedUid();
  const imapResult = await fetchNewEmailsSinceUid(lastUid);

  const autoReplied: Array<{
    uid: number;
    to: string;
    subject: string;
    messageId?: string;
    copySentToAlan?: boolean;
  }> = [];

  if (imapResult.latestUid > lastUid) {
    // Guardar nuevo cursor inmediatamente para evitar respuestas duplicadas
    await saveLastProcessedUid(imapResult.latestUid);
  }

  for (const incoming of imapResult.emails) {
    if (isAutomatedOrInternalEmail(incoming.fromEmail, incoming.subject)) {
      continue;
    }

    const replyHtml = await generateCommercialReply(
      incoming.fromName,
      incoming.fromEmail,
      incoming.subject,
      incoming.bodyText
    );

    const replySubject = incoming.subject.toLowerCase().startsWith("re:")
      ? incoming.subject
      : `Re: ${incoming.subject}`;

    // 1. Enviar respuesta comercial automática inmediata al remitente (MODO B 24/7)
    const sentToProspect = await sendEmail({
      to: incoming.fromEmail,
      subject: replySubject,
      html: replyHtml,
    });

    // 2. Enviar copia en tiempo real a Alan López (alan.ezequiel95@gmail.com)
    const copyHtml = `<div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; color: #0f172a; line-height: 1.6;">
  <div style="background: #090d16; color: #ffffff; padding: 18px 22px; border-radius: 10px 10px 0 0; border-bottom: 3px solid #10b981;">
    <p style="margin: 0; font-size: 11px; color: #34d399; text-transform: uppercase;"><b>Modo B Activo 24/7 • Respuesta Automática Enviada</b></p>
    <h3 style="margin: 4px 0 0; font-size: 16px;">Cliente atendido: ${incoming.fromName} (&lt;${incoming.fromEmail}&gt;)</h3>
  </div>
  <div style="padding: 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px; background: #ffffff;">
    <p><b>📩 Mensaje recibido en hola@serviciodemarketingdigital.com:</b><br/>
    <i>Asunto:</i> ${incoming.subject}<br/>
    <i>Contenido:</i> ${incoming.bodyText}</p>
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 14px 0;"/>
    <p><b>🚀 Respuesta comercial enviada automáticamente por tu Agente SMD:</b></p>
    <div style="background: #f8fafc; padding: 14px; border-radius: 8px; border: 1px solid #cbd5e1;">
      ${replyHtml}
    </div>
  </div>
</div>`;

    const copyToAlan = await sendEmail({
      to: "alan.ezequiel95@gmail.com",
      subject: `📬 [Auto-Respuesta Modo B Enviada] A: ${incoming.fromEmail} (${incoming.subject})`,
      html: copyHtml,
    });

    autoReplied.push({
      uid: incoming.uid,
      to: incoming.fromEmail,
      subject: replySubject,
      messageId: sentToProspect.messageId,
      copySentToAlan: copyToAlan.success,
    });
  }

  return NextResponse.json({
    status: "HEALTHY",
    mode: "MODO_B_AUTO_REPLY_24_7",
    timestamp,
    monitored_mailbox: "hola@serviciodemarketingdigital.com",
    previous_uid: lastUid,
    current_uid: imapResult.latestUid,
    new_emails_found: imapResult.emails.length,
    auto_replied_count: autoReplied.length,
    auto_replied: autoReplied,
    imap_error: imapResult.error || null,
    message:
      autoReplied.length > 0
        ? `Se respondieron automáticamente ${autoReplied.length} correos entrantes y se envió copia a alan.ezequiel95@gmail.com.`
        : "Buzón IMAP revisado en vivo (Modo B 24/7 activo). Sin correos nuevos pendientes.",
  });
}

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

    const replyHtml = await generateCommercialReply(senderName, senderEmail, subject, message);
    const replySubject = subject.toLowerCase().startsWith("re:")
      ? subject
      : `Re: ${subject} - Servicio de Marketing Digital`;

    const sendRes = await sendEmail({
      to: senderEmail,
      subject: replySubject,
      html: replyHtml,
    });

    await sendEmail({
      to: "alan.ezequiel95@gmail.com",
      subject: `📬 [Auto-Respuesta Modo B Enviada] A: ${senderEmail} (${subject})`,
      html: `<p><b>Consulta recibida de:</b> ${senderName} (${senderEmail})</p><p><b>Mensaje:</b> ${message}</p><hr/><p><b>Respuesta enviada:</b></p>${replyHtml}`,
    });

    return NextResponse.json({
      success: sendRes.success,
      repliedTo: senderEmail,
      copySentTo: "alan.ezequiel95@gmail.com",
      subject: replySubject,
      messageId: sendRes.messageId,
      replyPreview: replyHtml,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
