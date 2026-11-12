/**
 * Cliente IMAP Ligero sobre TLS Nativo (Node.js `tls`)
 * Diseñado específicamente para Vercel Serverless sin dependencias pesadas.
 * Conecta a imap.gmail.com:993, obtiene correos nuevos con UID > lastUid
 * y extrae From, Subject, Message-ID y el texto del cuerpo.
 */
import * as tls from "tls";

export interface IncomingEmailItem {
  uid: number;
  fromName: string;
  fromEmail: string;
  subject: string;
  messageId: string;
  date: string;
  bodyText: string;
}

function decodeMimeWords(str: string): string {
  if (!str) return "";
  return str.replace(/=\?([^?]+)\?([BQbq])\?([^?]*)\?=/g, (_, charset, encoding, text) => {
    try {
      if (encoding.toUpperCase() === "B") {
        return Buffer.from(text, "base64").toString("utf-8");
      } else {
        const qp = text
          .replace(/_/g, " ")
          .replace(/=([0-9A-Fa-f]{2})/g, (__: string, hex: string) =>
            String.fromCharCode(parseInt(hex, 16))
          );
        return Buffer.from(qp, "binary").toString("utf-8");
      }
    } catch {
      return text;
    }
  });
}

function decodeQuotedPrintable(input: string): string {
  return input
    .replace(/=\r?\n/g, "")
    .replace(/=([0-9A-Fa-f]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

function extractPlainTextFromRawBody(raw: string): string {
  if (!raw) return "";
  let cleaned = raw;

  // Si es multipart, intentar extraer la parte text/plain
  const plainMatch = cleaned.match(/Content-Type:\s*text\/plain[^]*?\r\n\r\n([^]*?)(?:\r\n--|$)/i);
  if (plainMatch && plainMatch[1]) {
    cleaned = plainMatch[1];
  }

  // Si está en base64
  if (/Content-Transfer-Encoding:\s*base64/i.test(raw)) {
    const b64Lines = cleaned
      .split(/\r?\n/)
      .filter((l) => /^[A-Za-z0-9+/=]+$/.test(l.trim()) && l.trim().length > 10)
      .join("");
    if (b64Lines.length > 16) {
      try {
        cleaned = Buffer.from(b64Lines, "base64").toString("utf-8");
      } catch {}
    }
  } else if (/Content-Transfer-Encoding:\s*quoted-printable/i.test(raw) || /=([0-9A-F]{2})/i.test(cleaned)) {
    try {
      cleaned = Buffer.from(decodeQuotedPrintable(cleaned), "binary").toString("utf-8");
    } catch {
      cleaned = decodeQuotedPrintable(cleaned);
    }
  }

  // Limpiar etiquetas HTML y cabeceras residuales
  cleaned = cleaned
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/Content-[A-Za-z-]+:[^\r\n]*/gi, " ")
    .replace(/--[0-9a-zA-Z_-]{10,}--?/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned.slice(0, 1500);
}

export async function fetchNewEmailsSinceUid(lastUid: number): Promise<{
  latestUid: number;
  emails: IncomingEmailItem[];
  error?: string;
}> {
  const user = process.env.OUTREACH_SMTP_USER || "hola@serviciodemarketingdigital.com";
  const pass = process.env.OUTREACH_SMTP_PASSWORD || "";

  if (!pass) {
    return { latestUid: lastUid, emails: [], error: "OUTREACH_SMTP_PASSWORD no configurado" };
  }

  return new Promise((resolve) => {
    let buffer = "";
    let step = 0;
    let resolved = false;

    const finish = (res: { latestUid: number; emails: IncomingEmailItem[]; error?: string }) => {
      if (!resolved) {
        resolved = true;
        try {
          socket.destroy();
        } catch {}
        resolve(res);
      }
    };

    const socket = tls.connect(
      {
        host: "imap.gmail.com",
        port: 993,
        servername: "imap.gmail.com",
        rejectUnauthorized: false,
      },
      () => {
        // Esperar saludo inicial del servidor
      }
    );

    socket.setTimeout(12000, () => {
      finish({ latestUid: lastUid, emails: [], error: "IMAP timeout" });
    });

    socket.on("error", (err) => {
      finish({ latestUid: lastUid, emails: [], error: err.message });
    });

    socket.on("data", (chunk) => {
      buffer += chunk.toString("utf-8");

      if (step === 0 && buffer.includes("* OK")) {
        step = 1;
        buffer = "";
        socket.write(`A1 LOGIN "${user}" "${pass}"\r\n`);
      } else if (step === 1 && (buffer.includes("A1 OK") || buffer.includes("A1 NO") || buffer.includes("A1 BAD"))) {
        if (!buffer.includes("A1 OK")) {
          finish({ latestUid: lastUid, emails: [], error: "Fallo login IMAP" });
          return;
        }
        step = 2;
        buffer = "";
        socket.write(`A2 SELECT INBOX\r\n`);
      } else if (step === 2 && (buffer.includes("A2 OK") || buffer.includes("A2 NO"))) {
        step = 3;
        buffer = "";
        const nextUid = lastUid + 1;
        socket.write(
          `A3 UID FETCH ${nextUid}:* (UID BODY.PEEK[HEADER.FIELDS (FROM SUBJECT DATE MESSAGE-ID)] BODY.PEEK[TEXT]<0.2048>)\r\n`
        );
      } else if (step === 3 && (buffer.includes("A3 OK") || buffer.includes("A3 NO") || buffer.includes("A3 BAD"))) {
        const rawResponse = buffer;
        step = 4;
        buffer = "";
        socket.write(`A4 LOGOUT\r\n`);

        const emails: IncomingEmailItem[] = [];
        let maxUid = lastUid;

        // Dividir por bloques de respuesta "* <seq> FETCH ("
        const blocks = rawResponse.split(/\*\s+\d+\s+FETCH\s+\(/i).slice(1);
        for (const block of blocks) {
          const uidMatch = block.match(/UID\s+(\d+)/i);
          if (!uidMatch) continue;
          const uid = parseInt(uidMatch[1], 10);
          if (uid > maxUid) maxUid = uid;
          if (uid <= lastUid) continue;

          const fromMatch = block.match(/^From:\s*(.+)$/im);
          const subjMatch = block.match(/^Subject:\s*(.+)$/im);
          const dateMatch = block.match(/^Date:\s*(.+)$/im);
          const msgIdMatch = block.match(/^Message-ID:\s*(.+)$/im);

          const rawFrom = decodeMimeWords(fromMatch ? fromMatch[1].trim() : "");
          const emailMatch = rawFrom.match(/<([^>]+)>/) || rawFrom.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
          const fromEmail = (emailMatch ? emailMatch[1] : rawFrom).trim().toLowerCase();
          const fromName = rawFrom.replace(/<[^>]+>/g, "").replace(/["']/g, "").trim() || fromEmail.split("@")[0];

          const subject = decodeMimeWords(subjMatch ? subjMatch[1].trim() : "Consulta Comercial");
          const date = dateMatch ? dateMatch[1].trim() : new Date().toISOString();
          const messageId = msgIdMatch ? msgIdMatch[1].trim() : `uid-${uid}`;

          // Extraer sección BODY[TEXT]
          const textSplit = block.split(/BODY\[TEXT\]<\d+>\s*\{\d+\}\r\n/i);
          const rawBodyPart = textSplit.length > 1 ? textSplit[1] : block;
          const bodyText = extractPlainTextFromRawBody(rawBodyPart);

          emails.push({
            uid,
            fromName,
            fromEmail,
            subject,
            messageId,
            date,
            bodyText: bodyText || subject,
          });
        }

        finish({ latestUid: maxUid, emails });
      }
    });
  });
}
