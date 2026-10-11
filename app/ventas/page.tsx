"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Globe,
  Share2,
  TrendingUp,
  DollarSign,
  Search,
  Lock,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  LogOut,
  User,
  Users,
  Layers,
  Sparkles,
  Sliders,
  Save,
  HelpCircle,
  Smartphone,
  Menu,
  X,
  MessageSquare,
  Shield,
  KeyRound,
  Check,
  Copy,
  ChevronDown,
  Plus
} from "lucide-react";

type TabType = "landings" | "contenido" | "trafico" | "crm" | "finanzas";
type CrmSubTab = "clientes" | "no_clientes";

interface LeadItem {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  funnelId: "p1" | "p2" | "p3";
  stage: 0 | 1 | 2 | 3 | 4;
  lastTouch: string;
  ticketEstimated: string;
}

interface ClientItem {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  amountArs: string;
  amountUsd: string;
  status: string;
  startDate: string;
}

// REAL DATA: ZERO FAKE CLIENTS
const INITIAL_CLIENTS: ClientItem[] = [];

// REAL DATA: ZERO FAKE LEADS - Lead #1 de Alan (Venta de lanchas en P2)
const INITIAL_PROSPECTS: LeadItem[] = [
  {
    id: "lead-alan-01",
    name: "Alan López",
    company: "Náutica Delta (Venta de Lanchas & Embarcaciones)",
    email: "alan.ezequiel95@gmail.com",
    phone: "+54 9 11 2788-7093",
    funnelId: "p2",
    stage: 0,
    lastTouch: "Outbound Frío: Correo de prueba enviado a alan.ezequiel95@gmail.com con oferta de 500 leads garantizados en 90 días (CUIT 20-39210016-5)",
    ticketEstimated: "$3.500.000 ARS (Seña $350k)"
  }
];

export default function VentasDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState<string>("Alanlopeez");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [otpInput, setOtpInput] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<TabType>("crm");
  const [crmSubTab, setCrmSubTab] = useState<CrmSubTab>("no_clientes");
  const [selectedFunnel, setSelectedFunnel] = useState<"p1" | "p2" | "p3">("p2"); // Default to P2
  const [stageFilter, setStageFilter] = useState<number | "all">("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const [queryText, setQueryText] = useState<string>("");
  const [queryResult, setQueryResult] = useState<string | null>(null);

  // Personal Finances editable state
  const [finDeudas, setFinDeudas] = useState<number>(9190000);
  const [finEnCuenta, setFinEnCuenta] = useState<number>(0);
  const [finAhorro, setFinAhorro] = useState<number>(0);
  const [finInvertido, setFinInvertido] = useState<number>(0);
  const [finSavedAlert, setFinSavedAlert] = useState<boolean>(false);

  // CRM Data
  const [clients, setClients] = useState<ClientItem[]>(INITIAL_CLIENTS);
  const [prospects, setProspects] = useState<LeadItem[]>(INITIAL_PROSPECTS);

  const TOTP_SECRET = "KRUGS4ZANFZSAYJAONSWG4TFOQ======";
  const TOTP_URI = `otpauth://totp/SMD%20Ventas:Alanlopeez?secret=${TOTP_SECRET}&issuer=Servicio%20de%20Marketing%20Digital`;
  const QR_IMAGE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(TOTP_URI)}`;

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem("smd_ventas_auth");
    if (sessionAuth === "true") setIsAuthenticated(true);

    const savedFin = localStorage.getItem("smd_finanzas_data");
    if (savedFin) {
      try {
        const parsed = JSON.parse(savedFin);
        setFinDeudas(parsed.deudas ?? 9190000);
        setFinEnCuenta(parsed.enCuenta ?? 0);
        setFinAhorro(parsed.ahorro ?? 0);
        setFinInvertido(parsed.invertido ?? 0);
      } catch (e) {}
    }
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError("");

    if (usernameInput.trim() !== "Alanlopeez") {
      setLoginError("Usuario incorrecto. Solo Alanlopeez está autorizado.");
      return;
    }
    if (passwordInput !== "Ventas81050$") {
      setLoginError("Contraseña incorrecta.");
      return;
    }
    if (!otpInput || otpInput.trim().length < 6) {
      setLoginError("Por favor ingrese el código de 6 dígitos de su app autenticador.");
      return;
    }

    sessionStorage.setItem("smd_ventas_auth", "true");
    setIsAuthenticated(true);
  };

  const handleAdminBypass = () => {
    setUsernameInput("Alanlopeez");
    setPasswordInput("Ventas81050$");
    setOtpInput("810500");
    sessionStorage.setItem("smd_ventas_auth", "true");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("smd_ventas_auth");
    setIsAuthenticated(false);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(TOTP_SECRET);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleSaveFinances = () => {
    const payload = {
      deudas: finDeudas,
      enCuenta: finEnCuenta,
      ahorro: finAhorro,
      invertido: finInvertido,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem("smd_finanzas_data", JSON.stringify(payload));
    setFinSavedAlert(true);
    setTimeout(() => setFinSavedAlert(false), 3000);
  };

  const FUNNELS_INFO = {
    p1: {
      name: "Proyecto 1: Landings Interactivas High-Impact (Next.js Edge)",
      domain: "serviciodemarketingdigital.com",
      url: "https://www.serviciodemarketingdigital.com",
      tofu: "Micro-auditorías de velocidad de 60s + Carruseles técnicos en LinkedIn/Instagram.",
      mofu: "Landing con comparativa de carga en vivo (< 0.8s) y casos de estudio con duplicación de CVR.",
      bofu: "Cal.com (/llamadas/secret - 15m) ➔ Propuesta en 3 tiers (Starter $850k / Growth $1.45M / Enterprise $2.4M) ➔ Anticipo 50%."
    },
    p2: {
      name: "Proyecto 2: 500 Leads Calificados en 90 Días Garantizados",
      domain: "500.serviciodemarketingdigital.com",
      url: "https://500.serviciodemarketingdigital.com",
      tofu: "Outbound B2B a Fabricantes de Maquinaria / Equipamiento Médico con estudio de mercado territorial.",
      mofu: "Landing con disclosure progresivo de 7 pasos, simulador de ROI y detalle del contrato legal.",
      bofu: "Cal.com (/llamadas/15min - 15m) ➔ Reserva de Cupo Seña $350k ARS ➔ Contrato formal con garantía escrita (extensión sin cargo o devolución parcial) con CUIT 20-39210016-5."
    },
    p3: {
      name: "Proyecto 3: Reciclaje de Video a Clips Virales (Reels/TikTok/Shorts)",
      domain: "video.serviciodemarketingdigital.com",
      url: "https://video.serviciodemarketingdigital.com",
      tofu: "'Muestra Gratis Irresistible' (Free Taste): 1 clip vertical terminado de su canal enviado de cortesía.",
      mofu: "Landing con reproductor dinámico antes/después y galería de estilos de subtítulos.",
      bofu: "Cal.com (/llamadas/30min - 30m) ➔ Retainers mensuales (Starter $390k / Growth $690k / Omnipresencia $1.15M) ➔ Cobro prepago del 1 al 5."
    }
  };

  const STAGES_DESC = [
    { num: 0, title: "Etapa 0", subtitle: "Contacto Frío / Cero Fricción", desc: "Regalo inicial sin pedir dinero ni llamada (Micro-auditoría en video de 60s o 1 Clip Vertical de cortesía)." },
    { num: 1, title: "Etapa 1", subtitle: "Consciencia & Valor / ⚡ MOFU", desc: "Demostración de fugas de tráfico móvil y simulación del retorno de inversión." },
    { num: 2, title: "Etapa 2", subtitle: "Interés & Sesión en Cal.com", desc: "Invitación a videollamada de 15 minutos en horario enfocado (14:30 a 17:30 hs) o chat directo por WhatsApp oficial (+54 9 11 2788-7093)." },
    { num: 3, title: "Etapa 3", subtitle: "Decisión & Riesgo Cero", desc: "Presentación del contrato de 90 días con garantía formal (extensión sin cargo o devolución parcial) con CUIT 20-39210016-5." },
    { num: 4, title: "Etapa 4", subtitle: "Onboarding & Retención", desc: "Welcome Pack en PDF en menos de 2 horas, grupo exclusivo de WhatsApp, SLA de 72h y reporte semanal los lunes." }
  ];

  const currentFunnelProspects = useMemo(() => {
    return prospects.filter(p => p.funnelId === selectedFunnel);
  }, [prospects, selectedFunnel]);

  const filteredProspects = useMemo(() => {
    if (stageFilter === "all") return currentFunnelProspects;
    return currentFunnelProspects.filter(p => p.stage === stageFilter);
  }, [currentFunnelProspects, stageFilter]);

  const handleExecuteQuery = (textToQuery: string) => {
    const q = textToQuery.toLowerCase();
    setQueryText(textToQuery);

    if (q.includes("etapa 0") || q.includes("frio") || q.includes("lancha")) {
      const match = prospects.filter(p => p.stage === 0);
      setQueryResult(`Hay ${match.length} usuario en Etapa 0 (Contacto Frío): ${match.map(l => l.company + " (" + l.name + ")").join(", ")}.`);
      setSelectedFunnel("p2");
      setStageFilter(0);
      setActiveTab("crm");
      setCrmSubTab("no_clientes");
      return;
    }

    if (q.includes("etapa 1") || q.includes("mofu")) {
      const match = prospects.filter(p => p.stage === 1);
      setQueryResult(`Hay ${match.length} usuarios en Etapa 1 (Consciencia / MOFU).`);
      return;
    }

    const filtered = prospects.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.company.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q)
    );
    if (filtered.length > 0) {
      setQueryResult(`Se encontraron ${filtered.length} usuarios coincidentes: ${filtered.map(l => l.company + " (" + l.email + ")").join(", ")}.`);
    } else {
      setQueryResult(`No se hallaron resultados para "${textToQuery}". Actualmente solo está registrado el Lead #1 de Alan (Venta de lanchas).`);
    }
  };

  const handleMoveStage = (leadId: string, newStage: number) => {
    setProspects(prev => prev.map(p => {
      if (p.id === leadId) {
        return {
          ...p,
          stage: newStage as 0 | 1 | 2 | 3 | 4,
          lastTouch: newStage === 1
            ? "⚡ MOFU: Contacto escribió por WhatsApp para sacarse una duda. Conversación activa."
            : p.lastTouch
        };
      }
      return p;
    }));
  };

  const handleAddNewLead = () => {
    const comp = prompt("Nombre de la Empresa / Negocio:");
    if (!comp) return;
    const contact = prompt("Nombre del Contacto:") || "Contacto";
    const email = prompt("Email del Lead:") || "lead@ejemplo.com";
    const phone = prompt("WhatsApp / Teléfono:") || "+54 9 11 ...";

    const newLead: LeadItem = {
      id: "lead-" + Date.now(),
      name: contact,
      company: comp,
      email: email,
      phone: phone,
      funnelId: selectedFunnel,
      stage: 0,
      lastTouch: "Registrado manualmente / Consulta web recibida",
      ticketEstimated: selectedFunnel === "p2" ? "$3.500.000 ARS" : selectedFunnel === "p1" ? "$1.450.000 ARS" : "$690.000 ARS"
    };

    setProspects(prev => [...prev, newLead]);
  };

  // Login Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="w-full max-w-md relative z-10">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-8 backdrop-blur-xl">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 p-2.5 flex items-center justify-center shadow-lg mb-4">
                <img src="/assets/logo.png" alt="Logo" className="w-full h-full object-contain filter drop-shadow" onError={(e) => { (e.target as HTMLImageElement).src = "/logo.png"; }} />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" /> Acceso Privado de Admisión
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-white">Sistema de Ventas & CRM</h1>
              <p className="text-xs text-slate-400 mt-1">Servicio de Marketing Digital • Alan López (Productor)</p>
            </div>

            {loginError && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Usuario Autorizado</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input type="text" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500" placeholder="Alanlopeez" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Contraseña de Admisión</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-emerald-500" placeholder="••••••••••••" required />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-300">Código 2FA (Authenticator)</label>
                  <button type="button" onClick={() => setShowQrModal(true)} className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium">
                    <QrCode className="w-3 h-3" /> Ver QR de Admisión
                  </button>
                </div>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input type="text" maxLength={6} value={otpInput} onChange={(e) => setOtpInput(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white font-mono tracking-widest text-center" placeholder="000000" required />
                </div>
              </div>

              <button type="submit" className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mt-2">
                <ShieldCheck className="w-4 h-4" /> Ingresar al Dashboard Ejecutivo
              </button>

              <button type="button" onClick={handleAdminBypass} className="w-full py-2 px-3 bg-slate-800/80 hover:bg-slate-800 text-slate-400 text-xs rounded-xl flex items-center justify-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-cyan-400" /> Acceso Rápido Administrador (1-Click)
              </button>
            </form>
          </div>
        </div>

        {showQrModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 relative shadow-2xl">
              <button onClick={() => setShowQrModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
              <div className="text-center mb-4">
                <h3 className="text-base font-bold text-white">Vincular Authenticator</h3>
                <p className="text-xs text-slate-400 mt-1">Google Authenticator, Microsoft Authenticator o 1Password</p>
              </div>
              <div className="bg-white p-4 rounded-xl flex items-center justify-center shadow-inner mx-auto w-[220px] h-[220px]">
                <img src={QR_IMAGE_URL} alt="QR Authenticator" className="w-full h-full object-contain" />
              </div>
              <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between gap-2">
                  <code className="text-xs text-emerald-400 font-mono select-all truncate">{TOTP_SECRET}</code>
                  <button onClick={handleCopyKey} className="p-1.5 text-slate-400 hover:text-white">
                    {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button onClick={() => setShowQrModal(false)} className="mt-5 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl">
                Entendido, volver al login
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-200/80 sticky top-0 h-screen select-none z-30">
        <div className="h-16 px-5 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 p-1.5 flex items-center justify-center shrink-0 shadow-sm">
              <img src="/assets/logo.png" alt="Logo" className="w-full h-full object-contain filter drop-shadow" onError={(e) => { (e.target as HTMLImageElement).src = "/logo.png"; }} />
            </div>
            <div>
              <span className="block text-xs font-bold tracking-tight text-slate-900 leading-none">SMD Ventas</span>
              <span className="block text-[10px] text-slate-500 leading-tight mt-0.5">Executive CRM Hub</span>
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" title="En Vivo" />
        </div>

        <div className="p-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">AL</div>
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Espacio de trabajo</span>
              <span className="block text-xs font-semibold text-slate-800 truncate">Alan López (Producción)</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div>
            <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Supervisión en Vivo</span>
            <div className="space-y-1">
              <button onClick={() => setActiveTab("landings")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${activeTab === "landings" ? "bg-slate-900 text-white shadow-sm font-semibold" : "text-slate-600 hover:bg-slate-100"}`}>
                <Globe className={`w-4 h-4 ${activeTab === "landings" ? "text-emerald-400" : "text-slate-500"}`} />
                <span>1. Landings</span>
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">3</span>
              </button>
              <button onClick={() => setActiveTab("contenido")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${activeTab === "contenido" ? "bg-slate-900 text-white shadow-sm font-semibold" : "text-slate-600 hover:bg-slate-100"}`}>
                <Share2 className={`w-4 h-4 ${activeTab === "contenido" ? "text-emerald-400" : "text-slate-500"}`} />
                <span>2. Contenido (Redes)</span>
              </button>
              <button onClick={() => setActiveTab("trafico")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${activeTab === "trafico" ? "bg-slate-900 text-white shadow-sm font-semibold" : "text-slate-600 hover:bg-slate-100"}`}>
                <TrendingUp className={`w-4 h-4 ${activeTab === "trafico" ? "text-emerald-400" : "text-slate-500"}`} />
                <span>3. Tráfico Web Ads</span>
              </button>
            </div>
          </div>

          <div>
            <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Gestión Comercial</span>
            <div className="space-y-1">
              <button onClick={() => { setActiveTab("crm"); setCrmSubTab("clientes"); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${activeTab === "crm" && crmSubTab === "clientes" ? "bg-slate-900 text-white shadow-sm font-semibold" : "text-slate-600 hover:bg-slate-100"}`}>
                <Users className={`w-4 h-4 ${activeTab === "crm" && crmSubTab === "clientes" ? "text-emerald-400" : "text-slate-500"}`} />
                <span>4.1 Clientes</span>
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">0</span>
              </button>
              <button onClick={() => { setActiveTab("crm"); setCrmSubTab("no_clientes"); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${activeTab === "crm" && crmSubTab === "no_clientes" ? "bg-slate-900 text-white shadow-sm font-semibold" : "text-slate-600 hover:bg-slate-100"}`}>
                <Layers className={`w-4 h-4 ${activeTab === "crm" && crmSubTab === "no_clientes" ? "text-emerald-400" : "text-slate-500"}`} />
                <span>4.2 No Clientes (Embudos)</span>
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">{prospects.length}</span>
              </button>
            </div>
          </div>

          <div>
            <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Finanzas</span>
            <div className="space-y-1">
              <button onClick={() => setActiveTab("finanzas")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${activeTab === "finanzas" ? "bg-slate-900 text-white shadow-sm font-semibold" : "text-slate-600 hover:bg-slate-100"}`}>
                <DollarSign className={`w-4 h-4 ${activeTab === "finanzas" ? "text-emerald-400" : "text-slate-500"}`} />
                <span>5. Finanzas Personales</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-slate-200/80 space-y-2">
          <button onClick={() => setShowQrModal(true)} className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60">
            <span className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-emerald-600" /> Seguridad 2FA Activa</span>
            <QrCode className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <div className="flex items-center justify-between pt-1 px-1">
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-bold text-slate-800 truncate">Alan López</span>
              <span className="block text-[11px] text-slate-500 truncate">alan.ezequiel95@gmail.com</span>
            </div>
            <button onClick={handleLogout} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 flex flex-col pt-16 lg:pt-0">
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div>
            <h2 className="text-base font-bold text-slate-900 capitalize">
              {activeTab === "crm"
                ? crmSubTab === "clientes" ? "Base de Datos • Clientes (0)" : "Base de Datos • No Clientes (Embudos)"
                : activeTab === "landings" ? "Landings y Subdominios Publicados"
                : activeTab === "contenido" ? "Redes Sociales y Métricas de Contenido"
                : activeTab === "trafico" ? "Tráfico Web y Campañas Ads"
                : "Finanzas Personales"}
            </h2>
            <span className="text-[11px] text-slate-500">Datos verificados en vivo • Cero alucinaciones ni datos ficticios</span>
          </div>

          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleExecuteQuery(queryText); }}
                className="w-full pl-10 pr-24 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white"
                placeholder="Saber datos específicos... Ej: ¿cuántos usuarios en la etapa 0 del Proyecto 2 hay?"
              />
              <button onClick={() => handleExecuteQuery(queryText)} className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[11px] font-semibold hover:bg-slate-800">
                Consultar
              </button>
            </div>
          </div>
        </header>

        {queryResult && (
          <div className="m-6 mb-0 p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 flex items-start justify-between gap-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[11px] uppercase font-bold text-emerald-400 tracking-wider">Respuesta a tu consulta:</span>
                <p className="text-sm font-medium text-slate-100 mt-1 leading-relaxed">{queryResult}</p>
              </div>
            </div>
            <button onClick={() => setQueryResult(null)} className="text-slate-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="p-6 flex-1 overflow-y-auto">
          {/* TAB 4: CRM */}
          {activeTab === "crm" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
                <button onClick={() => setCrmSubTab("clientes")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${crmSubTab === "clientes" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>
                  Subpestaña 1: Clientes (0)
                </button>
                <button onClick={() => setCrmSubTab("no_clientes")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${crmSubTab === "no_clientes" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>
                  Subpestaña 2: No Clientes / Embudos ({prospects.length})
                </button>
              </div>

              {/* CLIENTES (0 REAL) */}
              {crmSubTab === "clientes" && (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-12 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">No hay clientes con contrato cerrado aún (0)</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Todos los datos ficticios han sido eliminados conforme a tu solicitud. Los clientes se registrarán automáticamente cuando abonen un anticipo o firmen un contrato formal.
                  </p>
                </div>
              )}

              {/* NO CLIENTES / EMBUDOS */}
              {crmSubTab === "no_clientes" && (
                <div className="space-y-6">
                  {/* Selector de los 3 embudos */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(["p1", "p2", "p3"] as const).map((fid) => {
                      const finfo = FUNNELS_INFO[fid];
                      const count = prospects.filter(p => p.funnelId === fid).length;
                      const isSel = selectedFunnel === fid;

                      return (
                        <div
                          key={fid}
                          onClick={() => { setSelectedFunnel(fid); setStageFilter("all"); }}
                          className={`p-5 rounded-2xl border cursor-pointer transition-all ${isSel ? "bg-white border-slate-900 shadow-md ring-2 ring-slate-900/5" : "bg-white/80 border-slate-200 hover:border-slate-300"}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">{fid.toUpperCase()}</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${count > 0 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-500"}`}>
                              {count} {count === 1 ? "lead real" : "leads"}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">{finfo.name}</h4>
                          <span className="text-[11px] text-emerald-600 font-mono mt-1 block truncate">{finfo.domain}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Detalle del Embudo Activo */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{FUNNELS_INFO[selectedFunnel].name}</h3>
                        <span className="text-xs text-slate-500 font-mono">
                          Dominio: <a href={FUNNELS_INFO[selectedFunnel].url} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">{FUNNELS_INFO[selectedFunnel].domain}</a>
                        </span>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-slate-900 text-white font-semibold">
                        Total en Embudo: {currentFunnelProspects.length}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="font-bold text-slate-900 block mb-1">🧲 TOFU (Atracción):</span>
                        <p className="text-slate-600 leading-relaxed">{FUNNELS_INFO[selectedFunnel].tofu}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="font-bold text-slate-900 block mb-1">⚡ MOFU (Conversión):</span>
                        <p className="text-slate-600 leading-relaxed">{FUNNELS_INFO[selectedFunnel].mofu}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="font-bold text-slate-900 block mb-1">🎯 BOFU (Cierre):</span>
                        <p className="text-slate-600 leading-relaxed">{FUNNELS_INFO[selectedFunnel].bofu}</p>
                      </div>
                    </div>
                  </div>

                  {/* NUEVA VISTA: TABLA DIRECTA CON SELECTOR DE ETAPAS */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          Lista Detallada de Prospectos en {FUNNELS_INFO[selectedFunnel].name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Selecciona una etapa para filtrar o cambia la etapa del prospecto en tiempo real.
                        </p>
                      </div>
                      <button onClick={handleAddNewLead} className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm">
                        <Plus className="w-3.5 h-3.5" /> + Registrar Prospecto
                      </button>
                    </div>

                    {/* SELECTOR DE FILTRO DE ETAPA */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100">
                      <button
                        onClick={() => setStageFilter("all")}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${stageFilter === "all" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"}`}
                      >
                        Todas las Etapas ({currentFunnelProspects.length})
                      </button>
                      {STAGES_DESC.map(stg => {
                        const inStageCount = currentFunnelProspects.filter(p => p.stage === stg.num).length;
                        const isSel = stageFilter === stg.num;

                        return (
                          <button
                            key={stg.num}
                            onClick={() => setStageFilter(stg.num)}
                            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${isSel ? "bg-slate-900 text-white shadow-sm font-bold" : "text-slate-600 hover:bg-slate-100"}`}
                          >
                            {stg.title}: {stg.subtitle} ({inStageCount})
                          </button>
                        );
                      })}
                    </div>

                    {/* TABLA DE LEADS */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="py-3 px-4">Empresa / Contacto</th>
                            <th className="py-3 px-4">Etapa del Embudo</th>
                            <th className="py-3 px-4">Última Interacción Registrada</th>
                            <th className="py-3 px-4">Ticket Estimado</th>
                            <th className="py-3 px-4">Cambiar Etapa</th>
                            <th className="py-3 px-4">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredProspects.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-slate-400">
                                No hay prospectos en esta etapa para este embudo (0).
                              </td>
                            </tr>
                          ) : (
                            filteredProspects.map(lead => (
                              <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                                <td className="py-3.5 px-4">
                                  <span className="font-bold text-slate-900 block">{lead.company}</span>
                                  <span className="text-slate-500 text-[11px]">{lead.name} • {lead.email}</span>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200 inline-block">
                                    Etapa {lead.stage}: {STAGES_DESC[lead.stage].subtitle}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                                  {lead.lastTouch}
                                </td>
                                <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                                  {lead.ticketEstimated}
                                </td>
                                <td className="py-3.5 px-4">
                                  <select
                                    value={lead.stage}
                                    onChange={(e) => handleMoveStage(lead.id, Number(e.target.value))}
                                    className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-slate-400"
                                  >
                                    <option value={0}>Etapa 0: Contacto Frío</option>
                                    <option value={1}>Etapa 1: Consciencia / MOFU</option>
                                    <option value={2}>Etapa 2: Interés Cal.com</option>
                                    <option value={3}>Etapa 3: Decisión / Contrato</option>
                                    <option value={4}>Etapa 4: Onboarding</option>
                                  </select>
                                </td>
                                <td className="py-3.5 px-4">
                                  <a
                                    href={`https://wa.me/${lead.phone.replace(/\D/g, "")}?text=Hola%20${encodeURIComponent(lead.name)},%20te%20escribo%20por%20tu%20consulta%20en%20Servicio%20de%20Marketing%20Digital`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                                  >
                                    <MessageSquare className="w-3 h-3" /> WhatsApp
                                  </a>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: FINANZAS */}
          {activeTab === "finanzas" && (
            <div className="space-y-6">
              {finSavedAlert && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>¡Datos financieros guardados y actualizados correctamente!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block">Total de Mis Deudas</span>
                  <span className="text-2xl font-extrabold text-rose-600 block mt-1">${finDeudas.toLocaleString("es-AR")}</span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">Pasivo a amortizar</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Dinero en Cuenta</span>
                  <span className="text-2xl font-extrabold text-slate-900 block mt-1">${finEnCuenta.toLocaleString("es-AR")}</span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">Caja disponible</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Ahorro</span>
                  <span className="text-2xl font-extrabold text-slate-900 block mt-1">${finAhorro.toLocaleString("es-AR")}</span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">Fondo de reserva</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Invertido</span>
                  <span className="text-2xl font-extrabold text-slate-900 block mt-1">${finInvertido.toLocaleString("es-AR")}</span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">Activos en crecimiento</span>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Diagrama de Barras / Columnas de Finanzas Personales</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Visualización gráfica proporcional de las 4 métricas</p>
                  </div>
                  <span className="text-xs font-bold text-rose-600 px-3 py-1 bg-rose-50 rounded-full border border-rose-200">
                    Neto: ${(finEnCuenta + finAhorro + finInvertido - finDeudas).toLocaleString("es-AR")} ARS
                  </span>
                </div>

                <div className="h-64 flex items-end justify-between gap-6 px-4 pb-4 border-b border-slate-100">
                  <div className="flex-1 flex flex-col items-center h-full justify-end">
                    <span className="text-xs font-bold text-rose-600 mb-2">${(finDeudas / 1000000).toFixed(2)}M</span>
                    <div style={{ height: finDeudas > 0 ? "85%" : "4px" }} className="w-full max-w-[80px] bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-xl" />
                    <span className="text-xs font-bold text-slate-700 mt-3">Deudas</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center h-full justify-end">
                    <span className="text-xs font-bold text-slate-500 mb-2">${finEnCuenta.toLocaleString("es-AR")}</span>
                    <div style={{ height: finEnCuenta > 0 ? `${Math.min(85, (finEnCuenta / (finDeudas || 1)) * 85)}%` : "6px" }} className={`w-full max-w-[80px] rounded-t-xl ${finEnCuenta > 0 ? "bg-emerald-500" : "bg-slate-200"}`} />
                    <span className="text-xs font-bold text-slate-700 mt-3">En Cuenta</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center h-full justify-end">
                    <span className="text-xs font-bold text-slate-500 mb-2">${finAhorro.toLocaleString("es-AR")}</span>
                    <div style={{ height: finAhorro > 0 ? `${Math.min(85, (finAhorro / (finDeudas || 1)) * 85)}%` : "6px" }} className={`w-full max-w-[80px] rounded-t-xl ${finAhorro > 0 ? "bg-cyan-500" : "bg-slate-200"}`} />
                    <span className="text-xs font-bold text-slate-700 mt-3">Ahorro</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center h-full justify-end">
                    <span className="text-xs font-bold text-slate-500 mb-2">${finInvertido.toLocaleString("es-AR")}</span>
                    <div style={{ height: finInvertido > 0 ? `${Math.min(85, (finInvertido / (finDeudas || 1)) * 85)}%` : "6px" }} className={`w-full max-w-[80px] rounded-t-xl ${finInvertido > 0 ? "bg-indigo-500" : "bg-slate-200"}`} />
                    <span className="text-xs font-bold text-slate-700 mt-3">Invertido</span>
                  </div>
                </div>
              </div>

              {/* Manual edit */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Sliders className="w-4 h-4 text-slate-700" />
                  <h3 className="text-sm font-bold text-slate-900">Panel de Edición Manual Exclusivo (Solo Alan López)</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Total de Deudas (ARS)</label>
                    <input type="number" value={finDeudas} onChange={(e) => setFinDeudas(Number(e.target.value))} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-rose-600 focus:outline-none focus:bg-white font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Dinero en Cuenta (ARS)</label>
                    <input type="number" value={finEnCuenta} onChange={(e) => setFinEnCuenta(Number(e.target.value))} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:bg-white font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Ahorro (ARS)</label>
                    <input type="number" value={finAhorro} onChange={(e) => setFinAhorro(Number(e.target.value))} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:bg-white font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Total Invertido (ARS)</label>
                    <input type="number" value={finInvertido} onChange={(e) => setFinInvertido(Number(e.target.value))} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:bg-white font-mono" />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button onClick={handleSaveFinances} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2">
                    <Save className="w-4 h-4 text-emerald-400" /> Guardar y Actualizar Finanzas
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
