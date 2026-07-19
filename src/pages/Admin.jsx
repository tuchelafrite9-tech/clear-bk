import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import Header from "@/components/clearbank/Header";
import Footer from "@/components/clearbank/Footer";
import { ShieldCheck, LogOut } from "lucide-react";

const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="13" fill="none" className="inline-block ml-2">
    <path d="M15.597 6.78a.9.9 0 0 0-.28-.648L10.182.999C9.98.804 9.77.718 9.55.718c-.5 0-.859.351-.859.828 0 .25.102.46.258.617l1.758 1.781 2.265 2.07-1.812-.109H1.69c-.523 0-.883.36-.883.875 0 .508.36.867.883.867h9.469l1.812-.109-2.265 2.07-1.758 1.782a.86.86 0 0 0-.258.617c0 .476.36.828.86.828a.88.88 0 0 0 .617-.266l5.148-5.148a.896.896 0 0 0 .281-.64Z" fill="currentColor" />
  </svg>
);

const emptyForm = {
  nom: "",
  prenom: "",
  mail: "",
  iban: "",
  numero_de_compte: "",
  numero_de_compte_sequestre: "",
  reference_dossier_sequestre: "",
  date_liberation_comite_sequestre: "",
  remarque: "",
};

export default function Admin() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [txForm, setTxForm] = useState({ client_id: "", montant: "", transaction: "", date: "" });
  const [txLoading, setTxLoading] = useState(false);
  const [demandes, setDemandes] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [demandesOuverture, setDemandesOuverture] = useState([]);
  const [uploadingFor, setUploadingFor] = useState(null);
  const [activeTab, setActiveTab] = useState("ouverture");
  const [generatedCode, setGeneratedCode] = useState(null);
  const [codeLoading, setCodeLoading] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const me = await base44.auth.me();
        setUser(me);
        if (me.role !== "admin") {
          setError("Accès refusé. Vous devez être administrateur.");
          setAuthChecked(true);
          return;
        }
        await loadClients();
      } catch (e) {
        setError("Vous devez être connecté en tant qu'administrateur.");
      }
      setAuthChecked(true);
    };
    checkAuth();

    // Real-time subscription for new demandes
    const unsubscribeDemandes = base44.entities.Demande.subscribe((event) => {
      if (event.type === "create") {
        setDemandes((prev) => [event.data, ...prev]);
      } else if (event.type === "update") {
        setDemandes((prev) => prev.map((d) => (d.id === event.data.id ? event.data : d)));
      } else if (event.type === "delete") {
        setDemandes((prev) => prev.filter((d) => d.id !== event.data.id));
      }
    });
    // Real-time subscription for new contact messages
    const unsubscribeContacts = base44.entities.Contact.subscribe((event) => {
      if (event.type === "create") {
        setContacts((prev) => [event.data, ...prev]);
      } else if (event.type === "update") {
        setContacts((prev) => prev.map((c) => (c.id === event.data.id ? event.data : c)));
      } else if (event.type === "delete") {
        setContacts((prev) => prev.filter((c) => c.id !== event.data.id));
      }
    });
    // Real-time subscription for account opening requests
    const unsubscribeDemandesOuverture = base44.entities.DemandeOuverture.subscribe((event) => {
      if (event.type === "create") {
        setDemandesOuverture((prev) => [event.data, ...prev]);
      } else if (event.type === "update") {
        setDemandesOuverture((prev) => prev.map((d) => (d.id === event.data.id ? event.data : d)));
      } else if (event.type === "delete") {
        setDemandesOuverture((prev) => prev.filter((d) => d.id !== event.data.id));
      }
    });
    return () => {
      if (unsubscribeDemandes) unsubscribeDemandes();
      if (unsubscribeContacts) unsubscribeContacts();
      if (unsubscribeDemandesOuverture) unsubscribeDemandesOuverture();
    };
  }, []);

  const loadClients = async () => {
    try {
      const list = await base44.entities.Client.list("-created_date", 200);
      setClients(list);
      try {
        const dms = await base44.entities.Demande.list("-created_date", 200);
        setDemandes(dms || []);
      } catch (e2) {
        setDemandes([]);
      }
      try {
        const dso = await base44.entities.DemandeOuverture.list("-created_date", 200);
        setDemandesOuverture(dso || []);
      } catch (e2b) {
        setDemandesOuverture([]);
      }
      try {
        const msgs = await base44.entities.Contact.list("-created_date", 200);
        setContacts(msgs || []);
      } catch (e3) {
        setContacts([]);
      }
    } catch (e) {
      setError("Erreur lors du chargement des clients: " + (e.message || e));
    }
  };

  const handleGenerateCode = async (clientEmail) => {
    setCodeLoading(clientEmail);
    setError("");
    setSuccess("");
    setGeneratedCode(null);
    try {
      const res = await base44.functions.invoke("GenerateLoginCode", { client_email: clientEmail });
      setGeneratedCode({ email: clientEmail, code: res.data.code });
      setSuccess(`Code à usage unique généré pour ${clientEmail}.`);
    } catch (err) {
      setError("Erreur lors de la génération du code: " + (err?.response?.data?.error || err.message || err));
    }
    setCodeLoading(null);
  };

  const handleUploadContrat = async (clientId, file) => {
    setUploadingFor(clientId);
    setError("");
    setSuccess("");
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.entities.Client.update(clientId, { contrat_pdf: file_url });
      setSuccess("Contrat PDF mis en ligne avec succès.");
      await loadClients();
    } catch (err) {
      setError("Erreur lors de l'upload du contrat: " + (err.message || err));
    }
    setUploadingFor(null);
  };

  const handleDemandeStatut = async (demandeId, nouveauStatut) => {
    try {
      await base44.entities.Demande.update(demandeId, { statut: nouveauStatut });
      await loadClients();
    } catch (err) {
      setError("Erreur lors de la mise à jour de la demande: " + (err.message || err));
    }
  };

  const handleContactStatut = async (contactId, nouveauStatut) => {
    try {
      await base44.entities.Contact.update(contactId, { statut: nouveauStatut });
    } catch (err) {
      setError("Erreur lors de la mise à jour du message: " + (err.message || err));
    }
  };

  const handleDemandeOuverture = async (demandeId, action) => {
    setError("");
    setSuccess("");
    try {
      const dm = demandesOuverture.find((d) => d.id === demandeId);
      if (!dm) return;

      if (action === "approuve") {
        // Check if a Client record already exists for this email
        const existing = clients.filter((c) => c.mail === dm.mail);
        if (existing.length === 0) {
          await base44.entities.Client.create({
            nom: dm.nom,
            prenom: dm.prenom,
            mail: dm.mail,
            iban: dm.iban || "",
            numero_de_compte: "",
            numero_de_compte_sequestre: "",
            reference_dossier_sequestre: "",
            date_liberation_comite_sequestre: "",
            remarque: dm.motif || "",
            derniere_connexion: null,
          });
          setSuccess(`Compte client créé pour ${dm.prenom} ${dm.nom}. Générez un code à usage unique pour lui envoyer ses identifiants.`);
        } else {
          setSuccess(`Le client ${dm.prenom} ${dm.nom} existe déjà.`);
        }
      }

      await base44.entities.DemandeOuverture.update(demandeId, { statut: action });
      await loadClients();
    } catch (err) {
      setError("Erreur lors du traitement de la demande: " + (err.message || err));
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTxChange = (e) => {
    setTxForm({ ...txForm, [e.target.name]: e.target.value });
  };

  const handleTxSubmit = async (e) => {
    e.preventDefault();
    setTxLoading(true);
    setError("");
    setSuccess("");

    if (!txForm.client_id || !txForm.montant || !txForm.transaction || !txForm.date) {
      setError("Tous les champs de la transaction sont obligatoires.");
      setTxLoading(false);
      return;
    }

    const selectedClient = clients.find((c) => c.id === txForm.client_id);
    if (!selectedClient) {
      setError("Client introuvable.");
      setTxLoading(false);
      return;
    }

    try {
      await base44.entities.Transaction.create({
        montant: parseFloat(txForm.montant),
        transaction: txForm.transaction,
        date: txForm.date,
        client_id: txForm.client_id,
        client_email: selectedClient.mail,
      });
      setSuccess(`Transaction ajoutée pour ${selectedClient.prenom} ${selectedClient.nom}.`);
      setTxForm({ client_id: "", montant: "", transaction: "", date: "" });
    } catch (err) {
      setError("Erreur lors de la création de la transaction: " + (err.message || err));
    }
    setTxLoading(false);
  };

  const handleAdminLogout = async () => {
    try {
      await base44.auth.logout();
    } catch (e) {
      // ignore
    }
    window.location.href = "/admin-login";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!form.nom || !form.prenom || !form.mail) {
      setError("Le nom, le prénom et l'email sont obligatoires.");
      setLoading(false);
      return;
    }

    try {
      await base44.entities.Client.create({
        ...form,
        derniere_connexion: null,
      });

      try {
        await base44.users.inviteUser(form.mail, "user");
        setSuccess(`Client ${form.prenom} ${form.nom} créé et invitation envoyée à ${form.mail}.`);
      } catch (inviteErr) {
        setSuccess(`Client ${form.prenom} ${form.nom} créé. L'invitation n'a pas pu être envoyée (l'utilisateur existe peut-être déjà).`);
      }

      setForm(emptyForm);
      await loadClients();
    } catch (err) {
      setError("Erreur lors de la création du client: " + (err.message || err));
    }
    setLoading(false);
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-teal-dark rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user && user.role !== "admin") {
    window.location.href = "/admin-login";
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-teal-dark rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-[60px] pb-20">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-8">
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-teal" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold">Administration</h1>
              </div>
              <p className="text-lg md:text-xl text-gray-600">Gérez vos clients et créez de nouveaux comptes.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleAdminLogout}
                className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-600 hover:border-red-400 hover:text-red-600 transition"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
              {demandesOuverture.filter((d) => d.statut === "en_attente").length > 0 && (
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium text-blue-700">
                    {demandesOuverture.filter((d) => d.statut === "en_attente").length} demande(s) d'ouverture
                  </span>
                </div>
              )}
              {demandes.filter((d) => d.statut === "en_attente").length > 0 && (
                <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium text-yellow-700">
                    {demandes.filter((d) => d.statut === "en_attente").length} demande(s) en attente
                  </span>
                </div>
              )}
              {contacts.filter((c) => c.statut === "nouveau").length > 0 && (
                <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal-dark rounded-full px-4 py-2">
                  <span className="w-2 h-2 bg-teal-dark rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium text-teal-dark">
                    {contacts.filter((c) => c.statut === "nouveau").length} nouveau(s) message(s)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8 border-b border-gray-200 overflow-x-auto">
            <nav className="flex gap-1 -mb-px min-w-max">
              <button
                onClick={() => setActiveTab("ouverture")}
                className={`px-5 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === "ouverture"
                    ? "border-teal-dark text-teal-dark"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Demandes d'ouverture
                {demandesOuverture.filter((d) => d.statut === "en_attente").length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-blue-500 text-white rounded-full">
                    {demandesOuverture.filter((d) => d.statut === "en_attente").length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("clients")}
                className={`px-5 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === "clients"
                    ? "border-teal-dark text-teal-dark"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Clients ({clients.length})
              </button>
              <button
                onClick={() => setActiveTab("demandes")}
                className={`px-5 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === "demandes"
                    ? "border-teal-dark text-teal-dark"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Demandes clients ({demandes.length})
              </button>
              <button
                onClick={() => setActiveTab("codes")}
                className={`px-5 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === "codes"
                    ? "border-teal-dark text-teal-dark"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Codes de connexion
              </button>
              <button
                onClick={() => setActiveTab("messages")}
                className={`px-5 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === "messages"
                    ? "border-teal-dark text-teal-dark"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Messages ({contacts.length})
              </button>
            </nav>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 text-sm">
              {success}
            </div>
          )}

          {activeTab === "clients" && (
          <div className="grid grid-cols-12 gap-x-6 md:gap-x-14">
            {/* Form Section */}
            <div className="col-span-12 lg:col-span-5 mb-12 lg:mb-0">
              <div className="bg-gray-50 rounded-3xl p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Nouveau client</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Nom *</label>
                      <input
                        type="text"
                        name="nom"
                        value={form.nom}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-teal-dark"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Prénom *</label>
                      <input
                        type="text"
                        name="prenom"
                        value={form.prenom}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-teal-dark"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <input
                      type="email"
                      name="mail"
                      value={form.mail}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-teal-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">IBAN</label>
                    <input
                      type="text"
                      name="iban"
                      value={form.iban}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-teal-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Numéro de compte</label>
                    <input
                      type="text"
                      name="numero_de_compte"
                      value={form.numero_de_compte}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-teal-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Numéro de compte séquestre</label>
                    <input
                      type="text"
                      name="numero_de_compte_sequestre"
                      value={form.numero_de_compte_sequestre}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-teal-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Référence du dossier séquestre</label>
                    <input
                      type="text"
                      name="reference_dossier_sequestre"
                      value={form.reference_dossier_sequestre}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-teal-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date de libération du comité séquestre</label>
                    <input
                      type="date"
                      name="date_liberation_comite_sequestre"
                      value={form.date_liberation_comite_sequestre}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-teal-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Remarque</label>
                    <textarea
                      name="remarque"
                      value={form.remarque}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-teal-dark"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center bg-teal text-black rounded-full px-6 py-3 text-lg font-medium hover:bg-teal-dark hover:text-white transition disabled:opacity-50"
                  >
                    {loading ? "Création..." : "Créer le client"}
                  </button>
                </form>
              </div>

              {/* Transaction Form */}
              <div className="bg-gray-50 rounded-3xl p-6 md:p-8 mt-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Nouvelle transaction</h2>
                <form onSubmit={handleTxSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Client *</label>
                    <select
                      name="client_id"
                      value={txForm.client_id}
                      onChange={handleTxChange}
                      required
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-teal-dark bg-white"
                    >
                      <option value="">Sélectionner un client</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.prenom} {c.nom} — {c.mail}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Montant (€) *</label>
                      <input
                        type="number"
                        step="0.01"
                        name="montant"
                        value={txForm.montant}
                        onChange={handleTxChange}
                        required
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-teal-dark"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Date *</label>
                      <input
                        type="date"
                        name="date"
                        value={txForm.date}
                        onChange={handleTxChange}
                        required
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-teal-dark"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Transaction (description) *</label>
                    <input
                      type="text"
                      name="transaction"
                      value={txForm.transaction}
                      onChange={handleTxChange}
                      required
                      placeholder="Ex: Virement reçu, Paiement fournisseur..."
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-teal-dark"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={txLoading}
                    className="w-full inline-flex items-center justify-center bg-black text-white rounded-full px-6 py-3 text-lg font-medium hover:bg-teal-dark transition disabled:opacity-50"
                  >
                    {txLoading ? "Ajout..." : "Ajouter la transaction"}
                  </button>
                </form>
              </div>
            </div>

            {/* Clients List Section */}
            <div className="col-span-12 lg:col-span-7">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Clients ({clients.length})
              </h2>
              {clients.length === 0 ? (
                <div className="bg-gray-50 rounded-3xl p-8 text-center text-gray-500">
                  Aucun client pour le moment. Créez votre premier client avec le formulaire.
                </div>
              ) : (
                <div className="space-y-3">
                  {clients.map((client) => (
                    <div key={client.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-teal-dark transition">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {client.prenom} {client.nom}
                          </h3>
                          <p className="text-sm text-gray-500">{client.mail}</p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {client.derniere_connexion
                            ? `Dernière connexion: ${new Date(client.derniere_connexion).toLocaleDateString("fr-FR")}`
                            : "Jamais connecté"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-3">
                        {client.iban && <div><span className="font-medium">IBAN:</span> {client.iban}</div>}
                        {client.numero_de_compte && <div><span className="font-medium">N° compte:</span> {client.numero_de_compte}</div>}
                        {client.numero_de_compte_sequestre && <div><span className="font-medium">N° séquestre:</span> {client.numero_de_compte_sequestre}</div>}
                        {client.reference_dossier_sequestre && <div><span className="font-medium">Réf. dossier:</span> {client.reference_dossier_sequestre}</div>}
                      </div>
                      {client.remarque && (
                        <p className="text-sm text-gray-500 mt-2 italic">{client.remarque}</p>
                      )}
                      <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => handleGenerateCode(client.mail)}
                          disabled={codeLoading === client.mail}
                          className="inline-flex items-center gap-2 bg-slate-900 text-white rounded-full px-4 py-2 text-xs font-medium hover:bg-teal-dark transition disabled:opacity-50"
                        >
                          {codeLoading === client.mail ? "Génération..." : "Générer un code à usage unique"}
                        </button>
                        {generatedCode && generatedCode.email === client.mail && (
                          <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal-dark rounded-full px-4 py-2">
                            <span className="text-xs text-gray-600">Code :</span>
                            <span className="text-sm font-bold text-teal-dark tracking-widest">{generatedCode.code}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <label className="block text-sm font-medium mb-1">Contrat PDF</label>
                        {client.contrat_pdf ? (
                          <div className="flex items-center gap-2">
                            <a
                              href={client.contrat_pdf}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-teal-dark underline"
                            >
                              Voir le contrat
                            </a>
                            <label className="cursor-pointer text-xs text-gray-500 hover:text-black underline">
                              Remplacer
                              <input
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={(e) => e.target.files[0] && handleUploadContrat(client.id, e.target.files[0])}
                              />
                            </label>
                          </div>
                        ) : (
                          <label className="cursor-pointer inline-flex items-center text-sm bg-black text-white rounded-full px-4 py-2 hover:bg-teal-dark transition">
                            {uploadingFor === client.id ? "Upload..." : "Téléverser le PDF"}
                            <input
                              type="file"
                              accept="application/pdf"
                              className="hidden"
                              onChange={(e) => e.target.files[0] && handleUploadContrat(client.id, e.target.files[0])}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          )}

          {/* Demandes d'ouverture de compte Section */}
          {activeTab === "ouverture" && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">
                  Demandes d'ouverture de compte ({demandesOuverture.length})
                </h2>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></span>
                    {demandesOuverture.filter((d) => d.statut === "en_attente").length} en attente
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                    {demandesOuverture.filter((d) => d.statut === "approuve").length} approuvées
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                    {demandesOuverture.filter((d) => d.statut === "refuse").length} refusées
                  </span>
                </div>
              </div>
              {demandesOuverture.length === 0 ? (
                <div className="bg-gray-50 rounded-3xl p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">Aucune demande d'ouverture</h3>
                  <p className="text-sm text-gray-500">Les nouvelles demandes de création de compte apparaîtront ici.</p>
                </div>
              ) : (
              <div className="space-y-3">
                {demandesOuverture.map((dm) => {
                  const statutColor =
                    dm.statut === "approuve"
                      ? "bg-green-100 text-green-700"
                      : dm.statut === "refuse"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700";
                  return (
                    <div key={dm.id} className="bg-white border border-gray-200 rounded-2xl p-5">
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {dm.prenom} {dm.nom}
                          </h3>
                          <p className="text-sm text-gray-500">{dm.mail}</p>
                          {dm.telephone && <p className="text-sm text-gray-600 mt-0.5">Tél: {dm.telephone}</p>}
                          {dm.iban && <p className="text-sm text-gray-600 mt-0.5">IBAN: {dm.iban}</p>}
                          {dm.motif && <p className="text-sm text-gray-600 mt-1 italic">{dm.motif}</p>}
                          <p className="text-xs text-gray-400 mt-1">
                            {dm.date_demande ? new Date(dm.date_demande).toLocaleString("fr-FR") : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-3 py-1 rounded-full ${statutColor}`}>
                            {dm.statut === "en_attente" ? "En attente" : dm.statut === "approuve" ? "Approuvée" : "Refusée"}
                          </span>
                          {dm.statut === "en_attente" && (
                            <>
                              <button
                                onClick={() => handleDemandeOuverture(dm.id, "approuve")}
                                className="text-xs bg-green-600 text-white rounded-full px-3 py-1 hover:bg-green-700 transition"
                              >
                                Valider
                              </button>
                              <button
                                onClick={() => handleDemandeOuverture(dm.id, "refuse")}
                                className="text-xs bg-red-600 text-white rounded-full px-3 py-1 hover:bg-red-700 transition"
                              >
                                Refuser
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                </div>
                )}
                </div>
                )}

                {/* Codes de connexion Section */}
                {activeTab === "codes" && (
                <div className="mt-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Codes de connexion à usage unique
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                Générez un code temporaire pour un client. Le code est envoyé automatiquement par email avec l'en-tête ClearBank et est valable une seule connexion.
                </p>
              {clients.length === 0 ? (
                <div className="bg-gray-50 rounded-3xl p-12 text-center">
                  <p className="text-sm text-gray-500">Aucun client pour le moment.</p>
                </div>
              ) : (
              <div className="space-y-3">
                {clients.map((client) => (
                  <div key={client.id} className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {client.prenom} {client.nom}
                      </h3>
                      <p className="text-sm text-gray-500">{client.mail}</p>
                      {client.derniere_connexion && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          Dernière connexion: {new Date(client.derniere_connexion).toLocaleDateString("fr-FR")}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      {generatedCode && generatedCode.email === client.mail && (
                        <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal-dark rounded-full px-4 py-2">
                          <span className="text-xs text-gray-600">Code généré :</span>
                          <span className="text-sm font-bold text-teal-dark tracking-widest">{generatedCode.code}</span>
                        </div>
                      )}
                      <button
                        onClick={() => handleGenerateCode(client.mail)}
                        disabled={codeLoading === client.mail}
                        className="inline-flex items-center gap-2 bg-slate-900 text-white rounded-full px-5 py-2.5 text-sm font-medium hover:bg-teal-dark transition disabled:opacity-50"
                      >
                        {codeLoading === client.mail ? "Envoi en cours..." : "Envoyer le code"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>
          )}

                {/* Contact Messages Section */}
                {activeTab === "messages" && (
                <div className="mt-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Messages de contact ({contacts.length})
                </h2>
              {contacts.length === 0 ? (
                <div className="bg-gray-50 rounded-3xl p-12 text-center">
                  <p className="text-sm text-gray-500">Aucun message de contact pour le moment.</p>
                </div>
              ) : (
              <div className="space-y-3">
                {contacts.map((ct) => {
                  const statutColor =
                    ct.statut === "traite"
                      ? "bg-green-100 text-green-700"
                      : ct.statut === "lu"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-teal/10 text-teal-dark";
                  return (
                    <div key={ct.id} className={`bg-white border rounded-2xl p-5 ${ct.statut === "nouveau" ? "border-teal-dark" : "border-gray-200"}`}>
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {ct.prenom} {ct.nom}
                          </h3>
                          <p className="text-sm text-gray-500">{ct.email}</p>
                          {ct.entreprise && <p className="text-sm text-gray-600 mt-0.5">Entreprise: {ct.entreprise}</p>}
                          <p className="text-sm mt-2 text-gray-700">{ct.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {ct.created_date ? new Date(ct.created_date).toLocaleString("fr-FR") : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-3 py-1 rounded-full ${statutColor}`}>
                            {ct.statut === "nouveau" ? "Nouveau" : ct.statut === "lu" ? "Lu" : "Traité"}
                          </span>
                          {ct.statut === "nouveau" && (
                            <button
                              onClick={() => handleContactStatut(ct.id, "lu")}
                              className="text-xs bg-blue-600 text-white rounded-full px-3 py-1 hover:bg-blue-700 transition"
                            >
                              Marquer comme lu
                            </button>
                          )}
                          {ct.statut !== "traite" && (
                            <button
                              onClick={() => handleContactStatut(ct.id, "traite")}
                              className="text-xs bg-green-600 text-white rounded-full px-3 py-1 hover:bg-green-700 transition"
                            >
                              Traiter
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              )}
            </div>
          )}

          {/* Demandes Section */}
          {activeTab === "demandes" && (
            <div className="mt-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Demandes clients ({demandes.length})
              </h2>
              {demandes.length === 0 ? (
                <div className="bg-gray-50 rounded-3xl p-12 text-center">
                  <p className="text-sm text-gray-500">Aucune demande client pour le moment.</p>
                </div>
              ) : (
              <div className="space-y-3">
                {demandes.map((dm) => {
                  const cli = clients.find((c) => c.id === dm.client_id);
                  const label =
                    dm.type === "liberation_fournisseur"
                      ? "Libération vers fournisseur"
                      : "Récupération vers compte courant";
                  const statutColor =
                    dm.statut === "approuve"
                      ? "bg-green-100 text-green-700"
                      : dm.statut === "refuse"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700";
                  return (
                    <div key={dm.id} className="bg-white border border-gray-200 rounded-2xl p-5">
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {cli ? `${cli.prenom} ${cli.nom}` : "Client"}
                          </h3>
                          <p className="text-sm text-gray-500">{cli?.mail || dm.client_email}</p>
                          <p className="text-sm mt-1">
                            <span className="font-medium">{label}</span>
                            {dm.montant != null && (
                              <span className="ml-2 font-semibold">
                                {dm.montant.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                              </span>
                            )}
                          </p>
                          {dm.motif && <p className="text-sm text-gray-600 mt-1 italic">{dm.motif}</p>}
                          <p className="text-xs text-gray-400 mt-1">
                            {dm.date_demande ? new Date(dm.date_demande).toLocaleString("fr-FR") : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-3 py-1 rounded-full ${statutColor}`}>
                            {dm.statut === "en_attente" ? "En attente" : dm.statut === "approuve" ? "Approuvée" : "Refusée"}
                          </span>
                          {dm.statut === "en_attente" && (
                            <>
                              <button
                                onClick={() => handleDemandeStatut(dm.id, "approuve")}
                                className="text-xs bg-green-600 text-white rounded-full px-3 py-1 hover:bg-green-700 transition"
                              >
                                Approuver
                              </button>
                              <button
                                onClick={() => handleDemandeStatut(dm.id, "refuse")}
                                className="text-xs bg-red-600 text-white rounded-full px-3 py-1 hover:bg-red-700 transition"
                              >
                                Refuser
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}