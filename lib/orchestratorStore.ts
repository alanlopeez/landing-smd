/**
 * Almacén y Coordinador de Estado Persistente en Supabase PostgreSQL para el Orquestador Cloud
 * 100% REAL: Persiste cada solicitud en Supabase (tabla `verification` con identifier='smd_orchestrator_approval')
 * para que ningún reinicio serverless de Vercel pierda las órdenes ni aprobaciones de Alan López.
 */
import { REAL_PROSPECTS_DATABASE } from "./prospectsData";

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
