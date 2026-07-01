import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import Register from '../../pages/Register'

vi.mock('../../api/ApiRegistro', () => ({
  registerUser: vi.fn(),
}))

// Mock de useNavigate para evitar errores de navegación en los tests
describe('Register', () => {
  const onRegister = vi.fn()
  const onLoginClick = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Función auxiliar para llenar el formulario con valores válidos por defecto
  // Función auxiliar corregida
  const fillForm = (overrides = {}) => {
    fireEvent.change(screen.getByPlaceholderText(/rut/i), { target: { value: overrides.rut !== undefined ? overrides.rut : '21812636-7' } })
    fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: overrides.nombre !== undefined ? overrides.nombre : 'Tomas' } })
    fireEvent.change(screen.getByPlaceholderText('Apellidos'), { target: { value: overrides.apellidos !== undefined ? overrides.apellidos : 'Valdes' } })
    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), { target: { value: overrides.email !== undefined ? overrides.email : 'tomas@test.com' } })
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: overrides.password !== undefined ? overrides.password : 'Tomivaldes1!' } })
    fireEvent.change(screen.getByPlaceholderText('Confirmar contraseña'), { target: { value: overrides.confirmPassword !== undefined ? overrides.confirmPassword : 'Tomivaldes1!' } })
    
    const roleSelect = screen.getByRole('combobox')
    fireEvent.change(roleSelect, { target: { value: overrides.role !== undefined ? overrides.role : 'solicitante' } })
  }

  // Test para verificar que el componente se renderiza correctamente
  it('sanitiza el RUT al escribir caracteres no permitidos', () => {
    render(<Register onRegister={onRegister} onLoginClick={onLoginClick} />)

    const rutInput = screen.getByPlaceholderText(/rut/i)
    fireEvent.change(rutInput, { target: { value: '13.200.689-kabc' } })
    expect(rutInput).toHaveValue('13200689-K')
  })

  // Test para verificar que se muestra un error cuando el formulario se envía incompleto o con datos inválidos
  describe('Validaciones de formulario', () => {
    // Test para verificar que se muestra un error cuando el formulario se envía incompleto
    it('muestra error cuando se envía incompleto', async () => {
      render(<Register onRegister={onRegister} onLoginClick={onLoginClick} />)
      fireEvent.submit(screen.getByRole('button', { name: /registrarse/i }))
      expect(await screen.findByRole('alert')).toHaveTextContent('Completa todos los campos')
    })

    // Test para verificar que se muestra un error cuando el RUT tiene formato inválido
    it('valida formato de RUT', async () => {
      render(<Register onRegister={onRegister} onLoginClick={onLoginClick} />)
      fillForm({ rut: '13579' })
      fireEvent.submit(screen.getByRole('button', { name: /registrarse/i }))
      expect(await screen.findByRole('alert')).toHaveTextContent('Ingresa un RUT válido')
    })

    // Test para verificar que se muestra un error cuando el correo tiene formato inválido
    it('valida formato de correo', async () => {
      render(<Register onRegister={onRegister} onLoginClick={onLoginClick} />)
      fillForm({ email: 'correoinvalido' })
      const submitButton = screen.getByRole('button', { name: /registrarse/i })
      fireEvent.submit(submitButton.closest('form'))
      expect(await screen.findByRole('alert')).toHaveTextContent('Ingresa un correo válido')
    })

    // Test para verificar que se muestra un error cuando la contraseña es muy corta
    it('valida longitud mínima de contraseña', async () => {
      render(<Register onRegister={onRegister} onLoginClick={onLoginClick} />)
      fillForm({ password: 'Corta1!', confirmPassword: 'Corta1!' })
      const submitButton = screen.getByRole('button', { name: /registrarse/i })
      fireEvent.submit(submitButton.closest('form'))
      expect(await screen.findByRole('alert')).toHaveTextContent('La contraseña debe tener al menos 8 caracteres')
    })

    // Test para verificar que se muestra un error cuando la contraseña no cumple con los requisitos de seguridad
    it('valida que la contraseña tenga mayúsculas, minúsculas, números y símbolos', async () => {
      render(<Register onRegister={onRegister} onLoginClick={onLoginClick} />)
      
      // Sin mayúscula
      fillForm({ password: 'contrasena123!', confirmPassword: 'contrasena123!' })
      fireEvent.submit(screen.getByRole('button', { name: /registrarse/i }))
      expect(await screen.findByRole('alert')).toHaveTextContent('La contraseña debe tener al menos una letra mayúscula')

      // Sin minúscula
      fillForm({ password: 'CONTRASENA123!', confirmPassword: 'CONTRASENA123!' })
      fireEvent.submit(screen.getByRole('button', { name: /registrarse/i }))
      expect(await screen.findByRole('alert')).toHaveTextContent('La contraseña debe tener al menos una letra minúscula')

      // Sin número
      fillForm({ password: 'Contrasena!!!', confirmPassword: 'Contrasena!!!' })
      fireEvent.submit(screen.getByRole('button', { name: /registrarse/i }))
      expect(await screen.findByRole('alert')).toHaveTextContent('La contraseña debe tener al menos un número')

      // Sin símbolo
      fillForm({ password: 'Contrasena1234', confirmPassword: 'Contrasena1234' })
      fireEvent.submit(screen.getByRole('button', { name: /registrarse/i }))
      expect(await screen.findByRole('alert')).toHaveTextContent('La contraseña debe tener al menos un símbolo')
    })

    // Test para verificar que se muestra un error cuando las contraseñas no coinciden
    it('valida que las contraseñas coincidan', async () => {
      render(<Register onRegister={onRegister} onLoginClick={onLoginClick} />)
      fillForm({ password: 'Contrasena123!', confirmPassword: 'Contrasena123?' })
      fireEvent.submit(screen.getByRole('button', { name: /registrarse/i }))
      expect(await screen.findByRole('alert')).toHaveTextContent('Las contraseñas no coinciden')
    })
  })

  // Test para verificar que se puede mostrar y ocultar la contraseña
  it('permite mostrar y ocultar la contraseña', () => {
    render(<Register onRegister={onRegister} onLoginClick={onLoginClick} />)
    const passwordInput = screen.getByPlaceholderText('Contraseña')
    const toggleButton = screen.getByTitle('Mostrar contraseña')

    expect(passwordInput).toHaveAttribute('type', 'password')
    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
  })
})
