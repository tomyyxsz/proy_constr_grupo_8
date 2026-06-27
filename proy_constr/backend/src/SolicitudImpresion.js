// la solicitud viene de un solicitante o estudiante, el cual ingresa el url de los archivos para imprimir,
// un comentario opcional, tipo de solicitud (personal o academica -> en este caso se debe asignar un curso)
//
import express from "express";
import { prisma } from "./lib/prisma.js";

const router = express.Router();

const URL_REGEX = /^https?:\/\/.+/;
const TIPOS_SOLICITUD = ["PERSONAL", "ACADEMICA"];

router.post("/crear", async (req, res) => {
  let {
    idUsuario, color1, color2, color3, tipoSolicitud,
    comentario,
    urlModelo3d,
    urlModeloStl,
    refCurso,
  } = req.body;

  // validar campos obligatorios
  if (
    !idUsuario ||
    !color1 ||
    !color2 ||
    !color3 ||
    !tipoSolicitud ||
    !urlModelo3d ||
    !urlModeloStl
  ) {
    return res.status(400).json({
      error:
        "Debes enviar idUsuario, color1, color2, color3, tipoSolicitud, urlModelo3d y urlModeloStl.",
    });
  }

  // validar tipo de solicitud
  if (!TIPOS_SOLICITUD.includes(tipoSolicitud)) {
    return res.status(400).json({
      error: "tipoSolicitud debe ser PERSONAL o ACADEMICA.",
    });
  }

  // si es academica la solicitud, debe incluir ref curso
  if (tipoSolicitud === "ACADEMICA" && !refCurso) {
    return res.status(400).json({
      error: "Si tipoSolicitud es ACADEMICA, debes enviar refCurso.",
    });
  }

  // si es personal la solicitud, no es necesario ref curso
  if (tipoSolicitud === "PERSONAL" && refCurso) {
    refCurso = undefined;
    return res.status(400).json({
      error: "Si tipoSolicitud es PERSONAL, no debes enviar refCurso.",
    });
  }

  // validacion de formato url (por ahora solo prueba)
  if (!URL_REGEX.test(urlModelo3d) || !URL_REGEX.test(urlModeloStl)) {
    return res.status(400).json({
      error: "Las URLs deben ser válidas (http:// o https://).",
    });
  }

  try {
    // buscar al usuario en la base de datos
    const usuario = await prisma.usuario.findUnique({
      where: { id: idUsuario },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        rut: true,
        usuarioRol: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({
        error: "El usuario con ese ID no existe.",
      });
    }

    // si la solicitud es academica, se debe verificar que el estudiante esta inscrito en ese curso
    let nombreCursoData = "";
    if (tipoSolicitud === "ACADEMICA") {
      if (!refCurso || !idUsuario) {
        return res
          .status(400)
          .json({ error: "Faltan datos de curso o usuario." });
      }
      const inscripcion = await prisma.EstudianteCurso.findFirst({
        where: {
          refCurso,
          refEstudiante: idUsuario,
        },
        include: {
          curso: {
            select: {
              nombreCurso: true,
            },
          },
        },
      });
      if (!inscripcion) {
        return res.status(403).json({
          error: "El estudiante no está inscrito en ese curso.",
        });
      }

      if (!inscripcion.curso) {
        return res.status(404).json({
          error: "El curso con ese ID no existe.",
        });
      }

      const cursoData = await prisma.curso.findUnique({
        where: { idCurso: refCurso },
        select: { nombreCurso: true },
      });
      nombreCursoData = cursoData.nombreCurso;
    }

    // recuperar nombre del curso

    // crear la impresion, estado inicial = "Pendiente"
    const impresion = await prisma.impresion.create({
      data: {
        solicitanteNombre: usuario.nombre,
        solicitanteApellido: usuario.apellido,
        solicitanteEmail: usuario.email,
        solicitanteRut: usuario.rut,
        refEstudiante: idUsuario,
        tipoSolicitud: tipoSolicitud,
        nombreCurso: nombreCursoData,
        refCurso: refCurso,
        colorOpcion1: color1,
        colorOpcion2: color2,
        colorOpcion3: color3,
        comentarioUsuario: comentario,
        urlModelo3d: urlModelo3d,
        urlModeloStl: urlModeloStl,
        estadoImpresion: "PENDIENTE",
        comentarioTecnico: "",
        observacionAyudante: "",
        tiempoEstimadoImpresion: "10 minutos",
        tipoUsuario: usuario.usuarioRol,
      },
      select: {
        idImpresion: true,
        solicitanteNombre: true,
        solicitanteEmail: true,
        tipoSolicitud: true,
        estadoImpresion: true,
        creadoEn: true,
      },
    });

    res.status(201).json({
      message: "Solicitud de impresión creada correctamente.",
      impresion,
    });
  } catch (error) {
    console.error("Error al crear solicitud de impresión:", error);
    res.status(500).json({ error: "Error interno al crear solicitud." });
  }
});

export default router;
