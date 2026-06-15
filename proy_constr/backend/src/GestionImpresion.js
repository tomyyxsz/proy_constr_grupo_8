// el ayudante debe aprobar o rechazar solicitudes, puede agregar observaciones y el estudiante deberia poder ver
// el estado de su solicitud (creada, aprobada, rechazada) y las observaciones del ayudante
import express from "express";
import { prisma } from "./lib/prisma.js";

const router = express.Router();

// GET: Listar impresiones (filtrable por estado)
router.get("/", async (req, res) => {
  const { estado, idAyudante } = req.query;

  const where = {};

  if (estado) {
    where.estadoImpresion = estado.toUpperCase();
  }

  if (idAyudante) {
    where.refAyudante = idAyudante;
  }

  try {
    const impresiones = await prisma.impresion.findMany({
      where,
      select: {
        idImpresion: true,
        solicitanteNombre: true,
        solicitanteEmail: true,
        tipoSolicitud: true,
        estadoImpresion: true,
        refAyudante: true,
        creadoEn: true,
        actualizadoEn: true,
      },
      orderBy: {
        creadoEn: "desc",
      },
    });

    res.json({
      cantidad: impresiones.length,
      impresiones,
    });
  } catch (error) {
    console.error("Error al listar impresiones:", error);
    res.status(500).json({ error: "Error interno al listar impresiones." });
  }
});

// GET: Obtener una impresión por ID
router.get("/:id", async (req, res) => {
  try {
    const impresion = await prisma.impresion.findUnique({
      where: { idImpresion: req.params.id },
      include: {
        estudiante: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
      },
    });

    if (!impresion) {
      return res.status(404).json({
        error: "Impresión no encontrada.",
      });
    }

    res.json({ impresion });
  } catch (error) {
    console.error("Error al obtener impresión:", error);
    res.status(500).json({ error: "Error interno al obtener impresión." });
  }
});

// PUT: Aprobar impresión
router.put("/:id/aprobar", async (req, res) => {
  const { idAyudante, observacion } = req.body;

  if (!idAyudante) {
    return res.status(400).json({
      error: "Debes enviar idAyudante.",
    });
  }

  try {
    // Verificar que el ayudante existe
    const ayudante = await prisma.usuario.findUnique({
      where: { id: idAyudante },
    });

    if (!ayudante) {
      return res.status(404).json({
        error: "El ayudante con ese ID no existe.",
      });
    }

    // Verificar que la impresión existe
    const impresion = await prisma.impresion.findUnique({
      where: { idImpresion: req.params.id },
    });

    if (!impresion) {
      return res.status(404).json({
        error: "Impresión no encontrada.",
      });
    }

    if (impresion.estadoImpresion !== "CREADO") {
      return res.status(400).json({
        error: "Solo se pueden aprobar impresiones en estado CREADO.",
      });
    }

    // Actualizar impresión
    const impresionActualizada = await prisma.impresion.update({
      where: { idImpresion: req.params.id },
      data: {
        estadoImpresion: "APROBADO",
        refAyudante: idAyudante,
        observacionAyudante: observacion || null,
      },
      select: {
        idImpresion: true,
        estadoImpresion: true,
        refAyudante: true,
        observacionAyudante: true,
        actualizadoEn: true,
      },
    });

    res.json({
      message: "Impresión aprobada correctamente.",
      impresion: impresionActualizada,
    });
  } catch (error) {
    console.error("Error al aprobar impresión:", error);
    res.status(500).json({ error: "Error interno al aprobar impresión." });
  }
});

// PUT: Rechazar impresión
router.put("/:id/rechazar", async (req, res) => {
  const { idAyudante, motivo } = req.body;

  if (!idAyudante || !motivo) {
    return res.status(400).json({
      error: "Debes enviar idAyudante y motivo.",
    });
  }

  try {
    // Verificar que el ayudante existe
    const ayudante = await prisma.usuario.findUnique({
      where: { id: idAyudante },
    });

    if (!ayudante) {
      return res.status(404).json({
        error: "El ayudante con ese ID no existe.",
      });
    }

    // Verificar que la impresión existe
    const impresion = await prisma.impresion.findUnique({
      where: { idImpresion: req.params.id },
    });

    if (!impresion) {
      return res.status(404).json({
        error: "Impresión no encontrada.",
      });
    }

    if (impresion.estadoImpresion !== "CREADO") {
      return res.status(400).json({
        error: "Solo se pueden rechazar impresiones en estado CREADO.",
      });
    }

    // Actualizar impresión
    const impresionActualizada = await prisma.impresion.update({
      where: { idImpresion: req.params.id },
      data: {
        estadoImpresion: "RECHAZADO",
        refAyudante: idAyudante,
        motivoRechazo: motivo,
      },
      select: {
        idImpresion: true,
        estadoImpresion: true,
        refAyudante: true,
        motivoRechazo: true,
        actualizadoEn: true,
      },
    });

    res.json({
      message: "Impresión rechazada correctamente.",
      impresion: impresionActualizada,
    });
  } catch (error) {
    console.error("Error al rechazar impresión:", error);
    res.status(500).json({ error: "Error interno al rechazar impresión." });
  }
});

// PUT: Actualizar observaciones
router.put("/:id/observaciones", async (req, res) => {
  const { idAyudante, observacion } = req.body;

  if (!idAyudante || !observacion) {
    return res.status(400).json({
      error: "Debes enviar idAyudante y observacion.",
    });
  }

  try {
    // Verificar que la impresión existe
    const impresion = await prisma.impresion.findUnique({
      where: { idImpresion: req.params.id },
    });

    if (!impresion) {
      return res.status(404).json({
        error: "Impresión no encontrada.",
      });
    }

    // Actualizar impresión
    const impresionActualizada = await prisma.impresion.update({
      where: { idImpresion: req.params.id },
      data: {
        observacionAyudante: observacion,
      },
      select: {
        idImpresion: true,
        observacionAyudante: true,
        actualizadoEn: true,
      },
    });

    res.json({
      message: "Observaciones actualizadas correctamente.",
      impresion: impresionActualizada,
    });
  } catch (error) {
    console.error("Error al actualizar observaciones:", error);
    res.status(500).json({ error: "Error interno al actualizar observaciones." });
  }
});

export default router;
