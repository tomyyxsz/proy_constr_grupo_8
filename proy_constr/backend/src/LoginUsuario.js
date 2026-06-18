
import express from "express";
import { prisma } from "./lib/prisma.js";
import { verifyPassword } from "./lib/validaciones.js";
const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



router.post("/login", async (req, res) => { // ruta POST /login para iniciar sesion de un usuario existente
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: "Debes enviar email y password para iniciar sesion.",
    });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  if (!EMAIL_REGEX.test(cleanEmail)) {
    return res.status(400).json({
      error: "El correo no tiene un formato valido.",
    });
  }

  try {
    const user = await prisma.usuario.findUnique({ // buscar usuario por email en la base de datos
      where: { email: cleanEmail },
      select: {
        id: true,
        rut: true,
        nombre: true,
        apellido: true,
        email: true,
        usuarioRol: true,
        password: true,
      },
    });
    if (!user) {
      return res.status(404).json({ // 404 = usuario no encontrado
        error: "Usuario no encontrado. Debes registrarte primero.",
      });
    }

    const isValidPassword = verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Credenciales invalidas." }); // 401 = credenciales invalidas
    }

    return res.json({
      message: "Inicio de sesion exitoso.",
      usuario: {
        id: user.id,
        rut: user.rut,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        usuarioRol: user.usuarioRol,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesion:", error);
    return res.status(500).json({ error: "Error interno al iniciar sesion." }); // 500 = error en la base de datos/backend
  }
});

export default router;