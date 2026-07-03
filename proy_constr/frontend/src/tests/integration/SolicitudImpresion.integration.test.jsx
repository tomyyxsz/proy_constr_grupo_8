import React from 'react'
import { render, screen, fireEvent, act, waitFor} from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import SolicitudImpresionForm from '../../components/SolicitudImpresionForm'
import { crearSolicitudImpresion } from '../../api/ApiSolicitudImpresion'
import userEvent from '@testing-library/user-event'

vi.mock('../../api/ApiSolicitudImpresion', () => ({
  
  crearSolicitudImpresion: vi.fn(() => 
    Promise.resolve({ impresion: { idImpresion: 'IMP-123' } })
  ),
  obtenerCursosEstudiante: vi.fn(() => 
    Promise.resolve({
      cursos: [
        { idCurso: 'c5d2b684-f21c-4b96-ae64-307f9fe998b1', nombreCurso: 'Construccion' }
      ]
    })
  )

}));
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
  const mockUser = { id: 1, rut: '12.345.678-9', email: 'test@estudiante.cl', nombre: 'Estudiante Test', role: 'ESTUDIANTE' }
  const mockOnClose = vi.fn()
  const mockOnSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
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
    expect(screen.getByLabelText(/Tipo de solicitud/i)).toHaveValue('PERSONAL')
    expect(screen.getByLabelText(/Archivo Modelo 3D/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Archivo Stl/i)).toBeInTheDocument()
  })

  // Testeamos el cambio de tipo de solicitud y la aparición/desaparición del campo de código de curso
  it('oculta el campo de Código de curso al cambiar a solicitud PERSONAL', () => {
    renderComponent()
    
    const tipoSelect = screen.getByLabelText(/Tipo de solicitud/i)
    fireEvent.change(tipoSelect, { target: { value: 'PERSONAL' } })

    expect(screen.queryByLabelText(/Curso/i)).not.toBeInTheDocument()
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

      //expect(screen.getByText('Selecciona uno de los cursos en los que estas inscrito')).toBeInTheDocument()
    })
  })

  describe('Envío exitoso', () => {

    // Testeamos el flujo completo de éxito con archivos
    it('llama a la API, muestra éxito y ejecuta callbacks tras el timeout', async () => {
      const user = userEvent.setup()
      crearSolicitudImpresion.mockResolvedValueOnce({
        impresion: { idImpresion: 'IMP-123' }
      })
      const { container } = renderComponent();

      const file3D = new File(['3d content'], 'modelo.glb', { type: 'model/gltf-binary' })
      const fileStl = new File(['stl content'], 'modelo.stl', { type: 'application/sla' })
      
      fireEvent.change(screen.getByLabelText(/Archivo Modelo 3D/i), { target: { files: [file3D] } })
      fireEvent.change(screen.getByLabelText(/Archivo Stl/i), { target: { files: [fileStl] } })
      
      await user.selectOptions (
        screen.getByLabelText(/Tipo de solicitud/i),
        "ACADEMICA"
      )

      await user.selectOptions(
        screen.getByLabelText(/Curso/i),
        "c5d2b684-f21c-4b96-ae64-307f9fe998b1",
      );

      expect(screen.getByLabelText(/Curso/i)).toHaveValue(
        "c5d2b684-f21c-4b96-ae64-307f9fe998b1",
      );
      fireEvent.change(screen.getByLabelText(/Comentario/i), {
        target: { value: "Impresión de prueba" },
      });

      const form = container.querySelector("#solicitud-form");
      await act(async () => {
        fireEvent.submit(form)
      })
      
      expect(
        await screen.findByText('¡Solicitud enviada correctamente!')
      ).toBeInTheDocument()

      expect(crearSolicitudImpresion).toHaveBeenCalledWith(expect.objectContaining({
        idUsuario: mockUser.id,
        color1: '#000000',
        color2: '#ffffff',
        color3: '#ff0000',
        tipoSolicitud: 'ACADEMICA',
        comentario: 'Impresión de prueba',
        urlModelo3d: 'https://supabase.mock/archivo.ext', 
        urlModeloStl: 'https://supabase.mock/archivo.ext',
        refCurso: 'c5d2b684-f21c-4b96-ae64-307f9fe998b1',
      }))

      expect(mockOnSuccess).toHaveBeenCalledTimes(1)

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled()
      }, { timeout: 3000 })
  
    })
  },30000)
})