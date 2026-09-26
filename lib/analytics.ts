/**
 * Analytics and Conversion Tracking for Google Ads and GA4
 * Optimizado para Smart Bidding: Solo envía conversión primaria en leads calificados.
 */

export interface QualificationData {
  name: string;
  company: string; // Nombre y sitio web / red social de la empresa
  email: string;
  phone?: string;
  whatsapp?: string;
  businessType: string; // Rubro o modelo de negocio
  adBudget: string; // Rango de facturación o presupuesto mensual
  companyRole: string; // Rol en la empresa
  isQualified?: boolean;
  notes?: string;
  timestamp?: string;
}

export const WHATSAPP_PHONE =
  process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "5491127887093";

/**
 * Criterio estricto de calificación:
 * - Calificado: Presupuesto >= USD 500 con rol de toma de decisiones (Dueño, Socio, Director, Gerente),
 *   o Presupuesto alto (> USD 1.500) en cualquier caso.
 * - No Calificado: Presupuesto inferior a USD 500 o empleados/asistentes sin capacidad de inversión.
 */
export function evaluateLeadQualification(
  adBudget: string,
  companyRole: string
): boolean {
  if (adBudget === "Menos de USD 500") {
    return false;
  }

  if (
    companyRole.toLowerCase().includes("empleado") ||
    companyRole.toLowerCase().includes("asistente")
  ) {
    // Si es empleado pero la empresa maneja más de 1.500 USD, puede calificar para evaluación
    return adBudget === "Más de USD 1.500";
  }

  return true;
}

/**
 * Genera la URL de WhatsApp con mensaje precargado con todos los datos de calificación
 */
export function buildWhatsAppPreloadedUrl(data: QualificationData): string {
  const lines = [
    "Hola Alan, completé el formulario de calificación en la web:",
    `• Nombre: ${data.name || "N/A"}`,
    `• Empresa / Web: ${data.company || "N/A"}`,
    `• Rubro: ${data.businessType || "N/A"}`,
    `• Presupuesto mensual / Facturación: ${data.adBudget || "N/A"}`,
    `• Rol: ${data.companyRole || "N/A"}`,
    "",
    "Me gustaría coordinar una llamada y recibir la propuesta técnica para mi empresa.",
  ];

  const message = lines.join("\n");
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Disparo de Evento de Conversión para Google Ads y Google Analytics 4
 * CRÍTICO: El evento primario sólo se dispara si el lead está CALIFICADO.
 * Esto orienta el Smart Bidding de Google Ads hacia usuarios con perfil de compra real.
 */
export function trackLeadConversion(data: QualificationData, isQualified: boolean) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];

  // 1. Registro estructurado en dataLayer
  window.dataLayer.push({
    event: isQualified ? "qualified_lead_submitted" : "unqualified_lead_submitted",
    lead_status: isQualified ? "qualified" : "unqualified",
    business_type: data.businessType,
    ad_budget: data.adBudget,
    company_role: data.companyRole,
    company: data.company,
  });

  if (typeof window.gtag === "function") {
    if (isQualified) {
      // EVENTO PRIMARIO GA4: Lead Calificado
      window.gtag("event", "qualified_lead", {
        event_category: "Leads",
        event_label: "Formulario Calificado B2B",
        business_type: data.businessType,
        ad_budget: data.adBudget,
        company_role: data.companyRole,
        value: data.adBudget === "Más de USD 1.500" ? 1500 : 750,
        currency: "USD",
      });

      // EVENTO ESTÁNDAR GOOGLE ADS: Generación de Lead Calificado
      window.gtag("event", "generate_lead", {
        lead_quality: "qualified",
        business_type: data.businessType,
        value: data.adBudget === "Más de USD 1.500" ? 1500 : 750,
        currency: "USD",
      });

      // Conversión directa si se define ID específico de Google Ads
      const adsConversionId = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID;
      const adsConversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
      if (adsConversionId && adsConversionLabel) {
        window.gtag("event", "conversion", {
          send_to: `${adsConversionId}/${adsConversionLabel}`,
          value: data.adBudget === "Más de USD 1.500" ? 1500 : 750,
          currency: "USD",
        });
      }
    } else {
      // EVENTO SECUNDARIO / DE OBSERVACIÓN (No cuenta como conversión primaria en Smart Bidding)
      window.gtag("event", "unqualified_submission", {
        event_category: "Leads",
        event_label: "Lead Descalificado por Presupuesto/Rol",
        business_type: data.businessType,
        ad_budget: data.adBudget,
        company_role: data.companyRole,
      });
    }
  }
}
