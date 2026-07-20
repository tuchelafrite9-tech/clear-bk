import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Lock, Loader2, AlertTriangle, ArrowLeft } from "lucide-react";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      await base44.auth.resetPassword({ resetToken, newPassword });
      window.location.href = "/login";
    } catch (err) {
      setError(err.message || "Erreur lors de la réinitialisation.");
    } finally {
      setLoading(false);
    }
  };

  if (!resetToken) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[460px]">
          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8 md:p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-black mb-2">Lien invalide</h1>
            <p className="text-gray-600 text-sm mb-6">
              Ce lien de réinitialisation est manquant ou invalide. Veuillez demander un nouveau lien.
            </p>
            <Link to="/forgot-password" className="inline-flex items-center bg-black text-white rounded-full px-6 py-3 text-base font-medium hover:bg-teal-dark transition">
              Demander un nouveau lien
            </Link>
          </div>
          <div className="text-center mt-6">
            <Link to="/login" className="inline-flex items-center text-sm text-gray-600 font-medium hover:text-teal-dark transition">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[460px]">
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-teal/20 flex items-center justify-center mx-auto mb-5">
              <Lock className="w-7 h-7 text-teal-dark" />
            </div>
            <h1 className="text-3xl font-bold text-black mb-2">Définir mon mot de passe</h1>
            <p className="text-gray-600 text-base">Choisissez votre mot de passe pour accéder à votre espace client.</p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                <input
                  type="password"
                  autoComplete="new-password"
                  autoFocus
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3 text-base text-black bg-white focus:outline-none focus:border-teal-dark focus:ring-1 focus:ring-teal-dark transition"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3 text-base text-black bg-white focus:outline-none focus:border-teal-dark focus:ring-1 focus:ring-teal-dark transition"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center bg-black text-white rounded-full px-6 py-3 text-lg font-medium hover:bg-teal-dark transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Définir mon mot de passe"
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link to="/login" className="inline-flex items-center text-sm text-gray-600 font-medium hover:text-teal-dark transition">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}