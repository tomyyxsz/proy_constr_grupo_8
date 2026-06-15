/*
  Warnings:

  - The primary key for the `Articulo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `actualizado_en` on the `Articulo` table. All the data in the column will be lost.
  - You are about to drop the column `alerta_stock` on the `Articulo` table. All the data in the column will be lost.
  - You are about to drop the column `id_articulo` on the `Articulo` table. All the data in the column will be lost.
  - You are about to drop the column `nombre_articulo` on the `Articulo` table. All the data in the column will be lost.
  - You are about to drop the column `notificar_stock` on the `Articulo` table. All the data in the column will be lost.
  - You are about to drop the column `stock_actual` on the `Articulo` table. All the data in the column will be lost.
  - You are about to drop the column `unidad_medida` on the `Articulo` table. All the data in the column will be lost.
  - The primary key for the `Ayudantia` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cupo_maximo` on the `Ayudantia` table. All the data in the column will be lost.
  - You are about to drop the column `estado_ayudantia` on the `Ayudantia` table. All the data in the column will be lost.
  - You are about to drop the column `id_ayudantia` on the `Ayudantia` table. All the data in the column will be lost.
  - You are about to drop the column `nombre_ayudantia` on the `Ayudantia` table. All the data in the column will be lost.
  - You are about to drop the column `ref_Ayudante` on the `Ayudantia` table. All the data in the column will be lost.
  - You are about to drop the column `ref_Curso` on the `Ayudantia` table. All the data in the column will be lost.
  - You are about to drop the column `ref_Grupo` on the `Ayudantia` table. All the data in the column will be lost.
  - The primary key for the `BloqueHorario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `hora_fin` on the `BloqueHorario` table. All the data in the column will be lost.
  - You are about to drop the column `hora_inicio` on the `BloqueHorario` table. All the data in the column will be lost.
  - You are about to drop the column `id_bloque_horario` on the `BloqueHorario` table. All the data in the column will be lost.
  - You are about to drop the column `nro_bloque` on the `BloqueHorario` table. All the data in the column will be lost.
  - The primary key for the `BloqueReservado` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_bloque` on the `BloqueReservado` table. All the data in the column will be lost.
  - You are about to drop the column `id_reserva` on the `BloqueReservado` table. All the data in the column will be lost.
  - The primary key for the `Curso` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `actualizado_en` on the `Curso` table. All the data in the column will be lost.
  - You are about to drop the column `borrado_en` on the `Curso` table. All the data in the column will be lost.
  - You are about to drop the column `creado_en` on the `Curso` table. All the data in the column will be lost.
  - You are about to drop the column `id_curso` on the `Curso` table. All the data in the column will be lost.
  - You are about to drop the column `nombre_curso` on the `Curso` table. All the data in the column will be lost.
  - You are about to drop the column `ref_Profesor` on the `Curso` table. All the data in the column will be lost.
  - You are about to drop the column `ref_Semestre` on the `Curso` table. All the data in the column will be lost.
  - The primary key for the `Impresion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `color_opcion1` on the `Impresion` table. All the data in the column will be lost.
  - You are about to drop the column `color_opcion2` on the `Impresion` table. All the data in the column will be lost.
  - You are about to drop the column `color_opcion3` on the `Impresion` table. All the data in the column will be lost.
  - You are about to drop the column `comentario_tecnico` on the `Impresion` table. All the data in the column will be lost.
  - You are about to drop the column `comentario_usuario` on the `Impresion` table. All the data in the column will be lost.
  - You are about to drop the column `creado_en` on the `Impresion` table. All the data in the column will be lost.
  - You are about to drop the column `estado_impresion` on the `Impresion` table. All the data in the column will be lost.
  - You are about to drop the column `id_impresion` on the `Impresion` table. All the data in the column will be lost.
  - You are about to drop the column `inicio_impresion` on the `Impresion` table. All the data in the column will be lost.
  - You are about to drop the column `motivo_rechazo` on the `Impresion` table. All the data in the column will be lost.
  - You are about to drop the column `nombre_curso` on the `Impresion` table. All the data in the column will be lost.
  - You are about to drop the column `observacion_ayudante` on the `Impresion` table. All the data in the column will be lost.
  - You are about to drop the column `ref_ayudante` on the `Impresion` table. All the data in the column will be lost.
  - You are about to drop the column `ref_curso` on the `Impresion` table. All the data in the column will be lost.
  - You are about to drop the column `ref_estudiante` on the `Impresion` table. All the data in the column will be lost.
  - You are about to drop the column `solicitante_apellido` on the `Impresion` table. All the data in the column will be lost.
  - You are about to drop the column `solicitante_email` on the `Impresion` table. All the data in the column will be lost.
  - You are about to drop the column `solicitante_nombre` on the `Impresion` table. All the data in the column will be lost.
  - You are about to drop the column `solicitante_rut` on the `Impresion` table. All the data in the column will be lost.
  - You are about to drop the column `tiempo_estimado_impresion` on the `Impresion` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_solicitud` on the `Impresion` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_usuario` on the `Impresion` table. All the data in the column will be lost.
  - You are about to drop the column `url_modelo_3d` on the `Impresion` table. All the data in the column will be lost.
  - You are about to drop the column `url_modelo_stl` on the `Impresion` table. All the data in the column will be lost.
  - The primary key for the `Reserva` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `creado_en` on the `Reserva` table. All the data in the column will be lost.
  - You are about to drop the column `estado_reserva` on the `Reserva` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_reserva` on the `Reserva` table. All the data in the column will be lost.
  - You are about to drop the column `id_reserva` on the `Reserva` table. All the data in the column will be lost.
  - You are about to drop the column `motivo_reserva` on the `Reserva` table. All the data in the column will be lost.
  - You are about to drop the column `ref_ayudante` on the `Reserva` table. All the data in the column will be lost.
  - You are about to drop the column `solicitante_apellido` on the `Reserva` table. All the data in the column will be lost.
  - You are about to drop the column `solicitante_email` on the `Reserva` table. All the data in the column will be lost.
  - You are about to drop the column `solicitante_nombre` on the `Reserva` table. All the data in the column will be lost.
  - You are about to drop the column `solicitante_rut` on the `Reserva` table. All the data in the column will be lost.
  - The primary key for the `Semestre` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `actualizado_en` on the `Semestre` table. All the data in the column will be lost.
  - You are about to drop the column `borrado_en` on the `Semestre` table. All the data in the column will be lost.
  - You are about to drop the column `creado_en` on the `Semestre` table. All the data in the column will be lost.
  - You are about to drop the column `estado_semestre` on the `Semestre` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_fin` on the `Semestre` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_inicio` on the `Semestre` table. All the data in the column will be lost.
  - You are about to drop the column `id_semestre` on the `Semestre` table. All the data in the column will be lost.
  - You are about to drop the column `actualizado_en` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `borrado_en` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `creado_en` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `usuario_rol` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the `Estudiante_curso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Grupo_Curso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Grupo_Estudiante` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inscripcion_Ayudantia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Movimiento_Stock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Uso_Impresion` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `actualizadoEn` to the `Articulo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alertaStock` to the `Articulo` table without a default value. This is not possible if the table is not empty.
  - The required column `idArticulo` was added to the `Articulo` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `nombreArticulo` to the `Articulo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stockActual` to the `Articulo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unidadMedida` to the `Articulo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cupoMaximo` to the `Ayudantia` table without a default value. This is not possible if the table is not empty.
  - The required column `idAyudantia` was added to the `Ayudantia` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `nombreAyudantia` to the `Ayudantia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refAyudante` to the `Ayudantia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refCurso` to the `Ayudantia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refGrupo` to the `Ayudantia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horaFin` to the `BloqueHorario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horaInicio` to the `BloqueHorario` table without a default value. This is not possible if the table is not empty.
  - The required column `idBloqueHorario` was added to the `BloqueHorario` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `nroBloque` to the `BloqueHorario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idBloque` to the `BloqueReservado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idReserva` to the `BloqueReservado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `Curso` table without a default value. This is not possible if the table is not empty.
  - The required column `idCurso` was added to the `Curso` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `nombreCurso` to the `Curso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refProfesor` to the `Curso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refSemestre` to the `Curso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `colorOpcion1` to the `Impresion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `colorOpcion2` to the `Impresion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `colorOpcion3` to the `Impresion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `comentarioTecnico` to the `Impresion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `comentarioUsuario` to the `Impresion` table without a default value. This is not possible if the table is not empty.
  - The required column `idImpresion` was added to the `Impresion` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `nombreCurso` to the `Impresion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `observacionAyudante` to the `Impresion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refAyudante` to the `Impresion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refCurso` to the `Impresion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refEstudiante` to the `Impresion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `solicitanteApellido` to the `Impresion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `solicitanteEmail` to the `Impresion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `solicitanteNombre` to the `Impresion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `solicitanteRut` to the `Impresion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tiempoEstimadoImpresion` to the `Impresion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoSolicitud` to the `Impresion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoUsuario` to the `Impresion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `urlModelo3d` to the `Impresion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `urlModeloStl` to the `Impresion` table without a default value. This is not possible if the table is not empty.
  - The required column `idReserva` was added to the `Reserva` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `motivoReserva` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refAyudante` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `solicitanteApellido` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `solicitanteEmail` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `solicitanteNombre` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `solicitanteRut` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `Semestre` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaFin` to the `Semestre` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaInicio` to the `Semestre` table without a default value. This is not possible if the table is not empty.
  - The required column `idSemestre` was added to the `Semestre` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `actualizadoEn` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ayudantia" DROP CONSTRAINT "Ayudantia_ref_Ayudante_fkey";

-- DropForeignKey
ALTER TABLE "Ayudantia" DROP CONSTRAINT "Ayudantia_ref_Curso_fkey";

-- DropForeignKey
ALTER TABLE "Ayudantia" DROP CONSTRAINT "Ayudantia_ref_Grupo_fkey";

-- DropForeignKey
ALTER TABLE "BloqueReservado" DROP CONSTRAINT "BloqueReservado_id_bloque_fkey";

-- DropForeignKey
ALTER TABLE "BloqueReservado" DROP CONSTRAINT "BloqueReservado_id_reserva_fkey";

-- DropForeignKey
ALTER TABLE "Curso" DROP CONSTRAINT "Curso_ref_Profesor_fkey";

-- DropForeignKey
ALTER TABLE "Curso" DROP CONSTRAINT "Curso_ref_Semestre_fkey";

-- DropForeignKey
ALTER TABLE "Estudiante_curso" DROP CONSTRAINT "Estudiante_curso_ref_Curso_fkey";

-- DropForeignKey
ALTER TABLE "Estudiante_curso" DROP CONSTRAINT "Estudiante_curso_ref_Estudiante_fkey";

-- DropForeignKey
ALTER TABLE "Grupo_Curso" DROP CONSTRAINT "Grupo_Curso_ref_curso_fkey";

-- DropForeignKey
ALTER TABLE "Grupo_Estudiante" DROP CONSTRAINT "Grupo_Estudiante_ref_Estudiante_fkey";

-- DropForeignKey
ALTER TABLE "Grupo_Estudiante" DROP CONSTRAINT "Grupo_Estudiante_ref_Grupo_fkey";

-- DropForeignKey
ALTER TABLE "Impresion" DROP CONSTRAINT "Impresion_ref_ayudante_fkey";

-- DropForeignKey
ALTER TABLE "Impresion" DROP CONSTRAINT "Impresion_ref_curso_fkey";

-- DropForeignKey
ALTER TABLE "Impresion" DROP CONSTRAINT "Impresion_ref_estudiante_fkey";

-- DropForeignKey
ALTER TABLE "Inscripcion_Ayudantia" DROP CONSTRAINT "Inscripcion_Ayudantia_ref_Ayudantia_fkey";

-- DropForeignKey
ALTER TABLE "Inscripcion_Ayudantia" DROP CONSTRAINT "Inscripcion_Ayudantia_ref_Estudiante_fkey";

-- DropForeignKey
ALTER TABLE "Movimiento_Stock" DROP CONSTRAINT "Movimiento_Stock_ref_articulo_fkey";

-- DropForeignKey
ALTER TABLE "Movimiento_Stock" DROP CONSTRAINT "Movimiento_Stock_ref_usuario_fkey";

-- DropForeignKey
ALTER TABLE "Reserva" DROP CONSTRAINT "Reserva_ref_ayudante_fkey";

-- DropForeignKey
ALTER TABLE "Uso_Impresion" DROP CONSTRAINT "Uso_Impresion_ref_articulo_fkey";

-- DropForeignKey
ALTER TABLE "Uso_Impresion" DROP CONSTRAINT "Uso_Impresion_ref_estudiante_fkey";

-- DropForeignKey
ALTER TABLE "Uso_Impresion" DROP CONSTRAINT "Uso_Impresion_ref_impresion_fkey";

-- DropForeignKey
ALTER TABLE "Uso_Impresion" DROP CONSTRAINT "Uso_Impresion_ref_semestre_fkey";

-- DropForeignKey
ALTER TABLE "Uso_Impresion" DROP CONSTRAINT "Uso_Impresion_ref_solicitante_fkey";

-- AlterTable
ALTER TABLE "Articulo" DROP CONSTRAINT "Articulo_pkey",
DROP COLUMN "actualizado_en",
DROP COLUMN "alerta_stock",
DROP COLUMN "id_articulo",
DROP COLUMN "nombre_articulo",
DROP COLUMN "notificar_stock",
DROP COLUMN "stock_actual",
DROP COLUMN "unidad_medida",
ADD COLUMN     "actualizadoEn" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "alertaStock" INTEGER NOT NULL,
ADD COLUMN     "idArticulo" UUID NOT NULL,
ADD COLUMN     "nombreArticulo" VARCHAR(100) NOT NULL,
ADD COLUMN     "notificarStock" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stockActual" INTEGER NOT NULL,
ADD COLUMN     "unidadMedida" VARCHAR(50) NOT NULL,
ADD CONSTRAINT "Articulo_pkey" PRIMARY KEY ("idArticulo");

-- AlterTable
ALTER TABLE "Ayudantia" DROP CONSTRAINT "Ayudantia_pkey",
DROP COLUMN "cupo_maximo",
DROP COLUMN "estado_ayudantia",
DROP COLUMN "id_ayudantia",
DROP COLUMN "nombre_ayudantia",
DROP COLUMN "ref_Ayudante",
DROP COLUMN "ref_Curso",
DROP COLUMN "ref_Grupo",
ADD COLUMN     "cupoMaximo" INTEGER NOT NULL,
ADD COLUMN     "estadoAyudantia" "EstadoAyudantia" NOT NULL DEFAULT 'ACTIVA',
ADD COLUMN     "idAyudantia" UUID NOT NULL,
ADD COLUMN     "nombreAyudantia" VARCHAR(255) NOT NULL,
ADD COLUMN     "refAyudante" UUID NOT NULL,
ADD COLUMN     "refCurso" UUID NOT NULL,
ADD COLUMN     "refGrupo" UUID NOT NULL,
ADD CONSTRAINT "Ayudantia_pkey" PRIMARY KEY ("idAyudantia");

-- AlterTable
ALTER TABLE "BloqueHorario" DROP CONSTRAINT "BloqueHorario_pkey",
DROP COLUMN "hora_fin",
DROP COLUMN "hora_inicio",
DROP COLUMN "id_bloque_horario",
DROP COLUMN "nro_bloque",
ADD COLUMN     "horaFin" VARCHAR(50) NOT NULL,
ADD COLUMN     "horaInicio" VARCHAR(50) NOT NULL,
ADD COLUMN     "idBloqueHorario" UUID NOT NULL,
ADD COLUMN     "nroBloque" INTEGER NOT NULL,
ADD CONSTRAINT "BloqueHorario_pkey" PRIMARY KEY ("idBloqueHorario");

-- AlterTable
ALTER TABLE "BloqueReservado" DROP CONSTRAINT "BloqueReservado_pkey",
DROP COLUMN "id_bloque",
DROP COLUMN "id_reserva",
ADD COLUMN     "idBloque" UUID NOT NULL,
ADD COLUMN     "idReserva" UUID NOT NULL,
ADD CONSTRAINT "BloqueReservado_pkey" PRIMARY KEY ("idBloque", "idReserva");

-- AlterTable
ALTER TABLE "Curso" DROP CONSTRAINT "Curso_pkey",
DROP COLUMN "actualizado_en",
DROP COLUMN "borrado_en",
DROP COLUMN "creado_en",
DROP COLUMN "id_curso",
DROP COLUMN "nombre_curso",
DROP COLUMN "ref_Profesor",
DROP COLUMN "ref_Semestre",
ADD COLUMN     "actualizadoEn" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "borradoEn" TIMESTAMP(6),
ADD COLUMN     "creadoEn" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "idCurso" UUID NOT NULL,
ADD COLUMN     "nombreCurso" VARCHAR(255) NOT NULL,
ADD COLUMN     "refProfesor" UUID NOT NULL,
ADD COLUMN     "refSemestre" UUID NOT NULL,
ADD CONSTRAINT "Curso_pkey" PRIMARY KEY ("idCurso");

-- AlterTable
ALTER TABLE "Impresion" DROP CONSTRAINT "Impresion_pkey",
DROP COLUMN "color_opcion1",
DROP COLUMN "color_opcion2",
DROP COLUMN "color_opcion3",
DROP COLUMN "comentario_tecnico",
DROP COLUMN "comentario_usuario",
DROP COLUMN "creado_en",
DROP COLUMN "estado_impresion",
DROP COLUMN "id_impresion",
DROP COLUMN "inicio_impresion",
DROP COLUMN "motivo_rechazo",
DROP COLUMN "nombre_curso",
DROP COLUMN "observacion_ayudante",
DROP COLUMN "ref_ayudante",
DROP COLUMN "ref_curso",
DROP COLUMN "ref_estudiante",
DROP COLUMN "solicitante_apellido",
DROP COLUMN "solicitante_email",
DROP COLUMN "solicitante_nombre",
DROP COLUMN "solicitante_rut",
DROP COLUMN "tiempo_estimado_impresion",
DROP COLUMN "tipo_solicitud",
DROP COLUMN "tipo_usuario",
DROP COLUMN "url_modelo_3d",
DROP COLUMN "url_modelo_stl",
ADD COLUMN     "colorOpcion1" VARCHAR(50) NOT NULL,
ADD COLUMN     "colorOpcion2" VARCHAR(50) NOT NULL,
ADD COLUMN     "colorOpcion3" VARCHAR(50) NOT NULL,
ADD COLUMN     "comentarioTecnico" VARCHAR(255) NOT NULL,
ADD COLUMN     "comentarioUsuario" VARCHAR(255) NOT NULL,
ADD COLUMN     "creadoEn" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "estadoImpresion" "EstadoImpresion" NOT NULL DEFAULT 'PENDIENTE',
ADD COLUMN     "idImpresion" UUID NOT NULL,
ADD COLUMN     "inicioImpresion" TIMESTAMP(6),
ADD COLUMN     "motivoRechazo" VARCHAR(255),
ADD COLUMN     "nombreCurso" VARCHAR(100) NOT NULL,
ADD COLUMN     "observacionAyudante" VARCHAR(255) NOT NULL,
ADD COLUMN     "refAyudante" UUID NOT NULL,
ADD COLUMN     "refCurso" UUID NOT NULL,
ADD COLUMN     "refEstudiante" UUID NOT NULL,
ADD COLUMN     "solicitanteApellido" VARCHAR(50) NOT NULL,
ADD COLUMN     "solicitanteEmail" VARCHAR(100) NOT NULL,
ADD COLUMN     "solicitanteNombre" VARCHAR(50) NOT NULL,
ADD COLUMN     "solicitanteRut" VARCHAR(10) NOT NULL,
ADD COLUMN     "tiempoEstimadoImpresion" VARCHAR(50) NOT NULL,
ADD COLUMN     "tipoSolicitud" VARCHAR(50) NOT NULL,
ADD COLUMN     "tipoUsuario" VARCHAR(50) NOT NULL,
ADD COLUMN     "urlModelo3d" VARCHAR(255) NOT NULL,
ADD COLUMN     "urlModeloStl" VARCHAR(255) NOT NULL,
ADD CONSTRAINT "Impresion_pkey" PRIMARY KEY ("idImpresion");

-- AlterTable
ALTER TABLE "Reserva" DROP CONSTRAINT "Reserva_pkey",
DROP COLUMN "creado_en",
DROP COLUMN "estado_reserva",
DROP COLUMN "fecha_reserva",
DROP COLUMN "id_reserva",
DROP COLUMN "motivo_reserva",
DROP COLUMN "ref_ayudante",
DROP COLUMN "solicitante_apellido",
DROP COLUMN "solicitante_email",
DROP COLUMN "solicitante_nombre",
DROP COLUMN "solicitante_rut",
ADD COLUMN     "creadoEn" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "estadoReserva" "EstadoReserva" NOT NULL DEFAULT 'PENDIENTE',
ADD COLUMN     "fechaReserva" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "idReserva" UUID NOT NULL,
ADD COLUMN     "motivoReserva" VARCHAR(255) NOT NULL,
ADD COLUMN     "refAyudante" UUID NOT NULL,
ADD COLUMN     "solicitanteApellido" VARCHAR(50) NOT NULL,
ADD COLUMN     "solicitanteEmail" VARCHAR(100) NOT NULL,
ADD COLUMN     "solicitanteNombre" VARCHAR(50) NOT NULL,
ADD COLUMN     "solicitanteRut" VARCHAR(10) NOT NULL,
ADD CONSTRAINT "Reserva_pkey" PRIMARY KEY ("idReserva");

-- AlterTable
ALTER TABLE "Semestre" DROP CONSTRAINT "Semestre_pkey",
DROP COLUMN "actualizado_en",
DROP COLUMN "borrado_en",
DROP COLUMN "creado_en",
DROP COLUMN "estado_semestre",
DROP COLUMN "fecha_fin",
DROP COLUMN "fecha_inicio",
DROP COLUMN "id_semestre",
ADD COLUMN     "actualizadoEn" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "borradoEn" TIMESTAMP(6),
ADD COLUMN     "creadoEn" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "estadoSemestre" VARCHAR(50) NOT NULL DEFAULT 'ACTIVO',
ADD COLUMN     "fechaFin" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "fechaInicio" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "idSemestre" UUID NOT NULL,
ADD CONSTRAINT "Semestre_pkey" PRIMARY KEY ("idSemestre");

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "actualizado_en",
DROP COLUMN "borrado_en",
DROP COLUMN "creado_en",
DROP COLUMN "usuario_rol",
ADD COLUMN     "actualizadoEn" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "borradoEn" TIMESTAMP(6),
ADD COLUMN     "creadoEn" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "usuarioRol" "TipoRol" NOT NULL DEFAULT 'ESTUDIANTE';

-- DropTable
DROP TABLE "Estudiante_curso";

-- DropTable
DROP TABLE "Grupo_Curso";

-- DropTable
DROP TABLE "Grupo_Estudiante";

-- DropTable
DROP TABLE "Inscripcion_Ayudantia";

-- DropTable
DROP TABLE "Movimiento_Stock";

-- DropTable
DROP TABLE "Uso_Impresion";

-- CreateTable
CREATE TABLE "EstudianteCurso" (
    "refCurso" UUID NOT NULL,
    "refEstudiante" UUID NOT NULL,

    CONSTRAINT "EstudianteCurso_pkey" PRIMARY KEY ("refCurso","refEstudiante")
);

-- CreateTable
CREATE TABLE "GrupoCurso" (
    "idGrupoCurso" UUID NOT NULL,
    "refCurso" UUID NOT NULL,
    "nombreGrupo" VARCHAR(100) NOT NULL,

    CONSTRAINT "GrupoCurso_pkey" PRIMARY KEY ("idGrupoCurso")
);

-- CreateTable
CREATE TABLE "GrupoEstudiante" (
    "refGrupo" UUID NOT NULL,
    "refEstudiante" UUID NOT NULL,

    CONSTRAINT "GrupoEstudiante_pkey" PRIMARY KEY ("refGrupo","refEstudiante")
);

-- CreateTable
CREATE TABLE "inscripcionAyudantia" (
    "refAyudantia" UUID NOT NULL,
    "refEstudiante" UUID NOT NULL,
    "fechaInscripcion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estadoAsistencia" "EstadoAsistencia" NOT NULL DEFAULT 'AUSENTE',

    CONSTRAINT "inscripcionAyudantia_pkey" PRIMARY KEY ("refAyudantia","refEstudiante")
);

-- CreateTable
CREATE TABLE "MovimientoStock" (
    "idMovimiento" UUID NOT NULL,
    "refArticulo" UUID NOT NULL,
    "refUsuario" UUID NOT NULL,
    "tipoMovimiento" "TipoMovimientoStock" NOT NULL DEFAULT 'ENTRADA',
    "cambioStock" INTEGER NOT NULL,
    "stockResultante" INTEGER NOT NULL,
    "observacion" VARCHAR(255) NOT NULL,
    "creadoEn" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovimientoStock_pkey" PRIMARY KEY ("idMovimiento")
);

-- CreateTable
CREATE TABLE "UsoImpresion" (
    "idUsoImpresion" UUID NOT NULL,
    "refImpresion" UUID NOT NULL,
    "refSolicitante" UUID NOT NULL,
    "refEstudiante" UUID NOT NULL,
    "refSemestre" UUID NOT NULL,
    "cantidadFilamento" INTEGER NOT NULL,
    "refArticulo" UUID NOT NULL,
    "creadoEn" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "UsoImpresion_pkey" PRIMARY KEY ("idUsoImpresion")
);

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_refSemestre_fkey" FOREIGN KEY ("refSemestre") REFERENCES "Semestre"("idSemestre") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_refProfesor_fkey" FOREIGN KEY ("refProfesor") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstudianteCurso" ADD CONSTRAINT "EstudianteCurso_refCurso_fkey" FOREIGN KEY ("refCurso") REFERENCES "Curso"("idCurso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstudianteCurso" ADD CONSTRAINT "EstudianteCurso_refEstudiante_fkey" FOREIGN KEY ("refEstudiante") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ayudantia" ADD CONSTRAINT "Ayudantia_refCurso_fkey" FOREIGN KEY ("refCurso") REFERENCES "Curso"("idCurso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ayudantia" ADD CONSTRAINT "Ayudantia_refGrupo_fkey" FOREIGN KEY ("refGrupo") REFERENCES "GrupoCurso"("idGrupoCurso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ayudantia" ADD CONSTRAINT "Ayudantia_refAyudante_fkey" FOREIGN KEY ("refAyudante") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrupoCurso" ADD CONSTRAINT "GrupoCurso_refCurso_fkey" FOREIGN KEY ("refCurso") REFERENCES "Curso"("idCurso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrupoEstudiante" ADD CONSTRAINT "GrupoEstudiante_refGrupo_fkey" FOREIGN KEY ("refGrupo") REFERENCES "GrupoCurso"("idGrupoCurso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrupoEstudiante" ADD CONSTRAINT "GrupoEstudiante_refEstudiante_fkey" FOREIGN KEY ("refEstudiante") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripcionAyudantia" ADD CONSTRAINT "inscripcionAyudantia_refAyudantia_fkey" FOREIGN KEY ("refAyudantia") REFERENCES "Ayudantia"("idAyudantia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripcionAyudantia" ADD CONSTRAINT "inscripcionAyudantia_refEstudiante_fkey" FOREIGN KEY ("refEstudiante") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloqueReservado" ADD CONSTRAINT "BloqueReservado_idBloque_fkey" FOREIGN KEY ("idBloque") REFERENCES "BloqueHorario"("idBloqueHorario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloqueReservado" ADD CONSTRAINT "BloqueReservado_idReserva_fkey" FOREIGN KEY ("idReserva") REFERENCES "Reserva"("idReserva") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_refAyudante_fkey" FOREIGN KEY ("refAyudante") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoStock" ADD CONSTRAINT "MovimientoStock_refArticulo_fkey" FOREIGN KEY ("refArticulo") REFERENCES "Articulo"("idArticulo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoStock" ADD CONSTRAINT "MovimientoStock_refUsuario_fkey" FOREIGN KEY ("refUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Impresion" ADD CONSTRAINT "Impresion_refEstudiante_fkey" FOREIGN KEY ("refEstudiante") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Impresion" ADD CONSTRAINT "Impresion_refAyudante_fkey" FOREIGN KEY ("refAyudante") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Impresion" ADD CONSTRAINT "Impresion_refCurso_fkey" FOREIGN KEY ("refCurso") REFERENCES "Curso"("idCurso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsoImpresion" ADD CONSTRAINT "UsoImpresion_refImpresion_fkey" FOREIGN KEY ("refImpresion") REFERENCES "Impresion"("idImpresion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsoImpresion" ADD CONSTRAINT "UsoImpresion_refSolicitante_fkey" FOREIGN KEY ("refSolicitante") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsoImpresion" ADD CONSTRAINT "UsoImpresion_refEstudiante_fkey" FOREIGN KEY ("refEstudiante") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsoImpresion" ADD CONSTRAINT "UsoImpresion_refSemestre_fkey" FOREIGN KEY ("refSemestre") REFERENCES "Semestre"("idSemestre") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsoImpresion" ADD CONSTRAINT "UsoImpresion_refArticulo_fkey" FOREIGN KEY ("refArticulo") REFERENCES "Articulo"("idArticulo") ON DELETE RESTRICT ON UPDATE CASCADE;
