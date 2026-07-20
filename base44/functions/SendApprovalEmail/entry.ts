import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

const FROM_NAME = "ClearBank";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { client_email, client_prenom, client_nom } = body;
    if (!client_email) return Response.json({ error: 'client_email requis' }, { status: 400 });

    const fullName = `${client_prenom || ''} ${client_nom || ''}`.trim();

    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f3f3f3;font-family:'Inter',Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(12,121,129,0.10);">

    <tr>
      <td style="background:#ffffff;padding:36px 40px 28px;text-align:center;">
        <img src="https://media.base44.com/images/public/6a5ca42fae10cd7334263f3b/1d6f5be18_LOGOIM.png" alt="ClearBank" width="180" style="display:block;margin:0 auto;max-width:180px;height:auto;border:none;" />
        <div style="margin-top:14px;display:inline-block;width:60px;height:3px;background:#0c7981;border-radius:2px;"></div>
      </td>
    </tr>

    <tr>
      <td style="padding:40px 40px 20px;">
        <h1 style="font-family:'Inter',Arial,sans-serif;color:#0c7981;font-size:26px;font-weight:700;margin:0 0 8px;line-height:1.3;">Bienvenue chez ClearBank !</h1>
        <p style="font-family:'Inter',Arial,sans-serif;color:#4a4a4a;font-size:16px;line-height:1.65;margin:0 0 20px;">Votre demande d'ouverture de compte a été <strong style="color:#0c7981;">validée</strong> par notre équipe. Votre compte est désormais actif.</p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9fbfb;border-left:4px solid #70F1DA;border-radius:8px;margin:0 0 24px;">
          <tr><td style="padding:20px 24px;">
            <p style="font-family:'Inter',Arial,sans-serif;color:#0c7981;font-size:14px;font-weight:600;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.5px;">Prochaine étape</p>
            <p style="font-family:'Inter',Arial,sans-serif;color:#4a4a4a;font-size:15px;line-height:1.6;margin:0;">Cliquez sur le bouton ci-dessous pour créer votre espace client et définir votre mot de passe.</p>
          </td></tr>
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
          <tr><td style="text-align:center;">
            <a href="https://clear-bk.com/forgot-password" target="_blank" style="display:inline-block;background:#0c7981;color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:9999px;font-family:'Inter',Arial,sans-serif;font-weight:600;font-size:16px;letter-spacing:0.3px;">Créer mon espace client</a>
          </td></tr>
        </table>

        <p style="font-family:'Inter',Arial,sans-serif;color:#999999;font-size:14px;line-height:1.65;margin:0;">Si vous avez des questions, notre équipe reste à votre entière disposition.</p>
      </td>
    </tr>

    <tr>
      <td style="padding:0 40px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e1e1e1;padding-top:20px;">
          <tr><td>
            <p style="font-family:'Inter',Arial,sans-serif;color:#4a4a4a;font-size:15px;line-height:1.6;margin:0;">Cordialement,</p>
            <p style="font-family:'Inter',Arial,sans-serif;color:#0c7981;font-size:16px;font-weight:600;margin:4px 0 0;">L'équipe ClearBank</p>
          </td></tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="background:#f9fbfb;padding:28px 40px;text-align:center;border-top:3px solid #0c7981;">
        <img src="https://media.base44.com/images/public/6a5ca42fae10cd7334263f3b/1d6f5be18_LOGOIM.png" alt="ClearBank" width="130" style="display:block;margin:0 auto 12px;max-width:130px;height:auto;border:none;" />
        <p style="font-family:'Inter',Arial,sans-serif;color:#999999;font-size:11px;line-height:1.6;margin:0;">ClearBank Limited — Level 27, The Broadgate Tower, 20 Primrose Street, London, EC2A 2EW, United Kingdom.<br>Authorised by the PRA. Regulated by the FCA and PRA (FRN: 754568).</p>
      </td>
    </tr>
  </table>
</body></html>`;

    // Build RFC 2822 MIME message
    const mimeMessage =
      `To: ${fullName} <${client_email}>\r\n` +
      `Subject: =?UTF-8?B?${btoa("Votre compte ClearBank a été ouvert")}?=\r\n` +
      `From: ${FROM_NAME}\r\n` +
      `Content-Type: text/html; charset=UTF-8\r\n` +
      `Content-Transfer-Encoding: base64\r\n` +
      `\r\n` +
      btoa(unescape(encodeURIComponent(html)));

    // Gmail API requires base64url encoding (no padding)
    const raw = btoa(mimeMessage).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return Response.json({ error: `Gmail API error: ${errText}` }, { status: 502 });
    }

    const result = await response.json();
    return Response.json({ success: true, messageId: result.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});