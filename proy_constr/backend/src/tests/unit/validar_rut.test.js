import { describe, it, expect } from "vitest";
import { normalizeRut } from "../../lib/validaciones";

describe("validar rut", () => {
  it("valida rut correcto con guion", () => {
    expect(normalizeRut("12345678-5")).toBe("12345678-5");
  });

  it("valida rut correcto sin guion (9 digitos)", () => {
    expect(normalizeRut("123456785")).toBe("12345678-5");
  });

  it("valida rut con puntos y guion", () => {
    expect(normalizeRut("12.345.678-5")).toBe("12345678-5");
  });

  it("rechaza rut con formato incorrecto(10 digitos)", () => {
    expect(normalizeRut("12.345.67853")).toBe(null);
  });

  it("rechaza rut con DV incorrecto", () => {
    expect(normalizeRut("12345678-9")).toBe(null);
  });

  it("rechaza rut con caracteres invalidos", () => {
    expect(normalizeRut("12A45678-5")).toBe(null);
  });
});
