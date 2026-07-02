// funcion para borrar usuarios de prueba generados en la simulacion

/*
  const borrarUsuarios = scenario("Borrar Usuarios")
    .feed(crearFeederUsuarios(vu, "registro"))
    .exec(
      group("Borrar Usuarios").on(
        http("Eliminar usuario")
          .delete((session) => `/api/usuarios/rut/${session.get("rut")}`)
          .check(status().is(200)),
      ),
    );

        .exec (
      group("Obtener solicitudes del usuario").on(
        http("Obtener solicitudes del usuario")
          .get((session) => `/api/impresiones/estudiante/${session.get("usuarioId")}`)
          .check(status().is(200))
          .check(jsonPath("$.solicitudes[0].idImpresion").saveAs("idSolicitud")),
      ),
    )
    .exitHereIfFailed()
    .exec (
      group ("Borrar solicitudes del usuario").on (
        http("Borrar solicitudes del usuario")
          .delete((session) => `/api/impresiones/borrar/${session.get("idSolicitud")}`)
          .check(status().is(200)),
      )
    )
    .exitHereIfFailed()
    .exec (
      group ("Borrar usuario del sistema").on (
        http("Borrar usuario del sistema")
          .delete((session) => `/api/usuarios/rut/${session.get("rut")}`)
          .check(status().is(200)),
      )
    )

*/
import dotenv from "dotenv";

dotenv.config({
  path: "/home/tomy/Desktop/proy_constr_grupo_8/proy_constr/backend/.env",
});

const {prisma} = await import ("/home/tomy/Desktop/proy_constr_grupo_8/proy_constr/backend/src/lib/prisma.js");

 async function deleteTestUsers() {

  // conectar a la base de datos
  // borrar todos los usuarios cuyo correo comience con "gatling"
   const result = await prisma.usuario.deleteMany({
    where: {
      email: {
        startsWith: "gatling",
      },
    }
  });
  console.log(`Se borraron ${result.count} usuarios de prueba.`);
}

async function deleteTestSolicitudes () {
  const result = await prisma.impresion.deleteMany({
    where: {
      comentarioUsuario: {
        startsWith: "Solicitud Gatling solicitud",
      },
    }
  });
  console.log(`Se borraron ${result.count} solicitudes de prueba.`);
}

deleteTestSolicitudes();
deleteTestUsers();




