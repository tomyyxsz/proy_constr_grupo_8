import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Header } from '../../components/Header';
import Home from '../../pages/Home';
import { describe, test, expect } from 'vitest';

const AppLayout = () => {
  const mockUser = {
    id: '1',
    name: 'Agu Becerra',
    email: 'abecerra@prueba.com',
    role: 'ESTUDIANTE'
  };

  return (
    <div>
      <Header
        isAuthenticated={true}
        user={mockUser}
        onLogout={() => {}}
        onLoginClick={() => {}}
        onRegisterClick={() => {}}
      />
      <Home user={mockUser} />
    </div>
  );
};

// Pruebas de integración para verificar la interacción entre Header y Home
describe('Header y Home Integration', () => {
  // Test para verificar que el Header y Home se renderizan correctamente con la información del usuario
  test('Renderizar Header y Home juntos con información del usuario', () => {
    render(<AppLayout />);
    
    //verificar que el logo de MakerBox aparece en el Header
    expect(screen.getByText('MakerBox')).toBeInTheDocument();
    
    //Verificar que el nombre del usuario aparece en el Header
    expect(screen.getByText('Agu Becerra')).toBeInTheDocument();
    
    //Verificar que Home muestra el saludo con el nombre del usuario
    expect(screen.getByText('Hola, Agu Becerra')).toBeInTheDocument();
  });

  test('Permitir abrir y cerrar el menú de usuario desde el Header', async () => {
    render(<AppLayout />);
    
    const userButton = screen.getByRole('button', { name: /Agu Becerra/i });
    expect(userButton).toBeInTheDocument();
    
    // el menu nno debe estar visible inicialmente
    expect(userButton).toHaveAttribute('aria-expanded', 'false');
    
    // click para abrir el menu
    fireEvent.click(userButton);
  
    //verificamos que el menu esta listo
    await waitFor(() => {
      expect(userButton).toHaveAttribute('aria-expanded', 'true');
    });
    
    //click para cerrar el menu
    fireEvent.click(userButton);
    
    //el menu debe estar cerrado
    await waitFor(() => {
      expect(userButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test('Renderizar el componente StudentDashboard cuando el rol es ESTUDIANTE', () => {
    const { container } = render(<AppLayout />);
    
    expect(screen.getByText('Hola, Agu Becerra')).toBeInTheDocument();
    
    // Verificar que existe la estructura del home
    const homeWrapper = container.querySelector('.home-wrapper');
    expect(homeWrapper).toBeInTheDocument();
  });

  //Pruebas para cubrir casos extremos y ramas no cubiertas en Home.jsx
  describe('Casos Extremos y Cobertura', () => {
  
    // Test para verificar que se muestra un mensaje de error si el usuario tiene un rol no registrado
    test('Mostrar mensaje de error si el usuario tiene un rol no registrado', () => {
      const invalidUser = { name: 'Visitante', role: 'ADMINISTRADOR_FANTASMA' };
      render(<Home user={invalidUser} />);
    
      expect(screen.getByText('Hola, Visitante')).toBeInTheDocument();
      expect(screen.getByText('Rol no reconocido: ADMINISTRADOR_FANTASMA')).toBeInTheDocument();
    });

    // Test para verificar que no se rompe si el usuario es nulo o indefinido
    test('No romperse si el usuario es nulo o indefinido', () => {
      render(<Home user={null} />);
    
      // Debería renderizar "Hola, " sin el nombre, evitando un crasheo de la app
      expect(screen.getByText('Hola,')).toBeInTheDocument();
      // Al no haber rol, el Dashboard no se encuentra y cae en el fallback
      expect(screen.getByText('Rol no reconocido:')).toBeInTheDocument();
    });

    // Aseguramos que los otros roles válidos también mapean bien
    test('Procesar correctamente los roles PROFESOR y AYUDANTE sin renderizar error', () => {
      const profeUser = { name: 'Profe Test', role: 'PROFESOR' };
      const { unmount } = render(<Home user={profeUser} />);
      expect(screen.queryByText(/Rol no reconocido/i)).not.toBeInTheDocument();
      unmount(); // Limpiamos el DOM

      const ayudanteUser = { name: 'Ayudante Test', role: 'AYUDANTE' };
      render(<Home user={ayudanteUser} />);
      expect(screen.queryByText(/Rol no reconocido/i)).not.toBeInTheDocument();
    });
  });

});
