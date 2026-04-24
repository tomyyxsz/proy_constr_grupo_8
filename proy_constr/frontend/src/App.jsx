import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'

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
      role: usuarioAutenticado['usuario_rol'],
    })
    setCurrentPage('home')
  }

  const handleRegister = (usuarioRegistrado) => {
    setUser({
      id: usuarioRegistrado.id,
      email: usuarioRegistrado.email,
      name: usuarioRegistrado.nombre,
      role: usuarioRegistrado['usuario_rol'],
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

export default App