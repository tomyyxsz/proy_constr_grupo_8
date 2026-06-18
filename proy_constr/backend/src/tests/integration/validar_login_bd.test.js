// validar login en base de datos de prueba, el usuario viene de 
// validar registro. se borra el usuario de prueba al final

import dotenv from "dotenv";
import crypto from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../appTest.js";

dotenv.config({ path: new URL("../../../.env.test", import.meta.url) });

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hashed = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hashed}`;
  
}

const { prisma } = await import("../../lib/prisma.js");
const hashedPassword = hashPassword("Password1234!");


describe("validar login en base de datos", () => {

  beforeAll(async () => {
    await prisma.$connect();

    // crear usuario de prueba para validar login

	    await prisma.usuario.create({
      data: {
        rut: "12332121-5",
        nombre: "Test",
        apellido: "User",
        email: "test_login@example.com",
        password: hashedPassword,
        usuarioRol: "ESTUDIANTE",
      },
    });
	

  });

  afterAll(async () => {
    //eliminar usuario de prueba
    await prisma.usuario.deleteMany({
      where: { email: "test_login@example.com" },
    });
    await prisma.$disconnect();
  });


  it("debería validar el login como prisma correctamente", async () => {
    const response = await prisma.usuario.findFirst({
      where: { email: "test_login@example.com" },
    });

    expect(response).not.toBeNull();
  });

  it("debería iniciar sesión en router correctamente", async () => {
	const response = await request(app).post("/login").send({
      email: "test_login@example.com",
      password: "Password1234!",
    });
    expect(response.status).toBe(200);
  });

  it("debería rechazar login con contraseña incorrecta", async () => {
	const response = await request(app).post("/login").send({
	  email: "test_login@example.com",
	  password: "WrongPassword1234!",
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
			password: "Password1234!",
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
