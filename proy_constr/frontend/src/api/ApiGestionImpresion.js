// API para gestionar solicitudes de impresión
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/impresiones`;

export async function obtenerTodasLasSolicitudes() {
  try {
    const response = await axios.get(`${API_BASE_URL}/`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error ||
          "Error al obtener solicitudes de impresión.",
      );
    } else {
      throw new Error("Error de red al obtener solicitudes de impresión.");
    }
  }
}

export async function aprobarSolicitud(idSolicitud, idAyudante, observacion, emailEstudiante) {
  // router.put("/:id/aprobar", recibe solo ayudante y observacion y email estudiante
  try {
    const response = await axios.put(`${API_BASE_URL}/${idSolicitud}/aprobar`, {
      idAyudante: idAyudante,
      observacion: observacion,
      emailEstudiante: emailEstudiante
      
    });
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error ||
          "Error al actualizar el estado de la solicitud.",
      );
    } else {
      throw new Error("Error de red al actualizar el estado de la solicitud.");
    }
  }
}

export async function rechazarSolicitud(idSolicitud, idAyudante, motivo, emailEstudiante) {
  // router.put("/:id/rechazar",
  console.log ("id ayudante:", idAyudante);
  try {
    const response = await axios.put(
      `${API_BASE_URL}/${idSolicitud}/rechazar`,
      {

        motivo: motivo,
        idAyudante: idAyudante,
        emailEstudiante: emailEstudiante
      },
    );
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error ||
          "Error al actualizar el estado de la solicitud.",
      );
    } else {
      throw new Error("Error de red al actualizar el estado de la solicitud.");
    }
  }
}

export async function actualizarObservacionAyudante(idSolicitud, idAyudante, observacion) {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/${idSolicitud}/observaciones`,
      {
        idAyudante: idAyudante,
        observacion: observacion,
      },
    );
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error ||
          "Error al actualizar la observación del ayudante.",
      );
    } else {
      throw new Error(
        "Error de red al actualizar la observación del ayudante.",
      );
    }
  }
}

export async function completarSolicitud(idSolicitud, idAyudante, emailEstudiante) {
  try {
    const response = await axios.put(`${API_BASE_URL}/${idSolicitud}/completar`,
      {
        idAyudante: idAyudante,
        emailEstudiante: emailEstudiante
      },
    );
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error ||
          "Error al marcar la solicitud como completada.",
      );
    } else {
      throw new Error(
        "Error de red al marcar la solicitud como completada.",
      );
    }
  }
}

export async function obtenerSolicitudesProfesor (idProfesor) {
  try {
    const response = await axios.get(`${API_BASE_URL}/profesor/${idProfesor}`);
    return response.data;
  
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error ||
          "Error al obtener solicitudes del profesor.",
      );
    } else {
      throw new Error("Error de red al obtener solicitudes del profesor.");
    }
  }
}
