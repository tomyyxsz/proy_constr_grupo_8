import dotenv from "dotenv";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import app from "../../appTest.js";
import request from "supertest";

dotenv.config({ path: new URL("../../../.env.test", import.meta.url) });

const { prisma } = await import("../../lib/prisma.js");

describe("Creación de Semestre", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.semestre.deleteMany({
      where: {
        anio: 2024,
        periodo: 2,
        fechaInicio: new Date("2024-01-01"),
        fechaFin: new Date("2024-06-30"),
      },
    });
    await prisma.$disconnect();
  });

  it("debería crear un semestre correctamente", async () => {
    const response = await request(app).post("/crear-semestre").send({
      anio: 2024,
      periodo: 2,
      fechaInicio: "2024-01-01",
      fechaFin: "2024-06-30",
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("idSemestre");
    expect(response.body.anio).toBe(2024);
    expect(response.body.periodo).toBe(2);
    expect(new Date(response.body.fechaInicio)).toEqual(new Date("2024-01-01"));
    expect(new Date(response.body.fechaFin)).toEqual(new Date("2024-06-30"));
  });
  it("debería retornar error si faltan campos obligatorios", async () => {
    const response = await request(app).post("/crear-semestre").send({
      anio: 2024,
      periodo: 2,
      fechaInicio: "2024-01-01",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe(
      "Debes enviar anio, periodo, fechaInicio y fechaFin para crear un semestre.",
    );
  });
});
