import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const clientEmail = body?.client_email;
    if (!clientEmail) return Response.json({ error: 'client_email requis' }, { status: 400 });

    // Find the user by email
    let users = await base44.asServiceRole.entities.User.list();
    let targetUser = users.find(u => u.email === clientEmail);

    // If user doesn't exist yet, invite them (creates the account)
    let inviteError = null;
    if (!targetUser) {
      try {
        await base44.users.inviteUser(clientEmail, 'user');
      } catch (inviteErr) {
        inviteError = inviteErr.message || String(inviteErr);
      }
      // Re-fetch to get the newly created user
      users = await base44.asServiceRole.entities.User.list();
      targetUser = users.find(u => u.email === clientEmail);
      if (!targetUser) {
        return Response.json({ error: `Impossible de créer le compte utilisateur: ${inviteError || 'utilisateur introuvable après invitation'}` }, { status: 500 });
      }
    }

    // Generate a 6-char alphanumeric code (uppercase, no ambiguous chars)
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }

    // Set the user's password to the code
    try {
      await base44.asServiceRole.entities.User.update(targetUser.id, { password: code });
    } catch (pwErr) {
      // If password setting fails, continue — the code is still sent by email
    }

    // Create a LoginCode record
    await base44.asServiceRole.entities.LoginCode.create({
      client_email: clientEmail,
      code: code,
      used: false
    });

    // Send the code by branded email via Gmail
    const subject = `=?UTF-8?B?${btoa('Votre code de connexion ClearBank')}?=`;
    const fromName = 'ClearBank No-Reply';
    const fromEmail = user.email;

    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Inter',Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(12,121,129,0.10);">
    <tr>
      <td style="background:#ffffff;padding:36px 40px 28px;text-align:center;border-bottom:3px solid #70F1DA;">
        <img src="https://media.base44.com/images/public/6a5ca42fae10cd7334263f3b/1d6f5be18_LOGOIM.png" alt="ClearBank" width="180" style="display:block;margin:0 auto;max-width:180px;height:auto;border:none;" />
        <p style="color:#0c7981;font-size:14px;margin:14px 0 0;font-weight:500;letter-spacing:1px;text-transform:uppercase;">Votre code de connexion à usage unique</p>
      </td>
    </tr>
    <tr>
      <td style="padding:40px;text-align:center;">
        <p style="font-family:'Inter',Arial,sans-serif;color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px;">
          Bonjour,<br/>
          Voici votre code de connexion sécurisé pour accéder à votre espace client :
        </p>
        <div style="display:inline-block;background:linear-gradient(135deg,#f1f5f9,#e2e8f0);border:2px dashed #0c7981;border-radius:16px;padding:24px 48px;margin:0 auto 24px;">
          <span style="font-size:40px;font-weight:800;letter-spacing:10px;color:#0f172a;font-family:monospace;">${code}</span>
        </div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
          <tr><td style="text-align:center;">
            <a href="https://app-clearbank.com/my-account" target="_blank" style="display:inline-block;background:#0c7981;color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:9999px;font-family:'Inter',Arial,sans-serif;font-weight:600;font-size:16px;">Accéder à mon espace</a>
          </td></tr>
        </table>
        <p style="font-family:'Inter',Arial,sans-serif;color:#475569;font-size:14px;line-height:1.6;margin:0;">
          Ce code est à usage unique. Il sera invalide après votre première connexion.<br/>
          Rendez-vous sur votre espace client pour vous connecter.
        </p>
      </td>
    </tr>
    <tr>
      <td style="background:#f9fbfb;padding:28px 40px;text-align:center;border-top:3px solid #0c7981;">
        <img src="https://media.base44.com/images/public/6a5ca42fae10cd7334263f3b/1d6f5be18_LOGOIM.png" alt="ClearBank" width="130" style="display:block;margin:0 auto 12px;max-width:130px;height:auto;border:none;" />
        <p style="font-family:'Inter',Arial,sans-serif;color:#94a3b8;font-size:11px;line-height:1.6;margin:0;">Cet email a été envoyé automatiquement, merci de ne pas y répondre.<br/>© ClearBank Limited ${new Date().getFullYear()}</p>
      </td>
    </tr>
  </table>
</body></html>`;

    const rawMessage = [
      `From: ${fromName} <${fromEmail}>`,
      `To: ${clientEmail}`,
      `Subject: ${subject}`,
      `Content-Type: text/html; charset=UTF-8`,
      `MIME-Version: 1.0`,
      ``,
      html,
    ].join('\r\n');

    const encodedMessage = btoa(unescape(encodeURIComponent(rawMessage)));

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

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
    return Response.json({ success: true, code, client_email: clientEmail, messageId: result.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});