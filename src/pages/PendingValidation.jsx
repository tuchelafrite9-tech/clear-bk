import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { CheckCircle2, Clock, XCircle, ArrowRight, User, Mail, Phone, Building2 } from "lucide-react";

export default function PendingValidation() {
  const [demande, setDemande] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const me = await base44.auth.me();
        const records = await base44.entities.DemandeOuverture.filter({ mail: me.email }, "-created_date", 10);
        if (records && records.length > 0) {
          setDemande(records[0]);
        }
      } catch (e) {
        // ignore
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-teal-dark rounded-full animate-spin"></div>
      </div>
    );
  }

  const statut = demande?.statut || "en_attente";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-5 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10 text-center">
          {statut === "en_attente" && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-yellow-50 flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <h1 className="text-2xl font-bold mb-3">Compte en attente de validation</h1>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Votre demande d'ouverture de compte a bien été soumise. Un administrateur doit valider votre profil avant que vous puissiez accéder à votre espace client. Vous recevrez une notification dès que votre compte sera activé.
              </p>
            </>
          )}
          {statut === "approuve" && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold mb-3">Compte validé !</h1>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Votre profil a été validé par un administrateur. Vous pouvez maintenant accéder à votre espace client.
              </p>
              <Link
                to="/my-account"
                className="inline-flex items-center bg-teal text-black rounded-full px-6 py-3 text-sm font-medium hover:bg-teal-dark hover:text-white transition"
              >
                Accéder à mon compte <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </>
          )}
          {statut === "refuse" && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold mb-3">Demande refusée</h1>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Votre demande d'ouverture de compte n'a pas pu être validée. Pour plus d'informations, veuillez contacter un administrateur.
              </p>
            </>
          )}

          {demande && (
            <div className="mt-8 pt-6 border-t border-gray-100 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{demande.prenom} {demande.nom}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{demande.mail}</span>
                </div>
                {demande.telephone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{demande.telephone}</span>
                  </div>
                )}
                {demande.iban && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{demande.iban}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-500 hover:text-black transition">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}