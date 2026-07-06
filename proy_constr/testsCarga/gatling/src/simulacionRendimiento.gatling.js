import {
  simulation,
  scenario,
  atOnceUsers,
  global,
  getParameter,
  arrayFeeder,
  group,
  jsonPath,
  StringBody,
  bodyString
} from "@gatling.io/core";
import { http, status } from "@gatling.io/http";

export default simulation((setUp) => {
  const vu = parseInt(getParameter("vu", "10"), 10);
  const backendBaseUrl = getParameter("baseUrl", "https://proy-constr-grupo-8.onrender.com");
  const runId = Date.now();

  const httpProtocol = http
    .baseUrl(backendBaseUrl)
    .acceptHeader("application/json")
    .contentTypeHeader("application/json");

  function calcularDv(rutBody) {
    let sum = 0;
    let multiplicador = 2;

    for (let index = rutBody.length - 1; index >= 0; index -= 1) {
      sum += Number(rutBody[index]) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = 11 - (sum % 11);

    if (resto === 11) {
      return "0";
    }

    if (resto === 10) {
      return "K";
    }

    return String(resto);
  }

  function generarRut(index) {
    const rutBody = String(21000000 + index);
    return `${rutBody}-${calcularDv(rutBody)}`;
  }

  function crearFeederUsuarios(cantidad, prefijo, offset = 0) {
    return arrayFeeder(
      Array.from({ length: cantidad }, (_, index) => {
        const indiceReal = offset + index;

        return {
          rut: generarRut(indiceReal),
          nombre: `Usuario${prefijo}${indiceReal}`,
          apellido: `Gatling${prefijo}${indiceReal}`,
          email: `gatling.${prefijo}.${runId}.${indiceReal}@test.cl`,
          password: "Password123!",
          usuarioRol: "ESTUDIANTE",
          color1: "#000000",
          color2: "#ffffff",
          color3: "#ff0000",
          urlModelo3d: `https://example.com/modelo-${prefijo}-${runId}-${indiceReal}.glb`,
          urlModeloStl: `https://example.com/modelo-${prefijo}-${runId}-${indiceReal}.stl`,
          comentario: `Solicitud Gatling ${prefijo} ${runId}-${indiceReal}`,
        };
      }),
    );
  }

  const registroUsuario = scenario("Registro Usuario")
    .feed(crearFeederUsuarios(vu, "registro"))
    .exec(
      group("Registro Usuario").on(
        http("Confirmar registro de usuario")
          .post("/api/usuarios/registro")
          .body(
            StringBody((session) =>
              JSON.stringify({
                rut: session.get("rut"),
                nombre: session.get("nombre"),
                apellido: session.get("apellido"),
                email: session.get("email"),
                password: session.get("password"),
                usuarioRol: session.get("usuarioRol"),
              }),
            ),
          )
          .check(status().is(201))
          .check(jsonPath("$.usuario.id").exists()),
      ),
    );
  const inicioSesionUsuario = scenario("Inicio Sesion Usuario")
    .feed(crearFeederUsuarios(vu, "registro"))
    .exec(
      group("Inicio Sesion Usuario").on(
        http("Acceder al sistema")
          .post("/api/usuarios/login")
          .body(
            StringBody((session) =>
              JSON.stringify({
                email: session.get("email"),
                password: session.get("password"),
              }),
            ),
          )
          .check(status().is(200))
          .check(jsonPath("$.usuario.id").saveAs("usuarioId")),
      ),
    ); 

  
  const creacionSolicitud = scenario("Creacion de solicitud")
    .feed(crearFeederUsuarios(vu, "solicitud", 1000))
    .exec(
      http("Registrar usuario para solicitud")
        .post("/api/usuarios/registro")
        .body(
          StringBody((session) =>
            JSON.stringify({
              rut: session.get("rut"),
              nombre: session.get("nombre"),
              apellido: session.get("apellido"),
              email: session.get("email"),
              password: session.get("password"),
              usuarioRol: session.get("usuarioRol"),
            }),
          ),
        )
        .check(status().is(201))
        .check(jsonPath("$.usuario.id").saveAs("usuarioId")),
    )
    .exitHereIfFailed()
    .exec(
      http("Iniciar sesion para solicitud")
        .post("/api/usuarios/login")
        .body(
          StringBody((session) =>
            JSON.stringify({
              email: session.get("email"),
              password: session.get("password"),
            }),
          ),
        )
        .check(status().is(200))
        .check(jsonPath("$.usuario.id").saveAs("usuarioId")),
    )
    .exitHereIfFailed()
.exec(
  group("Creacion de solicitud").on(
    http("Enviar solicitud")
      .post("/api/impresiones/crear")
      .body(
        StringBody((session) =>
          JSON.stringify({
            idUsuario: session.get("usuarioId"),
            color1: session.get("color1"),
            color2: session.get("color2"),
            color3: session.get("color3"),
            tipoSolicitud: "PERSONAL",
            comentario: session.get("comentario"),
            urlModelo3d: session.get("urlModelo3d"),
            urlModeloStl: session.get("urlModeloStl"),
          })
        )
      )
      .asJson()

      // checks
      .check(status().is(201))
      .check(status().saveAs("status"))
      .check(bodyString().saveAs("responseBody"))
      .check(jsonPath("$.impresion.idImpresion").saveAs("idSolicitud"))
      .check(jsonPath("$.impresion.idImpresion").exists())
  )
)

.exitHereIfFailed();
  setUp(
    registroUsuario.injectOpen(atOnceUsers(vu)).andThen(inicioSesionUsuario.injectOpen(atOnceUsers(vu))),

    creacionSolicitud.injectOpen(atOnceUsers(vu))
  )
    .protocols(httpProtocol)
    .assertions(global().failedRequests().count().lt(1));
});
