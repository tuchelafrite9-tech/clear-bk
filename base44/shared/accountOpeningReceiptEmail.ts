import { deliverEmail } from "./emailDelivery.ts";

const SUBJECT = "ClearBank — demande d’ouverture de compte reçue";

function buildReceiptHtml(firstName: string): string {
  const safeFirstName = firstName.replace(/[&<>'"]/g, (character) => {
    if (character === "&") return "&amp;";
    if (character === "<") return "&lt;";
    if (character === ">") return "&gt;";
    if (character === "'") return "&#39;";
    return "&quot;";
  });

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f3f3f3;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;">
    <tr><td style="padding:40px;">
      <h1 style="color:#0c7981;font-size:26px;margin:0 0 20px;">Demande reçue</h1>
      <p style="color:#4a4a4a;font-size:16px;line-height:1.6;">Bonjour ${safeFirstName},</p>
      <p style="color:#4a4a4a;font-size:16px;line-height:1.6;">Nous confirmons la réception de votre demande d’ouverture de compte et de vos pièces justificatives.</p>
      <p style="color:#4a4a4a;font-size:16px;line-height:1.6;">Notre équipe va examiner votre dossier. Vous recevrez un nouvel e-mail lorsque votre espace client pourra être créé.</p>
      <p style="color:#4a4a4a;font-size:16px;line-height:1.6;margin-top:28px;">Cordialement,<br/><strong>L’équipe ClearBank</strong></p>
    </td></tr>
  </table>
</body></html>`;
}

export async function sendAccountOpeningReceipt(base44: any, clientEmail: string, firstName: string): Promise<string> {
  const result = await deliverEmail(base44, {
    to: clientEmail,
    subject: SUBJECT,
    html: buildReceiptHtml(firstName),
    senderEmail: "",
  });
  return result.messageId;
}
