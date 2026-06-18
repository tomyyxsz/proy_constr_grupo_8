// crear un registro en la base de datos de prueba para luego testear
// con este mismo en validar login.

import dotenv from "dotenv";
import crypto from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../appTest.js";

dotenv.config({ path: new URL("../../../.env.test", import.meta.url) });

const { prisma } = await import("../../lib/prisma.js");
const testEmail = "testregistro@example.com";

describe("validar registro en base de datos", () => {
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
    await prisma.usuario.deleteMany({
      where: { email: testEmail },
    });
    await prisma.usuario.deleteMany({
      where: { email: "amigos@example.com" },
    });
    await prisma.$disconnect();
    // eliminar usuario de prueba
    await prisma.usuario.deleteMany({
      where: { email: "testAPI@example.com" },
    });
  });
  // formato usuario:
  // rut, nombre, apellido, email, password

  it("debería crear un nuevo usuario en la base de datos de prueba", async () => {
    const userId = crypto.randomUUID();
    const nuevoUsuario = {
      id: userId,
      rut: "16887941-5",
      nombre: "Test",
      apellido: "User",
      email: testEmail,
      password: "password123",
      usuarioRol: "ESTUDIANTE",
    };

    await prisma.usuario.create({
      data: nuevoUsuario,
    });

    const response = await prisma.usuario.findMany({
      where: { email: testEmail },
    });

    expect(response).toHaveLength(1);
    expect(response[0]).toMatchObject({
      rut: nuevoUsuario.rut,
      nombre: nuevoUsuario.nombre,
      apellido: nuevoUsuario.apellido,
      email: nuevoUsuario.email,
      password: nuevoUsuario.password,
    });
  });

  it("validar registro pero usando rutas de la API", async () => {
    const response = await request(app).post("/registro").send({
      rut: "21857836-5",
      nombre: "TestAPI",
      apellido: "UserAPI",
      email: "amigos@example.com",
      password: "APIpassword1!",
    });
    console.log("Response body:", response.body);

    expect(response.status).toBe(201);
  });
  it("validar que falta un campo al momento de registrar", async () => {
    const response = await request(app).post("/registro").send({
      rut: "21684893-6",
      nombre: "TestAPI",
      apellido: "UserAPI",
      email: "testAPI@example.com",
    });
    expect(response.status).toBe(400);
  });

  it("validar que el correo no tiene un formato valido", async () => {
    const response = await request(app).post("/registro").send({
      rut: "21684893-6",
      nombre: "TestAPI",
      apellido: "UserAPI",
      email: "invalid-email-format",
      password: "APIpassword1!",
    });
  });
  it("validar que la contraseña no cumple con los requisitos", async () => {
    const response = await request(app).post("/registro").send({
      rut: "21684893-6",
      nombre: "TestAPI",
      apellido: "UserAPI",
      email: "testAPI@example.com",
      password: "LOLITOFERNANDEZ!",
    });
  });
  it("validar rol invalido al registrarse", async () => {
    const response = await request(app).post("/registro").send({
      rut: "21684893-6",
      nombre: "TestAPI",
      apellido: "UserAPI",
      email: "testAPI@example.com",
      password: "APIpassword1!",
      usuarioRol: "INVALIDROLE",
    });
  });
  it("validar rut invalido", async () => {
    const response = await request(app).post("/registro").send({
      rut: "21684893-5",
      nombre: "TestAPI",
      apellido: "UserAPI",
      email: "testAPI@example.com",
      password: "APIpassword1!",
    });
  });
  it("validar que ya hay un usuario registrado con rut ya usado", async () => {
    const response = await request(app).post("/registro").send({
      rut: "21684893-6",
      nombre: "TestAPI",
      apellido: "UserAPI",
      email: "testAPI2@example.com",
      password: "APIpassword1!",
    });
  });
});
