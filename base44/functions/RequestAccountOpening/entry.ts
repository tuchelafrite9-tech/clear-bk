import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import { sendAccountOpeningEmail } from '../../shared/accountOpeningEmail.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { nom, prenom, mail, telephone, iban, motif } = body;

    if (!nom || !prenom || !mail) {
      return Response.json({ error: 'nom, prenom et mail sont requis' }, { status: 400 });
    }

    const normalizedEmail = mail.trim().toLowerCase();
    await base44.asServiceRole.entities.DemandeOuverture.create({
      nom,
      prenom,
      mail: normalizedEmail,
      telephone: telephone || '',
      iban: iban || '',
      motif: motif || '',
      statut: 'approuve',
      date_demande: new Date().toISOString(),
    });

    const messageId = await sendAccountOpeningEmail(base44, normalizedEmail, prenom, nom);
    return Response.json({ success: true, messageId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});