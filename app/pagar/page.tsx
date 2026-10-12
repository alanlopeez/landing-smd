"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  CreditCard,
  Building2,
  Copy,
  Check,
  MessageCircle,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Lock,
  Globe
} from "lucide-react";

export default function PagarCheckoutPage() {
  const [activeTab, setActiveTab] = useState<"transferencia" | "tarjeta" | "usd">("transferencia");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <main className="min-h-screen bg-[#070b14] text-[#f8fafc] font-matter selection:bg-[#25D366] selection:text-[#070b14] pb-24">
      {/* Top Security & Navigation Bar */}
      <header className="w-full border-b border-white/10 bg-[#0a101f]/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-white/20 bg-black/60 flex items-center justify-center p-1.5 overflow-hidden">
              <Image src="/logo.png" alt="Logo" width={28} height={28} className="object-contain" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-white block">ALAN LÓPEZ</span>
              <span className="text-[10px] uppercase text-[#94a3b8] tracking-wider">Checkout Seguro • SMD</span>
            </div>
          </a>

          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <Lock className="w-3.5 h-3.5" />
              <span>SSL 256-Bit Encriptado</span>
            </div>
            <a
              href="https://wa.me/5491127887093?text=Hola%20Alan%2C%20estoy%20en%20el%20checkout%20y%20tengo%20una%20consulta"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#25D366]/20 border border-[#25D366]/50 text-[#25D366] hover:text-white text-xs font-semibold transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp: +54 9 11 2788-7093</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 space-y-10">
        
        {/* Title & Trust Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Medios de Pago Oficiales • Factura E o C Únicamente</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Confirmá tu Pago y Activá tu Proyecto
          </h1>
          <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
            Elegí la modalidad que prefieras. Podés abonar en pesos (ARS) o en dólares (USD).
          </p>
        </div>

        {/* Incentive Highlight Callout */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-[#0d1f1e] to-emerald-950/80 border-2 border-emerald-500/70 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-5 text-left">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xl shrink-0 shadow-lg shadow-emerald-500/40">
              10%
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-emerald-500/40">Incentivo Exclusivo</span>
                <strong className="text-white text-base sm:text-lg">10% OFF Bonificado por Transferencia Bancaria</strong>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                Aboná mediante transferencia directa y accedé a un <strong>10% de descuento directo</strong> sobre el valor total o seña, más inicio acelerado en 24 horas sin intermediaciones.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab("transferencia")}
            className="w-full md:w-auto px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer whitespace-nowrap"
          >
            Ver Datos de Transferencia →
          </button>
        </div>

        {/* Tab Selector Buttons */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 max-w-xl mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab("transferencia")}
            className={`py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "transferencia"
                ? "bg-emerald-500 text-slate-950 shadow-lg"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Building2 className="w-4 h-4 shrink-0" />
            <span>Transferencia (10% OFF)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("tarjeta")}
            className={`py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "tarjeta"
                ? "bg-emerald-500 text-slate-950 shadow-lg"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <CreditCard className="w-4 h-4 shrink-0" />
            <span>Tarjeta / Mercado Pago</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("usd")}
            className={`py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "usd"
                ? "bg-emerald-500 text-slate-950 shadow-lg"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Globe className="w-4 h-4 shrink-0" />
            <span>Dólares (USD / Exterior)</span>
          </button>
        </div>

        {/* TAB 1: TRANSFERENCIA BANCARIA */}
        {activeTab === "transferencia" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0e172a]/90 border border-emerald-500/40 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">Opción Preferida con 10% OFF</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">Datos Oficiales de Cuenta</h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/40">
                10% OFF Aplicado
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Alias */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 block font-mono">ALIAS BANCARIO (Recomendado)</span>
                  <span className="text-base sm:text-lg font-mono font-bold text-emerald-400">alanlopez.smd</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard("alanlopez.smd", "alias")}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-slate-950 text-white text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {copiedField === "alias" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedField === "alias" ? "Copiado!" : "Copiar"}</span>
                </button>
              </div>

              {/* CVU */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[11px] text-slate-400 block font-mono">CVU OFICIAL</span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-slate-200 truncate block">0000003100085023148162</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard("0000003100085023148162", "cvu")}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-slate-950 text-white text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {copiedField === "cvu" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedField === "cvu" ? "Copiado!" : "Copiar"}</span>
                </button>
              </div>

              {/* Titular */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                <span className="text-[11px] text-slate-400 block font-mono">TITULAR DE CUENTA</span>
                <span className="text-sm font-bold text-white">Alan López</span>
              </div>

              {/* CUIT */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                <span className="text-[11px] text-slate-400 block font-mono">CUIT FISCAL (Factura C / E)</span>
                <span className="text-sm font-bold font-mono text-white">20-39210016-5</span>
              </div>
            </div>

            {/* Step to confirm via WhatsApp */}
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5 text-xs text-slate-300">
                <strong className="text-white text-sm block">¿Hiciste la transferencia?</strong>
                <span>Envianos el comprobante por WhatsApp para emitirte la factura oficial y activar el cronómetro de entrega.</span>
              </div>
              <a
                href="https://wa.me/5491127887093?text=Hola%20Alan%2C%20ya%20realic%C3%A9%20la%20transferencia%20bancaria%20con%20el%2010%25%20de%20descuento.%20Adjunto%20comprobante%3A"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all whitespace-nowrap cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Enviar Comprobante (+54 9 11 2788-7093)</span>
              </a>
            </div>
          </div>
        )}

        {/* TAB 2: TARJETAS & MERCADO PAGO */}
        {activeTab === "tarjeta" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0e172a]/90 border border-white/10 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-sky-400 font-bold tracking-wider">Pasarela Mercado Pago</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">Elegí el Servicio a Abonar</h2>
              </div>
              <span className="text-xs text-slate-400">Hasta 6 y 12 cuotas</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 500 Leads Seña */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Máquina de Ventas</span>
                  <h3 className="text-base font-bold text-white mt-0.5">500 Leads en 90 Días (Seña Reserva)</h3>
                  <div className="text-2xl font-black text-white font-mono mt-2">$350.000 <span className="text-xs font-sans text-slate-400">ARS</span></div>
                  <p className="text-xs text-slate-400 mt-1">Bloqueo de exclusividad de zona y contrato de garantía escrita.</p>
                </div>
                <a
                  href="https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=3724152558-04c4dcd1-4592-4c02-8ac1-504c13b09ead"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider text-center block transition-all"
                >
                  Pagar Seña ($350.000) →
                </a>
              </div>

              {/* Rediseño Web Seña */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-sky-400 font-bold">Desarrollo Web Next.js</span>
                  <h3 className="text-base font-bold text-white mt-0.5">Rediseño Web Interactivo (Seña 50%)</h3>
                  <div className="text-2xl font-black text-white font-mono mt-2">$260.000 <span className="text-xs font-sans text-slate-400">ARS</span></div>
                  <p className="text-xs text-slate-400 mt-1">Primera demo navegable en 48 hs. Saldo contra aprobación final.</p>
                </div>
                <a
                  href="https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=3724152558-3b7ae0a0-6750-4fee-a7af-f53837841ee8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider text-center block transition-all"
                >
                  Pagar Seña Web ($260.000) →
                </a>
              </div>

              {/* Rediseño Web Contado Bonificado */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold">Ahorro Directo</span>
                  <h3 className="text-base font-bold text-white mt-0.5">Rediseño Web (Contado Bonificado)</h3>
                  <div className="text-2xl font-black text-white font-mono mt-2">$420.000 <span className="text-xs font-sans text-slate-400">ARS</span></div>
                  <p className="text-xs text-slate-400 mt-1">Pago único con ahorro directo de $100.000 ARS y entrega en 72 hs.</p>
                </div>
                <a
                  href="https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=3724152558-a6cfaea7-3aa0-48e9-9be2-5a35c4fed120"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider text-center block border border-white/10 transition-all"
                >
                  Pagar Contado ($420.000) →
                </a>
              </div>

              {/* 500 Leads Contado Total */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Plan Integral</span>
                  <h3 className="text-base font-bold text-white mt-0.5">500 Leads en 90 Días (Total Contado)</h3>
                  <div className="text-2xl font-black text-white font-mono mt-2">$3.500.000 <span className="text-xs font-sans text-slate-400">ARS</span></div>
                  <p className="text-xs text-slate-400 mt-1">Inversión completa llave en mano con soporte prioritario del CEO.</p>
                </div>
                <a
                  href="https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=3724152558-ace51496-f51a-41da-9b9b-2d6158225ca2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider text-center block border border-white/10 transition-all"
                >
                  Pagar Total ($3.500.000) →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DÓLARES / USD */}
        {activeTab === "usd" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0e172a]/90 border border-white/10 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">Factura E de Exportación</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">Pagos Internacionales en Dólares</h2>
              </div>
              <span className="text-xs text-slate-400">Clientes de Latam, EE.UU. y Europa</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* USDT Cripto */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 font-mono">DÓLAR CRIPTO (USDT)</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">10% OFF Bonificado</span>
                </div>
                <p className="text-xs text-slate-400">Billetera de depósito directo en Red TRC-20 (Tron) sin intermediarios bancarios:</p>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-slate-200 truncate">TFx8P3kL7yQwZ9mBnCv4Rt5Ew2XjK6H1mN</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("TFx8P3kL7yQwZ9mBnCv4Rt5Ew2XjK6H1mN", "usdt")}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-slate-950 transition-colors cursor-pointer shrink-0"
                    title="Copiar billetera"
                  >
                    {copiedField === "usdt" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* PayPal / Tarjeta Internacional */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-sky-400 font-mono">TARJETA INTERNACIONAL / PAYPAL</span>
                  <p className="text-xs text-slate-400 mt-1">Aceptamos pagos en USD mediante PayPal con protección al comprador para clientes del exterior.</p>
                </div>
                <a
                  href="https://wa.me/5491127887093?text=Hola%20Alan%2C%20quiero%20el%20enlace%20de%20pago%20en%20USD%20con%20PayPal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider text-center block transition-all"
                >
                  Solicitar Link PayPal en USD →
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-400 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Por cada pago internacional se emite formalmente <strong>Factura E</strong> oficial para que puedas deducir el gasto corporativo en tu país.</span>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
