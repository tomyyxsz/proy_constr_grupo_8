
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Header } from '../../components/Header';



describe('Header Component', () => {
  test('renders logo and navigation links', () => {
    render(<Header />);
    expect(screen.getByText('MakerBox')).toBeInTheDocument();
  });
  test('shows login button when user not authenticated', () => {
    render(<Header isAuthenticated={false} />);
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });
  test('shows user menu when authenticated', () => {
    render(<Header isAuthenticated={true} user={{ name: 'Juan' }} />);
    expect(screen.getByText('Juan')).toBeInTheDocument();
  });
});