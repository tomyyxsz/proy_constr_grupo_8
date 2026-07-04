import dotenv from "dotenv";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import app from "../../appTest.js";
import request from "supertest";

dotenv.config({ path: new URL("../../../.env.test", import.meta.url) });

const { prisma } = await import("../../lib/prisma.js");

describe("Creación de Curso", () => {
  let archivoCSV;
  beforeAll(async () => {
    await prisma.$connect();

    // crear profesor de prueba y tambien semestre
    await prisma.usuario.create({
      data: {
        nombre: "Profesor Test",
        apellido: "doctor",
        email: "profesor.creacioncurso@example.com",
        password: "password123",
        usuarioRol: "PROFESOR",
        rut: "11223344-5",
      },
    });
    await prisma.semestre.create({
      data: {
        anio: 2026,
        periodo: 2,
        fechaInicio: new Date("2026-08-01"),
        fechaFin: new Date("2026-12-31"),
      },
    });
  });

  afterAll(async () => {
    // borrar datos de prueba
    await prisma.estudianteCurso.deleteMany();

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

  it("debería crear un curso correctamente", async () => {
    archivoCSV =
      "nombre,apellido,rut,email\n" +
      "Juan,Perez,42812732,juan.perez@ejemplo.com";
    const buffer = Buffer.from(archivoCSV, "utf-8");
    const profesor = await prisma.usuario.findUnique({
      where: { email: "profesor.creacioncurso@example.com" },
    });
    const semestre = await prisma.semestre.findFirst({
      where: { anio: 2026, periodo: 2 },
    });

    const response = await request(app)
      .post("/crear-curso")
      .field("nombreCurso", "CursoenCreacionCurso")
      .field("idProfesor", profesor.id)
      .field("idSemestre", semestre.idSemestre)
      .attach("archivoCSV", buffer, "archivo.csv");
      
    expect(response.status).toBe(201);
  });

  it("deberia fallar si el profesor no existe", async () => {
    archivoCSV =
      "nombre,apellido,rut,email\n" +
      "Juan,Perez,42812732,juan.perez@ejemplo.com";
    const buffer = Buffer.from(archivoCSV, "utf-8");
    const semestre = await prisma.semestre.findFirst({
      where: { anio: 2026, periodo: 2 },
    });
    const response = await request(app).post("/crear-curso").send({
      nombreCurso: "Curso de Prueba",
      idProfesor: "00000000-0000-0000-0000-000000000000", // ID de profesor que no existe
      idSemestre: semestre.idSemestre,
      archivoCSV: {name: "archivo.csv", data: buffer, mimetype:"text/csv",size: buffer.length}, // Simulando un archivo CSV
    });
    expect(response.status).toBe(400);
  });

  it("deberia fallar si el semestre no existe", async () => {
    archivoCSV =
      "nombre,apellido,rut,email\n" +
      "Juan,Perez,42812732,juan.perez@ejemplo.com";
    const buffer = Buffer.from(archivoCSV, "utf-8");
    const profesor = await prisma.usuario.findUnique({
      where: { email: "profesor.creacioncurso@example.com" },
    });
    const response = await request(app).post("/crear-curso").send({
      nombreCurso: "Curso de Prueba",
      idProfesor: profesor.id,
      idSemestre: "00000000-0000-0000-0000-000000000000", // ID de semestre que no existe
      archivoCSV: buffer, // Simulando un archivo CSV
    });
    expect(response.status).toBe(400);
  });
});
