import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Header } from '../../components/Header';
import Home from '../../pages/Home';
import { describe, test, expect } from 'vitest';

/**
 * Componente de prueba que integra Header y Home
 */
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

describe('Header y Home Integration', () => {
  test('debe renderizar Header y Home juntos con información del usuario', () => {
    render(<AppLayout />);
    
    //verificar que el logo de MakerBox aparece en el Header
    expect(screen.getByText('MakerBox')).toBeInTheDocument();
    
    //Verificar que el nombre del usuario aparece en el Header
    expect(screen.getByText('Agu Becerra')).toBeInTheDocument();
    
    //Verificar que Home muestra el saludo con el nombre del usuario
    expect(screen.getByText('Hola, Agu Becerra')).toBeInTheDocument();
  });

  test('debe permitir abrir y cerrar el menú de usuario desde el Header', async () => {
    render(<AppLayout />);
    
    const userButton = screen.getByRole('button', { name: /Agu Becerra/i });
    expect(userButton).toBeInTheDocument();
    
    // el menu nno debe estar visible inicialmente
    expect(userButton).toHaveAttribute('aria-expanded', 'false');
    
    // click para abrr el menu
    fireEvent.click(userButton);
  
    //verificamos que el menu esta listo
    await waitFor(() => {
      expect(userButton).toHaveAttribute('aria-expanded', 'true');
    });
    
    //clic para cerrar el menu
    fireEvent.click(userButton);
    
    //el menu debe estar cerrado
    await waitFor(() => {
      expect(userButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test('debe renderizar el componente StudentDashboard cuando el rol es ESTUDIANTE', () => {
    const { container } = render(<AppLayout />);
    
    expect(screen.getByText('Hola, Agu Becerra')).toBeInTheDocument();
    
    // Verificar que existe la estructura del home
    const homeWrapper = container.querySelector('.home-wrapper');
    expect(homeWrapper).toBeInTheDocument();
  });

});
