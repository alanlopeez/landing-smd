/**
 * Almacén y Coordinador de Estado para el Orquestador Multiagente en la Nube
 * 100% REAL: Cero simulaciones. Gestiona solicitudes de ejecución directa.
 */
import { REAL_PROSPECTS_DATABASE, ProspectLead } from "./prospectsData";

export interface ApprovalRequest {
  id: string;
  createdAt: string;
  division: string;
  agentName: string;
  title: string;
  description: string;
  actionType: "OUTBOUND_EMAIL" | "LANDING_UPDATE" | "CAMPAIGN_LAUNCH" | "DIAGNOSTIC_DISPATCH" | "CUSTOM_MISSION";
  status: "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
  riskLevel: "BAJO" | "MEDIO" | "ALTO";
  payload: any;
  result?: any;
}

// Solicitudes activas reales
const globalApprovals: ApprovalRequest[] = [
  {
    id: "REQ-OUT-REAL-001",
    createdAt: new Date().toISOString(),
    division: "04_marketing_ventas",
    agentName: "Outreach Copilot Agent",
    title: "Prospección Fría Real: Despacho a 5 Empresas B2B",
    description: "Despachar 5 correos reales y personalizados a las siguientes empresas: Seonet Digital, Point Web, MD Marketing Digital, Agencia Buffalo y Ridyn Digital, ofreciendo Demo Gratuita y Diagnóstico de 15 min.",
    actionType: "OUTBOUND_EMAIL",
    status: "PENDING_APPROVAL",
    riskLevel: "MEDIO",
    payload: {
      leads: REAL_PROSPECTS_DATABASE.slice(0, 5),
    },
  },
];

export const orchestratorStore = {
  getApprovals(): ApprovalRequest[] {
    return globalApprovals;
  },

  getApprovalById(id: string): ApprovalRequest | undefined {
    return globalApprovals.find((a) => a.id === id);
  },

  createApproval(req: Omit<ApprovalRequest, "id" | "createdAt" | "status">): ApprovalRequest {
    const newReq: ApprovalRequest = {
      ...req,
      id: `REQ-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: "PENDING_APPROVAL",
    };
    globalApprovals.unshift(newReq);
    return newReq;
  },

  updateApprovalStatus(id: string, status: "APPROVED" | "REJECTED", result?: any): ApprovalRequest | null {
    const item = globalApprovals.find((a) => a.id === id);
    if (!item) return null;
    item.status = status;
    if (result) item.result = result;
    return item;
  },
};
