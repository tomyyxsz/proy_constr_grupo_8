import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import GestionEstudiante from '../../components/GestionEstudiante';
import {
  obtenerAlumnosProfesor,
  agregarEstudianteAGrupo,
  obtenerGruposCurso,
  cambiarGrupoEstudiante,
} from '../../api/ApiCreacionGrupo.js';
import Swal from 'sweetalert2';

vi.mock('../../api/ApiCreacionGrupo.js', () => ({
  obtenerAlumnosProfesor: vi.fn(),
  agregarEstudianteAGrupo: vi.fn(),
  obtenerGruposCurso: vi.fn(),
  cambiarGrupoEstudiante: vi.fn(),
}));

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

describe('GestionEstudiante', () => {
  const mockOnClose = vi.fn();
  const profesorId = 'prof-1';

  const mockEstudiantes = [
    {
      id: 'est-1',
      nombre: 'Juan Perez',
      correo: 'juan@test.com',
      refCurso: 'curso-1',
      cursoNombre: 'Matemáticas',
      grupo: null,
      refGrupo: null
    },
    {
      id: 'est-2',
      nombre: 'Maria Lopez',
      correo: 'maria@test.com',
      refCurso: 'curso-1',
      cursoNombre: 'Matemáticas',
      grupo: 'Grupo A',
      refGrupo: 'grupo-a'
    },
    {
      id: 'est-3',
      nombre: 'Pedro Sin Curso',
      correo: 'pedro@test.com',
      refCurso: null, 
      cursoNombre: null,
      grupo: null,
      refGrupo: null
    }
  ];

  const mockGrupos = [
    { idGrupoCurso: 'grupo-a', nombreGrupo: 'Grupo A' },
    { idGrupoCurso: 'grupo-b', nombreGrupo: 'Grupo B' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Carga inicial', () => {
    test('carga estudiantes y sus grupos exitosamente', async () => {
      obtenerAlumnosProfesor.mockResolvedValueOnce({ estudiantes: mockEstudiantes });
      obtenerGruposCurso.mockResolvedValue(mockGrupos);

      render(<GestionEstudiante profesorId={profesorId} onClose={mockOnClose} />);

      expect(screen.getByText('Cargando estudiantes...')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('Juan Perez')).toBeInTheDocument();
      });

      expect(obtenerAlumnosProfesor).toHaveBeenCalledWith('prof-1');
      expect(obtenerGruposCurso).toHaveBeenCalledWith('curso-1');
      
      expect(screen.getAllByText('Asignar grupo')).toHaveLength(2); // Juan y Pedro
      expect(screen.getAllByText('Cambiar grupo')).toHaveLength(1); // Maria
    });

    test('muestra error si la carga falla', async () => {
      obtenerAlumnosProfesor.mockRejectedValueOnce(new Error('Falla en BD'));

      render(<GestionEstudiante profesorId={profesorId} onClose={mockOnClose} />);

      expect(await screen.findByText('Falla en BD')).toBeInTheDocument();
    });
  });

  describe('Interacción con el Modal Principal', () => {
    test('llama a onClose al presionar la X', async () => {
      obtenerAlumnosProfesor.mockResolvedValueOnce({ estudiantes: [] });
      render(<GestionEstudiante profesorId={profesorId} onClose={mockOnClose} />);
      
      await screen.findByRole('table');

      fireEvent.click(screen.getByText('X'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Asignar y Cambiar Grupo', () => {
    beforeEach(() => {
      obtenerAlumnosProfesor.mockResolvedValue({ estudiantes: mockEstudiantes });
      obtenerGruposCurso.mockResolvedValue(mockGrupos);
    });

    test('abre y cierra el modal secundario', async () => {
      render(<GestionEstudiante profesorId={profesorId} onClose={mockOnClose} />);
      await screen.findByText('Juan Perez');

      fireEvent.click(screen.getAllByText('Asignar grupo')[0]);
      
      const modalText = screen.getByText(/Asignar Grupo a Juan Perez/i);
      expect(modalText).toBeInTheDocument();

      fireEvent.click(modalText.closest('.modal-overlay'));
      expect(screen.queryByText(/Asignar Grupo a Juan Perez/i)).not.toBeInTheDocument();

      fireEvent.click(screen.getAllByText('Asignar grupo')[0]);
      
      fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
      expect(screen.queryByText(/Asignar Grupo a Juan Perez/i)).not.toBeInTheDocument();
    });

    test('cubre al hacer clic dentro del modal', async () => {
      render(<GestionEstudiante profesorId={profesorId} onClose={mockOnClose} />);
      await screen.findByText('Juan Perez');

      fireEvent.click(screen.getAllByText('Asignar grupo')[0]);
      
      const modalContent = screen.getByText(/Asignar Grupo a Juan Perez/i).closest('.modal-content');
      fireEvent.click(modalContent); // Esto ejecuta e.stopPropagation()
      
      expect(screen.getByText(/Asignar Grupo a Juan Perez/i)).toBeInTheDocument();
    });

    test('muestra error de SweetAlert si se intenta asignar sin seleccionar grupo', async () => {
      render(<GestionEstudiante profesorId={profesorId} onClose={mockOnClose} />);
      await screen.findByText('Juan Perez');

      fireEvent.click(screen.getAllByText('Asignar grupo')[0]);
      
      fireEvent.click(screen.getByRole('button', { name: 'Asignar' }));

      expect(Swal.fire).toHaveBeenCalledWith("Error", "Debe seleccionar un grupo y un estudiante.", "error");
      expect(agregarEstudianteAGrupo).not.toHaveBeenCalled();
    });

    test('Asignar nuevo grupo, ejecuta API, SweetAlert success y refresca la lista', async () => {
      agregarEstudianteAGrupo.mockResolvedValueOnce({});
      render(<GestionEstudiante profesorId={profesorId} onClose={mockOnClose} />);
      await screen.findByText('Juan Perez');

      fireEvent.click(screen.getAllByText('Asignar grupo')[0]);

      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'grupo-b' } });
      
      fireEvent.click(screen.getByRole('button', { name: 'Asignar' }));

      await waitFor(() => {
        expect(agregarEstudianteAGrupo).toHaveBeenCalledWith({ refGrupo: 'grupo-b', refEstudiante: 'est-1' });
        expect(Swal.fire).toHaveBeenCalledWith("Éxito", "Estudiante asignado al grupo correctamente.", "success");
        expect(obtenerAlumnosProfesor).toHaveBeenCalledTimes(2); 
      });
    });

    test('Cambiar con grupo existente, ejecuta API y SweetAlert success', async () => {
      cambiarGrupoEstudiante.mockResolvedValueOnce({});
      render(<GestionEstudiante profesorId={profesorId} onClose={mockOnClose} />);
      await screen.findByText('Maria Lopez');

      fireEvent.click(screen.getByText('Cambiar grupo'));

      const select = screen.getByRole('combobox');
      expect(select.value).toBe('grupo-a');
      fireEvent.change(select, { target: { value: 'grupo-b' } });
      
      fireEvent.click(screen.getByRole('button', { name: 'Asignar' }));

      await waitFor(() => {
        expect(cambiarGrupoEstudiante).toHaveBeenCalledWith({ refGrupo: 'grupo-b', refEstudiante: 'est-2' });
        expect(Swal.fire).toHaveBeenCalledWith("Éxito", "Estudiante cambiado de grupo correctamente.", "success");
      });
    });

    test('muestra error de SweetAlert en el catch si la API de asignación falla', async () => {
      agregarEstudianteAGrupo.mockRejectedValueOnce(new Error('Error de servidor'));
      render(<GestionEstudiante profesorId={profesorId} onClose={mockOnClose} />);
      await screen.findByText('Juan Perez');

      fireEvent.click(screen.getAllByText('Asignar grupo')[0]);
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'grupo-b' } });
      fireEvent.click(screen.getByRole('button', { name: 'Asignar' }));

      await waitFor(() => {
        expect(Swal.fire).toHaveBeenCalledWith("Error", "Error de servidor", "error");
      });
    });
  });
});