import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { beforeEach, vi } from "vitest";
import CreacionCurso from "../../components/CreacionCurso";
import { crearCurso, obtenerSemestres } from "../../api/ApiCreacionCurso";
import userEvent from "@testing-library/user-event";

vi.mock("../../api/ApiCreacionCurso", () => ({
  crearCurso: vi.fn(),
  obtenerSemestres: vi.fn(),
}));

describe("Pruebas creación curso", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("user", JSON.stringify({ id: "profesor-123" }));
    vi.mocked(obtenerSemestres).mockResolvedValue([
      { idSemestre: "semestre-123", anio: 2026, periodo: 2, estadoSemestre: "ACTIVO" },
    ]);
  });

  test("debe mostrar el título Crear Curso", () => {
    render(<CreacionCurso />);

    expect(
      screen.getByRole("heading", {
        name: "Crear Curso",
      })
    ).toBeInTheDocument();
  });
  test("debe permitir escribir el nombre del curso", () => {
    render(<CreacionCurso />);

    const input = screen.getByTestId("nombreCurso");

    fireEvent.change(input, {
      target: {
        value: "Programación Web",
      },
    });

    expect(input.value).toBe("Programación Web");
  });

  test("debe permitir elegir un semestre", async () => {
    render(<CreacionCurso />);

    const select = await screen.findByTestId("semestreId");

    fireEvent.change(select, {
      target: {
        value: "semestre-123",
      },
    });

    expect(select.value).toBe("semestre-123");
  });
  test("no debe crear un curso sin nombre", () => {
    window.alert = vi.fn();

    render(<CreacionCurso />);

    fireEvent.click(
      screen.getByTestId("crearCurso")
    );

    expect(window.alert).toHaveBeenCalledWith(
      "Debe ingresar nombre"
    );
  });

  test("debe enviar los datos del curso al crear", async () => {
    const user = userEvent.setup();
    const mockCrearCurso = vi.mocked(crearCurso);
    mockCrearCurso.mockResolvedValue({ message: "ok" });

    render(<CreacionCurso onClose={vi.fn()} />);

    fireEvent.change(screen.getByTestId("nombreCurso"), {
      target: { value: "Programación Web" },
    });
    const select = await screen.findByTestId("semestreId");
    fireEvent.change(select, {
      target: { value: "semestre-123" },
    });


    const fileCSV = new File(
      [
        "nombre,apellido,rut,email\n" +
          "Juan,Perez,12345678-9,juan.perez@ejemplo.com",
      ],
      "estudiantes.csv",
      { type: "text/csv" },
    );

    await user.upload(screen.getByLabelText(/Archivo CSV/i), fileCSV);

    fireEvent.click(screen.getByTestId("crearCurso"));


    await waitFor(() => {
      expect(mockCrearCurso).toHaveBeenCalledWith({
        nombreCurso: "Programación Web",
        semestreId: "semestre-123",
        profesorId: "profesor-123",
        archivoCSV: expect.any(File),
      });
    });
  });
});
