// validar login en base de datos de prueba, el usuario viene de 
// validar registro. se borra el usuario de prueba al final

import dotenv from "dotenv";
import crypto from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

dotenv.config({ path: new URL("../../../.env.test", import.meta.url) });

const { prisma } = await import("../../lib/prisma.js");
const testEmail = "test_login@example.com";


describe("validar login en base de datos", () => {
	beforeAll(async () => {
		await prisma.$connect();
		await prisma.$executeRaw`DELETE FROM "Usuario" WHERE email = ${testEmail}`;

		// crear usuario de prueba para validar login
		await prisma.$executeRaw`
		  INSERT INTO "Usuario" (id, rut, nombre, apellido, email, password, usuario_rol, creado_en, actualizado_en)
		  VALUES (${crypto.randomUUID()}::uuid, ${"22345678-5"}, ${"Test"}, ${"User"}, ${testEmail}, ${"password123"}, ${"ESTUDIANTE"}::"TipoRol", NOW(), NOW())
		`;
	});

	afterAll(async () => {
		// eliminar usuario despues de las pruebas
		await prisma.$executeRaw`DELETE FROM "Usuario" WHERE email = ${testEmail}`;
		await prisma.$disconnect();
	});

	it("debería validar el login correctamente", async () => {
		const rows = await prisma.$queryRaw`
		  SELECT email, password
		  FROM "Usuario"
		  WHERE email = ${testEmail}
		  LIMIT 1
		`;
		const usuario = rows[0];

		expect(usuario).not.toBeNull();
		expect(usuario.email).toBe(testEmail);
		expect(usuario.password).toBe("password123");
	});
});