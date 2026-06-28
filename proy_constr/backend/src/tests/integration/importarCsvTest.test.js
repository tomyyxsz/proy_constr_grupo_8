// clase para tests de importadorcsv.js
// se usa la base de datos de prueba en Docker, .env.test
import { beforeAll, afterAll, describe, expect, it } from "vitest";
import app from "../../appTest.js";
import dotenv from "dotenv";
import request from "supertest";
dotenv.config({ path: new URL("../../../.env.test", import.meta.url) });

const { prisma } = await import("../../lib/prisma.js");

let idCursoTest; // variable global para almacenar el id del curso de prueba

describe("Funciones de importadorCSV", () => {
  beforeAll(async () => {
    await prisma.$connect();

    // creamos un curso de prueba para los tests
    await prisma.semestre.create({
      // semestre tiene anio,periodo,fechainicio,fechafin,estadosemestre.
      data: {
        anio: 2053,
        periodo: 2,
        fechaInicio: new Date("2053-08-01"),
        fechaFin: new Date("2053-12-31"),
        estadoSemestre: "ACTIVO",
      },
    });
    await prisma.usuario.create({
      data: {
        nombre: "Profesor",
        apellido: "CSV",
        email: "testingcsv@example.com",
        rut: "18726323",
        usuarioRol: "PROFESOR",
        password: "password123",
      },
    });

    const semestre = await prisma.semestre.findFirst({
      where: { anio: 2053, periodo: 2 },
    });
    const idSemestre = semestre.idSemestre;

    const profesor = await prisma.usuario.findUnique({
      where: { email: "testingcsv@example.com" },
    });
    const idProfesor = profesor.id;

    await prisma.curso.create({
      // curso tiene nombreCurso, refSemestre, refProfesor.
      data: {
        nombreCurso: "Curso para importar CSV",
        refSemestre: idSemestre,
        refProfesor: idProfesor,
      },
    });

    const curso = await prisma.curso.findFirst({
      where: { nombreCurso: "Curso para importar CSV" },
    });
    idCursoTest = curso.idCurso; // Guardamos el id del curso de prueba
  });

  afterAll(async () => {
    await prisma.$disconnect();

    // limpiar la base de datos de prueba eliminando el curso y el semestre creados
    await prisma.estudianteCurso.deleteMany({
      where: { refCurso: idCursoTest },
    });
    await prisma.curso.deleteMany({
      where: { nombreCurso: "Curso para importar CSV" },
    });
    await prisma.semestre.deleteMany({
      where: { anio: 2053, periodo: 2 },
    });
    await prisma.usuario.deleteMany({
      where: { email: "testingcsv@example.com" },
    });

  });

  it("deberia rechazar una solicitud sin idCurso", async () => {
    // Simular una solicitud sin idCurso
    const response = await request(app)
      .post(`/api/importarCSV/`) // Endpoint sin idCurso
      .attach("csvFile", Buffer.from("nombre,apellido,rut,email\nJuan,Perez,12345678-9,juan.perez@ejemplo.com"))
      .set("Content-Type", "multipart/form-data");

    expect(response.status).toBe(404);
  });
  it ("deberia rechazar una solicitud con idCurso inexistente", async () => {
    const response = await request(app)
      .post("/api/importarCSV/00000000-0000-0000-0000-000000000000") //
      .attach("csvFile", Buffer.from("nombre,apellido,rut,email\nJuan,Perez,12345678,juan.perez@ejemplo.com"))
      .set("Content-Type", "multipart/form-data");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "El curso con ese ID no existe.");
  });

  it("deberia rechazar una solicitud sin archivo CSV", async () => {
    const response = await request(app)
      .post(`/api/importarCSV/${idCursoTest}`) // Endpoint con idCurso de prueba
      .set("Content-Type", "multipart/form-data");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Se debe subir un archivo CSV");
  });
  it("deberia importar estudiantes desde un CSV valido", async () => {
    const csvContent = "nombre,apellido,rut,email\nJuan,Perez,12345678,juan.perez@ejemplo.com";
    const response = await request(app)
      .post(`/api/importarCSV/${idCursoTest}`)
      .attach("csvFile", Buffer.from(csvContent))
      .set("Content-Type", "multipart/form-data");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Importacion exitosa. Se procesaron 1 estudiantes.");
  });
});
