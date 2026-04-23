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

  const handleLogin = ({ email , password}) => {
    // Aquí puedes validar contra tu backend
    // Por ahora simula login exitoso
    setUser({ email, name: email.split('@')[0] })
    setCurrentPage('home')
  }

  const handleRegister = ({ rut, nombre, apellidos, email, password, role }) => {
    // Aquí puedes enviar los datos al backend
    // Por ahora simula registro exitoso y hace login automático
    setUser({ email, name: nombre, role })
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

  return <Home user={user} onLogout={handleLogout} onGoHome={handleGoHome} />
}

export default App