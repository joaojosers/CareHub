/*
  Warnings:

  - You are about to drop the column `mes` on the `pagamentos` table. All the data in the column will be lost.
  - You are about to drop the column `totalHoras` on the `pagamentos` table. All the data in the column will be lost.
  - You are about to drop the column `valorTotal` on the `pagamentos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[plantaoId]` on the table `pagamentos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `plantaoId` to the `pagamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxaPlataforma` to the `pagamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valorBruto` to the `pagamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valorLiquido` to the `pagamentos` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MetodoPagamento" AS ENUM ('PIX', 'TRANSFERENCIA', 'MERCADO_PAGO');

-- DropIndex
DROP INDEX "pagamentos_cuidadorId_mes_key";

-- AlterTable
ALTER TABLE "cuidador_detalhes" ADD COLUMN     "valorHora" DECIMAL(10,2) NOT NULL DEFAULT 20;

-- AlterTable
ALTER TABLE "pagamentos" DROP COLUMN "mes",
DROP COLUMN "totalHoras",
DROP COLUMN "valorTotal",
ADD COLUMN     "metodoPagamento" "MetodoPagamento" NOT NULL DEFAULT 'PIX',
ADD COLUMN     "plantaoId" TEXT NOT NULL,
ADD COLUMN     "taxaPlataforma" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "valorBruto" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "valorLiquido" DECIMAL(10,2) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "pagamentos_plantaoId_key" ON "pagamentos"("plantaoId");

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_plantaoId_fkey" FOREIGN KEY ("plantaoId") REFERENCES "plantoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
