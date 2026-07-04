// el profesor puede crear un grupo y agregar estudiantes a ese grupo, se usan las tablas
/* 

model GrupoCurso {
  idGrupoCurso     String            @id @default(uuid()) @db.Uuid
  refCurso         String            @db.Uuid
  nombreGrupo      String            @db.VarChar(100)
  ayudantias       Ayudantia[]
  curso            Curso             @relation(fields: [refCurso], references: [idCurso])
  grupoEstudiantes GrupoEstudiante[]
}

model GrupoEstudiante {
  refGrupo      String     @db.Uuid
  refEstudiante String     @db.Uuid
  estudiante    Usuario    @relation(fields: [refEstudiante], references: [id])
  grupo         GrupoCurso @relation(fields: [refGrupo], references: [idGrupoCurso])

  @@id([refGrupo, refEstudiante])
}

*/

import express from "express";
import { prisma } from "./lib/prisma.js";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";

const router = express.Router();
// la creacion de grupo solo crea el grupo usando el nombre y el id del curso, los estudiantes se agregan despues con otra ruta
router.post("/crear-grupo", async (req, res) => {
  const { refCurso, nombreGrupo } = req.body;

  if (!refCurso || !nombreGrupo) {
    return res.status(400).json({
      error: "Debes enviar refCurso y nombreGrupo para crear un grupo.",
    });
  }

  if (!uuidValidate(refCurso)) {
    return res.status(400).json({
      error: "El refCurso debe ser un UUID válido.",
    });
  }

  try {
    const curso = await prisma.curso.findUnique({
      where: { idCurso: refCurso },
    });

    if (!curso) {
      return res.status(404).json({
        error: "El curso con ese ID no existe.",
      });
    }

    const nuevoGrupo = await prisma.grupoCurso.create({
      data: {
        idGrupoCurso: uuidv4(),
        refCurso,
        nombreGrupo,
      },
    });

    res.status(201).json(nuevoGrupo);
  } catch (error) {
    console.error("Error al crear el grupo:", error);
    res.status(500).json({ error: "Error al crear el grupo" });
  }
});

router.post("/agregar-estudiante", async (req, res) => {
  const { refGrupo, refEstudiante } = req.body;

  if (!refGrupo || !refEstudiante) {
    return res.status(400).json({
      error:
        "Debes enviar refGrupo y refEstudiante para agregar un estudiante a un grupo.",
    });
  }

  if (!uuidValidate(refGrupo) || !uuidValidate(refEstudiante)) {
    return res.status(400).json({
      error: "refGrupo y refEstudiante deben ser UUID válidos.",
    });
  }

  try {
    const grupo = await prisma.grupoCurso.findUnique({
      where: { idGrupoCurso: refGrupo },
    });

    if (!grupo) {
      return res.status(404).json({
        error: "El grupo con ese ID no existe.",
      });
    }

    const estudiante = await prisma.usuario.findUnique({
      where: { id: refEstudiante },
    });

    if (!estudiante) {
      return res.status(404).json({
        error: "El estudiante con ese ID no existe.",
      });
    }

    const grupoEstudiante = await prisma.grupoEstudiante.create({
      data: {
        refGrupo,
        refEstudiante,
      },
    });
    res.status(201).json(grupoEstudiante);
  } catch (error) {
    console.error("Error al agregar el estudiante al grupo:", error);
    res.status(500).json({ error: "Error al agregar el estudiante al grupo" });
  }
});

// rescatar todos los grupos de un curso, se envia el id del curso y se devuelve un array de grupos con sus estudiantes
router.get("/listar-grupos/:idCurso", async (req, res) => {
  const { idCurso } = req.params;

  if (!uuidValidate(idCurso)) {
    return res.status(400).json({
      error: "El idCurso debe ser un UUID válido.",
    });
  }

  try {
    const grupos = await prisma.grupoCurso.findMany({
      where: { refCurso: idCurso },
      include: {
        grupoEstudiante: {
          include: {
            refEstudiante: true,
          },
        },
      },
    });

    res.status(200).json(grupos);
  } catch (error) {
    console.error("Error al listar los grupos:", error);
    res.status(500).json({ error: "Error al listar los grupos" });
  }
});


export default router;
