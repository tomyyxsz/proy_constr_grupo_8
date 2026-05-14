// vincular login con backend usando axios

import axios from "axios";
const API_BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/usuarios`;

export async function loginUser(email, password) {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || "Error al iniciar sesion.");
    } else {
      throw new Error("Error de red al iniciar sesion.");
    }
  }
}
