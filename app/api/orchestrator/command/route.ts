import { NextRequest, NextResponse } from "next/server";
import { orchestratorStore } from "@/lib/orchestratorStore";

export const dynamic = "force-dynamic";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const SYSTEM_ORCHESTRATOR_PROMPT = `# SYSTEM PROMPT: CEO ORQUESTADOR MAESTRO MULTIAGENTE (SMD)

## ROL Y CAPACIDADES
Eres el CEO Orquestador Central del Ecosistema Autónomo de Alan López en Servicio de Marketing Digital (SMD).
Coordinas 6 divisiones estratégicas:
1. División 01 CEO: Planificación SMART, investigación de mercado y buyer personas.
2. División 02 Admin & Finanzas: Unit economics, CAC, LTV y métricas de rentabilidad.
3. División 03 Producción Web: Landing pages Next.js ultra rápidas, CRO y SEO técnico/local.
4. División 04 Marketing & Ventas: Campañas en Meta Ads, prospección en frío y embudos de conversión.
5. División 05 Comunicación: WhatsApp Cloud Bot, email marketing y reactivación de base de datos a $0 CAC.
6. División 06 Ciberseguridad: Auditoría OWASP, cabeceras seguras y protección de credenciales.

## REGLA DE ORO DE CONTROL HUMANO (HITL)
Cuando Alan te dé una orden para ejecutar acciones en el mundo real (como enviar correos de prospección, crear una landing page, lanzar campañas o auditar un negocio), debes:
1. Analizar la directiva y definir el plan de acción concreto.
2. Delegar formalmente a las divisiones pertinentes con la locución "Por ejemplo" en cada acción estratégica.
3. Declarar que la acción queda encolada esperando su aprobación humana antes de despachar.

## FORMATO DE RESPUESTA
Responde con un informe ejecutivo estructurado:
- 🎯 **Meta SMART y Objetivo Cuantificable:** Qué se va a lograr (Punto B).
- 📋 **Plan de Acción por Divisiones:** Tareas concretas asignadas a los agentes con "Por ejemplo".
- 🛡️ **Puerta de Control Humano:** Estado de la solicitud de aprobación generada para Alan.`;

export async function GET() {
  return NextResponse.json({
    status: "ONLINE",
    engine: "MAS v2.5 Enterprise Cloud",
    divisions: [
      { id: "01_ceo", name: "Dirección Estratégica & Diagnóstico", agents: ["CEO Orchestrator", "Smart Validator", "Market Researcher"] },
      { id: "02_admin", name: "Administración & Finanzas", agents: ["Accounting & Unit Economics", "Analytics Agent"] },
      { id: "03_produccion", name: "Producción & Desarrollo Web", agents: ["Web Architect Next.js", "Copywriter", "GEO/AEO Optimizer"] },
      { id: "04_ventas", name: "Marketing, Tráfico & Ventas", agents: ["Funnel Builder", "Paid Traffic Meta Ads", "Outreach Copilot"] },
      { id: "05_comunicacion", name: "Comunicación & Base de Datos", agents: ["WhatsApp Cloud Bot", "Email Automation", "CRM Segmenter"] },
      { id: "06_seguridad", name: "Ciberseguridad & Resiliencia", agents: ["Cyber Guardian", "Zero Trust Auditor"] },
    ],
    pendingApprovals: orchestratorStore.getApprovals(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const instruction = body?.instruction?.trim();

    if (!instruction) {
      return NextResponse.json({ error: "La instrucción es obligatoria." }, { status: 400 });
    }

    let planOutput = "";

    // Invocar a Gemini 3.8 Flash para descomponer la directiva
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${SYSTEM_ORCHESTRATOR_PROMPT}\n\nDIRECTIVA DE ALAN LÓPEZ:\n${instruction}` }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.3,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      });
      const data = await res.json();
      planOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (err: any) {
      console.warn("Fallo Gemini en Orquestador Cloud:", err.message);
      planOutput = `Directiva recibida: "${instruction}". Se ha estructurado la orden para coordinar las 5 divisiones operativas.`;
    }

    // Crear solicitud de aprobación humana automática en la cola
    const approvalReq = orchestratorStore.createApproval({
      division: "01_ceo",
      agentName: "CEO Orchestrator Cloud",
      title: `Misión: ${instruction.slice(0, 45)}...`,
      description: instruction,
      actionType: "CUSTOM_MISSION",
      riskLevel: "MEDIO",
      payload: { instruction, planOutput },
    });

    return NextResponse.json({
      success: true,
      message: "Directiva procesada por el CEO Orquestador. Esperando tu confirmación humana para ejecutar.",
      plan: planOutput,
      approvalRequest: approvalReq,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
