// vincular registro con backend usando axios

import axios from "axios";
const API_BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/usuarios`;

export async function registerUser({
  rut,
  nombre,
  apellido,
  email,
  password,
  usuarioRol,
}) {
  try {
    const response = await axios.post(`${API_BASE_URL}/registro`, {
      rut,
      nombre,
      apellido,
      email,
      password,
      ["usuario_rol"]: usuarioRol,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error || "Error al registrar usuario.",
      );
    } else {
      throw new Error("Error de red al registrar usuario.");
    }
  }
}
