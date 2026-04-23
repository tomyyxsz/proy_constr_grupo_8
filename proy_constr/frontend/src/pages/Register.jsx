import { useState } from 'react';
import './Register.css';
import { Header } from '../components/Header'
import Footer from '../components/Footer'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 6
const RUT_REGEX = /^\d{8}$/

function validateRegisterForm(rut, nombre, apellidos, email, password, confirmPassword, role) {
  if (!rut || !nombre || !apellidos || !email || !password || !confirmPassword || !role) 
    return 'Completa todos los campos'
  if (!RUT_REGEX.test(rut)) 
    return 'Ingresa un RUT válido (8 dígitos sin puntos ni guión)'
  if (!EMAIL_REGEX.test(email)) 
    return 'Ingresa un correo válido'
  if (password.length < MIN_PASSWORD_LENGTH)
    return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`
  if (password !== confirmPassword)
    return 'Las contraseñas no coinciden'
  return ''
}

function Register({ onRegister, onLoginClick }) {
  const [rut, setRut] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) =>{
    e.preventDefault()
    const validationError = validateRegisterForm(rut, nombre, apellidos, email, password, confirmPassword, role)
    if (validationError) { 
      setError(validationError)
      return 
    }
    setError('')
    onRegister({ rut, nombre, apellidos, email, password, role })
  }

  const handleLoginClick = (e) => {
    e.preventDefault()
    if (onLoginClick) onLoginClick()
  }

  const handleRutChange = (e) => {
    const value = e.target.value
    // Solo permite números y limita a 8 caracteres
    const cleanedValue = value.replace(/[^0-9]/g, '').slice(0, 8)
    setRut(cleanedValue)
  }

  return (
    <div className="register-page">
      <Header />
      <div className="register-wrapper">
        <div className="register-card">
          <div className="register-header">
            <h1 className="register-title">Crear Cuenta</h1>
            <p className="register-subtitle">Completa el formulario para registrarte</p>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            <input
              className="register-input"
              type="text"
              placeholder="RUT (8 dígitos sin puntos)"
              value={rut}
              onChange={handleRutChange}
              maxLength="8"
            />
            <input
              className="register-input"
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <input
              className="register-input"
              type="text"
              placeholder="Apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
            />
            <input
              className="register-input"
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="register-password-group">
              <input
                className="register-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="register-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <input
              className="register-input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {password && confirmPassword && (
              <p className={password === confirmPassword ? 'register-password-match' : 'register-password-mismatch'}>
                {password === confirmPassword ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden'}
              </p>
            )}
            <select
              className="register-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Selecciona tu rol</option>
              <option value="estudiante">Estudiante</option>
              <option value="profesor">Profesor</option>
              <option value="ayudante">Ayudante</option>
            </select>
            {error && <p className="register-error" role="alert">{error}</p>}
            <button className="register-button" type="submit">Registrarse</button>
          </form>

          <p className="register-login-link">
            ¿Ya tienes cuenta? <a href="#" onClick={handleLoginClick}>Inicia sesión aquí</a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Register
