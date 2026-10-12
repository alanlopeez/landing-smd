export type ResponseCategory =
  | 'saludo'
  | 'calificacion'
  | 'oferta_500leads'
  | 'oferta_landing'
  | 'oferta_video'
  | 'objecion_garantia'
  | 'objecion_precio'
  | 'objecion_adspend'
  | 'objecion_criterios'
  | 'objecion_ia_video'
  | 'cierre_reserva'
  | 'cierre_llamada'
  | 'pago_transferencia'
  | 'pago_tarjeta'
  | 'pago_usd';

export interface ConversationResponse {
  id: string;
  title: string;
  category: ResponseCategory;
  targetStage: 0 | 1 | 2 | 3 | 4;
  keywords: string[];
  approvedResponse: string;
  keyFacts: string[];
  nextStage: 0 | 1 | 2 | 3 | 4;
}

export const CONVERSATION_RESPONSES: ConversationResponse[] = [
  // ==========================================
  // ETAPA 0: SALUDO & APERTURA CONSULTIVA
  // ==========================================
  {
    id: 'saludo_general',
    title: 'Saludo Inicial & Descubrimiento',
    category: 'saludo',
    targetStage: 0,
    keywords: ['hola', 'buen dia', 'buenas', 'buenas tardes', 'que tal', 'como va', 'che'],
    approvedResponse:
      '¡Hola {nombre}! Qué bueno que escribas. ¿De qué rubro es tu empresa y en qué zona estás operando actualmente?',
    keyFacts: ['Nunca enviar precios ni links de pago de entrada', 'Mantener tono cercano argentino'],
    nextStage: 1,
  },
  {
    id: 'saludo_nicho_lanchas_maquinaria',
    title: 'Apertura para Rubro High-Ticket (Lanchas / Maquinaria / Fábricas)',
    category: 'saludo',
    targetStage: 0,
    keywords: ['lancha', 'embarcacion', 'nautica', 'maquinaria', 'tractor', 'fabrica', 'industrial', 'camion', 'auto'],
    approvedResponse:
      '¡Hola {nombre}! Espectacular. En ese rubro el problema número uno son los curiosos que hacen perder tiempo sin presupuesto real. ¿Cómo vienen captando prospectos hoy?',
    keyFacts: ['Validar dolor de los curiosos', 'Enfocar en decisores de compra con presupuesto'],
    nextStage: 1,
  },

  // ==========================================
  // ETAPA 1: CALIFICACIÓN ICP & DIAGNÓSTICO
  // ==========================================
  {
    id: 'calificacion_ticket_capacidad',
    title: 'Calificación de Ticket y Equipo Comercial',
    category: 'calificacion',
    targetStage: 1,
    keywords: ['vendo', 'ofrezco', 'productos', 'servicios', 'clientes', 'equipo', 'vendedores'],
    approvedResponse:
      'Excelente {nombre}. Para saber si nuestro sistema te encaja perfecto: ¿cuál es el ticket promedio de lo que comercializan y si cuentan con asesores para atender los contactos en el día?',
    keyFacts: ['Detectar si el cliente tiene capacidad de cierre', 'Asegurar que el ticket soporte la inversión'],
    nextStage: 2,
  },

  // ==========================================
  // ETAPA 2: OFERTAS PRINCIPALES POR SERVICIO
  // ==========================================
  {
    id: 'oferta_500leads',
    title: 'Presentación Servicio 500 Leads Calificados',
    category: 'oferta_500leads',
    targetStage: 2,
    keywords: ['500 leads', 'leads', 'prospectos', 'como funciona', 'de que trata', 'explicame', 'que hacen', 'clientes'],
    approvedResponse:
      'Te instalamos una máquina comercial con landing propia en 72hs y te entregamos 500 decisores de compra calificados directamente a tu WhatsApp en 90 días con contrato comercial. Nosotros ponemos toda la tecnología. ¿Cuántas operaciones al mes te gustaría sumar?',
    keyFacts: ['90 días de plazo', '500 decisores directos', 'Entrega directa a WhatsApp/CRM'],
    nextStage: 2,
  },
  {
    id: 'oferta_video_repurposing',
    title: 'Presentación Reciclaje de Video a Clips Virales',
    category: 'oferta_video',
    targetStage: 2,
    keywords: ['video', 'videos', 'reels', 'tiktok', 'shorts', 'youtube', 'podcast', 'clips', 'edicion', 'grabar'],
    approvedResponse:
      'Si tenés grabaciones de 1 hora, conferencias o podcasts, los reciclamos en piezas verticales de 30 a 60 segundos con ganchos de retención y subtítulos dinámicos para Reels, TikTok y Shorts. Además te entregamos 1 clip gratis para probar. ¿Tenés algún video largo en YouTube o Drive para pasarme?',
    keyFacts: ['1 clip demo 100% gratis', 'Entrega en 48-72h', 'Ganchos de retención psicológica'],
    nextStage: 2,
  },
  {
    id: 'oferta_landing_pages',
    title: 'Presentación Landing Pages Interactivas Next.js',
    category: 'oferta_landing',
    targetStage: 2,
    keywords: ['pagina web', 'sitio web', 'landing', 'landing page', 'web', 'funnel', 'embudo'],
    approvedResponse:
      'Desarrollamos páginas web en Next.js optimizadas para ultra-velocidad y conversión móvil en 72hs, integradas de forma nativa a tu CRM, Meta CAPI y analítica avanzada. ¿Tenés una web actual o arrancás de cero?',
    keyFacts: ['Next.js 15', 'Mobile-first', 'Integraciones nativas con CRM'],
    nextStage: 2,
  },

  // ==========================================
  // ETAPA 3: MANEJO DE OBJECIONES & BLINDAJE
  // ==========================================
  {
    id: 'objecion_garantia_riesgo_cero',
    title: 'Garantía 100% Escrita de Riesgo Cero',
    category: 'objecion_garantia',
    targetStage: 3,
    keywords: ['garantia', 'garantizado', 'seguro', 'riesgo', 'que pasa si no', 'si no llegan', 'si no se cumple', 'devuelven'],
    approvedResponse:
      'Si al día 90 no completamos los 500 leads calificados, seguimos operando y corriendo las campañas 100% gratis sin cobrarte un solo peso hasta entregarlos, o te devolvemos el proporcional. Todo firmado por contrato con mi CUIT 20-39210016-5. ¿Querés que te envíe el modelo de contrato?',
    keyFacts: [
      'Garantía por contrato escrito',
      'Extensión gratuita ilimitada hasta completar 500 leads',
      'Opción de devolución parcial proporcional',
      'CUIT 20-39210016-5',
    ],
    nextStage: 3,
  },
  {
    id: 'objecion_ad_spend_pauta',
    title: 'Aclaración Transparente de Inversión Publicitaria (Ad Spend)',
    category: 'objecion_adspend',
    targetStage: 3,
    keywords: ['publicidad', 'ad spend', 'pauta', 'facebook ads', 'meta ads', 'google ads', 'incluye la pauta', 'gasto en anuncios'],
    approvedResponse:
      'Nuestros honorarios cubren el 100% de la ingeniería, embudos y garantía de entrega. La pauta publicitaria en Meta o Google la pagás directamente en tu propia cuenta comercial: así la factura fiscal sale a tu nombre, es deducible de impuestos y tus costos son transparentes. ¿Manejan cuenta publicitaria hoy?',
    keyFacts: [
      'Ad Spend corre por cuenta del cliente en su cuenta comercial',
      'Facturación fiscal directa para deducción de impuestos',
      'SMD no cobra comisión oculta sobre pauta publicitaria',
    ],
    nextStage: 3,
  },
  {
    id: 'objecion_lead_calificado_criterios',
    title: 'Definición de Lead Calificado (4 Filtros B2B)',
    category: 'objecion_criterios',
    targetStage: 3,
    keywords: ['calificado', 'que es calificado', 'criterio', 'como califican', 'filtro', 'spam', 'curiosos', 'como se'],
    approvedResponse:
      'Para que compute como lead calificado debe ser un decisor real (dueño/director) con WhatsApp activo y mail verificado, necesidad de compra declarada y presupuesto afín. Si entra un contacto inválido, te lo reemplazamos sin cargo en menos de 72hs. ¿Qué requisitos específicos te gustaría sumar al filtro?',
    keyFacts: [
      '4 criterios auditables (Decisor, Contacto verificado, Intención activa, ICP)',
      'SLA de reemplazo en menos de 72 horas sin costo',
    ],
    nextStage: 3,
  },
  {
    id: 'objecion_precios_modelos',
    title: 'Precios Claros y Modalidades de Pago',
    category: 'objecion_precio',
    targetStage: 3,
    keywords: ['precio', 'precios', 'cuanto sale', 'cuanto cuesta', 'costo', 'valor', 'presupuesto', 'tarifa', 'formas de pago'],
    approvedResponse:
      'El servicio garantizado de 500 leads sale $3.500 USD (o $3.500.000 ARS en 2 cuotas o contado bonificado). Para bloquear la exclusividad de tu rubro en tu zona se reserva con una seña inicial de $350.000 ARS. ¿Te gustaría congelar la exclusividad de tu zona?',
    keyFacts: [
      'Seña: $350.000 ARS / $350 USD',
      '2 Cuotas: $1.750.000 ARS / $1.750 USD',
      'Contado total: $3.500.000 ARS / $3.500 USD',
    ],
    nextStage: 4,
  },
  {
    id: 'objecion_diferencia_ia_video',
    title: 'Diferenciación de Video Repurposing frente a IA (OpusClip / Submagic)',
    category: 'objecion_ia_video',
    targetStage: 3,
    keywords: ['ia', 'opusclip', 'submagic', 'inteligencia artificial', 'herramientas', 'automatizado', 'robot'],
    approvedResponse:
      'Una herramienta de IA corta mecánicamente y pone subtítulos genéricos con errores. Nosotros aplicamos criterio editorial humano: detectamos la idea central, metemos ganchos psicológicos en los primeros 3 segundos y estructuramos retención para venta real. ¿Querés ver una muestra con un video tuyo?',
    keyFacts: [
      'Criterio editorial humano vs automatización genérica',
      'Hooks psicológicos en los primeros 3s',
      'Cero errores gramaticales',
    ],
    nextStage: 3,
  },

  // ==========================================
  // ETAPA 4: CIERRE & ACCIÓN DIRECTA
  // ==========================================
  // ==========================================
  // ETAPA 4: MEDIOS DE PAGO & TRANSFERENCIA (10% OFF)
  // ==========================================
  {
    id: 'pago_transferencia_bonificado',
    title: 'Pago por Transferencia Bancaria Directa (10% OFF Bonificado)',
    category: 'pago_transferencia',
    targetStage: 4,
    keywords: [
      'transferencia', 'transferir', 'bancaria', 'cbu', 'cvu', 'alias',
      'banco', 'descuento', 'bonificacion', 'datos de cuenta', 'cuenta', 'deposito'
    ],
    approvedResponse:
      '¡Excelente {nombre}! Para tu mayor tranquilidad y facturación inmediata, operamos **exclusivamente mediante Transferencia Bancaria Directa** con un **10% de DESCUENTO BONIFICADO**:\n\n• **Entidad:** Mercado Pago\n• **Titular:** Alan Ezequiel Lopez\n• **CUIT:** 20-39210016-5\n• **Alias:** `marketingdigital.arg`\n• **CVU:** `0000003100054772699472`\n\nValores bonificados con 10% OFF:\n- Seña 500 Leads: **$315.000 ARS** (en lugar de $350.000)\n- Seña Web Praga: **$234.000 ARS** (en lugar de $260.000)\n\nApenas hagas la transferencia, pasame el comprobante por acá para confeccionar tu Factura Fiscal (A o B) y dar inicio de inmediato.',
    keyFacts: [
      'Único medio de pago: Transferencia Bancaria Directa',
      'No se aceptan tarjetas de crédito',
      'Alias oficial: marketingdigital.arg',
      'CVU oficial: 0000003100054772699472',
      'Titular: Alan Ezequiel Lopez (CUIT 20-39210016-5)',
      '10% OFF bonificado incluido'
    ],
    nextStage: 4,
  },
  {
    id: 'pago_tarjeta_checkout',
    title: 'Consulta por Tarjeta de Crédito (No Aceptada - Exclusivo Transferencia)',
    category: 'pago_tarjeta',
    targetStage: 4,
    keywords: [
      'tarjeta', 'credito', 'debito', 'cuotas', 'mercadopago', 'mp',
      'link de pago', 'link', 'checkout', 'visa', 'mastercard'
    ],
    approvedResponse:
      '{nombre}, por políticas de seguridad, trazabilidad fiscal y para transferirte el 100% del ahorro en comisiones intermediarias, **no recibimos pagos con tarjeta de crédito**.\n\nOperamos **únicamente mediante Transferencia Bancaria Directa**, trasladándote un **10% de DESCUENTO DIRECTO BONIFICADO**:\n• **Alias:** `marketingdigital.arg`\n• **CVU:** `0000003100054772699472`\n• **Titular:** Alan Ezequiel Lopez (Mercado Pago)\n\n¿Te queda cómodo hacer la transferencia desde tu app de banco o billetera virtual?',
    keyFacts: [
      'No se acepta tarjeta de crédito',
      'Solo transferencia bancaria directa',
      'Alias oficial: marketingdigital.arg',
      '10% de descuento bonificado'
    ],
    nextStage: 4,
  },
  {
    id: 'pago_usd_internacional',
    title: 'Pago en Dólares (USD / Latam / Internacional - Exclusivo Transferencia o Crypto)',
    category: 'pago_usd',
    targetStage: 4,
    keywords: [
      'dolar', 'dolares', 'usd', 'paypal', 'exterior', 'internacional',
      'usdt', 'crypto', 'cripto', 'swift', 'wire', 'afuera', 'uruguay', 'chile', 'mexico', 'espana'
    ],
    approvedResponse:
      'Para contrataciones internacionales en Dólares (USD), emitimos Factura E oficial de exportación deducible. **No recibimos pagos con tarjeta de crédito**; operamos mediante:\n1. **Transferencia Crypto USDT (Red TRC-20):** `TFx8P3kL7yQwZ9mBnCv4Rt5Ew2XjK6H1mN` (con 10% bonificado)\n2. **Transferencia Bancaria Internacional (Wire / Swift)** para empresas en el exterior.\n\nTodos los datos están centralizados en: https://www.serviciodemarketingdigital.com/pagar',
    keyFacts: [
      'Factura E oficial deducible de exportación',
      'No se acepta tarjeta de crédito internacional',
      'Transferencia bancaria Wire o Crypto USDT (TRC-20)'
    ],
    nextStage: 4,
  },
  {
    id: 'cierre_reserva_mercadopago',
    title: 'Enlace de Seña / Bloqueo con Transferencia Bancaria',
    category: 'cierre_reserva',
    targetStage: 4,
    keywords: ['senar', 'seña', 'reservar', 'bloquear', 'pagar', 'comenzar', 'arrancar'],
    approvedResponse:
      'Podés congelar el cupo exclusivo de tu zona con la seña inicial bonificada de **$315.000 ARS** (en vez de $350.000) por transferencia directa:\n• **Alias:** `marketingdigital.arg`\n• **CVU:** `0000003100054772699472`\n• **Titular:** Alan Ezequiel Lopez (Mercado Pago)\n\nApenas hagas la transferencia, pasame el comprobante por acá para confeccionar tu Factura legal y dar inicio formal hoy mismo.',
    keyFacts: [
      'Seña bonificada 10% OFF: $315.000 ARS',
      'Exclusivo transferencia bancaria directa',
      'Alias marketingdigital.arg'
    ],
    nextStage: 4,
  },
  {
    id: 'cierre_llamada_calcom',
    title: 'Agendamiento de Llamada Estratégica (Cal.com)',
    category: 'cierre_llamada',
    targetStage: 4,
    keywords: ['llamada', 'reunion', 'agendar', 'coordinar', 'hablar', 'zoom', 'meet', 'cuando podemos hablar', 'llamame'],
    approvedResponse:
      'Totalmente {nombre}. Coordinemos una llamada breve de 15 minutos para ver los números de tu rubro: https://cal.com/alan-lopez/15min. ¿Qué día y horario te queda más cómodo?',
    keyFacts: ['Link oficial Cal.com: https://cal.com/alan-lopez/15min', 'Duración: 15 minutos'],
    nextStage: 4,
  },
];

/**
 * Algoritmo inteligente de recuperación para encontrar la mejor respuesta del repositorio.
 */
export function findBestResponse(
  messageText: string,
  currentStage: number = 0,
  contactName: string = 'Estimado/a',
  company: string = 'Negocio'
): {
  matchedResponse: ConversationResponse;
  score: number;
  recommendedText: string;
  suggestedStage: 0 | 1 | 2 | 3 | 4;
} {
  const normalized = messageText
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  let bestMatch: ConversationResponse | null = null;
  let highestScore = 0;

  for (const resp of CONVERSATION_RESPONSES) {
    let score = 0;

    for (const kw of resp.keywords) {
      const normKw = kw
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      if (normalized.includes(normKw)) {
        // Mayor peso si la palabra clave coincide en longitud o es específica
        score += normKw.length > 5 ? 3 : 2;
      }
    }

    // Bonificación de afinidad si coincide con la etapa esperada del lead
    if (resp.targetStage === currentStage) {
      score += 1.5;
    }

    // Las objeciones críticas tienen prioridad alta si fueron mencionadas explícitamente
    if (resp.category.startsWith('objecion_') && score >= 2) {
      score += 3;
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = resp;
    }
  }

  // Fallback si no hay coincidencias de palabras clave fuertes:
  // usar la plantilla por defecto según la etapa del lead
  if (!bestMatch || highestScore < 1.5) {
    if (currentStage === 0) {
      bestMatch = CONVERSATION_RESPONSES.find((r) => r.id === 'saludo_general')!;
    } else if (currentStage === 1) {
      bestMatch = CONVERSATION_RESPONSES.find((r) => r.id === 'calificacion_ticket_capacidad')!;
    } else if (currentStage === 2) {
      bestMatch = CONVERSATION_RESPONSES.find((r) => r.id === 'oferta_500leads')!;
    } else if (currentStage === 3) {
      bestMatch = CONVERSATION_RESPONSES.find((r) => r.id === 'objecion_garantia_riesgo_cero')!;
    } else {
      bestMatch = CONVERSATION_RESPONSES.find((r) => r.id === 'cierre_llamada_calcom')!;
    }
  }

  const firstName = contactName && contactName !== 'Prospecto' ? contactName.split(' ')[0] : 'che';

  const personalizedText = bestMatch.approvedResponse
    .replace('{nombre}', firstName)
    .replace('{empresa}', company);

  const suggestedStage = Math.max(currentStage, bestMatch.nextStage) as 0 | 1 | 2 | 3 | 4;

  return {
    matchedResponse: bestMatch,
    score: highestScore,
    recommendedText: personalizedText,
    suggestedStage,
  };
}
