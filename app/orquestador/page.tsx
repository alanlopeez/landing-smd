"use client";

import React, { useState, useEffect } from "react";
import { Send, CheckCircle, XCircle, AlertTriangle, Shield, RefreshCw, Cpu, Mail, Globe, Users, TrendingUp, Sparkles, Zap, Lock } from "lucide-react";

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
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [latestPlan, setLatestPlan] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Verificar sesión persistida
  useEffect(() => {
    const savedToken = localStorage.getItem("smd_orchestrator_token");
    if (savedToken === "smd_auth_session_authorized") {
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

  // Cargar estado inicial y aprobaciones pendientes
  const fetchStatus = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/orchestrator/command");
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

  // Enviar directiva al Orquestador
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
        setStatusMsg("✔ Directiva procesada. Se generó una solicitud esperando tu aprobación humana.");
        setInstruction("");
        fetchStatus();
      } else {
        setStatusMsg("❌ Error: " + (data.error || "No se pudo procesar la directiva"));
      }
    } catch (err: any) {
      setStatusMsg("❌ Error de conexión: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Aprobar o rechazar solicitud humana
  const handleApprovalAction = async (requestId: string, action: "approve" | "reject") => {
    try {
      const res = await fetch("/api/orchestrator/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }),
      });
      const data = await res.json();
      if (data.success) {
        fetchStatus();
      }
    } catch (err: any) {
      alert("Error procesando aprobación: " + err.message);
    }
  };

  // Disparo manual de prospección diaria
  const triggerOutbound = async () => {
    try {
      const res = await fetch("/api/cron/outbound?secret=multiagentes_cron_secret_2026");
      const data = await res.json();
      alert(`🚀 Prospección ejecutada con éxito!\nNicho: ${data.target?.business}\nAsunto: ${data.emailSubject}`);
    } catch (err: any) {
      alert("Error al disparar prospección: " + err.message);
    }
  };

  // Disparo manual de sincronización de correos
  const triggerSyncInbox = async () => {
    try {
      const res = await fetch("/api/cron/sync-inbox?secret=multiagentes_cron_secret_2026");
      const data = await res.json();
      alert(`📬 Bandeja auditada con éxito!\nEstado: ${data.status}\nMensaje: ${data.message}`);
    } catch (err: any) {
      alert("Error sincronizando buzón: " + err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#090d16] text-[#e2e8f0] flex items-center justify-center p-4 selection:bg-[#ea580c] selection:text-white">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {/* Acento superior de luz */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#ea580c] to-transparent"></div>
          
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-[#ea580c] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-500/10">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Acceso Maestro al Orquestador</h1>
            <p className="text-xs text-slate-400 mt-1">Servicio de Marketing Digital &bull; Alan López</p>
            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Ingresa tu PIN de seguridad maestro para autorizar órdenes y supervisar los 22 agentes en la nube.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 text-center">
                PIN de Autorización
              </label>
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => { setPinInput(e.target.value); setAuthError(null); }}
                placeholder="••••"
                className="w-full text-center text-3xl tracking-[0.4em] font-mono px-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-[#ea580c] transition-all"
                autoFocus
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-400 text-center font-medium bg-rose-500/10 border border-rose-500/20 py-2.5 rounded-xl">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={authLoading || !pinInput}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-bold text-sm hover:opacity-95 transition-all shadow-lg shadow-[#ea580c]/25 disabled:opacity-50"
            >
              {authLoading ? "Verificando..." : "Desbloquear Centro de Control"}
            </button>
          </form>

          <p className="text-[11px] text-slate-500 text-center mt-6">
            Seguridad Zero-Trust &bull; Sesión encriptada para Alan López
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-[#e2e8f0] pb-24 font-sans selection:bg-[#ea580c] selection:text-white">
      {/* Barra Superior */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#090d16]/90 backdrop-blur-md px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ea580c] to-[#f97316] flex items-center justify-center text-white font-bold shadow-lg shadow-[#ea580c]/30">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              Centro de Control Multiagente <span className="text-[10px] uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full font-mono">Cloud MAS v2.5</span>
            </h1>
            <p className="text-xs text-slate-400">Servicio de Marketing Digital &bull; Alan López</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Autónomo en la Nube
          </div>
          <button
            onClick={fetchStatus}
            disabled={refreshing}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Refrescar estado"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleLock}
            className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition-colors"
            title="Bloquear y Cerrar Sesión"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-8">
        {/* Banner de Bienvenida y Explicación */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#1e1b4b] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Portal de Control Directo para Alan López
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Envía instrucciones al Orquestador y supervisa a tus 22 agentes en tiempo real
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Cualquier directiva que ingreses aquí es analizada por el <b>CEO Orquestador</b> y dividida en tareas para las 6 divisiones operativas. Ningún correo masivo o acción crítica se ejecutará sin tu <b>aprobación humana explícita (Human-in-the-Loop)</b>.
            </p>
          </div>
        </section>

        {/* 1. Formulario de Instrucción al Orquestador */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-400" />
            Nueva Instrucción o Misión para el Orquestador
          </h3>

          <form onSubmit={handleSendCommand} className="space-y-4">
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Por ejemplo: 'Orquestador: diseñá una estrategia de captación para concesionaria náutica en Tigre. Punto A: venden por recomendación. Punto B: 5 lanchas este mes con pauta en Instagram. Calculá el presupuesto y armá el guion de video.'"
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all font-sans"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="text-slate-400 py-1">Ejemplos rápidos:</span>
                <button
                  type="button"
                  onClick={() => setInstruction("Orquestador: preparar lote de prospección diaria para negocios de estética y salud que necesiten rediseño de web con demo gratuita.")}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md transition-colors"
                >
                  Prospección Diaria
                </button>
                <button
                  type="button"
                  onClick={() => setInstruction("Orquestador: auditar embudo comercial para fábrica de colchones con objetivo de 8 ventas mensuales a $250.000 ARS de ticket.")}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md transition-colors"
                >
                  Auditoría Colchones
                </button>
                <button
                  type="button"
                  onClick={() => setInstruction("Orquestador: generar estrategia de reactivación por WhatsApp a costo cero para comensales de pizzería los días jueves.")}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md transition-colors"
                >
                  Reactivación a $0 CAC
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || !instruction.trim()}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 disabled:opacity-50 text-white font-medium text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-orange-600/30 transition-all"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Enviar al Orquestador
              </button>
            </div>
          </form>

          {statusMsg && (
            <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-orange-300">
              {statusMsg}
            </div>
          )}

          {latestPlan && (
            <div className="mt-6 border-t border-slate-800 pt-4">
              <h4 className="text-xs uppercase font-bold text-slate-400 mb-2">Respuesta y Hoja de Ruta del CEO Orquestador:</h4>
              <div className="bg-slate-950 p-4 rounded-xl text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line border border-slate-800/80 font-mono">
                {latestPlan}
              </div>
            </div>
          )}
        </section>

        {/* 2. Puerta de Control Humano (Human-in-the-Loop Approval Queue) */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                Puerta de Aprobación Humana (Human-in-the-Loop)
              </h3>
              <p className="text-xs text-slate-400">
                Las acciones sensibles quedan retenidas aquí hasta que presiones <b>Aprobar y Ejecutar</b>.
              </p>
            </div>
            <span className="text-xs font-mono bg-slate-800 px-2.5 py-1 rounded-md text-slate-300">
              {approvals.filter(a => a.status === "PENDING_APPROVAL").length} pendientes
            </span>
          </div>

          <div className="space-y-3">
            {approvals.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                No hay solicitudes en cola en este momento.
              </div>
            ) : (
              approvals.map((req) => (
                <div
                  key={req.id}
                  className={`p-4 rounded-xl border transition-all ${
                    req.status === "PENDING_APPROVAL"
                      ? "bg-slate-950/90 border-orange-500/30"
                      : req.status === "APPROVED"
                      ? "bg-slate-950/50 border-emerald-500/20 opacity-80"
                      : "bg-slate-950/50 border-red-500/20 opacity-60"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">{req.id}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        {req.agentName}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        req.riskLevel === "ALTO" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                        req.riskLevel === "MEDIO" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                        "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      }`}>
                        Riesgo {req.riskLevel}
                      </span>
                    </div>

                    <div>
                      {req.status === "PENDING_APPROVAL" && (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5" /> Requiere tu confirmación
                        </span>
                      )}
                      {req.status === "APPROVED" && (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full">
                          <CheckCircle className="w-3.5 h-3.5" /> Aprobada y Ejecutada
                        </span>
                      )}
                      {req.status === "REJECTED" && (
                        <span className="inline-flex items-center gap-1 text-xs text-red-400 font-semibold bg-red-500/10 px-2.5 py-1 rounded-full">
                          <XCircle className="w-3.5 h-3.5" /> Rechazada
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-sm font-semibold text-white mb-1">{req.title}</h4>
                  <p className="text-xs text-slate-300 mb-3">{req.description}</p>

                  {req.status === "PENDING_APPROVAL" && (
                    <div className="flex items-center gap-3 pt-2 border-t border-slate-900">
                      <button
                        onClick={() => handleApprovalAction(req.id, "approve")}
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-4 py-2 rounded-lg transition-colors shadow-md shadow-emerald-600/20"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Aprobar y Ejecutar
                      </button>
                      <button
                        onClick={() => handleApprovalAction(req.id, "reject")}
                        className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs px-4 py-2 rounded-lg transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Rechazar
                      </button>
                    </div>
                  )}

                  {req.result && (
                    <div className="mt-3 p-3 bg-slate-900/80 rounded-lg text-xs text-slate-200 border border-slate-800">
                      <div className="font-semibold text-emerald-400 mb-1 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {req.result.totalDispatched ? `${req.result.totalDispatched} correos reales despachados y visibles en tu Gmail Enviados:` : "Ejecución completada:"}
                      </div>
                      {req.result.dispatchedList ? (
                        <ul className="space-y-1 mt-2 font-mono text-[11px] text-slate-300">
                          {req.result.dispatchedList.map((d: any, idx: number) => (
                            <li key={idx} className="flex items-center justify-between border-b border-slate-800/50 pb-1">
                              <span><b>{d.company}:</b> {d.email}</span>
                              <span className="text-emerald-400">✔ Enviado ({d.messageId ? d.messageId.slice(0, 16) + "..." : "OK"})</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-[11px] text-slate-400 font-mono">{typeof req.result === "string" ? req.result : JSON.stringify(req.result)}</div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* 3. Disparadores Cloud Directos (Endpoints Autónomos) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center mb-3">
                <Mail className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Prospección en Frío Diaria</h4>
              <p className="text-xs text-slate-400 mb-4">
                Envía 1 correo diario a negocios locales ofreciendo Demo de Rediseño Web y Diagnóstico gratuito.
              </p>
            </div>
            <button
              onClick={triggerOutbound}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 rounded-lg transition-colors"
            >
              🚀 Disparar Tanda Diaria
            </button>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                <RefreshCw className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Auditoría del Buzón (Inbox)</h4>
              <p className="text-xs text-slate-400 mb-4">
                Revisa consultas entrantes en hola@serviciodemarketingdigital.com y despacha respuestas ejecutivas.
              </p>
            </div>
            <button
              onClick={triggerSyncInbox}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 rounded-lg transition-colors"
            >
              📬 Sincronizar Bandeja
            </button>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <Globe className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Agenda Alan López (15 min)</h4>
              <p className="text-xs text-slate-400 mb-4">
                Enlace oficial que el chatbot y los correos comparten para agendar sesiones 1 a 1 de diagnóstico.
              </p>
            </div>
            <a
              href="https://cal.com/llamadas/15min"
              target="_blank"
              rel="noreferrer"
              className="w-full text-center bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold py-2 rounded-lg transition-colors block"
            >
              Ver Agenda Cal.com
            </a>
          </div>
        </section>

        {/* 4. Estado de las 6 Divisiones Multiagente */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-400" />
            Estructura Organizacional: 6 Divisiones Estratégicas Activas
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { id: "01", name: "Dirección Estratégica (CEO)", agents: "CEO, Smart Validator, Research", color: "border-orange-500/30 text-orange-400" },
              { id: "02", name: "Administración & Finanzas", agents: "Accounting, Unit Economics, Analytics", color: "border-blue-500/30 text-blue-400" },
              { id: "03", name: "Producción & Desarrollo Web", agents: "Web Architect Next.js, Copywriter, GEO/AEO", color: "border-emerald-500/30 text-emerald-400" },
              { id: "04", name: "Marketing, Tráfico & Ventas", agents: "Funnel Builder, Paid Media, Outreach", color: "border-purple-500/30 text-purple-400" },
              { id: "05", name: "Comunicación & Base de Datos", agents: "WhatsApp Bot, Email Bot, CRM", color: "border-pink-500/30 text-pink-400" },
              { id: "06", name: "Ciberseguridad & Resiliencia", agents: "Cyber Guardian, Zero Trust, Headers", color: "border-cyan-500/30 text-cyan-400" },
            ].map((div) => (
              <div key={div.id} className={`p-3.5 rounded-xl bg-slate-950/80 border ${div.color} flex flex-col justify-between`}>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">División {div.id}</div>
                  <div className="text-xs font-bold text-white mb-1">{div.name}</div>
                  <div className="text-[11px] text-slate-400">{div.agents}</div>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Operativo en la Nube
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

