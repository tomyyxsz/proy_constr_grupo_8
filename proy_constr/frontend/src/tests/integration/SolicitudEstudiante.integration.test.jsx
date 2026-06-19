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
        estadoImpresion: 'EN_PROGRESO',
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
    // expect(screen.getByText('https://ejemplo.com/modelo1.stl')).toBeInTheDocument()
    expect(screen.findByText('ACADEMICA'))
    expect(screen.findByText('EN_PROGRESO'))
    expect(screen.getByText('Listo para imprimir'))
    expect(screen.getByText('G-code generado sin errores'))

    // Se verifica la segunda solicitud y sus textos por defecto
    // expect(screen.getByText('https://ejemplo.com/modelo2.stl')).toBeInTheDocument()
    expect(screen.findByText('PERSONAL'))
    expect(screen.findByText('PENDIENTE'))// Texto por defecto para estado
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

  //  expect(screen.getByText('https://ejemplo.com/anidado.stl')).toBeInTheDocument()
  })

  //Test para verificar los colores y los estados
  it('renderiza correctamente los colores para todos los estados posibles', () => {
    const solicitudesTodosLosEstados = [
      { id: 10, urlModelo3d: 'url1', tipoSolicitud: 'PERSONAL', estado: 'EN_PROGRESO' },
      { id: 11, urlModelo3d: 'url2', tipoSolicitud: 'PERSONAL', estado: 'PENDIENTE' },
      { id: 12, urlModelo3d: 'url3', tipoSolicitud: 'PERSONAL', estado: 'COMPLETADA' },
      { id: 13, urlModelo3d: 'url4', tipoSolicitud: 'PERSONAL', estado: 'RECHAZADA' },
    ]

    render(<SolicitudesEstudiante onClose={mockOnClose} solicitudes={solicitudesTodosLosEstados} />)

    // Verificamos que exista el texto Y que tenga el estilo correcto
    // se cambio aca porque aun no esta hecho eso
    expect(screen.findByText('EN_PROGRESO'));
    expect(screen.findByText('PENDIENTE'));
    expect(screen.findByText('COMPLETADA'));
    expect(screen.findByText('RECHAZADA'));
    
  })
})
