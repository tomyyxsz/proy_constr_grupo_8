// API para crear solicitudes de impresión
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/impresiones`;


export async function crearSolicitudImpresion({
  idUsuario,
  color1,
  color2,
  color3,
  tipoSolicitud,
  comentario,
  urlModelo3d,
  urlModeloStl,
  refCurso,
}) {
  try {
    const response = await axios.post(`${API_BASE_URL}/crear`, {
      idUsuario,
      color1,
      color2,
      color3,
      tipoSolicitud,
      comentario,
      urlModelo3d,
      urlModeloStl,
      refCurso,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error || "Error al crear solicitud de impresión.",
      );
    } else {
      throw new Error("Error de red al crear solicitud de impresión.");
    }
  }
}

export async function obtenerSolicitudesUsuario(idUsuario) {
  try {
    const response = await axios.get(`${API_BASE_URL}/usuario/${idUsuario}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error || "Error al obtener solicitudes.",
      );
    } else {
      throw new Error("Error de red al obtener solicitudes.");
    }
  }
}
