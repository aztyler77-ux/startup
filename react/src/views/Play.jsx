import { useEffect, useMemo, useState } from "react";

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
    // ignore storage failures for now
  }
}

function makeId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

function makeOption(name = "") {
  return { id: makeId(), name };
}

function makeCriterion(name = "") {
  return { id: makeId(), name, weight: 1 };
}

function clampScore(n) {
  const num = Number(n);
  if (Number.isNaN(num)) return 0;
  return Math.max(0, Math.min(10, num));
}

function normalizeName(value) {
  return String(value || "").trim().toLowerCase();
}

export default function Play({ onAuthInvalid }) {
  const initialDraft = useMemo(() => {
    const raw = safeReadJson(DRAFT_KEY, null);
    const base = raw && typeof raw === "object" ? raw : null;

    const decisionTitle = base?.decisionTitle ?? "";

    const options =
      Array.isArray(base?.options) && base.options.length >= 2
        ? base.options.map((opt, idx) => ({
            id: opt.id || makeId(),
            name: String(opt.name || "").trim() || `Option ${idx + 1}`,
          }))
        : [makeOption("Option A"), makeOption("Option B")];

    const criteria =
      Array.isArray(base?.criteria) && base.criteria.length >= 1
        ? base.criteria.map((c, idx) => ({
            id: c.id || makeId(),
            name: String(c.name || "").trim() || `Criterion ${idx + 1}`,
            weight: Number.isFinite(Number(c.weight)) ? Number(c.weight) : 1,
          }))
        : [makeCriterion("Cost"), makeCriterion("Benefit")];

    let scores = {};
    if (base?.scores && typeof base.scores === "object") {
      scores = base.scores;
    } else {
      const firstCrit = criteria[0];
      for (const opt of options) {
        const legacy = base?.options?.find?.((o) => o?.id === opt.id)?.score;
        const v = clampScore(legacy ?? 5);
        scores[opt.id] = { [firstCrit.id]: v };
      }
    }

    const normalizedScores = {};
    for (const opt of options) {
      normalizedScores[opt.id] = {};
      for (const c of criteria) {
        const existing = scores?.[opt.id]?.[c.id];
        normalizedScores[opt.id][c.id] = clampScore(existing ?? 5);
      }
    }

    return { decisionTitle, options, criteria, scores: normalizedScores };
  }, []);

  const [decisionTitle, setDecisionTitle] = useState(initialDraft.decisionTitle || "");
  const [criteria, setCriteria] = useState(initialDraft.criteria);
  const [options, setOptions] = useState(initialDraft.options);
  const [scores, setScores] = useState(initialDraft.scores);

  const [newCriterionName, setNewCriterionName] = useState("");
  const [newOptionName, setNewOptionName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState(null);
  const [saveMsg, setSaveMsg] = useState("");
  const [suggestionMsg, setSuggestionMsg] = useState("");
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [suggestedCriteria, setSuggestedCriteria] = useState([]);
  const [suggestedOptions, setSuggestedOptions] = useState([]);

  useEffect(() => {
    safeWriteJson(DRAFT_KEY, { decisionTitle, criteria, options, scores });
  }, [decisionTitle, criteria, options, scores]);

  useEffect(() => {
    setResult(null);
    setSaveMsg("");
  }, [decisionTitle, criteria, options, scores]);

  const totals = useMemo(() => {
    const map = {};
    for (const opt of options) {
      let total = 0;
      for (const c of criteria) {
        const w = Number(c.weight);
        const weight = Number.isFinite(w) ? w : 1;
        const v = clampScore(scores?.[opt.id]?.[c.id] ?? 0);
        total += weight * v;
      }
      map[opt.id] = total;
    }
    return map;
  }, [options, criteria, scores]);

  const ranking = useMemo(() => {
    return [...options]
      .map((o) => ({ ...o, total: totals[o.id] ?? 0 }))
      .sort((a, b) => b.total - a.total);
  }, [options, totals]);

  function addCriterion() {
    const cleaned = newCriterionName.trim();
    if (!cleaned) {
      setErrorMsg("Enter a name before adding a criterion.");
      return;
    }

    const newC = makeCriterion(cleaned);
    setCriteria((prev) => [...prev, newC]);

    setScores((prev) => {
      const next = { ...(prev || {}) };
      for (const opt of options) {
        next[opt.id] = { ...(next[opt.id] || {}), [newC.id]: 5 };
      }
      return next;
    });

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

    setScores((prev) => {
      const next = { ...(prev || {}) };
      for (const optId of Object.keys(next)) {
        const row = { ...(next[optId] || {}) };
        delete row[id];
        next[optId] = row;
      }
      return next;
    });
  }

  function addOption() {
    const cleaned = newOptionName.trim();
    if (!cleaned) {
      setErrorMsg("Enter a name before adding an option.");
      return;
    }

    const newO = makeOption(cleaned);
    setOptions((prev) => [...prev, newO]);

    setScores((prev) => {
      const next = { ...(prev || {}) };
      next[newO.id] = {};
      for (const c of criteria) {
        next[newO.id][c.id] = 5;
      }
      return next;
    });

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

    setScores((prev) => {
      const next = { ...(prev || {}) };
      delete next[id];
      return next;
    });
  }

  function updateOption(id, patch) {
    setOptions((prev) => prev.map((opt) => (opt.id === id ? { ...opt, ...patch } : opt)));
  }

  function setCellScore(optionId, criterionId, value) {
    setScores((prev) => ({
      ...(prev || {}),
      [optionId]: {
        ...((prev || {})[optionId] || {}),
        [criterionId]: clampScore(value),
      },
    }));
  }

  async function suggestStarterFields() {
    const title = decisionTitle.trim();

    if (!title) {
      setErrorMsg("Add a decision title first so the API has something to work with.");
      return;
    }

    setSuggestionLoading(true);
    setSuggestionMsg("Fetching starter suggestions...");
    setErrorMsg("");

    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setSuggestionMsg("");
        setErrorMsg(data.msg || "Could not load suggestions.");
        return;
      }

      const currentCriteria = new Set(criteria.map((c) => normalizeName(c.name)));
      const currentOptions = new Set(options.map((o) => normalizeName(o.name)));

      const nextCriteria = (Array.isArray(data.suggestedCriteria) ? data.suggestedCriteria : [])
        .map((name) => String(name || "").trim())
        .filter((name) => name && !currentCriteria.has(normalizeName(name)));

      const nextOptions = (Array.isArray(data.suggestedOptions) ? data.suggestedOptions : [])
        .map((item) => typeof item === "string" ? item : item?.name)
        .map((name) => String(name || "").trim())
        .filter((name) => name && !currentOptions.has(normalizeName(name)));

      setSuggestedCriteria(nextCriteria);
      setSuggestedOptions(nextOptions);
      setSuggestionMsg(
        `Loaded ${nextCriteria.length} suggested criteria and ${nextOptions.length} suggested options from ${data.source || "the API"}. Review them before adding.`
      );
    } catch {
      setSuggestionMsg("");
      setErrorMsg("Could not reach the suggestion service.");
    } finally {
      setSuggestionLoading(false);
    }
  }

  function addSuggestedCriterion(name) {
    const cleaned = String(name || "").trim();
    if (!cleaned) return;

    const newC = makeCriterion(cleaned);
    setCriteria((prev) => [...prev, newC]);

    setScores((prev) => {
      const next = { ...(prev || {}) };
      for (const opt of options) {
        next[opt.id] = { ...(next[opt.id] || {}), [newC.id]: 5 };
      }
      return next;
    });

    setSuggestedCriteria((prev) => prev.filter((item) => item !== cleaned));
  }

  function addSuggestedOption(name) {
    const cleaned = String(name || "").trim();
    if (!cleaned) return;

    const newO = makeOption(cleaned);
    setOptions((prev) => [...prev, newO]);

    setScores((prev) => {
      const next = { ...(prev || {}) };
      next[newO.id] = {};
      for (const c of criteria) {
        next[newO.id][c.id] = 5;
      }
      return next;
    });

    setSuggestedOptions((prev) => prev.filter((item) => item !== cleaned));
  }

  function addAllSuggested() {
    [...suggestedCriteria].forEach((name) => addSuggestedCriterion(name));
    [...suggestedOptions].forEach((name) => addSuggestedOption(name));
  }

  function clearSuggestions() {
    setSuggestedCriteria([]);
    setSuggestedOptions([]);
    setSuggestionMsg("");
  }

  async function calculateRecommendation() {
    setSaveMsg("");
    setErrorMsg("");

    const title = decisionTitle.trim();
    if (!title) {
      setErrorMsg("Add a decision title first.");
      return;
    }

    if (options.length < 2) {
      setErrorMsg("Add at least two options.");
      return;
    }
    if (options.some((o) => !String(o.name || "").trim())) {
      setErrorMsg("Every option needs a name.");
      return;
    }

    if (criteria.length < 1) {
      setErrorMsg("Add at least one criterion.");
      return;
    }
    if (criteria.some((c) => !String(c.name || "").trim())) {
      setErrorMsg("Every criterion needs a name.");
      return;
    }
    if (criteria.some((c) => Number(c.weight) < 0 || Number.isNaN(Number(c.weight)))) {
      setErrorMsg("Criterion weights must be 0 or greater.");
      return;
    }

    for (const opt of options) {
      for (const c of criteria) {
        const v = Number(scores?.[opt.id]?.[c.id]);
        if (Number.isNaN(v) || v < 0 || v > 10) {
          setErrorMsg("All grid scores must be numbers from 0 to 10.");
          return;
        }
      }
    }

    const ranked = ranking;
    const winner = ranked[0];
    const runnerUp = ranked[1];
    const margin = runnerUp ? winner.total - runnerUp.total : winner.total;

    const nextResult = {
      title,
      ranked,
      winner,
      runnerUp,
      margin,
      calculatedAt: new Date().toISOString(),
    };

    setResult(nextResult);

    try {
      const serviceCriteria = criteria.map((c) => c.name);
      const serviceOptions = options.map((o) => ({
        name: o.name,
        scores: criteria.map((c) => clampScore(scores?.[o.id]?.[c.id] ?? 0)),
      }));

      const response = await fetch("/api/decisions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          criteria: serviceCriteria,
          options: serviceOptions,
        }),
      });

      if (response.ok) {
        setSaveMsg("Saved to your MongoDB-backed decision history.");
      } else if (response.status === 401) {
        onAuthInvalid?.();
        setSaveMsg("Calculated successfully, but your session expired. Log in again to save this decision to your MongoDB-backed history.");
      } else {
        setSaveMsg("Calculated successfully, but the backend save failed.");
      }
    } catch {
      setSaveMsg("Calculated successfully, but the backend save failed.");
    }
  }

  function resetBuilder() {
    setDecisionTitle("");
    const freshCriteria = [makeCriterion("Cost"), makeCriterion("Benefit")];
    const freshOptions = [makeOption("Option A"), makeOption("Option B")];

    const freshScores = {};
    for (const o of freshOptions) {
      freshScores[o.id] = {};
      for (const c of freshCriteria) {
        freshScores[o.id][c.id] = 5;
      }
    }

    setCriteria(freshCriteria);
    setOptions(freshOptions);
    setScores(freshScores);

    setNewCriterionName("");
    setNewOptionName("");
    setErrorMsg("");
    setResult(null);
    setSaveMsg("");
    setSuggestionMsg("");
    setSuggestedCriteria([]);
    setSuggestedOptions([]);

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
        Build a weighted decision, score the tradeoffs, and optionally ask the service for starter criteria and options.
      </p>

      <div className="cardish" style={{ marginBottom: "1rem" }}>
        <h3 style={{ marginTop: 0 }}>1) Name the decision</h3>
        <label htmlFor="decision-title" style={{ display: "block", marginBottom: ".35rem" }}>
          Decision title
        </label>
        <input
          id="decision-title"
          type="text"
          placeholder="Example: Which laptop should I buy for school?"
          value={decisionTitle}
          onChange={(e) => setDecisionTitle(e.target.value)}
        />

        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", marginTop: ".85rem" }}>
          <button type="button" onClick={suggestStarterFields} disabled={suggestionLoading}>
            {suggestionLoading ? "Loading suggestions..." : "Suggest starter fields"}
          </button>
          <small style={{ color: "var(--muted)", alignSelf: "center" }}>
            Works better with a full phrase than a single word.
          </small>
        </div>

        {suggestionMsg ? (
          <div style={{ color: "#b7ffb7", marginTop: ".65rem" }}>{suggestionMsg}</div>
        ) : null}

        {(suggestedCriteria.length > 0 || suggestedOptions.length > 0) ? (
          <div
            style={{
              marginTop: ".9rem",
              padding: ".85rem",
              borderRadius: "10px",
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.08)",
            }}
          >
            <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", marginBottom: ".75rem" }}>
              <button type="button" onClick={addAllSuggested}>
                Add all suggestions
              </button>
              <button type="button" className="btn btn-outline-light" onClick={clearSuggestions}>
                Clear suggestions
              </button>
            </div>

            <div style={{ marginBottom: ".75rem" }}>
              <strong>Suggested criteria</strong>
              <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginTop: ".45rem" }}>
                {suggestedCriteria.length > 0 ? suggestedCriteria.map((name) => (
                  <button key={`crit-${name}`} type="button" className="btn btn-outline-light" onClick={() => addSuggestedCriterion(name)}>
                    + {name}
                  </button>
                )) : <span style={{ color: "var(--muted)" }}>No new criteria suggested.</span>}
              </div>
            </div>

            <div>
              <strong>Suggested options</strong>
              <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginTop: ".45rem" }}>
                {suggestedOptions.length > 0 ? suggestedOptions.map((name) => (
                  <button key={`opt-${name}`} type="button" className="btn btn-outline-light" onClick={() => addSuggestedOption(name)}>
                    + {name}
                  </button>
                )) : <span style={{ color: "var(--muted)" }}>No new options suggested.</span>}
              </div>
            </div>
          </div>
        ) : null}
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
                gridTemplateColumns: "1.5fr auto",
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
        <h3 style={{ marginTop: 0 }}>4) Score grid (0–10)</h3>
        <p style={{ color: "var(--muted)", marginTop: ".25rem" }}>
          Score each option for each criterion. Totals are weighted by criterion weight.
        </p>

        <div style={{ overflowX: "auto" }}>
          <table className="table table-dark table-striped align-middle" style={{ marginBottom: 0 }}>
            <thead>
              <tr>
                <th>Option</th>
                {criteria.map((c) => (
                  <th key={c.id}>
                    {c.name}
                    <div style={{ fontSize: ".85em", color: "var(--muted)" }}>w={Number(c.weight) || 0}</div>
                  </th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {options.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 600 }}>{o.name}</td>
                  {criteria.map((c) => (
                    <td key={c.id}>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="1"
                        value={scores?.[o.id]?.[c.id] ?? 5}
                        onChange={(e) => setCellScore(o.id, c.id, e.target.value)}
                        style={{ width: "90px" }}
                      />
                    </td>
                  ))}
                  <td>{totals[o.id] ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="cardish" style={{ marginBottom: "1rem" }}>
        <h3 style={{ marginTop: 0 }}>5) Calculate recommendation</h3>

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
            For <strong>{result.title}</strong>, the top option is <strong>{result.winner.name}</strong> with a total of{" "}
            <strong>{result.winner.total}</strong>.
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
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {result.ranked.map((opt, index) => (
                  <tr key={opt.id}>
                    <td>{index + 1}</td>
                    <td>{opt.name}</td>
                    <td>{opt.total}</td>
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
