import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="13" fill="none" className="inline-block ml-2">
    <path d="M15.597 6.78a.9.9 0 0 0-.28-.648L10.182.999C9.98.804 9.77.718 9.55.718c-.5 0-.859.351-.859.828 0 .25.102.46.258.617l1.758 1.781 2.265 2.07-1.812-.109H1.69c-.523 0-.883.36-.883.875 0 .508.36.867.883.867h9.469l1.812-.109-2.265 2.07-1.758 1.782a.86.86 0 0 0-.258.617c0 .476.36.828.86.828a.88.88 0 0 0 .617-.266l5.148-5.148a.896.896 0 0 0 .281-.64Z" fill="currentColor" />
  </svg>
);

export default function Begin() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ prenom: "", nom: "", email: "", entreprise: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await base44.entities.Contact.create({
        prenom: form.prenom,
        nom: form.nom,
        email: form.email,
        entreprise: form.entreprise,
        message: form.message,
        statut: "nouveau",
      });
      setSubmitted(true);
      setForm({ prenom: "", nom: "", email: "", entreprise: "", message: "" });
    } catch (err) {
      setError("Une erreur est survenue lors de l'envoi du formulaire. Veuillez réessayer.");
    }
    setSubmitting(false);
  };

  return (
    <>
      <section className="pt-[120px] md:pt-[180px] pb-12 md:pb-20">
        <div className="cb-container">
          <h1 className="cb-h1 mb-6 md:mb-8">Begin your journey</h1>
          <p className="cb-h6 max-w-[813px] text-gray-600">
            Experience the ClearBank difference and begin your journey today. Fill out the form below and our team will get in touch.
          </p>
        </div>
      </section>

      <section className="pb-12 md:pb-20">
        <div className="cb-container">
          <div className="max-w-[666px]">
            {submitted ? (
              <div className="bg-teal/20 border border-teal-dark rounded-2xl p-8 md:p-12">
                <h2 className="cb-h3 mb-4">Thank you!</h2>
                <p className="cb-body1">We've received your enquiry and our team will be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="cb-body2 text-gray-600 mb-2 block">First name *</label>
                    <input required type="text" name="prenom" value={form.prenom} onChange={handleChange} placeholder="Enter your first name" className="w-full border border-gray-300 rounded-xl px-4 py-3 cb-body1 focus:border-black focus:outline-none transition" />
                  </div>
                  <div>
                    <label className="cb-body2 text-gray-600 mb-2 block">Last name *</label>
                    <input required type="text" name="nom" value={form.nom} onChange={handleChange} placeholder="Enter your last name" className="w-full border border-gray-300 rounded-xl px-4 py-3 cb-body1 focus:border-black focus:outline-none transition" />
                  </div>
                </div>
                <div>
                  <label className="cb-body2 text-gray-600 mb-2 block">Email *</label>
                  <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter your email address" className="w-full border border-gray-300 rounded-xl px-4 py-3 cb-body1 focus:border-black focus:outline-none transition" />
                </div>
                <div>
                  <label className="cb-body2 text-gray-600 mb-2 block">Company</label>
                  <input type="text" name="entreprise" value={form.entreprise} onChange={handleChange} placeholder="Enter your company name" className="w-full border border-gray-300 rounded-xl px-4 py-3 cb-body1 focus:border-black focus:outline-none transition" />
                </div>
                <div>
                  <label className="cb-body2 text-gray-600 mb-2 block">How can we help?</label>
                  <textarea required name="message" value={form.message} onChange={handleChange} rows={4} placeholder="Tell us about your requirements" className="w-full border border-gray-300 rounded-xl px-4 py-3 cb-body1 focus:border-black focus:outline-none transition resize-none" />
                </div>
                <p className="cb-body3 text-gray-500">
                  Learn how we use your information in our Privacy Notice. You can opt out at any time.
                </p>
                <button type="submit" disabled={submitting} className="cb-btn-black disabled:opacity-50">
                  {submitting ? "Sending..." : "Submit"} <ArrowRight />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}