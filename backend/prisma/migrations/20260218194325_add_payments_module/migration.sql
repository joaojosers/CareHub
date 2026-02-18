-- CreateEnum
CREATE TYPE "PagamentoStatus" AS ENUM ('PENDENTE', 'PROCESSADO', 'PAID');

-- DropForeignKey
ALTER TABLE "plantoes" DROP CONSTRAINT "plantoes_cuidadorId_fkey";

-- AlterTable
ALTER TABLE "plantoes" ALTER COLUMN "cuidadorId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "pagamentos" (
    "id" TEXT NOT NULL,
    "cuidadorId" TEXT NOT NULL,
    "mes" TEXT NOT NULL,
    "totalHoras" DOUBLE PRECISION NOT NULL,
    "valorTotal" DECIMAL(10,2) NOT NULL,
    "status" "PagamentoStatus" NOT NULL DEFAULT 'PENDENTE',
    "dataPagamento" TIMESTAMP(3),
    "numeroComprovante" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagamentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pagamentos_cuidadorId_mes_key" ON "pagamentos"("cuidadorId", "mes");

-- AddForeignKey
ALTER TABLE "plantoes" ADD CONSTRAINT "plantoes_cuidadorId_fkey" FOREIGN KEY ("cuidadorId") REFERENCES "cuidador_detalhes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_cuidadorId_fkey" FOREIGN KEY ("cuidadorId") REFERENCES "cuidador_detalhes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
