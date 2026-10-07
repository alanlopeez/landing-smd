/**
 * Agente de Rescate Comercial - Servicio de Marketing Digital
 * Misión: Detectar intención de salida, inactividad o indecisión y rescatar al prospecto
 * garantizando que nadie se retire del embudo sin señar ($350.000 ARS) o cerrar por WhatsApp.
 */

(function () {
  if (window.__COMMERCIAL_RESCUE_AGENT_INIT__) return;
  window.__COMMERCIAL_RESCUE_AGENT_INIT__ = true;

  // Parámetros y enlaces globales
  const RESERVATION_URL = "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=3724152558-04c4dcd1-4592-4c02-8ac1-504c13b09ead";
  const WHATSAPP_PHONE = "5491127887093";
  const RESCUE_COOLDOWN_KEY = "commercial_rescue_shown";

  // Obtener contexto de la página actual
  const currentPath = window.location.pathname;
  let nicheName = "tu sector";
  if (window.__AGENCY_BOT_CONFIG__ && window.__AGENCY_BOT_CONFIG__.niche) {
    nicheName = window.__AGENCY_BOT_CONFIG__.niche;
  } else {
    const h1 = document.querySelector('h1');
    if (h1 && h1.innerText) {
      nicheName = h1.innerText.split('\n')[0].replace(':', '').trim();
    }
  }

  // Inyectar Estilos CSS de Alta Gama (Vengeance & Skiper UI)
  const style = document.createElement('style');
  style.id = "commercial-rescue-styles";
  style.textContent = `
    .rescue-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(2, 6, 23, 0.88);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      z-index: 100000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 16px;
      opacity: 0;
      transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .rescue-backdrop.active {
      display: flex;
      opacity: 1;
    }
    .rescue-modal {
      width: 100%;
      max-width: 480px;
      max-height: min(88vh, 620px);
      overflow-y: auto;
      overscroll-behavior: contain;
      scrollbar-width: none;
      -ms-overflow-style: none;
      -webkit-overflow-scrolling: touch;
      background: linear-gradient(145deg, #0b1329 0%, #020617 100%);
      border: 1.5px solid #10b981;
      border-radius: 24px;
      padding: 22px 24px;
      box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.35), 0 0 35px rgba(16, 185, 129, 0.2);
      position: relative;
      transform: scale(0.94);
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      color: #f8fafc;
      text-align: left;
    }
    .rescue-modal::-webkit-scrollbar {
      display: none;
    }
    .rescue-backdrop.active .rescue-modal {
      transform: scale(1);
    }
    .rescue-ambient-glow {
      position: absolute;
      top: -120px;
      right: -120px;
      width: 280px;
      height: 280px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }
    .rescue-badge-urgency {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 9999px;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #fca5a5;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 16px;
    }
    .rescue-badge-urgency .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ef4444;
      animation: rescuePulse 1.2s infinite;
    }
    @keyframes rescuePulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.4); opacity: 0.5; }
    }
    .rescue-close-btn {
      position: absolute;
      top: 18px;
      right: 18px;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(71, 85, 105, 0.5);
      color: #94a3b8;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .rescue-close-btn:hover {
      background: #ef4444;
      color: #ffffff;
      border-color: #ef4444;
    }
    .rescue-timer-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(51, 65, 85, 0.6);
      border-radius: 14px;
      padding: 10px 16px;
      margin: 18px 0;
      font-size: 12px;
    }
    .rescue-timer-clock {
      font-family: monospace;
      font-size: 16px;
      font-weight: 900;
      color: #34d399;
      background: rgba(16, 185, 129, 0.15);
      padding: 4px 10px;
      border-radius: 8px;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .rescue-btn-main {
      display: block;
      width: 100%;
      padding: 16px 20px;
      border-radius: 16px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #020617;
      font-weight: 900;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-align: center;
      text-decoration: none;
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.45);
      transition: all 0.25s ease;
      cursor: pointer;
      margin-top: 14px;
      border: none;
    }
    .rescue-btn-main:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 30px rgba(16, 185, 129, 0.6);
      background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
    }
    .rescue-btn-wa {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 12px 18px;
      border-radius: 14px;
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(56, 189, 248, 0.5);
      color: #38bdf8;
      font-weight: 800;
      font-size: 12.5px;
      text-align: center;
      text-decoration: none;
      margin-top: 10px;
      transition: all 0.2s ease;
    }
    .rescue-btn-wa:hover {
      background: rgba(56, 189, 248, 0.15);
      border-color: #38bdf8;
      color: #ffffff;
    }
    .rescue-pill-benefit {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 12px;
      color: #cbd5e1;
      margin-bottom: 8px;
      line-height: 1.45;
    }
    .rescue-pill-benefit strong {
      color: #ffffff;
    }
    .rescue-pill-benefit .icon-check {
      color: #10b981;
      font-weight: 900;
      font-size: 13px;
      margin-top: 1px;
    }
    @media (max-width: 640px) {
      .rescue-backdrop {
        padding: 0;
        align-items: flex-end;
      }
      .rescue-modal {
        max-width: 100%;
        border-radius: 28px 28px 0 0;
        border-bottom: none;
        padding: 24px 20px max(24px, env(safe-area-inset-bottom)) 20px;
        max-height: 88vh;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        transform: translateY(100%);
      }
      .rescue-backdrop.active .rescue-modal {
        transform: translateY(0);
      }
      .rescue-close-btn {
        top: 14px;
        right: 14px;
        width: 38px;
        height: 38px;
        font-size: 18px;
      }
      .rescue-btn-main {
        padding: 16px 18px;
        font-size: 13.5px;
        min-height: 50px;
      }
      .rescue-btn-wa {
        padding: 14px 18px;
        font-size: 13px;
        min-height: 48px;
      }
    }
  `;
  document.head.appendChild(style);

  // Crear Estructura DOM del Modal de Rescate
  const backdrop = document.createElement('div');
  backdrop.id = "commercialRescueBackdrop";
  backdrop.className = "rescue-backdrop";
  backdrop.innerHTML = `
    <div class="rescue-modal" role="dialog" aria-modal="true" aria-labelledby="rescueTitle">
      <div class="rescue-ambient-glow"></div>
      <button class="rescue-close-btn" id="closeRescueBtn" aria-label="Cerrar ventana de rescate">✕</button>

      <div class="rescue-badge-urgency">
        <span class="pulse-dot"></span>
        Alerta de Exclusividad Territorial
      </div>

      <div style="display:flex; align-items:center; gap:14px; margin-bottom:14px;">
        <div style="width:52px; height:52px; border-radius:18px; background:linear-gradient(135deg, #10b981, #06b6d4); display:flex; align-items:center; justify-content:center; font-size:26px; box-shadow:0 8px 20px rgba(16,185,129,0.35); shrink:0;">
          🛡️
        </div>
        <div>
          <h2 id="rescueTitle" style="font-size:20px; font-weight:900; color:#ffffff; line-height:1.2; margin:0;">
            ¡Espera! No te vayas sin bloquear tu zona
          </h2>
          <span style="font-size:12px; color:#94a3b8; font-weight:600;">
            Hay empresas en <strong style="color:#34d399;">${nicheName}</strong> consultando este mismo cupo
          </span>
        </div>
      </div>

      <p style="font-size:13px; color:#e2e8f0; line-height:1.55; margin:0 0 14px 0;">
        Si cierras esta pestaña, el sistema libera la <strong>exclusividad territorial de tu rubro</strong> para que ingrese tu competencia directa. Asegura tu lugar con <strong>Riesgo Cero</strong>:
      </p>

      <div style="background:rgba(2,6,23,0.7); border:1px solid rgba(51,65,85,0.7); border-radius:16px; padding:14px 16px; margin-bottom:14px;">
        <div class="rescue-pill-benefit">
          <span class="icon-check">✓</span>
          <div>
            <strong>Garantía Incondicional de 3 Meses:</strong> Si en 90 días no conseguimos los 500 leads, <span style="color:#34d399; font-weight:700;">seguimos trabajando 100% GRATIS</span> hasta alcanzarlos o te reintegramos el dinero.
          </div>
        </div>
        <div class="rescue-pill-benefit">
          <span class="icon-check">✓</span>
          <div>
            <strong>Bono de Rescate Exclusivo:</strong> Activación Express prioritaria en 24hs (en vez de 72hs) + auditoría personalizada de cierre comercial.
          </div>
        </div>
        <div class="rescue-pill-benefit">
          <span class="icon-check">✓</span>
          <div>
            <strong>Seña de Reserva Protegida ($350.000 ARS):</strong> Congela el cupo hoy; el saldo restante se abona contra entrega de prospectos calificados en tu CRM.
          </div>
        </div>
      </div>

      <div class="rescue-timer-bar">
        <span style="color:#94a3b8; font-weight:600;">Tu cupo de rescate se reserva por:</span>
        <div class="rescue-timer-clock" id="rescueCountdown">04:59</div>
      </div>

      <a href="${RESERVATION_URL}" target="_blank" onclick="if(typeof fbq==='function'){fbq('track','InitiateCheckout',{content_name:'Rescue Modal - Señar Ahora',value:350000,currency:'ARS'});}" class="rescue-btn-main" id="btnRescueSeñar">
        🚀 SEÑAR AHORA Y BLOQUEAR MI ZONA ($350.000 ARS) →
      </a>

      <button type="button" onclick="document.getElementById('commercialRescueModal').classList.remove('active'); if(typeof window.openHumanAdvisorModal==='function') window.openHumanAdvisorModal('Modal de Rescate');" class="rescue-btn-wa" id="btnRescueWa" style="cursor:pointer; width:100%; border:none; outline:none; text-decoration:none;">
        <span>👤</span> Contactarme con un asesor humano directamente →
      </button>

      <div style="text-align:center; margin-top:10px; font-size:10.5px; color:#64748b;">
        🔒 Respaldado por contrato legal mutuo • Checkout oficial Mercado Pago SSL 256-Bit
      </div>
    </div>
  `;
  document.body.appendChild(backdrop);

  // Manejador del Contador Regresivo
  let timeLeft = 299; // 4:59
  let timerInterval = null;

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    const clockEl = document.getElementById("rescueCountdown");
    timerInterval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        if (clockEl) clockEl.innerText = "00:00";
        return;
      }
      timeLeft--;
      const mins = Math.floor(timeLeft / 60);
      const secs = timeLeft % 60;
      if (clockEl) {
        clockEl.innerText = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
      }
    }, 1000);
  }

  // Notificar al servidor / Supabase de la intercepción de rescate
  function logRescueTelemetry() {
    try {
      fetch("/api/comando", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "COMMERCIAL_RESCUE_INTERCEPTED",
          instruction: `Prospecto interceptado por el Agente de Rescate Comercial en ${window.location.pathname} (${nicheName}). Intención: Asegurar seña de $350k.`,
          message: `Rescate activado en ${window.location.href}`
        })
      }).catch(() => {});
    } catch (e) {}
  }

  // Función para abrir el modal de rescate
  function triggerRescueAgent(reason) {
    if (sessionStorage.getItem(RESCUE_COOLDOWN_KEY)) return;
    sessionStorage.setItem(RESCUE_COOLDOWN_KEY, "true");

    backdrop.classList.add("active");
    startTimer();
    logRescueTelemetry();

    // Disparar celebración o sonido sutil si está disponible
    if (window.confetti) {
      window.confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 }
      });
    }

    console.log(`[Agente de Rescate Comercial] Activado por motivo: ${reason}`);
  }

  // Cerrar Modal
  document.getElementById("closeRescueBtn").onclick = () => {
    backdrop.classList.remove("active");
  };

  backdrop.onclick = (e) => {
    if (e.target === backdrop) {
      backdrop.classList.remove("active");
    }
  };

  // DETECTOR 1: Exit-Intent en Desktop (mouse saliendo hacia la barra superior tras al menos 15 segundos)
  const pageStartTime = Date.now();
  let lastY = 0;
  document.addEventListener("mousemove", (e) => {
    lastY = e.clientY;
  });

  document.addEventListener("mouseleave", (e) => {
    if (Date.now() - pageStartTime > 15000 && e.clientY <= 5) {
      triggerRescueAgent("exit_intent_mouse_leave_top");
    }
  });

  // DETECTOR 2: Inactividad / Indecisión (90 segundos en la página tras lectura profunda)
  setTimeout(() => {
    triggerRescueAgent("inactivity_timeout_90s");
  }, 90000);

  // DETECTOR 3: Scroll rápido hacia arriba tras recorrer más del 40% de la página (Solo Desktop para no molestar en móviles)
  let maxScroll = 0;
  let scrollThresholdTriggered = false;
  window.addEventListener("scroll", () => {
    if (window.innerWidth <= 768) return; // En móviles no activar por scroll para permitir libre navegación
    const scrollPos = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollPos / docHeight) * 100;

    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
    }

    // Si recorrió más del 45% y ahora retrocede rápidamente al tope superior (< 10%)
    if (maxScroll > 45 && scrollPercent < 10 && !scrollThresholdTriggered) {
      scrollThresholdTriggered = true;
      triggerRescueAgent("scroll_up_abandonment");
    }
  }, { passive: true });

  // DETECTOR 4: Cambio de visibilidad de pestaña (en móviles o cambio de tab)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      // Registrar que intentó cambiar de pestaña
      logRescueTelemetry();
    }
  });

  // Exponer disparador manual para botones de soporte o copilotos
  window.__triggerCommercialRescue = function() {
    sessionStorage.removeItem(RESCUE_COOLDOWN_KEY);
    triggerRescueAgent("manual_trigger");
  };

  console.log("🛡️ Agente de Rescate Comercial activo y protegiendo el embudo en " + currentPath);
})();
