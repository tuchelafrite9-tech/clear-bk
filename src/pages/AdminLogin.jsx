import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ShieldCheck, ArrowRight, Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      setLoading(false);
      return;
    }

    try {
      await base44.auth.loginViaEmailPassword(email, password);
      const me = await base44.auth.me();

      if (me.role !== "admin") {
        await base44.auth.logout();
        setError("Accès refusé. Cette page est réservée aux administrateurs.");
        setLoading(false);
        return;
      }

      window.location.href = "/admin";
    } catch (err) {
      const msg = err?.message || err?.data?.detail || err?.toString() || "";
      if (msg.toLowerCase().includes("not found") || msg.toLowerCase().includes("invalid") || msg.toLowerCase().includes("credential")) {
        setError("Email ou mot de passe incorrect.");
      } else {
        setError("Erreur de connexion. Vérifiez vos identifiants.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-5 py-12 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-teal/5 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="w-full max-w-md relative">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal/10 mb-4">
            <ShieldCheck className="w-8 h-8 text-teal" />
          </div>
          <h1 className="text-3xl font-bold text-white">Espace Administrateur</h1>
          <p className="text-sm text-slate-400 mt-2">Connexion sécurisée réservée aux administrateurs</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@clearbank.com"
                  autoComplete="email"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-teal-dark focus:ring-2 focus:ring-teal/20 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-teal-dark focus:ring-2 focus:ring-teal/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white rounded-full px-6 py-3.5 text-base font-semibold hover:bg-teal-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Connexion..." : "Se connecter"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between">
            <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-teal-dark transition">
              Mot de passe oublié ?
            </Link>
            <Link to="/" className="text-sm text-gray-500 hover:text-teal-dark transition">
              ← Retour au site
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          🔒 Connexion chiffrée et sécurisée. Toute tentative de connexion est enregistrée.
        </p>
      </div>
    </div>
  );
}