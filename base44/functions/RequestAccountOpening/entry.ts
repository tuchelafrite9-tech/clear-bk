import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { nom, prenom, mail, telephone, iban, motif, date_naissance, id_recto_url, id_verso_url } = body;

    if (!nom || !prenom || !mail || !date_naissance || !id_recto_url || !id_verso_url) {
      return Response.json({ error: 'nom, prenom, mail, date_naissance, id_recto_url et id_verso_url sont requis' }, { status: 400 });
    }

    const parsedBirthDate = new Date(`${date_naissance}T00:00:00Z`);
    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(date_naissance) && !Number.isNaN(parsedBirthDate.getTime()) && parsedBirthDate.toISOString().slice(0, 10) === date_naissance;
    const isBase44MediaUrl = (url: string) => {
      try {
        const parsed = new URL(url);
        return parsed.protocol === 'https:' && parsed.hostname === 'media.base44.com';
      } catch {
        return false;
      }
    };

    if (!isValidDate || !isBase44MediaUrl(id_recto_url) || !isBase44MediaUrl(id_verso_url)) {
      return Response.json({ error: 'Les informations d’identité sont invalides' }, { status: 400 });
    }

    const normalizedEmail = mail.trim().toLowerCase();
    await base44.asServiceRole.entities.DemandeOuverture.create({
      nom,
      prenom,
      mail: normalizedEmail,
      telephone: telephone || '',
      iban: iban || '',
      motif: motif || '',
      date_naissance,
      id_recto_url,
      id_verso_url,
      statut: 'en_attente',
      date_demande: new Date().toISOString(),
    });

    return Response.json({ success: true, statut: 'en_attente' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});