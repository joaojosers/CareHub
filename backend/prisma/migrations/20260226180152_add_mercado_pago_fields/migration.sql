-- AlterTable
ALTER TABLE "pagamentos" ADD COLUMN     "mpPaymentId" TEXT,
ADD COLUMN     "mpQrCode" TEXT,
ADD COLUMN     "mpQrCodeBase64" TEXT,
ADD COLUMN     "mpTicketUrl" TEXT;
