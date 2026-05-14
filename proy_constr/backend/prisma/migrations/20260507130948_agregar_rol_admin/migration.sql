/*
  Warnings:

  - A unique constraint covering the columns `[rut]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "TipoRol" ADD VALUE 'ADMINISTRADOR';

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_rut_key" ON "Usuario"("rut");
