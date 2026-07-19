import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { client_email, client_prenom, client_nom } = body;
    if (!client_email) return Response.json({ error: 'client_email requis' }, { status: 400 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    const subject = `=?UTF-8?B?${btoa('Votre compte ClearBank a été ouvert')}?=`;
    const fromName = 'ClearBank';
    const fromEmail = user.email;

    const html = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f4f4f4;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;">
    <tr style="background:#0c7981;height:80px;">
      <td style="text-align:center;padding:20px;">
        <span style="color:#fff;font-size:28px;font-weight:800;letter-spacing:1px;">ClearBank</span>
      </td>
    </tr>
    <tr><td style="padding:40px 32px;">
      <h1 style="color:#0c7981;font-size:24px;margin:0 0 16px;">Bienvenue chez ClearBank, ${client_prenom || ''} ${client_nom || ''} !</h1>
      <p style="color:#333;font-size:16px;line-height:1.6;">Votre demande d'ouverture de compte a été <strong>validée</strong> par notre équipe.</p>
      <p style="color:#333;font-size:16px;line-height:1.6;">Votre compte est désormais actif. Vous pouvez vous connecter à votre espace client en utilisant le code à usage unique qui vous sera communiqué.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
        <tr><td style="text-align:center;">
          <a href="https://app-clearbank.com/my-account" style="display:inline-block;background:#0c7981;color:#fff;text-decoration:none;padding:14px 32px;border-radius:9999px;font-weight:600;font-size:16px;">Accéder à mon compte</a>
        </td></tr>
      </table>
      <p style="color:#666;font-size:14px;line-height:1.6;">Si vous avez des questions, notre équipe reste à votre disposition.</p>
      <p style="color:#666;font-size:14px;line-height:1.6;margin-top:24px;">Cordialement,<br><strong style="color:#0c7981;">L'équipe ClearBank</strong></p>
    </td></tr>
    <tr style="background:#f9f9f9;">
      <td style="padding:20px 32px;text-align:center;color:#999;font-size:12px;">
        ClearBank Limited — Niveau 27, The Broadgate Tower, 20 Primrose Street, Londres, EC2A 2EW, Royaume-Uni.
      </td>
    </tr>
  </table>
</body></html>`;

    const rawMessage = [
      `From: ${fromName} <${fromEmail}>`,
      `To: ${client_email}`,
      `Subject: ${subject}`,
      `Content-Type: text/html; charset=UTF-8`,
      `MIME-Version: 1.0`,
      ``,
      html,
    ].join('\r\n');

    const encodedMessage = btoa(unescape(encodeURIComponent(rawMessage)));

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: encodedMessage }),
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