// clase de pruebas para importar CSV, que ahora funciona como una funcion que apoya a creacionCurso
import { beforeAll, describe, expect, it, afterAll } from "vitest";
import {prisma} from "../../lib/prisma.js";
import dotenv from "dotenv";
dotenv.config({ path: new URL("../../../.env.test", import.meta.url) });
import { importarEstudiantesDesdeCSV } from "../../importadorCSV.js";

describe("Importador CSV", () => {

  let cursoId;
  let profId;
  let semestreId;

  beforeAll(async () => {
    // Configuración inicial antes de todas las pruebas
    await prisma.$connect();
    await prisma.curso.deleteMany();
    const semestreCurso = await prisma.semestre.create({
      data: {
        periodo:2040,
        anio:1,
        fechaInicio: new Date("2040-01-01"),
        fechaFin: new Date("2040-06-30"),
      },
    });
    semestreId = semestreCurso.idSemestre;
    const profesorCurso = await prisma.usuario.create({
      data: {
        nombre: "Profesor",
        apellido: "de Prueba CSV",
        rut: "42812732-9",
        password: "password",
        email: "profesor.prueba@ejemplo.com"
      }
    });
    profId = profesorCurso.id;
    const cursoPrueba = await prisma.curso.create({
      data: {
        nombreCurso: "Curso de Prueba CSV",
        refProfesor: profesorCurso.id,
        refSemestre: semestreCurso.idSemestre
      }
    });
    cursoId = cursoPrueba.idCurso;
  
  });

  afterAll(async () => {
    // Limpieza después de todas las pruebas
    await prisma.estudianteCurso.deleteMany();
    await prisma.curso.deleteMany();
    await prisma.usuario.deleteMany({
      where: { id: profId }
    });
      
    await prisma.semestre.deleteMany( {
      where: { idSemestre: semestreId }
    } );
    await prisma.$disconnect();
  });

  it ("deberia insertar correctamente los cursos desde un csv valido", async () => {
    const csvMock = "nombre,apellido,rut,email\n" +
          "Juan,Perez,42812732,juan.perez@ejemplo.com";
    await importarEstudiantesDesdeCSV(prisma, cursoId, { data: Buffer.from(csvMock) });
    const curso = await prisma.curso.findUnique({
      where: { idCurso: cursoId },
      include: { estudianteCurso: true },
    });
    expect(curso).not.toBeNull();
  });
  it("deberia lanzar un error si el csv viene con mal formato", async () => {
    const csvInvalido = "columna1,columna2\n" +
          "dato1,dato2";
    const result = await importarEstudiantesDesdeCSV(prisma, cursoId, { data: Buffer.from(csvInvalido) });
    expect(result).toBe(0);
  });

});