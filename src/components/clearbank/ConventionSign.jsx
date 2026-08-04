import React, { useState, useRef } from "react";
import { appApi } from "@/api/appClient";
import { PenTool, CheckCircle2, FileText, Upload, Loader2, Download, X, ImageIcon } from "lucide-react";

export default function ConventionSign({ client, onUpdated }) {
  const conventionPdfUrl = client.contrat_pdf || "";
  const [accepted, setAccepted] = useState(client.signature_acceptee || false);
  const [signing, setSigning] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [docs, setDocs] = useState(client.documents_client || []);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleSign = async () => {
    if (!accepted) {
      setError("Veuillez cocher la case « J'accepte » pour signer la convention.");
      return;
    }
    setSigning(true);
    setError("");
    setSuccess("");
    try {
      const now = new Date().toISOString();
      await appApi.entities.Client.update(client.id, {
        signature_acceptee: true,
        date_signature: now,
      });
      setSuccess("Convention signée avec succès. Votre administrateur a été notifié.");
      if (onUpdated) onUpdated({ ...client, signature_acceptee: true, date_signature: now });
    } catch (err) {
      setError("Erreur lors de la signature: " + (err.message || err));
    }
    setSigning(false);
  };

  const handleUploadDoc = async (file) => {
    setUploading(true);
    setError("");
    setSuccess("");
    try {
      const { file_url } = await appApi.integrations.Core.UploadFile({ file });
      const updatedDocs = [...docs, file_url];
      await appApi.entities.Client.update(client.id, {
        documents_client: updatedDocs,
      });
      setDocs(updatedDocs);
      setSuccess("Document téléversé avec succès.");
      if (onUpdated) onUpdated({ ...client, documents_client: updatedDocs });
    } catch (err) {
      setError("Erreur lors du téléversement: " + (err.message || err));
    }
    setUploading(false);
  };

  const handleUploadMultiple = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    setSuccess("");
    try {
      const uploaded = [];
      for (const file of files) {
        const { file_url } = await appApi.integrations.Core.UploadFile({ file });
        uploaded.push(file_url);
      }
      const updatedDocs = [...docs, ...uploaded];
      await appApi.entities.Client.update(client.id, {
        documents_client: updatedDocs,
      });
      setDocs(updatedDocs);
      setSuccess(
        uploaded.length === 1
          ? "Document téléversé avec succès."
          : `${uploaded.length} documents téléversés avec succès.`
      );
      if (onUpdated) onUpdated({ ...client, documents_client: updatedDocs });
    } catch (err) {
      setError("Erreur lors du téléversement: " + (err.message || err));
    }
    setUploading(false);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files || []);
    handleUploadMultiple(files);
  };

  const handleDeleteDoc = async (index) => {
    if (!window.confirm("Supprimer ce document ?")) return;
    const updatedDocs = docs.filter((_, i) => i !== index);
    try {
      await appApi.entities.Client.update(client.id, {
        documents_client: updatedDocs,
      });
      setDocs(updatedDocs);
      setSuccess("Document supprimé.");
      if (onUpdated) onUpdated({ ...client, documents_client: updatedDocs });
    } catch (err) {
      setError("Erreur lors de la suppression: " + (err.message || err));
    }
  };

  const getFileName = (url) => {
    if (!url) return "Document";
    const parts = url.split("/");
    return decodeURIComponent(parts[parts.length - 1] || "Document");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <PenTool className="w-5 h-5 text-teal-dark" />
          <h2 className="text-lg font-bold text-gray-800">Convention de séquestre</h2>
        </div>
        <p className="text-sm text-gray-500">
          Consultez et signez votre convention de séquestre, puis téléversez vos pièces justificatives.
        </p>
      </div>

      {/* Convention PDF Preview */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal/10 flex items-center justify-center">
              <FileText className="w-7 h-7 text-teal-dark" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Convention de Séquestre — ClearBank</h3>
              <p className="text-sm text-gray-500">Document PDF à consulter et signer</p>
            </div>
          </div>
          {conventionPdfUrl ? (
            <a
              href={conventionPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-teal text-black rounded-full px-5 py-2.5 text-sm font-medium hover:bg-teal-dark hover:text-white transition"
            >
              <Download className="w-4 h-4" />
              Consulter
            </a>
          ) : (
            <span className="text-sm text-gray-500">Document en cours de mise à disposition</span>
          )}
        </div>

        {/* Embedded PDF viewer */}
        {conventionPdfUrl ? (
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <iframe
              src={conventionPdfUrl}
              title="Convention de Séquestre"
              className="w-full h-[400px] md:h-[600px]"
            />
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
            La convention sera disponible dès que l’administrateur l’aura ajoutée dans Supabase.
          </div>
        )}
      </div>

      {/* Signature section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h3 className="text-lg font-bold mb-4">Signature électronique</h3>

        {client.signature_acceptee && client.date_signature ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-center gap-4">
            <CheckCircle2 className="w-8 h-8 text-green-600 shrink-0" />
            <div>
              <p className="font-semibold text-green-800">Convention signée</p>
              <p className="text-sm text-green-600">
                Signée le {new Date(client.date_signature).toLocaleString("fr-FR")}
              </p>
            </div>
          </div>
        ) : (
          <>
            <label className="flex items-start gap-3 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="w-5 h-5 mt-0.5 rounded border-gray-300 text-teal-dark focus:ring-teal-dark"
              />
              <span className="text-sm text-gray-700 leading-relaxed">
                J'ai lu et j'accepte les termes de la <strong>Convention de Séquestre ClearBank</strong>.
                En cochant cette case, je reconnais avoir pris connaissance de l'ensemble des clauses
                et m'engage à les respecter.
              </span>
            </label>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-xs text-gray-500 mb-1">Date de signature</p>
              <p className="text-sm font-medium text-gray-800">
                {new Date().toLocaleString("fr-FR")}
              </p>
            </div>

            <button
              onClick={handleSign}
              disabled={signing || !accepted}
              className="inline-flex items-center gap-2 bg-black text-white rounded-full px-6 py-3 text-sm font-medium hover:bg-teal-dark transition disabled:opacity-50"
            >
              {signing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signature en cours...
                </>
              ) : (
                <>
                  <PenTool className="w-4 h-4" />
                  Signer la convention
                </>
              )}
            </button>
          </>
        )}
      </div>

      {/* Documents upload section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h3 className="text-lg font-bold mb-4">Mes documents justificatifs</h3>

        <p className="text-sm text-gray-500 mb-4">
          Téléversez vos pièces justificatives (pièce d'identité, justificatif de domicile, etc.).
          Ces documents seront transmis à votre administrateur.
        </p>

        {/* Drop zone */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 p-8 text-center ${
            dragActive
              ? "border-teal-dark bg-teal/5 scale-[1.01]"
              : "border-gray-300 hover:border-teal-dark hover:bg-gray-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              handleUploadMultiple(files);
              e.target.value = "";
            }}
          />
          {uploading ? (
            <>
              <Loader2 className="w-10 h-10 text-teal-dark mx-auto mb-3 animate-spin" />
              <p className="text-sm font-medium text-gray-700">Téléversement en cours...</p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-teal/10 flex items-center justify-center mx-auto mb-3">
                {dragActive ? (
                  <Upload className="w-7 h-7 text-teal-dark" />
                ) : (
                  <ImageIcon className="w-7 h-7 text-teal-dark" />
                )}
              </div>
              <p className="text-sm font-semibold text-gray-800 mb-1">
                {dragActive ? "Déposez vos fichiers ici" : "Glissez vos fichiers ici"}
              </p>
              <p className="text-xs text-gray-500">
                ou <span className="text-teal-dark font-medium underline">cliquez pour parcourir</span>
              </p>
              <p className="text-xs text-gray-400 mt-2">Images (JPG, PNG) ou PDF — plusieurs fichiers acceptés</p>
            </>
          )}
        </div>

        {docs.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Aucun document téléversé pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {docs.map((docUrl, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-teal-dark" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {getFileName(docUrl)}
                    </p>
                    <a
                      href={docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-teal-dark hover:underline"
                    >
                      Consulter
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteDoc(index)}
                  className="text-gray-400 hover:text-red-500 transition shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 text-sm">
          {success}
        </div>
      )}
    </div>
  );
}