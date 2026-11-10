import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/emailService";

export const dynamic = "force-dynamic";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const businessName = body?.businessName || "Negocio del Cliente";
    const contactName = body?.contactName || "Titular";
    const contactEmail = body?.contactEmail || body?.email;
    const contactPhone = body?.contactPhone || body?.phone || "";
    const puntoAActual = body?.puntoA || "Sin canal digital estructurado ni seguimiento de clientes";
    const puntoBGoal = body?.puntoB || "Escalar ventas y conseguir consultas predecibles";
    const scores = body?.scores || {}; // mapa de { [qid]: 1..5 }

    // Calcular puntaje total sobre 105 puntos
    let totalScore = 0;
    for (let i = 1; i <= 21; i++) {
      totalScore += Number(scores[i] || 3);
    }

    // Fórmula del Excel: <=40 Inicial, <=65 En Desarrollo, <=85 Competente, >85 Optimizado
    let maturityLevel = "Nivel Inicial";
    if (totalScore <= 40) maturityLevel = "Nivel Inicial";
    else if (totalScore <= 65) maturityLevel = "Nivel en Desarrollo";
    else if (totalScore <= 85) maturityLevel = "Nivel Competente";
    else maturityLevel = "Nivel Optimizado";

    const percentage = ((totalScore / 105) * 100).toFixed(1);

    // Redacción ejecutiva con Gemini
    let diagnosticSummary = "";
    try {
      const prompt = `Eres el Asesor Estratégico de Alan López en Servicio de Marketing Digital (www.serviciodemarketingdigital.com).
Redacta un informe de Diagnóstico Comercial y Plan de Crecimiento para:
Empresa: ${businessName}
Contacto: ${contactName}
Puntaje de Madurez Digital: ${totalScore} / 105 puntos (${percentage}% - ${maturityLevel})
Estado Actual (Punto A): ${puntoAActual}
Meta de Ventas (Punto B): ${puntoBGoal}

Estructura obligatoria:
1. Conclusión del Punto A (cuellos de botella y fugas de venta con un 'Por ejemplo').
2. Definición del Punto B (meta clara y viable).
3. 3 Estrategias recomendadas en los 3 pilares de SMD:
   - Pilar 1: Páginas de Aterrizaje
   - Pilar 2: Tráfico Web y Anuncios
   - Pilar 3: Gestión de Base de Datos y WhatsApp
4. Cada estrategia DEBE usar la locución 'Por ejemplo' con un ejemplo concreto para el rubro de ${businessName}.
5. Llamado a la acción (CTA) para agendar la sesión de 15 minutos en https://cal.com/llamadas/15min o contratar el servicio 100% online.
Devuelve en formato HTML elegante con tarjetas y tablas.`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 2000,
            temperature: 0.3,
            thinkingConfig: { thinkingBudget: 0 }
          }
        })
      });
      const data = await res.json();
      diagnosticSummary = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (e: any) {
      console.warn("Fallo Gemini en Diagnóstico:", e.message);
    }

    const reportHtml = `<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;color:#1e293b;background:#f8fafc;padding:20px;">
  <div style="max-width:650px;margin:0 auto;background:#fff;border-radius:12px;padding:28px;border:1px solid #e2e8f0;">
    <div style="font-size:11px;font-weight:700;color:#ea580c;text-transform:uppercase;">SERVICIO DE MARKETING DIGITAL &bull; AUDITORÍA COMERCIAL</div>
    <h2 style="margin:6px 0 16px;color:#0f172a;">Diagnóstico de Marketing: ${businessName}</h2>
    
    <div style="background:#f1f5f9;padding:12px;border-radius:8px;margin-bottom:16px;">
      <b>Puntaje Total:</b> ${totalScore} / 105 pts (${percentage}%) &bull; <b>Madurez:</b> ${maturityLevel}
    </div>

    ${diagnosticSummary}

    <div style="background:#fff7ed;border:1px solid #fed7aa;padding:16px;border-radius:8px;margin-top:20px;text-align:center;">
      <h4 style="margin:0 0 8px;color:#78350f;">Próximo Paso: Sesión Estratégica 1 a 1 con Alan López</h4>
      <p style="margin:0 0 12px;font-size:13px;color:#92400e;">Para revisar este plan en detalle y definir el inicio del embudo, agenda tus 15 minutos aquí:</p>
      <a href="https://cal.com/llamadas/15min" style="display:inline-block;background:#ea580c;color:#fff;font-weight:700;padding:10px 20px;border-radius:6px;text-decoration:none;">Elegir Horario en la Agenda</a>
    </div>

    <div style="margin-top:24px;border-top:1px solid #e2e8f0;padding-top:12px;font-size:12px;color:#64748b;text-align:center;">
      Alan López &bull; Servicio de Marketing Digital &bull; <a href="https://www.serviciodemarketingdigital.com">www.serviciodemarketingdigital.com</a>
    </div>
  </div>
</body>
</html>`;

    // Enviar el reporte por email a Alan López
    await sendEmail({
      to: "hola@serviciodemarketingdigital.com",
      subject: `📊 [NUEVO DIAGNÓSTICO GENERADO] ${businessName} (${totalScore}/105 pts)`,
      html: reportHtml
    });

    // Si el cliente dejó su correo, enviarle su copia automáticamente
    if (contactEmail && contactEmail.includes("@")) {
      await sendEmail({
        to: contactEmail,
        subject: `Tu Diagnóstico de Marketing Digital y Plan de Crecimiento: ${businessName}`,
        html: reportHtml
      });
    }

    return NextResponse.json({
      success: true,
      businessName,
      totalScore,
      percentage,
      maturityLevel,
      message: "Auditoría de marketing procesada con éxito y despachada por correo."
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
