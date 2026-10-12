import { NextRequest, NextResponse } from "next/server";
import { CONVERSATION_RESPONSES, findBestResponse } from "@/lib/conversationRepository";

export const dynamic = "force-dynamic";

// GET: Devuelve todas las respuestas aprobadas del repositorio organizadas por categoría y etapa
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const stage = searchParams.get("stage");
  const category = searchParams.get("category");

  let filtered = [...CONVERSATION_RESPONSES];

  if (stage !== null && stage !== undefined) {
    const stageNum = parseInt(stage, 10);
    if (!isNaN(stageNum)) {
      filtered = filtered.filter((r) => r.targetStage === stageNum);
    }
  }

  if (category) {
    filtered = filtered.filter((r) => r.category === category);
  }

  return NextResponse.json({
    status: "OK",
    total: filtered.length,
    responses: filtered,
  });
}

// POST: Simulador y buscador inteligente de respuestas según el mensaje del usuario
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message = "", stage = 0, name = "Prospecto", company = "Negocio" } = body;

    const result = findBestResponse(message, stage, name, company);

    return NextResponse.json({
      status: "OK",
      query: message,
      result,
    });
  } catch (err: any) {
    return NextResponse.json({ status: "ERROR", error: err.message }, { status: 400 });
  }
}
