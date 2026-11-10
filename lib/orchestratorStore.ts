/**
 * Almacén y Coordinador de Estado para el Orquestador Multiagente en la Nube
 * Gestiona solicitudes de aprobación humana (HITL), tareas por división y eventos.
 */

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

// Cola de aprobaciones en memoria con persistencia en Supabase (híbrido)
const globalApprovals: ApprovalRequest[] = [
  {
    id: "REQ-OUT-001",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    division: "04_marketing_ventas",
    agentName: "Outreach Copilot Agent",
    title: "Prospección Fría Diaria: Lote de 5 Negocios Locales",
    description: "Enviar 5 correos personalizados a comercios de la zona ofreciendo una Demo Interactiva gratuita de rediseño web y sesión de diagnóstico online de 15 min.",
    actionType: "OUTBOUND_EMAIL",
    status: "PENDING_APPROVAL",
    riskLevel: "MEDIO",
    payload: {
      count: 5,
      channel: "email",
      template: "rediseño_web_demo_gratis",
      calendarLink: "https://cal.com/llamadas/15min"
    }
  },
  {
    id: "REQ-DIAG-002",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    division: "01_ceo",
    agentName: "Smart Validator & Diagnostic Agent",
    title: "Emisión de Auditoría Oficial: Rapizza (Punto A -> Punto B)",
    description: "Compilar el informe de 21 puntos (65/105 pts - Nivel en Desarrollo) y despachar notificación por correo con estrategias en los 3 pilares de SMD.",
    actionType: "DIAGNOSTIC_DISPATCH",
    status: "APPROVED",
    riskLevel: "BAJO",
    payload: {
      businessName: "Rapizza",
      score: 65,
      maturity: "Nivel en Desarrollo"
    },
    result: "PDF generado y enviado a hola@serviciodemarketingdigital.com con copia en Google Drive."
  }
];

export const orchestratorStore = {
  getApprovals(): ApprovalRequest[] {
    return globalApprovals;
  },

  getApprovalById(id: string): ApprovalRequest | undefined {
    return globalApprovals.find(a => a.id === id);
  },

  createApproval(req: Omit<ApprovalRequest, "id" | "createdAt" | "status">): ApprovalRequest {
    const newReq: ApprovalRequest = {
      ...req,
      id: `REQ-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: "PENDING_APPROVAL"
    };
    globalApprovals.unshift(newReq);
    return newReq;
  },

  updateApprovalStatus(id: string, status: "APPROVED" | "REJECTED", result?: any): ApprovalRequest | null {
    const item = globalApprovals.find(a => a.id === id);
    if (!item) return null;
    item.status = status;
    if (result) item.result = result;
    return item;
  }
};
