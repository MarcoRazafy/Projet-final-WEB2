import React from "react";


/**
 * Page Profil
 * - Affiche et édite: avatar, nom, email, téléphone
 * - Section "Sécurité": changement de mot de passe (simulation)
 * - "Sauvegarder" stocke dans localStorage (pas d'API pour l’instant)
 * - Validation simple côté client
 */
export default function Profile(){
  // --- état du profil (chargé depuis localStorage si existant)

  const [profile, setProfile] = React.useState(() => {
    const saved = localStorage.getItem("profile");
    return saved ? JSON.parse(saved) : {
      fullName: "",
      email: "",
      phone: "",
      avatarDataUrl: "", // data URL locale pour l’aperçu
    };
  });

  // --- état pour la section sécurité (simulation)
  const [security, setSecurity] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // --- états UI
  const [errors, setErrors] = React.useState({});
  const [message, setMessage] = React.useState("");

  // --- gestion de l’upload avatar (preview local)
  const onPickAvatar = (e) => {
    const file = e.target.files?.[0];
    if(!file) return;
    if(!file.type.startsWith("image/")){
      setMessage("Le fichier choisi n'est pas une image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setProfile((p) => ({ ...p, avatarDataUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // --- helpers formulaire
  const updateProfileField = (key, value) => {
    setProfile((p) => ({ ...p, [key]: value }));
  };

  const updateSecurityField = (key, value) => {
    setSecurity((s) => ({ ...s, [key]: value }));
  };

  const validate = () => {
    const e = {};
    if(!profile.fullName.trim()) e.fullName = "Nom complet requis";
    if(!profile.email.trim()) e.email = "Email requis";
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) e.email = "Email invalide";
    if(profile.phone && !/^[0-9+\s().-]{6,}$/.test(profile.phone)) e.phone = "Téléphone invalide";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSave = (e) => {
    e.preventDefault();
    setMessage("");
    if(!validate()) return;
    localStorage.setItem("profile", JSON.stringify(profile));
    setMessage("Profil sauvegardé ✅");
  };

  const onChangePassword = (e) => {
    e.preventDefault();
    setMessage("");
    const { currentPassword, newPassword, confirmNewPassword } = security;
    // Simulation simple (pas d’API) : on vérifie que les nouveaux mots de passe correspondent et qu’ils ont une longueur minimale
    if(newPassword.length < 6) {
      setMessage("Le nouveau mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if(newPassword !== confirmNewPassword){
      setMessage("La confirmation du nouveau mot de passe ne correspond pas.");
      return;
    }
    // En vrai, on appellerait une API ici avec currentPassword + newPassword.
    setSecurity({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    setMessage("Mot de passe mis à jour ✅ (simulation)");
  };

  return (
    <div className="w-full">
      {/* En-tête visuelle (cover) */}
      <section
        className="h-40 w-full"
        style={{
          background:
            "linear-gradient(135deg, rgba(40,91,222,0.35), rgba(19,28,46,0.6))",
          borderBottom: "1px solid rgba(178,187,201,.18)",
        }}
      />

      {/* Contenu principal */}
      <div className="max-w-[1100px] mx-auto px-4 -mt-10">
        {/* Carte Profil */}
        <div className="rounded-2xl border border-[#b2bbc9]/15 bg-[#131c2e]/70 backdrop-blur p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="relative">
                <img
                  src={
                    profile.avatarDataUrl ||
                    "https://api.iconify.design/solar/user-bold.svg?color=white"
                  }
                  alt="Avatar"
                  className="w-24 h-24 rounded-xl object-cover ring-2 ring-[#285bde]/40"
                />
                <label className="absolute -bottom-2 -right-2 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onPickAvatar}
                    className="hidden"
                  />
                  <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#285bde] text-white text-xs font-medium shadow">
                    Changer
                  </span>
                </label>
              </div>
            </div>

            {/* Infos rapides */}
            <div className="flex-1">
              <h1 className="text-white text-xl font-semibold tracking-wide">
                Mon profil
              </h1>
              <p className="text-[#b2bbc9]">
                Gérez vos informations personnelles et paramètres.
              </p>
            </div>
          </div>

          {/* Ligne séparatrice */}
          <div className="my-6 border-t border-[#b2bbc9]/15" />

          {/* Formulaire d’édition */}
          <form onSubmit={onSave} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Nom complet */}
            <div>
              <label className="block text-sm text-[#b2bbc9] mb-1">Nom complet</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => updateProfileField("fullName", e.target.value)}
                className="w-full rounded-lg bg-[#0f1524] border border-[#b2bbc9]/20 text-white px-3 py-2 outline-none focus:border-[#285bde]/60"
                placeholder="Ex: Jane Doe"
              />
              {errors.fullName && <p className="text-[#ff8e8e] text-xs mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-[#b2bbc9] mb-1">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => updateProfileField("email", e.target.value)}
                className="w-full rounded-lg bg-[#0f1524] border border-[#b2bbc9]/20 text-white px-3 py-2 outline-none focus:border-[#285bde]/60"
                placeholder="exemple@mail.com"
              />
              {errors.email && <p className="text-[#ff8e8e] text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm text-[#b2bbc9] mb-1">Téléphone (optionnel)</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => updateProfileField("phone", e.target.value)}
                className="w-full rounded-lg bg-[#0f1524] border border-[#b2bbc9]/20 text-white px-3 py-2 outline-none focus:border-[#285bde]/60"
                placeholder="+261 xx xx xxx xx"
              />
              {errors.phone && <p className="text-[#ff8e8e] text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Bouton sauvegarder */}
            <div className="flex items-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#285bde] text-white font-medium hover:brightness-110 transition shadow"
              >
                <span><i class="fa-solid fa-floppy-disk"></i></span> Sauvegarder
              </button>
            </div>
          </form>

          {/* Message global */}
          {message && (
            <div className="mt-4 text-sm text-white/90 bg-[#285bde]/20 border border-[#285bde]/40 px-3 py-2 rounded-lg">
              {message}
            </div>
          )}
        </div>

        {/* Carte Sécurité */}
        <div className="rounded-2xl border border-[#b2bbc9]/15 bg-[#131c2e]/70 backdrop-blur p-6 md:p-8 mt-6">
          <h2 className="text-white text-lg font-semibold mb-4">Sécurité</h2>
          <form onSubmit={onChangePassword} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div>
              <label className="block text-sm text-[#b2bbc9] mb-1">Mot de passe actuel</label>
              <input
                type="password"
                value={security.currentPassword}
                onChange={(e) => updateSecurityField("currentPassword", e.target.value)}
                className="w-full rounded-lg bg-[#0f1524] border border-[#b2bbc9]/20 text-white px-3 py-2 outline-none focus:border-[#285bde]/60"
                placeholder="••••••"
              />
            </div>

            <div>
              <label className="block text-sm text-[#b2bbc9] mb-1">Nouveau mot de passe</label>
              <input
                type="password"
                value={security.newPassword}
                onChange={(e) => updateSecurityField("newPassword", e.target.value)}
                className="w-full rounded-lg bg-[#0f1524] border border-[#b2bbc9]/20 text-white px-3 py-2 outline-none focus:border-[#285bde]/60"
                placeholder="min. 6 caractères"
              />
            </div>

            <div>
              <label className="block text-sm text-[#b2bbc9] mb-1">Confirmer le nouveau</label>
              <input
                type="password"
                value={security.confirmNewPassword}
                onChange={(e) => updateSecurityField("confirmNewPassword", e.target.value)}
                className="w-full rounded-lg bg-[#0f1524] border border-[#b2bbc9]/20 text-white px-3 py-2 outline-none focus:border-[#285bde]/60"
                placeholder="••••••"
              />
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#285bde] text-white font-medium hover:brightness-110 transition shadow"
              >
               <i class="fa-solid fa-lock"></i> Mettre à jour le mot de passe
              </button>
            </div>
          </form>
        </div>

        {/* Aide / astuces */}
        <p className="text-xs text-[#b2bbc9] mt-6">
          Astuce : ces données sont stockées localement (localStorage) pour la démo. Quand ton API sera prête,
          on remplacera par un appel HTTP (ex: <code>PUT /me</code>) et on supprimera le stockage local.
        </p>
      </div>
    </div>
  );
}
