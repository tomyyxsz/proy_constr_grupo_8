// clase para que el profesor cree curso
// se le da un formulario en frontend con nombre del curso, escoge el anio y periodo y este se asocia a un semestre
// se le asigna la ref al profesor que lo creo. se actualiza al momento de recibir correctamente la solicitud
// los campos creaado_en y actualizado_en se actualizan automaticamente con la fecha y hora actual

import express from "express";
import { prisma } from "./lib/prisma.js";

const router = express.Router();

router.post("/crear-curso", async (req, res) => {
  const { nombreCurso, idProfesor, idSemestre } = req.body;

  if (!nombreCurso || !idProfesor || !idSemestre) {
    return res.status(400).json({
      error: "Debes enviar nombreCurso, idProfesor e idSemestre para crear un curso.",
    });
  }

  try {
    const profesor = await prisma.usuario.findUnique({
      where: { id: idProfesor },
    });

    if (!profesor) {
      return res.status(404).json({
        error: "El profesor con ese ID no existe.",
      });
    }

    const semestre = await prisma.semestre.findUnique({
      where: { ["id_semestre"]: idSemestre },
    });

    if (!semestre) {
      return res.status(404).json({
        error: "El semestre con ese ID no existe.",
      });
    }

    const curso = await prisma.curso.create({
      data: {
        ["nombre_curso"]: String(nombreCurso).trim(),
        ["ref_Semestre"]: idSemestre,
        ["ref_Profesor"]: idProfesor,
      },
      select: {
        ["id_curso"]: true,
        ["nombre_curso"]: true,
        ["ref_Semestre"]: true,
        ["ref_Profesor"]: true,
        ["creado_en"]: true,
        ["actualizado_en"]: true,
      },
    });

    res.status(201).json({
      message: "Curso creado correctamente.",
      curso,
    });
  } catch (error) {
    console.error("Error al crear el curso:", error);
    res.status(500).json({ error: "Error interno al crear el curso." });
  }
});

export default router;