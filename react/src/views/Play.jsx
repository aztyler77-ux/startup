import { useMemo, useState } from 'react';

export default function Play() {
  const [decisionName, setDecisionName] = useState('');
  const [optionText, setOptionText] = useState('');
  const [options, setOptions] = useState([]);

  const canAdd = optionText.trim().length > 0;

  const summary = useMemo(() => {
    const name = decisionName.trim() || 'Untitled decision';
    return `${name} • ${options.length} option${options.length === 1 ? '' : 's'}`;
  }, [decisionName, options.length]);

  function addOption(e) {
    e.preventDefault();
    const val = optionText.trim();
    if (!val) return;
    setOptions((prev) => [...prev, { id: crypto.randomUUID(), label: val }]);
    setOptionText('');
  }

  function removeOption(id) {
    setOptions((prev) => prev.filter((o) => o.id !== id));
  }

  return (
    <>
      <h2 className="page-title">Build a Decision</h2>
      <p className="page-subtitle">
        A light interactive mock (no database yet). Enough to prove the UI flow is real.
      </p>

      <div className="cardish" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'end' }}>
          <div style={{ flex: '1 1 320px' }}>
            <label htmlFor="decisionName">Decision name</label>
            <div style={{ marginTop: '.5rem' }}>
              <input
                id="decisionName"
                value={decisionName}
                onChange={(e) => setDecisionName(e.target.value)}
                placeholder="e.g., New laptop vs. keep current"
              />
            </div>
          </div>

          <div style={{ flex: '1 1 320px' }}>
            <label htmlFor="optionText">Add an option</label>
            <form onSubmit={addOption} style={{ marginTop: '.5rem', display: 'flex', gap: '.5rem' }}>
              <input
                id="optionText"
                value={optionText}
                onChange={(e) => setOptionText(e.target.value)}
                placeholder="e.g., Buy MacBook Air"
              />
              <button type="submit" disabled={!canAdd} style={{ opacity: canAdd ? 1 : 0.6 }}>
                Add
              </button>
            </form>
          </div>
        </div>

        <p style={{ marginTop: '1rem', color: 'var(--muted)' }}>
          <strong>Preview:</strong> {summary}
        </p>
      </div>

      <div className="cardish">
        <h3 style={{ marginTop: 0 }}>Options</h3>

        {options.length === 0 ? (
          <p style={{ marginBottom: 0, color: 'var(--muted)' }}>
            No options yet. Add a couple above.
          </p>
        ) : (
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--muted)' }}>
            {options.map((o) => (
              <li key={o.id} style={{ marginBottom: '.5rem' }}>
                <span style={{ color: 'var(--text)' }}>{o.label}</span>{' '}
                <button type="button" onClick={() => removeOption(o.id)} style={{ marginLeft: '.5rem' }}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
