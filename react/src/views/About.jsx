import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const mockInsights = [
  {
    title: "Clarify the real decision first",
    body: "Most bad decisions are actually vague decisions. Write the real question in one sentence before scoring options.",
    source: "Decision Helper Insight Service (mock)",
  },
  {
    title: "Separate facts from fear",
    body: "List what you know, what you assume, and what you fear. Treating all three as the same thing makes every option look worse.",
    source: "Decision Helper Insight Service (mock)",
  },
  {
    title: "Don’t overfit your criteria",
    body: "If you create 17 criteria, you may be optimizing for the feeling of control instead of making a choice.",
    source: "Decision Helper Insight Service (mock)",
  },
  {
    title: "A good decision can still feel uncomfortable",
    body: "Discomfort is not always a red flag. Sometimes it just means the tradeoff is real.",
    source: "Decision Helper Insight Service (mock)",
  },
];

function mockFetchDecisionInsight() {
  return new Promise((resolve) => {
    const delayMs = 650 + Math.floor(Math.random() * 700);

    setTimeout(() => {
      const pick = mockInsights[Math.floor(Math.random() * mockInsights.length)];
      resolve({
        ...pick,
        fetchedAt: new Date().toISOString(),
      });
    }, delayMs);
  });
}

function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export default function About() {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState("");

  async function loadInsight() {
    setLoading(true);
    setStatusMsg("Fetching mock third-party insight...");
    const next = await mockFetchDecisionInsight();
    setInsight(next);
    setLoading(false);
    setStatusMsg("Mock API response loaded.");
  }

  useEffect(() => {
    loadInsight();
  }, []);

  return (
    <>
      <h2 className="page-title">About Decision Helper</h2>
      <p className="page-subtitle">
        Decision Helper is a CS260 startup project that helps users compare options, score tradeoffs, and commit to a recommendation.
      </p>

      <div className="cardish" style={{ marginBottom: "1rem" }}>
        <img src="/DecisionHelper.png" alt="Decision Helper logo" />
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
          <h3 style={{ margin: 0 }}>Third-party Insight (Mocked for React P2)</h3>
          <button type="button" onClick={loadInsight}>
            Refresh insight
          </button>
        </div>

        <p style={{ color: "var(--muted)", marginTop: 0 }}>
          This simulates a future API-backed feature. For React Part 2, it is mocked in the frontend with a Promise + setTimeout.
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
            Loading insight...
          </div>
        ) : insight ? (
          <div
            style={{
              padding: ".9rem",
              borderRadius: "10px",
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.08)",
            }}
          >
            <div style={{ fontWeight: 700 }}>{insight.title}</div>
            <p style={{ margin: ".5rem 0", color: "var(--muted)" }}>{insight.body}</p>
            <div style={{ color: "var(--muted)", fontSize: ".9rem" }}>
              Source: {insight.source}
            </div>
            <div style={{ color: "var(--muted)", fontSize: ".9rem" }}>
              Loaded: {formatDateTime(insight.fetchedAt)}
            </div>
          </div>
        ) : null}

        <div style={{ marginTop: ".75rem", color: "var(--muted)", fontSize: ".95rem" }}>
          Status: {statusMsg || "Idle"}
        </div>
      </div>

      <div className="cardish">
        <h3 style={{ marginTop: 0 }}>What comes next</h3>
        <ul style={{ marginBottom: ".75rem", color: "var(--muted)" }}>
          <li>Service deliverable: replace mocked behaviors with backend API calls</li>
          <li>Database deliverable: persist users and decision history in MongoDB</li>
          <li>WebSocket deliverable: replace mock live updates with real-time events</li>
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
