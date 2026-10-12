"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Building2,
  Copy,
  Check,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Lock,
  Globe,
  AlertTriangle,
  Receipt,
  CheckCircle2,
  CreditCard
} from "lucide-react";

export default function PagarCheckoutPage() {
  const [activeTab, setActiveTab] = useState<"ars" | "usd">("ars");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <main className="min-h-screen bg-[#070b14] text-[#f8fafc] font-sans selection:bg-[#25D366] selection:text-[#070b14] pb-24">
      {/* Top Security & Navigation Bar */}
      <header className="w-full border-b border-white/10 bg-[#0a101f]/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-white/20 bg-black/60 flex items-center justify-center p-1.5 overflow-hidden">
              <Image src="/logo.png" alt="Logo" width={28} height={28} className="object-contain" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-white block">ALAN EZEQUIEL LOPEZ</span>
              <span className="text-[10px] uppercase text-[#94a3b8] tracking-wider">Centro Oficial de Cobros • SMD</span>
            </div>
          </a>

          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <Lock className="w-3.5 h-3.5" />
              <span>Conexión 256-Bit SSL</span>
            </div>
            <a
              href="https://wa.me/5491127887093?text=Hola%20Alan%2C%20estoy%20en%20el%20checkout%20y%20quiero%20confirmar%20mi%20transferencia"
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        {/* Title & Trust Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Medio Exclusivo Habilitado: Transferencia Bancaria Inmediata</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Abona tu Seña o Servicio con <span className="text-emerald-400">10% OFF Bonificado</span>
          </h1>
          <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed">
            Para garantizar la máxima transparencia, facturación fiscal inmediata y trasladarte el 100% del ahorro en comisiones de pasarelas, operamos <strong className="text-white">únicamente mediante transferencia bancaria directa</strong>.
          </p>
        </div>

        {/* Notice: No Credit Card Accepted */}
        <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
            <strong className="text-white font-semibold">Política de Cobro:</strong> Solo aceptamos <strong>Transferencia Bancaria Directa (CVU / CBU / Alias)</strong>. No aceptamos tarjetas de crédito ni pagos diferidos con recargo financiero.
          </div>
        </div>

        {/* Currency Switcher Tabs */}
        <div className="flex justify-center mb-8">
          <div className="p-1 rounded-2xl bg-[#0f172a] border border-white/10 flex items-center gap-1">
            <button
              onClick={() => setActiveTab("ars")}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === "ars"
                  ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                  : "text-[#94a3b8] hover:text-white"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Pesos Argentinos (ARS)</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/30 text-white font-mono font-bold">10% OFF</span>
            </button>
            <button
              onClick={() => setActiveTab("usd")}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === "usd"
                  ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                  : "text-[#94a3b8] hover:text-white"
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Exterior / USD</span>
            </button>
          </div>
        </div>

        {activeTab === "ars" ? (
          <div className="space-y-8">
            {/* Bank Transfer Official Card */}
            <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-[#0e1a2f] to-[#0a101f] p-6 sm:p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-semibold block mb-1">
                    Cuenta Oficial de Acreditación Inmediata
                  </span>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span>Mercado Pago Argentina</span>
                    <span className="text-xs font-mono font-normal px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      CVU Certificado
                    </span>
                  </h2>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-[#94a3b8] block">Bonificación Directa</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">-10% DESCUENTO</span>
                </div>
              </div>

              {/* Data Fields with Copy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {/* Alias */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#94a3b8] font-mono block">Alias Oficial</span>
                    <span className="text-base sm:text-lg font-mono font-bold text-white select-all">marketingdigital.arg</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard("marketingdigital.arg", "alias")}
                    className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all flex items-center gap-1.5"
                  >
                    {copiedField === "alias" ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>

                {/* CVU */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#94a3b8] font-mono block">CVU (22 dígitos)</span>
                    <span className="text-sm sm:text-base font-mono font-bold text-white select-all">0000003100054772699472</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard("0000003100054772699472", "cvu")}
                    className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all flex items-center gap-1.5"
                  >
                    {copiedField === "cvu" ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Titular */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#94a3b8] font-mono block">Titular de la Cuenta</span>
                    <span className="text-sm sm:text-base font-bold text-white">Alan Ezequiel Lopez</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard("Alan Ezequiel Lopez", "titular")}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#cbd5e1] text-xs font-semibold transition-all flex items-center gap-1.5"
                  >
                    {copiedField === "titular" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* CUIT / CUIL */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#94a3b8] font-mono block">CUIT / CUIL Fiscal</span>
                    <span className="text-sm sm:text-base font-mono font-bold text-white">20-39210016-5</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard("20-39210016-5", "cuit")}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#cbd5e1] text-xs font-semibold transition-all flex items-center gap-1.5"
                  >
                    {copiedField === "cuit" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Pricing Breakdown with 10% OFF */}
            <div className="rounded-3xl border border-white/10 bg-[#0a101f] p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <span>Montos de Transferencia con 10% OFF Bonificado</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-emerald-500/40 transition-all">
                  <span className="text-xs uppercase font-mono text-[#94a3b8] block mb-1">Seña Máquina 500 Leads</span>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400">$315.000 ARS</span>
                    <span className="text-xs text-[#64748b] line-through font-mono">$350.000</span>
                  </div>
                  <p className="text-[11px] text-[#94a3b8] leading-tight">
                    Reserva de cupo + Garantía de 500 leads en 90 días por contrato legal.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-emerald-500/40 transition-all">
                  <span className="text-xs uppercase font-mono text-[#94a3b8] block mb-1">Seña Web Praga / Rediseño</span>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400">$234.000 ARS</span>
                    <span className="text-xs text-[#64748b] line-through font-mono">$260.000</span>
                  </div>
                  <p className="text-[11px] text-[#94a3b8] leading-tight">
                    Reserva y comienzo de desarrollo de web interactiva ultra-rápida.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-emerald-500/40 transition-all">
                  <span className="text-xs uppercase font-mono text-[#94a3b8] block mb-1">Plan Total Contado 500 Leads</span>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400">$3.150.000 ARS</span>
                    <span className="text-xs text-[#64748b] line-through font-mono">$3.500.000</span>
                  </div>
                  <p className="text-[11px] text-[#94a3b8] leading-tight">
                    Cancelación de servicio completo + 1 mes extra de soporte bonificado.
                  </p>
                </div>
              </div>
            </div>

            {/* 3 Steps Guide & WhatsApp Confirmation */}
            <div className="rounded-3xl border border-white/10 bg-[#0a101f] p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>¿Cómo confirmar tu pago en 3 pasos?</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-sm shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Copiá el Alias o CVU</h4>
                    <p className="text-xs text-[#94a3b8] leading-relaxed">
                      Abrí tu app de banco o Mercado Pago y pegá el alias <code className="text-emerald-400 font-mono">marketingdigital.arg</code>.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-sm shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Transferí el monto</h4>
                    <p className="text-xs text-[#94a3b8] leading-relaxed">
                      Efectuá la transferencia por el valor de tu seña o plan con la bonificación aplicada.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-sm shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Enviá el comprobante</h4>
                    <p className="text-xs text-[#94a3b8] leading-relaxed">
                      Envianos la captura o PDF por WhatsApp para confeccionar tu Factura y dar inicio formal.
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Receipt Button */}
              <a
                href="https://wa.me/5491127887093?text=Hola%20Alan%2C%20adjunto%20el%20comprobante%20de%20mi%20transferencia%20bancaria%20al%20alias%20marketingdigital.arg"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-black font-black text-center flex items-center justify-center gap-3 shadow-lg shadow-[#25D366]/20 transition-all text-base"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Enviar Comprobante por WhatsApp (+54 9 11 2788-7093)</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* USD International Transfer Card */}
            <div className="rounded-3xl border border-white/10 bg-[#0a101f] p-6 sm:p-8">
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-semibold block mb-2">
                Clientes Internacionales • Factura E Oficial
              </span>
              <h2 className="text-2xl font-bold text-white mb-4">Transferencia Directa en Dólares (USD)</h2>
              <p className="text-sm text-[#94a3b8] mb-6 leading-relaxed">
                Para contrataciones desde el exterior (Estados Unidos, España, México, Chile, Colombia, Uruguay), emitimos Factura Electrónica de Exportación (Factura E deducible en tu país). <strong>No operamos con tarjeta de crédito</strong>; los cobros se reciben vía transferencia bancaria directa o criptoactivos estables (USDT).
              </p>

              <div className="space-y-4">
                {/* USDT TRC-20 */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#94a3b8] font-mono block">Crypto USDT (Red TRC-20 / Binance / Ledger)</span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-white select-all">TFx8P3kL7yQwZ9mBnCv4Rt5Ew2XjK6H1mN</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard("TFx8P3kL7yQwZ9mBnCv4Rt5Ew2XjK6H1mN", "usdt")}
                    className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all flex items-center gap-1.5"
                  >
                    {copiedField === "usdt" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>Copiar Wallet</span>
                  </button>
                </div>

                {/* Wire Transfer Details */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                  <span className="text-[11px] uppercase tracking-wider text-[#94a3b8] font-mono block mb-1">Transferencia Bancaria Internacional (Wire / Swift)</span>
                  <p className="text-xs text-[#cbd5e1] leading-relaxed">
                    Disponible para empresas que liquiden vía cuenta corporativa bancaria en el exterior. Solicitá el formulario Swift a través de WhatsApp.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <a
                  href="https://wa.me/5491127887093?text=Hola%20Alan%2C%20deseo%20abonar%20desde%20el%20exterior%20en%20USD%20v%C3%ADa%20transferencia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-center flex items-center justify-center gap-3 transition-all text-base"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Solicitar Datos Swift / Coordinar Pago USD por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Legal & Security Footer */}
        <div className="mt-12 text-center text-xs text-[#64748b] space-y-2">
          <p>
            Alan Ezequiel Lopez • CUIT: 20-39210016-5 • Mercado Pago Argentina (Alias: marketingdigital.arg)
          </p>
          <p>
            Emisión de Factura Fiscal A / B / E según corresponda tras acreditarse la transferencia.
          </p>
        </div>
      </div>
    </main>
  );
}
