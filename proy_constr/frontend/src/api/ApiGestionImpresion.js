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

export async function aprobarSolicitud(idSolicitud, idAyudante, observacion) {
  // router.put("/:id/aprobar", recibe solo ayudante y observacion
  try {
    const response = await axios.put(`${API_BASE_URL}/${idSolicitud}/aprobar`, {
      ayudante: idAyudante,
      observacion: observacion,
      
    });
    return response.data;
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

export async function rechazarSolicitud(idSolicitud, idAyudante, motivo) {
  // router.put("/:id/rechazar",
  try {
    const response = await axios.put(
      `${API_BASE_URL}/${idSolicitud}/rechazar`,
      {
        estado: "RECHAZADA",
        motivoRechazo: motivo,
        ayudante: idAyudante,
      },
    );
    return response.data;
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
        ayudante: idAyudante,
        observacionAyudante: observacion,
      },
    );
    return response.data;
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
