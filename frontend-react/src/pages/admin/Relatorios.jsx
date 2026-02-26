import { useEffect, useState } from "react";
import api from "../../services/api";

import PageTitle from "../../components/ui/PageTitle";
import DetailCard from "../../components/ui/DetailCard";
import DetailSection from "../../components/ui/DetailSection";
import DetailGrid from "../../components/ui/DetailGrid";
import DetailItem from "../../components/ui/DetailItem";
import StatusBadge from "../../components/ui/StatusBadge";

export default function Relatorios() {
  const [horas, setHoras] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [pacientes, setPacientes] = useState([]);

  const [pacienteFiltro, setPacienteFiltro] = useState("");
  const [cuidadorFiltro, setCuidadorFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");

  const anoAtual = new Date().getFullYear();
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState(anoAtual.toString());

  const mesFiltro = mes ? `${ano}-${mes}` : "";

  // 🔹 Verifica se usuário logado é ADMIN
  const usuarioLogado = JSON.parse(localStorage.getItem("user"));
  const isAdmin = usuarioLogado?.role === "ADMIN";

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [h, u, p] = await Promise.all([
        api.get("/hours"),
        api.get("/users"),
        api.get("/patients")
      ]);

      setHoras(h.data);
      setUsuarios(u.data);
      setPacientes(p.data);
    } catch (error) {
      console.error("Erro ao carregar relatórios");
    }
  };

  // 🔹 Atualiza status (Aprovar / Rejeitar)
  const atualizarStatus = async (id, novoStatus) => {
    try {
      await api.patch(`/hours/${id}`, {
        status: novoStatus
      });

      carregarDados(); // recarrega lista
    } catch (error) {
      console.error("Erro ao atualizar status");
      alert("Erro ao atualizar status do relatório");
    }
  };

  const getCuidadorNome = (id) =>
    usuarios.find(u => u.id === id)?.name || "Desconhecido";

  const getPacienteNome = (id) =>
    pacientes.find(p => p.id === id)?.name || "Desconhecido";

  const relatoriosFiltrados = horas
    .filter(h => {
      const pacienteOk = !pacienteFiltro || h.patientId === pacienteFiltro;
      const cuidadorOk = !cuidadorFiltro || h.caregiverId === cuidadorFiltro;
      const statusOk = !statusFiltro || h.status === statusFiltro;

      let mesOk = true;
      if (mesFiltro) {
        const d = new Date(h.date);
        const anoMes =
          d.getFullYear() +
          "-" +
          String(d.getMonth() + 1).padStart(2, "0");

        mesOk = anoMes === mesFiltro;
      }

      return pacienteOk && cuidadorOk && statusOk && mesOk;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <>
      <PageTitle title="Relatórios de Atendimento" />

      <DetailCard>

        {/* FILTROS */}
        <DetailSection title="Filtros">
          <div className="filters-row">

            <select
              value={pacienteFiltro}
              onChange={(e) => setPacienteFiltro(e.target.value)}
            >
              <option value="">Todos Pacientes</option>
              {pacientes.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              value={cuidadorFiltro}
              onChange={(e) => setCuidadorFiltro(e.target.value)}
            >
              <option value="">Todos Cuidadores</option>
              {usuarios
                .filter(u => u.role === "CUIDADOR")
                .map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
            </select>

            <select
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
            >
              <option value="">Todos Status</option>
              <option value="PENDENTE">Pendente</option>
              <option value="APROVADO">Aprovado</option>
              <option value="REJEITADO">Rejeitado</option>
            </select>

            <select value={mes} onChange={(e) => setMes(e.target.value)}>
              <option value="">Todos Meses</option>
              <option value="01">Janeiro</option>
              <option value="02">Fevereiro</option>
              <option value="03">Março</option>
              <option value="04">Abril</option>
              <option value="05">Maio</option>
              <option value="06">Junho</option>
              <option value="07">Julho</option>
              <option value="08">Agosto</option>
              <option value="09">Setembro</option>
              <option value="10">Outubro</option>
              <option value="11">Novembro</option>
              <option value="12">Dezembro</option>
            </select>

            <select value={ano} onChange={(e) => setAno(e.target.value)}>
              <option value="">Todos Anos</option>
              <option value={anoAtual}>{anoAtual}</option>
              <option value={anoAtual - 1}>{anoAtual - 1}</option>
              <option value={anoAtual - 2}>{anoAtual - 2}</option>
            </select>

          </div>
        </DetailSection>

        {/* EXPORTAÇÃO */}
        <DetailSection title="Exportação">
          <div className="export-buttons">
            <button onClick={() => exportarCSV(relatoriosFiltrados)}>
              Exportar CSV
            </button>

            <button onClick={() => exportarPDF(relatoriosFiltrados)}>
              Exportar PDF
            </button>
          </div>
        </DetailSection>

        {/* LISTAGEM */}
        <DetailSection title="Lista de Relatórios">
          {relatoriosFiltrados.length === 0 ? (
            <p>Nenhum relatório encontrado</p>
          ) : (
            relatoriosFiltrados.map(h => (
              <div key={h.id} className="report-card">

                <DetailGrid>
                  <DetailItem label="Paciente" value={getPacienteNome(h.patientId)} />
                  <DetailItem label="Cuidador" value={getCuidadorNome(h.caregiverId)} />
                  <DetailItem label="Data" value={h.date} />
                  <DetailItem label="Horário" value={`${h.startTime} - ${h.endTime}`} />
                  <DetailItem label="Total" value={`${h.totalHours}h`} />
                  <DetailItem label="Descrição" value={h.report?.descricao} />
                </DetailGrid>

               <div
                  style={{
                    marginTop: 12,
                    display: "flex",
                    gap: 8,
                    alignItems: "center"
                  }}
                >
                  <StatusBadge status={h.status} />

                  {isAdmin && h.status === "PENDENTE" && (
                    <>
                      <button
                        onClick={() => atualizarStatus(h.id, "APROVADO")}
                        className="action-badge action-aprovar"
                      >
                        Aprovar
                      </button>

                      <button
                        onClick={() => atualizarStatus(h.id, "REJEITADO")}
                        className="action-badge action-rejeitar"
                      >
                        Rejeitar
                      </button>
                    </>
                  )}
                </div>

            </div>
            ))
          )}
        </DetailSection>

      </DetailCard>
    </>
  );
}

/* =============================
   FUNÇÕES EXPORTAÇÃO
============================= */

function exportarCSV(relatorios) {
  if (relatorios.length === 0) {
    alert("Nenhum relatório para exportar");
    return;
  }

  const linhas = [
    ["Paciente", "Cuidador", "Data", "Inicio", "Fim", "Total Horas", "Descricao", "Status"]
  ];

  relatorios.forEach(h => {
    linhas.push([
      h.patientId,
      h.caregiverId,
      h.date,
      h.startTime,
      h.endTime,
      h.totalHours,
      h.report?.descricao || "",
      h.status
    ]);
  });

  const csvContent =
    "data:text/csv;charset=utf-8," +
    linhas.map(e => e.join(";")).join("\n");

  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csvContent));
  link.setAttribute("download", "relatorio_atendimentos.csv");
  document.body.appendChild(link);
  link.click();
}

function exportarPDF(relatorios) {
  if (relatorios.length === 0) {
    alert("Nenhum relatório para exportar");
    return;
  }

  const janela = window.open("", "_blank");
  janela.document.write("<h2>Relatório de Atendimentos</h2>");
  janela.document.write("<hr/>");

  relatorios.forEach(h => {
    janela.document.write(`<p><strong>Data:</strong> ${h.date}</p>`);
    janela.document.write(`<p><strong>Total:</strong> ${h.totalHours}h</p>`);
    janela.document.write("<hr/>");
  });

  janela.document.close();
  janela.print();
}