import express from "express";
// importar ruta de login en app.js de prueba para poder testear
import loginRouter from "./LoginUsuario.js";
import registroRouter from "./RegistroUsuario.js";
import solicitudImpresionRouter from "./SolicitudImpresion.js";
import gestionImpresionRouter from "./GestionImpresion.js";
const app = express();
app.use(express.json());

// rutas
app.use(loginRouter);
app.use(registroRouter);
app.use(solicitudImpresionRouter);
app.use(gestionImpresionRouter);

export default app;