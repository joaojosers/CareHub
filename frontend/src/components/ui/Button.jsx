export default function Button({ children, onClick, type = "button" }) {
  return (
    <button onClick={onClick} type={type} style={styles.button}>
      {children}
    </button>
  );
}

const styles = {
  button: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
