import { NavLink } from 'react-router-dom'

/**
 * Navbar en haut de page.
 * - Liens: Dashboard, Catégories, Rapports, Profil
 * - "Dépenses" N'EST PAS affiché ici.
 * - NavLink ajoute la classe "active" quand la route correspond,
 *   ce qui nous permet de styliser l'onglet actif.
 */
export default function Navbar(){
  return (
    <header className="navbar">
      <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16, height:64}}>
        <div className="brand">
          <span className="brand-icon flex justify-center items-center"><i class="fa-solid fa-wallet"></i></span>
          <span>Gestionnaire de Dépenses</span>
        </div>

        <nav style={{display:'flex',gap:6}}>
          <NavLink to="/" end className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>
            Dashboard
          </NavLink>
          <NavLink to="/categories" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>
            Catégories
          </NavLink>
          <NavLink to="/reports" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>
            Rapports
          </NavLink>
          <NavLink to="/profile" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>
            Profil
          </NavLink>
          {/* PAS de lien "Dépenses" ici */}
        </nav>
      </div>
    </header>
  )
}
