import crypto from "node:crypto";
import express from "express";
import { prisma } from "./lib/prisma.js";

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
const ALLOWED_ROLES = ["ESTUDIANTE", "AYUDANTE", "PROFESOR"];

function calcularDV(rutBody) {
  let sum = 0;
  let multiplicador = 2;

  for (let i = rutBody.length - 1; i >= 0; i -= 1) {
    sum += Number(rutBody[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = 11 - (sum % 11);

  if (resto === 11) {
    return "0";
  }

  if (resto === 10) {
    return "K";
  }

  return String(resto);
}

function normalizeRut(rutInput) {
  const original = String(rutInput).trim().toUpperCase().replace(/\./g, "");
  const compact = original.replace(/-/g, "");
  const tieneGuion = original.includes("-");
  let body = "";
  let providedDv = null;

  if (tieneGuion) {
    const [bodyPart, dvPart = ""] = original.split("-");
    body = bodyPart.replace(/\D/g, "");
    providedDv = dvPart.trim() ? dvPart.trim() : null;
  } else if (/^\d{7,8}$/.test(compact)) {
    body = compact;
  } else if (/^\d{8}K$/.test(compact)) {
    body = compact.slice(0, -1);
    providedDv = "K";
  } else if (/^\d{9}$/.test(compact)) {
    body = compact.slice(0, -1);
    providedDv = compact.slice(-1);
  } else {
    return null;
  }

  if (!/^\d{7,8}$/.test(body)) {
    return null;
  }

  if (providedDv && !/^[\dK]$/.test(providedDv)) {
    return null;
  }

  const calculatedDv = calcularDV(body);

  if (providedDv && providedDv !== calculatedDv) {
    return null;
  }

  return `${body}-${calculatedDv}`;
}

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

  if (!rut || !nombre || !apellido || !email || !password) {
    return res.status(400).json({
      error: "Debes enviar rut, nombre, apellido, email y password para registrar un usuario.",
    });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanPassword = String(password);
  const normalizedRut = normalizeRut(rut);
  const role = normalizeRole(roleFromBody);

  if (!EMAIL_REGEX.test(cleanEmail)) {
    return res.status(400).json({
      error: "El correo no tiene un formato valido.",
      regla: "usuario@dominio.com",
    });
  }

  if (!PASSWORD_REGEX.test(cleanPassword)) {
    return res.status(400).json({
      error: "La contrasena no cumple la politica de seguridad.",
      regla: "Minimo 8 caracteres, al menos 1 mayuscula, 1 minuscula, 1 numero y 1 simbolo.",
    });
  }

  if (!role) {
    return res.status(400).json({
      error: "usuario_rol invalido. Usa ESTUDIANTE, AYUDANTE o PROFESOR.",
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
        ["usuario_rol"]: role,
      },
      select: {
        id: true,
        rut: true,
        nombre: true,
        apellido: true,
        email: true,
        ["usuario_rol"]: true,
        ["creado_en"]: true,
      },
    });

    return res.status(201).json({
      message: "Usuario registrado correctamente.",
      usuario: newUser,
    });
  } catch (error) {
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

