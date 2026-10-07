/**
 * Agency Persona Chatbot - Asesor Ejecutivo Privado (Mateo)
 * Optimizado Mobile-First 10x:
 * - Cero saltos de pantalla (Zero layout shift) al abrir o minimizar.
 * - Pantalla 100% navegable en mobile en todo momento.
 * - Sin auto-apertura invasiva en pantallas móviles.
 * - Botón explícito de Minimizar y Cerrar.
 * - Posicionamiento ergonómico sobre la barra de conversión inferior.
 */

(function() {
  if (window.__AGENCY_PERSONA_BOT_INIT__) return;
  window.__AGENCY_PERSONA_BOT_INIT__ = true;

  const config = window.__AGENCY_BOT_CONFIG__ || {
    personaName: "Mateo",
    personaRole: "Director de Alianzas y Crecimiento",
    personaAvatar: "./assets/mateo_avatar.jpg",
    agencyName: "Servicio de Marketing Digital",
    niche: "Empresas de Alto Rendimiento y Servicios Premium",
    reservationUrl: "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=3724152558-04c4dcd1-4592-4c02-8ac1-504c13b09ead",
    whatsappPhone: "5491127887093"
  };

  // Inyectar estilos CSS de diseño premium mobile-first
  const style = document.createElement('style');
  style.id = "agency-persona-styles";
  style.textContent = `
    .persona-bot-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(2, 6, 23, 0.6);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      z-index: 9998;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease;
    }
    .persona-bot-backdrop.active {
      opacity: 1;
      pointer-events: auto;
    }

    .persona-bot-bubble {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9997;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      user-select: none;
      touch-action: manipulation;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .persona-bot-bubble:active {
      transform: scale(0.95);
    }

    .persona-avatar-frame {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      padding: 2.5px;
      background: linear-gradient(135deg, #10b981, #38bdf8, #f59e0b);
      box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35);
      position: relative;
    }
    .persona-avatar-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #020617;
      background-color: #0f172a;
    }
    .persona-pulse-dot {
      position: absolute;
      bottom: 1px;
      right: 1px;
      width: 14px;
      height: 14px;
      background-color: #10b981;
      border-radius: 50%;
      border: 2.5px solid #020617;
      box-shadow: 0 0 8px #10b981;
    }
    .persona-pill-msg {
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(52, 211, 153, 0.45);
      padding: 9px 16px;
      border-radius: 20px;
      color: #ffffff;
      font-size: 12.5px;
      font-weight: 700;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .persona-modal {
      position: fixed;
      bottom: 92px;
      right: 24px;
      width: 380px;
      max-width: calc(100vw - 32px);
      background: rgba(10, 15, 30, 0.98);
      backdrop-filter: blur(28px);
      -webkit-backdrop-filter: blur(28px);
      border: 1px solid rgba(51, 65, 85, 0.85);
      border-radius: 24px;
      box-shadow: 0 25px 60px -15px rgba(0,0,0,0.9), 0 0 30px rgba(16, 185, 129, 0.15);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform: translateY(20px) scale(0.96);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
    }
    .persona-modal.active {
      transform: translateY(0) scale(1);
      opacity: 1;
      pointer-events: auto;
    }

    .persona-header {
      padding: 14px 18px;
      background: rgba(2, 6, 23, 0.9);
      border-bottom: 1px solid rgba(51, 65, 85, 0.6);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .persona-header-actions {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .persona-ctrl-btn {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(71, 85, 105, 0.5);
      color: #94a3b8;
      border-radius: 8px;
      padding: 4px 9px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: all 0.2s ease;
      touch-action: manipulation;
    }
    .persona-ctrl-btn:hover, .persona-ctrl-btn:active {
      background: rgba(51, 65, 85, 1);
      color: #ffffff;
    }

    .persona-body {
      padding: 16px 18px;
      max-height: 420px;
      overflow-y: auto;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
      display: flex;
      flex-direction: column;
      gap: 12px;
      font-size: 13px;
      line-height: 1.5;
    }
    .persona-body::-webkit-scrollbar {
      width: 4px;
    }
    .persona-body::-webkit-scrollbar-thumb {
      background: rgba(51, 65, 85, 0.5);
      border-radius: 4px;
    }

    .bot-msg {
      background: rgba(30, 41, 59, 0.85);
      border: 1px solid rgba(71, 85, 105, 0.55);
      color: #f1f5f9;
      padding: 12px 16px;
      border-radius: 18px;
      border-top-left-radius: 4px;
    }
    .user-option-btn {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(52, 211, 153, 0.45);
      color: #34d399;
      padding: 12px 14px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 12.5px;
      text-align: left;
      cursor: pointer;
      min-height: 44px;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
      touch-action: manipulation;
    }
    .user-option-btn:hover, .user-option-btn:active {
      background: #10b981;
      color: #020617;
      transform: translateX(3px);
    }

    .reward-box {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.22), rgba(245, 158, 11, 0.18));
      border: 1.5px solid #10b981;
      padding: 14px;
      border-radius: 16px;
      text-align: center;
      color: #ffffff;
      font-weight: 800;
    }

    /* Reglas estrictas Mobile-First */
    @media (max-width: 640px) {
      .persona-bot-bubble {
        bottom: calc(76px + env(safe-area-inset-bottom));
        right: 14px;
      }
      .persona-pill-msg {
        display: none;
      }
      .persona-avatar-frame {
        width: 52px;
        height: 52px;
      }
      .persona-modal {
        bottom: 0;
        right: 0;
        left: 0;
        width: 100%;
        max-width: 100vw;
        border-radius: 24px 24px 0 0;
        border-bottom: none;
        max-height: 80vh;
        padding-bottom: max(16px, env(safe-area-inset-bottom));
        transform: translateY(105%);
      }
      .persona-modal.active {
        transform: translateY(0);
      }
      .persona-body {
        max-height: 52vh;
        font-size: 13.5px;
      }
      .user-option-btn {
        padding: 14px 16px;
        font-size: 13px;
        min-height: 48px;
      }
    }
  `;
  document.head.appendChild(style);

  // Canvas Confetti
  if (!window.confetti) {
    const confettiScript = document.createElement('script');
    confettiScript.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
    document.head.appendChild(confettiScript);
  }

  // Backdrop sutil para mobile
  const backdrop = document.createElement('div');
  backdrop.className = 'persona-bot-backdrop';
  document.body.appendChild(backdrop);

  // Burbuja flotante
  const bubble = document.createElement('div');
  bubble.className = 'persona-bot-bubble';
  bubble.setAttribute('role', 'button');
  bubble.setAttribute('aria-label', `Abrir chat con ${config.personaName}`);
  bubble.innerHTML = `
    <div class="persona-pill-msg">
      <span>✨</span> <strong>${config.personaName}</strong>: ¿Buscás más clientes?
    </div>
    <div class="persona-avatar-frame">
      <img src="${config.personaAvatar}" alt="${config.personaName}" class="persona-avatar-img">
      <div class="persona-pulse-dot"></div>
    </div>
  `;
  document.body.appendChild(bubble);

  // Modal / Drawer
  const modal = document.createElement('div');
  modal.className = 'persona-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <div class="persona-header">
      <div style="display:flex; align-items:center; gap:10px;">
        <div style="width:38px; height:38px; border-radius:50%; overflow:hidden; border:2px solid #10b981;">
          <img src="${config.personaAvatar}" style="width:100%; height:100%; object-fit:cover;">
        </div>
        <div>
          <div style="font-weight:900; font-size:13.5px; color:#fff;">${config.personaName}</div>
          <div style="font-size:11px; color:#34d399; font-weight:700; display:flex; align-items:center; gap:4px;">
            <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#10b981;"></span>
            ${config.personaRole}
          </div>
        </div>
      </div>
      <div class="persona-header-actions">
        <button id="minimizePersonaBtn" class="persona-ctrl-btn" title="Minimizar chat">
          <span>⎯</span>
          <span>Minimizar</span>
        </button>
        <button id="closePersonaModalBtn" class="persona-ctrl-btn" title="Cerrar chat">
          <span>✕</span>
        </button>
      </div>
    </div>
    <div class="persona-body" id="personaChatBody">
      <div class="bot-msg">
        ¡Hola! Soy <strong>${config.personaName}</strong>.<br><br>
        Ayudo a empresas de <strong>${config.niche}</strong> a incorporar <strong>500 compradores calificados</strong> en 90 días, garantizados por contrato escrito.<br><br>
        <strong>¿Qué meta de facturación adicional buscas alcanzar este trimestre?</strong>
      </div>
      <div style="display:flex; flex-direction:column; gap:8px;" id="personaStep1">
        <button class="user-option-btn" onclick="window.__selectStep1('Sumar de $15.000.000 a $35.000.000 ARS')">
          💼 Sumar de $15M a $35M ARS en ventas
        </button>
        <button class="user-option-btn" onclick="window.__selectStep1('Sumar de $35.000.000 a $80.000.000 ARS')">
          🚀 Sumar de $35M a $80M ARS en ventas
        </button>
        <button class="user-option-btn" onclick="window.__selectStep1('Escala mayor a $80.000.000 ARS')">
          👑 Más de $80M ARS (Expansión agresiva)
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  let isOpen = false;

  function openChat() {
    isOpen = true;
    modal.classList.add('active');
    if (window.innerWidth <= 640) {
      backdrop.classList.add('active');
    }
  }

  function closeChat() {
    isOpen = false;
    modal.classList.remove('active');
    backdrop.classList.remove('active');
  }

  bubble.onclick = (e) => {
    e.stopPropagation();
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  };

  document.getElementById('minimizePersonaBtn').onclick = (e) => {
    e.stopPropagation();
    closeChat();
  };

  document.getElementById('closePersonaModalBtn').onclick = (e) => {
    e.stopPropagation();
    closeChat();
  };

  backdrop.onclick = () => {
    closeChat();
  };

  // Revelación Progresiva - Paso 1 a Paso 2
  window.__selectStep1 = function(val) {
    const chat = document.getElementById('personaChatBody');
    const step1 = document.getElementById('personaStep1');
    if (step1) step1.style.display = 'none';
    
    const userMsg = document.createElement('div');
    userMsg.style.cssText = "align-self:flex-end; background:#10b981; color:#020617; font-weight:800; padding:9px 14px; border-radius:16px; border-top-right-radius:4px; font-size:12.5px;";
    userMsg.innerText = val;
    chat.appendChild(userMsg);

    setTimeout(() => {
      const botReply = document.createElement('div');
      botReply.className = 'bot-msg';
      botReply.innerHTML = `
        Excelente objetivo. Con una base de 500 compradores verificados, esa meta es 100% alcanzable.<br><br>
        <strong>¿Qué es lo que más frena tus ventas actualmente?</strong>
      `;
      chat.appendChild(botReply);

      const step2 = document.createElement('div');
      step2.id = "personaStep2";
      step2.style.cssText = "display:flex; flex-direction:column; gap:8px;";
      step2.innerHTML = `
        <button class="user-option-btn" onclick="window.__selectStep2('Perdemos tiempo con curiosos sin presupuesto')">
          ⏳ Perder tiempo con curiosos sin presupuesto
        </button>
        <button class="user-option-btn" onclick="window.__selectStep2('Falta de flujo constante y predecible')">
          📉 Falta de flujo predecible cada semana
        </button>
        <button class="user-option-btn" onclick="window.__selectStep2('Depender únicamente de referidos o boca a boca')">
          🔄 Depender únicamente de recomendaciones
        </button>
      `;
      chat.appendChild(step2);
      chat.scrollTop = chat.scrollHeight;
    }, 400);
  };

  // Revelación Progresiva - Paso 2 a Calificación
  window.__selectStep2 = function(val) {
    const chat = document.getElementById('personaChatBody');
    const step2 = document.getElementById('personaStep2');
    if (step2) step2.style.display = 'none';

    const userMsg = document.createElement('div');
    userMsg.style.cssText = "align-self:flex-end; background:#10b981; color:#020617; font-weight:800; padding:9px 14px; border-radius:16px; border-top-right-radius:4px; font-size:12.5px;";
    userMsg.innerText = val;
    chat.appendChild(userMsg);

    setTimeout(() => {
      if (window.confetti) {
        window.confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      const reward = document.createElement('div');
      reward.className = 'reward-box';
      reward.innerHTML = `
        <div style="font-size:20px; margin-bottom:2px;">🎉</div>
        <div style="font-size:14px; font-weight:900;">¡CALIFICACIÓN APROBADA!</div>
        <div style="font-size:11.5px; font-weight:600; opacity:0.95; margin-top:3px;">
          Tu empresa califica para el cupo garantizado de 500 compradores en 90 días.
        </div>
      `;
      chat.appendChild(reward);

      const botFinal = document.createElement('div');
      botFinal.className = 'bot-msg';
      botFinal.innerHTML = `
        <strong>Condiciones del Trato Garantizado:</strong><br>
        ✅ 500 Compradores corporativos verificados en 90 días.<br>
        ✅ <strong>Garantía Incondicional:</strong> Si en 90 días no llegamos a los 500, <u>seguimos trabajando gratis</u> hasta alcanzarlos o te reembolsamos el 100%.<br>
        ✅ Bloqueo de nicho y exclusividad en tu zona.<br><br>
        <a href="${config.reservationUrl}" target="_blank" onclick="if(typeof fbq==='function'){fbq('track','InitiateCheckout',{content_name:'Chatbot Mateo - Bloquear Cupo',value:350000,currency:'ARS'});}" style="display:block; background:linear-gradient(135deg, #10b981, #059669); color:#020617; font-weight:900; text-align:center; padding:12px; border-radius:12px; text-decoration:none; margin-bottom:8px; box-shadow:0 6px 18px rgba(16,185,129,0.35); font-size:12.5px; text-transform:uppercase;">
          💳 BLOQUEAR CUPO ($350.000 ARS) →
        </a>
        <button type="button" onclick="if(typeof window.openHumanAdvisorModal==='function'){window.openHumanAdvisorModal('Chatbot Mateo');}else{window.open('https://wa.me/' + config.whatsappPhone,'_blank');}" style="display:flex; align-items:center; justify-content:center; gap:6px; background:rgba(30,41,59,0.9); color:#34d399; border:1px solid rgba(52,211,153,0.5); font-weight:800; text-align:center; padding:10px; border-radius:12px; font-size:12px; width:100%; cursor:pointer;">
          👤 Contactarme con un asesor humano directamente →
        </button>
      `;
      chat.appendChild(botFinal);
      chat.scrollTop = chat.scrollHeight;
    }, 450);
  };

  // En desktop (> 768px), apertura sutil tras 6 segundos solo si el usuario no interactuó.
  // En mobile (pantallas pequeñas), NUNCA auto-abrir para no tapar la navegación.
  if (window.innerWidth > 768) {
    setTimeout(() => {
      if (!isOpen) {
        openChat();
      }
    }, 7000);
  }

})();
