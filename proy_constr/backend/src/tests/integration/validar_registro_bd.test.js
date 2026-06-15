// crear un registro en la base de datos de prueba para luego testear
// con este mismo en validar login.

import dotenv from "dotenv";
import crypto from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

dotenv.config({ path: new URL("../../../.env.test", import.meta.url) });

const { prisma } = await import("../../lib/prisma.js");
const testEmail = "<EMAIL>";

describe("validar registro en base de datos", () => {
    beforeAll(async () => {
        await prisma.$connect();
    });

    afterAll(async () => {
        await prisma.$disconnect();
        // eliminar usuario de prueba
        await prisma.$executeRaw`
            DELETE FROM "Usuario"
            WHERE email = ${testEmail}
        `;
    });
    // formato usuario:
    // rut, nombre, apellido, email, password

    it("debería crear un nuevo usuario en la base de datos de prueba", async () => {
                const userId = crypto.randomUUID();
        const nuevoUsuario = {
            id: userId,
            rut: "12345678-9",
            nombre: "Test",
            apellido: "User",
            email: testEmail,
            password: "password123",
            usuarioRol: "ESTUDIANTE",
        };

            await prisma.$executeRaw`
                INSERT INTO "Usuario" (id, rut, nombre, apellido, email, password, "usuarioRol", "creadoEn", "actualizadoEn")
                VALUES (${nuevoUsuario.id}::uuid, ${nuevoUsuario.rut}, ${nuevoUsuario.nombre}, ${nuevoUsuario.apellido}, ${nuevoUsuario.email}, ${nuevoUsuario.password}, ${nuevoUsuario.usuarioRol}::"TipoRol", NOW(), NOW())
                `;

                const rows = await prisma.$queryRaw`
                    SELECT rut, nombre, apellido, email, password
                    FROM "Usuario"
                    WHERE email = ${testEmail}
                    LIMIT 1
                `;

                expect(rows).toHaveLength(1);
                expect(rows[0]).toMatchObject({
                    rut: nuevoUsuario.rut,
                    nombre: nuevoUsuario.nombre,
                    apellido: nuevoUsuario.apellido,
                    email: nuevoUsuario.email,
                    password: nuevoUsuario.password,
                });
    });
});