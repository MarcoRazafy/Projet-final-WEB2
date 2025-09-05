/**
 * Shell = layout de base : affiche la Navbar et une zone "vide" dessous.
 * - children : le contenu de chaque page (ici on laisse vide pour le moment)
 * - la section .page-blank applique le fond vide demandé
 */
import Navbar from './Navbar'

export default function Shell({ children }){
  return (
    <>
      <Navbar />
      <main className="page-blank">
        {/* La page doit rester VISUELLEMENT vide. 
            On garde {children} si tu veux injecter du contenu plus tard. */}
        {children}
      </main>
    </>
  )
}
