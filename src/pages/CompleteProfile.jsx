import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { User, Mail, Phone, Building2, Loader2 } from "lucide-react";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: "", prenom: "", telephone: "", iban: "", motif: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.nom || !form.prenom) {
      setError("Le nom et le prénom sont obligatoires.");
      return;
    }
    setLoading(true);
    try {
      const me = await base44.auth.me();
      await base44.entities.DemandeOuverture.create({
        nom: form.nom,
        prenom: form.prenom,
        mail: me.email,
        telephone: form.telephone || "",
        iban: form.iban || "",
        motif: form.motif || "",
        statut: "en_attente",
        date_demande: new Date().toISOString(),
      });
      navigate("/pending-validation");
    } catch (err) {
      setError(err.message || "Erreur lors de la soumission de la demande.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-5 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
          <h1 className="text-2xl font-bold mb-2">Complétez votre profil</h1>
          <p className="text-gray-600 text-sm mb-6">
            Pour finaliser l'ouverture de votre compte, renseignez vos informations. Votre demande sera ensuite soumise à validation par un administrateur.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Nom *</label>
                <input
                  type="text"
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-teal-dark"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Prénom *</label>
                <input
                  type="text"
                  name="prenom"
                  value={form.prenom}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-teal-dark"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Téléphone</label>
              <input
                type="tel"
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-teal-dark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">IBAN</label>
              <input
                type="text"
                name="iban"
                value={form.iban}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-teal-dark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Motif / Note</label>
              <textarea
                name="motif"
                value={form.motif}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-teal-dark"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center bg-teal text-black rounded-full px-6 py-3 text-base font-medium hover:bg-teal-dark hover:text-white transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Soumission...
                </>
              ) : (
                "Soumettre ma demande"
              )}
            </button>
          </form>
        </div>
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-500 hover:text-black transition">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}