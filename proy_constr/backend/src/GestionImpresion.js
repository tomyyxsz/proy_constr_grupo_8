// el ayudante debe aprobar o rechazar solicitudes, puede agregar observaciones y el estudiante deberia poder ver
// el estado de su solicitud (creada, aprobada, rechazada) y las observaciones del ayudante
import express from "express";
import { prisma } from "./lib/prisma.js";

const router = express.Router();

// GET: Listar impresiones por estudiante
router.get("/estudiante/:idEstudiante", async (req, res) => {
  const { idEstudiante } = req.params;

  try {
    // Buscar todas las solicitudes de un estudiante
    const solicitudes = await prisma.impresion.findMany({
      where: {
        refEstudiante: idEstudiante,
      },
      select: {
        idImpresion: true,
        solicitanteNombre: true,
        solicitanteApellido: true,
        solicitanteEmail: true,
        solicitanteRut: true,
        tipoSolicitud: true,
        tipoUsuario: true,
        nombreCurso: true,
        colorOpcion1: true,
        colorOpcion2: true,
        colorOpcion3: true,
        comentarioUsuario: true,
        urlModelo3d: true,
        urlModeloStl: true,
        estadoImpresion: true,
        observacionAyudante: true,
        motivoRechazo: true,
        tiempoEstimadoImpresion: true,
        inicioImpresion: true,
        creadoEn: true,
      },
      orderBy: {
        creadoEn: "desc",
      },
    });

    if (solicitudes.length === 0) {
      return res.status(200).json({
        message: "El estudiante no tiene solicitudes de impresión.",
        solicitudes: [],
      });
    }

    res.status(200).json({
      message: "Solicitudes obtenidas correctamente.",
      solicitudes,
    });
  } catch (error) {
    console.error("Error al obtener solicitudes del estudiante:", error);
    res.status(500).json({
      error: "Error interno al obtener solicitudes.",
    });
  }
});

//GET : Obtener todas las solicitudes (para el ayudante)
router.get("/", async (req, res) => {
  try {
    // Buscar todas las solicitudes de impresión
    const solicitudes = await prisma.impresion.findMany({
      select: {
        idImpresion: true,
        solicitanteNombre: true,
        solicitanteApellido: true,
        solicitanteEmail: true,
        solicitanteRut: true,
        tipoSolicitud: true,
        tipoUsuario: true,
        nombreCurso: true,
        colorOpcion1: true,
        colorOpcion2: true,
        colorOpcion3: true,
        comentarioUsuario: true,
        urlModelo3d: true,
        urlModeloStl: true,
        estadoImpresion: true,
        observacionAyudante: true,
        motivoRechazo: true,
        tiempoEstimadoImpresion: true,
        inicioImpresion: true,
        creadoEn: true,
      },
      orderBy: {
        creadoEn: "desc",
      },
    });

    if (solicitudes.length === 0) {
      return res.status(200).json({
        message: "No hay solicitudes de impresión.",
        solicitudes: [],
      });
    }

    res.status(200).json({
      message: "Solicitudes obtenidas correctamente.",
      solicitudes,
    });
  } catch (error) {
    console.error("Error al obtener todas las solicitudes:", error);
    res.status(500).json({
      error: "Error interno al obtener solicitudes.",
    });
  }
});

// GET: Obtener una impresion por ID
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
  const idImpresion = req.params.id;

  if (!idAyudante) {
    return res.status(400).json({
      error: "Debes enviar idAyudante.",
    });
  }

  try {
    // Verificar que el ayudante existe
    const ayudante = await prisma.usuario.findFirst({
      where: { id: idAyudante },
    });

    if (!ayudante) {
      return res.status(404).json({
        error: "El ayudante con ese ID no existe.",
      });
    }

    // Verificar que la impresión existe
    const impresion = await prisma.impresion.findUnique({
      where: { idImpresion: idImpresion },
    });

    if (!impresion) {
      return res.status(404).json({
        error: "Impresión no encontrada.",
      });
    }

    // if (impresion.estadoImpresion !== "PENDIENTE") {
    //   return res.status(400).json({
    //     error: "Solo se pueden aprobar impresiones en estado PENDIENTE.",
    //   });
    // }

    // Actualizar impresión
    const impresionActualizada = await prisma.impresion.update({
      where: { idImpresion: idImpresion },
      data: {
        estadoImpresion: "EN_PROGRESO",
        refAyudante: idAyudante,
        observacionAyudante: observacion || null,
      },
      select: {
        idImpresion: true,
        estadoImpresion: true,
        refAyudante: true,
        observacionAyudante: true,
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

    // if (impresion.estadoImpresion !== "PENDIENTE") {
    //   return res.status(400).json({
    //     error: "Solo se pueden rechazar impresiones en estado PENDIENTE.",
    //   });
    // }

    // Actualizar impresión
    const impresionActualizada = await prisma.impresion.update({
      where: { idImpresion: req.params.id },
      data: {
        estadoImpresion: "RECHAZADA",
        refAyudante: idAyudante,
        motivoRechazo: motivo,
      },
      select: {
        idImpresion: true,
        estadoImpresion: true,
        refAyudante: true,
        motivoRechazo: true,
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

// borrar una solicitud
router.delete("/borrar/:id", async (req, res) => {
  try {
    const impresion = await prisma.impresion.findUnique({
      where: { idImpresion: req.params.id },
    });

    if (!impresion) {
      return res.status(404).json({
        error: "Impresión no encontrada.",
      });
    }

    await prisma.impresion.deleteMany({
      where: { idImpresion: req.params.id },
    });

    res.json({
      message: "Impresión eliminada correctamente.",
    });
  } catch (error) {
    console.error("Error al eliminar impresión:", error);
    res.status(500).json({ error: "Error interno al eliminar impresión." });
  }
});
export default router;
