import { useEffect, useMemo, useState } from "react";

const HISTORY_KEY = "decisionHelper.history";
const DRAFT_KEY = "decisionHelper.playDraft";

function safeReadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function safeWriteJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage failures for P2 mock behavior
  }
}

function makeId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

function makeOption(name = "") {
  return {
    id: makeId(),
    name,
    score: 5,
  };
}

function makeCriterion(name = "") {
  return {
    id: makeId(),
    name,
    weight: 1,
  };
}

export default function Play() {
  const initialDraft = useMemo(() => {
    const raw = safeReadJson(DRAFT_KEY, null);

    // Backward-compatible draft shape
    const base = raw && typeof raw === "object" ? raw : null;

    const decisionTitle = base?.decisionTitle ?? "";
    const options =
      Array.isArray(base?.options) && base.options.length >= 2
        ? base.options.map((opt) => ({
            id: opt.id || makeId(),
            name: opt.name || "",
            score: Number.isFinite(Number(opt.score)) ? Number(opt.score) : 5,
          }))
        : [makeOption("Option A"), makeOption("Option B")];

    const criteria =
      Array.isArray(base?.criteria) && base.criteria.length >= 1
        ? base.criteria.map((c) => ({
            id: c.id || makeId(),
            name: String(c.name || "").trim() || "Criterion",
            weight: Number.isFinite(Number(c.weight)) ? Number(c.weight) : 1,
          }))
        : [makeCriterion("Overall")];

    return { decisionTitle, options, criteria };
  }, []);

  const [decisionTitle, setDecisionTitle] = useState(initialDraft.decisionTitle || "");
  const [criteria, setCriteria] = useState(initialDraft.criteria);
  const [options, setOptions] = useState(initialDraft.options);

  const [newCriterionName, setNewCriterionName] = useState("");
  const [newOptionName, setNewOptionName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState(null);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    safeWriteJson(DRAFT_KEY, { decisionTitle, criteria, options });
  }, [decisionTitle, criteria, options]);

  // Clear stale recommendation when inputs change
  useEffect(() => {
    setResult(null);
    setSaveMsg("");
  }, [decisionTitle, criteria, options]);

  function addCriterion() {
    const cleaned = newCriterionName.trim();
    if (!cleaned) {
      setErrorMsg("Enter a name before adding a criterion.");
      return;
    }
    setCriteria((prev) => [...prev, makeCriterion(cleaned)]);
    setNewCriterionName("");
    setErrorMsg("");
  }

  function updateCriterion(id, patch) {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function removeCriterion(id) {
    setCriteria((prev) => {
      if (prev.length <= 1) {
        setErrorMsg("Keep at least one criterion.");
        return prev;
      }
      return prev.filter((c) => c.id !== id);
    });
  }

  function addOption() {
    const cleaned = newOptionName.trim();
    if (!cleaned) {
      setErrorMsg("Enter a name before adding an option.");
      return;
    }

    setOptions((prev) => [...prev, makeOption(cleaned)]);
    setNewOptionName("");
    setErrorMsg("");
  }

  function removeOption(id) {
    setOptions((prev) => {
      if (prev.length <= 2) {
        setErrorMsg("Keep at least two options so the app can compare them.");
        return prev;
      }
      return prev.filter((opt) => opt.id !== id);
    });
  }

  function updateOption(id, patch) {
    setOptions((prev) => prev.map((opt) => (opt.id === id ? { ...opt, ...patch } : opt)));
  }

  function calculateRecommendation() {
    setSaveMsg("");
    setErrorMsg("");

    const normalizedCriteria = criteria.map((c) => ({
      ...c,
      name: String(c.name || "").trim(),
      weight: Number(c.weight),
    }));

    const normalizedOptions = options.map((opt) => ({
      ...opt,
      name: String(opt.name || "").trim(),
      score: Number(opt.score),
    }));

    if (!decisionTitle.trim()) {
      setErrorMsg("Add a decision title first.");
      return;
    }

    if (normalizedCriteria.length < 1) {
      setErrorMsg("Add at least one criterion.");
      return;
    }

    if (normalizedCriteria.some((c) => !c.name)) {
      setErrorMsg("Every criterion needs a name.");
      return;
    }

    if (normalizedCriteria.some((c) => Number.isNaN(c.weight) || c.weight < 0)) {
      setErrorMsg("Criterion weights must be 0 or greater.");
      return;
    }

    if (normalizedOptions.length < 2) {
      setErrorMsg("Add at least two options.");
      return;
    }

    if (normalizedOptions.some((opt) => !opt.name)) {
      setErrorMsg("Every option needs a name.");
      return;
    }

    if (normalizedOptions.some((opt) => Number.isNaN(opt.score) || opt.score < 1 || opt.score > 10)) {
      setErrorMsg("Scores must be numbers from 1 to 10.");
      return;
    }

    // NOTE: For now this uses the single option score.
    // Next commit will switch to option-by-criterion scoring.
    const ranked = [...normalizedOptions].sort((a, b) => b.score - a.score);
    const winner = ranked[0];
    const runnerUp = ranked[1];
    const margin = runnerUp ? winner.score - runnerUp.score : winner.score;

    const nextResult = {
      title: decisionTitle.trim(),
      ranked,
      winner,
      runnerUp,
      margin,
      calculatedAt: new Date().toISOString(),
    };

    setResult(nextResult);

    const historyRecord = {
      id: makeId(),
      title: nextResult.title,
      winner: winner.name,
      winnerScore: winner.score,
      options: ranked.map((opt) => ({ name: opt.name, score: opt.score })),
      createdAt: nextResult.calculatedAt,
      summary: `${winner.name} won by ${margin} point${margin === 1 ? "" : "s"}.`,
    };

    const existingHistory = safeReadJson(HISTORY_KEY, []);
    const nextHistory = [historyRecord, ...existingHistory].slice(0, 50);
    safeWriteJson(HISTORY_KEY, nextHistory);

    setSaveMsg("Saved to local decision history (mock DB for P2).");
  }

  function resetBuilder() {
    setDecisionTitle("");
    setCriteria([makeCriterion("Overall")]);
    setOptions([makeOption("Option A"), makeOption("Option B")]);
    setNewCriterionName("");
    setNewOptionName("");
    setErrorMsg("");
    setResult(null);
    setSaveMsg("");
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
  }

  return (
    <>
      <h2 className="page-title">Decision Builder</h2>
      <p className="page-subtitle">
        P2 interactive mock: build a decision, define criteria, score options, get a recommendation, and save results locally.
      </p>

      <div className="cardish" style={{ marginBottom: "1rem" }}>
        <h3 style={{ marginTop: 0 }}>1) Name the decision</h3>
        <label htmlFor="decision-title" style={{ display: "block", marginBottom: ".35rem" }}>
          Decision title
        </label>
        <input
          id="decision-title"
          type="text"
          placeholder="Example: Which apartment should I choose?"
          value={decisionTitle}
          onChange={(e) => setDecisionTitle(e.target.value)}
        />
      </div>

      <div className="cardish" style={{ marginBottom: "1rem" }}>
        <h3 style={{ marginTop: 0 }}>2) Add criteria (what matters)</h3>

        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Add a criterion (e.g., Cost)"
            value={newCriterionName}
            onChange={(e) => setNewCriterionName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCriterion();
              }
            }}
            style={{ flex: "1 1 260px" }}
          />
          <button type="button" onClick={addCriterion}>
            Add criterion
          </button>
        </div>

        <div style={{ display: "grid", gap: ".75rem" }}>
          {criteria.map((c, index) => (
            <div
              key={c.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr .75fr auto",
                gap: ".75rem",
                alignItems: "end",
                padding: ".75rem",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,.08)",
                background: "rgba(255,255,255,.03)",
              }}
            >
              <div>
                <label htmlFor={`crit-name-${c.id}`} style={{ display: "block", marginBottom: ".35rem" }}>
                  Criterion {index + 1} name
                </label>
                <input
                  id={`crit-name-${c.id}`}
                  type="text"
                  value={c.name}
                  onChange={(e) => updateCriterion(c.id, { name: e.target.value })}
                  placeholder={`Criterion ${index + 1}`}
                />
              </div>

              <div>
                <label htmlFor={`crit-weight-${c.id}`} style={{ display: "block", marginBottom: ".35rem" }}>
                  Weight
                </label>
                <input
                  id={`crit-weight-${c.id}`}
                  type="number"
                  min="0"
                  step="1"
                  value={c.weight}
                  onChange={(e) => updateCriterion(c.id, { weight: e.target.value })}
                />
              </div>

              <button
                type="button"
                className="btn btn-outline-light"
                onClick={() => removeCriterion(c.id)}
                style={{ minWidth: "110px" }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="cardish" style={{ marginBottom: "1rem" }}>
        <h3 style={{ marginTop: 0 }}>3) Add options</h3>

        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Add an option (e.g., Apt A)"
            value={newOptionName}
            onChange={(e) => setNewOptionName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addOption();
              }
            }}
            style={{ flex: "1 1 260px" }}
          />
          <button type="button" onClick={addOption}>
            Add option
          </button>
        </div>

        <div style={{ display: "grid", gap: ".75rem" }}>
          {options.map((opt, index) => (
            <div
              key={opt.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr .75fr auto",
                gap: ".75rem",
                alignItems: "end",
                padding: ".75rem",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,.08)",
                background: "rgba(255,255,255,.03)",
              }}
            >
              <div>
                <label htmlFor={`opt-name-${opt.id}`} style={{ display: "block", marginBottom: ".35rem" }}>
                  Option {index + 1} name
                </label>
                <input
                  id={`opt-name-${opt.id}`}
                  type="text"
                  value={opt.name}
                  onChange={(e) => updateOption(opt.id, { name: e.target.value })}
                  placeholder={`Option ${index + 1}`}
                />
              </div>

              <div>
                <label htmlFor={`opt-score-${opt.id}`} style={{ display: "block", marginBottom: ".35rem" }}>
                  Score (1–10)
                </label>
                <input
                  id={`opt-score-${opt.id}`}
                  type="number"
                  min="1"
                  max="10"
                  step="1"
                  value={opt.score}
                  onChange={(e) => updateOption(opt.id, { score: e.target.value })}
                />
              </div>

              <button
                type="button"
                className="btn btn-outline-light"
                onClick={() => removeOption(opt.id)}
                style={{ minWidth: "110px" }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="cardish" style={{ marginBottom: "1rem" }}>
        <h3 style={{ marginTop: 0 }}>4) Calculate recommendation</h3>

        {errorMsg ? (
          <div role="alert" style={{ color: "#ffb4b4", marginBottom: ".75rem" }}>
            {errorMsg}
          </div>
        ) : null}

        {saveMsg ? <div style={{ color: "#b7ffb7", marginBottom: ".75rem" }}>{saveMsg}</div> : null}

        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
          <button type="button" onClick={calculateRecommendation}>
            Calculate winner
          </button>
          <button type="button" className="btn btn-outline-light" onClick={resetBuilder}>
            Reset builder
          </button>
        </div>
      </div>

      {result ? (
        <div className="cardish">
          <h3 style={{ marginTop: 0 }}>Recommendation</h3>
          <p style={{ marginBottom: ".5rem" }}>
            For <strong>{result.title}</strong>, the top option is <strong>{result.winner.name}</strong> with a score of{" "}
            <strong>{result.winner.score}</strong>.
          </p>

          <p style={{ color: "var(--muted)" }}>
            {result.runnerUp
              ? `${result.winner.name} beats ${result.runnerUp.name} by ${result.margin} point${result.margin === 1 ? "" : "s"}.`
              : "Only one option was available."}
          </p>

          <div style={{ overflowX: "auto" }}>
            <table className="table table-dark table-striped align-middle" style={{ marginBottom: 0 }}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Option</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {result.ranked.map((opt, index) => (
                  <tr key={opt.id}>
                    <td>{index + 1}</td>
                    <td>{opt.name}</td>
                    <td>{opt.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </>
  );
}
