import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import ProfesorDashboard from '../../components/dashboard/ProfesorDashboard';
import { obtenerSolicitudesProfesor } from '../../api/ApiGestionImpresion';

vi.mock('../../api/ApiGestionImpresion', () => ({
  obtenerSolicitudesProfesor: vi.fn(),
}));

vi.mock('../../components/CreacionCurso', () => ({
  default: ({ onClose }) => <div data-testid="crear-curso"><button onClick={onClose}>Cerrar Curso</button></div>
}));
vi.mock('../../components/CreacionGrupo', () => ({
  default: ({ onClose }) => <div data-testid="crear-grupo"><button onClick={onClose}>Cerrar Grupo</button></div>
}));
vi.mock('../../components/GestionEstudiante', () => ({
  default: ({ onClose }) => <div data-testid="gestion-estudiantes"><button onClick={onClose}>Cerrar Gestion</button></div>
}));
vi.mock('../../components/SolicitudImpresionForm', () => ({
  default: ({ onClose, onSuccess }) => (
    <div data-testid="form-impresion">
      <button onClick={onClose}>Cerrar Form</button>
      <button onClick={onSuccess}>Simular Exito</button>
    </div>
  )
}));
vi.mock('../../components/SolicitudesAyudante', () => ({
  default: ({ onClose, onRefresh }) => (
    <div data-testid="solicitudes-ayudante">
      <button onClick={onClose}>Cerrar Solicitudes</button>
      <button onClick={onRefresh}>Actualizar</button>
    </div>
  )
}));

describe('ProfesorDashboard', () => {
  const mockUser = { id: 101, nombre: 'Profe Test' };
  let consoleErrorSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('Lógica de Fetching', () => {
    test('no hace fetch si el usuario no tiene id', async () => {
      render(<ProfesorDashboard user={null} />);
      
      fireEvent.click(screen.getByText('Solicitudes pendientes'));
      
      expect(obtenerSolicitudesProfesor).not.toHaveBeenCalled();
    });

    test('realiza el fetch correctamente al pedir solicitudes', async () => {
      obtenerSolicitudesProfesor.mockResolvedValueOnce([{ id: 1, estado: 'Pendiente' }]);
      render(<ProfesorDashboard user={mockUser} />);
      
      fireEvent.click(screen.getByText('Solicitudes pendientes'));
      
      await waitFor(() => {
        expect(obtenerSolicitudesProfesor).toHaveBeenCalledWith(101);
      });
      expect(screen.getByTestId('solicitudes-ayudante')).toBeInTheDocument();
    });

    test('atrapa errores en el catch si la API falla', async () => {
      obtenerSolicitudesProfesor.mockRejectedValueOnce(new Error('API caída'));
      render(<ProfesorDashboard user={mockUser} />);
      
      fireEvent.click(screen.getByText('Solicitudes pendientes'));
      
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith("Error al obtener solicitudes del profesor:", expect.any(Error));
      });
    });
  });

  describe('Interacción con ActionCards y Modales', () => {
    test('abre y cierra Crear Curso, probando stopPropagation', () => {
      render(<ProfesorDashboard user={mockUser} />);
      
      fireEvent.click(screen.getByText('Crear curso'));
      const modal = screen.getByTestId('crear-curso');
      expect(modal).toBeInTheDocument();

      fireEvent.click(modal.parentElement);

      fireEvent.click(screen.getByText('Cerrar Curso'));
      expect(screen.queryByTestId('crear-curso')).not.toBeInTheDocument();
    });

    test('abre y cierra Crear Grupo', () => {
      render(<ProfesorDashboard user={mockUser} />);
      
      fireEvent.click(screen.getByText('Crear grupo'));
      const modal = screen.getByTestId('crear-grupo');
      expect(modal).toBeInTheDocument();

      fireEvent.click(modal.parentElement); 
      
      fireEvent.click(screen.getByText('Cerrar Grupo'));
      expect(screen.queryByTestId('crear-grupo')).not.toBeInTheDocument();
    });

    test('abre y cierra Gestionar Estudiantes', () => {
      render(<ProfesorDashboard user={mockUser} />);
      
      fireEvent.click(screen.getByText('Gestionar estudiantes'));
      const modal = screen.getByTestId('gestion-estudiantes');
      expect(modal).toBeInTheDocument();

      fireEvent.click(modal.parentElement); 
      
      fireEvent.click(screen.getByText('Cerrar Gestion'));
      expect(screen.queryByTestId('gestion-estudiantes')).not.toBeInTheDocument();
    });

    test('abre form de impresión y simula éxito de solicitud', async () => {
      obtenerSolicitudesProfesor.mockResolvedValueOnce([]);
      render(<ProfesorDashboard user={mockUser} />);
      
      fireEvent.click(screen.getByText('Solicitar impresión'));
      expect(screen.getByTestId('form-impresion')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Simular Exito'));
      await waitFor(() => {
        expect(obtenerSolicitudesProfesor).toHaveBeenCalled();
      });

      fireEvent.click(screen.getByText('Cerrar Form'));
      expect(screen.queryByTestId('form-impresion')).not.toBeInTheDocument();
    });

    test('refresca y cierra Solicitudes Pendientes', () => {
      render(<ProfesorDashboard user={mockUser} />);
      
      fireEvent.click(screen.getByText('Solicitudes pendientes'));
      
      fireEvent.click(screen.getByText('Actualizar'));
      expect(obtenerSolicitudesProfesor).toHaveBeenCalled();

      fireEvent.click(screen.getByText('Cerrar Solicitudes'));
      expect(screen.queryByTestId('solicitudes-ayudante')).not.toBeInTheDocument();
    });

    test('clic en Gestionar Ayudantías', () => {
      render(<ProfesorDashboard user={mockUser} />);
      const btn = screen.getByText('Gestionar ayudantías');
      fireEvent.click(btn);
      expect(btn).toBeInTheDocument();
    });
  });
});