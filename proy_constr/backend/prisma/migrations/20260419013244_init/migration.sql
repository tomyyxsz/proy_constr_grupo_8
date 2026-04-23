-- CreateEnum
CREATE TYPE "TipoRol" AS ENUM ('PROFESOR', 'AYUDANTE', 'ESTUDIANTE');

-- CreateEnum
CREATE TYPE "EstadoAyudantia" AS ENUM ('ACTIVA', 'COMPLETADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "EstadoAsistencia" AS ENUM ('PRESENTE', 'AUSENTE');

-- CreateEnum
CREATE TYPE "TipoMovimientoStock" AS ENUM ('ENTRADA', 'SALIDA');

-- CreateEnum
CREATE TYPE "EstadoImpresion" AS ENUM ('PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'RECHAZADA');

-- CreateEnum
CREATE TYPE "EstadoReserva" AS ENUM ('PENDIENTE', 'CONFIRMADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "rut" VARCHAR(10) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "usuario_rol" "TipoRol" NOT NULL DEFAULT 'ESTUDIANTE',
    "borrado_en" TIMESTAMP(6),
    "creado_en" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Semestre" (
    "id_semestre" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "periodo" INTEGER NOT NULL,
    "fecha_inicio" TIMESTAMP(6) NOT NULL,
    "fecha_fin" TIMESTAMP(6) NOT NULL,
    "estado_semestre" VARCHAR(50) NOT NULL DEFAULT 'ACTIVO',
    "borrado_en" TIMESTAMP(6),
    "creado_en" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Semestre_pkey" PRIMARY KEY ("id_semestre")
);

-- CreateTable
CREATE TABLE "Curso" (
    "id_curso" TEXT NOT NULL,
    "nombre_curso" VARCHAR(255) NOT NULL,
    "ref_Semestre" VARCHAR(10) NOT NULL,
    "ref_Profesor" VARCHAR(10) NOT NULL,
    "borrado_en" TIMESTAMP(6),
    "creado_en" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id_curso")
);

-- CreateTable
CREATE TABLE "Estudiante_curso" (
    "ref_Curso" VARCHAR(10) NOT NULL,
    "ref_Estudiante" VARCHAR(10) NOT NULL,

    CONSTRAINT "Estudiante_curso_pkey" PRIMARY KEY ("ref_Curso","ref_Estudiante")
);

-- CreateTable
CREATE TABLE "Ayudantia" (
    "id_ayudantia" TEXT NOT NULL,
    "nombre_ayudantia" VARCHAR(255) NOT NULL,
    "ref_Curso" VARCHAR(10) NOT NULL,
    "ref_Grupo" VARCHAR(10) NOT NULL,
    "ref_Ayudante" VARCHAR(10) NOT NULL,
    "horario" TIMESTAMP(6) NOT NULL,
    "cupo_maximo" INTEGER NOT NULL,
    "estado_ayudantia" "EstadoAyudantia" NOT NULL DEFAULT 'ACTIVA',

    CONSTRAINT "Ayudantia_pkey" PRIMARY KEY ("id_ayudantia")
);

-- CreateTable
CREATE TABLE "Grupo_Curso" (
    "id_grupo_curso" TEXT NOT NULL,
    "ref_curso" VARCHAR(10) NOT NULL,
    "nombre_grupo" VARCHAR(100) NOT NULL,

    CONSTRAINT "Grupo_Curso_pkey" PRIMARY KEY ("id_grupo_curso")
);

-- CreateTable
CREATE TABLE "Grupo_Estudiante" (
    "ref_Grupo" VARCHAR(10) NOT NULL,
    "ref_Estudiante" VARCHAR(10) NOT NULL,

    CONSTRAINT "Grupo_Estudiante_pkey" PRIMARY KEY ("ref_Grupo","ref_Estudiante")
);

-- CreateTable
CREATE TABLE "Inscripcion_Ayudantia" (
    "ref_Ayudantia" VARCHAR(10) NOT NULL,
    "ref_Estudiante" VARCHAR(10) NOT NULL,
    "fecha_inscripcion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado_asistencia" "EstadoAsistencia" NOT NULL DEFAULT 'AUSENTE',

    CONSTRAINT "Inscripcion_Ayudantia_pkey" PRIMARY KEY ("ref_Ayudantia","ref_Estudiante")
);

-- CreateTable
CREATE TABLE "BloqueHorario" (
    "id_bloque_horario" TEXT NOT NULL,
    "nro_bloque" INTEGER NOT NULL,
    "hora_inicio" VARCHAR(50) NOT NULL,
    "hora_fin" VARCHAR(50) NOT NULL,

    CONSTRAINT "BloqueHorario_pkey" PRIMARY KEY ("id_bloque_horario")
);

-- CreateTable
CREATE TABLE "BloqueReservado" (
    "id_bloque" TEXT NOT NULL,
    "id_reserva" TEXT NOT NULL,

    CONSTRAINT "BloqueReservado_pkey" PRIMARY KEY ("id_bloque","id_reserva")
);

-- CreateTable
CREATE TABLE "Reserva" (
    "id_reserva" TEXT NOT NULL,
    "fecha_reserva" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado_reserva" "EstadoReserva" NOT NULL DEFAULT 'PENDIENTE',
    "solicitante_nombre" VARCHAR(50) NOT NULL,
    "solicitante_email" VARCHAR(100) NOT NULL,
    "solicitante_apellido" VARCHAR(50) NOT NULL,
    "solicitante_rut" VARCHAR(10) NOT NULL,
    "ref_ayudante" VARCHAR(10) NOT NULL,
    "motivo_reserva" VARCHAR(255) NOT NULL,
    "creado_en" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id_reserva")
);

-- CreateTable
CREATE TABLE "Articulo" (
    "id_articulo" TEXT NOT NULL,
    "nombre_articulo" VARCHAR(100) NOT NULL,
    "stock_actual" INTEGER NOT NULL,
    "unidad_medida" VARCHAR(50) NOT NULL,
    "alerta_stock" INTEGER NOT NULL,
    "notificar_stock" BOOLEAN NOT NULL DEFAULT false,
    "actualizado_en" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Articulo_pkey" PRIMARY KEY ("id_articulo")
);

-- CreateTable
CREATE TABLE "Movimiento_Stock" (
    "id_movimiento" TEXT NOT NULL,
    "ref_articulo" VARCHAR(10) NOT NULL,
    "ref_usuario" VARCHAR(10) NOT NULL,
    "tipo_movimiento" "TipoMovimientoStock" NOT NULL DEFAULT 'ENTRADA',
    "cambio_stock" INTEGER NOT NULL,
    "stock_resultante" INTEGER NOT NULL,
    "observacion" VARCHAR(255) NOT NULL,
    "creado_en" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Movimiento_Stock_pkey" PRIMARY KEY ("id_movimiento")
);

-- CreateTable
CREATE TABLE "Impresion" (
    "id_impresion" TEXT NOT NULL,
    "solicitante_nombre" VARCHAR(50) NOT NULL,
    "solicitante_apellido" VARCHAR(50) NOT NULL,
    "solicitante_email" VARCHAR(100) NOT NULL,
    "solicitante_rut" VARCHAR(10) NOT NULL,
    "ref_estudiante" VARCHAR(10) NOT NULL,
    "ref_ayudante" VARCHAR(10) NOT NULL,
    "tipo_usuario" VARCHAR(50) NOT NULL,
    "tipo_solicitud" VARCHAR(50) NOT NULL,
    "nombre_curso" VARCHAR(100) NOT NULL,
    "ref_curso" VARCHAR(10) NOT NULL,
    "color_opcion1" VARCHAR(50) NOT NULL,
    "color_opcion2" VARCHAR(50) NOT NULL,
    "color_opcion3" VARCHAR(50) NOT NULL,
    "comentario_tecnico" VARCHAR(255) NOT NULL,
    "url_modelo_3d" VARCHAR(255) NOT NULL,
    "url_modelo_stl" VARCHAR(255) NOT NULL,
    "comentario_usuario" VARCHAR(255) NOT NULL,
    "estado_impresion" "EstadoImpresion" NOT NULL DEFAULT 'PENDIENTE',
    "observacion_ayudante" VARCHAR(255) NOT NULL,
    "motivo_rechazo" VARCHAR(255) NOT NULL,
    "tiempo_estimado_impresion" VARCHAR(50) NOT NULL,
    "inicio_impresion" TIMESTAMP(6),
    "creado_en" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Impresion_pkey" PRIMARY KEY ("id_impresion")
);

-- CreateTable
CREATE TABLE "Uso_Impresion" (
    "id_uso_impresion" TEXT NOT NULL,
    "ref_impresion" VARCHAR(10) NOT NULL,
    "ref_solicitante" VARCHAR(10) NOT NULL,
    "ref_estudiante" VARCHAR(10) NOT NULL,
    "ref_semestre" VARCHAR(10) NOT NULL,
    "cantidad_filamento" INTEGER NOT NULL,
    "ref_articulo" VARCHAR(10) NOT NULL,
    "creado_en" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Uso_Impresion_pkey" PRIMARY KEY ("id_uso_impresion")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_ref_Semestre_fkey" FOREIGN KEY ("ref_Semestre") REFERENCES "Semestre"("id_semestre") ON DELETE RESTRICT ON UPDATE CASCADE;

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
