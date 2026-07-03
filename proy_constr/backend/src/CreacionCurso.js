// clase para que el profesor cree curso
// se le da un formulario en frontend con nombre del curso, escoge el anio y periodo y este se asocia a un semestre
// se le asigna la ref al profesor que lo creo. se actualiza al momento de recibir correctamente la solicitud
// los campos creadoEn y actualizadoEn se actualizan automaticamente con la fecha y hora actual

import express from "express";
import { prisma } from "./lib/prisma.js";
import {importarEstudiantesDesdeCSV} from "./importadorCSV.js";
const router = express.Router();
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidUuid(value) {
  return typeof value === "string" && UUID_REGEX.test(value.trim());
}

router.post("/crear-curso", async (req, res) => {
  const { nombreCurso, idProfesor, idSemestre } = req.body;
  const nombreCursoNormalizado = String(nombreCurso || "").trim();
  const idProfesorNormalizado = String(idProfesor || "").trim();
  const idSemestreNormalizado = String(idSemestre || "").trim();

  if (!nombreCursoNormalizado || !idProfesorNormalizado || !idSemestreNormalizado) {
    return res.status(400).json({
      error: "Debes enviar nombreCurso, idProfesor e idSemestre para crear un curso.",
    });
  }

  if (!isValidUuid(idProfesorNormalizado)) {
    return res.status(400).json({
      error: "El idProfesor debe ser un UUID válido.",
    });
  }

  if (!isValidUuid(idSemestreNormalizado)) {
    return res.status(400).json({
      error: "El idSemestre debe ser un UUID válido.",
    });
  }

  if (!req.files || !req.files.archivoCSV) {
    return res.status(400).json({
      error: "Debes enviar un archivo CSV con los estudiantes.",
    });
  }

  try {
    const profesor = await prisma.usuario.findUnique({
      where: { id: idProfesorNormalizado },
    });

    if (!profesor) {
      return res.status(404).json({
        error: "El profesor con ese ID no existe.",
      });
    }

    const semestre = await prisma.semestre.findUnique({
      where: { idSemestre: idSemestreNormalizado },
    });

    if (!semestre) {
      return res.status(404).json({
        error: "El semestre con ese ID no existe.",
      });
    }

    const archivoCSV = req.files.archivoCSV;
    // transaccion para crear curso e importar estudiantes a la vez, si falla alguna de las dos operaciones, se hace rollback
    await prisma.$transaction(async (tx) => {
      const nuevoCurso = await tx.curso.create({
        data: {
          nombreCurso: nombreCursoNormalizado,
          refSemestre: idSemestreNormalizado,
          refProfesor: idProfesorNormalizado,
        },
      });

      const alumnosProcesados = await importarEstudiantesDesdeCSV(
        tx,
        nuevoCurso.idCurso,
        archivoCSV,
      );
      return { curso: nuevoCurso, alumnosProcesados };
    });

    return res.status(201).json({
      message: "Curso creado y alumnos importados con exito.",
    });
  } catch (error) {
    console.error("Error al crear el curso:", error);
    return res.status(500).json({ error: "No se pudo crear el curso ni importar los alumnos. Error interno al crear el curso." });
  }
});

export default router;