export default function StatusBadge({ status }) {
  const colors = {
    APROVADO: "#16a34a",
    PENDENTE: "#f59e0b",
    REJEITADO: "#dc2626",
    ATIVO: "#2563eb",
    INATIVO: "#6b7280"
  };

  return (
    <span
      style={{
        background: colors[status] || "#6b7280",
        color: "#fff",
        padding: "4px 12px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 500
      }}
    >
      {status}
    </span>
  );
}