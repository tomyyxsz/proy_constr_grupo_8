// validar login en base de datos de prueba, el usuario viene de 
// validar registro. se borra el usuario de prueba al final

import dotenv from "dotenv";
import crypto from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../app.js";

dotenv.config({ path: new URL("../../../.env.test", import.meta.url) });

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hashed = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hashed}`;
  
}

const { prisma } = await import("../../lib/prisma.js");
const testEmail = "test_login@example.com";
const hashedPassword = hashPassword("Password1234!");


describe("validar login en base de datos", () => {
  beforeAll(async () => {
    await prisma.$connect();

    // crear usuario de prueba para validar login

	    await prisma.usuario.create({
      data: {
        id: crypto.randomUUID(),
        rut: "22345678-5",
        nombre: "Test",
        apellido: "User",
        email: testEmail,
        password: hashedPassword,
        usuarioRol: "ESTUDIANTE",
      },
    });
	

  });

  afterAll(async () => {
    //eliminar usuario de prueba
    await prisma.usuario.deleteMany({
      where: { email: testEmail },
    });
    await prisma.$disconnect();
  });

  it("debería validar el login como prisma correctamente", async () => {
    const response = await prisma.usuario.findMany({
      where: { email: testEmail },
    });

    expect(response[0]).not.toBeNull();
    expect(response[0].email).toBe(testEmail);
    expect(response[0].password).toBe(hashedPassword);
  });

  it("debería iniciar sesión en router correctamente", async () => {
	const response = await request(app).post("/login").send({
      email: testEmail,
      password: "Password1234!",
    });
    expect(response.status).toBe(200);
  });

  it("debería rechazar login con contraseña incorrecta", async () => {
	const response = await request(app).post("/login").send({
	  email: testEmail,
	  password: "WrongPassword",
	});
	expect(response.status).toBe(401);
	  });

	it("debería rechazar login con email no registrado", async () => {
	const response = await request(app).post("/login").send({
	  email: "nonexistent@example.com",
	  password: "Password1234!",
	});
	expect(response.status).toBe(404);
});
    it ("deberia rechazar algun cambio vacio, email o password", async () => {
		const response = await request(app).post("/login").send({
			email: testEmail,
		});
		expect(response.status).toBe(400);
	});
	it ("deberia rechazar email con formato invalido", async () => {
		const response = await request(app).post("/login").send({
			email: "invalid-email-format",
			password: "Password1234!",
		});
		expect(response.status).toBe(400);
	});
	  });
