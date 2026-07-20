import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import { sendApprovalEmail } from '../../shared/approvalEmail.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();
    const { nom, prenom, mail, telephone, iban, motif } = body;
    if (!nom || !prenom || !mail) {
      return Response.json({ error: 'nom, prenom et mail sont requis' }, { status: 400 });
    }

    // 1. Create or update DemandeOuverture (auto-approved)
    await base44.asServiceRole.entities.DemandeOuverture.create({
      nom,
      prenom,
      mail,
      telephone: telephone || '',
      iban: iban || '',
      motif: motif || '',
      statut: 'approuve',
      date_demande: new Date().toISOString(),
    });

    // 2. Create Client record if it doesn't already exist
    const existing = await base44.asServiceRole.entities.Client.filter({ mail });
    if (!existing || existing.length === 0) {
      await base44.asServiceRole.entities.Client.create({
        nom,
        prenom,
        mail,
        iban: iban || '',
        numero_de_compte: '',
        numero_de_compte_sequestre: '',
        reference_dossier_sequestre: '',
        date_liberation_comite_sequestre: '',
        remarque: motif || '',
        derniere_connexion: null,
        compte_valide: false,
      });
    }

    // 3. Send approval email with register link
    const messageId = await sendApprovalEmail(base44, mail, prenom, nom);

    return Response.json({ success: true, messageId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});