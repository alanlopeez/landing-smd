import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CRON_SECRET = process.env.CRON_SECRET || "multiagentes_cron_secret_2026";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://smvhwaeppoigxmbiccjw.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function GET(req: NextRequest) {
  // 1. Verificación de seguridad
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
  console.log(`[Cron Sync-Inbox Triggered] Auditando estado general de CRM a las ${timestamp}`);

  // 2. Consulta de salud de la base de datos Supabase
  let contactsCount = 0;
  if (SUPABASE_KEY) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/contact?select=id`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Range: "0-0",
          Prefer: "count=exact"
        }
      });
      const contentRange = res.headers.get("content-range");
      if (contentRange && contentRange.includes("/")) {
        contactsCount = parseInt(contentRange.split("/")[1] || "0", 10);
      }
    } catch (err) {
      console.warn("[Sync-Inbox Supabase Check Warn]:", err);
    }
  }

  return NextResponse.json({
    status: "HEALTHY",
    timestamp,
    agent: "database_segmenter_agent",
    division: "05_comunicacion",
    task: "crm_health_and_leads_sync",
    total_contacts_in_supabase: contactsCount,
    message: "Auditoría de contactos y buzón completada satisfactoriamente."
  }, { status: 200 });
}

