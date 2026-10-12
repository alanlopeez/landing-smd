/**
 * SMD Universal AI Chatbot Widget
 * Integrado para las 3 Landings de Servicio de Marketing Digital (Alan López)
 * Características:
 * - Compatible con Vanilla JS, Next.js y páginas estáticas.
 * - Mobile-First 10x: Se eleva por encima del Sticky Mobile Dock (bottom: calc(76px + env(safe-area-inset-bottom))).
 * - Cero auto-zoom en iOS Safari (font-size >= 16px en inputs).
 * - Motor conversacional con IA y procesamiento en tiempo real (precios, garantías, Cal.com, WhatsApp, demo).
 * - Conexión directa y prominente a WhatsApp Oficial: +54 9 11 2788-7093.
 */

(function() {
  if (window.__SMD_AI_CHATBOT_LOADED__) return;
  window.__SMD_AI_CHATBOT_LOADED__ = true;

  const defaultConfig = {
    personaName: "Alan López SMD",
    personaRole: "Asistente con IA 24/7",
    personaAvatar: "/logo.png",
    whatsappPhone: "5491127887093",
    formattedPhone: "+54 9 11 2788-7093",
    context: "general", // "500_leads", "praga", "general"
    welcomeMessage: "¡Hola! 👋 Soy el Asistente con IA de **Alan López - Servicio de Marketing Digital**.\n\n¿En qué podemos ayudarte hoy para potenciar las ventas de tu negocio?",
    calComUrl: "https://cal.com/llamadas/online",
    quickReplies: [
      "⚡ Precios y Planes",
      "🛡️ ¿Cómo funciona la garantía?",
      "📅 Agendar Llamada (15 min)",
      "💬 Hablar por WhatsApp Directo"
    ]
  };

  const config = Object.assign({}, defaultConfig, window.__SMD_CHATBOT_CONFIG__ || {});

  // Inyectar estilos CSS
  const style = document.createElement("style");
  style.id = "smd-ai-chatbot-styles";
  style.textContent = `
    .smd-chatbot-bubble {
      position: fixed;
      bottom: 24px;
      right: 20px;
      z-index: 9998;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      user-select: none;
      touch-action: manipulation;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .smd-chatbot-bubble:hover {
      transform: scale(1.04);
    }
    .smd-chatbot-bubble:active {
      transform: scale(0.96);
    }

    .smd-bot-avatar-frame {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #128c7e, #25d366);
      box-shadow: 0 10px 25px rgba(37, 211, 102, 0.4), 0 0 15px rgba(18, 140, 126, 0.2);
      border: 2px solid rgba(255, 255, 255, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      color: #ffffff;
    }
    .smd-bot-avatar-img {
      width: 32px;
      height: 32px;
      object-fit: contain;
    }
    .smd-bot-pulse-dot {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 14px;
      height: 14px;
      background-color: #25d366;
      border-radius: 50%;
      border: 2.5px solid #020617;
      box-shadow: 0 0 8px #25d366;
    }
    .smd-bot-pill {
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(37, 211, 102, 0.5);
      padding: 8px 16px;
      border-radius: 999px;
      color: #f8fafc;
      font-size: 12px;
      font-weight: 600;
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Modal / Drawer */
    .smd-chatbot-modal {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 390px;
      max-width: calc(100vw - 32px);
      height: 580px;
      max-height: 85vh;
      background: rgba(8, 14, 26, 0.97);
      backdrop-filter: blur(28px);
      -webkit-backdrop-filter: blur(28px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 24px;
      box-shadow: 0 25px 60px -15px rgba(0,0,0,0.9), 0 0 35px rgba(37, 211, 102, 0.15);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform: translateY(20px) scale(0.96);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
    }
    .smd-chatbot-modal.active {
      transform: translateY(0) scale(1);
      opacity: 1;
      pointer-events: auto;
    }

    .smd-chatbot-header {
      padding: 14px 18px;
      background: rgba(2, 6, 23, 0.95);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      shrink: 0;
    }
    .smd-chatbot-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .smd-chatbot-actions {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .smd-ctrl-btn {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #94a3b8;
      border-radius: 8px;
      padding: 5px 8px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: all 0.2s;
    }
    .smd-ctrl-btn:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #ffffff;
    }

    .smd-wa-subbar {
      padding: 8px 16px;
      background: rgba(18, 140, 126, 0.2);
      border-bottom: 1px solid rgba(37, 211, 102, 0.25);
      font-size: 11.5px;
      color: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: space-between;
      shrink: 0;
    }
    .smd-wa-subbar a {
      color: #25d366;
      font-weight: 700;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .smd-wa-subbar a:hover {
      text-decoration: underline;
    }

    .smd-chat-body {
      padding: 16px;
      flex: 1;
      overflow-y: auto;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
      display: flex;
      flex-direction: column;
      gap: 12px;
      font-size: 13px;
      line-height: 1.5;
      color: #e2e8f0;
    }
    .smd-chat-body::-webkit-scrollbar {
      width: 5px;
    }
    .smd-chat-body::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.15);
      border-radius: 4px;
    }

    .smd-bot-msg {
      background: rgba(30, 41, 59, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #f8fafc;
      padding: 12px 14px;
      border-radius: 18px;
      border-top-left-radius: 4px;
      max-width: 88%;
      align-self: flex-start;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    .smd-user-msg {
      background: linear-gradient(135deg, #10b981, #059669);
      color: #ffffff;
      padding: 10px 14px;
      border-radius: 18px;
      border-top-right-radius: 4px;
      max-width: 85%;
      align-self: flex-end;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
    }

    .smd-quick-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 6px;
    }
    .smd-chip-btn {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #f1f5f9;
      font-size: 11.5px;
      padding: 6px 11px;
      border-radius: 999px;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
    }
    .smd-chip-btn:hover {
      background: rgba(37, 211, 102, 0.18);
      border-color: #25d366;
      color: #ffffff;
      transform: translateY(-1px);
    }

    .smd-msg-action-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 8px;
      padding: 8px 14px;
      border-radius: 10px;
      background: #25d366;
      color: #020617;
      font-weight: 700;
      font-size: 12px;
      text-decoration: none;
      box-shadow: 0 4px 10px rgba(37, 211, 102, 0.3);
      transition: all 0.2s;
    }
    .smd-msg-action-btn:hover {
      background: #20ba59;
      transform: translateY(-1px);
    }

    .smd-chat-footer {
      padding: 12px 14px;
      background: rgba(2, 6, 23, 0.95);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      gap: 10px;
      shrink: 0;
    }
    .smd-input-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .smd-chat-input {
      flex: 1;
      height: 42px;
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 12px;
      padding: 0 14px;
      color: #ffffff;
      font-size: 16px; /* Evita zoom automático en iPhone */
      outline: none;
      transition: border-color 0.2s;
    }
    @media (min-width: 640px) {
      .smd-chat-input {
        font-size: 13px;
      }
    }
    .smd-chat-input:focus {
      border-color: #25d366;
    }
    .smd-send-btn {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: #25d366;
      color: #020617;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-weight: 800;
      transition: all 0.2s;
      shrink: 0;
    }
    .smd-send-btn:hover {
      background: #20ba59;
      transform: scale(1.05);
    }

    .smd-wa-dock-btn {
      width: 100%;
      height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, #128c7e, #25d366);
      color: #ffffff;
      font-size: 12.5px;
      font-weight: 700;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35);
      transition: all 0.2s;
    }
    .smd-wa-dock-btn:hover {
      filter: brightness(1.1);
    }

    /* Reglas estrictas Mobile-First */
    @media (max-width: 640px) {
      .smd-chatbot-bubble {
        bottom: calc(76px + env(safe-area-inset-bottom, 0px));
        right: 14px;
      }
      .smd-bot-pill {
        display: none;
      }
      .smd-bot-avatar-frame {
        width: 52px;
        height: 52px;
      }
      .smd-chatbot-modal {
        bottom: 0;
        right: 0;
        left: 0;
        width: 100%;
        max-width: 100vw;
        border-radius: 24px 24px 0 0;
        border-bottom: none;
        max-height: 85vh;
        padding-bottom: max(12px, env(safe-area-inset-bottom, 0px));
        transform: translateY(105%);
      }
      .smd-chatbot-modal.active {
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);

  // Crear Backdrop
  const backdrop = document.createElement("div");
  backdrop.id = "smd-chatbot-backdrop";
  backdrop.style.cssText = "position:fixed;inset:0;background:rgba(2,6,23,0.6);backdrop-filter:blur(4px);z-index:9997;opacity:0;pointer-events:none;transition:opacity 0.25s;";
  document.body.appendChild(backdrop);

  // Crear Burbuja Flotante
  const bubble = document.createElement("div");
  bubble.className = "smd-chatbot-bubble";
  bubble.setAttribute("role", "button");
  bubble.setAttribute("aria-label", `Abrir chat con ${config.personaName}`);
  bubble.innerHTML = `
    <div class="smd-bot-pill">
      <span>✨</span> <strong>${config.personaName}</strong>: ¿Tenés una consulta?
    </div>
    <div class="smd-bot-avatar-frame">
      <svg viewBox="0 0 24 24" fill="currentColor" style="width:28px;height:28px;">
        <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.2.3-.778.978-.954 1.179-.175.2-.351.226-.652.075s-1.272-.469-2.423-1.496c-.895-.798-1.5-1.784-1.676-2.085-.175-.3-.019-.463.132-.612.136-.135.301-.351.452-.527.15-.175.201-.3.301-.501.101-.2.05-.376-.025-.527s-.678-1.631-.929-2.234c-.244-.587-.492-.507-.678-.517l-.578-.01c-.2 0-.527.075-.803.376s-1.054 1.029-1.054 2.509 1.079 2.91 1.23 3.11c.15.201 2.122 3.24 5.141 4.542.718.31 1.279.495 1.716.634.721.229 1.377.197 1.896.12.578-.086 1.78-.728 2.031-1.431.251-.703.251-1.305.176-1.431-.076-.126-.277-.201-.578-.351zM12.004 0C5.378 0 .008 5.37.008 11.996c0 2.112.551 4.17 1.598 5.984L0 24l6.192-1.624c1.75 1.01 3.754 1.542 5.807 1.543 6.626 0 11.996-5.37 11.996-11.997 0-3.205-1.248-6.218-3.515-8.486C18.212 1.248 15.202 0 12.004 0zm0 21.968c-1.786 0-3.535-.48-5.059-1.388l-.363-.215-3.673.963.98-3.58-.236-.375c-.998-1.587-1.524-3.424-1.524-5.357 0-5.503 4.478-9.98 9.98-9.98 2.666 0 5.172 1.038 7.057 2.924 1.886 1.886 2.924 4.392 2.924 7.056-.002 5.503-4.48 9.98-9.985 9.98z" />
      </svg>
      <div class="smd-bot-pulse-dot"></div>
    </div>
  `;
  document.body.appendChild(bubble);

  // Crear Modal Dialog
  const modal = document.createElement("div");
  modal.className = "smd-chatbot-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-label", "Asistente con IA Alan López");
  modal.innerHTML = `
    <div class="smd-chatbot-header">
      <div class="smd-chatbot-info">
        <div style="width:38px;height:38px;border-radius:50%;background:#0f172a;border:2px solid #25d366;display:flex;align-items:center;justify-content:center;overflow:hidden;">
          <img src="${config.personaAvatar}" alt="Logo" style="width:24px;height:24px;object-fit:contain;" onerror="this.src='/logo.png'">
        </div>
        <div>
          <div style="font-weight:800;font-size:13.5px;color:#fff;">${config.personaName}</div>
          <div style="font-size:11px;color:#25d366;font-weight:600;display:flex;align-items:center;gap:4px;">
            <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#25d366;"></span>
            ${config.personaRole}
          </div>
        </div>
      </div>
      <div class="smd-chatbot-actions">
        <button id="smdMinChatBtn" class="smd-ctrl-btn" title="Minimizar">⎯</button>
        <button id="smdCloseChatBtn" class="smd-ctrl-btn" title="Cerrar">✕</button>
      </div>
    </div>

    <div class="smd-wa-subbar">
      <span>📱 WhatsApp Directo: <strong>${config.formattedPhone}</strong></span>
      <a href="https://wa.me/${config.whatsappPhone}?text=Hola%20Alan%2C%20quiero%20hacerte%20una%20consulta%20directa" target="_blank" rel="noopener">
        <span>Abrir WhatsApp</span> ↗
      </a>
    </div>

    <div class="smd-chat-body" id="smdChatMessages"></div>

    <div class="smd-chat-footer">
      <div class="smd-input-row">
        <input type="text" id="smdChatInput" class="smd-chat-input" placeholder="Escribí tu duda o consulta..." />
        <button type="button" id="smdSendBtn" class="smd-send-btn" aria-label="Enviar">➔</button>
      </div>
      <a id="smdWaStickyBtn" href="https://wa.me/${config.whatsappPhone}?text=Hola%20Alan%2C%20estuve%20viendo%20tu%20sitio%20web%20y%20quiero%20avanzar" target="_blank" rel="noopener" class="smd-wa-dock-btn">
        <span>Continuar por WhatsApp (${config.formattedPhone})</span>
      </a>
    </div>
  `;
  document.body.appendChild(modal);

  const messagesContainer = document.getElementById("smdChatMessages");
  const inputEl = document.getElementById("smdChatInput");
  const sendBtn = document.getElementById("smdSendBtn");
  const minBtn = document.getElementById("smdMinChatBtn");
  const closeBtn = document.getElementById("smdCloseChatBtn");
  const waStickyBtn = document.getElementById("smdWaStickyBtn");

  function openChat() {
    modal.classList.add("active");
    if (window.innerWidth <= 640) {
      backdrop.style.opacity = "1";
      backdrop.style.pointerEvents = "auto";
    }
    inputEl.focus();
  }

  function closeChat() {
    modal.classList.remove("active");
    backdrop.style.opacity = "0";
    backdrop.style.pointerEvents = "none";
  }

  bubble.addEventListener("click", () => {
    if (modal.classList.contains("active")) {
      closeChat();
    } else {
      openChat();
    }
  });

  minBtn.addEventListener("click", closeChat);
  closeBtn.addEventListener("click", closeChat);
  backdrop.addEventListener("click", closeChat);

  // Motor de Respuestas de IA
  function getBotResponse(userQuery) {
    const q = userQuery.toLowerCase().trim();

    if (
      q.includes("pagar") ||
      q.includes("pago") ||
      q.includes("transfer") ||
      q.includes("tarjeta") ||
      q.includes("alias") ||
      q.includes("cbu") ||
      q.includes("cvu") ||
      q.includes("link") ||
      q.includes("mercadopago") ||
      q.includes("paypal") ||
      q.includes("dolar") ||
      q.includes("dólar") ||
      q.includes("peso") ||
      q.includes("forma de pago") ||
      q.includes("como pago") ||
      q.includes("cómo pago")
    ) {
      return {
        text: `Operamos **exclusivamente mediante Transferencia Bancaria Directa** (no aceptamos tarjeta de credito) con un **10% de DESCUENTO DIRECTO BONIFICADO**:\n\n*Datos Oficiales de Acreditacion Inmediata (Mercado Pago):*\n- **Entidad:** Mercado Pago\n- **Titular:** Alan Ezequiel Lopez\n- **CUIT / CUIL:** 20-39210016-5\n- **Alias Oficial:** \`marketingdigital.arg\`\n- **CVU:** \`0000003100054772699472\`\n\n*Valores Bonificados con 10% OFF:*\n- **Seña 500 Leads:** **$315.000 ARS** (en vez de $350.000)\n- **Seña Web Praga:** **$234.000 ARS** (en vez de $260.000)\n\n*Nota: No recibimos tarjeta de credito para evitar sobrecargos y garantizar facturacion directa.*\n\n*Exterior (USD):* Transferencia Wire o Crypto USDT con Factura E oficial.\n\nDetalles completos en: https://www.serviciodemarketingdigital.com/pagar`,
        actionUrl: `https://wa.me/${config.whatsappPhone}?text=${encodeURIComponent("Hola Alan, quiero transferir la sena al alias marketingdigital.arg con el 10% de descuento bonificado:")}`,
        actionLabel: `Enviar Comprobante (${config.formattedPhone})`,
        chips: ["Transferir con 10% OFF (Alias)", "Pagar en Dolares (USD)", "Solicitar Factura A/B", "Hablar por WhatsApp"]
      };

    if (q.includes("precio") || q.includes("cuanto") || q.includes("cuánto") || q.includes("costo") || q.includes("tarifa") || q.includes("plan") || q.includes("350") || q.includes("260")) {
      if (config.context === "500_leads") {
        return {
          text: `El plan **500 Leads en 90 Días** incluye instalación express en 72 hs y garantía legal por contrato:\n\n• **Inversión Total:** $3.500.000 ARS (o USD equivalente).\n• **Modalidad Seña:** Reservá con $350.000 ARS y el saldo al finalizar los 90 días o entrega.\n\n¿Deseas bloquear cupo o consultar por WhatsApp?`,
          actionUrl: "https://www.serviciodemarketingdigital.com/pagar",
          actionLabel: "Reservar con 10% OFF ($315.000 ARS)",
          chips: ["🛡️ ¿Cómo funciona la garantía?", "📅 Agendar Llamada (15 min)", "💬 Chatear por WhatsApp"]
        };
      } else if (config.context === "praga") {
        return {
          text: `La propuesta para **Calzados Praga** contempla dos opciones:\n\n1. **Plan 50/50 Cero Riesgo:** Seña de $260.000 ARS para iniciar. Saldo de $260.000 ARS recién al aprobar la web lista.\n2. **Contado Bonificado:** $420.000 ARS pago único (ahorro directo de $100.000 ARS).\n\n¿Querés coordinar directamente por WhatsApp?`,
          actionUrl: "https://wa.me/" + config.whatsappPhone + "?text=" + encodeURIComponent("Hola Alan, soy Alberto de Calzados Praga. Quiero coordinar el plan de rediseño."),
          actionLabel: "💬 Hablar por WhatsApp Directo",
          chips: ["📦 ¿Qué incluye el armado?", "⚡ Plazos de entrega", "💳 Abonar Seña 50% ($260k)"]
        };
      } else {
        return {
          text: `Nuestras tarifas transparentes:\n\n1. ⚡ **Rediseño Web Interactivo:** $490 USD (primera versión en 48 hs hábiles).\n2. 🛡️ **500 Leads Garantizados:** $3.500.000 ARS garantizados por contrato.\n3. 🎬 **Estrategia Audiovisual & Redes:** Video repurposing multicanal.\n\n¿Te gustaría coordinar una llamada de 15 min o hablar por WhatsApp?`,
          actionUrl: "https://cal.com/llamadas/online",
          actionLabel: "📅 Agendar videollamada de 15 min",
          chips: ["🛡️ ¿Cómo funciona la garantía?", "⚡ Rediseño Web ($490 USD)", "💬 Hablar por WhatsApp"]
        };
      }
    }

    if (q.includes("garant") || q.includes("devolu") || q.includes("riesgo") || q.includes("contrato")) {
      return {
        text: `La garantía está blindada por escrito:\n\n• **Contrato formal:** Si en 90 días no entregamos los 500 leads calificados en tu CRM, seguimos operando sin costo hasta cumplirlos o te devolvemos el dinero.\n• **Facturación Oficial:** Se emite Factura E (exportación) o Factura C únicamente.\n\nPodés consultar los detalles directamente con Alan López.`,
        actionUrl: `https://wa.me/${config.whatsappPhone}?text=${encodeURIComponent("Hola Alan, quiero consultar sobre la garantía escrita por contrato.")}`,
        actionLabel: `💬 Consultar al WhatsApp (${config.formattedPhone})`,
        chips: ["⚡ Precios y Planes", "📅 Agendar Llamada"]
      };
    }

    if (q.includes("agendar") || q.includes("llamada") || q.includes("reunion") || q.includes("reunión") || q.includes("cal") || q.includes("zoom")) {
      return {
        text: `Podés agendar una videollamada ejecutiva de 15 minutos en el calendario oficial:\n\n📅 **Enlace Cal.com:** [${config.calComUrl}](${config.calComUrl})\n\nO si preferís una respuesta inmediata en el acto, escribinos al WhatsApp **${config.formattedPhone}**.`,
        actionUrl: config.calComUrl,
        actionLabel: "📅 Abrir Calendario Cal.com (15 min)",
        chips: ["💬 Escribir al WhatsApp (+54 9 11 2788-7093)", "⚡ Precios y Planes"]
      };
    }

    if (q.includes("whatsapp") || q.includes("contacto") || q.includes("telefono") || q.includes("teléfono") || q.includes("celular") || q.includes("hablar") || q.includes("alan")) {
      return {
        text: `Nuestro WhatsApp oficial directo y disponible 24/7 es:\n\n📱 **${config.formattedPhone}**\n\nAtención comercial y técnica directa con Alan López para responder dudas al instante.`,
        actionUrl: `https://wa.me/${config.whatsappPhone}?text=${encodeURIComponent("Hola Alan, estuve consultando en tu web y quiero hablar directamente.")}`,
        actionLabel: `💬 Chatear por WhatsApp (${config.formattedPhone})`,
        chips: ["📅 Agendar Llamada (15 min)", "⚡ Precios y Planes"]
      };
    }

    if (q.includes("tiempo") || q.includes("demora") || q.includes("plazo") || q.includes("entrega")) {
      return {
        text: `Tiempos de entrega ágiles:\n\n• **Instalación de embudo:** Setup llave en mano en 72 horas.\n• **Primera versión interactiva web:** 48 horas hábiles.\n• **Entrega y publicación final:** 3 a 5 días hábiles.\n\nTodo validado con revisiones en vivo.`,
        actionUrl: `https://wa.me/${config.whatsappPhone}?text=${encodeURIComponent("Hola Alan, quiero comenzar con los plazos de entrega.")}`,
        actionLabel: `💬 Coordinar por WhatsApp (${config.formattedPhone})`,
        chips: ["⚡ Precios y Planes", "📅 Agendar Llamada (15 min)"]
      };
    }

    // Default response
    return {
      text: `Excelente. Para revisar tu rubro y brindarte la propuesta adecuada, podés coordinar directamente por WhatsApp con Alan López al **${config.formattedPhone}** o agendar una llamada de 15 minutos.`,
      actionUrl: `https://wa.me/${config.whatsappPhone}?text=${encodeURIComponent("Hola Alan, estuve en tu web consultando por: " + userQuery)}`,
      actionLabel: `💬 Continuar por WhatsApp (${config.formattedPhone})`,
      chips: ["⚡ Precios y Planes", "🛡️ ¿Cómo funciona la garantía?", "📅 Agendar Llamada (15 min)"]
    };
  }

  function appendBotMessage(data) {
    const div = document.createElement("div");
    div.className = "smd-bot-msg";
    
    // Parse formatting (bold, newlines, links)
    let formattedText = data.text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");

    div.innerHTML = `<div>${formattedText}</div>`;

    if (data.actionUrl) {
      const btn = document.createElement("a");
      btn.className = "smd-msg-action-btn";
      btn.href = data.actionUrl;
      btn.target = "_blank";
      btn.rel = "noopener";
      btn.innerHTML = `<span>${data.actionLabel || "Continuar"}</span> ↗`;
      div.appendChild(btn);
    }

    if (data.chips && data.chips.length > 0) {
      const chipsContainer = document.createElement("div");
      chipsContainer.className = "smd-quick-chips";
      data.chips.forEach(chipText => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "smd-chip-btn";
        chip.textContent = chipText;
        chip.addEventListener("click", () => handleUserInput(chipText));
        chipsContainer.appendChild(chip);
      });
      div.appendChild(chipsContainer);
    }

    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function appendUserMessage(text) {
    const div = document.createElement("div");
    div.className = "smd-user-msg";
    div.textContent = text;
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function handleUserInput(query) {
    if (!query || !query.trim()) return;
    appendUserMessage(query.trim());
    inputEl.value = "";

    // Actualizar botón inferior sticky de WhatsApp con el texto consultado
    waStickyBtn.href = `https://wa.me/${config.whatsappPhone}?text=${encodeURIComponent("Hola Alan, estuve en tu web consultando: " + query.trim())}`;

    // Simular escritura de IA (300ms)
    setTimeout(() => {
      const resp = getBotResponse(query);
      appendBotMessage(resp);
    }, 350);
  }

  sendBtn.addEventListener("click", () => {
    handleUserInput(inputEl.value);
  });

  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleUserInput(inputEl.value);
    }
  });

  // Mensaje de bienvenida inicial
  appendBotMessage({
    text: config.welcomeMessage,
    chips: config.quickReplies
  });

})();
