import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { AuthContext } from "../../contexts/AuthContext";

// Importação para o PDF
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import PageTitle from "../../components/ui/PageTitle";
import DetailCard from "../../components/ui/DetailCard";
import DetailSection from "../../components/ui/DetailSection";
import DetailGrid from "../../components/ui/DetailGrid";
import DetailItem from "../../components/ui/DetailItem";
import StatusBadge from "../../components/ui/StatusBadge";

import "../../styles/ui.css";

export default function Relatorios() {
  const [plantoes, setPlantoes] = useState([]);
  const [cuidadores, setCuidadores] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pacienteFiltro, setPacienteFiltro] = useState("");
  const [cuidadorFiltro, setCuidadorFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("PENDENTE");
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState(new Date().getFullYear().toString());

  const { usuario } = useContext(AuthContext);
  const isAdmin = usuario?.tipo === "ADMIN";

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [resCuidadores, resPacientes, resPlantoes] = await Promise.all([
        api.get("/cuidadores"),
        api.get("/pacientes"),
        api.get("/plantoes")
      ]);
      setCuidadores(resCuidadores.data || []);
      setPacientes(resPacientes.data || []);
      setPlantoes(resPlantoes.data || []);
    } catch (error) {
      toast.error("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (id, novoStatus) => {
    const mensagem = novoStatus === 'APROVADO' 
      ? "Ao aprovar, o faturamento será gerado automaticamente e o relatório liberado para o familiar. Confirmar?"
      : `Deseja rejeitar este plantão?`;

    if (!window.confirm(mensagem)) return;

    try {
      if (novoStatus === 'APROVADO') {
        // Chamada para a nova rota de automação que criamos
        await api.patch(`/plantoes/${id}/aprovar`);
        toast.success("Plantão aprovado e faturamento gerado!");
      } else {
        // Mantém a rota genérica para rejeição ou outros status
        await api.patch(`/plantoes/${id}/status`, { status: novoStatus });
        toast.success("Status atualizado com sucesso!");
      }
      carregarDados();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Erro ao atualizar status.");
    }
  };

  // Funções de Exportação
  const exportarCSV = () => {
    // Definimos as colunas
    const colunas = ["Paciente", "Cuidador", "Data", "Status", "Descricao", "Medicacoes", "PA", "Observacoes"];
    
    // Criamos o cabeçalho
    const cabecalho = colunas.join(";") + "\n";

    const linhas = filtrados.map(p => {
      const c = cuidadores.find(item => item.id === p.cuidadorId);
      
      // Função auxiliar para limpar textos que quebram o CSV (remove quebras de linha e pontos e vírgula)
      const limpar = (texto) => texto ? String(texto).replace(/[\n\r]+/g, ' ').replace(/;/g, ',') : "vazio";

      const dados = [
        limpar(p.paciente?.nome || "N/A"),
        limpar(p.cuidador?.user?.nome || c?.user?.nome || "N/A"),
        new Date(p.dataInicio).toLocaleDateString('pt-BR'),
        p.status,
        limpar(p.relatorioAtividade?.descricao),
        limpar(p.relatorioAtividade?.medicacoes),
        limpar(p.relatorioAtividade?.pressaoArterial),
        limpar(p.relatorioAtividade?.observacoes)
      ];

      return dados.join(";");
    }).join("\n");

    // \ufeff é o BOM (Byte Order Mark) para o Excel reconhecer acentos em UTF-8
    const blob = new Blob(["\ufeff" + cabecalho + linhas], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_carehub_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportarPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4'); // 'l' para paisagem (landscape) para caber mais colunas

    doc.setFontSize(18);
    doc.text("Relatório de Plantões - CareHub", 14, 20);
    
    const tableData = filtrados.map(p => {
      const c = cuidadores.find(item => item.id === p.cuidadorId);
      return [
        p.paciente?.nome || "N/A",
        p.cuidador?.user?.nome || c?.user?.nome || "N/A",
        new Date(p.dataInicio).toLocaleDateString('pt-BR'),
        p.status,
        p.relatorioAtividade?.descricao || "Sem desc.",
        p.relatorioAtividade?.medicacoes || "-",
        p.relatorioAtividade?.pressaoArterial || "-",
        p.relatorioAtividade?.observacoes
      ];
    });

    // Chamada correta do autoTable
    autoTable(doc, {
      head: [['Paciente', 'Cuidador', 'Data', 'Status', 'Descrição', 'Medicações', 'P.A.', 'Observações']],
      body: tableData,
      startY: 30,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [37, 99, 235] }, // Cor azul do seu ui.css
      alternateRowStyles: { fillColor: [241, 245, 249] },
    });

    doc.save(`relatorio_carehub_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const filtrados = plantoes.filter(p => {
    const matchPaciente = !pacienteFiltro || p.pacienteId === pacienteFiltro;
    const matchCuidador = !cuidadorFiltro || p.cuidadorId === cuidadorFiltro;
    const matchStatus = !statusFiltro || p.status === statusFiltro;
    return matchPaciente && matchCuidador && matchStatus;
  }).sort((a, b) => new Date(b.dataInicio) - new Date(a.dataInicio));

  return (
    <>
      <PageTitle title="Gestão e Relatórios" />

      <DetailCard className="detail-card">
        <DetailSection title="Filtros de Busca">
          <div className="filters-row">
            <select value={pacienteFiltro} onChange={(e) => setPacienteFiltro(e.target.value)}>
              <option value="">Todos Pacientes</option>
              {pacientes.map(pac => <option key={pac.id} value={pac.id}>{pac.nome}</option>)}
            </select>

            <select value={cuidadorFiltro} onChange={(e) => setCuidadorFiltro(e.target.value)}>
              <option value="">Todos Cuidadores</option>
              {cuidadores.map(c => (
                <option key={c.id} value={c.id}>{c.user?.nome || c.nome}</option>
              ))}
            </select>

            <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}>
              <option value="">Todos Status</option>
              <option value="PENDENTE">Pendentes</option>
              <option value="APROVADO">Aprovados</option>
              <option value="REJEITADO">Rejeitados</option>
            </select>
          </div>
        </DetailSection>

        <DetailSection 
          title={`Resultados (${filtrados.length})`}
          renderActions={() => (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-view" onClick={exportarCSV}>CSV</button>
              <button className="btn-view" onClick={exportarPDF} style={{ background: '#f59e0b' }}>PDF</button>
            </div>
          )}
        >
          {/* Header de Ações no topo da lista */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '20px' }}>
             <button className="btn-view" onClick={exportarCSV}>Exportar CSV</button>
             <button className="btn-view" onClick={exportarPDF} style={{ background: '#ef4444' }}>Gerar PDF</button>
          </div>

          {filtrados.map(p => {
            const isPendente = p.status === 'PENDENTE';
            const cuidadorInfo = cuidadores.find(c => c.id === p.cuidadorId);
            const nomeCuidador = p.cuidador?.user?.nome || cuidadorInfo?.user?.nome || "Cuidador";
            const nomePaciente = p.paciente?.nome || pacientes.find(pac => pac.id === p.pacienteId)?.nome || "Paciente";

            const formatarHora = (data) => new Date(data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            return (
              <div key={p.id} className="report-card" style={isPendente ? { borderLeft: '4px solid #f59e0b', background: 'rgba(245, 158, 11, 0.05)' } : {}}>
                <DetailGrid>
                  <DetailItem label="Paciente" value={nomePaciente} />
                  <DetailItem label="Cuidador" value={nomeCuidador} />
                  <DetailItem label="Data" value={new Date(p.dataInicio).toLocaleDateString('pt-BR')} />
                  <DetailItem label="Horário" value={`${formatarHora(p.dataInicio)} - ${formatarHora(p.dataFim)}`} />
                </DetailGrid>

                <div className="form-section" style={{ marginTop: '20px', padding: '15px', background: '#0f172a', borderRadius: '8px' }}>
                  <span className="detail-label" style={{ fontWeight: 'bold', color: '#94a3b8' }}>RELATÓRIO DE ATIVIDADES</span>
                  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <p className="detail-value"><strong>Descrição:</strong> {p.relatorioAtividade?.descricao || "Sem descrição."}</p>
                    <p className="detail-value"><strong>Medicações:</strong> {p.relatorioAtividade?.medicacoes || "vazio."}</p>
                    <p className="detail-value"><strong>Pressão Arterial:</strong> {p.relatorioAtividade?.pressaoArterial || "vazio."}</p>
                    <p className="detail-value"><strong>Observações:</strong> {p.relatorioAtividade?.observacoes || "vazio."}</p>
                  </div>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <StatusBadge status={p.status} />
                  {isAdmin && isPendente && (
                    <div className="form-actions">
                      <button className="btn-danger" onClick={() => atualizarStatus(p.id, "REJEITADO")}>Rejeitar</button>
                      <button className="btn-primary" onClick={() => atualizarStatus(p.id, "APROVADO")}>Aprovar Plantão</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </DetailSection>
      </DetailCard>
    </>
  );
}