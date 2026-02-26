import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

import PageTitle from "../../components/ui/PageTitle";
import DetailCard from "../../components/ui/DetailCard";
import DetailSection from "../../components/ui/DetailSection";
import DetailGrid from "../../components/ui/DetailGrid";
import DetailItem from "../../components/ui/DetailItem";
import StatusBadge from "../../components/ui/StatusBadge";

export default function DetalheCuidador() {
  const { id } = useParams();

  const [cuidador, setCuidador] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const response = await api.get(`/users/${id}`);
      setCuidador(response.data);
    } catch (err) {
      console.error("Erro ao carregar cuidador", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Carregando...</div>;
  if (!cuidador) return <div style={{ padding: 40 }}>Cuidador não encontrado</div>;

  return (
    <>
      <PageTitle title="Detalhes do Cuidador">
        <StatusBadge status={cuidador.status} />
      </PageTitle>

      <DetailCard>

        <DetailSection title="Dados Pessoais">
          <DetailGrid>
            <DetailItem label="Nome completo" value={cuidador.name} />
            <DetailItem label="CPF" value={cuidador.cpf} />
            <DetailItem label="Data de nascimento" value={cuidador.birthDate} />
            <DetailItem label="Telefone" value={cuidador.phone} />
            <DetailItem label="Email" value={cuidador.email} />
          </DetailGrid>
        </DetailSection>

        <DetailSection title="Endereço">
          <DetailGrid>
            <DetailItem label="Rua" value={cuidador.address?.street} />
            <DetailItem label="Número" value={cuidador.address?.number} />
            <DetailItem label="Cidade" value={cuidador.address?.city} />
            <DetailItem label="Estado" value={cuidador.address?.state} />
            <DetailItem label="CEP" value={cuidador.address?.zip} />
          </DetailGrid>
        </DetailSection>

      </DetailCard>
    </>
  );
}