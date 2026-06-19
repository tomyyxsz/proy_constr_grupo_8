import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import AyudanteDashboard from '../../components/dashboard/AyudanteDashboard'

// Creamos simlacion del componente hijo para aislar el test del Dashboard
vi.mock('../../components/SolicitudesAyudante', () => ({
  default: ({ onClose, idAyudante, onRefresh }) => (
    <div data-testid="mock-solicitudes-ayudante">
      Panel de Ayudante (ID: {idAyudante})
      <button onClick={onClose}>Cerrar Panel</button>
      {/* Agregamos un botón para disparar el onRefresh del componente padre */}
      <button onClick={onRefresh}>Refrescar</button> 
    </div>
  )
}))

// Se simula la función de obtener todas las solicitudes para evitar llamadas reales a la API
vi.mock('../../api/ApiGestionImpresion.js', () => ({
  obtenerTodasLasSolicitudes: vi.fn()
}))

describe('Unitario: AyudanteDashboard', () => {
  // Configuración del usuario simulado en localStorage
  const mockUser = { id: 99, nombre: 'Ayudante Test', rol: 'ayudante' }

  beforeEach(() => {
    vi.clearAllMocks()
    
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => JSON.stringify(mockUser)),
    })

    // Simulamos la respuesta exitosa del fetch por defecto
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1, estado: 'PENDIENTE' }]),
      })
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  // Test para verificar que el componente renderiza las tarjetas de acción y el panel de solicitudes está oculto
  it('renderiza las tarjetas de acción y oculta el panel de solicitudes inicialmente', async () => {
    render(<AyudanteDashboard />)

    // Verificamos que las tarjetas estén en pantalla
    expect(screen.getByText('Mis solicitudes')).toBeInTheDocument()
    expect(screen.getByText('Filtrar solicitudes')).toBeInTheDocument()
    expect(screen.getByText('Reservas de sala')).toBeInTheDocument()

    expect(screen.queryByTestId('mock-solicitudes-ayudante')).not.toBeInTheDocument()
  })

  //test para ver si se hace fetch a la API y no muestra errores al cargar el dashboard
  it('hace fetch a la API al montarse y no muestra errores si es exitoso', async () => {
    render(<AyudanteDashboard />)

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(1)
      expect(globalThis.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/impresiones'))
    })
    expect(screen.queryByText(/No se pudieron sincronizar los datos/i)).not.toBeInTheDocument()
  })

  //Test para ver si se muestra un mensaje de error si el fetch falla al cargar el dashboard
  it('muestra un mensaje de error si el fetch falla al cargar el dashboard', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      })
    )

    render(<AyudanteDashboard />)
    await waitFor(() => {
      expect(screen.getByText(/Error al conectar con el servidor/i)).toBeInTheDocument()
    })
  })

  //Test para verificar que al hacer clic en la tarjeta "Mis solicitudes" se abre el panel de solicitudes y se pasa el ID del ayudante correctamente
  it('abre el panel de solicitudes al hacer clic en la tarjeta correspondiente y pasa el ID del ayudante', async () => {
    render(<AyudanteDashboard />)

    const tarjetaMisSolicitudes = screen.getByText('Mis solicitudes')
    fireEvent.click(tarjetaMisSolicitudes)

    expect(screen.getByTestId('mock-solicitudes-ayudante')).toBeInTheDocument()

    expect(screen.getByText(/Panel de Ayudante \(ID: 99\)/i)).toBeInTheDocument()
  })

  //Test para verificar que el botón de cerrar dentro del panel de solicitudes funciona correctamente
  it('cierra el panel de solicitudes correctamente', async () => {
    render(<AyudanteDashboard />)

    // Esperamos a que la petición inicial del useEffect termine silenciosamente
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled()
    })

    fireEvent.click(screen.getByText('Mis solicitudes'))
    expect(screen.getByTestId('mock-solicitudes-ayudante')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Cerrar Panel'))

    expect(screen.queryByTestId('mock-solicitudes-ayudante')).not.toBeInTheDocument()
  })
})