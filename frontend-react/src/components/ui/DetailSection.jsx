export default function DetailSection({ title, children, renderActions }) {
  return (
    <div className="detail-section" style={{ marginBottom: '30px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: '1px solid #334155',
        paddingBottom: '10px',
        marginBottom: '15px'
      }}>
        <h3 style={{ margin: 0, fontSize: '16px', color: '#f8fafc' }}>{title}</h3>
        {renderActions && <div>{renderActions()}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}