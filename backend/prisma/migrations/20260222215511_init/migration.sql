-- DropForeignKey
ALTER TABLE "plantoes" DROP CONSTRAINT "plantoes_cuidadorId_fkey";

-- AlterTable
ALTER TABLE "plantoes" ALTER COLUMN "cuidadorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "plantoes" ADD CONSTRAINT "plantoes_cuidadorId_fkey" FOREIGN KEY ("cuidadorId") REFERENCES "cuidador_detalhes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
