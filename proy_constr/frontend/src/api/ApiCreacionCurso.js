// ApiCreacionCurso.js
// Vincular creación de cursos con el backend usando axios

import axios from "axios";
const API_IMPORTAR_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/importar`;
const API_BASE_URL =
  `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/cursos`;
const SEMESTRES_API_URL =
  `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/semestres`;

export async function crearCurso({
  nombreCurso,
  semestreId,
  profesorId,
  archivoCSV
}) {
  try {
    const formData = new FormData();
    formData.append("nombreCurso", nombreCurso);
    formData.append("idSemestre", semestreId);
    formData.append("idProfesor", profesorId);
    formData.append("archivoCSV", archivoCSV);
    
    const response = await axios.post(
      `${API_BASE_URL}/crear-curso`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("Respuesta del backend al crear curso:", response.data);
    return response.data;

  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error ||
        "Error al crear el curso."
      );
    }

    throw new Error("Error de red al crear el curso.");
  }
}

export async function obtenerSemestres() {
  try {
    const response = await axios.get(SEMESTRES_API_URL);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || "Error al cargar los semestres.");
    }

    throw new Error("Error de red al cargar los semestres.");
  }
}

export async function cargarCSV(idCurso, archivoCSV) {
  try {
    const formData = new FormData();
    formData.append("archivoCSV", archivoCSV);

    const response = await axios.post(
      `${API_IMPORTAR_URL}/${idCurso}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error ||
        "Error al importar estudiantes desde CSV."
      );
    }

    throw new Error("Error de red al importar estudiantes desde CSV.");
  }
}