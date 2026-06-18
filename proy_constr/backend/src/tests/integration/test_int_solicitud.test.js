/*
Crear test de integracion para solicitud de impresion,
se sigue la misma base que el test unitario para la solicitud, pero 
ahora se integra con la base de datos, siguiendo mas o menos
el ejemplo de solicitudimpresion.js,
donde segun el id del usuario se adjuntan sus datos, y luego
el rellena los demas campos.
crear un caso exitoso con todos los campos correctos y se ingreso la solicitud a la db
crear un caso de error donde el id del estudiante no existe en la db.

hay que tener en cuenta que impresion tiene muchos campos:
  idImpresion String @id @default(uuid()) @db.Uuid
  solicitanteNombre String @db.VarChar(50)
  solicitanteApellido String @db.VarChar(50)
  solicitanteEmail String @db.VarChar(100)
  solicitanteRut String @db.VarChar(10)

  refEstudiante String @db.Uuid
  estudiante Usuario @relation("impresionEstudiante", fields: [refEstudiante], references: [id])
  
  refAyudante String @db.Uuid
  ayudante Usuario @relation("impresionAyudante", fields: [refAyudante], references: [id])

  tipoUsuario String @db.VarChar(50)
  tipoSolicitud String @db.VarChar(50)
  nombreCurso String @db.VarChar(100)

  refCurso String @db.Uuid
  curso Curso @relation(fields: [refCurso], references: [idCurso])

  colorOpcion1 String @db.VarChar(50)
  colorOpcion2 String @db.VarChar(50)
  colorOpcion3 String @db.VarChar(50)

  comentarioTecnico String @db.VarChar(255)
  urlModelo3d String @db.VarChar(255)
  urlModeloStl String @db.VarChar(255)

  comentarioUsuario String @db.VarChar(255)
  estadoImpresion EstadoImpresion @default(PENDIENTE)

  observacionAyudante String @db.VarChar(255)
  motivoRechazo String? @db.VarChar(255) 
  tiempoEstimadoImpresion String @db.VarChar(50)
  inicioImpresion DateTime? @db.Timestamp(6)
  creadoEn DateTime @default(now()) @db.Timestamp(6)
*/

import dotenv from "dotenv";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import app from "../../appTest.js";
import request from "supertest";

dotenv.config({ path: new URL("../../../.env.test", import.meta.url) });

const { prisma } = await import("../../lib/prisma.js");


let contexto = {};

describe("Solicitud de Impresion - Integracion con Base de Datos", () => {
  beforeAll(async () => {
    await prisma.$connect();
    // antes de comenzar crear datos de prueba en la base de datos
    // usuario estudiante, usuario ayudante, usuario profesor, semestre y curso
    // para ejecutar las pruebas

    await prisma.usuario.create({
      data: {
        nombre: "Test", apellido: "Integracion", email: "usuariotest@example.com", rut: "21748641-6",
        usuarioRol: "ESTUDIANTE",
        password: "password123",
      },
    });

    await prisma.usuario.create({
      data: {
        nombre: "Ayudante", apellido: "Integracion", email: "ayutest@example.com", rut: "21748641-7",
        usuarioRol: "AYUDANTE",
        password: "password123",
      },
    });

    await prisma.usuario.create({
      data: {
        nombre: "Profesor", apellido: "Integracion", email: "proftest@example.com", rut: "21748641-8",
        usuarioRol: "PROFESOR",
        password: "password123",
      },
    });

    await prisma.semestre.create({
      // semestre tiene anio,periodo,fechainicio,fechafin,estadosemestre.
      data: {
        anio: 2025, periodo: 2, fechaInicio: new Date("2024-08-01"), fechaFin: new Date("2024-12-31"), estadoSemestre: "ACTIVO",
      },
    });

    const semestre = await prisma.semestre.findFirst({
      where: { anio: 2025, periodo: 2 },
    });
    const idSemestre = semestre.idSemestre;

    const profesor = await prisma.usuario.findUnique({
      where: { email: "proftest@example.com" },
    });
    const idProfesor = profesor.id;
    await prisma.curso.create({
      // curso tiene nombreCurso, refSemestre, refProfesor.
      data: {
        nombreCurso: "Curso de Prueba", refSemestre: idSemestre, refProfesor: idProfesor,
      },
    });

    await prisma.curso.create({
      // curso tiene nombreCurso, refSemestre, refProfesor.
      data: {
        nombreCurso: "Curso de Prueba EST no inscrito", refSemestre: idSemestre, refProfesor: idProfesor,
      }
    });



    const [usuario, curso, ayudante, curso2] = await Promise.all([
    prisma.usuario.findUnique({ where: { email: "usuariotest@example.com" } }),
    prisma.curso.findFirst({ where: { nombreCurso: "Curso de Prueba" } }),
    prisma.usuario.findUnique({ where: { email: "ayutest@example.com" } }),
    prisma.curso.findFirst({ where: { nombreCurso: "Curso de Prueba EST no inscrito" } })
    ]);

    contexto = {
      estudiante: usuario,
      curso: curso,
      ayudante: ayudante,
      estudianteCurso: null,
      curso2: curso2
    }

        await prisma.EstudianteCurso.create({
      data: {
        refCurso: contexto.curso.idCurso,
        refEstudiante: contexto.estudiante.id
      }});


  });

  afterAll(async () => {


    await prisma.EstudianteCurso.deleteMany({
    });

    await prisma.impresion.deleteMany({
      where : { solicitanteEmail: "usuariotest@example.com" },
    });
        await prisma.curso.deleteMany({
      where: { nombreCurso: "Curso de Prueba" },
    });
    await prisma.curso.deleteMany({
      where: { nombreCurso: "Curso de Prueba EST no inscrito" },
     });
    await prisma.semestre.deleteMany({
      where: { anio: 2024, periodo: 2 },
    });
    await prisma.usuario.deleteMany({
      where: { email: "usuariotest@example.com" },
    });

    await prisma.usuario.deleteMany({
      where: { email: "ayutest@example.com" },
    });
    await prisma.usuario.deleteMany({
      where: { email: "proftest@example.com" },
    });
    await prisma.semestre.deleteMany({
      where: { anio: 2024, periodo: 2 },
    });

    await prisma.$disconnect();
  });


  
  it("debería crear una solicitud de impresión correctamente en la base de datos", async () => {


    // otros datos
    const tipoSolicitud = "ACADEMICA";

    // crear la solicitud de impresion
    const impresion = await prisma.impresion.create({
      data: {
        solicitanteNombre: contexto.estudiante.nombre,
        solicitanteApellido: contexto.estudiante.apellido,
        solicitanteEmail: contexto.estudiante.email,
        solicitanteRut: contexto.estudiante.rut,
        estudiante: {
          connect: { id: contexto.estudiante.id },
        },
        ayudante: {
          connect: { id: contexto.ayudante.id },
        },
        curso: {
          connect: { idCurso: contexto.curso.idCurso },
        },
        nombreCurso: "Curso de Prueba",
        tipoUsuario: contexto.estudiante.usuarioRol,
        tipoSolicitud: tipoSolicitud,
        colorOpcion1: "#00000",
        colorOpcion2: "#00000",
        colorOpcion3: "#00000",
        comentarioTecnico: "",
        comentarioUsuario: "Por favor imprimir con alta calidad.",
        observacionAyudante: "",
        urlModelo3d: "http://example.com/modelo3d.obj",
        urlModeloStl: "http://example.com/modelo.stl",
        estadoImpresion: "PENDIENTE",
        tiempoEstimadoImpresion: "10 minutos",
      },
    });

    expect(impresion).toHaveProperty("idImpresion");
    expect(impresion.solicitanteNombre).toBe("Test");
    expect(impresion.solicitanteEmail).toBe("usuariotest@example.com");
    expect(impresion.tipoSolicitud).toBe(tipoSolicitud);
    expect(impresion.estadoImpresion).toBe("PENDIENTE");
    expect(impresion.urlModelo3d).toBe("http://example.com/modelo3d.obj");
    expect(impresion.urlModeloStl).toBe("http://example.com/modelo.stl");
    expect(impresion.refEstudiante).toBe(contexto.estudiante.id);
    expect(impresion.nombreCurso).toBe("Curso de Prueba");
    expect(impresion.refCurso).toBe(contexto.curso.idCurso);
    expect(impresion.colorOpcion1).toBe("#00000");
    expect(impresion.colorOpcion2).toBe("#00000");
    expect(impresion.colorOpcion3).toBe("#00000");
    expect(impresion.comentarioUsuario).toBe(
      "Por favor imprimir con alta calidad.",
    );
    expect(impresion.comentarioTecnico).toBe("");
    expect(impresion.observacionAyudante).toBe("");
    expect(impresion.motivoRechazo).toBeNull();
    expect(impresion.tiempoEstimadoImpresion).toBe("10 minutos");
    expect(impresion.inicioImpresion).toBeNull();
  });

  it("validar creacion correcta de solicitud personal usando rutas POST", async () => {
    const response = await request(app).post("/crear").send({
      idEstudiante: contexto.estudiante.id,
      color1: "#00000",
      color2: "#00000",
      color3: "#00000",
      tipoSolicitud: "ACADEMICA",
      comentario: "Por favor imprimir con alta calidad.",
      urlModelo3d: "http://example.com/modelo3d.obj",
      urlModeloStl: "http://example.com/modelo.stl",
      refCurso: contexto.curso.idCurso,
    });
    expect(response.status).toBe(201);
  });
  it("validar tipo de solicitud", async () => {
      const response = await request(app).post("/crear").send({
        idEstudiante: contexto.estudiante.id,
        color1: "#00000",
        color2: "#00000",
        color3: "#00000",
        tipoSolicitud: "INVALIDA",
        comentario: "Por favor imprimir con alta calidad.",
        urlModelo3d: "http://example.com/modelo3d.obj",
        urlModeloStl: "http://example.com/modelo.stl",
        refCurso: contexto.curso.idCurso,
      });
      expect(response.status).toBe(400);
    });

  it("validar campos obligatorios", async () => {
    const response = await request(app).post("/crear").send({
      idEstudiante: contexto.estudiante.id,
      // color1 falta
      color2: "#00000",
      color3: "#00000",
      tipoSolicitud: "ACADEMICA",
      comentario: "Por favor imprimir con alta calidad.",
      urlModelo3d: "http://example.com/modelo3d.obj",
      urlModeloStl: "http://example.com/modelo.stl",
      refCurso: contexto.curso.idCurso,
    });
    expect(response.status).toBe(400);
  });

  it("validar si es personal, no se necesita refcurso", async () => {
    const response = await request(app).post("/crear").send({
      idEstudiante: contexto.estudiante.id,
      color1: "#00000",
      color2: "#00000",
      color3: "#00000",
      tipoSolicitud: "PERSONAL",
      comentario: "Por favor imprimir con alta calidad.",
      urlModelo3d: "http://example.com/modelo3d.obj",
      urlModeloStl: "http://example.com/modelo.stl",
      // refCurso no se incluye para solicitud personal
    });
    expect(response.status).toBe(201);
  });
  it("validar formato url", async () => {
    const response = await request(app).post("/crear").send({
      idEstudiante: contexto.estudiante.id,
      color1: "#00000",
      color2: "#00000",
      color3: "#00000",
      tipoSolicitud: "ACADEMICA",
      comentario: "Por favor imprimir con alta calidad.",
      urlModelo3d: "invalid-url",
      urlModeloStl: "http://example.com/modelo.stl",
      refCurso: contexto.curso.idCurso,
    });
    expect(response.status).toBe(400);
  });
  it("validar que estudiante no existe", async () => {
    const response = await request(app).post("/crear").send({
      idEstudiante: "non-existent-id",
      color1: "#00000",
      color2: "#00000",
      color3: "#00000",
      tipoSolicitud: "PERSONAL",
      comentario: "Por favor imprimir con alta calidad.",
      urlModelo3d: "http://example.com/modelo3d.obj",
      urlModeloStl: "http://example.com/modelo.stl",
      refCurso: contexto.curso.idCurso,
    });
    expect(response.status).toBe(400);
  });
  it("validar que estudiante no esta inscrito en el curso", async () => {
    const response = await request(app).post("/crear").send({
      idEstudiante: contexto.estudiante.id,
      color1: "#00000",
      color2: "#00000",
      color3: "#00000",
      tipoSolicitud: "ACADEMICA",
      comentario: "Por favor imprimir con alta calidad.",
      urlModelo3d: "http://example.com/modelo3d.obj",
      urlModeloStl: "http://example.com/modelo.stl",
      refCurso: contexto.curso2.idCurso, // curso donde el estudiante no esta inscrito
  });
    expect(response.status).toBe(403);
   });
  it("validar que el curso no existe", async () => {
    const response = await request(app).post("/crear").send({
      idEstudiante: contexto.estudiante.id,
      color1: "#00000",
      color2: "#00000",
      color3: "#00000",
      tipoSolicitud: "ACADEMICA",
      comentario: "Por favor imprimir con alta calidad.",
      urlModelo3d: "http://example.com/modelo3d.obj",
      urlModeloStl: "http://example.com/modelo.stl",
      refCurso: "00000000-0000-0000-0000-000000000000", // curso que no existe
    });
    expect(response.status).toBe(403);
  });
});
