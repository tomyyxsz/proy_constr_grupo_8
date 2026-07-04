// clase para test de mailer.js
import { vi, describe, expect, it } from "vitest";
import { enviarNotificacionEstado } from "../../lib/mailer.js";
// la funcion vi.hoisted retorna una funcion que se ejecuta
// antes de que se ejecute el resto del codigo
const sendMailMock = vi.hoisted(() => vi.fn());

vi.mock("nodemailer", () => {
  return {
    default: {
      createTransport: vi.fn(() => ({
        sendMail: sendMailMock,
      })),
    },
  };
});

describe("Verificacion de enviarNotificacionEstado de la clase mailer.js", () => {
  it("debe enviar correo correctamente", async () => {
    await enviarNotificacionEstado("test@test.com", "Aprobado", "Todo bien");

    expect(sendMailMock).toHaveBeenCalled();
  });

  it("debe mostrar error al enviar correo mal", async () => {
    try {
      sendMailMock.mockRejectedValueOnce(new Error("Error al enviar correo"));
      await enviarNotificacionEstado("test@test.com", "Aprobado", "Todo bien");
    } catch (error) {
      expect(error.message).toBe("Error al enviar correo");
    }
  });
});