import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <h2 className="page-title">Build a decision that sticks.</h2>
      <p className="page-subtitle">
        Simple scoring. Clear tradeoffs. A recommendation you can commit to without re-litigating your soul at 2am.
      </p>

      <div className="cardish" style={{ marginBottom: "1rem" }}>
        <img src="/DecisionHelper.png" alt="Decision Helper" />
        <p style={{ marginTop: ".75rem", color: "var(--muted)" }}>
          Start a new decision build, or check your past results.
        </p>

        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
          <Link to="/play">
            <button>Build a decision</button>
          </Link>
          <Link to="/scores">
            <button>View history</button>
          </Link>

          <a
            className="btn btn-outline-light"
            href="https://github.com/aztyler77-ux/startup"
            target="_blank"
            rel="noreferrer"
            style={{ alignSelf: "center" }}
          >
            GitHub Repo
          </a>
        </div>
      </div>

      <div className="cardish">
        <h3 style={{ marginTop: 0 }}>How it works</h3>
        <ol style={{ marginBottom: 0, color: "var(--muted)" }}>
          <li>Add your options.</li>
          <li>Choose what matters (criteria).</li>
          <li>Score them and get a recommendation.</li>
        </ol>
      </div>
    </>
  );
}
