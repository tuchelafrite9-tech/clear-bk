import { createClientFromRequest } from "npm:@base44/sdk@0.8.38";
import { deliverEmail } from "../../shared/emailDelivery.ts";

const escapeHtml = (value: string) =>
  value.replace(/[&<>'"]/g, (character) => {
    if (character === "&") return "&amp;";
    if (character === "<") return "&lt;";
    if (character === ">") return "&gt;";
    if (character === "'") return "&#39;";
    return "&quot;";
  });

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { type, montant, motif } = await req.json();
    if (!["liberation_fournisseur", "recuperation_compte"].includes(type)) {
      return Response.json({ error: "Type de demande invalide" }, { status: 400 });
    }

    const clients = await base44.asServiceRole.entities.Client.filter({ mail: user.email.trim().toLowerCase() });
    const client = clients[0];
    if (!client) return Response.json({ error: "Client introuvable" }, { status: 404 });

    const opLabel = type === "liberation_fournisseur"
      ? "Libération du montant séquestre vers le fournisseur"
      : "Récupération du montant séquestre vers le compte courant";
    const amount = Number(montant);
    const montantStr = Number.isFinite(amount) && amount > 0
      ? amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
      : "Non précisé";
    const safeMotif = typeof motif === "string" ? escapeHtml(motif.slice(0, 1000)) : "";
    const firstName = escapeHtml(client.prenom || "");
    const lastName = escapeHtml(client.nom || "");

    const html = `<!DOCTYPE html><html><body style="font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:40px 20px;">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:24px;overflow:hidden;">
        <div style="background:#0f172a;padding:32px;text-align:center;"><h1 style="color:#70F1DA;margin:0;">ClearBank</h1><p style="color:#94a3b8;margin:8px 0 0;">Confirmation de votre demande</p></div>
        <div style="padding:40px;"><h2>Bonjour ${firstName} ${lastName},</h2><p>Nous confirmons la réception de votre demande d'opération.</p>
          <p><strong>Opération :</strong> ${opLabel}<br/><strong>Montant :</strong> ${montantStr}${safeMotif ? `<br/><strong>Motif :</strong> ${safeMotif}` : ""}<br/><strong>Statut :</strong> En attente</p>
          <p>Votre demande sera traitée par votre administrateur dans les meilleurs délais.</p>
        </div>
      </div>
    </body></html>`;

    const result = await deliverEmail(base44, {
      to: client.mail,
      subject: `Confirmation de votre demande — ${opLabel}`,
      html,
      senderEmail: user.email,
    });
    return Response.json({ success: true, provider: result.provider, messageId: result.messageId });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
});
