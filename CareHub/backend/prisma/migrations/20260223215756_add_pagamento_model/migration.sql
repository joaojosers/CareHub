/*
  Warnings:

  - You are about to drop the `Pagamento` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Pagamento";

-- CreateTable
CREATE TABLE "pagamentos" (
    "id" SERIAL NOT NULL,
    "cuidadorId" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pagamentos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_cuidadorId_fkey" FOREIGN KEY ("cuidadorId") REFERENCES "cuidador_detalhes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
