import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import { sendApprovalEmail } from '../../shared/approvalEmail.ts';

// Uses the current account-opening email template.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();
    const { nom, prenom, mail, telephone, iban, motif } = body;
    if (!nom || !prenom || !mail) {
      return Response.json({ error: 'nom, prenom et mail sont requis' }, { status: 400 });
    }
    const normalizedEmail = mail.trim().toLowerCase();

    // 1. Create the opening request automatically; admin account validation happens later.
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

    // 2. Send approval email with register link (Client record is created after registration)
    const messageId = await sendApprovalEmail(base44, normalizedEmail, prenom, nom);

    return Response.json({ success: true, messageId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});