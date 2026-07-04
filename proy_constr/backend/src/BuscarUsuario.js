import express from "express";
import { prisma } from "./lib/prisma.js";

const router = express.Router();

const USER_SELECT = {
  id: true,
  rut: true,
  nombre: true,
  apellido: true,
  email: true,
  usuarioRol: true,
  creadoEn: true,
  actualizadoEn: true,
};

const ALLOWED_ROLES = ["ESTUDIANTE", "AYUDANTE", "PROFESOR", "ADMINISTRADOR", "SOLICITANTE"];

function normalizeRole(role) {
  if (!role) {
    return null;
  }

  const normalized = String(role).trim().toUpperCase();
  return ALLOWED_ROLES.includes(normalized) ? normalized : null;
}

router.get("/buscar", async (req, res) => {
  const { email, rut, rol, nombre, apellido } = req.query;
  const filters = [];

  if (email) {
    filters.push({ email: String(email).trim().toLowerCase() });
  }

  if (rut) {
    filters.push({ rut: String(rut).trim() });
  }

  if (rol) {
    const normalizedRole = normalizeRole(rol);
    if (!normalizedRole) {
      return res.status(400).json({
        error: "Rol de usuario invalido. Usa ESTUDIANTE, AYUDANTE, PROFESOR, ADMINISTRADOR O SOLICITANTE.",
      });
    }

    filters.push({ usuarioRol: normalizedRole });
  }

  if (nombre) {
    filters.push({ nombre: { contains: String(nombre).trim(), mode: "insensitive" } });
  }

  if (apellido) {
    filters.push({ apellido: { contains: String(apellido).trim(), mode: "insensitive" } });
  }

  if (filters.length === 0) {
    return res.status(400).json({
      error: "Debes enviar al menos un filtro: email, rut, rol, nombre o apellido.",
    });
  }

  try {
    const orderBy = {};
    orderBy["creadoEn"] = "desc";

    const usuarios = await prisma.usuario.findMany({
      where: {
        AND: filters,
      },
      select: USER_SELECT,
      orderBy,
    });

    return res.json({ cantidad: usuarios.length, usuarios });
  } catch (error) {
    console.error("Error al buscar usuarios:", error);
    return res.status(500).json({ error: "Error interno al buscar usuarios." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await prisma.usuario.findUnique({
      where: {
        id: req.params.id,
      },
      select: USER_SELECT,
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    return res.json({ usuario: user });
  } catch (error) {
    console.error("Error al buscar usuario por id:", error);
    return res.status(500).json({ error: "Error interno al buscar usuario." });
  }
});
// ruta para borrar usuarios en caso de rut repetido o que haya habido algun error. se borra con el rut
// la ruta para postman es DELETE http://localhost:3001/api/usuarios/rut/12345678-9 (ejemplo de rut)
router.delete("/rut/:rut", async (req, res) => {
  try {
    const rut = String(req.params.rut).trim().toUpperCase();

    const deleted = await prisma.usuario.deleteMany({
      where: { rut },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ error: "No se encontró ningún usuario con ese RUT." });
    }

    return res.json({
      message: "Usuarios eliminados correctamente.",
      eliminados: deleted.count,
    });
  } catch (error) {
    console.error("Error al eliminar usuarios por rut:", error);
    return res.status(500).json({ error: "Error interno al eliminar usuarios." });
  }
});

router.get("/:idUsuario/cursos", async (req, res) => {
  const { idUsuario } = req.params;

  try {
    const inscripciones = await prisma.estudianteCurso.findMany({
      where: { refEstudiante: idUsuario },
      include: {
        curso: true,
      },
    });
    const cursos = inscripciones.map((inscripcion) => inscripcion.curso);
    return res.status(200).json({ cursos });
  } catch (error) {
    console.error("Error al obtener cursos del usuario:", error);
    return res.status(500).json({ error: "Error interno al obtener cursos del usuario." });
  }
});

router.get("/profesores/:idProfesor/cursos", async (req, res) => {
  const { idProfesor } = req.params;
  try {
    const cursos = await prisma.curso.findMany({
      where: { refProfesor: idProfesor },
    });
    return res.status(200).json({ cursos });
  } catch (error) {
    console.error("Error al obtener cursos del profesor:", error);
    return res.status(500).json({ error: "Error interno al obtener cursos del profesor." });
  }
});
// ruta para obtener todos los estudiantes de un profesor, se envia el id del profesor y se devuelve un array de estudiantes
// devolver nombre, correo, curso y grupo al que pertenece el estudiante, si no tiene grupo devolver null
router.get("/profesores/alumnos/:idProfesor", async (req, res) => {
  const { idProfesor } = req.params;

  try {
    const cursos = await prisma.curso.findMany({
      where: {
        refProfesor: idProfesor,
      },
      include: {
        estudianteCurso: {
          include: {
            estudiante: {
              include: {
                grupoEstudiante: {
                  include: {
                    grupo: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    // una vez recuperado el id del estudiante, recuperar otros campos necesarios para frontend
    const estudiantes = cursos.flatMap((curso) =>
      curso.estudianteCurso.map((inscripcion) => {
        const estudiante = inscripcion.estudiante;
        const grupoEstudiante = estudiante.grupoEstudiante.find(
          (ge) => ge.refEstudiante === estudiante.id,
        );
        return {
          id: estudiante.id,
          nombre: estudiante.nombre,
          correo: estudiante.email,
          refCurso: curso.idCurso,
          cursoNombre: curso.nombreCurso,
          grupo: grupoEstudiante ? grupoEstudiante.grupo.nombreGrupo : null,
        };
      }
      ),
    );
    return res.status(200).json({ estudiantes });
  } catch (error) {
    console.error("Error al obtener estudiantes del profesor:", error);
    return res.status(500).json({ error: "Error interno al obtener estudiantes del profesor." });
  }
});

export default router;