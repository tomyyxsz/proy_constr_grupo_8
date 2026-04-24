import { Header } from '../components/Header'
import  Footer  from '../components/Footer'
import './Home.css'



export default function Home({ user, onLogout, onGoHome }) {
  return (
    <div>
      <Header />
      <div className="home-container">
        <h1>Hola {user?.name || 'usuario'}</h1> 
        {/* contenido */}
        <div className="home-buttons">
          <button onClick={onLogout} className="home-logout-btn">
            Cerrar sesión
          </button>
          <button onClick={onGoHome} className="home-home-btn">
            Inicio
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}