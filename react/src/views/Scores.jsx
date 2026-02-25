import { useEffect, useMemo, useState } from "react";

const HISTORY_KEY = "decisionHelper.history";
const USER_KEY = "decisionHelper.userName";

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

function formatDate(isoString) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
}

function makeId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

const fakeNames = ["Alex", "Jamie", "Taylor", "Morgan", "Riley", "Jordan", "Casey", "Sam"];
const fakeDecisions = [
  "Laptop Purchase",
  "Vacation Spot",
  "Apartment Choice",
  "Class Schedule",
  "Workout Split",
  "Meal Prep Plan",
  "Car Repair Option",
  "Weekend Plan",
];
const fakeActions = [
  "saved a new decision draft",
  "updated option scores",
  "finalized a recommendation",
  "re-ranked the top options",
  "changed decision weights (future feature)",
  "reviewed decision history",
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function Scores() {
  const [history, setHistory] = useState([]);
  const [liveUpdates, setLiveUpdates] = useState([]);
  const [statusMsg, setStatusMsg] = useState("");

  const currentUser = useMemo(() => {
    try {
      return localStorage.getItem(USER_KEY) || "guest";
    } catch {
      return "guest";
    }
  }, []);

  useEffect(() => {
    setHistory(safeReadJson(HISTORY_KEY, []));
  }, []);

  // Auto-refresh history when returning to this tab/window
  useEffect(() => {
    function onFocus() {
      setHistory(safeReadJson(HISTORY_KEY, []));
    }
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  useEffect(() => {
    const starter = {
      id: makeId(),
      text: `Live updates connected (mock stream). Watching for activity as ${currentUser}.`,
      createdAt: new Date().toISOString(),
    };

    setLiveUpdates([starter]);

    const intervalId = setInterval(() => {
      const actor = Math.random() < 0.35 ? currentUser : randomItem(fakeNames);
      const decision = randomItem(fakeDecisions);
      const action = randomItem(fakeActions);

      const nextMessage = {
        id: makeId(),
        text: `${actor} ${action}: "${decision}"`,
        createdAt: new Date().toISOString(),
      };

      setLiveUpdates((prev) => [nextMessage, ...prev].slice(0, 10));
    }, 5000);

    return () => clearInterval(intervalId);
  }, [currentUser]);

  function refreshHistory() {
    setHistory(safeReadJson(HISTORY_KEY, []));
    setStatusMsg("History refreshed from localStorage.");
    setTimeout(() => setStatusMsg(""), 1800);
  }

  function clearHistory() {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {
      // ignore
    }
    setHistory([]);
    setStatusMsg("History cleared (local mock DB).");
    setTimeout(() => setStatusMsg(""), 1800);
  }

  return (
    <>
      <h2 className="page-title">Decision History</h2>
      <p className="page-subtitle">
        P2 mock data view: reads saved decisions from localStorage and simulates live activity updates using a timed stream.
      </p>

      <div className="cardish" style={{ marginBottom: "1rem" }}>
        <div
          style={{
            display: "flex",
            gap: ".75rem",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: ".75rem",
          }}
        >
          <h3 style={{ margin: 0 }}>Saved decisions (local mock DB)</h3>

          <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
            <button type="button" onClick={refreshHistory}>
              Refresh history
            </button>
            <button type="button" className="btn btn-outline-light" onClick={clearHistory}>
              Clear history
            </button>
          </div>
        </div>

        {statusMsg ? (
          <div style={{ color: "#b7ffb7", marginBottom: ".75rem" }}>{statusMsg}</div>
        ) : null}

        {history.length === 0 ? (
          <p style={{ marginBottom: 0, color: "var(--muted)" }}>
            No decisions saved yet. Go to the Play page, calculate a winner, then come back here.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="table table-dark table-striped align-middle" style={{ marginBottom: 0 }}>
              <thead>
                <tr>
                  <th>When</th>
                  <th>Decision</th>
                  <th>Winner</th>
                  <th>Score</th>
                  <th>Summary</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id || `${item.title}-${item.createdAt}`}>
                    <td>{formatDate(item.createdAt)}</td>
                    <td>{item.title || "Untitled decision"}</td>
                    <td>{item.winner || "—"}</td>
                    <td>{item.winnerScore ?? "—"}</td>
                    <td>{item.summary || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="cardish">
        <h3 style={{ marginTop: 0 }}>Live Updates (mock WebSocket stream)</h3>
        <p style={{ color: "var(--muted)" }}>
          Simulated with <code>setInterval</code> for React P2. This will become real-time server push later.
        </p>

        <div style={{ display: "grid", gap: ".65rem" }}>
          {liveUpdates.map((update) => (
            <div
              key={update.id}
              style={{
                border: "1px solid rgba(255,255,255,.08)",
                background: "rgba(255,255,255,.03)",
                borderRadius: "10px",
                padding: ".7rem .85rem",
              }}
            >
              <div style={{ fontWeight: 600 }}>{update.text}</div>
              <div style={{ color: "var(--muted)", fontSize: ".9rem", marginTop: ".2rem" }}>
                {formatDate(update.createdAt)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
