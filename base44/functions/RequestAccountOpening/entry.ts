import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

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
      statut: 'en_attente',
      date_demande: new Date().toISOString(),
    });

    return Response.json({ success: true, statut: 'en_attente' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});