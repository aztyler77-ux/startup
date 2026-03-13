import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function About() {
  const [demo, setDemo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState("");

  async function loadDemoSuggestions() {
    setLoading(true);
    setStatusMsg('Fetching starter-field suggestions from the service...');

    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "buy a new computer" }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setDemo(null);
        setStatusMsg(data.msg || "Failed to load demo suggestions.");
        return;
      }

      setDemo(data);
      setStatusMsg(`Live third-party-backed suggestions loaded from ${data.source || "the API"}.`);
    } catch {
      setDemo(null);
      setStatusMsg("Could not reach the service.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDemoSuggestions();
  }, []);

  return (
    <>
      <h2 className="page-title">About Decision Helper</h2>
      <p className="page-subtitle">
        Decision Helper is a CS260 startup project that helps users compare options, score tradeoffs, and commit to a recommendation.
      </p>

      <div className="cardish" style={{ marginBottom: "1rem" }}>
        <h3 style={{ marginTop: "1rem" }}>How it works</h3>
        <ol style={{ marginBottom: 0, color: "var(--muted)" }}>
          <li>Add the options you are deciding between.</li>
          <li>Score each option in the decision builder.</li>
          <li>Review the ranked results and save your decision history.</li>
        </ol>
      </div>

      <div className="cardish" style={{ marginBottom: "1rem" }}>
        <div
          style={{
            display: "flex",
            gap: ".75rem",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: ".5rem",
          }}
        >
          <h3 style={{ margin: 0 }}>Third-party Suggestions Demo</h3>
          <button type="button" onClick={loadDemoSuggestions}>
            Refresh demo
          </button>
        </div>

        <p style={{ color: "var(--muted)", marginTop: 0 }}>
          The service deliverable now uses a third-party-backed suggestion flow. The frontend calls the backend, and the backend calls Datamuse to generate starter criteria and option ideas from a decision title.
        </p>

        {loading ? (
          <div
            style={{
              padding: ".75rem",
              borderRadius: "10px",
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.08)",
            }}
          >
            Loading demo suggestions...
          </div>
        ) : demo ? (
          <div
            style={{
              padding: ".9rem",
              borderRadius: "10px",
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.08)",
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: ".5rem" }}>
              Demo title: {demo.decisionTitle}
            </div>

            <div style={{ marginBottom: ".6rem" }}>
              <strong>Suggested criteria:</strong>{" "}
              {(demo.suggestedCriteria || []).join(", ") || "None"}
            </div>

            <div style={{ marginBottom: ".35rem" }}>
              <strong>Suggested options:</strong>{" "}
              {(demo.suggestedOptions || []).map((item) => item.name).join(", ") || "None"}
            </div>

            <div style={{ color: "var(--muted)", fontSize: ".9rem" }}>
              Source: {demo.source || "Unknown"}
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: ".75rem",
              borderRadius: "10px",
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.08)",
            }}
          >
            No demo suggestions available right now.
          </div>
        )}

        <div style={{ marginTop: ".75rem", color: "var(--muted)", fontSize: ".95rem" }}>
          Status: {statusMsg || "Idle"}
        </div>
      </div>

      <div className="cardish">
        <h3 style={{ marginTop: 0 }}>What comes next</h3>
        <ul style={{ marginBottom: ".75rem", color: "var(--muted)" }}>
          <li>Database deliverable: persist users and decision history in MongoDB</li>
          <li>WebSocket deliverable: replace mock live updates with real-time events</li>
          <li>Future improvement: smarter suggestion logic tuned for real decision categories</li>
        </ul>

        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
          <Link to="/play">
            <button type="button">Try the Decision Builder</button>
          </Link>
          <a
            className="btn btn-outline-light"
            href="https://github.com/aztyler77-ux/startup"
            target="_blank"
            rel="noreferrer"
          >
            GitHub Repo
          </a>
        </div>
      </div>
    </>
  );
}
