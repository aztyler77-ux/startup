export default function Play() {
  return (
    <>
      <h2 className="page-title">Play</h2>
      <p className="page-subtitle">Decision Builder (coming next phase).</p>

      <div className="cardish">
        <label htmlFor="decisionName">Decision name</label>
        <div style={{ marginTop: '.5rem' }}>
          <input id="decisionName" placeholder="e.g., New laptop vs. keep current" />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button>Create</button>
        </div>
      </div>
    </>
  );
}
