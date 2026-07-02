import { useState } from 'react';
import './Register.css';
import { registerUser } from '../api/ApiRegistro'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RUT_REGEX = /^\d{7,8}-[0-9K]$/ // RUT sin puntos pero tiene guion y DV, ej: 1234567-9 o 12345678-K
const MIN_PASSWORD_LENGTH = 8
function validateRegisterForm(rut, nombre, apellidos, email, password, confirmPassword, role) {
  if (!rut || !nombre || !apellidos || !email || !password || !confirmPassword || !role) 
    return 'Completa todos los campos'
  if (!RUT_REGEX.test(rut)) 
    return 'Ingresa un RUT válido (7 u 8 dígitos sin puntos, con guión y dígito verificador)'
  if (!EMAIL_REGEX.test(email)) 
    return 'Ingresa un correo válido'
  // la validacion de contrasena debe corresponder al backend: min 8 caracteres, 1 mayus, 1 min, 1 numero, 1 simbolo
  if (password.length < MIN_PASSWORD_LENGTH)
    return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`
  if (!/[A-Z]/.test(password))
    return 'La contraseña debe tener al menos una letra mayúscula'
  if (!/[a-z]/.test(password))
    return 'La contraseña debe tener al menos una letra minúscula'
  if (!/[0-9]/.test(password))
    return 'La contraseña debe tener al menos un número'
  if (!/[^A-Za-z0-9]/.test(password))
    return 'La contraseña debe tener al menos un símbolo'  
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
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) =>{
    e.preventDefault()
    const validationError = validateRegisterForm(rut, nombre, apellidos, email, password, confirmPassword, role)
    if (validationError) { 
      setError(validationError)
      return 
    }
    setError('')
    try {
      setIsSubmitting(true)
      const response = await registerUser({
        rut,
        nombre,
        apellido: apellidos,
        email,
        password,
        usuarioRol: role,
      })
      onRegister(response.usuario)
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLoginClick = (e) => {
    e.preventDefault()
    if (onLoginClick) onLoginClick()
  }

  const handleRutChange = (e) => {
    const value = e.target.value.toUpperCase()
    const sanitized = value.replace(/[^0-9K-]/g, '').slice(0, 10)
    setRut(sanitized)
  }

  return (
    <div className="register-page">
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
              placeholder="RUT (7 u 8 dígitos con guion y digito verificador)"
              value={rut}
              onChange={handleRutChange}
              maxLength="10"
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
              <option value="solicitante">Solicitante</option>
              <option value="profesor">Profesor</option>
              <option value="ayudante">Ayudante</option>
            </select>
            {error && <p className="register-error" role="alert">{error}</p>}
            <button className="register-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          <p className="register-login-link">
            ¿Ya tienes cuenta? <a href="#" onClick={handleLoginClick}>Inicia sesión aquí</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
