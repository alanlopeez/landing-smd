"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Phone,
  Calendar,
  ExternalLink,
  ChevronDown,
  Minimize2,
  Clock,
  ShieldCheck,
  Zap,
  Play,
  FileText
} from "lucide-react";
import RedesignLeadModal from "./RedesignLeadModal";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  actionUrl?: string;
  actionLabel?: string;
  quickReplies?: string[];
}

const OFFICIAL_WHATSAPP = "5491127887093";
const FORMATTED_WHATSAPP = "+54 9 11 2788-7093";

const INITIAL_QUICK_REPLIES = [
  "⚡ Rediseño Web ($490 USD)",
  "🛡️ Plan 500 Leads Garantizados",
  "📅 Agendar Llamada (15 min)",
  "🎥 Ver Demo en YouTube",
  "💬 Hablar por WhatsApp Directo",
];

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize messages
  useEffect(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages([
      {
        id: "msg-welcome",
        sender: "bot",
        text: `¡Hola! 👋 Soy el Asistente con IA de **Alan López - Servicio de Marketing Digital**.\n\n¿En qué podemos ayudarte hoy para potenciar las ventas de tu negocio? Puedes elegir una opción rápida o escribir tu consulta.`,
        timestamp: timeStr,
        quickReplies: INITIAL_QUICK_REPLIES,
      },
    ]);

    const handleOpenModal = () => {
      setIsLeadModalOpen(true);
    };

    window.addEventListener("open-redesign-modal", handleOpenModal);
    return () => {
      window.removeEventListener("open-redesign-modal", handleOpenModal);
    };
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setHasUnread(false);
    }
  }, [messages, isOpen, isTyping]);

  const handleOpenChat = () => {
    setIsOpen(true);
    setHasUnread(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  const generateBotReply = (userQuery: string): { text: string; actionUrl?: string; actionLabel?: string; quickReplies?: string[] } => {
    const q = userQuery.toLowerCase().trim();

    // 1. Precios / Tarifas / Planes
    if (q.includes("precio") || q.includes("cuanto") || q.includes("cuánto") || q.includes("costo") || q.includes("tarifa") || q.includes("plan") || q.includes("490")) {
      return {
        text: `Nuestros principales servicios y valores transparentes son:\n\n1. ⚡ **Rediseño Web Interactivo:** $490 USD (primera versión en 48 hs hábiles).\n2. 🛡️ **500 Leads en 90 Días:** $3.500.000 ARS garantizados por contrato escrito (o gratis).\n3. 🎬 **Video Repurposing & Redes:** Estrategia multicanal de alto impacto.\n\n¿Querés coordinar por WhatsApp o agendar una llamada ejecutiva de 15 min?`,
        actionUrl: `https://wa.me/${OFFICIAL_WHATSAPP}?text=${encodeURIComponent("Hola Alan, quiero consultar por los precios y planes de rediseño web.")}`,
        actionLabel: `💬 Consultar por WhatsApp (${FORMATTED_WHATSAPP})`,
        quickReplies: ["📅 Agendar Llamada (15 min)", "🛡️ ¿Cómo funciona la garantía?", "⚡ Comenzar mi rediseño"],
      };
    }

    // 2. Garantía / Seguridad / Devolución
    if (q.includes("garant") || q.includes("devolu") || q.includes("segur") || q.includes("riesgo") || q.includes("contrato")) {
      return {
        text: `Nuestras garantías están respaldadas contractualmente:\n\n• **Fidelidad de Diseño Web:** Tienes revisiones continuas y primera propuesta en 48 hs. Si el resultado final difiere de lo acordado, se reembolsa el 100%.\n• **Garantía 500 Leads:** Si en 90 días no entregamos los 500 leads calificados, seguimos operando sin costo hasta cumplirlos o te devolvemos el dinero.\n\n¿Deseas hablar directamente con Alan López por WhatsApp?`,
        actionUrl: `https://wa.me/${OFFICIAL_WHATSAPP}?text=${encodeURIComponent("Hola Alan, quiero más información sobre la garantía legal por contrato.")}`,
        actionLabel: `💬 Hablar por WhatsApp (${FORMATTED_WHATSAPP})`,
        quickReplies: ["⚡ Rediseño Web ($490 USD)", "📅 Agendar Llamada (15 min)"],
      };
    }

    // 3. Demo en video / Casos / Portfolio
    if (q.includes("demo") || q.includes("youtube") || q.includes("video") || q.includes("ejemplo") || q.includes("portfolio") || q.includes("caso") || q.includes("muestra")) {
      return {
        text: `Puedes ver nuestra DEMO interactiva en video de 1 minuto aquí:\n\n🎥 [Ver Demo en YouTube](https://youtu.be/M5_QicGRh-s?si=vOCtc6L-uMgpsb0G)\n\nTambién puedes ver la propuesta inmersiva tipo Apple para **Calzados Praga** navegando en nuestra sección de portfolio.`,
        actionUrl: "https://youtu.be/M5_QicGRh-s?si=vOCtc6L-uMgpsb0G",
        actionLabel: "▶️ Ver Video DEMO en YouTube",
        quickReplies: ["⚡ Rediseño Web ($490 USD)", "💬 Hablar por WhatsApp Directo"],
      };
    }

    // 4. Agendar llamada / Calendario / Cal.com
    if (q.includes("agendar") || q.includes("llamada") || q.includes("reunion") || q.includes("reunión") || q.includes("cal") || q.includes("turno") || q.includes("zoom")) {
      return {
        text: `Puedes agendar una videollamada ejecutiva de 15 minutos directamente en el calendario oficial:\n\n📅 **Llamada de Asesoría Web:** [cal.com/llamadas/online](https://cal.com/llamadas/online)\n📅 **Plan 500 Leads:** [cal.com/llamadas/15min](https://cal.com/llamadas/15min)\n\nO si preferís coordinar ahora mismo, escribinos al WhatsApp **${FORMATTED_WHATSAPP}**.`,
        actionUrl: "https://cal.com/llamadas/online",
        actionLabel: "📅 Abrir Calendario Cal.com (15 min)",
        quickReplies: ["💬 Escribir al WhatsApp (+54 9 11 2788-7093)", "⚡ Rediseño Web ($490 USD)"],
      };
    }

    // 5. WhatsApp / Teléfono / Contacto
    if (q.includes("whatsapp") || q.includes("telefono") || q.includes("teléfono") || q.includes("celular") || q.includes("numero") || q.includes("número") || q.includes("contacto") || q.includes("hablar") || q.includes("alan")) {
      return {
        text: `Nuestro WhatsApp oficial directo y disponible 24/7 es:\n\n📱 **${FORMATTED_WHATSAPP}**\n\nAtención directa con Alan López para evaluar tu caso de forma inmediata sin esperas.`,
        actionUrl: `https://wa.me/${OFFICIAL_WHATSAPP}?text=${encodeURIComponent("Hola Alan, estuve consultando en tu web y quiero contactarme directamente.")}`,
        actionLabel: `💬 Chatear al WhatsApp (${FORMATTED_WHATSAPP})`,
        quickReplies: ["📅 Agendar Llamada (15 min)", "⚡ Comenzar mi rediseño"],
      };
    }

    // 6. Tiempos / Plazos
    if (q.includes("tiempo") || q.includes("demora") || q.includes("plazo") || q.includes("cuanto tarda") || q.includes("cuánto tarda")) {
      return {
        text: `Nuestros tiempos de entrega son de máxima velocidad ejecutiva:\n\n• **Primera propuesta interactiva:** En 48 horas hábiles.\n• **Entrega final y publicación:** En 3 a 5 días hábiles.\n• **Instalación de embudo de leads:** Setup en 72 horas.\n\nTodo con revisiones y validación en vivo.`,
        actionUrl: `https://wa.me/${OFFICIAL_WHATSAPP}?text=${encodeURIComponent("Hola Alan, me interesa iniciar con la propuesta en 48 hs.")}`,
        actionLabel: `💬 Coordinar por WhatsApp (${FORMATTED_WHATSAPP})`,
        quickReplies: ["⚡ Comenzar mi rediseño", "📅 Agendar Llamada (15 min)"],
      };
    }

    // Default conversational reply
    return {
      text: `Entendido. Para darte la propuesta exacta orientada a tu negocio, podemos coordinar de inmediato por WhatsApp con Alan López o agendar una llamada de 15 min.\n\nNuestro WhatsApp oficial es **${FORMATTED_WHATSAPP}**.`,
      actionUrl: `https://wa.me/${OFFICIAL_WHATSAPP}?text=${encodeURIComponent(`Hola Alan, estuve consultando en la web sobre: "${userQuery}"`)}`,
      actionLabel: `💬 Continuar por WhatsApp (${FORMATTED_WHATSAPP})`,
      quickReplies: ["⚡ Rediseño Web ($490 USD)", "📅 Agendar Llamada (15 min)", "💬 Hablar por WhatsApp Directo"],
    };
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: query.trim(),
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Check if user clicked action to open redesign modal
    if (query.includes("Comenzar mi rediseño") || query.includes("⚡ Rediseño Web")) {
      setTimeout(() => {
        setIsTyping(false);
        const botReply = generateBotReply(query);
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: botReply.text,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          actionUrl: botReply.actionUrl,
          actionLabel: botReply.actionLabel,
          quickReplies: botReply.quickReplies,
        };
        setMessages((prev) => [...prev, botMsg]);
      }, 400);
      return;
    }

    setTimeout(() => {
      setIsTyping(false);
      const botReply = generateBotReply(query);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: botReply.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actionUrl: botReply.actionUrl,
        actionLabel: botReply.actionLabel,
        quickReplies: botReply.quickReplies,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 450);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* FLOATING TRIGGER BUTTON (Elevated on mobile to prevent overlapping with docks) */}
      <aside aria-label="Asistente con IA y WhatsApp Oficial">
        <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2.5">
          {/* Unread Message Pill / Tooltip on Desktop */}
          {!isOpen && (
            <button
              onClick={handleOpenChat}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-liquid-deep/95 border border-[#25D366]/40 text-platinum text-xs font-matter font-medium shadow-2xl backdrop-blur-md hover:border-[#25D366] transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]" />
              </span>
              <span>Asistente con IA • En línea</span>
            </button>
          )}

          {/* Main Floating Bubble */}
          <button
            type="button"
            onClick={isOpen ? handleCloseChat : handleOpenChat}
            aria-label={isOpen ? "Cerrar chat con Asistente" : "Abrir chat con Asistente con IA"}
            title="Asistente con IA | WhatsApp Directo +54 9 11 2788-7093"
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#128C7E] to-[#25D366] hover:brightness-110 transition-all flex items-center justify-center text-white shrink-0 shadow-2xl cursor-pointer hover:scale-105 active:scale-95 border-2 border-white/20 relative"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-7 h-7 text-white"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.2.3-.778.978-.954 1.179-.175.2-.351.226-.652.075s-1.272-.469-2.423-1.496c-.895-.798-1.5-1.784-1.676-2.085-.175-.3-.019-.463.132-.612.136-.135.301-.351.452-.527.15-.175.201-.3.301-.501.101-.2.05-.376-.025-.527s-.678-1.631-.929-2.234c-.244-.587-.492-.507-.678-.517l-.578-.01c-.2 0-.527.075-.803.376s-1.054 1.029-1.054 2.509 1.079 2.91 1.23 3.11c.15.201 2.122 3.24 5.141 4.542.718.31 1.279.495 1.716.634.721.229 1.377.197 1.896.12.578-.086 1.78-.728 2.031-1.431.251-.703.251-1.305.176-1.431-.076-.126-.277-.201-.578-.351zM12.004 0C5.378 0 .008 5.37.008 11.996c0 2.112.551 4.17 1.598 5.984L0 24l6.192-1.624c1.75 1.01 3.754 1.542 5.807 1.543 6.626 0 11.996-5.37 11.996-11.997 0-3.205-1.248-6.218-3.515-8.486C18.212 1.248 15.202 0 12.004 0zm0 21.968c-1.786 0-3.535-.48-5.059-1.388l-.363-.215-3.673.963.98-3.58-.236-.375c-.998-1.587-1.524-3.424-1.524-5.357 0-5.503 4.478-9.98 9.98-9.98 2.666 0 5.172 1.038 7.057 2.924 1.886 1.886 2.924 4.392 2.924 7.056-.002 5.503-4.48 9.98-9.985 9.98z" />
                </svg>
                {hasUnread && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-liquid-abyss animate-pulse" />
                )}
              </>
            )}
          </button>
        </div>
      </aside>

      {/* INTERACTIVE CHAT MODAL / DRAWER */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Chat interactivo con Asistente IA Alan López"
          className="fixed bottom-0 right-0 sm:bottom-24 sm:right-6 z-50 w-full sm:w-[410px] max-h-[85vh] sm:max-h-[620px] h-[85vh] sm:h-[580px] bg-liquid-abyss/98 sm:bg-liquid-abyss/95 border border-white/15 sm:rounded-2xl rounded-t-3xl shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header Bar */}
          <div className="p-4 bg-liquid-deep/90 border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full border border-[#25D366]/60 bg-abyssal-ink overflow-hidden p-1 shadow-inner shrink-0">
                <Image
                  src="/logo.png"
                  alt="Alan López SMD"
                  width={34}
                  height={34}
                  className="object-contain"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#25D366] border border-liquid-abyss" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-platinum truncate font-matter flex items-center gap-1.5">
                  Alan López SMD
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-bioluminescent-lime/15 text-bioluminescent-lime border border-bioluminescent-lime/30">
                    IA 24/7
                  </span>
                </span>
                <span className="text-[11px] text-[#25D366] truncate font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                  WhatsApp: {FORMATTED_WHATSAPP}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleCloseChat}
                className="p-1.5 text-silver-mist hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                title="Minimizar"
                aria-label="Minimizar chat"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleCloseChat}
                className="p-1.5 text-silver-mist hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                title="Cerrar"
                aria-label="Cerrar chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Banner Contact WhatsApp Info */}
          <div className="px-4 py-2 bg-gradient-to-r from-[#128C7E]/20 to-[#25D366]/10 border-b border-[#25D366]/20 flex items-center justify-between text-xs shrink-0">
            <span className="text-platinum text-[11px] font-matter">
              📱 WhatsApp Oficial: <strong className="text-[#25D366] font-mono">{FORMATTED_WHATSAPP}</strong>
            </span>
            <a
              href={`https://wa.me/${OFFICIAL_WHATSAPP}?text=Hola%20Alan%2C%20estoy%20en%20tu%20sitio%20web%20y%20quiero%20hacerte%20una%20consulta`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#25D366] hover:underline font-semibold flex items-center gap-1"
            >
              <span>Abrir app</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed font-matter">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-md ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-bioluminescent-lime/90 to-bioluminescent-lime text-liquid-abyss rounded-br-xs font-medium"
                      : "bg-liquid-deep/90 border border-white/10 text-platinum rounded-bl-xs"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Optional Action Button */}
                  {msg.actionUrl && (
                    <a
                      href={msg.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-liquid-abyss font-bold text-xs shadow transition-all cursor-pointer"
                    >
                      <span>{msg.actionLabel || "Continuar"}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <span className="text-[10px] text-silver-mist/70 mt-1 px-1 font-mono">
                  {msg.timestamp}
                </span>

                {/* Quick Reply Chips below bot message */}
                {msg.quickReplies && msg.quickReplies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[95%]">
                    {msg.quickReplies.map((qr, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSend(qr)}
                        className="px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-bioluminescent-lime/15 border border-white/10 hover:border-bioluminescent-lime/40 text-platinum text-[11px] font-medium transition-all cursor-pointer text-left"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-liquid-deep/70 border border-white/10 text-silver-mist max-w-[120px]">
                <span className="w-1.5 h-1.5 rounded-full bg-bioluminescent-lime animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-bioluminescent-lime animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-bioluminescent-lime animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] font-mono text-silver-mist ml-1">Escribiendo...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Sticky Bottom Quick Actions & WhatsApp Handover */}
          <div className="p-3 bg-liquid-deep/95 border-t border-white/10 space-y-2.5 shrink-0">
            {/* Input Bar */}
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu consulta o pide hablar con Alan..."
                className="flex-1 bg-liquid-abyss border border-white/15 focus:border-bioluminescent-lime rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-platinum placeholder:text-silver-mist/50 outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!inputValue.trim()}
                className="w-10 h-10 rounded-xl bg-bioluminescent-lime hover:bg-[#b0f53d] disabled:opacity-40 text-liquid-abyss flex items-center justify-center transition-all cursor-pointer shrink-0"
                aria-label="Enviar mensaje"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* 1-Tap Permanent Direct WhatsApp Handover */}
            <a
              href={`https://wa.me/${OFFICIAL_WHATSAPP}?text=${encodeURIComponent("Hola Alan, quiero contactarme directamente desde tu sitio web para avanzar con mi proyecto.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#128C7E] to-[#25D366] hover:brightness-105 text-white font-semibold text-xs tracking-wide shadow-md transition-all cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-white"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.2.3-.778.978-.954 1.179-.175.2-.351.226-.652.075s-1.272-.469-2.423-1.496c-.895-.798-1.5-1.784-1.676-2.085-.175-.3-.019-.463.132-.612.136-.135.301-.351.452-.527.15-.175.201-.3.301-.501.101-.2.05-.376-.025-.527s-.678-1.631-.929-2.234c-.244-.587-.492-.507-.678-.517l-.578-.01c-.2 0-.527.075-.803.376s-1.054 1.029-1.054 2.509 1.079 2.91 1.23 3.11c.15.201 2.122 3.24 5.141 4.542.718.31 1.279.495 1.716.634.721.229 1.377.197 1.896.12.578-.086 1.78-.728 2.031-1.431.251-.703.251-1.305.176-1.431-.076-.126-.277-.201-.578-.351zM12.004 0C5.378 0 .008 5.37.008 11.996c0 2.112.551 4.17 1.598 5.984L0 24l6.192-1.624c1.75 1.01 3.754 1.542 5.807 1.543 6.626 0 11.996-5.37 11.996-11.997 0-3.205-1.248-6.218-3.515-8.486C18.212 1.248 15.202 0 12.004 0zm0 21.968c-1.786 0-3.535-.48-5.059-1.388l-.363-.215-3.673.963.98-3.58-.236-.375c-.998-1.587-1.524-3.424-1.524-5.357 0-5.503 4.478-9.98 9.98-9.98 2.666 0 5.172 1.038 7.057 2.924 1.886 1.886 2.924 4.392 2.924 7.056-.002 5.503-4.48 9.98-9.985 9.98z" />
              </svg>
              <span>Continuar por WhatsApp ({FORMATTED_WHATSAPP})</span>
            </a>
          </div>
        </div>
      )}

      {/* Redesign Lead Modal fallback if user wants full proposal form */}
      <RedesignLeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
      />
    </>
  );
}
