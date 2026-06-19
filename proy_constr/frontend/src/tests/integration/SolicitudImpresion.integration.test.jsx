import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import SolicitudImpresionForm from '../../components/SolicitudImpresionForm'
import { crearSolicitudImpresion } from '../../api/ApiSolicitudImpresion'

vi.mock('../../api/ApiSolicitudImpresion', () => ({
  crearSolicitudImpresion: vi.fn(),
}))

describe('SolicitudImpresionForm', () => {
  const mockUser = { id: 1, nombre: 'Estudiante Test' }
  const mockOnClose = vi.fn()
  const mockOnSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const renderComponent = (isOpen = true) => {
    return render(
      <SolicitudImpresionForm
        user={mockUser}
        isOpen={isOpen}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    )
  }

  // Testeamos la renderización y comportamiento del formulario
  it('renderiza correctamente el formulario por defecto (Académica)', () => {
    renderComponent()
    
    expect(screen.getByText('Nueva solicitud de impresión')).toBeInTheDocument()
    expect(screen.getByLabelText(/Tipo de solicitud/i)).toHaveValue('ACADEMICA')
    expect(screen.getByLabelText(/Código del curso/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/URL del modelo 3D/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/URL del archivo STL/i)).toBeInTheDocument()
  })

  // Testeamos el cambio de tipo de solicitud y la aparición/desaparición del campo de código de curso
  it('oculta el campo de Código de curso al cambiar a solicitud PERSONAL', () => {
    renderComponent()
    
    const tipoSelect = screen.getByLabelText(/Tipo de solicitud/i)
    fireEvent.change(tipoSelect, { target: { value: 'PERSONAL' } })

    expect(screen.queryByLabelText(/Código del curso/i)).not.toBeInTheDocument()
  })

  describe('Validaciones', () => {
    // Testeamos que se muestren errores si los campos obligatorios no están completos o son inválidos
    it('muestra error si los campos de URL están vacíos al enviar', async () => {
      const { container } = renderComponent()
      const form = container.querySelector('#solicitud-form')
      fireEvent.submit(form)

      expect(screen.getByText('Debes ingresar las URLs del modelo 3D y el archivo STL.')).toBeInTheDocument()
      expect(crearSolicitudImpresion).not.toHaveBeenCalled()
    })

    // Testeamos que se muestren errores si las URLs no son válidas
    it('muestra error si la URL no comienza con http o https', async () => {
      const { container } = renderComponent()
      
      fireEvent.change(screen.getByLabelText(/URL del modelo 3D/i), { target: { value: 'www.modelo.com' } })
      fireEvent.change(screen.getByLabelText(/URL del archivo STL/i), { target: { value: 'https://ejemplo.com/archivo.stl' } })
      
      const form = container.querySelector('#solicitud-form')
      fireEvent.submit(form)

      expect(screen.getByText('La URL del modelo 3D no es válida (debe empezar con http:// o https://).')).toBeInTheDocument()
    })

    // Testeamos que se muestre error si es solicitud académica y falta el código del curso
    it('muestra error si es académica y falta el código del curso', async () => {
      const { container } = renderComponent()
      
      fireEvent.change(screen.getByLabelText(/URL del modelo 3D/i), { target: { value: 'https://ejemplo.com/mod.glb' } })
      fireEvent.change(screen.getByLabelText(/URL del archivo STL/i), { target: { value: 'https://ejemplo.com/mod.stl' } })
      
      const form = container.querySelector('#solicitud-form')
      fireEvent.submit(form)

      expect(screen.getByText('Para una solicitud académica debes ingresar el código del curso.')).toBeInTheDocument()
    })
  })

  describe('Envío exitoso', () => {
    // Testeamos que al enviar un formulario válido se llame a la API, se muestre el mensaje de éxito y se ejecuten los callbacks correspondientes
    it('llama a la API, muestra éxito y ejecuta callbacks tras el timeout', async () => {
      crearSolicitudImpresion.mockResolvedValueOnce({
        impresion: { idImpresion: 'IMP-123' }
      })

      const { container } = renderComponent()
      fireEvent.change(screen.getByLabelText(/URL del modelo 3D/i), { target: { value: 'https://ejemplo.com/modelo.glb' } })
      fireEvent.change(screen.getByLabelText(/URL del archivo STL/i), { target: { value: 'https://ejemplo.com/archivo.stl' } })
      fireEvent.change(screen.getByLabelText(/Código del curso/i), { target: { value: 'INF123' } })
      fireEvent.change(screen.getByLabelText(/Comentario/i), { target: { value: 'Impresión de prueba' } })

      const form = container.querySelector('#solicitud-form')
      await act(async () => {
        fireEvent.submit(form)
      })
      expect(screen.getByText('¡Solicitud enviada correctamente!')).toBeInTheDocument()
      
      // Verificamos que se llamó a la API con los datos correctos
      expect(crearSolicitudImpresion).toHaveBeenCalledWith(expect.objectContaining({
        idEstudiante: mockUser.id,
        tipoSolicitud: 'ACADEMICA',
        urlModelo3d: 'https://ejemplo.com/modelo.glb',
        urlModeloStl: 'https://ejemplo.com/archivo.stl',
        refCurso: 'INF123',
      }))

      expect(mockOnSuccess).toHaveBeenCalledTimes(1)

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
  })
})