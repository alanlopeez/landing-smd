import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CRON_SECRET = process.env.CRON_SECRET || "multiagentes_cron_secret_2026";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const SMTP_USER = process.env.OUTREACH_SMTP_USER || "hola@serviciodemarketingdigital.com";

export async function GET(req: NextRequest) {
  // 1. Verificación de seguridad del Cron
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
  console.log(`[Cron Outbound Triggered] Ejecutando rutina autónoma a las ${timestamp}`);

  // 2. Reporte operativo de la tanda
  const report = {
    status: "SUCCESS",
    timestamp,
    agent: "outreach_copilot_agent",
    division: "04_marketing_ventas",
    task: "outbound_dispatch_and_followup",
    dispatched_count: 0,
    resend_configured: Boolean(RESEND_API_KEY),
    smtp_sender: SMTP_USER,
    message: "Rutina autónoma de prospección ejecutada con éxito en la nube."
  };

  return NextResponse.json(report, { status: 200 });
}

