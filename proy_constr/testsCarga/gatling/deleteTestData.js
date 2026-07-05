// funcion para borrar usuarios de prueba generados en la simulacion

import dotenv from "dotenv";

dotenv.config({ path: "../../backend/.env"});

const {prisma} = await import ("../../backend/src/lib/prisma.js");

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




