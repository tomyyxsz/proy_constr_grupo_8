// test unitarios para crear grupo usando mocks

// test para ruta POST /crear-grupo. se crea usando refCurso y nombre del curso.
// test para ruta POST /agregar-estudiante. se crea usando refGrupo y refEstudiante. se valida que el estudiante no este ya en el grupo
// test para ruta POST /cambiar-grupo. recibe refGrupo y refEstudiante. se valida que el estudiante este en el grupo y que el grupo exista
// test para rut GET /listar-grupos/:idCurso. se valida que el curso exista y que el grupo exista. se valida que el grupo pertenezca al curso
// se debe usar un mock de prisma para simular la base de datos, insertarle un curso, estudiante, grupos y lo necesario
// se usan mocks, se deben importar de VITEST

import { describe, it, expect, vi } from "vitest";
import { v4 as uuidv4 } from "uuid";

import request from "supertest";
import app from "../../appTest.js";

let idCursoMock = uuidv4();
let idGrupoMock = uuidv4();
let refEstudiante = uuidv4();
let grupos = [
  {
    idGrupoCurso: idGrupoMock,
    refCurso: idCursoMock,
    nombreGrupo: "Grupo de Prueba",
  },
];
let grupoEstudiantes = [];
vi.mock("../../lib/prisma.js", () => ({
  prisma: {
    curso: {
      findUnique: vi.fn(({ where }) => {
        if (where.idCurso === idCursoMock) {
          return Promise.resolve({
            idCurso: idCursoMock,
          });
        }

        return Promise.resolve(null);
      }),
    },

    usuario: {
      findUnique: vi.fn(({ where }) => {
        if (where.id === refEstudiante) {
          return Promise.resolve({
            id: refEstudiante,
          });
        }

        return Promise.resolve(null);
      }),
    },

    grupoCurso: {
      findFirst: vi.fn(({ where }) => {
        return Promise.resolve(
          grupos.find(
            (g) =>
              g.refCurso === where.refCurso &&
              g.nombreGrupo === where.nombreGrupo
          ) ?? null
        );
      }),

      findUnique: vi.fn(({ where }) => {
        return Promise.resolve(
          grupos.find(
            (g) => g.idGrupoCurso === where.idGrupoCurso
          ) ?? null
        );
      }),

      findMany: vi.fn(({ where }) => {
        return Promise.resolve(
          grupos.filter(
            (g) => g.refCurso === where.refCurso
          )
        );
      }),

      create: vi.fn(({ data }) => {
        const nuevoGrupo = {
          idGrupoCurso: uuidv4(),
          refCurso: data.refCurso,
          nombreGrupo: data.nombreGrupo,
        };

        grupos.push(nuevoGrupo);

        return Promise.resolve(nuevoGrupo);
      }),
    },

    grupoEstudiante: {
      create: vi.fn(({ data }) => {
        grupoEstudiantes.push(data);
        return Promise.resolve(data);
      }),

      deleteMany: vi.fn(({ where }) => {
        const antes = grupoEstudiantes.length;

        grupoEstudiantes = grupoEstudiantes.filter(
          (g) =>
            !(
              g.refGrupo === where.refGrupo &&
              g.refEstudiante === where.refEstudiante
            )
        );

        return Promise.resolve({
          count: antes - grupoEstudiantes.length,
        });
      }),
    },
  },
}));

describe("Tests para creacionGrupo.js", () => {
  it("crear grupo con refCurso y nombreGrupo", async () => {
    const nombreGrupo = "Grupo de Prueba 2";
    const grupo = await request(app).post("/api/grupos/crear-grupo").send({
      refCurso: idCursoMock,
      nombreGrupo: nombreGrupo,
    });
    expect(grupo.status).toBe(201);
  });

  it ("deberia dar error si el curso no existe", async () => {
    const nombreGrupo = "Grupo de Prueba 3";
    const grupo = await request(app).post("/api/grupos/crear-grupo").send({
      refCurso: uuidv4(),
      nombreGrupo: nombreGrupo,
    });
    expect(grupo.status).toBe(404);
  });

  it("deberia dar error si el grupo ya existe", async () => {
    const nombreGrupo = "Grupo de Prueba";
    const grupo = await request(app).post("/api/grupos/crear-grupo").send({
      refCurso: idCursoMock,
      nombreGrupo: nombreGrupo,
    });
    expect(grupo.status).toBe(400);
  });

  it("deberia dar error si el uuid no es valido", async () => {
    const nombreGrupo = "Grupo de Prueba 4";
    const grupo = await request(app).post("/api/grupos/crear-grupo").send({
      refCurso: "1234",
      nombreGrupo: nombreGrupo,
    });
    expect(grupo.status).toBe(400);
  });

  it("deberia dar error si faltan campos", async () => {
    const grupo = await request(app).post("/api/grupos/crear-grupo").send({
      refCurso: idCursoMock,
    });
    expect(grupo.status).toBe(400);
  });



  it("agregar estudiante a grupo", async () => {

    const grupoEstudiante = await request(app)
      .post("/api/grupos/agregar-estudiante")
      .send({
        refGrupo: idGrupoMock,
        refEstudiante,
      });
    expect(grupoEstudiante.status).toBe(201);
  });

  it ("deberia dar error si el grupo no existe", async () => {
    const grupoEstudiante = await request(app)
      .post("/api/grupos/agregar-estudiante")
      .send({
        refGrupo: uuidv4(),
        refEstudiante,
      });
    expect(grupoEstudiante.status).toBe(404);
  });

  it ("deberia dar error si el uuid no es valido", async () => {
    const grupoEstudiante = await request(app)
      .post("/api/grupos/agregar-estudiante")
      .send({
        refGrupo: "1234",
        refEstudiante,
      });
    expect(grupoEstudiante.status).toBe(400);
  });

  it ("deberia dar error si faltan campos", async () => {
    const grupoEstudiante = await request(app)
      .post("/api/grupos/agregar-estudiante")
      .send({
        refGrupo: idGrupoMock,
      });
    expect(grupoEstudiante.status).toBe(400);
  });

  it("cambiar grupo de estudiante", async () => {

    const grupoEstudiante = await request(app).post("/api/grupos/cambiar-grupo").send({
      refGrupo: idGrupoMock,
      refEstudiante: refEstudiante,
      nuevoGrupo: uuidv4(),
    });
    expect(grupoEstudiante.status).toBe(201);
  });
  it ("deberia dar error si faltan campos", async () => {
    const grupoEstudiante = await request(app).post("/api/grupos/cambiar-grupo").send({
      refGrupo: idGrupoMock,
    });
    expect(grupoEstudiante.status).toBe(400);
  });
  it ("deberia dar error si el uuid es invalido", async () => {
    const grupoEstudiante = await request(app).post("/api/grupos/cambiar-grupo").send({
      refGrupo: "1234",
      refEstudiante: refEstudiante,
      nuevoGrupo: uuidv4(),
    });
    expect(grupoEstudiante.status).toBe(400);
  });


  it("listar grupos por curso", async () => {
    const grupos = await request(app).get(`/api/grupos/listar-grupos/${idCursoMock}`);
    expect (grupos.status).toBe(200);
  });

  it ("deberia dar error si el uuid es invalido", async () => {
    const grupos = await request(app).get(`/api/grupos/listar-grupos/1234`);
    expect (grupos.status).toBe(400);
  });
});
