
import dotenv from "dotenv";
import { afterAll, beforeAll, describe, expect, it, beforeEach } from "vitest";
import app from "../../appTest.js";
import request from "supertest";

dotenv.config({ path: new URL("../../../.env.test", import.meta.url) });

const { prisma } = await import("../../lib/prisma.js");

describe("Creación de Curso", () => {
  beforeAll(async () => {

    // crear profesor de prueba y tambien semestre
    const profesor =await prisma.usuario.create({
      data: {
        nombre: "Profesor Test",
        apellido:"doctor",
        email: "profesor.creacioncurso@example.com",
        password: "password123",
        usuarioRol: "PROFESOR",
        rut: "11223344-5",
      },
    });
    const semestre = await prisma.semestre.create({
      data: {
        anio: 2026,
        periodo: 2,
        fechaInicio: new Date('2026-08-01'),
        fechaFin: new Date('2026-12-31'),
      },
    });


    await prisma.$connect();
  });

  afterAll(async () => {
    // borrar datos de prueba
    await prisma.curso.deleteMany({
      where: {
        nombreCurso: "CursoenCreacionCurso",
        },
    });

    await prisma.usuario.deleteMany({
      where: {
        email: "profesor.creacioncurso@example.com",
      },
    });
    await prisma.semestre.deleteMany({
      where: {
        anio: 2026,
        periodo: 2,
      },
    });

    await prisma.$disconnect();

  });

  it ("debería crear un curso correctamente", async () => {
    const profesor = await prisma.usuario.findUnique({
      where: { email: "profesor.creacioncurso@example.com" },
    });
    const semestre = await prisma.semestre.findFirst({
      where: { anio: 2026, periodo: 2 },
    });
    const response = await request(app)
      .post("/crear-curso")
      .send({
        nombreCurso: "CursoenCreacionCurso",
        idProfesor: profesor.id,
        idSemestre: semestre.idSemestre,
      });
    expect(response.status).toBe(201);
  });

  it("deberia fallar si el profesor no existe", async () => {
    const semestre = await prisma.semestre.findFirst({
      where: { anio: 2026, periodo: 2 },
    });
    const response = await request(app)
      .post("/crear-curso")
      .send({
        nombreCurso: "Curso de Prueba",
        idProfesor: "00000000-0000-0000-0000-000000000000", // ID de profesor que no existe
        idSemestre: semestre.idSemestre,
      });
    expect(response.status).toBe(404);
  });

  it("deberia fallar si el semestre no existe", async () => {
    const profesor = await prisma.usuario.findUnique({
      where: { email: "profesor.creacioncurso@example.com" },
    });
    const response = await request(app)
      .post("/crear-curso")
      .send({
        nombreCurso: "Curso de Prueba",
        idProfesor: profesor.id,
        idSemestre: "00000000-0000-0000-0000-000000000000", // ID de semestre que no existe
      });
    expect(response.status).toBe(404);
  });
});