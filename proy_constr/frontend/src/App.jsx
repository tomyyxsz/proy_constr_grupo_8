import { useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'

function App() {
  const [user, setUser] = useState(null)
  const [currentPage, setCurrentPage] = useState('login') // 'login', 'register', 'home'

  const handleLogin = ({ email , password}) => {
    // Aquí puedes validar contra tu backend
    // Por ahora simula login exitoso
    setUser({ email, name: email.split('@')[0] })
    setCurrentPage('home')
  }
  //estan en rojo porque aun no se usan
  const handleRegister = ({ rut, nombre, apellidos, email, password, role }) => {
    // Aquí puedes enviar los datos al backend
    // Por ahora simula registro exitoso y hace login automático
    setUser({ email, name: nombre, role })
    setCurrentPage('home')
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentPage('login')
  }

  const handleRegisterClick = () => {
    setCurrentPage('register')
  }

  const handleLoginClick = () => {
    setCurrentPage('login')
  }

  if (currentPage === 'login') {
    return <Login onLogin={handleLogin} onRegisterClick={handleRegisterClick} />
  }

  if (currentPage === 'register') {
    return <Register onRegister={handleRegister} onLoginClick={handleLoginClick} />
  }

  return <Home user={user} onLogout={handleLogout} />
}

export default App