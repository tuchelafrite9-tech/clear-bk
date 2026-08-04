import { getAuthenticatedUser, isAdmin } from "./_supabase.js";
import { escapeHtml, sendEmail } from "./_email.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const user = await getAuthenticatedUser(req);
  if (!user || !(await isAdmin(user.id))) return res.status(403).json({ error: "Accès administrateur requis." });

  const { client_email, client_prenom = "", client_nom = "" } = req.body || {};
  const email = String(client_email || "").trim().toLowerCase();
  if (!email) return res.status(400).json({ error: "client_email requis" });
  const name = `${escapeHtml(client_prenom)} ${escapeHtml(client_nom)}`.trim();
  const link = `${new URL(req.headers.origin || "https://clear-bk.com").origin}/register?email=${encodeURIComponent(email)}`;
  const result = await sendEmail({
    to: email,
    subject: "ClearBank — créez votre espace client",
    html: `<p>Bonjour ${name || ""},</p><p>Votre demande a été approuvée. Vous pouvez maintenant créer votre espace client.</p><p><a href="${link}">Créer mon espace client</a></p><p>L’équipe ClearBank</p>`,
  });
  return res.status(200).json({ success: true, messageId: result.id });
}
