-- CreateTable
CREATE TABLE "publicacion" (
    "id" SERIAL NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "contenido" TEXT NOT NULL,
    "fecha_publicacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "publicacion_pkey" PRIMARY KEY ("id")
);
