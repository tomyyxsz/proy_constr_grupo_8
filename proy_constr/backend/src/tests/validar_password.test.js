import { describe, it, expect } from "vitest";
import { esContrasenaValida } from "../lib/validaciones";

describe("validar contraseña", () => {
    it("valida contraseña correcta", () => {
        expect(esContrasenaValida("Abcdef1!")).toBe(true);
    });

    it("rechaza contraseña sin mayúscula", () => {
        expect(esContrasenaValida("abcdef1!")).toBe(false);
    });

    it("rechaza contraseña sin minúscula", () => {
        expect(esContrasenaValida("ABCDEF1!")).toBe(false);
    });

    it("rechaza contraseña sin número", () => {
        expect(esContrasenaValida("Abcdefg!")).toBe(false);
    });

    it("rechaza contraseña sin símbolo", () => {
        expect(esContrasenaValida("Abcdefg1")).toBe(false);
    });

    it("rechaza contraseña con menos de 8 caracteres", () => {
        expect(esContrasenaValida("Ab1!")).toBe(false);
    });
});