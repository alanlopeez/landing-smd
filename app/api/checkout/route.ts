import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MP_ACCESS_TOKEN =
  process.env.MERCADOPAGO_ACCESS_TOKEN ||
  "APP_USR-8502314816225294-092816-a21207752605a13838967477ddafdcc3-3724152558";

export const PAYMENT_CONFIG = {
  bankTransfer: {
    holder: process.env.BANK_TRANSFER_HOLDER || "Alan López",
    cuit: process.env.BANK_TRANSFER_CUIT || "20-39210016-5",
    bank: process.env.BANK_TRANSFER_BANK || "Mercado Pago / Banco Santander",
    alias: process.env.BANK_TRANSFER_ALIAS || "alanlopez.smd",
    cvu: process.env.BANK_TRANSFER_CVU || "0000003100085023148162",
    discountPercent: 10,
    incentiveNote: "10% de descuento directo bonificado o 1 mes de mantenimiento extra sin cargo."
  },
  mercadoPagoLinks: {
    sena500Leads: "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=3724152558-04c4dcd1-4592-4c02-8ac1-504c13b09ead",
    cuota1_500Leads: "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=3724152558-06a49a53-dccb-4e5b-9761-6dd9ca10ab73",
    contado500Leads: "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=3724152558-ace51496-f51a-41da-9b9b-2d6158225ca2",
    senaWebPraga: "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=3724152558-3b7ae0a0-6750-4fee-a7af-f53837841ee8",
    contadoWebPraga: "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=3724152558-a6cfaea7-3aa0-48e9-9be2-5a35c4fed120"
  },
  usdPayments: {
    paypalEmail: "alan.ezequiel95@gmail.com",
    cryptoUsdtTrc20: "TFx8P3kL7yQwZ9mBnCv4Rt5Ew2XjK6H1mN",
    wireSwift: "Disponible a solicitud para clientes internacionales",
    invoiceType: "Factura E oficial deducible de impuestos (Exportación de Servicios)"
  }
};

// GET: Devuelve los métodos de pago disponibles y calculados
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const amountStr = searchParams.get("amount");
  const currency = (searchParams.get("currency") || "ARS").toUpperCase();

  let originalAmount = amountStr ? parseFloat(amountStr) : null;
  let discountedAmount = null;

  if (originalAmount && !isNaN(originalAmount)) {
    discountedAmount = originalAmount * 0.9; // 10% OFF
  }

  return NextResponse.json({
    status: "OK",
    currency,
    originalAmount,
    discountedAmountWithTransfer: discountedAmount,
    discountPercent: 10,
    paymentMethods: PAYMENT_CONFIG
  });
}

// POST: Genera una preferencia de pago dinámica en Mercado Pago
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, unit_price, quantity = 1, currency_id = "ARS", client_email } = body;

    if (!title || !unit_price) {
      return NextResponse.json(
        { status: "ERROR", error: "title and unit_price are required" },
        { status: 400 }
      );
    }

    const payload = {
      items: [
        {
          title: String(title),
          quantity: Number(quantity),
          currency_id: String(currency_id),
          unit_price: Number(unit_price)
        }
      ],
      payer: client_email ? { email: client_email } : undefined,
      back_urls: {
        success: "https://www.serviciodemarketingdigital.com/gracias",
        failure: "https://www.serviciodemarketingdigital.com/",
        pending: "https://www.serviciodemarketingdigital.com/"
      },
      auto_return: "approved"
    };

    const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const mpData = await mpRes.json();

    if (!mpRes.ok) {
      return NextResponse.json({ status: "ERROR", error: mpData }, { status: mpRes.status });
    }

    return NextResponse.json({
      status: "OK",
      preferenceId: mpData.id,
      initPoint: mpData.init_point,
      sandboxInitPoint: mpData.sandbox_init_point
    });
  } catch (err: any) {
    return NextResponse.json({ status: "ERROR", error: err.message }, { status: 500 });
  }
}
