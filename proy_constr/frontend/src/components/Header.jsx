import React from "react";

export const Header = ({ isAuthenticated = false, user = null }) => {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 24px',
      backgroundColor: '#282c34',
      color: 'white'
    }}>

      <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
        MakerBox
      </div>

     
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {isAuthenticated ? (
          <span>{user?.name}</span>
        ) : (
          <>
            <button onClick={() => console.log('login')}>
              -----
            </button>
            <button onClick={() => console.log('register')}>
              -----
            </button>
          </>
        )}
      </div>

    </header>
  );
};