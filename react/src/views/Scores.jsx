import { useEffect, useState } from "react";

function formatDate(isoString) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
}

export default function Scores() {
  const [history, setHistory] = useState([]);
  const [statusMsg, setStatusMsg] = useState("");

  async function refreshHistory() {
    try {
      const response = await fetch("/api/decisions/mine", {
        credentials: "include",
      });

      if (response.status === 401) {
        setHistory([]);
        setStatusMsg("Log in to view your MongoDB-backed decision history.");
        return;
      }

      const data = await response.json().catch(() => []);

      if (!response.ok) {
        setHistory([]);
        setStatusMsg("Could not load your MongoDB-backed decision history.");
        return;
      }

      const mapped = (Array.isArray(data) ? data : []).map((item) => {
        const scores = Array.isArray(item.options) ? item.options.map((o) =>
          Array.isArray(o.scores) ? o.scores.reduce((sum, n) => sum + Number(n || 0), 0) : 0
        ) : [];

        const winnerIndex = scores.length ? scores.indexOf(Math.max(...scores)) : -1;
        const winnerName =
          winnerIndex >= 0 && item.options?.[winnerIndex]?.name
            ? item.options[winnerIndex].name
            : "—";

        const winnerScore = winnerIndex >= 0 ? scores[winnerIndex] : 0;

        return {
          id: item.id,
          title: item.title || "Untitled decision",
          winner: winnerName,
          winnerScore,
          createdAt: item.createdAt,
          summary: `Loaded from MongoDB for ${item.ownerEmail || "current user"}.`,
        };
      });

      setHistory(mapped);
      setStatusMsg("History refreshed from MongoDB-backed storage.");
    } catch {
      setHistory([]);
      setStatusMsg("Could not reach the decision history service.");
    }
  }

  useEffect(() => {
    refreshHistory();
  }, []);

  return (
    <>
      <h2 className="page-title">Decision History</h2>
      <p className="page-subtitle">
        DB deliverable data view: loads saved decisions from your MongoDB-backed account history.
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
          <h3 style={{ margin: 0 }}>Saved decisions (MongoDB-backed history)</h3>

          <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
            <button type="button" onClick={refreshHistory}>
              Refresh history
            </button>
          </div>
        </div>

        {statusMsg ? (
          <div style={{ color: "#b7ffb7", marginBottom: ".75rem" }}>{statusMsg}</div>
        ) : null}

        {history.length === 0 ? (
          <p style={{ marginBottom: 0, color: "var(--muted)" }}>
            No MongoDB-backed decisions found yet. Log in, calculate a winner on the Play page, and then come back here.
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
    </>
  );
}
