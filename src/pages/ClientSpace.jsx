import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import ClientSidebar, { navItems } from "@/components/clearbank/ClientSidebar";
import { InfoRow, SectionHeader, PlaceholderSection } from "@/components/clearbank/ClientSpaceParts";
import { Home, User, ArrowLeftRight, CreditCard, Wallet, PiggyBank, ShieldCheck, TrendingUp, FileText, ArrowUpRight, ArrowDownLeft, ArrowRight, Download, Bell, Phone, LogOut, Receipt, Search } from "lucide-react";

const sectionMeta = {
  accueil: { title: "Accueil", icon: Home },
  compte: { title: "Mon compte", icon: User },
  virement: { title: "Virement", icon: ArrowLeftRight },
  paiement: { title: "Paiements", icon: CreditCard },
  transactions: { title: "Historique des transactions", icon: Receipt },
  carte: { title: "Carte bancaire", icon: Wallet },
  epargne: { title: "Épargne", icon: PiggyBank },
  assurance: { title: "Assurance", icon: ShieldCheck },
  bourse: { title: "Bourse", icon: TrendingUp },
  document: { title: "Documents", icon: FileText },
};

export default function ClientSpace() {
  const [client, setClient] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");
  const [showModal, setShowModal] = useState(null);
  const [dmForm, setDmForm] = useState({ montant: "", motif: "" });
  const [activeSection, setActiveSection] = useState("accueil");
  const [txSearch, setTxSearch] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await base44.auth.logout();
    } catch (e) {
      // ignore errors
    }
    window.location.assign("/login");
  };

  // Déconnexion automatique à la fermeture de la page
  useEffect(() => {
    const handleUnload = () => {
      // Envoi synchrone de déconnexion (best-effort) — pas d'await possible
      try {
        base44.auth.logout();
      } catch (e) {}
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

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
          // Invalider le code à usage unique après connexion
          try {
            const codes = await base44.entities.LoginCode.filter({ client_email: me.email, used: false });
            if (codes && codes.length > 0) {
              for (const c of codes) {
                await base44.entities.LoginCode.update(c.id, { used: true });
              }
              // Réinitialiser le mot de passe avec une valeur aléatoire inconnue
              const randomPwd = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
              await base44.auth.updateMe({ password: randomPwd });
            }
          } catch (e) {
            // ignore
          }
          const txs = await base44.entities.Transaction.filter({ client_id: records[0].id }, "-date", 100);
          setTransactions(txs || []);
          try {
            const dms = await base44.entities.Demande.filter({ client_id: records[0].id }, "-created_date", 50);
            setDemandes(dms || []);
          } catch (e) {
            setDemandes([]);
          }
        } else {
          // No Client record — check if there's a pending account opening request
          try {
            const dso = await base44.entities.DemandeOuverture.filter({ mail: me.email }, "-created_date", 5);
            if (dso && dso.length > 0) {
              window.location.href = "/pending-validation";
              return;
            }
          } catch (e) {
            // ignore
          }
          window.location.href = "/complete-profile";
        }
      } catch (err) {
        setError("Erreur lors du chargement de vos informations.");
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const submitDemande = async (type) => {
    setActionLoading(true);
    setActionSuccess("");
    setError("");
    try {
      await base44.entities.Demande.create({
        type,
        client_id: client.id,
        client_email: client.mail,
        montant: dmForm.montant ? parseFloat(dmForm.montant) : null,
        motif: dmForm.motif || "",
        date_demande: new Date().toISOString(),
        statut: "en_attente",
      });
      const dms = await base44.entities.Demande.filter({ client_id: client.id }, "-created_date", 50);
      setDemandes(dms || []);
      setShowModal(null);
      setDmForm({ montant: "", motif: "" });
      setActionSuccess(
        type === "liberation_fournisseur"
          ? "Demande de libération vers le fournisseur envoyée."
          : "Demande de récupération vers le compte courant envoyée."
      );

      // Send confirmation email to client
      try {
        const opLabel =
          type === "liberation_fournisseur"
            ? "Libération du montant séquestre vers le fournisseur"
            : "Récupération du montant séquestre vers le compte courant";
        const montantStr = dmForm.montant
          ? parseFloat(dmForm.montant).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
          : "Non précisé";
        const emailBody = `
          <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 40px 20px;">
            <div style="background: #0f172a; border-radius: 24px 24px 0 0; padding: 32px; text-align: center;">
              <h1 style="color: #70F1DA; font-size: 28px; margin: 0; font-weight: 700;">ClearBank</h1>
              <p style="color: #94a3b8; font-size: 14px; margin-top: 8px;">Confirmation de votre demande</p>
            </div>
            <div style="background: #ffffff; border-radius: 0 0 24px 24px; padding: 40px;">
              <h2 style="color: #0f172a; font-size: 22px; margin: 0 0 20px;">Bonjour ${client.prenom} ${client.nom},</h2>
              <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                Nous confirmons la réception de votre demande d'opération. Voici le récapitulatif :
              </p>
              <div style="background: #f1f5f9; border-radius: 16px; padding: 24px; margin: 24px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="color: #64748b; font-size: 14px; padding: 8px 0;">Opération</td>
                    <td style="color: #0f172a; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0;">${opLabel}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; font-size: 14px; padding: 8px 0;">Montant</td>
                    <td style="color: #0f172a; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0;">${montantStr}</td>
                  </tr>
                  ${dmForm.motif ? `<tr><td style="color: #64748b; font-size: 14px; padding: 8px 0;">Motif</td><td style="color: #0f172a; font-size: 14px; text-align: right; padding: 8px 0;">${dmForm.motif}</td></tr>` : ""}
                  <tr>
                    <td style="color: #64748b; font-size: 14px; padding: 8px 0;">Statut</td>
                    <td style="text-align: right; padding: 8px 0;"><span style="background: #fef9c3; color: #854d0e; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 999px;">En attente</span></td>
                  </tr>
                </table>
              </div>
              <p style="color: #475569; font-size: 14px; line-height: 1.6;">
                Votre demande sera traitée par votre administrateur dans les meilleurs délais. Vous serez notifié(e) de toute mise à jour.
              </p>
              <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
                <p style="color: #94a3b8; font-size: 12px; margin: 8px 0 0;">© ClearBank Limited ${new Date().getFullYear()}</p>
              </div>
            </div>
          </div>
        `;
        await base44.integrations.Core.SendEmail({
          to: client.mail,
          subject: `Confirmation de votre demande — ${opLabel}`,
          body: emailBody,
        });
      } catch (emailErr) {
        // Email failure should not block the operation
        console.error("Email sending failed:", emailErr);
      }
    } catch (err) {
      setError("Erreur lors de l'envoi de la demande: " + (err.message || err));
    }
    setActionLoading(false);
  };

  const selectSection = (id) => {
    setActiveSection(id);
    setMobileNavOpen(false);
  };

  const computeSolde = () =>
    transactions.reduce((sum, tx) => sum + (tx.montant || 0), 0);

  const meta = sectionMeta[activeSection];

  return (
    <div className="min-h-screen bg-slate-50">
      <main>
        <div className="w-full mx-auto flex">
          <ClientSidebar active={activeSection} onSelect={selectSection} />

          {/* Mobile nav toggle */}
          <div className="lg:hidden fixed bottom-4 right-4 z-40">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="w-12 h-12 rounded-full bg-teal text-black shadow-lg flex items-center justify-center"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile nav drawer */}
          {mobileNavOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileNavOpen(false)}>
              <div className="absolute right-0 top-0 bottom-0 w-64 bg-white p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <ul className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => selectSection(item.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                            activeSection === item.id ? "bg-teal/10 text-teal-dark" : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}

          <div className="flex-1 px-5 lg:px-8 py-6 md:py-8 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-teal-dark rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="max-w-[600px] mx-auto text-center py-20">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Espace client</h1>
                <p className="text-lg text-gray-600 mb-8">{error}</p>
                <Link to="/" className="inline-flex items-center bg-black text-white rounded-full px-6 py-3 text-lg hover:bg-teal-dark transition">
                  Retour à l'accueil <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            ) : client ? (
              <>
                {/* Top bar */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-0.5">Bonjour,</p>
                    <h1 className="text-2xl md:text-3xl font-bold">
                      {client.prenom} {client.nom}
                    </h1>
                  </div>
                  <div className="hidden md:flex items-center gap-2">
                    <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-teal-dark transition relative">
                      <Bell className="w-5 h-5 text-gray-600" />
                      <span className="absolute top-2 right-2 w-2 h-2 bg-teal-dark rounded-full"></span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-600 hover:border-red-400 hover:text-red-600 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                  </div>
                )}
                {actionSuccess && (
                  <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {actionSuccess}
                  </div>
                )}

                {/* ACCUEIL */}
                {activeSection === "accueil" && (
                  <div className="space-y-6">
                    {/* Hero balance card */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-teal/10 rounded-full -mr-20 -mt-20 blur-2xl"></div>
                      <div className="relative">
                        <p className="text-sm text-slate-300 mb-1">Solde du compte</p>
                        <p className="text-3xl md:text-4xl font-bold mb-4">{computeSolde().toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400">N° de compte:</span>
                            <span className="font-medium">{client.numero_de_compte || "—"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-500">Transactions</p>
                          <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center">
                            <ArrowLeftRight className="w-4 h-4 text-teal-dark" />
                          </div>
                        </div>
                        <p className="text-2xl font-bold">{transactions.length}</p>
                      </div>
                      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-500">Demandes en cours</p>
                          <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
                            <Bell className="w-4 h-4 text-yellow-600" />
                          </div>
                        </div>
                        <p className="text-2xl font-bold">{demandes.filter((d) => d.statut === "en_attente").length}</p>
                      </div>
                      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-500">Dernière connexion</p>
                          <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-teal-dark" />
                          </div>
                        </div>
                        <p className="text-sm font-bold mt-1">
                          {client.derniere_connexion ? new Date(client.derniere_connexion).toLocaleDateString("fr-FR") : "Aujourd'hui"}
                        </p>
                      </div>
                    </div>

                    {/* Recent transactions */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold">Dernières transactions</h2>
                        <button onClick={() => selectSection("paiement")} className="text-sm text-teal-dark hover:underline flex items-center gap-1">
                          Tout voir <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                      {transactions.length === 0 ? (
                        <p className="text-gray-400 text-center py-6 text-sm">Aucune transaction pour le moment.</p>
                      ) : (
                        <div className="space-y-1">
                          {transactions.slice(0, 5).map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between py-3 hover:bg-gray-50 rounded-xl px-2 transition">
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${tx.montant >= 0 ? "bg-green-50" : "bg-red-50"}`}>
                                  {tx.montant >= 0 ? <ArrowDownLeft className="w-4 h-4 text-green-600" /> : <ArrowUpRight className="w-4 h-4 text-red-600" />}
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{tx.transaction}</p>
                                  <p className="text-xs text-gray-400">{tx.date ? new Date(tx.date).toLocaleDateString("fr-FR") : "—"}</p>
                                </div>
                              </div>
                              <span className={`text-sm font-semibold ${tx.montant >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {tx.montant >= 0 ? "+" : ""}{tx.montant?.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* COMPTE */}
                {activeSection === "compte" && (
                  <div className="space-y-6">
                    <SectionHeader meta={meta} />

                    {/* Profile header card */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-teal/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                      <div className="relative flex items-center gap-5">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-teal/20 flex items-center justify-center text-2xl md:text-3xl font-bold text-teal shrink-0">
                          {(client.prenom?.[0] || "")}{(client.nom?.[0] || "")}
                        </div>
                        <div>
                          <h2 className="text-xl md:text-2xl font-bold">{client.prenom} {client.nom}</h2>
                          <p className="text-sm text-slate-300">{client.mail}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="inline-flex items-center gap-1 text-xs bg-white/10 px-2.5 py-1 rounded-full">
                              <ShieldCheck className="w-3 h-3 text-teal" />
                              Compte vérifié
                            </span>
                            <span className="text-xs text-slate-400">
                              {client.derniere_connexion
                                ? `Connecté le ${new Date(client.derniere_connexion).toLocaleDateString("fr-FR")}`
                                : "Première connexion"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Informations personnelles */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                      <div className="flex items-center gap-2 mb-5">
                        <User className="w-5 h-5 text-teal-dark" />
                        <h2 className="text-lg font-bold text-gray-800">Informations personnelles</h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                        <InfoRow label="Nom" value={client.nom} />
                        <InfoRow label="Prénom" value={client.prenom} />
                        <InfoRow label="Email" value={client.mail} />
                        <InfoRow
                          label="Dernière connexion"
                          value={
                            client.derniere_connexion
                              ? new Date(client.derniere_connexion).toLocaleString("fr-FR")
                              : "Première connexion"
                          }
                        />
                      </div>
                    </div>

                    {/* Coordonnées bancaires */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                      <div className="flex items-center gap-2 mb-5">
                        <CreditCard className="w-5 h-5 text-teal-dark" />
                        <h2 className="text-lg font-bold text-gray-800">Coordonnées bancaires</h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                        <InfoRow label="IBAN" value={client.iban} />
                        <InfoRow label="Numéro de compte" value={client.numero_de_compte} />
                      </div>
                    </div>

                    {/* Dossier séquestre */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                      <div className="flex items-center gap-2 mb-5">
                        <ShieldCheck className="w-5 h-5 text-teal-dark" />
                        <h2 className="text-lg font-bold text-gray-800">Dossier séquestre</h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
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
                      </div>
                      {client.remarque && (
                        <div className="mt-5 p-4 rounded-2xl bg-teal/5 border border-teal/20">
                          <p className="text-sm font-semibold mb-1 text-teal-dark">Remarque de l'administrateur</p>
                          <p className="text-sm text-gray-700">{client.remarque}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* VIREMENT */}
                {activeSection === "virement" && (
                  <div>
                    <SectionHeader meta={meta} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <button
                        onClick={() => { setShowModal("liberation_fournisseur"); setActionSuccess(""); }}
                        className="group flex flex-col items-center text-center bg-white border border-gray-200 rounded-2xl p-8 hover:border-teal-dark hover:shadow-lg transition-all"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-teal/10 flex items-center justify-center mb-4 group-hover:bg-teal group-hover:text-white transition">
                          <ArrowUpRight className="w-7 h-7 text-teal-dark group-hover:text-white" />
                        </div>
                        <span className="text-sm font-semibold">Libérer le montant du compte séquestre vers le fournisseur</span>
                      </button>
                      <button
                        onClick={() => { setShowModal("recuperation_compte_courant"); setActionSuccess(""); }}
                        className="group flex flex-col items-center text-center bg-white border border-gray-200 rounded-2xl p-8 hover:border-teal-dark hover:shadow-lg transition-all"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-teal/10 flex items-center justify-center mb-4 group-hover:bg-teal group-hover:text-white transition">
                          <ArrowDownLeft className="w-7 h-7 text-teal-dark group-hover:text-white" />
                        </div>
                        <span className="text-sm font-semibold">Demander la récupération du montant séquestre vers le compte courant</span>
                      </button>
                    </div>

                    {demandes.length > 0 && (
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold mb-4">Mes demandes</h3>
                        <div className="space-y-2">
                          {demandes.map((dm) => {
                            const label =
                              dm.type === "liberation_fournisseur"
                                ? "Libération vers fournisseur"
                                : "Récupération vers compte courant";
                            const statutColor =
                              dm.statut === "approuve"
                                ? "bg-green-50 text-green-700"
                                : dm.statut === "refuse"
                                ? "bg-red-50 text-red-700"
                                : "bg-yellow-50 text-yellow-700";
                            return (
                              <div key={dm.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-b-0">
                                <div>
                                  <p className="text-sm font-medium">{label}</p>
                                  {dm.montant != null && (
                                    <p className="text-sm text-gray-500 mt-0.5">
                                      {dm.montant.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                                    </p>
                                  )}
                                  {dm.motif && <p className="text-xs text-gray-400 mt-0.5 italic">{dm.motif}</p>}
                                  <p className="text-xs text-gray-300 mt-0.5">
                                    {dm.date_demande ? new Date(dm.date_demande).toLocaleDateString("fr-FR") : ""}
                                  </p>
                                </div>
                                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statutColor}`}>
                                  {dm.statut === "en_attente" ? "En attente" : dm.statut === "approuve" ? "Approuvée" : "Refusée"}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TRANSACTIONS */}
                {activeSection === "transactions" && (
                  <div>
                    <SectionHeader meta={meta} />

                    {/* Summary cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Solde total</p>
                        <p className="text-2xl font-bold text-slate-900">{computeSolde().toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</p>
                      </div>
                      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm text-gray-500">Entrées</p>
                          <ArrowDownLeft className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-2xl font-bold text-green-600">
                          {transactions.filter(t => t.montant >= 0).reduce((s, t) => s + (t.montant || 0), 0).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                        </p>
                      </div>
                      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm text-gray-500">Sorties</p>
                          <ArrowUpRight className="w-4 h-4 text-red-600" />
                        </div>
                        <p className="text-2xl font-bold text-red-600">
                          {Math.abs(transactions.filter(t => t.montant < 0).reduce((s, t) => s + (t.montant || 0), 0)).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                        </p>
                      </div>
                    </div>

                    {/* Search and filter */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <h2 className="text-lg font-bold">Historique des transactions</h2>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Rechercher une transaction..."
                            value={txSearch}
                            onChange={(e) => setTxSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-teal-dark w-full sm:w-64"
                          />
                        </div>
                      </div>

                      {transactions.length === 0 ? (
                        <p className="text-gray-400 text-center py-8 text-sm">Aucune transaction pour le moment.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-100 text-left">
                                <th className="pb-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Opération</th>
                                <th className="pb-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="pb-3 text-xs font-medium text-gray-400 uppercase tracking-wider text-right">Montant</th>
                              </tr>
                            </thead>
                            <tbody>
                              {transactions
                                .filter((tx) =>
                                  !txSearch ||
                                  tx.transaction?.toLowerCase().includes(txSearch.toLowerCase())
                                )
                                .map((tx) => (
                                  <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                    <td className="py-4">
                                      <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${tx.montant >= 0 ? "bg-green-50" : "bg-red-50"}`}>
                                          {tx.montant >= 0 ? <ArrowDownLeft className="w-4 h-4 text-green-600" /> : <ArrowUpRight className="w-4 h-4 text-red-600" />}
                                        </div>
                                        <span className="text-sm font-medium text-gray-800">{tx.transaction}</span>
                                      </div>
                                    </td>
                                    <td className="py-4 text-sm text-gray-500">
                                      {tx.date ? new Date(tx.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : "—"}
                                    </td>
                                    <td className={`py-4 text-sm font-semibold text-right ${tx.montant >= 0 ? "text-green-600" : "text-red-600"}`}>
                                      {tx.montant >= 0 ? "+" : ""}{tx.montant?.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* PAIEMENT */}
                {activeSection === "paiement" && (
                  <div>
                    <SectionHeader meta={meta} />
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold">Historique des transactions</h2>
                        <span className="text-sm text-gray-400">{transactions.length} transaction(s)</span>
                      </div>
                      {transactions.length === 0 ? (
                        <p className="text-gray-400 text-center py-8 text-sm">Aucune transaction pour le moment.</p>
                      ) : (
                        <div className="space-y-1">
                          {transactions.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between py-3 hover:bg-gray-50 rounded-xl px-2 transition">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.montant >= 0 ? "bg-green-50" : "bg-red-50"}`}>
                                  {tx.montant >= 0 ? <ArrowDownLeft className="w-5 h-5 text-green-600" /> : <ArrowUpRight className="w-5 h-5 text-red-600" />}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-black">{tx.transaction}</p>
                                  <p className="text-xs text-gray-400">
                                    {tx.date ? new Date(tx.date).toLocaleDateString("fr-FR") : "—"}
                                  </p>
                                </div>
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
                )}

                {/* CARTE */}
                {activeSection === "carte" && (
                  <PlaceholderSection title="Carte bancaire" desc="Gérez vos cartes bancaires et leurs limites. Cette section sera disponible prochainement." icon={Wallet} />
                )}

                {/* EPARGNE */}
                {activeSection === "epargne" && (
                  <PlaceholderSection title="Épargne" desc="Consultez et gérez vos produits d'épargne. Cette section sera disponible prochainement." icon={PiggyBank} />
                )}

                {/* ASSURANCE */}
                {activeSection === "assurance" && (
                  <PlaceholderSection title="Assurance" desc="Découvrez nos offres d'assurance. Cette section sera disponible prochainement." icon={ShieldCheck} />
                )}

                {/* BOURSE */}
                {activeSection === "bourse" && (
                  <PlaceholderSection title="Bourse" desc="Suivez vos investissements et opérez sur les marchés. Cette section sera disponible prochainement." icon={TrendingUp} />
                )}

                {/* DOCUMENT */}
                {activeSection === "document" && (
                  <div>
                    <SectionHeader meta={meta} />
                    {client.contrat_pdf ? (
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-teal/10 flex items-center justify-center">
                              <FileText className="w-7 h-7 text-teal-dark" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">Contrat</h3>
                              <p className="text-sm text-gray-500">Document PDF disponible</p>
                            </div>
                          </div>
                          <a
                            href={client.contrat_pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-teal text-black rounded-full px-5 py-2.5 text-sm font-medium hover:bg-teal-dark hover:text-white transition"
                          >
                            <Download className="w-4 h-4" />
                            Télécharger
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                          <FileText className="w-8 h-8 text-gray-300" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Aucun document</h2>
                        <p className="text-gray-500">Aucun document disponible pour le moment.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Déconnexion mobile */}
                <button
                  onClick={handleLogout}
                  className="md:hidden w-full inline-flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-3 text-sm font-medium text-gray-600 hover:border-red-400 hover:text-red-600 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>

                {/* Help banner */}
                <div className="mt-8 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6 text-teal" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Besoin d'aide ?</h3>
                      <p className="text-sm text-slate-300">Pour toute question, contactez votre administrateur ClearBank.</p>
                    </div>
                  </div>
                  <Link
                    to="/about/contact-us"
                    className="inline-flex items-center bg-teal text-black rounded-full px-5 py-2.5 text-sm font-medium hover:bg-white transition whitespace-nowrap"
                  >
                    Nous contacter <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </main>

      {/* Modal for demande */}
      {showModal && client && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowModal(null)}>
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-2">
              {showModal === "liberation_fournisseur"
                ? "Libération vers le fournisseur"
                : "Récupération vers le compte courant"}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {showModal === "liberation_fournisseur"
                ? "Demandez la libération du montant du compte séquestre vers le compte du fournisseur."
                : "Demandez la récupération du montant séquestre vers votre compte courant."}
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Montant (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={dmForm.montant}
                  onChange={(e) => setDmForm({ ...dmForm, montant: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-teal-dark"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Motif / Note</label>
                <textarea
                  rows={3}
                  value={dmForm.motif}
                  onChange={(e) => setDmForm({ ...dmForm, motif: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-teal-dark"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(null)}
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-50 transition"
              >
                Annuler
              </button>
              <button
                onClick={() => submitDemande(showModal)}
                disabled={actionLoading}
                className="flex-1 bg-teal text-black rounded-full px-4 py-2 text-sm font-medium hover:bg-teal-dark hover:text-white transition disabled:opacity-50"
              >
                {actionLoading ? "Envoi..." : "Envoyer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}