import React, { useState } from "react";
import { base44 } from "@/api/base44Client";

const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="13" fill="none" className="inline-block ml-2">
    <path d="M15.597 6.78a.9.9 0 0 0-.28-.648L10.182.999C9.98.804 9.77.718 9.55.718c-.5 0-.859.351-.859.828 0 .25.102.46.258.617l1.758 1.781 2.265 2.07-1.812-.109H1.69c-.523 0-.883.36-.883.875 0 .508.36.867.883.867h9.469l1.812-.109-2.265 2.07-1.758 1.782a.86.86 0 0 0-.258.617c0 .476.36.828.86.828a.88.88 0 0 0 .617-.266l5.148-5.148a.896.896 0 0 0 .281-.64Z" fill="currentColor" />
  </svg>
);

export default function Begin() {
  const [activeTab, setActiveTab] = useState("contact");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [contactForm, setContactForm] = useState({ prenom: "", nom: "", email: "", message: "" });
  const [accountForm, setAccountForm] = useState({ prenom: "", nom: "", email: "", telephone: "" });

  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleAccountChange = (e) => {
    setAccountForm({ ...accountForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await base44.entities.Contact.create({
        prenom: contactForm.prenom,
        nom: contactForm.nom,
        email: contactForm.email,
        message: contactForm.message,
        statut: "nouveau",
      });
      setSubmitted(true);
      setContactForm({ prenom: "", nom: "", email: "", message: "" });
    } catch (err) {
      setError("Une erreur est survenue lors de l'envoi du formulaire. Veuillez réessayer.");
    }
    setSubmitting(false);
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await base44.entities.DemandeOuverture.create({
        prenom: accountForm.prenom,
        nom: accountForm.nom,
        mail: accountForm.email,
        telephone: accountForm.telephone,
        statut: "en_attente",
        date_demande: new Date().toISOString(),
      });
      setSubmitted(true);
      setAccountForm({ prenom: "", nom: "", email: "", telephone: "" });
    } catch (err) {
      setError("Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer.");
    }
    setSubmitting(false);
  };

  const resetForm = () => {
    setSubmitted(false);
    setError("");
  };

  return (
    <>
      <section className="pt-[80px] md:pt-[120px] pb-12 md:pb-20">
        <div className="cb-container">
          <h1 className="cb-h1 mb-6 md:mb-8">Begin your journey</h1>
          <p className="cb-h6 max-w-[813px] text-gray-600">
            Experience the ClearBank difference and begin your journey today. Choose an option below and our team will get in touch.
          </p>
        </div>
      </section>

      <section className="pb-12 md:pb-20">
        <div className="cb-container">
          <div className="max-w-[666px]">
            {/* Tabs */}
            <div className="flex gap-2 mb-8 border-b border-gray-200">
              <button
                onClick={() => { setActiveTab("contact"); setSubmitted(false); setError(""); }}
                className={`px-5 py-3 text-base font-medium border-b-2 transition -mb-px ${
                  activeTab === "contact"
                    ? "border-teal-dark text-teal-dark"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Nous contacter
              </button>
              <button
                onClick={() => { setActiveTab("account"); setSubmitted(false); setError(""); }}
                className={`px-5 py-3 text-base font-medium border-b-2 transition -mb-px ${
                  activeTab === "account"
                    ? "border-teal-dark text-teal-dark"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Ouvrir un compte
              </button>
            </div>

            {submitted ? (
              <div className="bg-teal/20 border border-teal-dark rounded-2xl p-8 md:p-12">
                <h2 className="cb-h3 mb-4">
                  {activeTab === "contact" ? "Thank you!" : "Demande envoyée !"}
                </h2>
                <p className="cb-body1 mb-6">
                  {activeTab === "contact"
                    ? "We've received your enquiry and our team will be in touch shortly."
                    : "Votre demande d'ouverture de compte a bien été reçue. Notre équipe vous contactera dans les meilleurs délais."}
                </p>
                <button onClick={resetForm} className="cb-btn-black">
                  Nouvelle demande <ArrowRight />
                </button>
              </div>
            ) : activeTab === "contact" ? (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="cb-body2 text-gray-600 mb-2 block">First name *</label>
                    <input required type="text" name="prenom" value={contactForm.prenom} onChange={handleContactChange} placeholder="Enter your first name" className="w-full border border-gray-300 rounded-xl px-4 py-3 cb-body1 focus:border-black focus:outline-none transition" />
                  </div>
                  <div>
                    <label className="cb-body2 text-gray-600 mb-2 block">Last name *</label>
                    <input required type="text" name="nom" value={contactForm.nom} onChange={handleContactChange} placeholder="Enter your last name" className="w-full border border-gray-300 rounded-xl px-4 py-3 cb-body1 focus:border-black focus:outline-none transition" />
                  </div>
                </div>
                <div>
                  <label className="cb-body2 text-gray-600 mb-2 block">Email *</label>
                  <input required type="email" name="email" value={contactForm.email} onChange={handleContactChange} placeholder="Enter your email address" className="w-full border border-gray-300 rounded-xl px-4 py-3 cb-body1 focus:border-black focus:outline-none transition" />
                </div>
                <div>
                  <label className="cb-body2 text-gray-600 mb-2 block">How can we help?</label>
                  <textarea required name="message" value={contactForm.message} onChange={handleContactChange} rows={4} placeholder="Tell us about your requirements" className="w-full border border-gray-300 rounded-xl px-4 py-3 cb-body1 focus:border-black focus:outline-none transition resize-none" />
                </div>
                <p className="cb-body3 text-gray-500">
                  Learn how we use your information in our Privacy Notice. You can opt out at any time.
                </p>
                <button type="submit" disabled={submitting} className="cb-btn-black disabled:opacity-50">
                  {submitting ? "Sending..." : "Submit"} <ArrowRight />
                </button>
              </form>
            ) : (
              <form onSubmit={handleAccountSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="cb-body2 text-gray-600 mb-2 block">Prénom *</label>
                    <input required type="text" name="prenom" value={accountForm.prenom} onChange={handleAccountChange} placeholder="Votre prénom" className="w-full border border-gray-300 rounded-xl px-4 py-3 cb-body1 focus:border-black focus:outline-none transition" />
                  </div>
                  <div>
                    <label className="cb-body2 text-gray-600 mb-2 block">Nom *</label>
                    <input required type="text" name="nom" value={accountForm.nom} onChange={handleAccountChange} placeholder="Votre nom" className="w-full border border-gray-300 rounded-xl px-4 py-3 cb-body1 focus:border-black focus:outline-none transition" />
                  </div>
                </div>
                <div>
                  <label className="cb-body2 text-gray-600 mb-2 block">Email *</label>
                  <input required type="email" name="email" value={accountForm.email} onChange={handleAccountChange} placeholder="vous@exemple.com" className="w-full border border-gray-300 rounded-xl px-4 py-3 cb-body1 focus:border-black focus:outline-none transition" />
                </div>
                <div>
                  <label className="cb-body2 text-gray-600 mb-2 block">Téléphone</label>
                  <input type="tel" name="telephone" value={accountForm.telephone} onChange={handleAccountChange} placeholder="Votre numéro de téléphone" className="w-full border border-gray-300 rounded-xl px-4 py-3 cb-body1 focus:border-black focus:outline-none transition" />
                </div>
                <p className="cb-body3 text-gray-500">
                  Learn how we use your information in our Privacy Notice. You can opt out at any time.
                </p>
                <button type="submit" disabled={submitting} className="cb-btn-black disabled:opacity-50">
                  {submitting ? "Envoi..." : "Envoyer ma demande"} <ArrowRight />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}