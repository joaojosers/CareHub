-- CreateTable
CREATE TABLE "documentos_cuidador" (
    "id" TEXT NOT NULL,
    "cuidadorId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'PENDENTE',
    "dataSubmissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "conferidoEm" TIMESTAMP(3),
    "conferidoPor" TEXT,

    CONSTRAINT "documentos_cuidador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enderecos" (
    "id" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cep" CHAR(8) NOT NULL,
    "referencia" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "pacienteId" TEXT,

    CONSTRAINT "enderecos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relatorios_atividade" (
    "id" TEXT NOT NULL,
    "plantaoId" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "medicacoes" TEXT,
    "pressaoArterial" TEXT,
    "observacoes" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "relatorios_atividade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "enderecos_userId_key" ON "enderecos"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "enderecos_pacienteId_key" ON "enderecos"("pacienteId");

-- CreateIndex
CREATE UNIQUE INDEX "relatorios_atividade_plantaoId_key" ON "relatorios_atividade"("plantaoId");

-- AddForeignKey
ALTER TABLE "documentos_cuidador" ADD CONSTRAINT "documentos_cuidador_cuidadorId_fkey" FOREIGN KEY ("cuidadorId") REFERENCES "cuidador_detalhes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enderecos" ADD CONSTRAINT "enderecos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enderecos" ADD CONSTRAINT "enderecos_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorios_atividade" ADD CONSTRAINT "relatorios_atividade_plantaoId_fkey" FOREIGN KEY ("plantaoId") REFERENCES "plantoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
