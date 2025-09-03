import React, { useMemo, useState } from "react";

/**
 * Composant “Profil” – version autonome
 * ---------------------------------------------------------
 * - Affiche les infos d’un utilisateur
 * - Bouton "Modifier" active le mode édition (inputs activés)
 * - "Enregistrer" valide et simule un appel API
 * - "Annuler" restaure les valeurs initiales
 * - Tout est commenté pour expliquer chaque partie
 *
 * ⚠️ Design avec Tailwind (dark mode de la capture)
 *    -> Assure-toi d’avoir Tailwind configuré dans ton projet.
 */

// ---- Données de départ (tu peux brancher une vraie API ensuite)
const initialProfile = {
  firstName: "Jeans",
  lastName: "Dupont",
  email: "jean.dupont@email.com",
  phone: "+33 6 12 34 56 78",
  address: "Paris, France",
  bio: "Utilisateur passionné de gestion financière personnelle.",
  memberSince: "1 janvier 2024",
  location: "Paris, France",
};

// ---- Simulation d’un backend (pour montrer la logique)
function fakeUpdateProfile(payload) {
  // Retourne une promesse résolue après un délai, comme un fetch/axios
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ok: true, data: payload }), 700);
  });
}

// ---- Petit composant champ label + input/textarea réutilisable
function Field({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  textarea = false,
  error,
}) {
  const base =
    "w-full rounded-lg bg-slate-800/60 border border-slate-700 px-4 py-2 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500";
  return (
    <div className="space-y-1">
      <label className="block text-slate-300 text-sm">{label}</label>
      {textarea ? (
        <textarea
          rows={4}
          className={base}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={base}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {!!error && <p className="text-rose-400 text-xs">{error}</p>}
    </div>
  );
}

export default function Profile() {
  // state principal
  const [profile, setProfile] = useState(initialProfile);
  const [draft, setDraft] = useState(initialProfile); // brouillon pour l’édition
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // ---- petites validations de base (email + champs requis)
  const errors = useMemo(() => {
    const e = {};
    if (!draft.firstName?.trim()) e.firstName = "Prénom requis.";
    if (!draft.lastName?.trim()) e.lastName = "Nom requis.";
    // Email très simple, à adapter si besoin
    if (
      !draft.email?.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)
    ) {
      e.email = "Email invalide.";
    }
    return e;
  }, [draft]);

  const hasErrors = Object.keys(errors).length > 0;

  // ---- Handlers
  const handleEditToggle = () => {
    setMessage(null);
    setDraft(profile); // on repart depuis la dernière version enregistrée
    setIsEditing(true);
  };

  const handleCancel = () => {
    setMessage(null);
    setDraft(profile); // on jette les modifs
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (hasErrors) return;
    setSaving(true);
    setMessage(null);
    // simulation d’un POST/PUT
    const res = await fakeUpdateProfile(draft);
    setSaving(false);
    if (res.ok) {
      setProfile(res.data); // on remplace les données affichées
      setIsEditing(false);
      setMessage({ type: "success", text: "Profil mis à jour avec succès." });
    } else {
      setMessage({
        type: "error",
        text: "Une erreur est survenue. Réessaie plus tard.",
      });
    }
  };

  // ---- rendu
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Barre du haut (façon navbar simple) */}
      <header className="border-b border-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-3">
          <div className="text-sky-400">💳</div>
          <h1 className="text-lg font-semibold">Gestionnaire de Dépenses</h1>
          <div className="ml-auto">
            <span className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-3 py-1 text-sm">
              <span className="text-sky-400">👤</span> Profil
            </span>
          </div>
        </div>
      </header>

      {/* Contenu */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-3xl font-bold">Profil</h2>
        <p className="text-slate-400 mt-1">
          Gérez vos informations personnelles
        </p>

        {/* Bandeau de feedback */}
        {message && (
          <div
            className={`mt-6 rounded-lg border px-4 py-3 text-sm ${
              message.type === "success"
                ? "border-emerald-700 bg-emerald-900/30 text-emerald-300"
                : "border-rose-700 bg-rose-900/30 text-rose-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="mt-6 grid gap-6 md:grid-cols-[360px,1fr]">
          {/* Carte de gauche : avatar + résumé */}
          <section className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6">
            {/* Avatar circulaire */}
            <div className="mx-auto h-28 w-28 rounded-full bg-slate-800 grid place-items-center text-4xl">
              {/* Icône d’utilisateur en pur CSS/emoji pour éviter des deps */}
              👤
            </div>

            <div className="mt-4 text-center">
              <h3 className="text-xl font-semibold">
                {profile.firstName} {profile.lastName}
              </h3>
              <p className="text-slate-400 break-all">{profile.email}</p>
            </div>

            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-3 text-slate-300">
                <span>📅</span>
                <span>
                  Membre depuis <strong>{profile.memberSince}</strong>
                </span>
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <span>📍</span>
                <span>{profile.location}</span>
              </li>
            </ul>
          </section>

          {/* Carte de droite : formulaire d’infos personnelles */}
          <section className="relative rounded-2xl bg-slate-900/60 border border-slate-800 p-6">
            {/* Bouton Modifier / Annuler / Enregistrer */}
            <div className="mb-4 flex items-center justify-end gap-3">
              {!isEditing ? (
                <button
                  onClick={handleEditToggle}
                  className="inline-flex items-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 px-4 py-2 text-sm font-medium"
                >
                  <span>⚙️</span> Modifier
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800 disabled:opacity-60"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || hasErrors}
                    className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-sm font-medium disabled:opacity-60"
                  >
                    {saving ? "Enregistrement..." : "Enregistrer"}
                  </button>
                </>
              )}
            </div>

            <h4 className="text-lg font-semibold mb-4">
              Informations Personnelles
            </h4>

            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Prénom"
                value={isEditing ? draft.firstName : profile.firstName}
                onChange={(v) =>
                  setDraft((d) => ({ ...d, firstName: v }))
                }
                placeholder="Jeans"
                disabled={!isEditing}
                error={isEditing ? errors.firstName : undefined}
              />
              <Field
                label="Nom"
                value={isEditing ? draft.lastName : profile.lastName}
                onChange={(v) => setDraft((d) => ({ ...d, lastName: v }))}
                placeholder="Dupont"
                disabled={!isEditing}
                error={isEditing ? errors.lastName : undefined}
              />
              <Field
                label="Email"
                value={isEditing ? draft.email : profile.email}
                onChange={(v) => setDraft((d) => ({ ...d, email: v }))}
                placeholder="nom@domaine.com"
                disabled={!isEditing}
                error={isEditing ? errors.email : undefined}
              />
              <Field
                label="Téléphone"
                value={isEditing ? draft.phone : profile.phone}
                onChange={(v) => setDraft((d) => ({ ...d, phone: v }))}
                placeholder="+33 6 00 00 00 00"
                disabled={!isEditing}
              />
              <Field
                label="Adresse"
                value={isEditing ? draft.address : profile.address}
                onChange={(v) => setDraft((d) => ({ ...d, address: v }))}
                placeholder="Ville, Pays"
                disabled={!isEditing}
              />
              <div className="md:col-span-2">
                <Field
                  label="Bio"
                  textarea
                  value={isEditing ? draft.bio : profile.bio}
                  onChange={(v) => setDraft((d) => ({ ...d, bio: v }))}
                  placeholder="Quelques mots sur toi…"
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Petite note d’aide */}
            {!isEditing && (
              <p className="mt-4 text-xs text-slate-400">
                Clique sur <span className="text-sky-400 font-medium">Modifier</span> pour mettre à jour tes informations.
              </p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
