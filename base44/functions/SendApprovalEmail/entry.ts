import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import { sendAccountOpeningEmail } from '../../shared/accountOpeningEmail.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { client_email, client_prenom, client_nom } = body;
    if (!client_email) return Response.json({ error: 'client_email requis' }, { status: 400 });

    const messageId = await sendAccountOpeningEmail(
      base44,
      client_email.trim().toLowerCase(),
      client_prenom,
      client_nom,
    );
    return Response.json({ success: true, messageId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});