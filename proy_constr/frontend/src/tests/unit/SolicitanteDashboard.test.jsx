import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import SolicitanteDashboard from '../../components/dashboard/SolicitanteDashboard';

window.fetch = vi.fn();

vi.mock('../../components/SolicitudesEstudiante', () => ({
  default: ({ onClose }) => (
    <div data-testid="modal-solicitudes">
      <button onClick={onClose}>Cerrar Solicitudes</button>
    </div>
  )
}));

vi.mock('../../components/SolicitudImpresionForm', () => ({
  default: ({ onClose, onSuccess }) => (
    <div data-testid="modal-form">
      <button onClick={onClose}>Cerrar Formulario</button>
      <button onClick={onSuccess}>Simular Exito</button>
    </div>
  )
}));

describe('SolicitanteDashboard', () => {
  const mockUser = { id: '123', nombre: 'Test Estudiante' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Carga de datos', () => {
    test('ejecuta el fetch exitosamente al montar el componente', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 1, estado: 'Pendiente' }]
      });

      render(<SolicitanteDashboard user={mockUser} />);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/usuario/123'));
      });
    });

    test('maneja error cuando el servidor responde pero no está OK (!response.ok)', async () => {
      fetch.mockResolvedValueOnce({
        ok: false
      });

      render(<SolicitanteDashboard user={mockUser} />);

      expect(await screen.findByText(/No se pudieron sincronizar los datos: Error al conectar con el servidor/i)).toBeInTheDocument();
    });

    test('atrapa errores de red en el catch', async () => {
      fetch.mockRejectedValueOnce(new Error('Error de conexión a internet'));

      render(<SolicitanteDashboard user={mockUser} />);

      expect(await screen.findByText(/No se pudieron sincronizar los datos: Error de conexión a internet/i)).toBeInTheDocument();
    });
  });

  describe('Interacciones con ActionCards y Modales', () => {
    test('abre y cierra el formulario de impresión, y maneja el éxito de la solicitud', async () => {
      fetch.mockResolvedValue({ ok: true, json: async () => [] });
      render(<SolicitanteDashboard user={mockUser} />);

      const btnSolicitar = await screen.findByText('Solicitar impresión');
      fireEvent.click(btnSolicitar);
      
      expect(screen.getByTestId('modal-form')).toBeInTheDocument();

      const btnExito = screen.getByText('Simular Exito');
      fireEvent.click(btnExito);
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(2); 
      });

      const btnCerrar = screen.getByText('Cerrar Formulario');
      fireEvent.click(btnCerrar);
      
      expect(screen.queryByTestId('modal-form')).not.toBeInTheDocument();
    });

    test('abre y cierra la vista de Mis Solicitudes, activando el useEffect dependiente', async () => {
      fetch.mockResolvedValue({ ok: true, json: async () => [] });
      render(<SolicitanteDashboard user={mockUser} />);

      const btnMisSolicitudes = await screen.findByText('Mis solicitudes');
      fireEvent.click(btnMisSolicitudes);

      expect(screen.getByTestId('modal-solicitudes')).toBeInTheDocument();

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(2);
      });

      const btnCerrar = screen.getByText('Cerrar Solicitudes');
      fireEvent.click(btnCerrar);

      expect(screen.queryByTestId('modal-solicitudes')).not.toBeInTheDocument();
    });
  });
});