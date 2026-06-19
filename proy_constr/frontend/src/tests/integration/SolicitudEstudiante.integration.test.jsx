import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import SolicitudesEstudiante from '../../components/SolicitudesEstudiante' // Ajusta la ruta si es necesario

describe('Componente: SolicitudesEstudiante', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  //Test para verificar que el componente maneja correctamente el estado de carga cuando solicitudes es null
  it('muestra el estado de carga cuando solicitudes es null', () => {
    render(<SolicitudesEstudiante onClose={mockOnClose} solicitudes={null} />)
    
    expect(screen.getByText('Cargando panel de solicitudes...')).toBeInTheDocument()
  })

  //Test para verificar que el componente maneja correctamente el formato de datos inválido
  it('muestra mensaje de error cuando los datos tienen un formato inválido', () => {
    // Simulamos un objeto que no es un array ni tiene .data o .solicitudes
    const datosInvalidos = { algo: 'incorrecto' }
    render(<SolicitudesEstudiante onClose={mockOnClose} solicitudes={datosInvalidos} />)
    
    expect(screen.getByText(/Los datos recibidos no tienen un formato válido/i)).toBeInTheDocument()
  })

  //Test para verificar que el componente maneja correctamente el caso de no tener solicitudes
  it('muestra mensaje indicando que no hay solicitudes cuando el arreglo está vacío', () => {
    render(<SolicitudesEstudiante onClose={mockOnClose} solicitudes={[]} />)
    
    expect(screen.getByText('No tienes solicitudes hechas.')).toBeInTheDocument()
  })

  //Test para verificar que el componente renderiza correctamente la tabla con datos completos e incompletos
  it('renderiza la tabla correctamente con datos completos e incompletos', () => {
    const mockSolicitudes = [
      {
        id: 1,
        urlModelo3d: 'https://ejemplo.com/modelo1.stl',
        tipoSolicitud: 'ACADEMICA',
        estado: 'Aprobado',
        observacionAyudante: 'Listo para imprimir',
        comentarioTecnico: 'G-code generado sin errores'
      },
      {
        id: 2,
        urlModelo3d: 'https://ejemplo.com/modelo2.stl',
        tipoSolicitud: 'PERSONAL',
        // Omitimos estado, observacion y comentario para probar los textos por defecto (fallbacks)
      }
    ]

    render(<SolicitudesEstudiante onClose={mockOnClose} solicitudes={mockSolicitudes} />)

    // Se verifica los datos de la primera solicitud
    expect(screen.getByText('https://ejemplo.com/modelo1.stl')).toBeInTheDocument()
    expect(screen.getByText('ACADEMICA')).toBeInTheDocument()
    expect(screen.getByText('Aprobado')).toBeInTheDocument()
    expect(screen.getByText('Listo para imprimir')).toBeInTheDocument()
    expect(screen.getByText('G-code generado sin errores')).toBeInTheDocument()

    // Se verifica la segunda solicitud y sus textos por defecto
    expect(screen.getByText('https://ejemplo.com/modelo2.stl')).toBeInTheDocument()
    expect(screen.getByText('PERSONAL')).toBeInTheDocument()
    expect(screen.getByText('Pendiente')).toBeInTheDocument() // Texto por defecto para estado
    expect(screen.getByText('No hay observaciones')).toBeInTheDocument() // Texto por defecto
    expect(screen.getByText('No hay comentarios técnicos')).toBeInTheDocument() // Texto por defecto
  })

  //Test para verificar que el botón de cerrar llama a la función onClose correctamente
  it('llama a la función onClose al hacer clic en el botón de cerrar (✕)', () => {
    render(<SolicitudesEstudiante onClose={mockOnClose} solicitudes={[]} />)
    
    const btnCerrar = screen.getByText('✕')
    fireEvent.click(btnCerrar)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  }) 

  //Test para verificar que el componente maneja correctamente datos anidados dentro del atributo "data"
  it('maneja correctamente datos anidados dentro del atributo "data"', () => {
    // Simulando cómo Axios a veces envuelve la respuesta en res.data
    const datosAnidados = {
      data: [
        {
          id: 1,
          urlModelo3d: 'https://ejemplo.com/anidado.stl',
          tipoSolicitud: 'ACADEMICA'
        }
      ]
    }

    render(<SolicitudesEstudiante onClose={mockOnClose} solicitudes={datosAnidados} />)

    expect(screen.getByText('https://ejemplo.com/anidado.stl')).toBeInTheDocument()
  })

  it('renderiza correctamente los colores (badges) para todos los estados posibles', () => {
    // Creamos un arreglo que cubra cada uno de los "if" de la función statusBadgeStyle
    const solicitudesTodosLosEstados = [
      { id: 10, urlModelo3d: 'url1', tipoSolicitud: 'PERSONAL', estado: 'Aprobado' },
      { id: 11, urlModelo3d: 'url2', tipoSolicitud: 'PERSONAL', estado: 'Pendiente' },
      { id: 12, urlModelo3d: 'url3', tipoSolicitud: 'PERSONAL', estado: 'Imprimiendo' },
      { id: 13, urlModelo3d: 'url4', tipoSolicitud: 'PERSONAL', estado: 'Rechazado' },
    ]

    render(<SolicitudesEstudiante onClose={mockOnClose} solicitudes={solicitudesTodosLosEstados} />)

    // Verificamos que se hayan renderizado todos en pantalla
    expect(screen.getByText('Aprobado')).toBeInTheDocument()
    expect(screen.getByText('Pendiente')).toBeInTheDocument()
    expect(screen.getByText('Imprimiendo')).toBeInTheDocument()
    expect(screen.getByText('Rechazado')).toBeInTheDocument()
  })
})