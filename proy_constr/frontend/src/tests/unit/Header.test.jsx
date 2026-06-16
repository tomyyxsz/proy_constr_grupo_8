import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Header } from '../../components/Header';

describe('Componentes Header', () => {
  // Test para verificar que el logo y los links de navegación se renderizan correctamente
  test('Links de navegación y logo', () => {
    render(<Header />);
    expect(screen.getByText('MakerBox')).toBeInTheDocument();
  });

  // Test para verificar que se muestran los botones de inicio de sesión y registro cuando el usuario no está autenticado
  test('Muestra botones de inicio de sesión y registro cuando el usuario no está autenticado', () => {
    render(<Header isAuthenticated={false} />);
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
    expect(screen.getByText('Registrarse')).toBeInTheDocument();
  });

  // Test para verificar que se muestra el menú del usuario cuando el usuario está autenticado
  test('Muestra el menú del usuario cuando está autenticado', () => {
    render(<Header isAuthenticated={true} user={{ name: 'Juan' }} />);
    expect(screen.getByText('J')).toBeInTheDocument(); // Verifica el avatar (charAt(0))
    expect(screen.getByText('Juan')).toBeInTheDocument(); // Verifica el nombre
  });


describe('Interacciones y botones', () => {
  // Test para verificar que se llama a onLoginClick al hacer clic en el botón de inicio de sesión
  test('Llama a onLoginClick al hacer clic en Iniciar sesión', () => {
    const mockOnLogin = vi.fn();
    render(<Header isAuthenticated={false} onLoginClick={mockOnLogin} />);
    fireEvent.click(screen.getByText('Iniciar sesión'));
    expect(mockOnLogin).toHaveBeenCalledTimes(1);
  });

  // Test para verificar que se llama a onRegisterClick al hacer clic en el botón de registro
  test('Llama a onRegisterClick al hacer clic en Registrarse', () => {
    const mockOnRegister = vi.fn();
    render(<Header isAuthenticated={false} onRegisterClick={mockOnRegister} />);
    fireEvent.click(screen.getByText('Registrarse'));
    expect(mockOnRegister).toHaveBeenCalledTimes(1);
  });

  // Test para verificar que se llama a onLogout al hacer clic en Cerrar sesión
  test('Abre el menú de usuario y llama a onLogout al hacer clic en Cerrar sesión', () => {
    const mockOnLogout = vi.fn();
    render(<Header isAuthenticated={true} user={{ name: 'Juan' }} onLogout={mockOnLogout} />);
    const userButton = screen.getByRole('button', { name: /Juan/i });
    fireEvent.click(userButton);
    const logoutButton = screen.getByText('Cerrar sesión');
    expect(logoutButton).toBeInTheDocument();
    fireEvent.click(logoutButton);
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });
});

describe('Manejo de estados nulos', () => {
  // Test para verificar que el componente maneja correctamente un objeto user nulo
  test('Muestra los valores por defecto si no se pasa el objeto user', () => {
    render(<Header isAuthenticated={true} user={null} />);
    expect(screen.getByText('U')).toBeInTheDocument();
    expect(screen.getByText('Usuario')).toBeInTheDocument();
  });
});
});