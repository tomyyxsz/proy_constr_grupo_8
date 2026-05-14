import { useState } from 'react'
import './Header.css'

export const Header = ({
  isAuthenticated = false, //Se ve si se tiene la sesion iniciada o no
  user = null, //Esta contiene la informacion del usuario
  onLoginClick, 
  onRegisterClick,
  onLogout,
}) => {
  const [menuOpen, setMenuOpen] = useState(false) //Es para ver si el estado del menú de usuario está abierto o cerrado

  const handleUserButtonClick = () => { //Cuando se hace click en el botón del usuario, se alterna el estado del menú entre abierto y cerrado
    setMenuOpen((currentValue) => !currentValue)
  }

  const handleLogoutClick = () => { //Cuando se hace click en Cerrar sesión, se cierra el menú y se llama a la función onLogout para cerrar la sesión del usuario
    setMenuOpen(false)
    if (onLogout) onLogout()
  }

  const handleLoginClick = () => { //Cuando se hace click en Iniciar sesión, se llama a la función onLoginClick para mostrar la página de inicio de sesión
    if (onLoginClick) onLoginClick()
  }

     
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
  const handleRegisterClick = () => { //Cuando se hace click en Registrarse, se llama a la función onRegisterClick para mostrar la página de registro
    if (onRegisterClick) onRegisterClick()
  }

  return (
    <header className="app-header">
      <div className="app-header__brand">MakerBox</div>

      <div className="app-header__actions"> {/* Acá se mostrará los botones que correspondan, si es el inicio de sesión o registro, o el menú de usuario para cuando se inicia la sesión*/}
        {isAuthenticated ? (
          <div className="app-header__user-area">
            <button
              type="button"
              className="app-header__user-button"
              onClick={handleUserButtonClick}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <span className="app-header__avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
              <span className="app-header__user-name">{user?.name || 'Usuario'}</span>
              <span className="app-header__caret">▾</span>
            </button>

            {menuOpen && (
              <div className="app-header__menu" role="menu">
                <button type="button" className="app-header__menu-item" role="menuitem">
                  Mis datos
                </button>
                <button type="button" className="app-header__menu-item" role="menuitem">
                  Mis cursos
                </button>
                <button type="button" className="app-header__menu-item app-header__menu-item--danger" role="menuitem" onClick={handleLogoutClick}>
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="app-header__guest-actions">
            <button type="button" className="app-header__button app-header__button--ghost" onClick={handleLoginClick}>
              Iniciar sesión
            </button>
            <button type="button" className="app-header__button" onClick={handleRegisterClick}>
              Registrarse
            </button>
          </div>
        )}
      </div>
    </header>
  )
}