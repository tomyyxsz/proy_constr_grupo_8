import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import Footer from '../../components/Footer'

describe('Footer Component', () => {
  // Test para verificar que el texto del footer se renderiza correctamente
  test('renderiza el texto del footer correctamente', () => {
    render(<Footer />)
    
    // Usamos regex (/.../i) para que ignore espacios extra al inicio o final y mayúsculas
    expect(screen.getByText(/2026 Construcción de Software - Grupo 8/i)).toBeInTheDocument()
  })

  // Test para verificar que el footer tiene la clase CSS correcta
  test('renderiza la etiqueta HTML footer con su clase CSS', () => {
    const { container } = render(<Footer />)
    const footerElement = container.querySelector('footer')
    
    expect(footerElement).toBeInTheDocument()
    expect(footerElement).toHaveClass('footer')
  })
})