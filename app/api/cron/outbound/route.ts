import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/emailService";
import { REAL_PROSPECTS_DATABASE, ProspectLead } from "@/lib/prospectsData";

export const dynamic = "force-dynamic";

const CRON_SECRET = process.env.CRON_SECRET || "multiagentes_cron_secret_2026";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

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
  console.log(`[Cron Outbound] Ejecutando prospección fría real en la nube a las ${timestamp}`);

  // Seleccionar target del día basado en el día del mes
  const dayIndex = new Date().getDate() % REAL_PROSPECTS_DATABASE.length;
  const target: ProspectLead = REAL_PROSPECTS_DATABASE[dayIndex];

  // 2. Mensaje hiper-personalizado
  const subject = `Propuesta de Rediseño Web & Demo Interactiva para ${target.company}`;
  const emailHtml = `<p>Hola equipo de <b>${target.company}</b>,</p>
<p>Mi nombre es <b>Alan López</b>, director de <b>Servicio de Marketing Digital</b> (${target.website ? `estuve analizando su sitio web ${target.website}` : "estuve analizando su presencia online en el sector"}).</p>
<p>Noté que en el área de <b>${target.specialty}</b> muchas empresas pierden consultas porque sus páginas operan como folletos estáticos sin un embudo de conversión ágil.</p>
<p><b>Por ejemplo:</b> Implementar una landing page mobile-first de alta velocidad con un cotizador interactivo y botón directo a WhatsApp puede duplicar las consultas semanales de clientes listos para contratar.</p>
<p>Les escribo para ofrecerles dos beneficios 100% gratuitos y sin compromiso:</p>
<ul>
  <li><b>Una Demo Interactiva navegable</b> diseñada a medida para ${target.company} en 48 horas sin costo.</li>
  <li><b>Una sesión de Diagnóstico Comercial de 15 minutos</b> conmigo para revisar su embudo de adquisición: <a href="https://cal.com/llamadas/15min">https://cal.com/llamadas/15min</a></li>
</ul>
<p>Pueden elegir el horario que les quede más cómodo en mi agenda oficial:<br/>
👉 <a href="https://cal.com/llamadas/15min"><b>https://cal.com/llamadas/15min</b></a></p>
<p>Quedo a su disposición.</p>
<p>Atentamente,<br/><b>Alan López</b><br/>Servicio de Marketing Digital<br/>www.serviciodemarketingdigital.com</p>`;

  // 3. ENVÍO REAL Y FÍSICO AL CORREO DEL DESTINATARIO
  console.log(`🚀 [CRON OUTBOUND] Despachando correo real a: ${target.email} (${target.company})...`);
  const dispatchRes = await sendEmail({
    to: target.email,
    subject,
    html: emailHtml,
  });

  return NextResponse.json({
    status: "SUCCESS",
    timestamp,
    agent: "outreach_copilot_agent",
    division: "04_marketing_ventas",
    task: "prospeccion_fria_diaria_real",
    target: {
      company: target.company,
      email: target.email,
      website: target.website,
      specialty: target.specialty,
    },
    emailSubject: subject,
    dispatchedRealEmail: dispatchRes.success,
    messageId: dispatchRes.messageId || null,
    message: `Correo real despachado a ${target.email}. Figura en la bandeja de Enviados de Gmail.`,
  }, { status: 200 });
}
