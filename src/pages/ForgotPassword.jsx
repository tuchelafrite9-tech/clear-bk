import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Mail, Lock, ArrowLeft, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function ForgotPassword() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialEmail = urlParams.get("email") || "";
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("form"); // form | otp | done
  const [otpCode, setOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    setLoading(true);
    try {
      await base44.auth.register({ email, password });
      setStep("otp");
    } catch (err) {
      const msg = (err.message || "").toLowerCase();
      if (msg.includes("exist") || msg.includes("déjà") || msg.includes("already")) {
        // Le compte existe déjà — on renvoie l'OTP pour qu'il puisse vérifier son email
        try {
          await base44.auth.resendOtp(email);
          setStep("otp");
        } catch (resendErr) {
          setError("Un compte existe déjà avec cet email. Connectez-vous à partir de la page de connexion.");
        }
      } else {
        setError(err.message || "Erreur lors de la création du compte.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) {
        base44.auth.setToken(result.access_token);
      }
      setStep("done");
    } catch (err) {
      setError(err.message || "Code de vérification invalide.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await base44.auth.resendOtp(email);
    } catch (err) {
      setError(err.message || "Erreur lors du renvoi du code.");
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
                {step === "otp" ? (
                  <Mail className="w-7 h-7 text-teal-dark" />
                ) : step === "done" ? (
                  <CheckCircle2 className="w-7 h-7 text-teal-dark" />
                ) : (
                  <Lock className="w-7 h-7 text-teal-dark" />
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
                {step === "otp" ? "Vérifiez votre email" : step === "done" ? "Espace créé !" : "Je crée mon espace client"}
              </h1>
              <p className="text-gray-600 text-base">
                {step === "otp"
                  ? `Nous avons envoyé un code de vérification à ${email}`
                  : step === "done"
                  ? "Votre espace client est prêt. Vous allez être redirigé."
                  : "Définissez votre mot de passe pour accéder à votre espace client."}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl pl-11 pr-11 py-3 text-base text-black bg-white focus:outline-none focus:border-teal-dark focus:ring-1 focus:ring-teal-dark transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                    <input
                      type={showPassword ? "text" : "password"}
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
                      Création...
                    </>
                  ) : (
                    "Créer mon espace"
                  )}
                </button>
              </form>
            )}

            {step === "otp" && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otpCode}
                    onChange={setOtpCode}
                    autoFocus
                    autoComplete="one-time-code"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <button
                  onClick={handleVerify}
                  disabled={loading || otpCode.length < 6}
                  className="w-full inline-flex items-center justify-center bg-black text-white rounded-full px-6 py-3 text-lg font-medium hover:bg-teal-dark transition disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Vérification...
                    </>
                  ) : (
                    "Vérifier"
                  )}
                </button>
                <p className="text-center text-sm text-gray-600">
                  Vous n'avez pas reçu le code ?{" "}
                  <button onClick={handleResend} className="text-teal-dark font-medium hover:underline">
                    Renvoyer
                  </button>
                </p>
              </div>
            )}

            {step === "done" && (
              <div className="text-center py-4">
                <button
                  onClick={() => { window.location.href = "/my-account"; }}
                  className="inline-flex items-center justify-center bg-black text-white rounded-full px-6 py-3 text-lg font-medium hover:bg-teal-dark transition"
                >
                  Accéder à mon espace
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