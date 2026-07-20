import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import Header from "@/components/clearbank/Header";
import Footer from "@/components/clearbank/Footer";

const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="13" fill="none" className="inline-block ml-2">
    <path d="M15.597 6.78a.9.9 0 0 0-.28-.648L10.182.999C9.98.804 9.77.718 9.55.718c-.5 0-.859.351-.859.828 0 .25.102.46.258.617l1.758 1.781 2.265 2.07-1.812-.109H1.69c-.523 0-.883.36-.883.875 0 .508.36.867.883.867h9.469l1.812-.109-2.265 2.07-1.758 1.782a.86.86 0 0 0-.258.617c0 .476.36.828.86.828a.88.88 0 0 0 .617-.266l5.148-5.148a.896.896 0 0 0 .281-.64Z" fill="currentColor" />
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = "/my-account";
    } catch (err) {
      setError(err.message || "Email ou mot de passe invalide.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="relative pt-[60px]">
        <section className="flex flex-col md:flex-row min-h-[calc(100vh-100px)]">
          {/* Video — desktop only */}
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

          {/* Login form */}
          <div className="w-full md:w-1/2 flex items-center justify-center py-12 md:py-0 px-5 lg:px-8">
            <div className="w-full max-w-[440px]">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Mon compte</h1>
              <p className="text-lg text-gray-600 mb-8">Connectez-vous à votre espace client.</p>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 mb-5">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-teal-dark focus:ring-1 focus:ring-teal-dark"
                    required
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">Mot de passe</label>
                    <Link to="/forgot-password" className="text-sm text-teal-dark hover:underline">
                      Mot de passe oublié ?
                    </Link>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-teal-dark focus:ring-1 focus:ring-teal-dark"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center bg-black text-white rounded-full px-6 py-3 text-lg font-medium hover:bg-teal-dark transition disabled:opacity-50"
                >
                  {loading ? "Connexion..." : "Se connecter"} <ArrowRight />
                </button>
              </form>

              <div className="mt-8 text-center text-sm text-gray-600">
                Pas encore de compte ?{" "}
                <Link to="/begin" className="text-teal-dark hover:underline font-medium">
                  Faire une demande d'ouverture
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}