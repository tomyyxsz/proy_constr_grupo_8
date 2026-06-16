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
    idEstudiante,
    color1,
    color2,
    color3,
    tipoSolicitud,
    comentario,
    urlModelo3d,
    urlModeloStl,
    refCurso,
  } = req.body;

  // validar campos obligatorios
  if (
    !idEstudiante ||
    !color1 ||
    !color2 ||
    !color3 ||
    !tipoSolicitud ||
    !urlModelo3d ||
    !urlModeloStl
  ) {
    return res.status(400).json({
      error:
        "Debes enviar idEstudiante, color1, color2, color3, tipoSolicitud, urlModelo3d y urlModeloStl.",
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
    const estudiante = await prisma.usuario.findUnique({
      where: { id: idEstudiante },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        rut: true,
      },
    });

    if (!estudiante) {
      return res.status(404).json({
        error: "El estudiante con ese ID no existe.",
      });
    }

    //let cursoRef = "5eb68c60-f502-4be8-9276-f706c33d31bc";

    // si la solicitud es academica, se debe verificar que el estudiante esta inscrito en ese curso
    if (tipoSolicitud === "ACADEMICA") {
      const inscripcion = await prisma.EstudianteCurso.findFirst({
        where: {
          refCurso,
          refEstudiante: idEstudiante,
        },
        include: {
          curso: {
            select: {
              nombreCurso: true,
            },
          },
        },
      });

      if (!inscripcion.curso){
        return res.status(404).json({
          error: "El curso con ese ID no existe.",
        });
      }
      if (!inscripcion) {
        return res.status(403).json({
          error: "El estudiante no está inscrito en ese curso.",
        });
      }

    }

    // recuperar nombre del curso
    const cursoData = await prisma.curso.findUnique({
      where: { idCurso: refCurso },
      select: { nombreCurso: true },
    });
    const nombreCursoData = cursoData ? cursoData.nombreCurso : null;
    
    // crear la impresion, estado inicial = "creado"
    const impresion = await prisma.impresion.create({
      data: {
        solicitanteNombre: estudiante.nombre,
        solicitanteApellido: estudiante.apellido,
        solicitanteEmail: estudiante.email,
        solicitanteRut: estudiante.rut,

        refEstudiante: idEstudiante,
        refAyudante: null,
        tipoUsuario: "ESTUDIANTE",
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
