import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.auth.resetPasswordRequest(email);
    } catch {
      // Toujours afficher le succès
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      <div className="hidden md:block md:w-1/2 overflow-hidden">
        <video
          className="w-full h-full object-cover"
          src="https://media.base44.com/videos/public/6a5ca42fae10cd7334263f3b/e3a1e4537_animation.mp4"
          autoPlay
          playsInline
          loop
          muted
        />
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-12 md:py-0">
        <div className="w-full max-w-[460px]">
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-teal/20 flex items-center justify-center mx-auto mb-5">
              <Mail className="w-7 h-7 text-teal-dark" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">Je crée mon espace client</h1>
            <p className="text-gray-600 text-base">
              Renseignez votre email pour définir votre mot de passe et accéder à votre espace.
            </p>
          </div>

          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-teal/20 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-9 h-9 text-teal-dark" />
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Si un compte existe avec cet email, vous recevrez un lien pour définir votre mot de passe dans quelques instants.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                  <input
                    type="email"
                    autoComplete="email"
                    autoFocus
                    placeholder="vous@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    Envoi...
                  </>
                ) : (
                  "Définir mon mot de passe"
                )}
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-6">
          <Link to="/login" className="inline-flex items-center text-sm text-gray-600 font-medium hover:text-teal-dark transition">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Retour à la connexion
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}