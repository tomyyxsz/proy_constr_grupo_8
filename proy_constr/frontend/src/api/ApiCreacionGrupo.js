// vinculacion con el backend
import axios from "axios";

const API_BASE_URL_ENV = `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/cursos/grupos`;
const API_USUARIOS_URL_ENV = `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/usuarios`;
export async function crearGrupo({ refCurso, nombreGrupo }) {
  try {
    const response = await axios.post(`${API_BASE_URL_ENV}/crear-grupo`, {
      refCurso,
      nombreGrupo,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || "Error al crear el grupo.");
    }
    throw new Error("Error de red al crear el grupo.");
  }
}

export async function agregarEstudianteAGrupo({ refGrupo, refEstudiante }) {
  try {
    const response = await axios.post(
      `${API_BASE_URL_ENV}/agregar-estudiante`,
      {
        refGrupo,
        refEstudiante,
      },
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error || "Error al agregar el estudiante al grupo.",
      );
    }
    throw new Error("Error de red al agregar el estudiante al grupo.");
  }
}

export async function obtenerCursos(profesorId) {
  try {
    const response = await axios.get(
      `${API_USUARIOS_URL_ENV}/profesores/${profesorId}/cursos`,
      {
        params: { profesorId },
      },
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error || "Error al obtener los cursos.",
      );
    }
    throw new Error("Error de red al obtener los cursos.");
  }
}

export async function obtenerAlumnosProfesor(profesorId) {
  try {
    const response = await axios.get(
      `${API_USUARIOS_URL_ENV}/profesores/alumnos/${profesorId}`,
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error ||
          "Error al obtener los alumnos del profesor.",
      );
    }
    throw new Error("Error de red al obtener los alumnos del profesor.");
  }
}

export async function obtenerGruposCurso(idCurso) {
  try {
    const response = await axios.get(
      `${API_BASE_URL_ENV}/listar-grupos/${idCurso}`,
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error || "Error al obtener los grupos del curso.",
      );
    }
    throw new Error("Error de red al obtener los grupos del curso.");
  }
}