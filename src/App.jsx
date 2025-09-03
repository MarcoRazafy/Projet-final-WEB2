import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faLocationDot,
  faCalendarDays,
  faGear,
  faFloppyDisk,
  faXmark,
  faCircleCheck,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Composant Profil – avec Font Awesome + sauvegarde fiable
 * - Mode lecture / édition
 * - Validation simple (prénom/nom/email)
 * - Simulation d’API + persistance localStorage
 * - Icônes Font Awesome
 */

// ---- Données par défaut
const defaultProfile = {
  firstName: "Jeans",
  lastName: "Dupont",
  email: "jean.dupont@email.com",
  phone: "+33 6 12 34 56 78",
  address: "Paris, France",
  bio: "Utilisateur passionné de gestion financière personnelle.",
  memberSince: "1 janvier 2024",
  location: "Paris, France",
};

// ---- utilitaire: charger/sauver dans localStorage
const STORAGE_KEY = "profileData";
const loadProfile = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultProfile;
  } catch {
    return defaultProfile;
  }
};
const saveProfileLocal = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// ---- simulation d’une API (retourne la donnée sauvegardée)
const fakeUpdateProfile = async (payload) => {
  // imite un appel réseau
  await new Promise((r) => setTimeout(r, 500));
  saveProfileLocal(payload);
  return { ok: true, data: payload };
};

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
      {!!error && (
        <p className="text-rose-400 text-xs flex items-center gap-1">
          <FontAwesomeIcon icon={faTriangleExclamation} /> {error}
        </p>
      )}
    </div>
  );
}

export default function Profile() {
  // On charge depuis localStorage au montage
  const [profile, setProfile] = useState(defaultProfile);
  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  // brouillon d’édition
  const [draft, setDraft] = useState(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // IMPORTANT : quand on passe en édition, on clone profondément
  // pour éviter toute mutation par référence.
  const startEdit = () => {
    setMessage(null);
    setDraft(JSON.parse(JSON.stringify(profile))); // deep clone
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setMessage(null);
    setDraft(JSON.parse(JSON.stringify(profile)));
    setIsEditing(false);
  };

  // Validations basiques
  const errors = useMemo(() => {
    const e = {};
    if (!draft.firstName?.trim()) e.firstName = "Prénom requis.";
    if (!draft.lastName?.trim()) e.lastName = "Nom requis.";
    if (
      !draft.email?.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)
    ) {
      e.email = "Email invalide.";
    }
    return e;
  }, [draft]);

  const hasErrors = Object.keys(errors).length > 0;

  // Enregistrement fiable (corrigé)
  const handleSave = async () => {
    if (hasErrors) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fakeUpdateProfile(draft);
      if (!res.ok) throw new Error("API error");
      setProfile(res.data);         // ✅ met à jour l’affichage
      setIsEditing(false);          // quitte le mode édition
      setMessage({
        type: "success",
        text: "Profil mis à jour avec succès.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: "Une erreur est survenue. Réessaie plus tard.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Topbar simple */}
      <header className="border-b border-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-3">
          <div className="text-sky-400">💳</div>
          <h1 className="text-lg font-semibold">Gestionnaire de Dépenses</h1>
          <div className="ml-auto">
            <span className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-3 py-1 text-sm">
              <FontAwesomeIcon icon={faUser} />
              Profil
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-3xl font-bold">Profil</h2>
        <p className="text-slate-400 mt-1">
          Gérez vos informations personnelles
        </p>

        {/* Feedback */}
        {message && (
          <div
            className={`mt-6 rounded-lg border px-4 py-3 text-sm flex items-center gap-2 ${
              message.type === "success"
                ? "border-emerald-700 bg-emerald-900/30 text-emerald-300"
                : "border-rose-700 bg-rose-900/30 text-rose-300"
            }`}
          >
            <FontAwesomeIcon
              icon={message.type === "success" ? faCircleCheck : faTriangleExclamation}
            />
            {message.text}
          </div>
        )}

        <div className="mt-6 grid gap-6 md:grid-cols-[360px,1fr]">
          {/* Carte gauche */}
          <section className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6">
            <div className="mx-auto h-28 w-28 rounded-full bg-slate-800 grid place-items-center text-4xl">
              <FontAwesomeIcon icon={faUser} />
            </div>

            <div className="mt-4 text-center">
              <h3 className="text-xl font-semibold">
                {profile.firstName} {profile.lastName}
              </h3>
              <p className="text-slate-400 break-all">{profile.email}</p>
            </div>

            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-3 text-slate-300">
                <FontAwesomeIcon className="text-sky-400" icon={faCalendarDays} />
                <span>
                  Membre depuis <strong>{profile.memberSince}</strong>
                </span>
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <FontAwesomeIcon className="text-emerald-400" icon={faLocationDot} />
                <span>{profile.location}</span>
              </li>
            </ul>
          </section>

          {/* Carte droite */}
          <section className="relative rounded-2xl bg-slate-900/60 border border-slate-800 p-6">
            <div className="mb-4 flex items-center justify-end gap-3">
              {!isEditing ? (
                <button
                  onClick={startEdit}
                  className="inline-flex items-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 px-4 py-2 text-sm font-medium"
                >
                  <FontAwesomeIcon icon={faGear} /> Modifier
                </button>
              ) : (
                <>
                  <button
                    onClick={cancelEdit}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800 disabled:opacity-60"
                  >
                    <FontAwesomeIcon icon={faXmark} /> Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || hasErrors}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-sm font-medium disabled:opacity-60"
                  >
                    <FontAwesomeIcon icon={faFloppyDisk} />
                    {saving ? "Enregistrement..." : "Enregistrer"}
                  </button>
                </>
              )}
            </div>

            <h4 className="text-lg font-semibold mb-4">Informations Personnelles</h4>

            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Prénom"
                value={isEditing ? draft.firstName : profile.firstName}
                onChange={(v) => setDraft((d) => ({ ...d, firstName: v }))}
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
                label={
                  <span className="inline-flex items-center gap-2">
                    <FontAwesomeIcon className="text-sky-400" icon={faEnvelope} />
                    Email
                  </span>
                }
                value={isEditing ? draft.email : profile.email}
                onChange={(v) => setDraft((d) => ({ ...d, email: v }))}
                placeholder="nom@domaine.com"
                disabled={!isEditing}
                error={isEditing ? errors.email : undefined}
              />
              <Field
                label={
                  <span className="inline-flex items-center gap-2">
                    <FontAwesomeIcon className="text-rose-400" icon={faPhone} />
                    Téléphone
                  </span>
                }
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
