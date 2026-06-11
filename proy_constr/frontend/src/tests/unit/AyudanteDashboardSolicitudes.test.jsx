import { describe, expect, test } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import AyudanteDashboard from '../../components/dashboard/AyudanteDashboard'

describe('AyudanteDashboard - solicitudes de impresión', () => {
  test('debería mostrar las solicitudes enviadas por estudiantes', () => {
    const solicitudes = [
      {
        idImpresion: 'imp-1',
        solicitanteNombre: 'Agustin',
        solicitanteApellido: 'Valderrama',
        solicitanteEmail: 'tcorvalan@prueba.com',
        tipoSolicitud: 'ACADEMICA',
        nombreCurso: 'ICC',
        estadoImpresion: 'PENDIENTE',
        creadoEn: '2026-06-04T12:00:00Z',
      },
    ]

    render(<AyudanteDashboard solicitudes={solicitudes} />)

   //expect(screen.getByRole('button', { name: /Solicitudes de impresión/i })).toBeInTheDocument()

   //fireEvent.click(screen.getByRole('button', { name: /Solicitudes de impresión/i }))

    //expect(screen.getByText(/Solicitudes de impresión/i)).toBeInTheDocument()
    expect(screen.getByText(/Agustin Valderrama/i)).toBeInTheDocument()
    expect(screen.getByText(/tcorvalan@prueba.com/i)).toBeInTheDocument()
    expect(screen.getByText(/ACADEMICA/i)).toBeInTheDocument()
    expect(screen.getByText(/PENDIENTE/i)).toBeInTheDocument()
    expect(screen.getByText(/ICC/i)).toBeInTheDocument()
  })
})