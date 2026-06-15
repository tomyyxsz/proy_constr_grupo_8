import { describe, expect, test } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import StudentDashboard from '../../components/dashboard/StudentDashboard'

describe('StudentDashboard - solicitud de impresión', () => {
  test('debería abrir un formulario de solicitud de impresión con los campos del schema', () => {
    render(<StudentDashboard user={{ id: '1', role: 'ESTUDIANTE', name: 'Test User' }} />)

    expect(screen.getByRole('button', { name: /Solicitar impresión/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Solicitar impresión/i }))

    //expect(screen.getByText(/Nueva solicitud de impresión/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Color 1/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Color 2/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Color 3/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Tipo de solicitud/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Comentario/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/URL del modelo 3D/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/URL del archivo STL/i)).toBeInTheDocument()
  })
})