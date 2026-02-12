export default function About() {
  return (
    <>
      <h2 className="page-title">About</h2>
      <p className="page-subtitle">What this app is trying to do.</p>

      <div className="cardish">
        <p style={{ marginTop: 0, color: 'var(--muted)' }}>
          Decision Helper is a simple tool to help you compare options using criteria that actually matter to you.
          Later phases will add real data entry, persistence, and a better scoring flow.
        </p>
      </div>
    </>
  );
}
