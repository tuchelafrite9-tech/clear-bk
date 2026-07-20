import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const email = user.email;

    // Check if Client record already exists
    const existing = await base44.asServiceRole.entities.Client.filter({ mail: email });
    if (existing && existing.length > 0) {
      return Response.json({ success: true, clientId: existing[0].id, alreadyExisted: true });
    }

    // Look up DemandeOuverture by email
    const demandes = await base44.asServiceRole.entities.DemandeOuverture.filter({ mail: email });
    if (!demandes || demandes.length === 0) {
      return Response.json({ error: 'Aucune demande trouvée pour cet email' }, { status: 404 });
    }

    const dm = demandes[0];
    const client = await base44.asServiceRole.entities.Client.create({
      nom: dm.nom,
      prenom: dm.prenom,
      mail: dm.mail,
      iban: dm.iban || '',
      numero_de_compte: '',
      numero_de_compte_sequestre: '',
      reference_dossier_sequestre: '',
      date_liberation_comite_sequestre: '',
      remarque: dm.motif || '',
      derniere_connexion: null,
      compte_valide: false,
    });

    return Response.json({ success: true, clientId: client.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});