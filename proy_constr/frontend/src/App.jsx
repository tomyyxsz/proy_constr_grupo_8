import { useState } from 'react'
import Login from './pages/Login'
import Home from './pages/Home'
import { Header } from './components/Header'
import  Footer  from './components/Footer'


function App() {
  const [user, setUser] = useState(null)

  const handleLogin = ({ email }) => {
    // Aquí puedes validar contra tu backend
    // Por ahora simula login exitoso
    setUser({ email, name: email.split('@')[0] })
  }

  const handleLogout = () => {
    setUser(null)
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return <Home user={user} onLogout={handleLogout} />
}

export default App