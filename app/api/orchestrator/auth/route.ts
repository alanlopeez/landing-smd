import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pin = body?.pin?.trim();
    const masterPin = process.env.ORCHESTRATOR_PIN || "2026";

    if (pin === masterPin) {
      return NextResponse.json({
        success: true,
        message: "Acceso autorizado al Centro de Control Maestro",
        token: "smd_auth_session_authorized"
      });
    } else {
      return NextResponse.json(
        { success: false, error: "PIN de seguridad incorrecto" },
        { status: 401 }
      );
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: "Petición inválida" }, { status: 400 });
  }
}
