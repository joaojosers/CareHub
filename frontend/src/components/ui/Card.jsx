export default function Card({ children, className = "" }) {
  return (
    <div className={`detail-card ${className}`}>
      {children}
    </div>
  );
}
