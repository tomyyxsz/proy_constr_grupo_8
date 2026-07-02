/* 
Servicio que permite importa un archivo CSV con los datos del curso
se toma como referencia un CSV de educandus con siguiente formato: 
Nombre,Apellido(s),"Nombre de Usuario","Dirección de correo"
, donde Nombre de Usuario es el rut
Cada estudiante dentro del archivo debe ser agregado a la base de datos
y asociarlo al curso correspondiente de donde se subio el archivo CSV
*/

import express from "express";
import { prisma } from "./lib/prisma.js";
import crypto from "crypto";
import {calcularDV} from "./lib/validaciones.js";
const router = express.Router();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hashed = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hashed}`;
  
}

const importarEstudiantesDesdeCSV = async (req, res) => {
  const { idCurso } = req.params;
  if (!idCurso) {
    return res.status(400).json({ error: "Debes enviar idCurso en los parametros." });
  }
  console.log("idCurso recibido:", idCurso);
  console.log("Archivos recibidos:", req.files);
  try {
    const curso = await prisma.curso.findUnique({ where: { idCurso } });
    if (!curso) {
      return res.status(404).json({ error: "El curso con ese ID no existe." });
    }

    if (!req.files || !req.files.csvData) {
      return res.status(400).json({ error: "Se debe subir un archivo CSV" });
    }

    const csvFile = req.files.csvData;
    console.log("Archivo CSV recibido:", csvFile.name);
    const csvContent = csvFile.data.toString("utf-8");
    const lines = csvContent.split(/\r?\n/); // para detectar saltos de linea

    let creados = 0;

    // ciclo para recorrer las lineas del CSV, se salta el encabezado 
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // buscar campos , estan separados entre comillas o separados por comas
      const campos = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(",");
      
      if (campos.length >= 4) {
        // formatear los campos para eliminar comillas y espacios
        const nombre = campos[0].replace(/"/g, "").trim();
        const apellidos = campos[1].replace(/"/g, "").trim();
        const rutSinDv = campos[2].replace(/"/g, "").trim(); // "nombre usuario = rut sin dv"
        const correo = campos[3].replace(/"/g, "").trim();

        // la contrasenia del estudiante ingresado por el profesor sera
        // rutSinDv + "@prov" y se debe guardar hasheada en la base de datos
        const passwordPlana = `${rutSinDv}@prov`;
        const passwordHasheada = hashPassword(passwordPlana); 

        const dvCalculado = calcularDV(rutSinDv);
        const rutCompleto = `${rutSinDv}-${dvCalculado}`;

        // insertar usuario en bd
        await prisma.usuario.upsert({
          where: { rut: rutCompleto },
          update: { usuarioRol: "ESTUDIANTE" },
          create: {
            nombre: nombre,
            apellido: apellidos,
            rut: rutCompleto,
            password: passwordHasheada,
            email: correo,
            usuarioRol: "ESTUDIANTE",

            // manejo de tabla estudianteCurso para la relacion n a n entre estudiantes y cursos
            estudianteCurso: {
              create: {
                refCurso: idCurso,
                refEstudiante: undefined, // prisma lo asigna de forma automatica
              },
            },
          },
        });
        creados++;
      }
    }

    return res.status(200).json({
      message: `Importacion exitosa. Se procesaron ${creados} estudiantes.`,
    });

  } catch (error) {
    console.error("Error al importar estudiantes desde CSV:", error);
    return res.status(500).json({ error: "Error interno al procesar el archivo CSV." });
  }
};

router.post("/:idCurso", importarEstudiantesDesdeCSV);

export default router;