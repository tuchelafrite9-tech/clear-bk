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
    if (!targetUser) {
      try {
        await base44.asServiceRole.users.inviteUser(clientEmail, 'user');
      } catch (inviteErr) {
        // If invite fails, user may already exist
      }
      // Re-fetch to get the newly created user
      users = await base44.asServiceRole.entities.User.list();
      targetUser = users.find(u => u.email === clientEmail);
      if (!targetUser) return Response.json({ error: 'Impossible de créer le compte utilisateur' }, { status: 500 });
    }

    // Generate a 6-char alphanumeric code (uppercase, no ambiguous chars)
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }

    // Set the user's password to the code
    await base44.asServiceRole.entities.User.update(targetUser.id, { password: code });

    // Create a LoginCode record
    await base44.asServiceRole.entities.LoginCode.create({
      client_email: clientEmail,
      code: code,
      used: false
    });

    // Send the code by email to the client
    try {
      const emailBody = `
        <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 40px 20px;">
          <div style="background: #0f172a; border-radius: 24px 24px 0 0; padding: 32px; text-align: center;">
            <h1 style="color: #70F1DA; font-size: 28px; margin: 0; font-weight: 700;">ClearBank</h1>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 8px;">Votre code de connexion à usage unique</p>
          </div>
          <div style="background: #ffffff; border-radius: 0 0 24px 24px; padding: 40px; text-align: center;">
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              Voici votre code de connexion sécurisé :
            </p>
            <div style="display: inline-block; background: #f1f5f9; border: 2px dashed #0c7981; border-radius: 16px; padding: 20px 40px; margin: 0 auto 24px;">
              <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #0f172a; font-family: monospace;">${code}</span>
            </div>
            <p style="color: #475569; font-size: 14px; line-height: 1.6;">
              Ce code est à usage unique. Il sera invalide après votre première connexion.<br/>
              Rendez-vous sur votre espace client pour vous connecter.
            </p>
            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
              <p style="color: #94a3b8; font-size: 12px; margin: 8px 0 0;">© ClearBank Limited ${new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
      `;
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: clientEmail,
        subject: 'Votre code de connexion ClearBank',
        body: emailBody
      });
    } catch (emailErr) {
      // Email failure should not block the operation
    }

    return Response.json({ code, client_email: clientEmail });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});