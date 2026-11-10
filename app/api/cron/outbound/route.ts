import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/emailService";

export const dynamic = "force-dynamic";

const CRON_SECRET = process.env.CRON_SECRET || "multiagentes_cron_secret_2026";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

// Lista de nichos locales prioritarios para prospección diaria
const PROSPECT_TARGETS = [
  { business: "Clínica Dental & Estética", contact: "Director Médico", city: "Buenos Aires" },
  { business: "Estudio Jurídico & Contable", contact: "Socio Titular", city: "Zona Norte" },
  { business: "Concesionaria Náutica & Lanchas", contact: "Gerente Comercial", city: "Tigre" },
  { business: "Constructora & Desarrollos Inmobiliarios", contact: "Responsable de Ventas", city: "CABA" },
  { business: "Mueblería & Colchonería Premium", contact: "Dueño / Fundador", city: "Lanús" },
];

export async function GET(req: NextRequest) {
  // 1. Verificación de seguridad del cron
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
  console.log(`[Cron Outbound] Ejecutando prospección fría autónoma a las ${timestamp}`);

  // Seleccionar target del día basado en el día del mes
  const dayIndex = new Date().getDate() % PROSPECT_TARGETS.length;
  const target = PROSPECT_TARGETS[dayIndex];

  // 2. Generar el mensaje de prospección personalizado con Gemini
  let subject = `Propuesta de Rediseño Web y Demo Interactiva para ${target.business}`;
  let emailHtml = "";

  try {
    const prompt = `Genera un correo de prospección en frío hiper-personalizado, ejecutivo, profesional y persuasivo dirigido al ${target.contact} de una ${target.business} en ${target.city}.
El correo lo envía Alan López, director de Servicio de Marketing Digital (www.serviciodemarketingdigital.com).
Propuesta de valor:
1. Le ofrecemos desarrollar un prototipo o Demo Interactiva de su nueva página web mobile-first 100% gratuita y sin compromiso, entregada en 48 horas.
2. Agendar una videollamada de 15 minutos para hacer un diagnóstico comercial de su negocio y revisar sus números: https://cal.com/llamadas/15min.
3. Resalta que una web no debe ser un folleto digital sino un motor de ventas conectado a WhatsApp y campañas de tráfico.
4. Usa la locución 'Por ejemplo' con un ejemplo concreto para su rubro (${target.business}).
5. Cero tecnicismos confusos, tono consultivo y directo.
Devuelve el resultado en formato HTML limpio con párrafos <p>, negritas <b> y enlaces <a href="...">.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_API_KEY}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 1500,
          temperature: 0.4,
          thinkingConfig: { thinkingBudget: 0 }
        }
      })
    });
    const data = await res.json();
    emailHtml = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (err: any) {
    console.warn("Fallo generación IA en Outbound:", err.message);
  }

  if (!emailHtml) {
    emailHtml = `<p>Hola estimado ${target.contact},</p>
<p>Mi nombre es <b>Alan López</b>, director de <b>Servicio de Marketing Digital</b>. Estuve analizando la presencia digital en el rubro de <b>${target.business}</b> en ${target.city} y noté que la gran mayoría de las páginas web operan como folletos estáticos que no convierten visitas en clientes reales.</p>
<p><b>Por ejemplo:</b> En tu sector, una landing page mobile-first de alta velocidad con un cotizador interactivo y botón directo a WhatsApp puede duplicar las consultas semanales de clientes listos para contratar.</p>
<p>Te escribo para ofrecerte dos beneficios concretos y 100% gratuitos:</p>
<ul>
  <li><b>Una Demo Interactiva navegable</b> diseñada a medida para tu empresa en 48 horas, sin ningún costo ni compromiso.</li>
  <li><b>Una sesión de Diagnóstico Comercial de 15 minutos</b> conmigo para revisar tu embudo actual y definir tus metas de ventas.</li>
</ul>
<p>Podés elegir el horario que te quede más cómodo directamente en mi agenda oficial:<br/>
👉 <a href="https://cal.com/llamadas/15min"><b>https://cal.com/llamadas/15min</b></a></p>
<p>Quedo a tu entera disposición.</p>
<p>Atentamente,<br/><b>Alan López</b><br/>Servicio de Marketing Digital<br/>www.serviciodemarketingdigital.com</p>`;
  }

  // 3. Enviar copia de control a Alan o al target
  const dispatchRes = await sendEmail({
    to: "hola@serviciodemarketingdigital.com",
    subject: `[PROSPECCIÓN DIARIA GENERADA] ${subject}`,
    html: `<div style="background:#f1f5f9;padding:12px;border-radius:8px;margin-bottom:16px;">
      <b>Copia de Auditoría de Envío Diario</b> | Nicho: ${target.business} (${target.city}) | Remitente: Alan López
    </div>${emailHtml}`
  });

  return NextResponse.json({
    status: "SUCCESS",
    timestamp,
    agent: "outreach_copilot_agent",
    division: "04_marketing_ventas",
    task: "prospeccion_fria_diaria_web_y_demo",
    target,
    emailSubject: subject,
    dispatched: dispatchRes.success,
    messageId: dispatchRes.messageId || null,
    message: "Rutina autónoma de prospección diaria ejecutada con éxito en la nube."
  }, { status: 200 });
}
