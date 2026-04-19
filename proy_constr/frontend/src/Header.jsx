import React from "react";

export const Header = ({ isAuthenticated = false, user = null }) => {

  return (
    <header className="header" style = {{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: '#282c34', color: 'white' }}>
      <div className="logo">MakerBox</div>
      <nav className="nav-links" style = { { display: 'flex', gap: '100px' , color:"white"} }>
        <a href="/projects">Proyectos</a>
        <a href="/dashboard">Dashboard</a>
      </nav>

      <div className="auth-section">
        {isAuthenticated ? (
          <div className="user-menu">{user?.name}</div>
        ) : (
          <button className="login-btn">
            Iniciar Sesión
          </button>
        )}
      </div>
    </header>
  );
};