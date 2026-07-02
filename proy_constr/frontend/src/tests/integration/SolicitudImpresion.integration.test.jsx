import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import SolicitudImpresionForm from '../../components/SolicitudImpresionForm'
import { crearSolicitudImpresion } from '../../api/ApiSolicitudImpresion'

vi.mock('../../api/ApiSolicitudImpresion', () => ({
  crearSolicitudImpresion: vi.fn(),
}))

// Mock para simular que se suben archivos a Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://supabase.mock/archivo.ext' } })
      }))
    }
  }))
}))

describe('SolicitudImpresionForm', () => {
  const mockUser = { id: 1, rut: '12.345.678-9', email: 'test@estudiante.cl', nombre: 'Estudiante Test' }
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
  it('renderiza correctamente el formulario por defecto', () => {
    renderComponent()
    
    expect(screen.getByText('Nueva solicitud de impresión')).toBeInTheDocument()
    expect(screen.getByLabelText(/Tipo de solicitud/i)).toHaveValue('ACADEMICA')
    expect(screen.getByLabelText(/Código del curso/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Archivo Modelo 3D/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Archivo Stl/i)).toBeInTheDocument()
  })

  // Testeamos el cambio de tipo de solicitud y la aparición/desaparición del campo de código de curso
  it('oculta el campo de Código de curso al cambiar a solicitud PERSONAL', () => {
    renderComponent()
    
    const tipoSelect = screen.getByLabelText(/Tipo de solicitud/i)
    fireEvent.change(tipoSelect, { target: { value: 'PERSONAL' } })

    expect(screen.queryByLabelText(/Código del curso/i)).not.toBeInTheDocument()
  })

  describe('Validaciones', () => {
    // Testeamos que pida los archivos si no se han subido
    it('muestra error si no se adjuntan los archivos al enviar', async () => {
      const { container } = renderComponent()
      const form = container.querySelector('#solicitud-form')
      fireEvent.submit(form)

      expect(screen.getByText('Debes adjuntar el archivo modelo 3D')).toBeInTheDocument()
      expect(crearSolicitudImpresion).not.toHaveBeenCalled()
    })

    // Testeamos que se muestre error si es solicitud académica y falta el código del curso
    it('muestra error si es académica y falta el código del curso', async () => {
      const { container } = renderComponent()
      const file3D = new File(['3d content'], 'modelo.glb', { type: 'model/gltf-binary' })
      const fileStl = new File(['stl content'], 'modelo.stl', { type: 'application/sla' })
      
      fireEvent.change(screen.getByLabelText(/Archivo Modelo 3D/i), { target: { files: [file3D] } })
      fireEvent.change(screen.getByLabelText(/Archivo Stl/i), { target: { files: [fileStl] } })
      
      const form = container.querySelector('#solicitud-form')
      fireEvent.submit(form)

      expect(screen.getByText('Para una solicitud académica debes ingresar el código del curso.')).toBeInTheDocument()
    })
  })

  describe('Envío exitoso', () => {
    // Testeamos el flujo completo de éxito con archivos
    it('llama a la API, muestra éxito y ejecuta callbacks tras el timeout', async () => {
      crearSolicitudImpresion.mockResolvedValueOnce({
        impresion: { idImpresion: 'IMP-123' }
      })
      const { container } = renderComponent()
      const file3D = new File(['3d content'], 'modelo.glb', { type: 'model/gltf-binary' })
      const fileStl = new File(['stl content'], 'modelo.stl', { type: 'application/sla' })
      
      fireEvent.change(screen.getByLabelText(/Archivo Modelo 3D/i), { target: { files: [file3D] } })
      fireEvent.change(screen.getByLabelText(/Archivo Stl/i), { target: { files: [fileStl] } })
      fireEvent.change(screen.getByLabelText(/Código del curso/i), { target: { value: 'INF123' } })
      fireEvent.change(screen.getByLabelText(/Comentario/i), { target: { value: 'Impresión de prueba' } })

      const form = container.querySelector('#solicitud-form')
      await act(async () => {
        fireEvent.submit(form)
      })
      
      expect(screen.getByText('¡Solicitud enviada correctamente!')).toBeInTheDocument()

      expect(crearSolicitudImpresion).toHaveBeenCalledWith(expect.objectContaining({
        idUsuario: mockUser.id,
        color1: '#000000',
        color2: '#ffffff',
        color3: '#ff0000',
        tipoSolicitud: 'ACADEMICA',
        comentario: 'Impresión de prueba',
        urlModelo3d: 'https://supabase.mock/archivo.ext', 
        urlModeloStl: 'https://supabase.mock/archivo.ext',
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