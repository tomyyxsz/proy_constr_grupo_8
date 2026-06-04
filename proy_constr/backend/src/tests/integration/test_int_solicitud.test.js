/*
Crear test de integracion para solicitud de impresion,
se sigue la misma base que el test unitario para la solicitud, pero 
ahora se integra con la base de datos, siguiendo mas o menos
el ejemplo de solicitudimpresion.js,
donde segun el id del usuario se adjuntan sus datos, y luego
el rellena los demas campos.
crear un caso exitoso con todos los campos correctos y se ingreso la solicitud a la db
crear un caso de error donde el id del estudiante no existe en la db.

hay que tener en cuenta que impresion tiene muchos campos:
  idImpresion String @id @default(uuid()) @db.Uuid
  solicitanteNombre String @db.VarChar(50)
  solicitanteApellido String @db.VarChar(50)
  solicitanteEmail String @db.VarChar(100)
  solicitanteRut String @db.VarChar(10)

  refEstudiante String @db.Uuid
  estudiante Usuario @relation("impresionEstudiante", fields: [refEstudiante], references: [id])
  
  refAyudante String @db.Uuid
  ayudante Usuario @relation("impresionAyudante", fields: [refAyudante], references: [id])

  tipoUsuario String @db.VarChar(50)
  tipoSolicitud String @db.VarChar(50)
  nombreCurso String @db.VarChar(100)

  refCurso String @db.Uuid
  curso Curso @relation(fields: [refCurso], references: [idCurso])

  colorOpcion1 String @db.VarChar(50)
  colorOpcion2 String @db.VarChar(50)
  colorOpcion3 String @db.VarChar(50)

  comentarioTecnico String @db.VarChar(255)
  urlModelo3d String @db.VarChar(255)
  urlModeloStl String @db.VarChar(255)

  comentarioUsuario String @db.VarChar(255)
  estadoImpresion EstadoImpresion @default(PENDIENTE)

  observacionAyudante String @db.VarChar(255)
  motivoRechazo String? @db.VarChar(255) 
  tiempoEstimadoImpresion String @db.VarChar(50)
  inicioImpresion DateTime? @db.Timestamp(6)
  creadoEn DateTime @default(now()) @db.Timestamp(6)
*/

import dotenv from "dotenv";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

dotenv.config({ path: new URL("../../../.env.test", import.meta.url) });

const { prisma } = await import("../../lib/prisma.js");

describe("Solicitud de Impresion - Integracion con Base de Datos", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("debería crear una solicitud de impresión correctamente en la base de datos", async () => {

    // datos de prueba
    const idEstudiante = "some-existing-uuid"; // reemplazar con un UUID válido de un estudiante existente en la base de datos
    const tipoSolicitud = "ACADEMICA";
    const refCurso = "some-existing-curso-id"; // reemplazar con un ID válido de un curso existente en la base de datos
    const urlModelo3d = "http://example.com/modelo3d.obj";
    const urlModeloStl = "http://example.com/modelo.stl";

    // crear la solicitud de impresion
    const impresion = await prisma.impresion.create({
      data: {
        solicitanteNombre: "Test",
        solicitanteApellido: "User",
        solicitanteEmail: "<EMAIL>",
        solicitanteRut: "12345678-9",
        refEstudiante: idEstudiante,
        refAyudante: null,
        tipoUsuario: "ESTUDIANTE",
        tipoSolicitud: tipoSolicitud,
        nombreCurso: "Curso de Prueba",
        refCurso: refCurso,
        colorOpcion1: "Rojo",
        colorOpcion2: "Verde",
        colorOpcion3: "Azul",
        comentarioUsuario: "Por favor imprimir con alta calidad.",
        comentarioTecnico: null,
        urlModelo3d: urlModelo3d,
        urlModeloStl: urlModeloStl,
        estado: "CREADO",
        observacionAyudante: null,
        motivoRechazo: null,
        tiempoEstimadoImpresion: "2 horas",
        inicioImpresion: null,
        estudiante: {
          connect: { id: idEstudiante },
        },
        curso: {
          connect: { idCurso: refCurso },
        },
        ayudante: { connect: null },
      },
    });

    expect(impresion).toHaveProperty("idImpresion");
    expect(impresion.solicitanteNombre).toBe("Test");
    expect(impresion.solicitanteEmail).toBe("<EMAIL>");
    expect(impresion.tipoSolicitud).toBe(tipoSolicitud);
    expect(impresion.estado).toBe("CREADO");
    expect(impresion.urlModelo3d).toBe(urlModelo3d);
    expect(impresion.urlModeloStl).toBe(urlModeloStl);
    expect(impresion.refEstudiante).toBe(idEstudiante);
    expect(impresion.nombreCurso).toBe("Curso de Prueba");
    expect(impresion.refCurso).toBe(refCurso);
    expect(impresion.colorOpcion1).toBe("Rojo");
    expect(impresion.colorOpcion2).toBe("Verde");
    expect(impresion.colorOpcion3).toBe("Azul");
    expect(impresion.comentarioUsuario).toBe("Por favor imprimir con alta calidad.");
    expect(impresion.comentarioTecnico).toBeNull();
    expect(impresion.observacionAyudante).toBeNull();
    expect(impresion.motivoRechazo).toBeNull();
    expect(impresion.tiempoEstimadoImpresion).toBe("2 horas");
    expect(impresion.inicioImpresion).toBeNull();

  });

  it("debería fallar al crear una solicitud de impresión con un id de estudiante no existente", async () => {
    
  });
});

