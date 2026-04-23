import crypto from "node:crypto";
import express from "express";
import { prisma } from "./lib/prisma.js";

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // formato de email : asdad@asdasd.algo
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/; // minimo 8 caracteres, al menos 1 mayuscula, 1 minuscula, 1 numero y 1 simbolo
const ALLOWED_ROLES = ["ESTUDIANTE", "AYUDANTE", "PROFESOR"];

function calcularDV(rutBody) { // funcion para calcular el digito verificador del rut
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
    body = bodyPart.replace(/\D/g, ""); // body = solo numeros ej 12345678
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

function hashPassword(password) { // encripta la contrasena usando scrypt con una salt aleatoria.
  // salta es un valor aleatorio en formato hexadecimal que se genera para cada contrasena
  // de esta forma si dos usuarios tienen la misma contrasena, sus hashes seran diferentes debido a las salts distintas.
  const salt = crypto.randomBytes(16).toString("hex");
  const hashed = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hashed}`;
}


function normalizeRole(role) { // normaliza el rol a mayusculas y valida que sea uno de los permitidos. 
// si no se especifica, se asigna ESTUDIANTE por defecto.
  if (!role) {
    return "ESTUDIANTE"; // rol por defecto si no se especifica en el cuerpo de la solicitud
  }

  const normalized = String(role).trim().toUpperCase();
  return ALLOWED_ROLES.includes(normalized) ? normalized : null;
}

router.post("/registro", async (req, res) => { // ruta POST /registro para registrar un nuevo usuario
  const {
    rut,
    nombre,
    apellido,
    email,
    password,
  } = req.body;

  const roleFromBody = req.body.usuario_rol; // rol opcional, si no se envia se asigna ESTUDIANTE por defecto

  if (!rut || !nombre || !apellido || !email || !password) { // validacion de campos llenos
    return res.status(400).json({
      error:
        "Debes enviar rut, nombre, apellido, email y password para registrar un usuario.",
    });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanPassword = String(password);
  const normalizedRut = normalizeRut(rut);
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

  if (!normalizedRut) {
    return res.status(400).json({
      error: "RUT invalido. Envia solo numeros o formato con DV valido.",
      ejemplo: "12345678 o 12345678-5",
    });
  }

  try {
    const newUser = await prisma.usuario.create({ // crear nuevo usuario en bd
      data: {
        id: crypto.randomUUID(),
        rut: normalizedRut,
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

