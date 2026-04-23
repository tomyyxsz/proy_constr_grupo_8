
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';  

describe('Footer Component', () => {
  test('renders footer text', () => {
    render(<Footer />);
    expect(screen.getByText('2026 Construcción de Software - Grupo 8')).toBeInTheDocument();
  });

  test('renders footer element', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('footer')).toBeInTheDocument();
  });

  test('footer has correct css class', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('footer')).toHaveClass('footer');
  });
});