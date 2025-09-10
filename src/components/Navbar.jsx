import { NavLink } from 'react-router-dom'


export default function Navbar(){
  return (
    <header className="navbar">
      <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16, height:64}}>
        <div className="brand">
        <i class="fa-solid fa-wallet"></i>
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
        </nav>
      </div>
    </header>
  )
}
