import React, { useState } from "react";
import { Link } from "react-router-dom";
import { appApi } from "@/api/appClient";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialEmail = urlParams.get("email") || "";
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("form"); // form | done

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await appApi.auth.resetPasswordRequest(email);
      setStep("done");
    } catch (err) {
      setError(err.message || "Erreur lors de l'envoi de l'email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      <div className="hidden md:block md:w-1/2 overflow-hidden">
        <video
          className="w-full h-full object-cover"
          src="https://clear.bank/uploads/assets/CB_Homepage_H264_3-1_v03.mp4"
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
                {step === "done" ? (
                  <CheckCircle2 className="w-7 h-7 text-teal-dark" />
                ) : (
                  <Mail className="w-7 h-7 text-teal-dark" />
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
                {step === "done" ? "Vérifiez votre email" : "Je crée mon espace client"}
              </h1>
              <p className="text-gray-600 text-base">
                {step === "done"
                  ? `Nous avons envoyé un lien de création de mot de passe à ${email}. Cliquez sur ce lien pour définir votre mot de passe et accéder à votre espace.`
                  : "Entrez votre adresse email pour recevoir un lien de création de mot de passe."}
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            {step === "form" && (
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
                    "Créer mon espace"
                  )}
                </button>
              </form>
            )}

            {step === "done" && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 mb-6">
                  Si vous ne recevez pas l'email dans les prochaines minutes, vérifiez vos spams ou réessayez.
                </p>
                <button
                  onClick={() => { window.location.href = "/login"; }}
                  className="inline-flex items-center justify-center bg-black text-white rounded-full px-6 py-3 text-lg font-medium hover:bg-teal-dark transition"
                >
                  Retour à la connexion
                </button>
              </div>
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