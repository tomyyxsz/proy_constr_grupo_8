
// importar ruta de login en app.js de prueba para poder testear
import loginRouter from "./LoginUsuario.js";
import registroRouter from "./RegistroUsuario.js";
import solicitudImpresionRouter from "./SolicitudImpresion.js";
import gestionImpresionRouter from "./GestionImpresion.js";
import buscarUsuarioRouter from "./BuscarUsuario.js";
import CreacionCursoRouter from "./CreacionCurso.js";
import CreacionSemestreRouter from "./CreacionSemestre.js";
import app from "./server.js";

// rutas
app.use(loginRouter);
app.use(registroRouter);
app.use(solicitudImpresionRouter);
app.use(gestionImpresionRouter);
app.use("/api/usuarios", buscarUsuarioRouter);
app.use(CreacionCursoRouter);
app.use(CreacionSemestreRouter);

export default app;