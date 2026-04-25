import { useState } from 'react';
import './Login.css';
import { Header } from '../components/Header'
import  Footer  from '../components/Footer'
import { loginUser } from '../api/ApiLogin'



const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ //regular expresssion to validate email format

function validateLoginForm(email, password) {
  if (!email || !password) return 'Completa correo y contraseña'
  if (!EMAIL_REGEX.test(email)) return 'Ingresa un correo válido'

}


function Login({ onLogin, onRegisterClick }) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // validar formulario antes de enviar datos al backend, mostrar errores de validacion en el frontend
  const handleSubmit = async (e) => {

    e.preventDefault()
    const validationError = validateLoginForm(email, password)

    if (validationError) { 
      setError(validationError);
      return }

    setError('')

    try {
      setIsSubmitting(true)
      const response = await loginUser(email, password)
      onLogin(response.usuario)
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setIsSubmitting(false)
    }

  }

  const handleRegisterClick = (e) => {
    e.preventDefault()
    if (onRegisterClick) onRegisterClick()
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
            <p className="login-register-link">
              ¿No tienes cuenta? <a href="#" onClick={handleRegisterClick}>Regístrate aquí</a>
            </p>
            {error && <p className="login-error" role="alert">{error}</p>}
            <button className="login-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Validando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Login
