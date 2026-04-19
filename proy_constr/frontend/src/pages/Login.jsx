import { useState } from 'react';
import './Login.css';
import { Header } from '../components/Header'
import  Footer  from '../components/Footer'



const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ //regular expresssion to validate email format
const MIN_PASSWORD_LENGTH = 6 //minimun password length

function validateLoginForm(email, password) {
  if (!email || !password) return 'Completa correo y contraseña'
  if (!EMAIL_REGEX.test(email)) return 'Ingresa un correo válido'
  if (password.length < MIN_PASSWORD_LENGTH)
    return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`
  return ''
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationError = validateLoginForm(email, password)
    if (validationError) { setError(validationError); return }
    setError('')
    onLogin({ email, password })
  }

  return (
    <div className="login-page">
      <Header />
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Bienvenido</h1>
            <p className="login-subtitle">Inicia sesión para continuar</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <input
              className="login-input"
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="login-input"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="login-error" role="alert">{error}</p>}
            <button className="login-button" type="submit">Ingresar</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Login
