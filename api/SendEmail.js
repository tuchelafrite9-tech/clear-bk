import { getAuthenticatedUser } from "./_supabase.js";
import { sendEmail } from "./_email.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const user = await getAuthenticatedUser(req);
  if (!user?.email) return res.status(401).json({ error: "Authentification requise." });

  const { to, subject, body } = req.body || {};
  if (String(to || "").toLowerCase() !== user.email.toLowerCase()) {
    return res.status(403).json({ error: "Vous pouvez uniquement envoyer une confirmation à votre propre adresse." });
  }
  if (!subject || !body) return res.status(400).json({ error: "Sujet et contenu requis." });
  const result = await sendEmail({ to: user.email, subject: String(subject), html: String(body) });
  return res.status(200).json({ success: true, messageId: result.id });
}
