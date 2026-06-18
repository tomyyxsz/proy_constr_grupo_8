// validar algunas de las funcionalidades de la clase buscarUsuario que se usan para Login tambien.
import dotenv from "dotenv";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import app from "../../appTest.js";
import request from "supertest";

dotenv.config({ path: new URL("../../../.env.test", import.meta.url) });

const { prisma } = await import("../../lib/prisma.js");

describe("busqueda de usuarios", () => {

    // comentario de prueba XD
    beforeAll(async () => {
        await prisma.$connect();
        // borrar si habian datos de pruebas anteriores
        await prisma.impresion.deleteMany();
        await prisma.estudianteCurso.deleteMany();
        await prisma.curso.deleteMany();
        await prisma.usuario.deleteMany();
        await prisma.semestre.deleteMany();
        // crear usuario de prueba

        await prisma.usuario.create({
            data: {
                id: crypto.randomUUID(),
                rut: "87783738-9",
                nombre: "Test",
                apellido: "Busqueda",
                email: "busqueda@example.com",
                password: "password123",
                usuarioRol: "ESTUDIANTE",
            },
        });
        


    });

    afterAll(async () => {
        // eliminar usuario de prueba
        await prisma.usuario.deleteMany({
            where: { email: "busqueda@example.com" },
        });
        await prisma.$disconnect();
    });

    it("una busqueda normal lleva rut, nombre, apellido, email y rol", async () => {
        // router.get("/buscar", async (req, res) => {
  //const { email, rut, rol, nombre, apellido } = req.query;
  //const filters = [];
        const response = await request(app)
            .get("/api/usuarios/buscar")
            .query({ email: "busqueda@example.com", rut: "87783738-9", rol: "ESTUDIANTE", nombre: "Test", apellido: "Busqueda" });
        expect(response.status).toBe(200);
    });

    it("una busqueda que sin parametros no debería funcionar", async () => {
        const response = await request(app)
            .get("/api/usuarios/buscar")
            .query({ });
        expect(response.status).toBe(400);
    });

    it("el usuario a buscar debe tener un rol valido", async () => {
        const response = await request(app)
            .get("/api/usuarios/buscar")
            .query({ email: "busqueda@example.com", rut: "87783738-9", rol: "INVALIDO", nombre: "Test", apellido: "Busqueda" });
        expect(response.status).toBe(400);
    });

    it("se puede buscar al usuario por su ID", async () => {
        
        const user = await prisma.usuario.findUnique({
            where: { email: "busqueda@example.com" },
        });

        const response = await request(app)
            .get(`/api/usuarios/${user.id}`);
        expect(response.status).toBe(200);
    });

    it("buscar un usuario por ID que no existe debería retornar 404", async () => {
        const response = await request(app)
            .get(`/api/usuarios/${"00000000-0000-0000-0000-000000000000"}`);
        expect(response.status).toBe(404);
    });

    it("se puede borrar un usuario por su rut", async () => {
        // crear usuario de prueba para borrar
        await prisma.usuario.create({
            data: {
                id: crypto.randomUUID(),
                rut: "7777777-7",
                nombre: "Test",
                apellido: "Borrar",
                email: "lolito@example.com",
                password: "password123",
                usuarioRol: "ESTUDIANTE",
            },
        });
        const response = await request(app)
            .delete("/api/usuarios/rut/7777777-7");
        expect(response.status).toBe(200);
    });

    it("borrar un usuario por rut que no existe debería retornar 404", async () => {
        const response = await request(app)
            .delete("/api/usuarios/rut/00000000-0");
        expect(response.status).toBe(404);
    });
});
