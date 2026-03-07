import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-hot-toast";

import PageTitle from "../../components/ui/PageTitle";
import DetailCard from "../../components/ui/DetailCard";
import StatusBadge from "../../components/ui/StatusBadge";

export default function Cuidadores() {
  const navigate = useNavigate();
  const [cuidadores, setCuidadores] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");

  const initialForm = { nome: "", email: "", senha: "", cpf: "", telefone: "", valorHora: "" };
  const [form, setForm] = useState(initialForm);

  useEffect(() => { carregarCuidadores(); }, []);

  const carregarCuidadores = async () => {
    try {
      const response = await api.get("/users?tipo=CUIDADOR");
      setCuidadores(response.data);
    } catch (error) {
      toast.error("Erro ao carregar cuidadores");
    }
  };

  const atualizarStatus = async (id, novoStatus) => {
    try {
      await api.patch(`/users/${id}/status`, { status: novoStatus });
      toast.success(`Status atualizado!`);
      carregarCuidadores();
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  };

  const cuidadoresFiltrados = cuidadores
    .filter((c) => {
      const matchNome = c.nome.toLowerCase().includes(filtroNome.toLowerCase());
      const matchStatus = !filtroStatus || c.status === filtroStatus;
      return matchNome && matchStatus;
    })
    .sort((a, b) => a.nome.localeCompare(b.nome));

  return (
    <>
      <div className="page-title">
        <h1>Cuidadores</h1>
      </div>

      {mostrarForm ? (
        <DetailCard>
          {/* ... formulário (mantido igual ao anterior) ... */}
        </DetailCard>
      ) : (
        <>
          {/* BARRA DE FILTROS REFINADA */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            marginBottom: '25px', 
            maxWidth: '600px' // Limita a largura total da busca
          }}>
            <input 
              type="text" 
              placeholder="🔍 Buscar por nome..." 
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
              style={{ flex: '2' }} 
            />
            <select 
              value={filtroStatus} 
              onChange={(e) => setFiltroStatus(e.target.value)}
              style={{ flex: '1', minWidth: '160px' }}
            >
              <option value="">Todos os Status</option>
              <option value="APROVADO">Aprovados</option>
              <option value="PENDENTE">Pendentes</option>
              <option value="REJEITADO">Rejeitados</option>
            </select>
          </div>

          <div className="patients-list">
            {cuidadoresFiltrados.length === 0 ? (
              <div className="empty-state">Nenhum cuidador encontrado.</div>
            ) : (
              cuidadoresFiltrados.map((c) => (
                <div key={c.id} className="patient-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="patient-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '16px' }}>{c.nome}</strong>
                      <StatusBadge status={c.status} />
                    </div>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>
                      {c.email} | {c.telefone || "Sem telefone"}
                    </span>
                  </div>

                  {/* AÇÕES: Onde os botões de aprovação aparecem */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {c.status === "PENDENTE" && (
                      <div style={{ display: 'flex', gap: '8px', marginRight: '8px', borderRight: '1px solid #334155', paddingRight: '12px' }}>
                        
                      </div>
                    )}
                    
                    <button 
                      className="btn-secondary" 
                      onClick={() => navigate(`/admin/cuidadores/${c.id}`)}
                      style={{ padding: '6px 12px', fontSize: '13px' }}
                    >
                      Ver Perfil
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </>
  );
}