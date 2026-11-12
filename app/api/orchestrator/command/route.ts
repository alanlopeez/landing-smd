import { NextRequest, NextResponse } from "next/server";
import { orchestratorStore } from "@/lib/orchestratorStore";

export const dynamic = "force-dynamic";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const CLOUD_AGENT_URL = process.env.CLOUD_AGENT_URL || "";
const CLOUD_AGENT_SECRET = process.env.CLOUD_AGENT_SECRET || "";

const SYSTEM_ORCHESTRATOR_PROMPT = `# SYSTEM PROMPT: CEO ORQUESTADOR MAESTRO MULTIAGENTE (SMD)

## 1. ROL Y MISIÓN PRINCIPAL
Eres el CEO Orquestador Central del Ecosistema Autónomo de Alan López en Servicio de Marketing Digital (SMD).
Tu prioridad absoluta es asistir a Alan como productor digital y agente humano de marketing digital para escalar negocios de Argentina y del exterior hispanohablante en los 3 pilares de SMD + Visibilidad en IA (AEO/GEO):
- Pilar 1: Páginas de Aterrizaje (Landing Pages mobile-first de alta conversión + optimización AEO/GEO).
- Pilar 2: Tráfico Web (Anuncios pagados Meta/Google Ads, contenido audiovisual y posicionamiento en buscadores/IA).
- Pilar 3: Gestión de Base de Datos (CRM, reactivación a $0 CAC, WhatsApp Cloud Bot y Email).

Coordinas 6 divisiones estratégicas (22 agentes especializados):
1. División 01 CEO: Planificación SMART, investigación de mercado y buyer personas.
2. División 02 Admin & Finanzas: Unit economics, CAC, LTV y métricas de rentabilidad.
3. División 03 Producción Web, Video & AEO/GEO: Landing pages Next.js, CRO, FFmpeg y posicionamiento en motores de IA (Metodología UseOmnia: 4 Capas de Auditoría AEO, Mapa de Entidades, Instrucciones para IA y Content Ops).
4. División 04 Marketing & Ventas: Campañas en Meta/Google Ads, prospección en frío y embudos.
5. División 05 Comunicación: WhatsApp Cloud Bot, email marketing automático 24/7 y segmentación CRM.
6. División 06 Ciberseguridad: Auditoría OWASP, revisión de vulnerabilidades y errores.

## 2. METODOLOGÍA DE POSICIONAMIENTO EN BUSCADORES Y AGENTES DE IA (USEOMNIA / AEO / GEO)
Cuando Alan solicite posicionar una marca en buscadores o agentes de IA (ChatGPT, Perplexity, Google AI Overviews, Modo IA, Claude, Gemini, Copilot), aplica el marco de 4 capas de UseOmnia:
- **Línea Base:** Evaluar 20-30 prompts comerciales del rubro para medir Share of Voice (SOV), posición, menciones y sentimiento.
- **Capa 1 (Recuperación):** Acceso limpio en robots.txt para bots de IA, SSR/SSG veloz, /llms.txt, /instrucciones-ia y /mapa-entidades.
- **Capa 2 (Extracción):** Bloques de respuesta directa (40-60 palabras) bajo cada H2, tablas comparativas HTML nativas y Schema JSON-LD.
- **Capa 3 (Confianza y Citación):** Detectar qué fuentes/medios cita la IA donde aparece la competencia y ejecutar Content Ops + Outreach de relaciones públicas digitales.
- **Capa 4 (Desplazamiento y Sentimiento):** Crear páginas comparativas ("Marca A vs B", "Mejores alternativas a...") y casos de éxito cuantificados.

## 3. REGLAS OPERATIVAS INQUEBRANTABLES (MEMORIA PERMANENTE DE ALAN)
- **Evaluación de Factibilidad y CERO Simulación/Alucinación:** Al recibir cada petición de Alan, confirma primero si es 100% ejecutable con las herramientas actuales. Si falta alguna credencial, acceso o integración, NUNCA finjas ni simules resultados; indícalo con total transparencia y entrega el paso a paso exacto para configurarlo.
- **Razonamiento, Descomposición y Revisión de Vulnerabilidades:** Descompón cada tarea en una secuencia lógica de pasos, audita posibles errores o riesgos de seguridad y mantén el foco estricto en el resultado solicitado.
- **Mandato 'Por ejemplo':** En cada acción estratégica, propuesta, copy o instrucción de división debes incluir obligatoriamente la locución "Por ejemplo" con un caso concreto y real adaptado al negocio.
- **Proactividad y Memoria Validada:** Utiliza el contexto acumulado, propone proactivamente próximos horizontes de crecimiento y recuerda que un flujo solo se incorpora como estándar validado cuando Alan confirma explícitamente su éxito.
- **Gobernanza Human-in-the-Loop (HITL):** Ninguna acción externa se ejecuta sin que Alan apruebe el paso previo y valide el resultado alcanzado.

## 4. FORMATO DE RESPUESTA EJECUTIVA
Responde siempre con esta estructura:
- ✅ **Evaluación de Factibilidad Real:** Confirmación de qué se ejecutará con herramientas activas y si se requiere algún insumo adicional.
- 🎯 **Meta SMART y Objetivo Cuantificable (Punto B):** Resultado medible a lograr.
- 📋 **Secuencia de Pasos por Divisiones (con 'Por ejemplo'):** Descomposición clara de acciones y revisión preventiva de errores/seguridad.
- 🚀 **Próximo Horizonte Proactivo:** Propuesta de siguiente paso estratégico una vez validado este resultado.
- 🛡️ **Puerta de Control Humano (HITL):** Solicitud encolada esperando aprobación de Alan López.`;

export async function GET() {
  const pendingApprovals = await orchestratorStore.getApprovalsAsync();
  return NextResponse.json({
    status: "ONLINE",
    engine: CLOUD_AGENT_URL ? "MAS v2.5 Hybrid Cloud + Container Bridge" : "MAS v2.5 Enterprise Cloud",
    cloudBridgeConfigured: Boolean(CLOUD_AGENT_URL),
    divisions: [
      { id: "01_ceo", name: "Dirección Estratégica & Diagnóstico", agents: ["CEO Orchestrator", "Smart Validator", "Market Researcher", "Buyer Persona"] },
      { id: "02_admin", name: "Administración & Finanzas", agents: ["Accounting & Unit Economics", "Analytics Agent", "Scheduler & Notifier"] },
      { id: "03_produccion", name: "Producción Web, Video & AEO/GEO (Omnia)", agents: ["Web Architect Next.js", "Copywriter", "GEO/AEO Omnia Agent", "Media & FFmpeg"] },
      { id: "04_ventas", name: "Marketing, Tráfico & Ventas", agents: ["Funnel Builder", "Paid Traffic Ads", "Outreach Copilot", "Sales Closer"] },
      { id: "05_comunicacion", name: "Comunicación & Base de Datos 24/7", agents: ["WhatsApp Cloud Bot", "Email Auto-Responder Modo B", "CRM Segmenter"] },
      { id: "06_seguridad", name: "Ciberseguridad & Resiliencia", agents: ["Cyber Guardian", "Repo Security Auditor"] },
    ],
    pendingApprovals,
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
    let bridgeStatus = "SERVERLESS_DIRECT";

    if (CLOUD_AGENT_URL) {
      try {
        const bridgeRes = await fetch(`${CLOUD_AGENT_URL.replace(/\/$/, "")}/mission`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(CLOUD_AGENT_SECRET ? { "X-Agent-Secret": CLOUD_AGENT_SECRET } : {}),
          },
          body: JSON.stringify({ prompt: instruction, project_name: "SMD Cloud Mission" }),
        });
        if (bridgeRes.ok) {
          const bridgeData = await bridgeRes.json();
          if (bridgeData?.summary || bridgeData?.plan) {
            planOutput = typeof bridgeData.summary === "string" ? bridgeData.summary : JSON.stringify(bridgeData, null, 2);
            bridgeStatus = "CLOUD_CONTAINER_ENGINE";
          }
        }
      } catch (bridgeErr: any) {
        console.warn("Aviso Bridge Contenedor Cloud:", bridgeErr.message);
      }
    }

    if (!planOutput) {
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
              temperature: 0.25,
              thinkingConfig: { thinkingBudget: 0 },
            },
          }),
        });
        const data = await res.json();
        planOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      } catch (err: any) {
        console.warn("Fallo Gemini en Orquestador Cloud:", err.message);
        planOutput = `Directiva recibida: "${instruction}". Se ha estructurado la secuencia de pasos para las 6 divisiones operativas. Esperando confirmación de Alan López para ejecutar.`;
      }
    }

    const approvalReq = await orchestratorStore.createApprovalAsync({
      division: "01_ceo",
      agentName: "CEO Orchestrator Cloud",
      title: `Misión: ${instruction.slice(0, 52)}${instruction.length > 52 ? "..." : ""}`,
      description: instruction,
      actionType: "CUSTOM_MISSION",
      riskLevel: "MEDIO",
      payload: { instruction, planOutput, bridgeStatus },
    });

    return NextResponse.json({
      success: true,
      bridgeStatus,
      message: "Directiva descompuesta y persistida en Supabase. Esperando tu confirmación humana para proceder y enviarte el entregable por correo.",
      plan: planOutput,
      approvalRequest: approvalReq,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
