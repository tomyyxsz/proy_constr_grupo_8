import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import SolicitudesAyudante from '../../components/SolicitudesAyudante'

describe('SolicitudesAyudante - solicitudes de impresión', () => {
  test('debería mostrar las solicitudes enviadas por estudiantes', () => {
    const solicitudes = [
      {
        id: 'imp-1',
        solicitanteNombre: 'Agustin Valderrama',  // nombre único que no choca con headers
        solicitanteEmail: 'est@est.com',
        tipoSolicitud: 'PERSONAL',
        urlModelo3d: 'https://Prueba.com',
        estado: 'Pendiente',
      },
    ]

    render(
      <SolicitudesAyudante
        solicitudes={solicitudes}
        onClose={() => {}}
      />
    )

    expect(screen.getByText(/Agustin Valderrama/i)).toBeInTheDocument()
    expect(screen.getByText(/https:\/\/Prueba.com/i)).toBeInTheDocument()
    expect(screen.getByText(/est@est.com/i)).toBeInTheDocument()
    expect(screen.getByText(/PERSONAL/i)).toBeInTheDocument()
    expect(screen.getByText(/Pendiente/i)).toBeInTheDocument()
  })
})