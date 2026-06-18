// rutas principales
import "dotenv/config";
import express from "express";
import cors from "cors";
import registroUsuarioRouter from "./RegistroUsuario.js";
import buscarUsuarioRouter from "./BuscarUsuario.js";
import loginUsuarioRouter from "./LoginUsuario.js";
import creacionSemestreRouter from "./CreacionSemestre.js";
import creacionCursoRouter from "./CreacionCurso.js";
import solicitudImpresionRouter from "./SolicitudImpresion.js";
import gestionImpresionRouter from "./GestionImpresion.js";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/api/usuarios", registroUsuarioRouter);
app.use("/api/usuarios", buscarUsuarioRouter);
app.use("/api/usuarios", loginUsuarioRouter);
app.use("/api/semestres", creacionSemestreRouter);
app.use("/api/cursos", creacionCursoRouter);
app.use("/api/impresiones", solicitudImpresionRouter);
app.use("/api/impresiones", gestionImpresionRouter);


app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "backend" });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.info(`Backend running on http://localhost:${port}`);
  });
}

export default app;
