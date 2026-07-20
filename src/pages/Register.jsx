import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Lock, Loader2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { toast } from "@/components/ui/use-toast";

export default function Register() {
  const urlParams = new URLSearchParams(window.location.search);
  const prefillEmail = (urlParams.get("email") || "").trim().toLowerCase();
  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      setEmail(normalizedEmail);
      await base44.auth.register({ email: normalizedEmail, password });
      setShowOtp(true);
    } catch (err) {
      const msg = err.message || "";
      if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("exist") || msg.toLowerCase().includes("déjà")) {
        setError("Un compte existe déjà avec cet email. Utilisez « Mot de passe oublié » pour le réinitialiser.");
      } else {
        setError(msg || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email: email.trim().toLowerCase(), otpCode });
      if (!result?.access_token) {
        throw new Error("La vérification n'a pas retourné de session valide.");
      }
      base44.auth.setToken(result.access_token);
      window.location.href = "/my-account";
    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await base44.auth.resendOtp(email);
      toast({
        title: "Code sent",
        description: "Check your email for the new code.",
      });
    } catch (err) {
      setError(err.message || "Failed to resend code");
    }
  };

  const handleGoogle = () => {
    base44.auth.loginWithProvider("google", "/");
  };

  if (!prefillEmail && !showOtp) {
    return (
      <AuthLayout
        icon={UserPlus}
        title="Inscription sur invitation"
        subtitle="Votre demande doit d'abord être approuvée par un administrateur."
      >
        <p className="text-sm text-gray-600 mb-5">
          Après approbation, vous recevrez un email contenant votre lien personnel de création de compte.
        </p>
        <Button asChild className="w-full h-12 font-medium bg-teal text-black hover:bg-teal-dark hover:text-white">
          <Link to="/begin">Faire une demande d'ouverture</Link>
        </Button>
      </AuthLayout>
    );
  }

  if (showOtp) {
    return (
      <AuthLayout
        icon={Mail}
        title="Vérifiez votre email"
        subtitle={`Nous avons envoyé un code à ${email}`}
      >
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}
        <div className="flex justify-center mb-6">
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
        <Button
          className="w-full h-12 font-medium bg-teal text-black hover:bg-teal-dark hover:text-white"
          onClick={handleVerify}
          disabled={loading || otpCode.length < 6}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Vérification...
            </>
          ) : (
            "Vérifier"
          )}
        </Button>
        <p className="text-center text-sm text-gray-600 mt-4">
          Vous n'avez pas reçu le code ?{" "}
          <button onClick={handleResend} className="text-teal-dark font-medium hover:underline">
            Renvoyer
          </button>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={UserPlus}
      title="Créer votre compte"
      subtitle="Inscrivez-vous pour commencer"
      footer={
        <>
          Vous avez déjà un compte ?{" "}
          <Link to="/login" className="text-teal-dark font-medium hover:underline">
            Se connecter
          </Link>
        </>
      }
    >
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus={!prefillEmail}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12"
              readOnly={!!prefillEmail}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium bg-teal text-black hover:bg-teal-dark hover:text-white" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Création du compte...
            </>
          ) : (
            "Créer mon compte"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}