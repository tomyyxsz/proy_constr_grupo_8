// clase para crear semestres
// un semestre tiene un anio, periodo, fecha_inicio, fecha_fin y un estado (en curso, cerrado)
// el semestre se crea con estado "en curso" y se actualiza a "cerrado" cuando se cierra el semestre
// el semestre puede ser asociado mediante su idSemestre a cursos
// los campos creaado_en y actualizado_en se actualizan automaticamente con la fecha y hora actual

import express from "express";
import { prisma } from "./lib/prisma.js";

const router = express.Router();

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
        ["id_semestre"]: crypto.randomUUID(),
        anio,
        periodo,
        ["fecha_inicio"]: new Date(fechaInicio),
        ["fecha_fin"]: new Date(fechaFin),
        ["estado_semestre"]: "ACTIVO",
      },
    });

    res.status(201).json(semestre);
  } catch (error) {
    console.error("Error al crear el semestre:", error);
    res.status(500).json({ error: "Error al crear el semestre" });
  }
});

export default router;