import { Routes, Route } from 'react-router-dom'
import Shell from './components/Shell'

// Pages
import Dashboard from './pages/Dashboard'
import Categories from './pages/Categories'
import Reports from './pages/Reports'
import Profile from './pages/Profile'
import Expenses from './pages/Expenses'

/**
 * Déclare les routes de l'application.
 * Chaque route affiche le Shell (layout + fond) et une page vide.
 * On n'affiche aucun texte pour respecter le brief "fond en arrière-plan vide".
 */
export default function App(){
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile" element={<Profile />} />
        {/* Page non liée au menu */}
        <Route path="/expenses" element={<Expenses />} />
        {/* 404 optionnelle : rediriger vers Dashboard ou afficher vide */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Shell>
  )
}
