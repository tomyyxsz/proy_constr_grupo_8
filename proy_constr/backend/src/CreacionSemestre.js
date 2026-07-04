// clase para crear semestres
// un semestre tiene un anio, periodo, fechaInicio, fechaFin y un estado (en curso, cerrado)
// el semestre se crea con estado "en curso" y se actualiza a "cerrado" cuando se cierra el semestre
// el semestre puede ser asociado mediante su idSemestre a cursos
// los campos creadoEn y actualizadoEn se actualizan automaticamente con la fecha y hora actual

import express from "express";
import { prisma } from "./lib/prisma.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const semestres = await prisma.semestre.findMany({
      orderBy: [{ anio: "desc" }, { periodo: "desc" }],
      select: {
        idSemestre: true,
        anio: true,
        periodo: true,
        estadoSemestre: true,
      },
    });

    res.status(200).json(semestres);
  } catch (error) {
    console.error("Error al listar los semestres:", error);
    res.status(500).json({ error: "Error al listar los semestres" });
  }
});

router.post("/crear-semestre", async (req, res) => {
  const { anio, periodo, fechaInicio, fechaFin } = req.body;

  if (!anio || !periodo || !fechaInicio || !fechaFin) {
    return res.status(400).json({
      error: "Debes enviar anio, periodo, fechaInicio y fechaFin para crear un semestre.",
    });
  }

  try {
    const semestre = await prisma.semestre.create({
      data: {
        idSemestre: crypto.randomUUID(),
        anio,
        periodo,
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin),
        estadoSemestre: "ACTIVO",
      },
    });

    res.status(201).json(semestre);
  } catch (error) {
    console.error("Error al crear el semestre:", error);
    res.status(500).json({ error: "Error al crear el semestre" });
  }
});

export default router;