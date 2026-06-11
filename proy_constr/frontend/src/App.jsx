import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Footer from './components/Footer'
import { Header } from './components/Header'

function App() {
  const [user, setUser] = useState(null)
  const [currentPage, setCurrentPage] = useState(() => {
    // Inicializar desde localStorage o con 'login' como predeterminado
    return localStorage.getItem('currentPage') || 'login'
  })

  // Guardar currentPage en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('currentPage', currentPage)
  }, [currentPage])

  const handleLogin = (usuarioAutenticado) => {
    setUser({
      id: usuarioAutenticado.id,
      email: usuarioAutenticado.email,
      name: usuarioAutenticado.nombre,
      role: usuarioAutenticado['usuarioRol'],
    })
    setCurrentPage('home')
  }

  const handleRegister = (usuarioRegistrado) => {
    setUser({
      id: usuarioRegistrado.id,
      email: usuarioRegistrado.email,
      name: usuarioRegistrado.nombre,
      role: usuarioRegistrado['usuarioRol'],
    })
    setCurrentPage('home')
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentPage('login')
    localStorage.removeItem('currentPage')
  }

  const handleRegisterClick = () => {
    setCurrentPage('register')
  }

  const handleLoginClick = () => {
    setCurrentPage('login')
  }

  const handleGoHome = () => {
    setCurrentPage('home')
  }

  const isAuthenticated = Boolean(user)

  const renderPage = () => {
    if (currentPage === 'login') {
      return <Login onLogin={handleLogin} onRegisterClick={handleRegisterClick} />
    }

    if (currentPage === 'register') {
      return <Register onRegister={handleRegister} onLoginClick={handleLoginClick} />
    }

    if (currentPage === 'home' && !user) {
      return <Login onLogin={handleLogin} onRegisterClick={handleRegisterClick} />
    }

    return <Home user={user} onLogout={handleLogout} onGoHome={handleGoHome} />
  }

  return (
    <div className="app-shell">
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
        onLogout={handleLogout}
      />
      <main className="app-shell__main">
        {renderPage()}
      </main>
      <Footer />
    </div>
  )
}

export default App