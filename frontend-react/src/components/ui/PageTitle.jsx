export default function PageTitle({ title, children }) {
  return (
    <div className="page-title">
      <h1>{title}</h1>
      {children && <div className="page-title-actions">{children}</div>}
    </div>
  );
}