import "dotenv/config";
import express from "express";
import cors from "cors";
import registroUsuarioRouter from "./RegistroUsuario.js";
import buscarUsuarioRouter from "./BuscarUsuario.js";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/api/usuarios", registroUsuarioRouter);
app.use("/api/usuarios", buscarUsuarioRouter);

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "backend" });
});

app.listen(port, () => {
  console.warn(`Backend running on http://localhost:${port}`);
});
