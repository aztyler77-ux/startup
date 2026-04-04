import { useEffect, useState } from "react";

function formatDate(isoString) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
}

function maskEmail(email) {
  const raw = String(email || "").trim();
  if (!raw.includes("@")) return "Another user";

  const [name, domain] = raw.split("@");
  const visible = name.slice(0, 2);
  const masked = `${visible}${"*".repeat(Math.max(0, Math.min(6, name.length - 2)))}`;

  return `${masked}@${domain}`;
}

function truncateText(value, maxLength = 48) {
  const text = String(value || "").trim();
  if (!text) return "Untitled decision";
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

export default function Scores({ onAuthInvalid }) {
  const [history, setHistory] = useState([]);
  const [statusMsg, setStatusMsg] = useState("");
  const [liveStatus, setLiveStatus] = useState("Connecting to live updates...");
  const [liveEvents, setLiveEvents] = useState([]);

  async function refreshHistory() {
    try {
      const response = await fetch("/api/decisions/mine", {
        credentials: "include",
      });

      if (response.status === 401) {
        onAuthInvalid?.();
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
        const scores = Array.isArray(item.options)
          ? item.options.map((o) =>
              Array.isArray(o.scores) ? o.scores.reduce((sum, n) => sum + Number(n || 0), 0) : 0
            )
          : [];

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

  useEffect(() => {
    const protocol = window.location.protocol === "http:" ? "ws" : "wss";
    const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

    socket.onopen = () => {
      setLiveStatus("Live updates connected.");
    };

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        if (payload.type === "decision_saved") {
          setLiveEvents((current) => [
            {
              id: `${payload.createdAt || Date.now()}-${payload.title || "decision"}`,
              title: payload.title || "Untitled decision",
              ownerLabel: maskEmail(payload.ownerEmail),
              winnerName: truncateText(payload.winnerName || "Unknown winner", 36),
              createdAt: payload.createdAt || new Date().toISOString(),
            },
            ...current,
          ].slice(0, 8));

          setLiveStatus("Received a live decision update.");
          refreshHistory();
        }
      } catch {
        setLiveStatus("Received a malformed live update.");
      }
    };

    socket.onclose = () => {
      setLiveStatus("Live updates disconnected.");
    };

    socket.onerror = () => {
      setLiveStatus("Live updates encountered an error.");
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <>
      <h2 className="page-title">Decision History</h2>
      <p className="page-subtitle">
        DB + WebSocket view: loads saved decisions from MongoDB-backed history and shows live decision-save activity.
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
          <h3 style={{ margin: 0 }}>Live activity</h3>
          <div style={{ color: "#b7ffb7" }}>{liveStatus}</div>
        </div>

        {liveEvents.length === 0 ? (
          <p style={{ marginBottom: 0, color: "var(--muted)" }}>
            No live decision events yet. Save a decision in another window to watch this feed update instantly.
          </p>
        ) : (
          <div style={{ display: "grid", gap: ".75rem" }}>
            {liveEvents.map((eventItem) => (
              <div
                key={eventItem.id}
                style={{
                  border: "1px solid rgba(255,255,255,.12)",
                  borderRadius: "12px",
                  padding: ".85rem 1rem",
                  background: "rgba(255,255,255,.03)",
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: ".2rem" }}>
                  New saved decision
                </div>
                <div style={{ color: "var(--muted)", marginBottom: ".2rem" }}>
                  {truncateText(eventItem.title, 52)}
                </div>
                <div style={{ color: "var(--muted)" }}>
                  By {eventItem.ownerLabel} • Winner: {eventItem.winnerName} • {formatDate(eventItem.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
