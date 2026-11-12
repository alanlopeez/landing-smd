import { NextRequest, NextResponse } from "next/server";
import { orchestratorStore, ApprovalRequest } from "@/lib/orchestratorStore";
import { sendEmail } from "@/lib/emailService";
import { REAL_PROSPECTS_DATABASE, ProspectLead } from "@/lib/prospectsData";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const requestId = body?.requestId;
    const action = body?.action || "approve";
    const fallbackItem: ApprovalRequest | undefined = body?.item;

    if (!requestId) {
      return NextResponse.json({ error: "requestId es obligatorio" }, { status: 400 });
    }

    let item = await orchestratorStore.getApprovalByIdAsync(requestId);
    if (!item && fallbackItem) {
      item = fallbackItem;
    }
    if (!item) {
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
    }

    if (action === "reject") {
      await orchestratorStore.updateApprovalStatusAsync(
        requestId,
        "REJECTED",
        { note: "Rechazada por Alan López", rejectedAt: new Date().toISOString() },
        item
      );
      return NextResponse.json({
        success: true,
        status: "REJECTED",
        message: `Solicitud ${requestId} cancelada formalmente.`,
      });
    }

    // EJECUCIÓN 100% REAL Y FÍSICA TRAS APROBACIÓN DE ALAN
    let executionResult: any = {};

    if (item.actionType === "OUTBOUND_EMAIL") {
      const targetLeads: ProspectLead[] = item.payload?.leads || REAL_PROSPECTS_DATABASE.slice(0, 5);
      const dispatchedList: Array<{ company: string; email: string; messageId?: string; success: boolean }> = [];

      for (const lead of targetLeads) {
        const subject = `Propuesta de Rediseño Web & Demo Interactiva para ${lead.company}`;
        const html = `<p>Hola equipo de <b>${lead.company}</b>,</p>
<p>Mi nombre es <b>Alan López</b>, director de <b>Servicio de Marketing Digital</b> (${lead.website ? `estuve analizando su sitio web ${lead.website}` : "estuve analizando su presencia online en el sector"}).</p>
<p>Noté que en el área de <b>${lead.specialty}</b> muchas empresas pierden consultas porque sus páginas operan como folletos estáticos sin un embudo de conversión ágil.</p>
<p><b>Por ejemplo:</b> Implementar una landing page mobile-first de alta velocidad con un cotizador interactivo y botón directo a WhatsApp puede duplicar las consultas semanales de clientes listos para contratar.</p>
<p>Les escribo para ofrecerles dos beneficios 100% gratuitos y sin compromiso:</p>
<ul>
  <li><b>Una Demo Interactiva navegable</b> diseñada a medida para ${lead.company} en 48 horas sin costo.</li>
  <li><b>Una sesión de Diagnóstico Comercial de 15 minutos</b> conmigo para revisar su embudo actual: <a href="https://cal.com/llamadas/15min">https://cal.com/llamadas/15min</a></li>
</ul>
<p>Pueden elegir el horario que les quede más cómodo en mi agenda oficial:<br/>
👉 <a href="https://cal.com/llamadas/15min"><b>https://cal.com/llamadas/15min</b></a></p>
<p>Quedo a su disposición.</p>
<p>Atentamente,<br/><b>Alan López</b><br/>Servicio de Marketing Digital<br/>www.serviciodemarketingdigital.com</p>`;

        const sendRes = await sendEmail({
          to: lead.email,
          subject,
          html,
        });

        dispatchedList.push({
          company: lead.company,
          email: lead.email,
          messageId: sendRes.messageId,
          success: sendRes.success,
        });
      }

      executionResult = {
        totalTargeted: targetLeads.length,
        totalDispatched: dispatchedList.filter((d) => d.success).length,
        dispatchedList,
        timestamp: new Date().toISOString(),
      };
    } else if (item.actionType === "INBOX_REPLY") {
      const toEmail = item.payload?.to;
      const replySubject = item.payload?.subject || "Re: Consulta Comercial - Servicio de Marketing Digital";
      const replyHtml = item.payload?.replyHtml || "";

      if (toEmail && replyHtml) {
        const sendRes = await sendEmail({
          to: toEmail,
          subject: replySubject,
          html: replyHtml,
        });
        executionResult = {
          dispatchedTo: toEmail,
          subject: replySubject,
          messageId: sendRes.messageId,
          success: sendRes.success,
          timestamp: new Date().toISOString(),
        };
      }
    } else {
      // CUSTOM_MISSION u otra directiva aprobada por Alan: enviar reporte ejecutivo real por correo a Alan
      const instructionText = item.payload?.instruction || item.description || item.title;
      const planText = item.payload?.planOutput || "Plan aprobado y ejecutado por las 6 divisiones.";
      const formattedPlanHtml = planText
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/\n/g, "<br/>");

      const emailHtml = `<div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; color: #0f172a; line-height: 1.6;">
  <div style="background: #090d16; color: #ffffff; padding: 20px 24px; border-radius: 12px 12px 0 0; border-bottom: 3px solid #ea580c;">
    <p style="margin: 0; font-size: 11px; color: #fb923c; text-transform: uppercase; letter-spacing: 1px;"><b>Misión Aprobada y Ejecutada • ID: ${item.id}</b></p>
    <h2 style="margin: 6px 0 0; font-size: 18px;">${item.title}</h2>
  </div>
  <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; background: #ffffff;">
    <p><b>Instrucción Original de Alan López:</b><br/>${instructionText}</p>
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;"/>
    <h3 style="color: #ea580c; font-size: 15px;">📋 Plan de Implementación y Desglose por Divisiones:</h3>
    <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 13.5px;">
      ${formattedPlanHtml}
    </div>
    <p style="margin-top: 18px; font-size: 12px; color: #64748b;">
      Estado: <b>APROBADA Y REGISTRADA EN SUPABASE</b> | Fecha: ${new Date().toISOString()}
    </p>
  </div>
</div>`;

      const sendPersonal = await sendEmail({
        to: "alan.ezequiel95@gmail.com",
        subject: `✅ Misión Aprobada (${item.id}): ${item.title}`,
        html: emailHtml,
      });

      const sendWork = await sendEmail({
        to: "hola@serviciodemarketingdigital.com",
        subject: `✅ Misión Aprobada (${item.id}): ${item.title}`,
        html: emailHtml,
      });

      executionResult = {
        executedAt: new Date().toISOString(),
        status: "COMPLETED_AND_EMAILED",
        emailedTo: ["alan.ezequiel95@gmail.com", "hola@serviciodemarketingdigital.com"],
        personalMessageId: sendPersonal.messageId,
        workMessageId: sendWork.messageId,
        totalDispatched: (sendPersonal.success ? 1 : 0) + (sendWork.success ? 1 : 0),
        message: "Misión aprobada, persistida en Supabase y enviada por correo a alan.ezequiel95@gmail.com y hola@serviciodemarketingdigital.com.",
      };
    }

    const updated = await orchestratorStore.updateApprovalStatusAsync(
      requestId,
      "APPROVED",
      executionResult,
      item
    );

    return NextResponse.json({
      success: true,
      status: "APPROVED",
      message: `Solicitud ${requestId} aprobada por Alan López y despachada por correo.`,
      item: updated,
      executionResult,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
