import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import Header from "@/components/clearbank/Header";
import Footer from "@/components/clearbank/Footer";

const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="13" fill="none" className="inline-block ml-2">
    <path d="M15.597 6.78a.9.9 0 0 0-.28-.648L10.182.999C9.98.804 9.77.718 9.55.718c-.5 0-.859.351-.859.828 0 .25.102.46.258.617l1.758 1.781 2.265 2.07-1.812-.109H1.69c-.523 0-.883.36-.883.875 0 .508.36.867.883.867h9.469l1.812-.109-2.265 2.07-1.758 1.782a.86.86 0 0 0-.258.617c0 .476.36.828.86.828a.88.88 0 0 0 .617-.266l5.148-5.148a.896.896 0 0 0 .281-.64Z" fill="currentColor" />
  </svg>
);

export default function ClientSpace() {
  const [client, setClient] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const me = await base44.auth.me();
        const records = await base44.entities.Client.filter({ mail: me.email });
        if (records && records.length > 0) {
          setClient(records[0]);
          await base44.entities.Client.update(records[0].id, {
            derniere_connexion: new Date().toISOString(),
          });
          const txs = await base44.entities.Transaction.filter({ client_id: records[0].id }, "-date", 100);
          setTransactions(txs || []);
        } else {
          setError("Aucun compte client trouvé pour votre adresse email. Contactez votre administrateur.");
        }
      } catch (err) {
        setError("Erreur lors du chargement de vos informations.");
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const InfoRow = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100 last:border-b-0">
      <div className="sm:w-1/3 text-sm text-gray-500 font-medium">{label}</div>
      <div className="sm:w-2/3 text-sm md:text-base text-black">{value || "—"}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-[120px] pb-20">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-teal-dark rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="max-w-[600px] mx-auto text-center py-20">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Espace client</h1>
              <p className="text-lg text-gray-600 mb-8">{error}</p>
              <Link to="/" className="inline-flex items-center bg-black text-white rounded-full px-6 py-3 text-lg hover:bg-teal-dark transition">
                Retour à l'accueil <ArrowRight />
              </Link>
            </div>
          ) : client ? (
            <>
              <div className="mb-8 md:mb-12">
                <p className="text-lg md:text-xl mb-2">Bienvenue</p>
                <h1 className="text-4xl md:text-5xl font-bold">
                  {client.prenom} {client.nom}
                </h1>
              </div>

              <div className="grid grid-cols-12 gap-x-6 md:gap-x-14">
                {/* Account Info Card */}
                <div className="col-span-12 lg:col-span-7 mb-8 lg:mb-0">
                  <div className="bg-gray-50 rounded-3xl p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">Informations du compte</h2>
                    <InfoRow label="Nom" value={client.nom} />
                    <InfoRow label="Prénom" value={client.prenom} />
                    <InfoRow label="Email" value={client.mail} />
                    <InfoRow label="IBAN" value={client.iban} />
                    <InfoRow label="Numéro de compte" value={client.numero_de_compte} />
                    <InfoRow label="Numéro de compte séquestre" value={client.numero_de_compte_sequestre} />
                    <InfoRow label="Référence du dossier séquestre" value={client.reference_dossier_sequestre} />
                    <InfoRow
                      label="Date de libération du comité séquestre"
                      value={
                        client.date_liberation_comite_sequestre
                          ? new Date(client.date_liberation_comite_sequestre).toLocaleDateString("fr-FR")
                          : null
                      }
                    />
                    <InfoRow
                      label="Dernière connexion"
                      value={
                        client.derniere_connexion
                          ? new Date(client.derniere_connexion).toLocaleString("fr-FR")
                          : "Première connexion"
                      }
                    />
                  </div>

                  {/* Transactions History */}
                  <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 mt-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl md:text-3xl font-bold">Transactions</h2>
                      <span className="text-sm text-gray-500">{transactions.length} transaction(s)</span>
                    </div>
                    {transactions.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">Aucune transaction pour le moment.</p>
                    ) : (
                      <div className="space-y-3">
                        {transactions.map((tx) => (
                          <div key={tx.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                            <div>
                              <p className="text-sm font-medium text-black">{tx.transaction}</p>
                              <p className="text-xs text-gray-500">
                                {tx.date ? new Date(tx.date).toLocaleDateString("fr-FR") : "—"}
                              </p>
                            </div>
                            <div className={`text-lg font-semibold ${tx.montant >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {tx.montant >= 0 ? "+" : ""}{tx.montant?.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Remarks & Actions */}
                <div className="col-span-12 lg:col-span-5">
                  {client.remarque && (
                    <div className="bg-teal/10 border border-teal rounded-3xl p-6 md:p-8 mb-6">
                      <h3 className="text-lg font-semibold mb-3">Remarque</h3>
                      <p className="text-base text-gray-700">{client.remarque}</p>
                    </div>
                  )}

                  <div className="bg-black text-white rounded-3xl p-6 md:p-8">
                    <h3 className="text-xl font-semibold mb-3">Besoin d'aide ?</h3>
                    <p className="text-gray-400 mb-6">
                      Pour toute question concernant votre compte, contactez votre administrateur ClearBank.
                    </p>
                    <Link
                      to="/about/contact-us"
                      className="inline-flex items-center bg-teal text-black rounded-full px-5 py-2 text-base font-medium hover:bg-white transition"
                    >
                      Nous contacter <ArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}