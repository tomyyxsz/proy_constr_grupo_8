import crypto from "node:crypto";
import express from "express";
import { prisma } from "./lib/prisma.js";

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function verifyPassword(plainPassword, storedPassword) {
  if (!storedPassword || !storedPassword.includes(":")) {
    return false;
  }

  const [salt, hashed] = storedPassword.split(":");
  if (!salt || !hashed) {
    return false;
  }

  const candidate = crypto.scryptSync(String(plainPassword), salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(candidate, "hex"), Buffer.from(hashed, "hex"));
}

router.post("/login", async (req, res) => {
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
    const user = await prisma.usuario.findUnique({
      where: { email: cleanEmail },
      select: {
        id: true,
        rut: true,
        nombre: true,
        apellido: true,
        email: true,
        "usuario_rol": true,
        password: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "Usuario no encontrado. Debes registrarte primero.",
      });
    }

    const isValidPassword = verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Credenciales invalidas." });
    }

    return res.json({
      message: "Inicio de sesion exitoso.",
      usuario: {
        id: user.id,
        rut: user.rut,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        "usuario_rol": user.usuario_rol,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesion:", error);
    return res.status(500).json({ error: "Error interno al iniciar sesion." });
  }
});

export default router;