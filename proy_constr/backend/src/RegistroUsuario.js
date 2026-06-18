import crypto from "node:crypto";
import express from "express";
import { prisma } from "./lib/prisma.js";
import {esCorreoValido, esContrasenaValida, normalizeRut} from "./lib/validaciones.js";

const router = express.Router();

const allowedRoles = ["ESTUDIANTE", "AYUDANTE", "PROFESOR","ADMINISTRADOR" ];



function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hashed = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hashed}`;
  
}

function normalizeRole(role) {
  if (!role) {
    return "ESTUDIANTE";
  }

  const normalized = String(role).trim().toUpperCase();
  return allowedRoles.includes(normalized) ? normalized : null;
}

router.post("/registro", async (req, res) => {
  const {
    rut,
    nombre,
    apellido,
    email,
    password,
  } = req.body;

  const roleFromBody = req.body.usuarioRol;

  if (!rut || !nombre || !apellido || !email || !password) {
    return res.status(400).json({
      error: "Debes enviar rut, nombre, apellido, email y password para registrar un usuario.",
    });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanPassword = String(password);
  const normalizedRut = normalizeRut(rut);
  const role = normalizeRole(roleFromBody);

  if (!esCorreoValido(cleanEmail)) {
    return res.status(400).json({
      error: "El correo no tiene un formato valido.",
      regla: "usuario@dominio.com",
    });
  }

  if (!esContrasenaValida(cleanPassword)) {
    return res.status(400).json({
      error: "La contrasena no cumple la politica de seguridad.",
      regla: "Minimo 8 caracteres, al menos 1 mayuscula, 1 minuscula, 1 numero y 1 simbolo.",
    });
  }

  if (!role) {
    return res.status(400).json({
      error: "usuarioRol invalido. Usa ESTUDIANTE, AYUDANTE o PROFESOR.",
    });
  }

  if (!normalizedRut) {
    return res.status(400).json({
      error: "RUT invalido. Envia solo numeros o formato con DV valido.",
      ejemplo: "12345678 o 12345678-5",
    });
  }

  const existingUser = await prisma.usuario.findUnique({
    where: { rut: normalizedRut },
  });

  if (existingUser) {
    return res.status(409).json({
      error: "Ya existe un usuario registrado con ese RUT.",
    });
  }

  try {
    const newUser = await prisma.usuario.create({
      data: {
        id: crypto.randomUUID(),
        rut: normalizedRut,
        nombre: String(nombre).trim(),
        apellido: String(apellido).trim(),
        email: cleanEmail,
        password: hashPassword(cleanPassword),
        usuarioRol: role,
      },
      select: {
        id: true,
        rut: true,
        nombre: true,
        apellido: true,
        email: true,
        usuarioRol: true,
        creadoEn: true,
      },
    });

    return res.status(201).json({
      message: "Usuario registrado correctamente.",
      usuario: newUser,
    });
  } catch (error) { // doble validacion de error unico para rut y email, aunque prisma ya lo hace, esto es para dar un mensaje mas amigable al usuario
    if (error?.code === "P2002") {
      const uniqueField = Array.isArray(error.meta?.target) ? error.meta.target[0] : null;

      if (uniqueField === "rut") {
        return res.status(409).json({
          error: "Ya existe un usuario registrado con ese RUT.",
        });
      }

      if (uniqueField === "email") {
        return res.status(409).json({
          error: "Ya existe un usuario registrado con ese email.",
        });
      }

      return res.status(409).json({
        error: "Ya existe un dato único repetido.",
      });
    }

    console.error("Error al registrar usuario:", error);
    return res.status(500).json({ error: "Error interno al registrar usuario." });
  }
});

export default router;

