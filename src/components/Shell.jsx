/**
 * Shell = layout de base : affiche la Navbar et une zone "vide" dessous.
 * - children : le contenu de chaque page (ici on laisse vide pour le moment)
 * - la section .page-blank applique le fond vide demandé
 */
import Navbar from './Navbar'

export default function Shell({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-6 bg-gray-100">
        {children}
      </main>
    </div>
  )
}

