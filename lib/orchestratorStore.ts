/**
 * Almacén y Coordinador de Estado Persistente en Supabase PostgreSQL para el Orquestador Cloud
 * 100% REAL:
 * 1. Persiste cada solicitud en Supabase (tabla `verification` con identifier='smd_orchestrator_approval').
 * 2. Cada vez que se genera una nueva solicitud en estado PENDING_APPROVAL, envía automáticamente
 *    un correo de alerta a alan.ezequiel95@gmail.com indicando que hay una tarea esperando su aprobación.
 */
import { REAL_PROSPECTS_DATABASE } from "./prospectsData";
import { sendEmail } from "./emailService";

export interface ApprovalRequest {
  id: string;
  createdAt: string;
  division: string;
  agentName: string;
  title: string;
  description: string;
  actionType:
    | "OUTBOUND_EMAIL"
    | "LANDING_UPDATE"
    | "CAMPAIGN_LAUNCH"
    | "DIAGNOSTIC_DISPATCH"
    | "CUSTOM_MISSION"
    | "INBOX_REPLY";
  status: "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
  riskLevel: "BAJO" | "MEDIO" | "ALTO";
  payload: any;
  result?: any;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://smvhwaeppoigxmbiccjw.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const APPROVAL_IDENTIFIER = "smd_orchestrator_approval";
const ALAN_PERSONAL_EMAIL = "alan.ezequiel95@gmail.com";

const defaultSeedRequest: ApprovalRequest = {
  id: "REQ-OUT-REAL-001",
  createdAt: new Date().toISOString(),
  division: "04_marketing_ventas",
  agentName: "Outreach Copilot Agent",
  title: "Prospección Fría Real: Despacho a 5 Empresas B2B",
  description:
    "Despachar 5 correos reales y personalizados a Seonet Digital, Point Web, MD Marketing Digital, Agencia Buffalo y Ridyn Digital ofreciendo Demo Gratuita y Diagnóstico de 15 min.",
  actionType: "OUTBOUND_EMAIL",
  status: "PENDING_APPROVAL",
  riskLevel: "MEDIO",
  payload: {
    leads: REAL_PROSPECTS_DATABASE.slice(0, 5),
  },
};

const memoryCache: Map<string, ApprovalRequest> = new Map([
  [defaultSeedRequest.id, defaultSeedRequest],
]);

async function notifyAlanPendingApproval(item: ApprovalRequest): Promise<void> {
  try {
    const planPreview = item.payload?.planOutput
      ? String(item.payload.planOutput)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
          .replace(/\n/g, "<br/>")
      : "";

    const html = `<div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; color: #0f172a; line-height: 1.6;">
  <div style="background: #090d16; color: #ffffff; padding: 20px 24px; border-radius: 12px 12px 0 0; border-bottom: 3px solid #f59e0b;">
    <p style="margin: 0; font-size: 11px; color: #fbbf24; text-transform: uppercase; letter-spacing: 1px;">
      <b>🔔 Alerta Human-in-the-Loop • Requiere tu Aprobación</b>
    </p>
    <h2 style="margin: 6px 0 0; font-size: 18px;">Nueva petición pendiente en /orquestador (${item.id})</h2>
  </div>

  <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; background: #ffffff;">
    <p>Hola <b>Alan</b>,</p>
    <p>Hay una nueva tarea retenida en la <b>Puerta de Control Humano</b> esperando tu confirmación antes de ejecutarse:</p>

    <table style="width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 13.5px;">
      <tr>
        <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; width: 140px;"><b>ID de Solicitud:</b></td>
        <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-family: monospace;">${item.id}</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0;"><b>Agente / División:</b></td>
        <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${item.agentName} (${item.division})</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0;"><b>Nivel de Riesgo:</b></td>
        <td style="padding: 8px 12px; border: 1px solid #e2e8f0;"><b>${item.riskLevel}</b></td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0;"><b>Título:</b></td>
        <td style="padding: 8px 12px; border: 1px solid #e2e8f0;"><b>${item.title}</b></td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0;"><b>Descripción:</b></td>
        <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${item.description}</td>
      </tr>
    </table>

    ${
      planPreview
        ? `<div style="margin-top: 16px;">
      <p style="margin-bottom: 6px; font-size: 13px; color: #ea580c;"><b>📋 Plan Formulado por el Orquestador (Vista Previa):</b></p>
      <div style="background: #f8fafc; padding: 14px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 13px;">
        ${planPreview}
      </div>
    </div>`
        : ""
    }

    <div style="margin: 24px 0 12px; text-align: center;">
      <a href="https://www.serviciodemarketingdigital.com/orquestador"
         style="display: inline-block; background: #ea580c; color: #ffffff; text-decoration: none; font-weight: bold; padding: 14px 26px; border-radius: 10px; font-size: 14px;">
        👉 Entrar a /orquestador para Aprobar o Rechazar (PIN: 3152)
      </a>
    </div>

    <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 16px;">
      Ninguna acción se ejecutará hasta que presiones <b>"Aprobar y Ejecutar"</b> en tu panel.
    </p>
  </div>
</div>`;

    await sendEmail({
      to: ALAN_PERSONAL_EMAIL,
      subject: `🔔 [Pendiente de tu Aprobación] (${item.id}) ${item.title}`,
      html,
    });
  } catch (err) {
    console.warn("Aviso enviando notificación de aprobación pendiente a Alan:", err);
  }
}

async function saveToSupabase(item: ApprovalRequest): Promise<void> {
  memoryCache.set(item.id, item);
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
        id: item.id,
        identifier: APPROVAL_IDENTIFIER,
        value: JSON.stringify(item),
        expiresAt: expires,
        createdAt: item.createdAt || now,
        updatedAt: now,
      }),
    });
  } catch (e) {
    console.warn("Aviso guardando solicitud en Supabase:", e);
  }
}

async function loadAllFromSupabase(): Promise<ApprovalRequest[]> {
  if (!SUPABASE_KEY) {
    return Array.from(memoryCache.values());
  }
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/verification?identifier=eq.${APPROVAL_IDENTIFIER}&order=createdAt.desc&limit=30`,
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
        const parsed: ApprovalRequest[] = [];
        for (const r of rows) {
          try {
            const item = JSON.parse(r.value) as ApprovalRequest;
            memoryCache.set(item.id, item);
            parsed.push(item);
          } catch {}
        }
        if (!memoryCache.has(defaultSeedRequest.id)) {
          parsed.push(defaultSeedRequest);
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Aviso leyendo solicitudes de Supabase:", e);
  }
  return Array.from(memoryCache.values());
}

export const orchestratorStore = {
  async getApprovalsAsync(): Promise<ApprovalRequest[]> {
    return await loadAllFromSupabase();
  },

  getApprovals(): ApprovalRequest[] {
    return Array.from(memoryCache.values());
  },

  async getApprovalByIdAsync(id: string): Promise<ApprovalRequest | undefined> {
    if (memoryCache.has(id)) return memoryCache.get(id);
    const all = await loadAllFromSupabase();
    return all.find((a) => a.id === id);
  },

  getApprovalById(id: string): ApprovalRequest | undefined {
    return memoryCache.get(id);
  },

  async createApprovalAsync(
    req: Omit<ApprovalRequest, "id" | "createdAt" | "status">
  ): Promise<ApprovalRequest> {
    const newReq: ApprovalRequest = {
      ...req,
      id: `REQ-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: "PENDING_APPROVAL",
    };
    await saveToSupabase(newReq);
    // Enviar alerta inmediata por correo a alan.ezequiel95@gmail.com
    await notifyAlanPendingApproval(newReq);
    return newReq;
  },

  createApproval(
    req: Omit<ApprovalRequest, "id" | "createdAt" | "status">
  ): ApprovalRequest {
    const newReq: ApprovalRequest = {
      ...req,
      id: `REQ-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: "PENDING_APPROVAL",
    };
    saveToSupabase(newReq).catch(() => {});
    notifyAlanPendingApproval(newReq).catch(() => {});
    return newReq;
  },

  async updateApprovalStatusAsync(
    id: string,
    status: "APPROVED" | "REJECTED",
    result?: any,
    fallbackItem?: ApprovalRequest
  ): Promise<ApprovalRequest | null> {
    let item = await this.getApprovalByIdAsync(id);
    if (!item && fallbackItem) {
      item = fallbackItem;
    }
    if (!item) return null;
    item.status = status;
    if (result) item.result = result;
    await saveToSupabase(item);
    return item;
  },

  updateApprovalStatus(
    id: string,
    status: "APPROVED" | "REJECTED",
    result?: any
  ): ApprovalRequest | null {
    const item = memoryCache.get(id);
    if (!item) return null;
    item.status = status;
    if (result) item.result = result;
    saveToSupabase(item).catch(() => {});
    return item;
  },
};
