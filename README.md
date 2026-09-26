# Landing Page de Alto Rendimiento — Alan López (Servicio de Marketing Digital)

Landing page ultraligera de conversión para servicios de diseño web freelance y soluciones de automatización con inteligencia artificial (sistemas multi-agentes).

---

## 🎨 Sistema de Diseño Híbrido

Esta aplicación fusiona dos estéticas de referencia:

1. **Integrated Biosciences (Hero / Header)**:
   - **Video de fondo cinematográfico**: `public/videos/fondo-header.mp4` con reproducción en bucle, silenciado y optimizado para LCP instantáneo.
   - **Overlay oscuro lab**: Degradado en tonos `#222f30` (Abyssal Ink) y `#012624` (Liquid Abyss).
   - **Tipografía**: Aspekta / Inter Tight (peso 400) con H1 masivo y tracking negativo agresivo (`-0.03em`).
   - **Micro-interacciones**: Acentos en **Bioluminescent Lime** (`#cef79e`) para indicadores y flechas direccionales.

2. **Auros (Cuerpo y Secciones)**:
   - **Superficies**: Lienzo principal `Liquid Abyss` (`#012624`), tarjetas elevadas `Liquid Kelp` (`#003734`) y contenedor profundo `Liquid Deep` (`#011d1c`).
   - **Regla estricta de elevación**: Cero sombras (`box-shadow: none`). La profundidad se logra mediante jerarquía de color y bordes sutiles.
   - **Radios de curvatura**: 16px para tarjetas (`rounded-cards`) y 6px para botones/elementos (`rounded-buttons`).
   - **Tipografía**: Matter / Inter (500 para titulares, 400 para cuerpo). Tracking amplio en etiquetas (`0.12em`).
   - **Botones y CTAs**: Píldora con **Aurora Gradient** (cyan a lavanda-rosa) y texto oscuro.
   - **Estadísticas**: Números a gran escala en **Lavender Phosphor** (`#fde9ff`).

---

## 🚀 Optimización SEO & Schema.org

- **Metaetiquetas exhaustivas**: Canonical URL, OpenGraph, Twitter Cards y Robots configurados.
- **Keywords integradas de forma natural**:
  - *Servicio de página web*
  - *Diseño de página web*
  - *diseñador web freelance*
  - *diseñador de página web*
  - *creador de página web*
  - *cómo crear mi página web*
- **Schema.org Structured Data**: Marcado JSON-LD `ProfessionalService` y `LocalBusiness` con catálogo de ofertas, fundador y detalles de contacto.
- **Sitemap y Robots**: `app/sitemap.ts` y `app/robots.ts` autogenerados.

---

## 🛡️ Ciberseguridad Frontend

- **Encabezados HTTP estrictos**:
  - `Content-Security-Policy` (CSP)
  - `Strict-Transport-Security` (HSTS)
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- **Protección en Formularios**:
  - Sanitización en tiempo real de cadenas para mitigar vectores XSS.
  - Validación de expresiones regulares para correos electrónicos.
  - Campo **Honeypot invisible** (`bot_token`) para bloquear bots automatizados sin molestar al usuario con captchas lentos.

---

## 📊 Backend Serverless: Google Apps Script (`Code.gs`)

Los formularios envían los datos a Google Sheets sin necesidad de servidores dedicados ni bases de datos de pago.

### Paso a paso para configurar Google Sheets:

1. Entra en [Google Sheets](https://sheets.new) y crea una nueva hoja (ejemplo: `CRM Leads - Alan López`).
2. En la barra superior, haz clic en **Extensiones** > **Apps Script**.
3. Reemplaza el código del editor con el contenido del archivo `google-apps-script/Code.gs`.
4. Haz clic en **Guardar** (ícono de disco).
5. Haz clic en el botón azul **Implementar** (Deploy) > **Nueva implementación**.
6. En el selector de engranaje (⚙️), elige **Aplicación web** (Web app).
7. Ajusta los parámetros:
   - **Descripción**: `Landing Webhook Leads`
   - **Ejecutar como**: `Yo` (tu correo de Google)
   - **Quién tiene acceso**: `Cualquier persona` (Anyone)
8. Haz clic en **Implementar** y concede los permisos de tu cuenta de Google.
9. Copia la **URL de la aplicación web** (termina en `/exec`).

### Vincular la URL al Frontend:

- **En desarrollo local**: Tu archivo `.env.local` en la raíz del proyecto ya contiene los endpoints:
  ```bash
  NEXT_PUBLIC_GOOGLE_SCRIPT_LEAD_URL=https://script.google.com/macros/s/AKfycbzbD3jkCnbEuRVGZZrdPxPtJLZ_fTrtfhDDf2W7YPQN3xHut5nldiyae1ljCQ1VXYzBfw/exec
  NEXT_PUBLIC_GOOGLE_SCRIPT_MAGNET_URL=https://script.google.com/macros/s/AKfycbxSUGeN38Y-FN5TRMe8s2KrQx8IaQYbHP2-sWIAqleMRxHXkDy_QzUeHLNXjD47bkY6/exec
  ```
- **En Vercel**: Ve a **Settings** > **Environment Variables** en el panel del proyecto en Vercel, agrega las variables `NEXT_PUBLIC_GOOGLE_SCRIPT_LEAD_URL` y `NEXT_PUBLIC_GOOGLE_SCRIPT_MAGNET_URL` (y opcionalmente `NEXT_PUBLIC_GOOGLE_SCRIPT_URL` como respaldo) y despliega nuevamente.

---

## 🌐 Despliegue en Vercel & GitHub

1. Inicializa el repositorio Git (si no está inicializado) y crea el commit inicial:
   ```bash
   git add .
   git commit -m "feat: landing page Alan López con diseño Auros + Integrated Bio"
   ```
2. Sube los cambios a tu repositorio de GitHub:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git branch -M main
   git push -u origin main
   ```
3. En Vercel:
   - Importa el repositorio de GitHub.
   - Vercel detectará Next.js automáticamente con configuración zero-config.
   - Agrega las variables `NEXT_PUBLIC_GOOGLE_SCRIPT_LEAD_URL` y `NEXT_PUBLIC_GOOGLE_SCRIPT_MAGNET_URL`.
   - Haz clic en **Deploy**.
