import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

import PageTitle from "../../components/ui/PageTitle";
import DetailCard from "../../components/ui/DetailCard";
import DetailSection from "../../components/ui/DetailSection";
import DetailGrid from "../../components/ui/DetailGrid";
import DetailItem from "../../components/ui/DetailItem";
import StatusBadge from "../../components/ui/StatusBadge";

export default function DetalhePaciente() {
  const { id } = useParams();

  const [paciente, setPaciente] = useState(null);
  const [familiar, setFamiliar] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const getCuidadorNome = (caregiverId) => {
    const user = usuarios.find((u) => u.id === caregiverId);
    return user ? user.name : "Desconhecido";
  };

  const carregarDados = async () => {
    try {
      const [
        pacienteRes,
        familiarRes,
        historicoRes,
        usuariosRes
      ] = await Promise.all([
        api.get(`/patients/${id}`),
        api.get("/users", { params: { role: "FAMILIAR", patientId: id } }),
        api.get("/hours", { params: { patientId: id } }),
        api.get("/users")
      ]);

      setPaciente(pacienteRes.data);
      setFamiliar(familiarRes.data[0] || null);
      setHistorico(historicoRes.data);
      setUsuarios(usuariosRes.data);

    } catch (err) {
      console.error("Erro ao carregar paciente", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Carregando...</div>;
  if (!paciente) return <div style={{ padding: 40 }}>Paciente não encontrado</div>;

  return (
    <>
      <PageTitle title="Detalhes do Paciente" />

      <DetailCard>

        <DetailSection title="Dados do Paciente">
          <DetailGrid>
            <DetailItem label="Nome" value={paciente.name} />
            <DetailItem label="Data de nascimento" value={paciente.birthDate} />
            <DetailItem label="Observações" value={paciente.notes} />
          </DetailGrid>
        </DetailSection>

        <DetailSection title="Endereço">
          <DetailGrid>
            <DetailItem label="Rua" value={paciente.address?.street} />
            <DetailItem label="Número" value={paciente.address?.number} />
            <DetailItem label="Cidade" value={paciente.address?.city} />
            <DetailItem label="Estado" value={paciente.address?.state} />
            <DetailItem label="CEP" value={paciente.address?.zip} />
          </DetailGrid>
        </DetailSection>

        <DetailSection title="Responsável">
          {familiar ? (
            <DetailGrid>
              <DetailItem label="Nome" value={familiar.name} />
              <DetailItem label="Email" value={familiar.email} />
              <DetailItem label="Telefone" value={familiar.phone} />
            </DetailGrid>
          ) : (
            <p>Nenhum familiar vinculado</p>
          )}
        </DetailSection>

      {/*  <DetailSection title="Histórico de Relatórios">
          {historico.length === 0 ? (
            <p>Nenhum relatório encontrado</p>
          ) : (
            historico.map((h) => (
              <div key={h.id} style={{ marginBottom: 16 }}>
                <strong>{h.date}</strong> — {getCuidadorNome(h.caregiverId)}
                <br />
                {h.startTime} - {h.endTime} ({h.totalHours}h)
                <br />
                <StatusBadge status={h.status} />
              </div>
            ))
          )}
        </DetailSection>
      */}
      </DetailCard>
    </>
  );
}