"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  RefreshCw,
  Cpu,
  Mail,
  Globe,
  Users,
  Sparkles,
  Zap,
  Lock,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";

interface ApprovalItem {
  id: string;
  createdAt: string;
  division: string;
  agentName: string;
  title: string;
  description: string;
  actionType: string;
  status: "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
  riskLevel: "BAJO" | "MEDIO" | "ALTO";
  payload: any;
  result?: any;
}

export default function OrquestadorCloudPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  const [instruction, setInstruction] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [latestPlan, setLatestPlan] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const formRef = useRef<HTMLElement | null>(null);
  const approvalsRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("smd_orchestrator_token");
    if (savedToken === "smd_auth_session_3152") {
      setIsAuthenticated(true);
      fetchStatus();
    }
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim() || authLoading) return;

    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/orchestrator/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinInput }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem("smd_orchestrator_token", data.token);
        setIsAuthenticated(true);
        fetchStatus();
      } else {
        setAuthError(data.error || "PIN incorrecto");
      }
    } catch (err: any) {
      setAuthError("Error de conexión: " + err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLock = () => {
    localStorage.removeItem("smd_orchestrator_token");
    setIsAuthenticated(false);
    setPinInput("");
  };

  const fetchStatus = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/orchestrator/command", { cache: "no-store" });
      const data = await res.json();
      if (data?.pendingApprovals) {
        setApprovals(data.pendingApprovals);
      }
    } catch (e) {
      console.warn("Error cargando estado:", e);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSendCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim() || loading) return;

    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/orchestrator/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instruction }),
      });
      const data = await res.json();
      if (data.success) {
        setLatestPlan(data.plan);
        setStatusMsg(
          "✔ Directiva analizada y guardada en Supabase. Presiona 'Aprobar y Ejecutar' abajo para despachar el plan completo a tu correo."
        );
        setInstruction("");
        await fetchStatus();
      } else {
        setStatusMsg("❌ Error: " + (data.error || "No se pudo procesar la directiva"));
      }
    } catch (err: any) {
      setStatusMsg("❌ Error de conexión: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalAction = async (item: ApprovalItem, action: "approve" | "reject") => {
    setActionLoadingId(item.id);
    try {
      const res = await fetch("/api/orchestrator/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: item.id, action, item }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg(
          action === "approve"
            ? `✔ Solicitud ${item.id} aprobada y enviada a tu correo alan.ezequiel95@gmail.com.`
            : `Solicitud ${item.id} rechazada.`
        );
        await fetchStatus();
      } else {
        alert("Aviso: " + (data.error || "No se pudo completar la acción"));
      }
    } catch (err: any) {
      alert("Error procesando aprobación: " + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const triggerOutbound = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/cron/outbound?secret=multiagentes_cron_secret_2026");
      const data = await res.json();
      alert(
        `🚀 Prospección ejecutada con éxito!\nNicho: ${data.target?.business || "B2B"}\nAsunto: ${data.emailSubject || "Enviado"}`
      );
    } catch (err: any) {
      alert("Error al disparar prospección: " + err.message);
    } finally {
      setRefreshing(false);
    }
  };

  const triggerSyncInbox = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/cron/sync-inbox?secret=multiagentes_cron_secret_2026");
      const data = await res.json();
      alert(
        `📬 Bandeja IMAP auditada en vivo (Modo B 24/7)!\nNuevos respondidos: ${data.auto_replied_count || 0}\nDetalle: ${data.message}`
      );
    } catch (err: any) {
      alert("Error sincronizando buzón: " + err.message);
    } finally {
      setRefreshing(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const pendingCount = approvals.filter((a) => a.status === "PENDING_APPROVAL").length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-[100dvh] bg-[#090d16] text-[#e2e8f0] flex items-center justify-center p-4 selection:bg-[#ea580c] selection:text-white">
        <div className="w-full max-w-md bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#ea580c] to-transparent"></div>

          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-[#ea580c] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-500/10">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Acceso Maestro al Orquestador
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Servicio de Marketing Digital &bull; Alan López
            </p>
            <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
              Ingresa tu PIN de seguridad maestro para comandar tus 22 agentes desde cualquier pantalla.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 text-center">
                PIN de Autorización
              </label>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={8}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setAuthError(null);
                }}
                placeholder="••••"
                aria-label="PIN de Autorización"
                className="w-full min-h-[52px] text-center text-2xl sm:text-3xl tracking-[0.4em] font-mono px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-[#ea580c] transition-all"
                autoFocus
              />
            </div>

            {authError && (
              <p className="text-xs sm:text-sm text-rose-400 text-center font-medium bg-rose-500/10 border border-rose-500/20 py-2.5 rounded-xl">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={authLoading || !pinInput}
              className="w-full min-h-[50px] py-3.5 rounded-2xl bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-bold text-base hover:opacity-95 active:scale-[0.99] transition-all shadow-lg shadow-[#ea580c]/25 disabled:opacity-50"
            >
              {authLoading ? "Verificando..." : "Desbloquear Centro de Control"}
            </button>
          </form>

          <p className="text-[11px] text-slate-500 text-center mt-6">
            Protección Zero-Trust &bull; Diseño Mobile-First Adaptativo
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#090d16] text-[#e2e8f0] pb-32 sm:pb-20 font-sans selection:bg-[#ea580c] selection:text-white">
      {/* Barra Superior Responsiva con Safe Area */}
      <header className="sticky top-0 z-50 border-b border-slate-800/90 bg-[#090d16]/95 backdrop-blur-md px-3.5 sm:px-8 py-3 sm:py-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-gradient-to-tr from-[#ea580c] to-[#f97316] flex items-center justify-center text-white font-bold shadow-lg shadow-[#ea580c]/30">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm sm:text-lg font-bold tracking-tight text-white truncate">
                Orquestador Multiagente
              </h1>
              <span className="text-[10px] uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full font-mono">
                Cloud v2.5
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 truncate">
              SMD &bull; Alan López &bull; Modo B 24/7 Activo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <div className="hidden md:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            100% en Internet (Modo B Mail Activo)
          </div>
          <button
            onClick={fetchStatus}
            disabled={refreshing}
            aria-label="Refrescar estado"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-slate-200 transition-all"
            title="Refrescar estado"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleLock}
            aria-label="Bloquear panel"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-slate-800/90 hover:bg-rose-500/20 hover:text-rose-400 active:scale-95 text-slate-300 transition-all"
            title="Bloquear y Cerrar Sesión"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3.5 sm:px-6 pt-4 sm:pt-8 space-y-6 sm:space-y-8">
        {/* Banner Compacto Mobile-First */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-[#1e1b4b] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
          <div className="max-w-3xl space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-orange-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Centro de Comando Móvil y Escritorio
              </span>
              <span className="inline-flex md:hidden items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[11px] text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Modo B 24/7 Online
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-white leading-snug">
              Comanda tus 22 agentes, audita visibilidad en IA (Omnia AEO) y aprueba ejecuciones reales
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Cada misión aprobada aquí se guarda de forma persistente en <b>Supabase</b> y te envía el plan ejecutivo desglosado directo a tu correo <b>alan.ezequiel95@gmail.com</b>.
            </p>
          </div>
        </section>

        {/* 1. Formulario de Instrucción al Orquestador (Mobile-First text-base 16px) */}
        <section
          ref={formRef}
          className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-lg scroll-mt-20"
        >
          <h3 className="text-sm sm:text-base font-semibold text-white mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-400 shrink-0" />
            Nueva Instrucción o Misión para el Orquestador
          </h3>

          <form onSubmit={handleSendCommand} className="space-y-4">
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Por ejemplo: 'Orquestador: armá una auditoría AEO/GEO de 4 capas (estilo UseOmnia) y estrategia de 3 pilares para posicionar una clínica dental en Google, ChatGPT y Perplexity.'"
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 sm:p-4 text-base sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60 transition-all font-sans leading-relaxed"
            />

            {/* Chips de Ejemplos Rápidos con Touch Targets >= 44px */}
            <div className="space-y-3">
              <p className="text-xs font-medium text-slate-400">
                Plantillas rápidas de 1 toque:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setInstruction(
                      "Orquestador: preparar lote de prospección diaria para negocios de estética y salud que necesiten rediseño de página web con demo gratuita y sesión de diagnóstico de 15 min."
                    )
                  }
                  className="min-h-[44px] text-left bg-slate-800/90 hover:bg-slate-700 active:scale-[0.99] text-slate-200 text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-700/60 transition-all flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>Prospección Diaria B2B</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setInstruction(
                      "Orquestador: auditar embudo comercial para fábrica de colchones con objetivo de 8 ventas mensuales (Punto B), optimizando landing page mobile-first, anuncios de Meta Ads y cierre por WhatsApp."
                    )
                  }
                  className="min-h-[44px] text-left bg-slate-800/90 hover:bg-slate-700 active:scale-[0.99] text-slate-200 text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-700/60 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Auditoría Fábrica Colchones</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setInstruction(
                      "Orquestador: ejecutar auditoría AEO/GEO de 4 capas (metodología UseOmnia: Recuperación, Extracción, Citación y Sentimiento) para posicionar una marca en ChatGPT, Perplexity y Google AI Overviews."
                    )
                  }
                  className="min-h-[44px] text-left bg-slate-800/90 hover:bg-slate-700 active:scale-[0.99] text-slate-200 text-xs font-medium px-3.5 py-2.5 rounded-xl border border-orange-500/30 transition-all flex items-center gap-2"
                >
                  <Search className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Posicionamiento IA (Omnia AEO)</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setInstruction(
                      "Orquestador: generar estrategia de reactivación de base de datos por WhatsApp a $0 CAC para clientes actuales con oferta relámpago y mensaje listo para enviar."
                    )
                  }
                  className="min-h-[44px] text-left bg-slate-800/90 hover:bg-slate-700 active:scale-[0.99] text-slate-200 text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-700/60 transition-all flex items-center gap-2"
                >
                  <Zap className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Reactivación a $0 CAC</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !instruction.trim()}
              className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 active:scale-[0.99] disabled:opacity-50 text-white font-semibold text-sm sm:text-base px-6 py-3 rounded-xl shadow-lg shadow-orange-600/30 transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Procesando con los 22 Agentes...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar Orden al Orquestador
                </>
              )}
            </button>
          </form>

          {statusMsg && (
            <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-orange-500/40 text-xs sm:text-sm text-orange-300 leading-relaxed">
              {statusMsg}
            </div>
          )}

          {latestPlan && (
            <div className="mt-6 border-t border-slate-800 pt-4">
              <h4 className="text-xs uppercase font-bold text-orange-400 mb-2">
                📋 Plan Recién Generado por el CEO Orquestador:
              </h4>
              <div className="bg-slate-950 p-3.5 sm:p-5 rounded-xl text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line border border-slate-800/90 font-sans overflow-x-auto">
                {latestPlan}
              </div>
            </div>
          )}
        </section>

        {/* 2. Puerta de Control Humano (Human-in-the-Loop Approval Queue) */}
        <section
          ref={approvalsRef}
          className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-lg scroll-mt-20"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                Puerta de Aprobación Humana (Human-in-the-Loop)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Al presionar <b>Aprobar y Ejecutar</b>, el agente ejecuta la tarea y te envía el reporte completo a <b>alan.ezequiel95@gmail.com</b>.
              </p>
            </div>
            <span className="self-start sm:self-auto text-xs font-mono bg-slate-800 px-3 py-1.5 rounded-lg text-slate-200 border border-slate-700">
              {pendingCount} {pendingCount === 1 ? "pendiente" : "pendientes"}
            </span>
          </div>

          <div className="space-y-3.5">
            {approvals.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs sm:text-sm">
                No hay solicitudes en cola en este momento.
              </div>
            ) : (
              approvals.map((req) => {
                const isExpanded = Boolean(expandedCards[req.id]);
                const hasPlan = Boolean(req.payload?.planOutput);
                const isProcessing = actionLoadingId === req.id;

                return (
                  <div
                    key={req.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      req.status === "PENDING_APPROVAL"
                        ? "bg-slate-950/95 border-orange-500/40 shadow-md"
                        : req.status === "APPROVED"
                        ? "bg-slate-950/60 border-emerald-500/30"
                        : "bg-slate-950/40 border-red-500/20 opacity-70"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                          {req.id}
                        </span>
                        <span className="text-[11px] sm:text-xs px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-200 font-medium">
                          {req.agentName}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                            req.riskLevel === "ALTO"
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : req.riskLevel === "MEDIO"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          }`}
                        >
                          Riesgo {req.riskLevel}
                        </span>
                      </div>

                      <div>
                        {req.status === "PENDING_APPROVAL" && (
                          <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                            <AlertTriangle className="w-3.5 h-3.5" /> Esperando tu OK
                          </span>
                        )}
                        {req.status === "APPROVED" && (
                          <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                            <CheckCircle className="w-3.5 h-3.5" /> Aprobada y Enviada por Mail
                          </span>
                        )}
                        {req.status === "REJECTED" && (
                          <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-red-400 font-semibold bg-red-500/10 px-2.5 py-1 rounded-full">
                            <XCircle className="w-3.5 h-3.5" /> Rechazada
                          </span>
                        )}
                      </div>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-white mb-1 leading-snug">
                      {req.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 mb-3 leading-relaxed">
                      {req.description}
                    </p>

                    {hasPlan && (
                      <div className="mb-3">
                        <button
                          type="button"
                          onClick={() => toggleExpand(req.id)}
                          className="min-h-[40px] inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-4 h-4" /> Ocultar Plan Formulado
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" /> Ver Plan Formulado Completo
                            </>
                          )}
                        </button>
                        {isExpanded && (
                          <div className="mt-2.5 p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed">
                            {req.payload.planOutput}
                          </div>
                        )}
                      </div>
                    )}

                    {req.status === "PENDING_APPROVAL" && (
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-3 border-t border-slate-900">
                        <button
                          onClick={() => handleApprovalAction(req, "approve")}
                          disabled={isProcessing}
                          className="min-h-[48px] inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/20"
                        >
                          {isProcessing ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          {isProcessing ? "Ejecutando y Enviando Mail..." : "Aprobar y Ejecutar"}
                        </button>
                        <button
                          onClick={() => handleApprovalAction(req, "reject")}
                          disabled={isProcessing}
                          className="min-h-[48px] inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 active:scale-[0.99] disabled:opacity-50 text-slate-300 font-medium text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all"
                        >
                          <XCircle className="w-4 h-4" /> Rechazar
                        </button>
                      </div>
                    )}

                    {req.result && (
                      <div className="mt-3 p-3.5 bg-slate-900/90 rounded-xl text-xs text-slate-200 border border-slate-800">
                        <div className="font-semibold text-emerald-400 mb-1 flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 shrink-0" />
                          <span>
                            {req.result.message ||
                              (req.result.totalDispatched
                                ? `${req.result.totalDispatched} correos reales despachados con éxito:`
                                : "Ejecución completada:")}
                          </span>
                        </div>
                        {req.result.dispatchedList ? (
                          <ul className="space-y-1.5 mt-2 font-mono text-[11px] text-slate-300">
                            {req.result.dispatchedList.map((d: any, idx: number) => (
                              <li
                                key={idx}
                                className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/60 pb-1 gap-1"
                              >
                                <span className="truncate">
                                  <b>{d.company}:</b> {d.email}
                                </span>
                                <span className="text-emerald-400 shrink-0">
                                  ✔ Enviado ({d.messageId ? d.messageId.slice(0, 14) + "..." : "OK"})
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* 3. Disparadores Cloud Directos (Endpoints Autónomos) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-3">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white mb-1">
                Prospección en Frío Diaria
              </h4>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Envía propuestas reales ofreciendo Demo de Rediseño Web y Diagnóstico gratuito de 15 min.
              </p>
            </div>
            <button
              onClick={triggerOutbound}
              className="w-full min-h-[46px] bg-slate-800 hover:bg-slate-700 active:scale-[0.99] text-slate-100 text-xs sm:text-sm font-semibold py-2.5 rounded-xl transition-all"
            >
              🚀 Disparar Tanda Diaria
            </button>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white mb-1">
                Auto-Respuesta Mail 24/7 (Modo B)
              </h4>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Lee correos nuevos en hola@serviciodemarketingdigital.com cada 1 min (con PC apagada), responde al instante y te envía copia.
              </p>
            </div>
            <button
              onClick={triggerSyncInbox}
              className="w-full min-h-[46px] bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 active:scale-[0.99] text-emerald-300 text-xs sm:text-sm font-semibold py-2.5 rounded-xl transition-all"
            >
              📬 Probar Lectura IMAP Ahora
            </button>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                <Globe className="w-5 h-5" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white mb-1">
                Agenda Alan López (15 min)
              </h4>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Enlace oficial que el chatbot de WhatsApp y las respuestas automáticas por mail entregan para agendar.
              </p>
            </div>
            <a
              href="https://cal.com/llamadas/15min"
              target="_blank"
              rel="noreferrer"
              className="w-full min-h-[46px] flex items-center justify-center bg-orange-600 hover:bg-orange-500 active:scale-[0.99] text-white text-xs sm:text-sm font-semibold py-2.5 rounded-xl transition-all"
            >
              Ver Agenda Cal.com
            </a>
          </div>
        </section>

        {/* 4. Estado de las 6 Divisiones Multiagente */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6">
          <h3 className="text-sm sm:text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-400 shrink-0" />
            Estructura Organizacional: 6 Divisiones Estratégicas + Omnia AEO
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                name: "01. Dirección & Diagnóstico",
                desc: "CEO Orchestrator, Validación SMART y Auditoría de 21 Puntos.",
                badge: "Activa",
              },
              {
                name: "02. Administración & ROI",
                desc: "Cálculo de CAC, LTV, ROAS y distribución de presupuesto.",
                badge: "Activa",
              },
              {
                name: "03. Producción Web & Omnia AEO",
                desc: "Landings Mobile-First, Visibilidad en IA (4 Capas UseOmnia) y Video.",
                badge: "Activa",
              },
              {
                name: "04. Marketing, Tráfico & Ventas",
                desc: "Embudos, Campañas Meta/Google Ads y Prospección B2B.",
                badge: "Activa",
              },
              {
                name: "05. Comunicación & Mail Modo B",
                desc: "WhatsApp Cloud Bot 24/7, Auto-Respuesta Email y CRM.",
                badge: "Activa",
              },
              {
                name: "06. Ciberseguridad Zero-Trust",
                desc: "Protección PIN 3152, cabeceras OWASP y auditoría continua.",
                badge: "Activa",
              },
            ].map((div, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/90 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs sm:text-sm font-bold text-slate-100">
                      {div.name}
                    </span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      {div.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{div.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Dock Flotante Inferior Móvil (Sticky Mobile Action Dock) */}
      <nav
        aria-label="Acciones rápidas móviles"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#090d16]/95 backdrop-blur-xl border-t border-slate-800 px-3 pt-2 pb-[calc(0.6rem+env(safe-area-inset-bottom))] flex items-center justify-around gap-2 shadow-2xl"
      >
        <button
          type="button"
          onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="flex-1 min-h-[46px] rounded-xl bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-600/20 active:scale-95 transition-transform"
        >
          <Zap className="w-4 h-4" />
          <span>Nueva Orden</span>
        </button>

        <button
          type="button"
          onClick={() => approvalsRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="flex-1 min-h-[46px] rounded-xl bg-slate-800 text-slate-100 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 active:scale-95 transition-transform"
        >
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Aprobar ({pendingCount})</span>
        </button>

        <button
          type="button"
          onClick={triggerSyncInbox}
          disabled={refreshing}
          className="min-w-[48px] min-h-[46px] px-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-1 active:scale-95 transition-transform"
          title="Revisar bandeja de correo"
        >
          <Mail className="w-4 h-4" />
          <span>Mail</span>
        </button>
      </nav>
    </div>
  );
}
