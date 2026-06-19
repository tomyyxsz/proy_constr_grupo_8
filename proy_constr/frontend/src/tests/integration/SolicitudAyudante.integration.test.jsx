import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import SolicitudesAyudante from '../../components/SolicitudesAyudante' // Ajusta la ruta

import { aprobarSolicitud, rechazarSolicitud } from '../../api/ApiGestionImpresion.js'
vi.mock('../../api/ApiGestionImpresion.js', () => ({
  aprobarSolicitud: vi.fn(),
  rechazarSolicitud: vi.fn(),
}))

import Swal from 'sweetalert2'
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}))

describe('SolicitudesAyudante', () => {
  const mockOnClose = vi.fn()
  const mockOnRefresh = vi.fn()
  const mockIdAyudante = 1

  // Datos de prueba simulando la respuesta del backend
  const mockSolicitudes = [
    {
      id: 1, 
      idImpresion: 101, 
      solicitanteNombre: 'Estudiante Prueba',
      solicitanteEmail: 'estudiante@test.com',
      urlModelo3d: 'https://ejemplo.com/modelo.stl',
      tipoSolicitud: 'ACADEMICA',
      estadoImpresion: 'PENDIENTE',
      estado: 'PENDIENTE',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Testeamos que el componente renderice correctamente la tabla con las solicitudes proporcionadas
  it('renderiza correctamente la tabla con las solicitudes', () => {
    render(
      <SolicitudesAyudante
        solicitudes={mockSolicitudes}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
        idAyudante={mockIdAyudante}
      />
    )

    // Verificamos que se muestren los datos del estudiante
    expect(screen.getByText('Estudiante Prueba')).toBeInTheDocument()
    // expect(screen.getByText('https://ejemplo.com/modelo.stl')).toBeInTheDocument()
    expect(screen.getByText('PENDIENTE')).toBeInTheDocument()
  })

  it('abre el menú desplegable al hacer clic en el estado', () => {
    render(
      <SolicitudesAyudante
        solicitudes={mockSolicitudes}
        onClose={mockOnClose}
        onRefresh={mockOnRefresh}
        idAyudante={mockIdAyudante}
      />
    )

    expect(screen.queryByText('Cambiar estado:')).not.toBeInTheDocument()
    const botonEstado = screen.getByText(/PENDIENTE/)
    fireEvent.click(botonEstado)
    expect(screen.getByText('Cambiar estado:')).toBeInTheDocument()
    expect(screen.getByText('EN_PROGRESO')).toBeInTheDocument()
    expect(screen.getByText('RECHAZADA')).toBeInTheDocument()
  })

  describe('Flujo de Cambio de Estados', () => {
    it('permite cambiar a EN_PROGRESO y llama a aprobarSolicitud', async () => {
      aprobarSolicitud.mockResolvedValueOnce({ status: 200 })
      
      // Simulamos que el ayudante escribe una observación en el SweetAlert y confirma
      Swal.fire.mockResolvedValueOnce({ value: 'Empezando a imprimir pronto' })

      render(
        <SolicitudesAyudante
          solicitudes={mockSolicitudes}
          onClose={mockOnClose}
          onRefresh={mockOnRefresh}
          idAyudante={mockIdAyudante}
        />
      )

      fireEvent.click(screen.getByText(/PENDIENTE/))

      fireEvent.click(screen.getByText('EN_PROGRESO'))

      expect(Swal.fire).toHaveBeenCalledTimes(1)

      await waitFor(() => {
        expect(aprobarSolicitud).toHaveBeenCalledWith(101, mockIdAyudante, 'Empezando a imprimir pronto')
        expect(mockOnRefresh).toHaveBeenCalledTimes(1)
      })
    })

    // Testeamos que al elegir RECHAZADA se abra el SweetAlert para ingresar el motivo y luego se llame a la API con ese motivo
    it('permite cambiar a RECHAZADA y llama a rechazarSolicitud', async () => {
      rechazarSolicitud.mockResolvedValueOnce({ status: 200 })

      Swal.fire.mockResolvedValueOnce({ value: 'Archivo corrupto' })

      render(
        <SolicitudesAyudante
          solicitudes={mockSolicitudes}
          onClose={mockOnClose}
          onRefresh={mockOnRefresh}
          idAyudante={mockIdAyudante}
        />
      )

      fireEvent.click(screen.getByText(/PENDIENTE/))
      fireEvent.click(screen.getByText('RECHAZADA'))

      expect(Swal.fire).toHaveBeenCalledTimes(1)

      await waitFor(() => {
        expect(rechazarSolicitud).toHaveBeenCalledWith(101, mockIdAyudante, 'Archivo corrupto')
        expect(mockOnRefresh).toHaveBeenCalledTimes(1)
      })
    })

    // Testeamos que si el usuario no ingresa un motivo al rechazar, la operación se cancele y no se llame a la API ni se refresque
    it('cancela la operación si no se ingresa un motivo al rechazar', async () => {
      // Simulamos que el usuario cierra el SweetAlert sin escribir nada
      Swal.fire.mockResolvedValueOnce({ value: undefined })

      render(
        <SolicitudesAyudante
          solicitudes={mockSolicitudes}
          onClose={mockOnClose}
          onRefresh={mockOnRefresh}
          idAyudante={mockIdAyudante}
        />
      )

      fireEvent.click(screen.getByText(/PENDIENTE/))
      fireEvent.click(screen.getByText('RECHAZADA'))

      await waitFor(() => {
        expect(Swal.fire).toHaveBeenCalledTimes(1)
      })
      
      expect(rechazarSolicitud).not.toHaveBeenCalled()
      expect(mockOnRefresh).not.toHaveBeenCalled()
    })
  })
})
