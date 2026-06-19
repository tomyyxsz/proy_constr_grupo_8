import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import StudentDashboard from '../../components/dashboard/StudentDashboard' 

//Creamos simulaciones de los componentes para aislar el Dashboard
vi.mock('../../components/SolicitudImpresionForm', () => ({
  default: ({ isOpen, onClose, onSuccess }) => isOpen ? (
    <div data-testid="mock-solicitud-form">
      Panel de Formulario
      <button onClick={onClose}>Cerrar Formulario</button>
      <button onClick={onSuccess}>Simular Éxito</button>
    </div>
  ) : null
}))

// Simulamos el componente de SolicitudesEstudiante para aislar el test del Dashboard
vi.mock('../../components/SolicitudesEstudiante', () => ({
  default: ({ onClose }) => (
    <div data-testid="mock-solicitudes-estudiante">
      Panel de Solicitudes Estudiante
      <button onClick={onClose}>Cerrar Solicitudes</button>
    </div>
  )
}))

// Por si ActionCard tiene lógica interna
vi.mock('../../components/ActionCard', () => ({
  default: ({ title, onClick }) => (
    <button data-testid={`card-${title}`} onClick={onClick}>
      {title}
    </button>
  )
}))

describe('StudentDashboard', () => {
  const mockUser = { id: 1, name: 'Estudiante Test', role: 'ESTUDIANTE' }

  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 101, estado: 'PENDIENTE' }]),
      })
    )
    vi.spyOn(console, 'log')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  // Test para verificar que el componente renderiza las tarjetas de acción y el panel de solicitudes está oculto
  it('renderiza las tarjetas y hace fetch a la API con el ID del estudiante al montarse', async () => {
    render(<StudentDashboard user={mockUser} />)

    expect(screen.getByTestId('card-Solicitar impresión')).toBeInTheDocument()
    expect(screen.getByTestId('card-Mis solicitudes')).toBeInTheDocument()
    expect(screen.getByTestId('card-Inscribirse en ayudantía')).toBeInTheDocument()

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(1)
      expect(globalThis.fetch).toHaveBeenCalledWith(expect.stringContaining(`/estudiante/${mockUser.id}`))
    })

    expect(screen.queryByTestId('mock-solicitud-form')).not.toBeInTheDocument()
    expect(screen.queryByTestId('mock-solicitudes-estudiante')).not.toBeInTheDocument()
  })

  //test para ver si se muestra un mensaje de error si el fetch falla al cargar el dashboard
  it('muestra un mensaje de error si el fetch de solicitudes falla', async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }))

    render(<StudentDashboard user={mockUser} />)

    // Esperamos a que el error se renderice en pantalla
    await waitFor(() => {
      expect(screen.getByText(/Error al conectar con el servidor/i)).toBeInTheDocument()
    })
  })

  describe('Interacciones con las tarjetas y modales', () => {
    // Test para verificar que al hacer clic en la tarjeta "Solicitar impresión" se abre el formulario
    it('abre y cierra el formulario de nueva solicitud, y maneja el onSuccess', () => {
      render(<StudentDashboard user={mockUser} />)

      fireEvent.click(screen.getByTestId('card-Solicitar impresión'))
      expect(screen.getByTestId('mock-solicitud-form')).toBeInTheDocument()

      fireEvent.click(screen.getByText('Simular Éxito'))
      expect(console.log).toHaveBeenCalledWith('Solicitud enviada exitosamente')

      fireEvent.click(screen.getByText('Cerrar Formulario'))
      expect(screen.queryByTestId('mock-solicitud-form')).not.toBeInTheDocument()
    })

    // Test para verificar que al hacer clic en la tarjeta "Mis solicitudes" se abre el panel de solicitudes
    it('abre y cierra el panel de mis solicitudes', () => {
      render(<StudentDashboard user={mockUser} />)

      fireEvent.click(screen.getByTestId('card-Mis solicitudes'))
      expect(screen.getByTestId('mock-solicitudes-estudiante')).toBeInTheDocument()

      fireEvent.click(screen.getByText('Cerrar Solicitudes'))
      expect(screen.queryByTestId('mock-solicitudes-estudiante')).not.toBeInTheDocument()
    })

    // Test para verificar que al hacer clic en la tarjeta "Inscribirse en ayudantía" no lanza errores
    it('ejecuta el onClick de Inscribirse en ayudantía sin romper la app', () => {
      render(<StudentDashboard user={mockUser} />)
      
      const cardAyudantia = screen.getByTestId('card-Inscribirse en ayudantía')
      fireEvent.click(cardAyudantia)

      expect(cardAyudantia).toBeInTheDocument()
    })
  })
})