-- CreateTable
CREATE TABLE "cuidador_paciente_vinculos" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "cuidadorId" TEXT NOT NULL,
    "valorHoraAcordado" DECIMAL(10,2) NOT NULL,
    "dataVinculo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cuidador_paciente_vinculos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cuidador_paciente_vinculos_pacienteId_cuidadorId_key" ON "cuidador_paciente_vinculos"("pacienteId", "cuidadorId");

-- AddForeignKey
ALTER TABLE "cuidador_paciente_vinculos" ADD CONSTRAINT "cuidador_paciente_vinculos_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuidador_paciente_vinculos" ADD CONSTRAINT "cuidador_paciente_vinculos_cuidadorId_fkey" FOREIGN KEY ("cuidadorId") REFERENCES "cuidador_detalhes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
