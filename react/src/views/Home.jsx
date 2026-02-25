import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home({ userName, onLogin }) {
  const navigate = useNavigate();

  const [formUserName, setFormUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const cleanedUser = formUserName.trim();
    if (!cleanedUser) {
      setErrorMsg("Please enter a username.");
      return;
    }

    onLogin(cleanedUser);
    setPassword("");
    setErrorMsg("");
    navigate("/play");
  }

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

        {userName ? (
          <div
            style={{
              marginBottom: "1rem",
              padding: ".75rem",
              borderRadius: "10px",
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.08)",
            }}
          >
            <strong>Welcome back, {userName}.</strong>
            <div style={{ color: "var(--muted)", marginTop: ".35rem" }}>
              Your mock session is active and saved in this browser using localStorage.
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gap: ".75rem",
              marginBottom: "1rem",
              maxWidth: "520px",
            }}
          >
            <div>
              <label htmlFor="home-username" style={{ display: "block", marginBottom: ".35rem" }}>
                Username
              </label>
              <input
                id="home-username"
                type="text"
                placeholder="Enter a username"
                value={formUserName}
                onChange={(e) => setFormUserName(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="home-password" style={{ display: "block", marginBottom: ".35rem" }}>
                Password (mocked)
              </label>
              <input
                id="home-password"
                type="password"
                placeholder="Anything works for now"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {errorMsg ? (
              <div role="alert" style={{ color: "#ffb4b4" }}>
                {errorMsg}
              </div>
            ) : null}

            <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
              <button type="submit">Log in (mock)</button>
              <small style={{ color: "var(--muted)", alignSelf: "center" }}>
                P2 demo behavior: saves username locally, no backend yet.
              </small>
            </div>
          </form>
        )}

        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
          <Link to="/play">
            <button type="button">Build a decision</button>
          </Link>
          <Link to="/scores">
            <button type="button">View history</button>
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
