import dotenv from "dotenv";
import { afterAll, beforeAll, describe, expect, it, beforeEach } from "vitest";
import app from "../../appTest.js";
import request from "supertest";

dotenv.config({ path: new URL("../../../.env.test", import.meta.url) });

const { prisma } = await import("../../lib/prisma.js");

let idEstudiante = "";
let idSolicitud = "";
let idEstudiante2 = "";
let dataEstudiante = {};
let idAyudante = "";
describe("gestión de solicitudes de impresión", () => {
  
  
  beforeAll(async () => {
    await prisma.$connect();

    // crear estudiante de prueba, curso, profesor, ayudante, semestre y la solicitud de impresión de tipo personal

    const estudiante1 = await prisma.usuario.create({
      data: {
        nombre: "Estudiante de Prueba",
        apellido: "Test",
        email: "estudiante.prueba@universidad.cl",
        password: "password123",
        rut: "12345678-9",
      },
    });
    idEstudiante = estudiante1.id;

    dataEstudiante = {
      id: estudiante1.id,
      nombre: estudiante1.nombre,
      apellido: estudiante1.apellido,
      email: estudiante1.email,
      rut: estudiante1.rut,
      usuarioRol: estudiante1.usuarioRol,
    };

    // crear estudiante sin solicitudes
    const estudiante2 = await prisma.usuario.create({
      data: {
        nombre: "Estudiante Sin Solicitudes",
        apellido: "Test",
        email: "estudiante.sin.solicitudes@universidad.cl",
        password: "password123",
        rut: "98765432-1",
      },
    });
    idEstudiante2 = estudiante2.id;

    const ayudante = await prisma.usuario.create({
      data: {
        nombre: "Ayudante de Prueba",
        apellido: "Test",
        email: "ayudante.prueba@universidad.cl",
        password: "password123",
        rut: "22222222-1",
      },
    });
    idAyudante = ayudante.id;
  });

  beforeEach(async () => {
    // insertar una solicitud
    // crear la solicitud
    const solicitud1 = await prisma.impresion.create({
      data: {
        solicitanteNombre: dataEstudiante.nombre,
        solicitanteApellido: dataEstudiante.apellido,
        solicitanteEmail: dataEstudiante.email,
        solicitanteRut: dataEstudiante.rut,
        estudiante: {
          connect: { id: dataEstudiante.id },
        },
        nombreCurso: "Curso de Prueba",
        tipoUsuario: dataEstudiante.usuarioRol,
        tipoSolicitud: "PERSONAL",
        colorOpcion1: "#00000",
        colorOpcion2: "#00000",
        colorOpcion3: "#00000",
        comentarioTecnico: "",
        comentarioUsuario: "Por favor imprimir con alta calidad.",
        observacionAyudante: "",
        urlModelo3d: "http://example.com/modelo3d.obj",
        urlModeloStl: "http://example.com/modelo.stl",
        estadoImpresion: "PENDIENTE",
        tiempoEstimadoImpresion: "10 minutos",
      },
    });
    idSolicitud = solicitud1.idImpresion;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("validar que no hay solicitudes", async () => {
    // borrar todas las solicitudes
    await prisma.impresion.deleteMany();
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("solicitudes");
    expect(Array.isArray(response.body.solicitudes)).toBe(true);
    expect(response.body.solicitudes.length).toBe(0);
  });

  it("deberia recuperar todas las solicitudes de impresion", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("solicitudes");
    expect(Array.isArray(response.body.solicitudes)).toBe(true);
  });

  it("deberia recuperar las solicitudes de impresion de un estudiante", async () => {
    const response = await request(app).get(`/estudiante/${idEstudiante}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("solicitudes");
    expect(Array.isArray(response.body.solicitudes)).toBe(true);
  });

  it("validar que el usuario no tiene solicitudes", async () => {
    const response = await request(app).get(`/estudiante/${idEstudiante2}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("solicitudes");
    expect(Array.isArray(response.body.solicitudes)).toBe(true);
    expect(response.body.solicitudes.length).toBe(0);
  });

  it("deberia recuperar una solicitud segun su id", async () => {
    const response = await request(app).get(`/${idSolicitud}`);
    expect(response.status).toBe(200);
  });
  it("deberia validar que no encuentra una solicitud segun su id", async () => {
    const response = await request(app).get(
      `/00000000-0000-0000-0000-000000000000`,
    );
    expect(response.status).toBe(404);
  });
  it("un ayudante deberia poder actualizar el estado de la solicitud mediante un put, a EN_PROGRESO", async () => {
    const response = await request(app).put(`/${idSolicitud}/aprobar`).send({
      idAyudante: idAyudante,
      observacion: "Solicitud aprobada, comenzando impresión.",
    });
    expect(response.status).toBe(200);
    // cambiar nuevamente a pendiente para que no afecte a otros test
    await prisma.impresion.update({
      where: { idImpresion: idSolicitud },
      data: { estadoImpresion: "PENDIENTE" },
    });
  });

  it("si idAyudante va vacio, no se debe poder recuperar", async () => {
    const response = await request(app).put(`/${idSolicitud}/aprobar`).send({
      idAyudante: "",
      observacion: "Solicitud aprobada, comenzando impresión.",
    });
    expect(response.status).toBe(400);
  });
  it("si idAyudante no existe, no se debe poder recuperar", async () => {
    const response = await request(app).put(`/${idSolicitud}/aprobar`).send({
      idAyudante: "00000000-0000-0000-0000-000000000000",
      observacion: "Solicitud aprobada, comenzando impresión.",
    });
    expect(response.status).toBe(404);
  });

  it("si idSolicitud no existe, no se debe poder recuperar", async () => {
    const response = await request(app)
      .put(`/00000000-0000-0000-0000-000000000000/aprobar`)
      .send({
        idAyudante: idAyudante,
        observacion: "Solicitud aprobada, comenzando impresión.",
      });
    expect(response.status).toBe(404);
  });

  it("un ayudante puede rechazar una solicitud mediante un put, cambiando el estado a RECHAZADA", async () => {
    const response = await request(app).put(`/${idSolicitud}/rechazar`).send({
      idAyudante: idAyudante,
      motivo: "El modelo 3D no cumple con los requisitos de impresión.",
    });
    expect(response.status).toBe(200);
    // cambiar nuevamente a pendiente para que no afecte a otros test
    await prisma.impresion.update({
      where: { idImpresion: idSolicitud },
      data: { estadoImpresion: "PENDIENTE" },
    });
  });

  it("si idAyudante va vacio, no se debe poder rechazar", async () => {
    const response = await request(app).put(`/${idSolicitud}/rechazar`).send({
      idAyudante: "",
      motivo: "El modelo 3D no cumple con los requisitos de impresión.",
    });
    expect(response.status).toBe(400);
  });

  it("si idAyudante no existe, no se debe poder rechazar", async () => {
    const response = await request(app).put(`/${idSolicitud}/rechazar`).send({
      idAyudante: "00000000-0000-0000-0000-000000000000",
      motivo: "El modelo 3D no cumple con los requisitos de impresión.",
    });
    expect(response.status).toBe(404);
  });

  it("si idSolicitud no existe, no se debe poder rechazar", async () => {
    const response = await request(app)
      .put(`/00000000-0000-0000-0000-000000000000/rechazar`)
      .send({
        idAyudante: idAyudante,
        motivo: "El modelo 3D no cumple con los requisitos de impresión.",
      });
    expect(response.status).toBe(404);
  });

  it("un ayudante puede actualizar sus observaciones de una solicitud mediante un put", async () => {
    const response = await request(app)
      .put(`/${idSolicitud}/observaciones`)
      .send({
        idAyudante: idAyudante,
        observacion: "Observación actualizada por el ayudante.",
      });
    expect(response.status).toBe(200);
  });

  it("si idAyudante va vacio, no se debe poder actualizar observaciones", async () => {
    const response = await request(app)
      .put(`/${idSolicitud}/observaciones`)
      .send({
        idAyudante: "",
        observacion: "Observación actualizada por el ayudante.",
      });
    expect(response.status).toBe(400);
  });

  it("si idSolicitud no existe, no se debe poder actualizar observaciones", async () => {
    const response = await request(app)
      .put(`/00000000-0000-0000-0000-000000000000/observaciones`)
      .send({
        idAyudante: idAyudante,
        observacion: "Observación actualizada por el ayudante.",
      });
    expect(response.status).toBe(404);
  });
});
