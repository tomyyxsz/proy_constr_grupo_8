// Prueba de integración contra la base de datos de Docker.

import dotenv from "dotenv";
import { beforeAll, afterAll, describe, expect, it } from "vitest";

dotenv.config({ path: new URL("../../../.env.test", import.meta.url) });

const { prisma } = await import("../../lib/prisma.js");

describe("conexión a la base de datos", () => {
  beforeAll(async () => {
    await prisma.$connect();
    // borrar datos de pruebas anteriores
    await prisma.impresion.deleteMany();
    await prisma.estudianteCurso.deleteMany();
    await prisma.curso.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.semestre.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("debería conectarse correctamente a la base de datos de Docker", async () => {
    // recoger cualquiera consulta simple para verificar la conexión
    const resultado = await prisma.$queryRaw`SELECT 1 AS ok`;

    expect(resultado).toHaveLength(1);
    expect(resultado[0]).toMatchObject({ ok: 1 });
  });
});
