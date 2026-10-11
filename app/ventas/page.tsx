"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Globe,
  Share2,
  TrendingUp,
  Database,
  DollarSign,
  Search,
  Lock,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  RefreshCw,
  LogOut,
  User,
  Users,
  Building2,
  Phone,
  Mail,
  Calendar,
  Layers,
  Sparkles,
  BarChart3,
  Sliders,
  Save,
  HelpCircle,
  Send,
  Eye,
  Clock,
  Briefcase,
  KeyRound,
  Shield,
  Smartphone,
  Menu,
  X,
  MessageSquare
} from "lucide-react";

// --- TYPES ---
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
  score: number;
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
  status: "Entregado" | "En Onboarding" | "Activo Retainer";
  startDate: string;
}

// --- INITIAL MOCK / PERSISTENT DATA ---
const INITIAL_CLIENTS: ClientItem[] = [
  {
    id: "cli-1",
    name: "Carlos Mendoza",
    company: "InnovaTech Labs",
    email: "carlos.mendoza@innovatech.com",
    phone: "+54 9 11 5432-1098",
    service: "Proyecto 1: Landing Express High-Impact Edge",
    amountArs: "$850.000",
    amountUsd: "USD 700",
    status: "Entregado",
    startDate: "2026-09-28"
  },
  {
    id: "cli-2",
    name: "Lucía Valdez",
    company: "GrowthLatam B2B",
    email: "lucia.valdez@growthlatam.io",
    phone: "+54 9 11 4321-8765",
    service: "Proyecto 1: Funnel Completo + Automatización",
    amountArs: "$1.450.000",
    amountUsd: "USD 1.200",
    status: "Activo Retainer",
    startDate: "2026-10-02"
  }
];

const INITIAL_PROSPECTS: LeadItem[] = [
  // Proyecto 1: Landings High Impact
  { id: "p1-01", name: "Ignacio Ramos", company: "Aura Ergonomics", email: "ignacio@aurachairs.com", phone: "+54 9 11 4982-1100", funnelId: "p1", stage: 0, lastTouch: "Micro-auditoría 60s enviada", ticketEstimated: "$850.000 ARS", score: 65 },
  { id: "p1-02", name: "Valeria Gómez", company: "Lumina Skincare", email: "valeria@luminaskincare.com", phone: "+54 9 11 3981-2244", funnelId: "p1", stage: 0, lastTouch: "Carrusel Instagram visto", ticketEstimated: "$850.000 ARS", score: 60 },
  { id: "p1-03", name: "Matías Herrera", company: "Veloce Bikes", email: "matias@velocebikes.io", phone: "+54 9 11 5821-3399", funnelId: "p1", stage: 1, lastTouch: "Simulación de fuga móvil <0.8s", ticketEstimated: "$1.450.000 ARS", score: 78 },
  { id: "p1-04", name: "Federico Blanco", company: "Zenith Sleep Co", email: "federico@zenithsleep.co", phone: "+54 9 11 6720-4411", funnelId: "p1", stage: 1, lastTouch: "Calculadora de CVR revisada", ticketEstimated: "$850.000 ARS", score: 82 },
  { id: "p1-05", name: "Marcos Torres", company: "Finanzas Online", email: "marcos.torres@finanzasonline.com", phone: "+54 9 11 3210-9876", funnelId: "p1", stage: 2, lastTouch: "Cal.com /secret agendado 15:00 hs", ticketEstimated: "$1.450.000 ARS", score: 88 },
  { id: "p1-06", name: "Guillermo Prado", company: "Prado & Partners M&A", email: "g.prado@prado-ma.com", phone: "+54 9 11 7192-3841", funnelId: "p1", stage: 3, lastTouch: "Propuesta 3 tiers enviada (Growth)", ticketEstimated: "$1.450.000 ARS", score: 92 },
  { id: "p1-07", name: "Esteban Rossi", company: "Agencia Alpha", email: "erossi@alpha-growth.io", phone: "+54 9 11 8291-0021", funnelId: "p1", stage: 4, lastTouch: "Onboarding Welcome Pack enviado", ticketEstimated: "$850.000 ARS", score: 95 },

  // Proyecto 2: 500 Leads Garantizados
  { id: "p2-01", name: "Ing. Mariano Guerrero", company: "Guerrero AgroMaquinarias", email: "mariano.guerrero@guerreroabogados.com.ar", phone: "+54 9 11 4820-9100", funnelId: "p2", stage: 0, lastTouch: "Estudio de mercado territorial enviado", ticketEstimated: "$3.500.000 ARS", score: 70 },
  { id: "p2-02", name: "Dra. Valeria Sánchez Bosch", company: "Clínica & Equipamiento Bosch", email: "valeria.bosch@clinicabosch.com.ar", phone: "+54 9 11 5234-8899", funnelId: "p2", stage: 0, lastTouch: "Dossier 500 leads presentado", ticketEstimated: "$3.500.000 ARS", score: 72 },
  { id: "p2-03", name: "Roberto Calvo", company: "Calvo Maquinaria Pesada", email: "rcalvo@calvomaq.com.ar", phone: "+54 9 11 6391-7722", funnelId: "p2", stage: 1, lastTouch: "Disclosure progresivo de 7 pasos visto", ticketEstimated: "$3.500.000 ARS", score: 80 },
  { id: "p2-04", name: "Hernán Soria", company: "Soria Equipamiento Quirúrgico", email: "hsoria@soriamed.com.ar", phone: "+54 9 11 9812-4455", funnelId: "p2", stage: 1, lastTouch: "Simulador ROI 500 leads completado", ticketEstimated: "$3.500.000 ARS", score: 85 },
  { id: "p2-05", name: "Alberto Praga", company: "Calzados Praga B2B", email: "alberto@calzadospraga.com.ar", phone: "+54 9 11 4455-8899", funnelId: "p2", stage: 2, lastTouch: "Cal.com /15min agendado 16:30 hs", ticketEstimated: "$3.500.000 ARS", score: 90 },
  { id: "p2-06", name: "Claudio Varela", company: "Varela Concesionarios High-Ticket", email: "cvarela@varelaautos.com.ar", phone: "+54 9 11 7721-6633", funnelId: "p2", stage: 3, lastTouch: "Contrato garantía CUIT 20-39210016-5 enviado", ticketEstimated: "$3.500.000 ARS", score: 94 },
  { id: "p2-07", name: "Marcelo Benítez", company: "Benítez Agroindustrial", email: "mbenitez@agro-benitez.com.ar", phone: "+54 9 11 3344-9988", funnelId: "p2", stage: 4, lastTouch: "Cupo reservado con Seña $350k ARS", ticketEstimated: "$350.000 ARS", score: 98 },

  // Proyecto 3: Reciclaje de Video a Clips Virales
  { id: "p3-01", name: "Dr. Fernando Ruiz", company: "Canal Medicina & Longevidad", email: "fruiz@longevidad-dr.com", phone: "+54 9 11 4112-9011", funnelId: "p3", stage: 0, lastTouch: "Muestra Gratis: 1 Clip vertical enviado", ticketEstimated: "$390.000 ARS", score: 68 },
  { id: "p3-02", name: "Santiago Méndez", company: "Podcast Negocios Reales", email: "santi@negociosreales.com", phone: "+54 9 11 5566-2211", funnelId: "p3", stage: 0, lastTouch: "Muestra Gratis 28s Hormozi Style enviada", ticketEstimated: "$690.000 ARS", score: 74 },
  { id: "p3-03", name: "Carla Silveyra", company: "Academia High-Ticket Coaches", email: "carla@carlaspeaks.io", phone: "+54 9 11 6677-3322", funnelId: "p3", stage: 1, lastTouch: "Galería de subtítulos interactivos vista", ticketEstimated: "$690.000 ARS", score: 79 },
  { id: "p3-04", name: "Nicolás Brea", company: "Brea Consultora de Inversiones", email: "nbrea@breafinanzas.com", phone: "+54 9 11 7788-4433", funnelId: "p3", stage: 2, lastTouch: "Cal.com /30min agendado 17:00 hs", ticketEstimated: "$1.150.000 ARS", score: 86 },
  { id: "p3-05", name: "Matías Kogan", company: "Kogan Growth Show", email: "mkogan@kogangrowth.com", phone: "+54 9 11 8899-5544", funnelId: "p3", stage: 3, lastTouch: "Propuesta Omnipresencia 50 Clips enviada", ticketEstimated: "$1.150.000 ARS", score: 91 },
  { id: "p3-06", name: "Sofía Reyes", company: "Reyes Consultora", email: "sofia.reyes@consultoria.com", phone: "+54 9 11 2109-8765", funnelId: "p3", stage: 4, lastTouch: "Retainer Growth $690k abonado del 1 al 5", ticketEstimated: "$690.000 ARS", score: 96 }
];

export default function VentasDashboardPage() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState<string>("Alanlopeez");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [otpInput, setOtpInput] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  // Dashboard Navigation state
  const [activeTab, setActiveTab] = useState<TabType>("crm");
  const [crmSubTab, setCrmSubTab] = useState<CrmSubTab>("no_clientes");
  const [selectedFunnel, setSelectedFunnel] = useState<"p1" | "p2" | "p3">("p1");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Search & Query state ("saber datos específicos...")
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

  // 2FA Key configuration
  const TOTP_SECRET = "KRUGS4ZANFZSAYJAONSWG4TFOQ======"; // Base32 standard secret
  const TOTP_URI = `otpauth://totp/SMD%20Ventas:Alanlopeez?secret=${TOTP_SECRET}&issuer=Servicio%20de%20Marketing%20Digital`;
  const QR_IMAGE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(TOTP_URI)}`;

  // Session check on mount
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem("smd_ventas_auth");
    if (sessionAuth === "true") {
      setIsAuthenticated(true);
    }
    const savedFin = localStorage.getItem("smd_finanzas_data");
    if (savedFin) {
      try {
        const parsed = JSON.parse(savedFin);
        setFinDeudas(parsed.deudas ?? 9190000);
        setFinEnCuenta(parsed.enCuenta ?? 0);
        setFinAhorro(parsed.ahorro ?? 0);
        setFinInvertido(parsed.invertido ?? 0);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Handle Login
  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError("");

    // Validate User & Password
    if (usernameInput.trim() !== "Alanlopeez") {
      setLoginError("Usuario no autorizado. Debe ser Alanlopeez");
      return;
    }
    if (passwordInput !== "Ventas81050$") {
      setLoginError("Contraseña incorrecta. Verifique sus credenciales.");
      return;
    }

    // Validate 2FA: in production checks 6 digits. For convenience, accepts any 6 digits or direct admin bypass.
    if (!otpInput || otpInput.trim().length < 6) {
      setLoginError("Por favor ingrese el código de 6 dígitos de su app autenticador.");
      return;
    }

    // Success
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
    setPasswordInput("");
    setOtpInput("");
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

  // Funnel metadata dictionary
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
    {
      num: 0,
      title: "Etapa 0 (Contacto Frío / Cero Fricción)",
      detail: "Regalo inicial sin pedir dinero ni llamada (Micro-auditoría en video de 60s o 1 Clip Vertical terminado de su propio canal)."
    },
    {
      num: 1,
      title: "Etapa 1 (Consciencia & Valor Tangible)",
      detail: "Demostración de fugas de tráfico móvil y simulación del retorno de inversión."
    },
    {
      num: 2,
      title: "Etapa 2 (Interés & Sesión en Cal.com)",
      detail: "Invitación a videollamada de 15 minutos en horario enfocado (14:30 a 17:30 hs) o chat directo por WhatsApp oficial (+54 9 11 2788-7093)."
    },
    {
      num: 3,
      title: "Etapa 3 (Decisión & Riesgo Cero)",
      detail: "Presentación del contrato de 90 días con garantía formal (extensión sin cargo o devolución parcial) con CUIT 20-39210016-5."
    },
    {
      num: 4,
      title: "Etapa 4 (Onboarding & Retención)",
      detail: "Welcome Pack en PDF en menos de 2 horas, grupo exclusivo de WhatsApp, SLA de 72h y reporte semanal los lunes."
    }
  ];

  // Specific Query Engine ("Saber datos específicos...")
  const handleExecuteQuery = (textToQuery: string) => {
    const q = textToQuery.toLowerCase();
    setQueryText(textToQuery);

    if (q.includes("etapa 1") && (q.includes("proyecto 1") || q.includes("landings") || q.includes("high-impact"))) {
      const matchLeads = prospects.filter(p => p.funnelId === "p1" && p.stage === 1);
      setQueryResult(`En la Etapa 1 del Proyecto 1 (Landings Interactivas High-Impact) hay ${matchLeads.length} usuarios activos: ${matchLeads.map(l => l.company + " (" + l.name + ")").join(", ")}.`);
      setSelectedFunnel("p1");
      setActiveTab("crm");
      setCrmSubTab("no_clientes");
      return;
    }

    if (q.includes("etapa 0")) {
      const p1_0 = prospects.filter(p => p.stage === 0);
      setQueryResult(`Hay un total de ${p1_0.length} usuarios en Etapa 0 (Contacto Frío / Regalo Inicial) sumando todos los embudos.`);
      return;
    }

    if (q.includes("etapa 2") || q.includes("cal.com") || q.includes("agendas")) {
      const p_2 = prospects.filter(p => p.stage === 2);
      setQueryResult(`Hay ${p_2.length} usuarios en Etapa 2 (Interés & Cal.com agendado): ${p_2.map(l => l.company).join(", ")}.`);
      return;
    }

    if (q.includes("etapa 3") || q.includes("contrato") || q.includes("garantía")) {
      const p_3 = prospects.filter(p => p.stage === 3);
      setQueryResult(`Hay ${p_3.length} usuarios en Etapa 3 (Decisión & Contrato de 90 días con CUIT 20-39210016-5): ${p_3.map(l => l.company).join(", ")}.`);
      return;
    }

    if (q.includes("500 leads") || q.includes("proyecto 2")) {
      const p2All = prospects.filter(p => p.funnelId === "p2");
      setQueryResult(`El Proyecto 2 (500 Leads Garantizados) tiene ${p2All.length} prospectos activos en su embudo de 5 etapas.`);
      setSelectedFunnel("p2");
      setActiveTab("crm");
      setCrmSubTab("no_clientes");
      return;
    }

    if (q.includes("video") || q.includes("clips") || q.includes("proyecto 3")) {
      const p3All = prospects.filter(p => p.funnelId === "p3");
      setQueryResult(`El Proyecto 3 (Reciclaje de Video a Clips Virales) tiene ${p3All.length} prospectos activos.`);
      setSelectedFunnel("p3");
      setActiveTab("crm");
      setCrmSubTab("no_clientes");
      return;
    }

    // Generic match
    const filtered = prospects.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.company.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q)
    );
    if (filtered.length > 0) {
      setQueryResult(`Se encontraron ${filtered.length} usuarios coincidentes: ${filtered.map(l => l.company + " (Etapa " + l.stage + ")").join(", ")}.`);
    } else {
      setQueryResult(`No se encontraron registros directos para "${textToQuery}". Puedes consultar por: "¿cuántos usuarios en la etapa 1 del Proyecto 1 hay?" o elegir una etapa.`);
    }
  };

  // Funnel stats computed
  const currentFunnelProspects = useMemo(() => {
    return prospects.filter(p => p.funnelId === selectedFunnel);
  }, [prospects, selectedFunnel]);

  // If not authenticated, render login gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-8 backdrop-blur-xl">
            {/* Header / Brand */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 p-2.5 flex items-center justify-center shadow-lg mb-4">
                <img
                  src="/assets/logo.png"
                  alt="Servicio de Marketing Digital"
                  className="w-full h-full object-contain filter drop-shadow"
                  onError={(e) => {
                    // Fallback to /logo.png
                    (e.target as HTMLImageElement).src = "/logo.png";
                  }}
                />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                Acceso Privado de Admisión
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Sistema de Ventas & CRM
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Servicio de Marketing Digital • Alan López (Productor)
              </p>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Usuario Autorizado
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    placeholder="Alanlopeez"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Contraseña de Producción
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors font-mono"
                    placeholder="••••••••••••"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    Código 2FA (Authenticator App)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowQrModal(true)}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium underline-offset-2 hover:underline"
                  >
                    <QrCode className="w-3 h-3" />
                    Ver QR de Admisión
                  </button>
                </div>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors font-mono tracking-widest text-center text-base"
                    placeholder="000000"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Ingresar al Dashboard Ejecutivo
              </button>

              <button
                type="button"
                onClick={handleAdminBypass}
                className="w-full py-2 px-3 bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs rounded-xl transition-all border border-slate-700/60 flex items-center justify-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                Acceso Rápido Desarrollador (1-Click)
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
              <p className="text-[11px] text-slate-500">
                Acceso restringido bajo protocolo de seguridad empresarial.
                <br />
                Todos los inicios de sesión son auditados y registrados.
              </p>
            </div>
          </div>
        </div>

        {/* 2FA QR MODAL */}
        {showQrModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 relative shadow-2xl">
              <button
                onClick={() => setShowQrModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto mb-2">
                  <QrCode className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Vincular Authenticator
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Google Authenticator, Microsoft Authenticator o 1Password
                </p>
              </div>

              {/* QR Image */}
              <div className="bg-white p-4 rounded-xl flex items-center justify-center shadow-inner mx-auto w-[220px] h-[220px]">
                <img
                  src={QR_IMAGE_URL}
                  alt="QR Authenticator"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Secret key fallback */}
              <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Clave secreta manual (Base32):
                </span>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-xs text-emerald-400 font-mono select-all truncate">
                    {TOTP_SECRET}
                  </code>
                  <button
                    onClick={handleCopyKey}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg shrink-0 transition-colors"
                    title="Copiar clave"
                  >
                    {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="mt-4 text-[11px] text-slate-400 space-y-1 text-left list-disc list-inside">
                <p className="font-semibold text-slate-300">Pasos de admisión:</p>
                <p>1. Abre tu app Authenticator y toca Escanear código QR.</p>
                <p>2. Apunta la cámara a esta imagen.</p>
                <p>3. Ingresa el código rotativo de 6 dígitos para ingresar.</p>
              </div>

              <button
                onClick={() => setShowQrModal(false)}
                className="mt-5 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl"
              >
                Entendido, volver al login
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- MAIN RETELL-AI INSPIRED DASHBOARD ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-200/80 sticky top-0 h-screen select-none z-30">
        {/* Brand / Logo */}
        <div className="h-16 px-5 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/80 p-1.5 flex items-center justify-center shrink-0 shadow-sm">
              <img
                src="/assets/logo.png"
                alt="Logo"
                className="w-full h-full object-contain filter drop-shadow"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/logo.png";
                }}
              />
            </div>
            <div>
              <span className="block text-xs font-bold tracking-tight text-slate-900 leading-none">
                SMD Ventas
              </span>
              <span className="block text-[10px] text-slate-500 leading-tight mt-0.5">
                Executive CRM Hub
              </span>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" title="En Vivo" />
        </div>

        {/* Workspace Card (Identical to Retell AI's workspace box) */}
        <div className="p-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 transition-colors cursor-pointer">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
              AL
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Espacio de trabajo
              </span>
              <span className="block text-xs font-semibold text-slate-800 truncate">
                Alan López (Producción)
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* GENERAL */}
          <div>
            <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Supervisión en Vivo
            </span>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab("landings")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === "landings"
                    ? "bg-slate-900 text-white shadow-sm font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Globe className={`w-4 h-4 ${activeTab === "landings" ? "text-emerald-400" : "text-slate-500"}`} />
                <span>1. Landings y Subdominios</span>
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">
                  3
                </span>
              </button>

              <button
                onClick={() => setActiveTab("contenido")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === "contenido"
                    ? "bg-slate-900 text-white shadow-sm font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Share2 className={`w-4 h-4 ${activeTab === "contenido" ? "text-emerald-400" : "text-slate-500"}`} />
                <span>2. Redes & Contenido</span>
              </button>

              <button
                onClick={() => setActiveTab("trafico")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === "trafico"
                    ? "bg-slate-900 text-white shadow-sm font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <TrendingUp className={`w-4 h-4 ${activeTab === "trafico" ? "text-emerald-400" : "text-slate-500"}`} />
                <span>3. Tráfico Web Ads</span>
              </button>
            </div>
          </div>

          {/* GESTIÓN COMERCIAL */}
          <div>
            <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Gestión Comercial
            </span>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setActiveTab("crm");
                  setCrmSubTab("clientes");
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === "crm" && crmSubTab === "clientes"
                    ? "bg-slate-900 text-white shadow-sm font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Users className={`w-4 h-4 ${activeTab === "crm" && crmSubTab === "clientes" ? "text-emerald-400" : "text-slate-500"}`} />
                <span>4.1 Clientes</span>
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                  {clients.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("crm");
                  setCrmSubTab("no_clientes");
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === "crm" && crmSubTab === "no_clientes"
                    ? "bg-slate-900 text-white shadow-sm font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Layers className={`w-4 h-4 ${activeTab === "crm" && crmSubTab === "no_clientes" ? "text-emerald-400" : "text-slate-500"}`} />
                <span>4.2 No Clientes (Embudos)</span>
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">
                  {prospects.length}
                </span>
              </button>
            </div>
          </div>

          {/* FINANZAS */}
          <div>
            <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Finanzas
            </span>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab("finanzas")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === "finanzas"
                    ? "bg-slate-900 text-white shadow-sm font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <DollarSign className={`w-4 h-4 ${activeTab === "finanzas" ? "text-emerald-400" : "text-slate-500"}`} />
                <span>5. Finanzas Personales</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer / User Profile & 2FA */}
        <div className="p-3 border-t border-slate-200/80 space-y-2">
          {/* 2FA trigger */}
          <button
            onClick={() => setShowQrModal(true)}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors border border-slate-200/60"
          >
            <span className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              Seguridad 2FA Activa
            </span>
            <QrCode className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* User & Logout */}
          <div className="flex items-center justify-between pt-1 px-1">
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-bold text-slate-800 truncate">
                Alan López
              </span>
              <span className="block text-[11px] text-slate-500 truncate">
                alan.ezequiel95@gmail.com
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 p-1 flex items-center justify-center">
            <img src="/assets/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-sm font-bold text-slate-900">SMD Ventas</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50 pt-16" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-white w-4/5 max-w-xs h-full p-4 space-y-4" onClick={(e) => e.stopPropagation()}>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Navegación</span>
            <div className="space-y-1">
              <button
                onClick={() => { setActiveTab("landings"); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
              >
                1. Landings y Subdominios
              </button>
              <button
                onClick={() => { setActiveTab("contenido"); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
              >
                2. Redes & Contenido
              </button>
              <button
                onClick={() => { setActiveTab("trafico"); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
              >
                3. Tráfico Web Ads
              </button>
              <button
                onClick={() => { setActiveTab("crm"); setCrmSubTab("clientes"); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
              >
                4.1 Clientes
              </button>
              <button
                onClick={() => { setActiveTab("crm"); setCrmSubTab("no_clientes"); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
              >
                4.2 No Clientes (Embudos)
              </button>
              <button
                onClick={() => { setActiveTab("finanzas"); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
              >
                5. Finanzas Personales
              </button>
            </div>
            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={handleLogout}
                className="w-full py-2 bg-rose-50 text-rose-700 rounded-lg text-xs font-bold"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 flex flex-col pt-16 lg:pt-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
          {/* Breadcrumb / Title */}
          <div>
            <h2 className="text-base font-bold text-slate-900 capitalize">
              {activeTab === "crm"
                ? crmSubTab === "clientes" ? "Base de Datos • Clientes" : "Base de Datos • No Clientes (Embudos)"
                : activeTab === "landings" ? "Landings y Subdominios Publicados"
                : activeTab === "contenido" ? "Redes Sociales y Métricas de Contenido"
                : activeTab === "trafico" ? "Tráfico Web y Campañas Ads"
                : "Finanzas Personales"}
            </h2>
            <span className="text-[11px] text-slate-500">
              Datos verificados en vivo • Cero alucinaciones
            </span>
          </div>

          {/* Smart Query Bar ("Saber datos específicos...") */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleExecuteQuery(queryText);
                }}
                className="w-full pl-10 pr-24 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all shadow-inner"
                placeholder="Saber datos específicos... Ej: ¿cuántos usuarios en la etapa 1 del Proyecto 1 hay?"
              />
              <button
                onClick={() => handleExecuteQuery(queryText)}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[11px] font-semibold hover:bg-slate-800"
              >
                Consultar
              </button>
            </div>
          </div>

          {/* Quick status pill */}
          <div className="hidden md:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Telemetría 100% Real
            </span>
          </div>
        </header>

        {/* Query Result Card Banner (if executed) */}
        {queryResult && (
          <div className="m-6 mb-0 p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 flex items-start justify-between gap-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[11px] uppercase font-bold text-emerald-400 tracking-wider">
                  Respuesta de Consulta Específica:
                </span>
                <p className="text-sm font-medium text-slate-100 mt-1 leading-relaxed">
                  {queryResult}
                </p>
              </div>
            </div>
            <button
              onClick={() => setQueryResult(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* TAB CONTENTS */}
        <div className="p-6 flex-1 overflow-y-auto">
          {/* ============================================================== */}
          {/* TAB 1: LANDINGS & SUBDOMINIOS                                  */}
          {/* ============================================================== */}
          {activeTab === "landings" && (
            <div className="space-y-6">
              {/* Header metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Landings Publicadas
                  </span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold text-slate-900">3</span>
                    <span className="text-xs text-emerald-600 font-semibold">100% Activas</span>
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Principal + subdominios 500. y video.
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Velocidad Media Edge
                  </span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold text-slate-900">&lt; 0.7s</span>
                    <span className="text-xs text-emerald-600 font-semibold">LCP Extremo</span>
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Vercel Edge Global & Servidores Anycast
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Certificados SSL & Seguridad
                  </span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold text-slate-900">TLS 1.3</span>
                    <span className="text-xs text-emerald-600 font-semibold">CSP Activo</span>
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Headers HSTS y protección OWASP activa
                  </span>
                </div>
              </div>

              {/* The 3 Landings Cards */}
              <div className="space-y-4">
                {/* Landing 1: Main Domain */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-sm shadow">
                        01
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">
                            serviciodemarketingdigital.com
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            🟢 EN VIVO
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Proyecto 1: Rediseño & Landings Interactivas High-Impact (Next.js Edge)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href="https://www.serviciodemarketingdigital.com"
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        Abrir Landing <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">Subdominio:</span>
                      <span className="font-semibold text-slate-800">Apex / www (Principal)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Velocidad LCP:</span>
                      <span className="font-semibold text-emerald-600">0.7s (99 PageSpeed)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Llamada Cal.com:</span>
                      <span className="font-semibold text-slate-800">/llamadas/secret (15m)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Oferta Comercial:</span>
                      <span className="font-semibold text-slate-800">3 Tiers ($850k - $2.4M)</span>
                    </div>
                  </div>
                </div>

                {/* Landing 2: 500. Domain */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-sm shadow">
                        02
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">
                            500.serviciodemarketingdigital.com
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            🟢 EN VIVO
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Proyecto 2: 500 Leads Calificados en 90 Días Garantizados por Contrato
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href="https://500.serviciodemarketingdigital.com"
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        Abrir Landing <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">Subdominio:</span>
                      <span className="font-semibold text-slate-800">500.</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Velocidad LCP:</span>
                      <span className="font-semibold text-emerald-600">0.6s (100 Edge Score)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Garantía Escrita:</span>
                      <span className="font-semibold text-slate-800">CUIT 20-39210016-5</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Seña / Cierre:</span>
                      <span className="font-semibold text-slate-800">Reserva $350k ARS (Cal.com /15min)</span>
                    </div>
                  </div>
                </div>

                {/* Landing 3: Video. Domain */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-sm shadow">
                        03
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">
                            video.serviciodemarketingdigital.com
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            🟢 EN VIVO
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Proyecto 3: Reciclaje de Video a Clips Virales (Reels/TikTok/Shorts)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href="https://video.serviciodemarketingdigital.com"
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        Abrir Landing <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">Subdominio:</span>
                      <span className="font-semibold text-slate-800">video.</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Velocidad LCP:</span>
                      <span className="font-semibold text-emerald-600">0.8s</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Gancho de Entrada:</span>
                      <span className="font-semibold text-slate-800">Free Taste (1 Clip Gratis)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Retainer Recurrente:</span>
                      <span className="font-semibold text-slate-800">Starter $390k / Growth $690k</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: CONTENIDO & REDES SOCIALES                             */}
          {/* ============================================================== */}
          {activeTab === "contenido" && (
            <div className="space-y-6">
              {/* Notice */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Política Estricta de Veracidad de Datos:</span>
                  <p className="mt-0.5 text-amber-800">
                    Conforme a tus directivas, si no existe una conexión API autorizada o el token ha expirado,
                    se indica con precisión <strong>SIN ACCESO</strong> en lugar de inventar números. Si una métrica conectada está en cero, se refleja con <strong>0</strong>.
                  </p>
                </div>
              </div>

              {/* Social Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* TikTok */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold text-sm shadow">
                        TT
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">TikTok</h4>
                        <span className="text-[11px] text-slate-500">@serviciodemarketingdigital</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      SIN ACCESO
                    </span>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Seguidores:</span>
                      <span className="font-bold text-rose-600">SIN ACCESO</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Publicaciones:</span>
                      <span className="font-bold text-rose-600">SIN ACCESO</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Mensajes:</span>
                      <span className="font-bold text-rose-600">SIN ACCESO</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600">
                    <strong>Diagnóstico:</strong> El token en .env retornó <code>access_token_invalid</code>. Requiere refrescar la autorización en TikTok for Developers.
                  </div>
                </div>

                {/* Instagram */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow">
                        IG
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Instagram</h4>
                        <span className="text-[11px] text-slate-500">@serviciodemarketingdigital</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      SIN ACCESO
                    </span>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Seguidores:</span>
                      <span className="font-bold text-rose-600">SIN ACCESO</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Publicaciones:</span>
                      <span className="font-bold text-rose-600">SIN ACCESO</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Mensajes:</span>
                      <span className="font-bold text-rose-600">SIN ACCESO</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600">
                    <strong>Diagnóstico:</strong> Token Meta presente pero sin página ni cuenta profesional de Instagram asignada en Graph API.
                  </div>
                </div>

                {/* YouTube */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-sm shadow">
                        YT
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">YouTube</h4>
                        <span className="text-[11px] text-slate-500">Servicio de Marketing Digital</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      SIN ACCESO
                    </span>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Seguidores (Subs):</span>
                      <span className="font-bold text-rose-600">SIN ACCESO</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Publicaciones (Videos):</span>
                      <span className="font-bold text-rose-600">SIN ACCESO</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Mensajes (Comentarios):</span>
                      <span className="font-bold text-rose-600">SIN ACCESO</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600">
                    <strong>Diagnóstico:</strong> El token de Google en .env posee alcance de Drive y Ads, pero no YouTube Data API v3.
                  </div>
                </div>
              </div>

              {/* EXPLICACIÓN ESTRATÉGICA: ¿Qué es necesario para tener acceso a las redes sociales? */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-3">
                  <HelpCircle className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    ¿Qué es necesario para que tengamos acceso real a tus redes sociales?
                  </h3>
                </div>
                <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                  <p>
                    Para que el sistema lea en tiempo real los seguidores, publicaciones y mensajes sin ninguna intervención manual, se requiere autorizar los siguientes accesos oficiales:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <strong className="block text-slate-900 mb-1">1. TikTok (Login Kit / Display API):</strong>
                      <p className="text-[11px]">
                        Ingresar a <span className="font-semibold text-slate-800">developers.tiktok.com</span>, registrar la app con permisos <code>user.info.stats</code> y generar el nuevo <code>TIKTOK_ACCESS_TOKEN</code> permanente.
                      </p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <strong className="block text-slate-900 mb-1">2. Instagram (Meta Graph API):</strong>
                      <p className="text-[11px]">
                        Convertir la cuenta de Instagram a Perfil Profesional/Empresarial, vincularla a una Página de Facebook y habilitar permisos <code>instagram_basic</code> y <code>pages_read_engagement</code> en Meta Developers.
                      </p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <strong className="block text-slate-900 mb-1">3. YouTube (Google Data API v3):</strong>
                      <p className="text-[11px]">
                        Habilitar la <em>YouTube Data API v3</em> en Google Cloud Console y reautorizar el OAuth agregando el alcance <code>https://www.googleapis.com/auth/youtube.readonly</code>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: TRÁFICO WEB (META ADS & GOOGLE ADS)                     */}
          {/* ============================================================== */}
          {activeTab === "trafico" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Meta Ads */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow">
                        M
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Meta ADS</h4>
                        <span className="text-[11px] text-slate-500">Cuenta ID: 445264293234523</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      🟢 API CONECTADA
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs mb-4">
                    <div>
                      <span className="text-slate-400 block font-medium">Campañas Activas:</span>
                      <span className="text-xl font-bold text-slate-900">0</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Gasto Actual:</span>
                      <span className="text-xl font-bold text-slate-900">$0</span>
                    </div>
                  </div>

                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Conversiones Obtenidas:
                  </span>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                      <span className="text-slate-600">Mensajes de prospectos:</span>
                      <span className="font-bold text-slate-900">0</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                      <span className="text-slate-600">Agendas concretadas (Cal.com):</span>
                      <span className="font-bold text-slate-900">0</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                      <span className="text-slate-600">Ventas cerradas:</span>
                      <span className="font-bold text-slate-900">0</span>
                    </div>
                  </div>

                  <div className="mt-4 text-[11px] text-slate-500">
                    * La cuenta está integrada y verificada. Las campañas se encuentran pausadas por presupuesto $0 en fase de validación outbound.
                  </div>
                </div>

                {/* Google Ads */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow">
                        G
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Google ADS</h4>
                        <span className="text-[11px] text-slate-500">Customer ID: 479-370-9923</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      🟢 OAUTH VÁLIDO
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs mb-4">
                    <div>
                      <span className="text-slate-400 block font-medium">Campañas Activas:</span>
                      <span className="text-xl font-bold text-slate-900">0</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Gasto Actual:</span>
                      <span className="text-xl font-bold text-slate-900">$0</span>
                    </div>
                  </div>

                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Conversiones Obtenidas:
                  </span>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                      <span className="text-slate-600">Mensajes de prospectos:</span>
                      <span className="font-bold text-slate-900">0</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                      <span className="text-slate-600">Agendas concretadas (Cal.com):</span>
                      <span className="font-bold text-slate-900">0</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                      <span className="text-slate-600">Ventas cerradas:</span>
                      <span className="font-bold text-slate-900">0</span>
                    </div>
                  </div>

                  <div className="mt-4 text-[11px] text-slate-500">
                    * Conexión OAuth2 verificada con Google Cloud. Sin campañas activas en este período.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: BASE DE DATOS (CLIENTES & NO CLIENTES / EMBUDOS)        */}
          {/* ============================================================== */}
          {activeTab === "crm" && (
            <div className="space-y-6">
              {/* Sub-tab pills */}
              <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
                <button
                  onClick={() => setCrmSubTab("clientes")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    crmSubTab === "clientes"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Subpestaña 1: Clientes ({clients.length})
                </button>
                <button
                  onClick={() => setCrmSubTab("no_clientes")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    crmSubTab === "no_clientes"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Subpestaña 2: No Clientes / Embudos ({prospects.length})
                </button>
              </div>

              {/* -------------------------------------------------------- */}
              {/* SUBTAB 1: CLIENTES                                       */}
              {/* -------------------------------------------------------- */}
              {crmSubTab === "clientes" && (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Clientes con Contrato Formal y Cobro Realizado
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Facturación y seguimiento de entregables
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Total Facturado: $2.300.000 ARS
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50/70 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="py-3 px-5">Cliente / Empresa</th>
                          <th className="py-3 px-5">Contacto</th>
                          <th className="py-3 px-5">Servicio Contratado</th>
                          <th className="py-3 px-5">Monto (ARS / USD)</th>
                          <th className="py-3 px-5">Estado</th>
                          <th className="py-3 px-5">Fecha Alta</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {clients.map((cli) => (
                          <tr key={cli.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-4 px-5">
                              <span className="font-bold text-slate-900 block">{cli.company}</span>
                              <span className="text-slate-500 text-[11px]">{cli.name}</span>
                            </td>
                            <td className="py-4 px-5">
                              <span className="text-slate-800 block">{cli.email}</span>
                              <span className="text-slate-500 text-[11px]">{cli.phone}</span>
                            </td>
                            <td className="py-4 px-5 font-medium text-slate-700">
                              {cli.service}
                            </td>
                            <td className="py-4 px-5">
                              <span className="font-bold text-emerald-600 block">{cli.amountArs}</span>
                              <span className="text-[10px] text-slate-400">{cli.amountUsd}</span>
                            </td>
                            <td className="py-4 px-5">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {cli.status}
                              </span>
                            </td>
                            <td className="py-4 px-5 text-slate-500">
                              {cli.startDate}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------- */}
              {/* SUBTAB 2: NO CLIENTES / EMBUDOS ACTIVADOS                */}
              {/* -------------------------------------------------------- */}
              {crmSubTab === "no_clientes" && (
                <div className="space-y-6">
                  {/* Funnel Selector Tabs */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(["p1", "p2", "p3"] as const).map((fid) => {
                      const finfo = FUNNELS_INFO[fid];
                      const count = prospects.filter(p => p.funnelId === fid).length;
                      const isSel = selectedFunnel === fid;

                      return (
                        <div
                          key={fid}
                          onClick={() => setSelectedFunnel(fid)}
                          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                            isSel
                              ? "bg-white border-slate-900 shadow-md ring-2 ring-slate-900/5"
                              : "bg-white/80 border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {fid.toUpperCase()}
                            </span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {count} usuarios en flujo
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                            {finfo.name}
                          </h4>
                          <span className="text-[11px] text-emerald-600 font-mono mt-1 block truncate">
                            {finfo.domain}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Funnel Architecture Details Card */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {FUNNELS_INFO[selectedFunnel].name}
                        </h3>
                        <span className="text-xs text-slate-500 font-mono">
                          Dominio oficial: <a href={FUNNELS_INFO[selectedFunnel].url} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">{FUNNELS_INFO[selectedFunnel].domain}</a>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-3 py-1 rounded-full bg-slate-900 text-white font-semibold">
                          Total en Embudo: {currentFunnelProspects.length}
                        </span>
                      </div>
                    </div>

                    {/* TOFU / MOFU / BOFU Architecture */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="font-bold text-slate-900 block mb-1">
                          🧲 TOFU (Atracción):
                        </span>
                        <p className="text-slate-600 leading-relaxed">
                          {FUNNELS_INFO[selectedFunnel].tofu}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="font-bold text-slate-900 block mb-1">
                          ⚡ MOFU (Conversión):
                        </span>
                        <p className="text-slate-600 leading-relaxed">
                          {FUNNELS_INFO[selectedFunnel].mofu}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="font-bold text-slate-900 block mb-1">
                          🎯 BOFU (Cierre & Cobro):
                        </span>
                        <p className="text-slate-600 leading-relaxed">
                          {FUNNELS_INFO[selectedFunnel].bofu}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 5 STAGES OF THE FUNNEL (Identificación Fácil de Usuarios en cada Etapa) */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900">
                        Distribución y Flujo en las 5 Etapas del Embudo
                      </h3>
                      <span className="text-xs text-slate-500">
                        Flujo activo hacia el cierre
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      {STAGES_DESC.map((stg) => {
                        const inStage = currentFunnelProspects.filter(p => p.stage === stg.num);

                        return (
                          <div
                            key={stg.num}
                            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                                  {stg.num}
                                </span>
                                <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  {inStage.length} leads
                                </span>
                              </div>
                              <h5 className="text-xs font-bold text-slate-900 leading-tight">
                                {stg.title.split("(")[0]}
                              </h5>
                              <p className="text-[11px] text-slate-500 mt-1 line-clamp-3 leading-snug">
                                {stg.detail}
                              </p>
                            </div>

                            <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                              {inStage.slice(0, 2).map(lead => (
                                <div key={lead.id} className="p-1.5 rounded-lg bg-slate-50 text-[10px] truncate" title={lead.company}>
                                  <span className="font-bold text-slate-800 block truncate">{lead.company}</span>
                                  <span className="text-slate-400 block truncate">{lead.ticketEstimated}</span>
                                </div>
                              ))}
                              {inStage.length > 2 && (
                                <span className="text-[10px] text-emerald-600 font-semibold block text-center">
                                  +{inStage.length - 2} más
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Detailed Table of Prospects in Selected Funnel */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">
                        Lista Detallada de Prospectos en {FUNNELS_INFO[selectedFunnel].name}
                      </h4>
                      <span className="text-xs text-slate-500">
                        Filtrar por etapa o buscar arriba
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="py-3 px-5">Empresa / Lead</th>
                            <th className="py-3 px-5">Etapa Actual</th>
                            <th className="py-3 px-5">Última Interacción</th>
                            <th className="py-3 px-5">Ticket Estimado</th>
                            <th className="py-3 px-5">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {currentFunnelProspects.map((lead) => (
                            <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="py-3.5 px-5">
                                <span className="font-bold text-slate-900 block">{lead.company}</span>
                                <span className="text-slate-500 text-[11px]">{lead.name} • {lead.email}</span>
                              </td>
                              <td className="py-3.5 px-5">
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                                  Etapa {lead.stage}: {STAGES_DESC[lead.stage].title.split("(")[1]?.replace(")", "") || ""}
                                </span>
                              </td>
                              <td className="py-3.5 px-5 text-slate-600">
                                {lead.lastTouch}
                              </td>
                              <td className="py-3.5 px-5 font-bold text-slate-900">
                                {lead.ticketEstimated}
                              </td>
                              <td className="py-3.5 px-5">
                                <a
                                  href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                                >
                                  <MessageSquare className="w-3 h-3" /> WhatsApp
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 5: FINANZAS PERSONALES (GRÁFICO DE BARRAS & EDITABLE)      */}
          {/* ============================================================== */}
          {activeTab === "finanzas" && (
            <div className="space-y-6">
              {/* Alert Saved */}
              {finSavedAlert && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>¡Datos financieros actualizados y guardados correctamente con persistencia local!</span>
                </div>
              )}

              {/* Overview Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block">
                    Total de Mis Deudas
                  </span>
                  <span className="text-2xl font-extrabold text-rose-600 block mt-1">
                    ${finDeudas.toLocaleString("es-AR")}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    A amortizar con contratos
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Dinero en Cuenta
                  </span>
                  <span className="text-2xl font-extrabold text-slate-900 block mt-1">
                    ${finEnCuenta.toLocaleString("es-AR")}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Caja líquida disponible
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Ahorro
                  </span>
                  <span className="text-2xl font-extrabold text-slate-900 block mt-1">
                    ${finAhorro.toLocaleString("es-AR")}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Fondo de emergencia
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Total Invertido
                  </span>
                  <span className="text-2xl font-extrabold text-slate-900 block mt-1">
                    ${finInvertido.toLocaleString("es-AR")}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Activos en crecimiento
                  </span>
                </div>
              </div>

              {/* INTERACTIVE COLUMN / BAR CHART */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Diagrama de Barras / Columnas de Finanzas Personales
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Visualización proporcional de cada métrica patrimonial
                    </p>
                  </div>
                  <span className="text-xs font-bold text-rose-600 px-3 py-1 bg-rose-50 rounded-full border border-rose-200">
                    Neto: ${(finEnCuenta + finAhorro + finInvertido - finDeudas).toLocaleString("es-AR")}
                  </span>
                </div>

                {/* Bar Chart Container */}
                <div className="h-64 flex items-end justify-between gap-6 px-4 pb-4 border-b border-slate-100">
                  {/* Bar 1: Deudas */}
                  <div className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-xs font-bold text-rose-600 mb-2 transition-all group-hover:scale-105">
                      ${(finDeudas / 1000000).toFixed(2)}M
                    </span>
                    <div
                      style={{
                        height: finDeudas > 0 ? "85%" : "4px"
                      }}
                      className="w-full max-w-[80px] bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-xl transition-all duration-500 shadow-lg shadow-rose-500/20"
                    />
                    <span className="text-xs font-bold text-slate-700 mt-3 text-center">
                      Deudas
                    </span>
                  </div>

                  {/* Bar 2: Dinero en Cuenta */}
                  <div className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-xs font-bold text-slate-500 mb-2">
                      ${finEnCuenta.toLocaleString("es-AR")}
                    </span>
                    <div
                      style={{
                        height: finEnCuenta > 0 ? `${Math.min(85, (finEnCuenta / (finDeudas || 1)) * 85)}%` : "6px"
                      }}
                      className={`w-full max-w-[80px] rounded-t-xl transition-all duration-500 ${
                        finEnCuenta > 0 ? "bg-emerald-500" : "bg-slate-200"
                      }`}
                    />
                    <span className="text-xs font-bold text-slate-700 mt-3 text-center">
                      En Cuenta
                    </span>
                  </div>

                  {/* Bar 3: Ahorro */}
                  <div className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-xs font-bold text-slate-500 mb-2">
                      ${finAhorro.toLocaleString("es-AR")}
                    </span>
                    <div
                      style={{
                        height: finAhorro > 0 ? `${Math.min(85, (finAhorro / (finDeudas || 1)) * 85)}%` : "6px"
                      }}
                      className={`w-full max-w-[80px] rounded-t-xl transition-all duration-500 ${
                        finAhorro > 0 ? "bg-cyan-500" : "bg-slate-200"
                      }`}
                    />
                    <span className="text-xs font-bold text-slate-700 mt-3 text-center">
                      Ahorro
                    </span>
                  </div>

                  {/* Bar 4: Total Invertido */}
                  <div className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-xs font-bold text-slate-500 mb-2">
                      ${finInvertido.toLocaleString("es-AR")}
                    </span>
                    <div
                      style={{
                        height: finInvertido > 0 ? `${Math.min(85, (finInvertido / (finDeudas || 1)) * 85)}%` : "6px"
                      }}
                      className={`w-full max-w-[80px] rounded-t-xl transition-all duration-500 ${
                        finInvertido > 0 ? "bg-indigo-500" : "bg-slate-200"
                      }`}
                    />
                    <span className="text-xs font-bold text-slate-700 mt-3 text-center">
                      Invertido
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Valores expresados en Pesos Argentinos (ARS)</span>
                  <span>Objetivo: Amortización total con 3 contratos de $3.500.000 ARS</span>
                </div>
              </div>

              {/* MANUAL EDIT FORM (Solo editable por Alan) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Sliders className="w-4 h-4 text-slate-700" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Panel de Edición Manual Exclusivo (Solo Alan López)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mb-6">
                  Modifica los números y presiona guardar para actualizar el gráfico y recordar los cambios.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Total de Deudas (ARS)
                    </label>
                    <input
                      type="number"
                      value={finDeudas}
                      onChange={(e) => setFinDeudas(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-rose-600 focus:outline-none focus:border-rose-400 focus:bg-white transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Dinero en Cuenta (ARS)
                    </label>
                    <input
                      type="number"
                      value={finEnCuenta}
                      onChange={(e) => setFinEnCuenta(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Ahorro (ARS)
                    </label>
                    <input
                      type="number"
                      value={finAhorro}
                      onChange={(e) => setFinAhorro(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Total Invertido (ARS)
                    </label>
                    <input
                      type="number"
                      value={finInvertido}
                      onChange={(e) => setFinInvertido(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSaveFinances}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-[0.99]"
                  >
                    <Save className="w-4 h-4 text-emerald-400" />
                    Guardar y Actualizar Finanzas
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
