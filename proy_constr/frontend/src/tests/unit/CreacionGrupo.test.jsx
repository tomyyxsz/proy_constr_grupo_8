import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import CreacionGrupo from '../../components/CreacionGrupo'; // Ajusta la ruta si es necesario
import { crearGrupo, obtenerCursos } from '../../api/ApiCreacionGrupo';

vi.mock('../../api/ApiCreacionGrupo', () => ({
  crearGrupo: vi.fn(),
  obtenerCursos: vi.fn(),
}));

describe('CreacionGrupo', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    const mockUser = { id: 'prof-123', nombre: 'Profesor Test' };
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'user') return JSON.stringify(mockUser);
      return null;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Carga inicial', () => {
    test('carga los cursos exitosamente al abrir el modal', async () => {
      obtenerCursos.mockResolvedValueOnce({
        cursos: [
          { idCurso: 'cur-1', nombreCurso: 'Matemáticas' },
          { idCurso: 'cur-2', nombreCurso: 'Física' }
        ]
      });

      render(<CreacionGrupo onClose={mockOnClose} />);

      expect(screen.getByText('Cargando cursos...')).toBeInTheDocument();

      await waitFor(() => {
        expect(obtenerCursos).toHaveBeenCalledWith('prof-123');
        expect(screen.getByRole('combobox', { name: /Curso/i })).toBeInTheDocument();
      });

      expect(screen.getByText('Matemáticas')).toBeInTheDocument();
      expect(screen.getByText('Física')).toBeInTheDocument();
    });

    test('muestra error si falla la carga de cursos', async () => {
      obtenerCursos.mockRejectedValueOnce(new Error('Error del servidor al buscar cursos'));

      render(<CreacionGrupo onClose={mockOnClose} />);

      expect(await screen.findByText('Error del servidor al buscar cursos')).toBeInTheDocument();
    });
  });

  describe('Validaciones del Formulario', () => {
    beforeEach(() => {
      obtenerCursos.mockResolvedValue({ cursos: [{ idCurso: 'cur-1', nombreCurso: 'Matemáticas' }] });
    });

    test('muestra error si se envía el formulario sin nombre de grupo', async () => {
      render(<CreacionGrupo onClose={mockOnClose} />);
      
      await screen.findByRole('combobox');

      fireEvent.click(screen.getByTestId('crearGrupo'));

      expect(screen.getByText('Debe ingresar el nombre del grupo.')).toBeInTheDocument();
      expect(crearGrupo).not.toHaveBeenCalled();
    });

    test('muestra error si se ingresa nombre pero no se selecciona curso', async () => {
      render(<CreacionGrupo onClose={mockOnClose} />);
      await screen.findByRole('combobox');

      fireEvent.change(screen.getByLabelText(/Nombre del Grupo/i), { target: { value: 'Grupo Alpha' } });
      fireEvent.click(screen.getByTestId('crearGrupo'));

      expect(screen.getByText('Debe seleccionar un curso para el grupo.')).toBeInTheDocument();
      expect(crearGrupo).not.toHaveBeenCalled();
    });

    test('muestra error si no hay un profesor en localStorage', async () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
      
      render(<CreacionGrupo onClose={mockOnClose} />);
      await screen.findByRole('combobox');

      fireEvent.change(screen.getByLabelText(/Nombre del Grupo/i), { target: { value: 'Grupo Alpha' } });
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'cur-1' } });
      
      fireEvent.click(screen.getByTestId('crearGrupo'));

      expect(screen.getByText('No se encontró el profesor autenticado.')).toBeInTheDocument();
      expect(crearGrupo).not.toHaveBeenCalled();
    });
  });

  describe('Envío del Formulario', () => {
    beforeEach(() => {
      obtenerCursos.mockResolvedValue({ cursos: [{ idCurso: 'cur-1', nombreCurso: 'Matemáticas' }] });
    });

    test('crea el grupo exitosamente y muestra mensaje de éxito', async () => {
      crearGrupo.mockResolvedValueOnce({}); 

      render(<CreacionGrupo onClose={mockOnClose} />);
      await screen.findByRole('combobox');

      fireEvent.change(screen.getByLabelText(/Nombre del Grupo/i), { target: { value: 'Grupo Alpha' } });
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'cur-1' } });
      
      fireEvent.click(screen.getByTestId('crearGrupo'));

      expect(screen.getByTestId('crearGrupo')).toHaveTextContent('Creando...');
      expect(screen.getByTestId('crearGrupo')).toBeDisabled();

      await waitFor(() => {
        expect(crearGrupo).toHaveBeenCalledWith({
          refCurso: 'cur-1',
          nombreGrupo: 'Grupo Alpha',
        });
      });

      expect(screen.getByText('Grupo creado exitosamente.')).toBeInTheDocument();
    });

    test('muestra error si la API de crear grupo falla', async () => {
      crearGrupo.mockRejectedValueOnce(new Error('El nombre del grupo ya existe'));

      render(<CreacionGrupo onClose={mockOnClose} />);
      await screen.findByRole('combobox');

      fireEvent.change(screen.getByLabelText(/Nombre del Grupo/i), { target: { value: 'Grupo Repetido' } });
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'cur-1' } });
      
      fireEvent.click(screen.getByTestId('crearGrupo'));

      expect(await screen.findByText('El nombre del grupo ya existe')).toBeInTheDocument();
    });
  });

  describe('Interacciones secundarias', () => {
    test('llama a la función onClose al hacer clic en Cancelar', () => {
      render(<CreacionGrupo onClose={mockOnClose} />);
      
      fireEvent.click(screen.getByText('Cancelar'));
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});