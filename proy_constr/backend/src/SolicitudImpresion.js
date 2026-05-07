// la solicitud viene de un solicitante o estudiante, el cual ingresa el url de los archivos para imprimir,
// un comentario opcional, tipo de solicitud (personal o academica -> en este caso se debe asignar un curso)
// 
import express from "express";
import { prisma } from "./lib/prisma.js";

const router = express.Router();

const URL_REGEX = /^https?:\/\/.+/;
const TIPOS_SOLICITUD = ["PERSONAL", "ACADEMICA"];

router.post("/crear", async (req, res) => {
  const {
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

    let cursoRef = null;
    // si la solicitud es academica, se debe verificar que el estudiante esta inscrito en ese curso
    if (tipoSolicitud === "ACADEMICA") {
      const inscripcion = await prisma.estudiante_curso.findUnique({
        where: {
          ["ref_Curso_ref_Estudiante"]: {
            ["ref_Curso"]: refCurso,
            ["ref_Estudiante"]: idEstudiante,
          },
        },
        include: {
          curso: {
            select: {
              ["nombre_curso"]: true,
            },
          },
        },
      });

      if (!inscripcion) {
        return res.status(403).json({
          error: "El estudiante no está inscrito en ese curso.",
        });
      }

      cursoRef = refCurso;
    }

    // crear la impresion, estado inicial = "creado"
    const impresion = await prisma.impresion.create({
      data: {
        ["solicitante_nombre"]: estudiante.nombre,
        ["solicitante_apellido"]: estudiante.apellido,
        ["solicitante_email"]: estudiante.email,
        ["solicitante_rut"]: estudiante.rut,
        ["ref_estudiante"]: idEstudiante,
        ["ref_ayudante"]: null,
        ["tipo_usuario"]: "ESTUDIANTE",
        ["tipo_solicitud"]: tipoSolicitud,
        ["ref_curso"]: cursoRef,
        ["color_opcion1"]: color1,
        ["color_opcion2"]: color2,
        ["color_opcion3"]: color3,
        ["comentario_usuario"]: comentario || null,
        ["url_modelo_3d"]: urlModelo3d,
        ["url_modelo_stl"]: urlModeloStl,
        ["estado_impresion"]: "CREADO",
      },
      select: {
        ["id_impresion"]: true,
        ["solicitante_nombre"]: true,
        ["solicitante_email"]: true,
        ["tipo_solicitud"]: true,
        ["estado_impresion"]: true,
        ["creado_en"]: true,
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
