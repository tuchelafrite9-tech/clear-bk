import { adminSupabase } from "./_supabase.js";
import { escapeHtml, sendEmail } from "./_email.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { nom, prenom, mail, telephone = "" } = req.body || {};
  const email = String(mail || "").trim().toLowerCase();
  if (!nom || !prenom || !email) return res.status(400).json({ error: "Nom, prénom et e-mail sont requis." });

  const { error } = await adminSupabase.from("demandes_ouverture").insert({
    nom: String(nom).trim(), prenom: String(prenom).trim(), mail: email, telephone: String(telephone).trim(), statut: "en_attente", date_demande: new Date().toISOString(),
  });
  if (error) return res.status(500).json({ error: error.message });

  try {
    await sendEmail({
      to: email,
      subject: "ClearBank — demande d’ouverture reçue",
      html: `<p>Bonjour ${escapeHtml(prenom)},</p><p>Nous confirmons la réception de votre demande d’ouverture de compte. Notre équipe examinera votre dossier et vous contactera dès que votre espace client pourra être créé.</p><p>L’équipe ClearBank</p>`,
    });
  } catch (emailError) {
    console.error("Account-opening receipt failed", emailError);
  }
  return res.status(201).json({ success: true, statut: "en_attente" });
}
