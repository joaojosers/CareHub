import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminHoras() {
  const [horas, setHoras] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("TODAS");
  const [mesSelecionado, setMesSelecionado] = useState("");
  const [anoSelecionado, setAnoSelecionado] = useState("");
  const [mesNumero, setMesNumero] = useState("");


  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [horasRes, usuariosRes, pacientesRes] = await Promise.all([
        api.get("/hours"),
        api.get("/users"),
        api.get("/patients")
      ]);

      setHoras(horasRes.data);
      setUsuarios(usuariosRes.data);
      setPacientes(pacientesRes.data);
    } catch (error) {
      console.error("Erro ao carregar horas");
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (id, novoStatus) => {
    await api.patch(`/hours/${id}`, { status: novoStatus });
    carregarDados();
  };

  const getCuidadorNome = (caregiverId) =>
    usuarios.find(u => u.id === caregiverId)?.name || "Desconhecido";

  const getPacienteNome = (patientId) =>
    pacientes.find(p => p.id === patientId)?.name || "Desconhecido";

  const horasFiltradas = horas.filter(h => {
    const statusOk =
      filtroStatus === "TODAS" || h.status === filtroStatus;

    let mesOk = true;

    if (anoSelecionado && mesNumero) {
      const dataHora = new Date(h.date);
      const ano = dataHora.getFullYear();
      const mes = dataHora.getMonth() + 1;

      mesOk = ano === Number(anoSelecionado) && mes === Number(mesNumero);
    }


    return statusOk && mesOk;
  });


  const totalAprovado = horasFiltradas
    .filter(h => h.status === "APROVADO")
    .reduce((acc, h) => acc + Number(h.totalHours), 0);

  const exportarCSV = () => {
    const linhas = [
      ["Cuidador", "Paciente", "Data", "Inicio", "Fim", "Total", "Status"]
    ];

    horasFiltradas.forEach(h => {
      linhas.push([
        getCuidadorNome(h.caregiverId),
        getPacienteNome(h.patientId),
        h.date,
        h.startTime,
        h.endTime,
        h.totalHours,
        h.status
      ]);
    });

  const csvContent =
    "data:text/csv;charset=utf-8," +
    linhas.map(e => e.join(",")).join("\n");

  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csvContent));
  link.setAttribute("download", "relatorio_horas.csv");
  document.body.appendChild(link);
  link.click();
};


  if (loading) {
    return (
      //<MainLayout>
        <div style={{ padding: 40 }}>Carregando...</div>
      //</MainLayout>
    );
  }

  return (
    //<MainLayout>
      <div style={styles.container}>
        <h2>Controle de Horas</h2>

        {/* Filtros */}
        <div style={{ marginBottom: 20 }}>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="TODAS">Todas</option>
            <option value="PENDENTE">Pendentes</option>
            <option value="APROVADO">Aprovadas</option>
            <option value="REJEITADO">Rejeitadas</option>
          </select>
          <select
            value={mesNumero}
            onChange={(e) => setMesNumero(e.target.value)}
            style={{ marginLeft: 10 }}
          >
            <option value="">Mês</option>
            <option value="1">Jan</option>
            <option value="2">Fev</option>
            <option value="3">Mar</option>
            <option value="4">Abr</option>
            <option value="5">Mai</option>
            <option value="6">Jun</option>
            <option value="7">Jul</option>
            <option value="8">Ago</option>
            <option value="9">Set</option>
            <option value="10">Out</option>
            <option value="11">Nov</option>
            <option value="12">Dez</option>
          </select>

          <select
            value={anoSelecionado}
            onChange={(e) => setAnoSelecionado(e.target.value)}
            style={{ marginLeft: 10 }}
          >
            <option value="">Ano</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>

          <button style={{ marginBottom: 20, marginLeft: 10}} onClick={exportarCSV}>
            Exportar CSV
          </button>

        </div>

        {/* Total */}
        <div style={{ marginBottom: 20, fontWeight: "bold" }}>
          Total de horas aprovadas: {totalAprovado}h
        </div>

        {/* Lista */}
        {horasFiltradas.length === 0 ? (
          <p>Nenhum lançamento encontrado</p>
        ) : (
          horasFiltradas.map((h) => (
            <div key={h.id} style={styles.card}>
              <div>
                <strong>Cuidador:</strong>{" "}
                {getCuidadorNome(h.caregiverId)}
              </div>

              <div>
                <strong>Paciente:</strong>{" "}
                {getPacienteNome(h.patientId)}
              </div>

              <div>
                <strong>Data:</strong> {h.date}
              </div>

              <div>
                {h.startTime} - {h.endTime}
              </div>

              <div>
                Total: {h.totalHours}h
              </div>

              <div>
                Status: <strong>{h.status}</strong>
              </div>

              {h.status === "PENDENTE" && (
                <div style={{ marginTop: 10 }}>
                  <button
                    style={styles.aprovar}
                    onClick={() =>
                      atualizarStatus(h.id, "APROVADO")
                    }
                  >
                    Aprovar
                  </button>

                  <button
                    style={styles.rejeitar}
                    onClick={() =>
                      atualizarStatus(h.id, "REJEITADO")
                    }
                  >
                    Rejeitar
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    //</MainLayout>
  );
}

const styles = {
  container: {
    padding: 30
  },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 8,
    marginBottom: 12,
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
  },
  aprovar: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    marginRight: 8,
    cursor: "pointer"
  },
  rejeitar: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer"
  }
};
