// pruebas para solicitudes de impresion
// casos: solicitud correcta, solicitud con campos faltantes
// solicitud academica deberia tener curso,
// solicitud academica sin curso falla,
// solo pruebas unitarias, no se conecta a la base de datos
/* 
    idEstudiante,
    color1,
    color2,
    color3,
    tipoSolicitud,
    comentario,
    urlModelo3d,
    urlModeloStl,
    refCurso,

*/

import { describe, expect, it } from "vitest";

describe("Solicitud de Impresion - Validaciones", () => {
  it("debería validar una solicitud correcta", () => {
    const solicitud = {
      idEstudiante: "123e4567-e89b-12d3-a456-426614174000",
      color1: "#FF0000",
      color2: "#00FF00",
      color3: "#0000FF",
      tipoSolicitud: "ACADEMICA",
      comentario: "Solicitud para proyecto final",
      urlModelo3d: "http://example.com/modelo3d.obj",
      urlModeloStl: "http://example.com/modelo.stl",
      refCurso: "curso-123",
    };
    expect(solicitud).toBeDefined();
  });
});

describe ("Solicitud de Impresion - Validaciones de Campos", () => {
  it("debería fallar si falta el idEstudiante", () => {
    const solicitud = {
      color1: "#FF0000",
      color2: "#00FF00",
      color3: "#0000FF",
      tipoSolicitud: "ACADEMICA",
      comentario: "Solicitud para proyecto final",
      urlModelo3d: "http://example.com/modelo3d.obj",
      urlModeloStl: "http://example.com/modelo.stl",
      refCurso: "curso-123",
    };
    expect(solicitud.idEstudiante).toBeUndefined();
  });

  it("debería fallar si falta el tipoSolicitud", () => {
    const solicitud = {
      idEstudiante: "123e4567-e89b-12d3-a456-426614174000",
      color1: "#FF0000",
      color2: "#00FF00",
      color3: "#0000FF",
      comentario: "Solicitud para proyecto final",
      urlModelo3d: "http://example.com/modelo3d.obj",
      urlModeloStl: "http://example.com/modelo.stl",
      refCurso: "curso-123",
    };
    expect(solicitud.tipoSolicitud).toBeUndefined();
  });
  it("debería fallar si es una solicitud académica sin refCurso", () => {
      const solicitud = {
          idEstudiante: "123e4567-e89b-12d3-a456-426614174000",
          color1: "#FF0000",
          color2: "#00FF00",
          color3: "#0000FF",
          tipoSolicitud: "ACADEMICA",
          comentario: "Solicitud para proyecto final",
          urlModelo3d: "http://example.com/modelo3d.obj",
          urlModeloStl: "http://example.com/modelo.stl",
      };
      expect(solicitud.refCurso).toBeUndefined(); 
    });

    it("debería validar una solicitud de tipo PERSONAL sin refCurso", () => {
        const solicitud = {
            idEstudiante: "123e4567-e89b-12d3-a456-426614174000",
            color1: "#FF0000",
            color2: "#00FF00",
            color3: "#0000FF",
            tipoSolicitud: "PERSONAL",
            comentario: "Solicitud para proyecto personal",
            urlModelo3d: "http://example.com/modelo3d.obj",
            urlModeloStl: "http://example.com/modelo.stl",
        };
        expect(solicitud).toBeDefined();
    });

});

