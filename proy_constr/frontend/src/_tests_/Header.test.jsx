
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Header } from '../Header';



describe('Header Component', () => {
  test('renders logo and navigation links', () => {
    render(<Header />);
    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
    expect(screen.getByText('Proyectos')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
  test('shows login button when user not authenticated', () => {
    render(<Header isAuthenticated={false} />);
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
  });
  test('shows user menu when authenticated', () => {
    render(<Header isAuthenticated={true} user={{ name: 'Juan' }} />);
    expect(screen.getByText('Juan')).toBeInTheDocument();
  });
});