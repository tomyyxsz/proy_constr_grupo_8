import express from "express";
import { prisma } from "./lib/prisma.js";

const router = express.Router();

const USER_SELECT = {
  id: true,
  rut: true,
  nombre: true,
  apellido: true,
  email: true,
  usuarioRol: true,
  creadoEn: true,
  actualizadoEn: true,
};

const ALLOWED_ROLES = ["ESTUDIANTE", "AYUDANTE", "PROFESOR", "ADMINISTRADOR", "SOLICITANTE"];

function normalizeRole(role) {
  if (!role) {
    return null;
  }

  const normalized = String(role).trim().toUpperCase();
  return ALLOWED_ROLES.includes(normalized) ? normalized : null;
}

router.get("/buscar", async (req, res) => {
  const { email, rut, rol, nombre, apellido } = req.query;
  const filters = [];

  if (email) {
    filters.push({ email: String(email).trim().toLowerCase() });
  }

  if (rut) {
    filters.push({ rut: String(rut).trim() });
  }

  if (rol) {
    const normalizedRole = normalizeRole(rol);
    if (!normalizedRole) {
      return res.status(400).json({
        error: "Rol de usuario invalido. Usa ESTUDIANTE, AYUDANTE, PROFESOR, ADMINISTRADOR O SOLICITANTE.",
      });
    }

    filters.push({ usuarioRol: normalizedRole });
  }

  if (nombre) {
    filters.push({ nombre: { contains: String(nombre).trim(), mode: "insensitive" } });
  }

  if (apellido) {
    filters.push({ apellido: { contains: String(apellido).trim(), mode: "insensitive" } });
  }

  if (filters.length === 0) {
    return res.status(400).json({
      error: "Debes enviar al menos un filtro: email, rut, rol, nombre o apellido.",
    });
  }

  try {
    const orderBy = {};
    orderBy["creadoEn"] = "desc";

    const usuarios = await prisma.usuario.findMany({
      where: {
        AND: filters,
      },
      select: USER_SELECT,
      orderBy,
    });

    return res.json({ cantidad: usuarios.length, usuarios });
  } catch (error) {
    console.error("Error al buscar usuarios:", error);
    return res.status(500).json({ error: "Error interno al buscar usuarios." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await prisma.usuario.findUnique({
      where: {
        id: req.params.id,
      },
      select: USER_SELECT,
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    return res.json({ usuario: user });
  } catch (error) {
    console.error("Error al buscar usuario por id:", error);
    return res.status(500).json({ error: "Error interno al buscar usuario." });
  }
});
// ruta para borrar usuarios en caso de rut repetido o que haya habido algun error. se borra con el rut
// la ruta para postman es DELETE http://localhost:3001/api/usuarios/rut/12345678-9 (ejemplo de rut)
router.delete("/rut/:rut", async (req, res) => {
  try {
    const rut = String(req.params.rut).trim().toUpperCase();

    const deleted = await prisma.usuario.deleteMany({
      where: { rut },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ error: "No se encontró ningún usuario con ese RUT." });
    }

    return res.json({
      message: "Usuarios eliminados correctamente.",
      eliminados: deleted.count,
    });
  } catch (error) {
    console.error("Error al eliminar usuarios por rut:", error);
    return res.status(500).json({ error: "Error interno al eliminar usuarios." });
  }
});

export default router;