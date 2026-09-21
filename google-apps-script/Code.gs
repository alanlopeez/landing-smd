/**
 * ==============================================================================
 * BACKEND SERVERLESS: GOOGLE APPS SCRIPT PARA CAPTURA DE LEADS Y LEAD MAGNET
 * Autor: Alan López - Servicio de Marketing Digital
 * ==============================================================================
 * 
 * INSTRUCCIONES DE INSTALACIÓN:
 * 1. Crea una hoja de cálculo nueva en Google Sheets (ej: "CRM Leads - Alan López").
 * 2. En el menú superior, ve a "Extensiones" > "Apps Script".
 * 3. Borra el código existente en "Código.gs" (o "Code.gs") y pega este archivo completo.
 * 4. Haz clic en el botón Guardar (ícono de disco).
 * 5. Haz clic en "Implementar" (Deploy) > "Nueva implementación" (New deployment).
 * 6. Haz clic en el ícono de engranaje (⚙️) y selecciona "Aplicación web" (Web app).
 * 7. Configura los parámetros:
 *    - Descripción: "Webhook Leads Landing Page"
 *    - Ejecutar como (Execute as): "Yo" (tu cuenta de Google)
 *    - Quién tiene acceso (Who has access): "Cualquier persona" (Anyone / Anyone, even anonymous)
 * 8. Haz clic en "Implementar", autoriza los permisos de tu cuenta de Google.
 * 9. Copia la "URL de la aplicación web" (termina en /exec) y pégala en tu archivo .env.local
 *    o en las variables de entorno de Vercel como:
 *    NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/TU_ID_AQUI/exec
 */

/**
 * Manejador principal POST para recibir datos en formato JSON desde la Landing Page.
 */
function doPost(e) {
  try {
    // 1. Verificación de contenido recibido
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({
        status: "error",
        message: "No se recibieron datos en el cuerpo de la petición."
      }, 400);
    }

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      return createJsonResponse({
        status: "error",
        message: "Error al procesar el JSON: " + parseError.toString()
      }, 400);
    }

    // 2. Obtener la hoja de cálculo activa
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var timezone = ss.getSpreadsheetTimeZone() || Session.getScriptTimeZone() || "GMT-3";
    var fechaActual = Utilities.formatDate(new Date(), timezone, "yyyy-MM-dd HH:mm:ss");

    var type = data.type || "lead";

    // 3. Procesar según el tipo de formulario
    if (type === "lead") {
      // HOJA 1: "Leads"
      var sheetLeads = getOrCreateSheet(ss, "Leads", [
        "Fecha",
        "Nombre",
        "Email",
        "Teléfono",
        "WhatsApp",
        "Flujo de consultas",
        "Inversión",
        "Implementación"
      ]);

      // Extraer campos del formulario calificador
      var nombre = data.name || "";
      var email = data.email || "";
      var telefono = data.phone || "";
      var whatsapp = data.whatsapp || "";
      var volumen = data.volume || "";
      var inversion = data.budget || "";
      var implementacion = data.timeline || "";

      // Insertar nueva fila
      sheetLeads.appendRow([
        fechaActual,
        nombre,
        email,
        telefono,
        whatsapp,
        volumen,
        inversion,
        implementacion
      ]);

      return createJsonResponse({
        status: "success",
        type: "lead",
        message: "Lead registrado exitosamente en la hoja Leads.",
        timestamp: fechaActual
      }, 200);

    } else if (type === "magnet") {
      // HOJA 2: "Lead magnet"
      var sheetMagnet = getOrCreateSheet(ss, "Lead magnet", [
        "Fecha",
        "Nombre",
        "Email"
      ]);

      var magnetNombre = data.nombre || data.name || "";
      var magnetEmail = data.email || "";

      sheetMagnet.appendRow([
        fechaActual,
        magnetNombre,
        magnetEmail
      ]);

      return createJsonResponse({
        status: "success",
        type: "magnet",
        message: "Registro en Lead magnet exitoso.",
        timestamp: fechaActual
      }, 200);

    } else {
      return createJsonResponse({
        status: "error",
        message: "Tipo de formulario no reconocido: " + type
      }, 400);
    }

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: "Excepción interna del servidor: " + error.toString()
    }, 500);
  }
}

/**
 * Manejador GET para health-checks y pruebas desde el navegador.
 */
function doGet(e) {
  return createJsonResponse({
    status: "online",
    service: "Servicio de Marketing Digital - Webhook API",
    autor: "Alan López",
    timestamp: new Date().toISOString()
  }, 200);
}

/**
 * Función auxiliar para obtener o crear automáticamente una hoja con sus encabezados
 */
function getOrCreateSheet(ss, sheetName, headers) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    // Aplicar estilo a los encabezados
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#003734");
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    headerRange.setFontFamily("Arial");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * Generador de respuestas JSON compatibles con CORS
 */
function createJsonResponse(dataObject, statusCode) {
  var output = ContentService.createTextOutput(JSON.stringify(dataObject));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
