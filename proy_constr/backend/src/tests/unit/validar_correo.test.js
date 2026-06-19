import { describe, it, expect } from "vitest";
import { esCorreoValido } from "../../lib/validaciones";

describe("validar correo", () => {
  it("valida correos correctos", () => {
    expect(esCorreoValido("admin@a.a")).toBe(true);
  });

  it("rechaza correos sin @", () => {
    expect(esCorreoValido("admina.a")).toBe(false);
  });

  it("rechaza correos sin dominio", () => {
    expect(esCorreoValido("admin@")).toBe(false);
  });

  it("rechaza correos con espacios", () => {
    expect(esCorreoValido("admin @a.a")).toBe(false);
  });
});
