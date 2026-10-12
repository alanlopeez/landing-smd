import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const PAYMENT_CONFIG = {
  policy: "SOLO_TRANSFERENCIA_BANCARIA_NO_TARJETA",
  creditCardsAccepted: false,
  bankTransfer: {
    holder: "Alan Ezequiel Lopez",
    cuit: "20-39210016-5",
    bank: "Mercado Pago",
    alias: "marketingdigital.arg",
    cvu: "0000003100054772699472",
    discountPercent: 10,
    incentiveNote: "10% de descuento directo bonificado o 1 mes de soporte extra sin cargo abonando mediante transferencia bancaria directa."
  },
  plans: {
    sena500Leads: {
      original: 350000,
      withTransferDiscount: 315000,
      description: "Seña Reserva 10% - Máquina de Ventas Digital (500 Leads en 90 días)"
    },
    senaWebPraga: {
      original: 260000,
      withTransferDiscount: 234000,
      description: "Seña Reserva - Rediseño Web Interactivo Ultra-rápido"
    },
    contado500Leads: {
      original: 3500000,
      withTransferDiscount: 3150000,
      description: "Pago Contado Total - Garantía 500 Leads + Soporte Bonificado"
    }
  },
  usdPayments: {
    cryptoUsdtTrc20: "TFx8P3kL7yQwZ9mBnCv4Rt5Ew2XjK6H1mN",
    wireSwift: "Disponible para liquidación en cuenta corporativa exterior",
    invoiceType: "Factura E oficial deducible de impuestos (Exportación de Servicios)",
    creditCardAccepted: false
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const amountStr = searchParams.get("amount");

  let calculatedDiscount = null;
  if (amountStr) {
    const originalAmount = parseFloat(amountStr);
    if (!isNaN(originalAmount) && originalAmount > 0) {
      calculatedDiscount = {
        originalAmount,
        discountedAmount: Math.round(originalAmount * 0.9),
        saved: Math.round(originalAmount * 0.1)
      };
    }
  }

  return NextResponse.json({
    status: "OK",
    currency: "ARS",
    paymentPolicy: PAYMENT_CONFIG.policy,
    creditCardsAccepted: PAYMENT_CONFIG.creditCardsAccepted,
    calculatedDiscount,
    paymentMethods: PAYMENT_CONFIG
  });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    status: "NOTICE",
    message: "Por políticas fiscales y de seguridad, no se procesan cobros con tarjeta de crédito. Operamos exclusivamente mediante Transferencia Bancaria Directa (CVU / Alias) con 10% de descuento bonificado.",
    bankTransfer: PAYMENT_CONFIG.bankTransfer,
    checkoutHub: "https://www.serviciodemarketingdigital.com/pagar"
  });
}
