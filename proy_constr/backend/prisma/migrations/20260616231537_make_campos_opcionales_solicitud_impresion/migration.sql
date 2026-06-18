-- DropForeignKey
ALTER TABLE "Impresion" DROP CONSTRAINT "Impresion_refAyudante_fkey";

-- DropForeignKey
ALTER TABLE "Impresion" DROP CONSTRAINT "Impresion_refCurso_fkey";

-- AlterTable
ALTER TABLE "Impresion" ALTER COLUMN "comentarioUsuario" DROP NOT NULL,
ALTER COLUMN "nombreCurso" DROP NOT NULL,
ALTER COLUMN "observacionAyudante" DROP NOT NULL,
ALTER COLUMN "refAyudante" DROP NOT NULL,
ALTER COLUMN "refCurso" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Impresion" ADD CONSTRAINT "Impresion_refAyudante_fkey" FOREIGN KEY ("refAyudante") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Impresion" ADD CONSTRAINT "Impresion_refCurso_fkey" FOREIGN KEY ("refCurso") REFERENCES "Curso"("idCurso") ON DELETE SET NULL ON UPDATE CASCADE;
