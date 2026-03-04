-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'CUIDADOR', 'FAMILIAR');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDENTE', 'APROVADO', 'REJEITADO');

-- CreateEnum
CREATE TYPE "PacienteStatus" AS ENUM ('ATIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "PlantaoStatus" AS ENUM ('PENDENTE', 'APROVADO', 'REJEITADO');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "tipo" "UserRole" NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "telefone" TEXT,
    "cpf" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'PENDENTE',
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuidador_detalhes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentos" JSONB,
    "dadosBancarios" JSONB,
    "mercadoPago" TEXT,
    "especialidades" TEXT[],

    CONSTRAINT "cuidador_detalhes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pacientes" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "necessidades" TEXT,
    "status" "PacienteStatus" NOT NULL DEFAULT 'ATIVO',
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pacientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "familiar_vinculos" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "parentesco" TEXT NOT NULL,
    "isResponsavelFinanceiro" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "familiar_vinculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plantoes" (
    "id" TEXT NOT NULL,
    "cuidadorId" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "horasTrabalhadas" DOUBLE PRECISION NOT NULL,
    "relatorio" TEXT,
    "status" "PlantaoStatus" NOT NULL DEFAULT 'PENDENTE',
    "valorPago" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plantoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "cuidador_detalhes_userId_key" ON "cuidador_detalhes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "familiar_vinculos_userId_pacienteId_key" ON "familiar_vinculos"("userId", "pacienteId");

-- AddForeignKey
ALTER TABLE "cuidador_detalhes" ADD CONSTRAINT "cuidador_detalhes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "familiar_vinculos" ADD CONSTRAINT "familiar_vinculos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "familiar_vinculos" ADD CONSTRAINT "familiar_vinculos_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plantoes" ADD CONSTRAINT "plantoes_cuidadorId_fkey" FOREIGN KEY ("cuidadorId") REFERENCES "cuidador_detalhes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plantoes" ADD CONSTRAINT "plantoes_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
