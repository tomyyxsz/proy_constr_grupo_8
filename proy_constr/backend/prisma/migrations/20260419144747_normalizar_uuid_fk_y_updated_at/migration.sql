/*
  Warnings:

  - The primary key for the `Articulo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Ayudantia` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BloqueHorario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BloqueReservado` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Curso` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Estudiante_curso` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Grupo_Curso` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Grupo_Estudiante` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Impresion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Inscripcion_Ayudantia` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Movimiento_Stock` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Reserva` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Semestre` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Uso_Impresion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id_articulo` on the `Articulo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id_ayudantia` on the `Ayudantia` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ref_Curso` on the `Ayudantia` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ref_Grupo` on the `Ayudantia` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ref_Ayudante` on the `Ayudantia` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id_bloque_horario` on the `BloqueHorario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id_bloque` on the `BloqueReservado` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id_reserva` on the `BloqueReservado` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id_curso` on the `Curso` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ref_Semestre` on the `Curso` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ref_Profesor` on the `Curso` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ref_Curso` on the `Estudiante_curso` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ref_Estudiante` on the `Estudiante_curso` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id_grupo_curso` on the `Grupo_Curso` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ref_curso` on the `Grupo_Curso` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ref_Grupo` on the `Grupo_Estudiante` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ref_Estudiante` on the `Grupo_Estudiante` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id_impresion` on the `Impresion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ref_estudiante` on the `Impresion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ref_ayudante` on the `Impresion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ref_curso` on the `Impresion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ref_Ayudantia` on the `Inscripcion_Ayudantia` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ref_Estudiante` on the `Inscripcion_Ayudantia` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id_movimiento` on the `Movimiento_Stock` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ref_articulo` on the `Movimiento_Stock` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ref_usuario` on the `Movimiento_Stock` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id_reserva` on the `Reserva` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ref_ayudante` on the `Reserva` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id_semestre` on the `Semestre` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id_uso_impresion` on the `Uso_Impresion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ref_impresion` on the `Uso_Impresion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ref_solicitante` on the `Uso_Impresion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ref_estudiante` on the `Uso_Impresion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ref_semestre` on the `Uso_Impresion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ref_articulo` on the `Uso_Impresion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Usuario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

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
DROP COLUMN "id_articulo",
ADD COLUMN     "id_articulo" UUID NOT NULL,
ALTER COLUMN "actualizado_en" DROP DEFAULT,
ADD CONSTRAINT "Articulo_pkey" PRIMARY KEY ("id_articulo");

-- AlterTable
ALTER TABLE "Ayudantia" DROP CONSTRAINT "Ayudantia_pkey",
DROP COLUMN "id_ayudantia",
ADD COLUMN     "id_ayudantia" UUID NOT NULL,
DROP COLUMN "ref_Curso",
ADD COLUMN     "ref_Curso" UUID NOT NULL,
DROP COLUMN "ref_Grupo",
ADD COLUMN     "ref_Grupo" UUID NOT NULL,
DROP COLUMN "ref_Ayudante",
ADD COLUMN     "ref_Ayudante" UUID NOT NULL,
ADD CONSTRAINT "Ayudantia_pkey" PRIMARY KEY ("id_ayudantia");

-- AlterTable
ALTER TABLE "BloqueHorario" DROP CONSTRAINT "BloqueHorario_pkey",
DROP COLUMN "id_bloque_horario",
ADD COLUMN     "id_bloque_horario" UUID NOT NULL,
ADD CONSTRAINT "BloqueHorario_pkey" PRIMARY KEY ("id_bloque_horario");

-- AlterTable
ALTER TABLE "BloqueReservado" DROP CONSTRAINT "BloqueReservado_pkey",
DROP COLUMN "id_bloque",
ADD COLUMN     "id_bloque" UUID NOT NULL,
DROP COLUMN "id_reserva",
ADD COLUMN     "id_reserva" UUID NOT NULL,
ADD CONSTRAINT "BloqueReservado_pkey" PRIMARY KEY ("id_bloque", "id_reserva");

-- AlterTable
ALTER TABLE "Curso" DROP CONSTRAINT "Curso_pkey",
DROP COLUMN "id_curso",
ADD COLUMN     "id_curso" UUID NOT NULL,
DROP COLUMN "ref_Semestre",
ADD COLUMN     "ref_Semestre" UUID NOT NULL,
DROP COLUMN "ref_Profesor",
ADD COLUMN     "ref_Profesor" UUID NOT NULL,
ALTER COLUMN "actualizado_en" DROP DEFAULT,
ADD CONSTRAINT "Curso_pkey" PRIMARY KEY ("id_curso");

-- AlterTable
ALTER TABLE "Estudiante_curso" DROP CONSTRAINT "Estudiante_curso_pkey",
DROP COLUMN "ref_Curso",
ADD COLUMN     "ref_Curso" UUID NOT NULL,
DROP COLUMN "ref_Estudiante",
ADD COLUMN     "ref_Estudiante" UUID NOT NULL,
ADD CONSTRAINT "Estudiante_curso_pkey" PRIMARY KEY ("ref_Curso", "ref_Estudiante");

-- AlterTable
ALTER TABLE "Grupo_Curso" DROP CONSTRAINT "Grupo_Curso_pkey",
DROP COLUMN "id_grupo_curso",
ADD COLUMN     "id_grupo_curso" UUID NOT NULL,
DROP COLUMN "ref_curso",
ADD COLUMN     "ref_curso" UUID NOT NULL,
ADD CONSTRAINT "Grupo_Curso_pkey" PRIMARY KEY ("id_grupo_curso");

-- AlterTable
ALTER TABLE "Grupo_Estudiante" DROP CONSTRAINT "Grupo_Estudiante_pkey",
DROP COLUMN "ref_Grupo",
ADD COLUMN     "ref_Grupo" UUID NOT NULL,
DROP COLUMN "ref_Estudiante",
ADD COLUMN     "ref_Estudiante" UUID NOT NULL,
ADD CONSTRAINT "Grupo_Estudiante_pkey" PRIMARY KEY ("ref_Grupo", "ref_Estudiante");

-- AlterTable
ALTER TABLE "Impresion" DROP CONSTRAINT "Impresion_pkey",
DROP COLUMN "id_impresion",
ADD COLUMN     "id_impresion" UUID NOT NULL,
DROP COLUMN "ref_estudiante",
ADD COLUMN     "ref_estudiante" UUID NOT NULL,
DROP COLUMN "ref_ayudante",
ADD COLUMN     "ref_ayudante" UUID NOT NULL,
DROP COLUMN "ref_curso",
ADD COLUMN     "ref_curso" UUID NOT NULL,
ALTER COLUMN "motivo_rechazo" DROP NOT NULL,
ADD CONSTRAINT "Impresion_pkey" PRIMARY KEY ("id_impresion");

-- AlterTable
ALTER TABLE "Inscripcion_Ayudantia" DROP CONSTRAINT "Inscripcion_Ayudantia_pkey",
DROP COLUMN "ref_Ayudantia",
ADD COLUMN     "ref_Ayudantia" UUID NOT NULL,
DROP COLUMN "ref_Estudiante",
ADD COLUMN     "ref_Estudiante" UUID NOT NULL,
ADD CONSTRAINT "Inscripcion_Ayudantia_pkey" PRIMARY KEY ("ref_Ayudantia", "ref_Estudiante");

-- AlterTable
ALTER TABLE "Movimiento_Stock" DROP CONSTRAINT "Movimiento_Stock_pkey",
DROP COLUMN "id_movimiento",
ADD COLUMN     "id_movimiento" UUID NOT NULL,
DROP COLUMN "ref_articulo",
ADD COLUMN     "ref_articulo" UUID NOT NULL,
DROP COLUMN "ref_usuario",
ADD COLUMN     "ref_usuario" UUID NOT NULL,
ADD CONSTRAINT "Movimiento_Stock_pkey" PRIMARY KEY ("id_movimiento");

-- AlterTable
ALTER TABLE "Reserva" DROP CONSTRAINT "Reserva_pkey",
DROP COLUMN "id_reserva",
ADD COLUMN     "id_reserva" UUID NOT NULL,
DROP COLUMN "ref_ayudante",
ADD COLUMN     "ref_ayudante" UUID NOT NULL,
ADD CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id_reserva");

-- AlterTable
ALTER TABLE "Semestre" DROP CONSTRAINT "Semestre_pkey",
DROP COLUMN "id_semestre",
ADD COLUMN     "id_semestre" UUID NOT NULL,
ALTER COLUMN "actualizado_en" DROP DEFAULT,
ADD CONSTRAINT "Semestre_pkey" PRIMARY KEY ("id_semestre");

-- AlterTable
ALTER TABLE "Uso_Impresion" DROP CONSTRAINT "Uso_Impresion_pkey",
DROP COLUMN "id_uso_impresion",
ADD COLUMN     "id_uso_impresion" UUID NOT NULL,
DROP COLUMN "ref_impresion",
ADD COLUMN     "ref_impresion" UUID NOT NULL,
DROP COLUMN "ref_solicitante",
ADD COLUMN     "ref_solicitante" UUID NOT NULL,
DROP COLUMN "ref_estudiante",
ADD COLUMN     "ref_estudiante" UUID NOT NULL,
DROP COLUMN "ref_semestre",
ADD COLUMN     "ref_semestre" UUID NOT NULL,
DROP COLUMN "ref_articulo",
ADD COLUMN     "ref_articulo" UUID NOT NULL,
ALTER COLUMN "actualizado_en" DROP DEFAULT,
ADD CONSTRAINT "Uso_Impresion_pkey" PRIMARY KEY ("id_uso_impresion");

-- AlterTable
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "actualizado_en" DROP DEFAULT,
ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_ref_Semestre_fkey" FOREIGN KEY ("ref_Semestre") REFERENCES "Semestre"("id_semestre") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_ref_Profesor_fkey" FOREIGN KEY ("ref_Profesor") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estudiante_curso" ADD CONSTRAINT "Estudiante_curso_ref_Curso_fkey" FOREIGN KEY ("ref_Curso") REFERENCES "Curso"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estudiante_curso" ADD CONSTRAINT "Estudiante_curso_ref_Estudiante_fkey" FOREIGN KEY ("ref_Estudiante") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ayudantia" ADD CONSTRAINT "Ayudantia_ref_Curso_fkey" FOREIGN KEY ("ref_Curso") REFERENCES "Curso"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ayudantia" ADD CONSTRAINT "Ayudantia_ref_Grupo_fkey" FOREIGN KEY ("ref_Grupo") REFERENCES "Grupo_Curso"("id_grupo_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ayudantia" ADD CONSTRAINT "Ayudantia_ref_Ayudante_fkey" FOREIGN KEY ("ref_Ayudante") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grupo_Curso" ADD CONSTRAINT "Grupo_Curso_ref_curso_fkey" FOREIGN KEY ("ref_curso") REFERENCES "Curso"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grupo_Estudiante" ADD CONSTRAINT "Grupo_Estudiante_ref_Grupo_fkey" FOREIGN KEY ("ref_Grupo") REFERENCES "Grupo_Curso"("id_grupo_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grupo_Estudiante" ADD CONSTRAINT "Grupo_Estudiante_ref_Estudiante_fkey" FOREIGN KEY ("ref_Estudiante") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion_Ayudantia" ADD CONSTRAINT "Inscripcion_Ayudantia_ref_Ayudantia_fkey" FOREIGN KEY ("ref_Ayudantia") REFERENCES "Ayudantia"("id_ayudantia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion_Ayudantia" ADD CONSTRAINT "Inscripcion_Ayudantia_ref_Estudiante_fkey" FOREIGN KEY ("ref_Estudiante") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloqueReservado" ADD CONSTRAINT "BloqueReservado_id_bloque_fkey" FOREIGN KEY ("id_bloque") REFERENCES "BloqueHorario"("id_bloque_horario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloqueReservado" ADD CONSTRAINT "BloqueReservado_id_reserva_fkey" FOREIGN KEY ("id_reserva") REFERENCES "Reserva"("id_reserva") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_ref_ayudante_fkey" FOREIGN KEY ("ref_ayudante") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimiento_Stock" ADD CONSTRAINT "Movimiento_Stock_ref_articulo_fkey" FOREIGN KEY ("ref_articulo") REFERENCES "Articulo"("id_articulo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimiento_Stock" ADD CONSTRAINT "Movimiento_Stock_ref_usuario_fkey" FOREIGN KEY ("ref_usuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Impresion" ADD CONSTRAINT "Impresion_ref_estudiante_fkey" FOREIGN KEY ("ref_estudiante") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Impresion" ADD CONSTRAINT "Impresion_ref_ayudante_fkey" FOREIGN KEY ("ref_ayudante") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Impresion" ADD CONSTRAINT "Impresion_ref_curso_fkey" FOREIGN KEY ("ref_curso") REFERENCES "Curso"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Uso_Impresion" ADD CONSTRAINT "Uso_Impresion_ref_impresion_fkey" FOREIGN KEY ("ref_impresion") REFERENCES "Impresion"("id_impresion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Uso_Impresion" ADD CONSTRAINT "Uso_Impresion_ref_solicitante_fkey" FOREIGN KEY ("ref_solicitante") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Uso_Impresion" ADD CONSTRAINT "Uso_Impresion_ref_estudiante_fkey" FOREIGN KEY ("ref_estudiante") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Uso_Impresion" ADD CONSTRAINT "Uso_Impresion_ref_semestre_fkey" FOREIGN KEY ("ref_semestre") REFERENCES "Semestre"("id_semestre") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Uso_Impresion" ADD CONSTRAINT "Uso_Impresion_ref_articulo_fkey" FOREIGN KEY ("ref_articulo") REFERENCES "Articulo"("id_articulo") ON DELETE RESTRICT ON UPDATE CASCADE;
