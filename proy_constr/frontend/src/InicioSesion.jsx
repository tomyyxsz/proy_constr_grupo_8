import { useState } from 'react'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 6

function validateLoginForm(email, password) {
  if (!email || !password) {
    return 'Completa correo y contraseña'
  }

  if (!EMAIL_REGEX.test(email)) {
    return 'Ingresa un correo valido'
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `La contrasena debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`
  }

  return ''
}

function InicioSesion({ isAuthenticated = false, user = null, onLogin = () => {} }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return (
      <div className="inicio-sesion">
        <h1 className="inicio-sesion_titulo">Iniciar sesión</h1>
        <div className="inicio-sesion_user-menu">{user?.name}</div>
      </div>
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const validationError = validateLoginForm(email, password)
    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    onLogin({ email, password })
    window.alert(`inicio de sesion exitoso para ${email}`)
  }

  return (
    <div className="inicio-sesion">
      <h1 className="inicio-sesion_titulo">Iniciar sesión</h1>

      <form className="inicio-sesion_form" onSubmit={handleSubmit}>
        <input
          className="inicio-sesion_input"
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <input
          className="inicio-sesion_input"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button className="inicio-sesion_boton" type="submit">Ingresar</button>
      </form>

      {error && <p className="inicio-sesion_error" role="alert">{error}</p>}
    </div>
  )
}

export default InicioSesion
