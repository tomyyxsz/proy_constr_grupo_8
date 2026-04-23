import crypto from "node:crypto";
import express from "express";
import { prisma } from "./lib/prisma.js";

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // formato de email : asdad@asdasd.algo
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/; // minimo 8 caracteres, al menos 1 mayuscula, 1 minuscula, 1 numero y 1 simbolo
const ALLOWED_ROLES = ["ESTUDIANTE", "AYUDANTE", "PROFESOR"];

function hashPassword(password) { // 
  const salt = crypto.randomBytes(16).toString("hex");
  const hashed = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hashed}`;
}


function normalizeRole(role) {
  if (!role) {
    return "ESTUDIANTE"; // rol por defecto si no se especifica en el cuerpo de la solicitud
  }

  const normalized = String(role).trim().toUpperCase();
  return ALLOWED_ROLES.includes(normalized) ? normalized : null;
}

router.post("/registro", async (req, res) => {
  const {
    rut,
    nombre,
    apellido,
    email,
    password,
  } = req.body;

  const roleFromBody = req.body.usuario_rol;

  if (!rut || !nombre || !apellido || !email || !password) { // validacion de campos llenos
    return res.status(400).json({
      error:
        "Debes enviar rut, nombre, apellido, email y password para registrar un usuario.",
    });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanPassword = String(password);
  const role = normalizeRole(roleFromBody);

  if (!EMAIL_REGEX.test(cleanEmail)) { // validacion de formato de email
    return res.status(400).json({
      error: "El correo no tiene un formato valido.",
      regla: "usuario@dominio.com",
    });
  }

  if (!PASSWORD_REGEX.test(cleanPassword)) { // validacion de contrasena
    return res.status(400).json({
      error: "La contrasena no cumple la politica de seguridad.",
      regla:
        "Minimo 8 caracteres, al menos 1 mayuscula, 1 minuscula, 1 numero y 1 simbolo.",
    });
  }

  if (!role) {
    return res.status(400).json({
      error: "usuario_rol invalido. Usa ESTUDIANTE, AYUDANTE o PROFESOR.",
    });
  }

  try {
    const newUser = await prisma.usuario.create({ // crear nuevo usuario en bd
      data: {
        id: crypto.randomUUID(),
        rut: String(rut).trim(),
        nombre: String(nombre).trim(),
        apellido: String(apellido).trim(),
        email: cleanEmail,
        password: hashPassword(cleanPassword),
        "usuario_rol": role,
      },
      select: {
        id: true,
        rut: true,
        nombre: true,
        apellido: true,
        email: true,
        "usuario_rol": true,
        "creado_en": true,
      },
    });

    return res.status(201).json({ // respuesta 201: exitosa
      message: "Usuario registrado correctamente.",
      usuario: newUser,
    });
  } catch (error) {
    if (error?.code === "P2002") {
      return res.status(409).json({ // respuesta 409: conflicto, email ya registrado
        error: "Ya existe un usuario registrado con ese email.",
      });
    }

    console.error("Error al registrar usuario:", error); // log del error (500) para depuracion
    return res.status(500).json({ error: "Error interno al registrar usuario." });
  }
});

export default router;

