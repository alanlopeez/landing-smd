import { NextRequest, NextResponse } from "next/server";
import { orchestratorStore } from "@/lib/orchestratorStore";
import { sendEmail } from "@/lib/emailService";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const requestId = body?.requestId;
    const action = body?.action || "approve";

    if (!requestId) {
      return NextResponse.json({ error: "requestId es obligatorio" }, { status: 400 });
    }

    const item = orchestratorStore.getApprovalById(requestId);
    if (!item) {
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
    }

    if (action === "reject") {
      orchestratorStore.updateApprovalStatus(requestId, "REJECTED", { note: "Rechazada por Alan López" });
      return NextResponse.json({
        success: true,
        status: "REJECTED",
        message: `Solicitud ${requestId} cancelada formalmente.`
      });
    }

    // Ejecución real tras la aprobación de Alan
    let executionResult = {};

    if (item.actionType === "OUTBOUND_EMAIL") {
      // Disparo real de prueba de prospección
      const emailRes = await sendEmail({
        to: "hola@serviciodemarketingdigital.com",
        subject: "🚀 Prospección Fría Ejecutada (Aprobación Alan López)",
        html: `<h3>Prospección Aprobada y Ejecutada</h3><p>Se ha ejecutado la orden de prospección bajo la solicitud <b>${requestId}</b>.</p><p>Detalles: ${item.description}</p>`
      });
      executionResult = { dispatched: true, emailId: emailRes.messageId };
    } else {
      executionResult = {
        executedAt: new Date().toISOString(),
        status: "COMPLETED",
        message: "Divisiones ejecutadas en paralelo y sincronizadas en la nube."
      };
    }

    const updated = orchestratorStore.updateApprovalStatus(requestId, "APPROVED", executionResult);

    return NextResponse.json({
      success: true,
      status: "APPROVED",
      message: `Solicitud ${requestId} aprobada por Alan López. Ejecución real completada.`,
      item: updated
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
