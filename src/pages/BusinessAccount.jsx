import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/clearbank/Header";
import Footer from "@/components/clearbank/Footer";

const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="13" fill="none" className="inline-block ml-2">
    <path d="M15.597 6.78a.9.9 0 0 0-.28-.648L10.182.999C9.98.804 9.77.718 9.55.718c-.5 0-.859.351-.859.828 0 .25.102.46.258.617l1.758 1.781 2.265 2.07-1.812-.109H1.69c-.523 0-.883.36-.883.875 0 .508.36.867.883.867h9.469l1.812-.109-2.265 2.07-1.758 1.782a.86.86 0 0 0-.258.617c0 .476.36.828.86.828a.88.88 0 0 0 .617-.266l5.148-5.148a.896.896 0 0 0 .281-.64Z" fill="currentColor" />
  </svg>
);

export default function BusinessAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="relative pt-[60px]">
        <section>
          <div className="flex flex-col md:flex-row">
            {/* Animation full height left side */}
            <div className="md:w-1/2 md:h-[calc(100vh-60px)] overflow-hidden">
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
            <div className="md:w-1/2 py-16 md:py-0 md:flex md:items-center">
            <div className="max-w-[480px] mx-auto w-full px-5 lg:px-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Business Account</h1>
                <p className="text-lg text-gray-600 mb-8">Connectez-vous à votre compte professionnel.</p>

                {submitted ? (
                  <div className="bg-teal/20 border border-teal-dark rounded-2xl p-6 text-center">
                    <p className="text-lg font-medium text-teal-dark">Connexion réussie !</p>
                    <p className="text-gray-600 mt-2">Bienvenue, {email}.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                        {error}
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vous@entreprise.com"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-teal-dark focus:ring-1 focus:ring-teal-dark"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Mot de passe</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-teal-dark focus:ring-1 focus:ring-teal-dark"
                      />
                    </div>
                    <div className="text-right text-sm">
                      <a href="#forgot" className="text-teal-dark hover:underline">Mot de passe oublié ?</a>
                    </div>
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center bg-black text-white rounded-full px-6 py-3 text-lg font-medium hover:bg-teal-dark transition"
                    >
                      Se connecter <ArrowRight />
                    </button>
                  </form>
                )}

                <div className="mt-8 text-center text-sm text-gray-600">
                  Pas encore de compte ?{" "}
                  <Link to="/begin" className="text-teal-dark hover:underline font-medium">
                    Commencez ici
                  </Link>
                </div>
              </div>
            </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}