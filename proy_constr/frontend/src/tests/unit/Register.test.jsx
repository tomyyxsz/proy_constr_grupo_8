import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import Register from '../../pages/Register'

vi.mock('../../api/ApiRegistro', () => ({
  registerUser: vi.fn(),
}))

describe('Register', () => {
  const onRegister = vi.fn()
  const onLoginClick = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sanitiza el RUT al escribir caracteres no permitidos', () => {
    render(<Register onRegister={onRegister} onLoginClick={onLoginClick} />)

    const rutInput = screen.getByPlaceholderText(/rut/i)
    fireEvent.change(rutInput, { target: { value: '12.345.678-kabc' } })

    expect(rutInput).toHaveValue('12345678-K')
  })

  it('muestra un error cuando se envía el formulario incompleto', () => {
    render(<Register onRegister={onRegister} onLoginClick={onLoginClick} />)

    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }))

    expect(screen.getByRole('alert')).toHaveTextContent('Completa todos los campos')
    expect(onRegister).not.toHaveBeenCalled()
  })

  it('permite mostrar y ocultar la contraseña', () => {
    render(<Register onRegister={onRegister} onLoginClick={onLoginClick} />)

    const passwordInput = screen.getByPlaceholderText('Contraseña')
    const toggleButton = screen.getByTitle('Mostrar contraseña')

    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(toggleButton).toHaveAttribute('title', 'Mostrar contraseña')

    fireEvent.click(toggleButton)

    expect(passwordInput).toHaveAttribute('type', 'text')
    expect(screen.getByPlaceholderText('Confirmar contraseña')).toHaveAttribute('type', 'text')
    expect(screen.getByTitle('Ocultar contraseña')).toBeInTheDocument()
  })
})