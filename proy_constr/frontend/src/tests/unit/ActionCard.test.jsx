import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import ActionCard from '../../components/ActionCard'

describe('ActionCard', () => {
  // Test para verificar que el título, descripción e icono se renderizan correctamente
  it('Renderiza el título, descripción e icono correctamente', () => {
    render(
      <ActionCard
        icon="ti-3d-cube-sphere"
        iconClass="icon-estudiante"
        title="Solicitar impresión"
        description="Crea una nueva solicitud de impresión 3D"
        onClick={() => {}}
      />
    )
    expect(screen.getByText('Solicitar impresión')).toBeInTheDocument()
    expect(screen.getByText('Crea una nueva solicitud de impresión 3D')).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveClass('action-card')
  })

  // Test para verificar que se aplican las clases CSS correctamente al icono
  it('aplica las clases CSS correctamente al icono', () => {
    const { container } = render(
      <ActionCard
        icon="ti-clipboard-list"
        iconClass="icon-profesor"
        title="Gestionar cursos"
        description="Administra tus cursos"
        onClick={() => {}}
      />
    )
    const iconSpan = container.querySelector('.action-card-icon')
    expect(iconSpan).toHaveClass('icon-profesor')
    const iconElement = container.querySelector('i')
    expect(iconElement).toHaveClass('ti', 'ti-clipboard-list')
  })

  // Test para verificar que se ejecuta la función onClick al hacer clic en la tarjeta
  it('ejecuta onClick cuando se hace clic en el botón', () => {
    const handleClick = vi.fn()
    render(
      <ActionCard
        icon="ti-school"
        title="Mi perfil"
        description="Ver información personal"
        onClick={handleClick}
      />
    )
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  // Test para verificar que se renderiza sin iconClass si no se proporciona
  it('renderiza sin iconClass si no se proporciona', () => {
    const { container } = render(
      <ActionCard
        icon="ti-calendar"
        title="Calendario"
        description="Ver eventos"
        onClick={() => {}}
      />
    )
    const iconSpan = container.querySelector('.action-card-icon')
    expect(iconSpan).toHaveClass('action-card-icon')
    expect(iconSpan.className).toBe('action-card-icon ')
  })
})