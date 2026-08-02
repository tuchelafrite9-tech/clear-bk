const FROM_NAME = "ClearBank";
const SUBJECT = "Demande d'ouverture ClearBank — finalisez votre inscription";

function buildAccountOpeningHtml(clientEmail: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f3f3f3;font-family:'Inter',Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(12,121,129,0.10);">
    <tr><td style="background:#ffffff;padding:36px 40px 28px;text-align:center;">
      <img src="https://media.base44.com/images/public/6a5ca42fae10cd7334263f3b/1d6f5be18_LOGOIM.png" alt="ClearBank" width="180" style="display:block;margin:0 auto;max-width:180px;height:auto;border:none;" />
      <div style="margin-top:14px;display:inline-block;width:60px;height:3px;background:#0c7981;border-radius:2px;"></div>
    </td></tr>
    <tr><td style="padding:40px 40px 20px;">
      <h1 style="font-family:'Inter',Arial,sans-serif;color:#0c7981;font-size:26px;font-weight:700;margin:0 0 8px;line-height:1.3;">Finalisez votre espace client ClearBank</h1>
      <p style="font-family:'Inter',Arial,sans-serif;color:#4a4a4a;font-size:16px;line-height:1.65;margin:0 0 20px;">Nous avons bien reçu votre demande d'ouverture de compte. Définissez maintenant votre mot de passe pour accéder à votre espace client. Certaines fonctionnalités resteront limitées jusqu'à la validation finale de votre dossier par l'administrateur.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9fbfb;border-left:4px solid #70F1DA;border-radius:8px;margin:0 0 24px;"><tr><td style="padding:20px 24px;">
        <p style="font-family:'Inter',Arial,sans-serif;color:#0c7981;font-size:14px;font-weight:600;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.5px;">Action requise</p>
        <p style="font-family:'Inter',Arial,sans-serif;color:#4a4a4a;font-size:15px;line-height:1.6;margin:0;">Cliquez sur le bouton ci-dessous pour créer votre espace client et définir votre mot de passe.</p>
      </td></tr></table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;"><tr><td style="text-align:center;">
        <a href="https://clear-bk.com/register?email=${encodeURIComponent(clientEmail)}" target="_blank" style="display:inline-block;background:#0c7981;color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:9999px;font-family:'Inter',Arial,sans-serif;font-weight:600;font-size:16px;letter-spacing:0.3px;">Créer mon espace client</a>
      </td></tr></table>
      <p style="font-family:'Inter',Arial,sans-serif;color:#999999;font-size:14px;line-height:1.65;margin:0;">Si vous avez des questions, notre équipe reste à votre entière disposition.</p>
    </td></tr>
    <tr><td style="padding:0 40px 32px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e1e1e1;padding-top:20px;"><tr><td>
      <p style="font-family:'Inter',Arial,sans-serif;color:#4a4a4a;font-size:15px;line-height:1.6;margin:0;">Cordialement,</p>
      <p style="font-family:'Inter',Arial,sans-serif;color:#0c7981;font-size:16px;font-weight:600;margin:4px 0 0;">L'équipe ClearBank</p>
    </td></tr></table></td></tr>
    <tr><td style="background:#f9fbfb;padding:28px 40px;text-align:center;border-top:3px solid #0c7981;">
      <img src="https://media.base44.com/images/public/6a5ca42fae10cd7334263f3b/1d6f5be18_LOGOIM.png" alt="ClearBank" width="130" style="display:block;margin:0 auto 12px;max-width:130px;height:auto;border:none;" />
      <p style="font-family:'Inter',Arial,sans-serif;color:#999999;font-size:11px;line-height:1.6;margin:0;">ClearBank Limited — Level 27, The Broadgate Tower, 20 Primrose Street, London, EC2A 2EW, United Kingdom.<br>Authorised by the PRA. Regulated by the FCA and PRA (FRN: 754568).</p>
    </td></tr>
  </table>
</body></html>`;
}

export async function sendAccountOpeningEmail(_base44: any, clientEmail: string, clientPrenom: string, clientNom: string): Promise<string> {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const senderDomain = Deno.env.get("RESEND_EMAIL_DOMAIN");
  if (!resendApiKey || !senderDomain) {
    throw new Error("RESEND_API_KEY et RESEND_EMAIL_DOMAIN doivent être configurées dans Base44");
  }

  const fullName = `${clientPrenom || ""} ${clientNom || ""}`.trim();
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <noreply@${senderDomain}>`,
      to: [fullName ? `${fullName} <${clientEmail}>` : clientEmail],
      subject: SUBJECT,
      html: buildAccountOpeningHtml(clientEmail),
    }),
  });
  if (!response.ok) throw new Error(`Resend API error: ${await response.text()}`);
  const result = await response.json();
  return result.id;
}