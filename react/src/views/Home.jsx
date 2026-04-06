import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home({ userEmail, authChecked, onAuthSuccess }) {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitAuth(event) {
    event.preventDefault();

    const cleanedEmail = email.trim();
    if (!cleanedEmail) {
      setErrorMsg("Please enter an email.");
      return;
    }
    if (!password) {
      setErrorMsg("Please enter a password.");
      return;
    }

    const endpoint = mode === "create" ? "/api/auth/create" : "/api/auth/login";

    setLoading(true);
    setErrorMsg("");
    setStatusMsg(mode === "create" ? "Creating account..." : "Logging in...");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: cleanedEmail,
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrorMsg(data.msg || "Authentication failed.");
        setStatusMsg("");
        return;
      }

      onAuthSuccess(data.email || cleanedEmail);
      setPassword("");
      setStatusMsg(mode === "create" ? "Account created." : "Login successful.");
      navigate("/play");
    } catch {
      setErrorMsg("Could not reach the service.");
      setStatusMsg("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h2 className="page-title">Build a decision that sticks.</h2>
      <p className="page-subtitle">
        Simple scoring. Clear tradeoffs. A recommendation you can commit to with confidence.
      </p>

      <div className="cardish" style={{ marginBottom: "1rem" }}>
        <p style={{ marginTop: ".75rem", color: "var(--muted)" }}>
          Start a new decision build, or check your past results.
        </p>

        {authChecked && userEmail ? (
          <div
            style={{
              marginBottom: "1rem",
              padding: ".75rem",
              borderRadius: "10px",
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.08)",
            }}
          >
            <strong>Welcome back, {userEmail}.</strong>
            <div style={{ color: "var(--muted)", marginTop: ".35rem" }}>
              Your session and saved decision history are now backed by MongoDB, not fake browser-only state.
            </div>
          </div>
        ) : (
          <form
            onSubmit={submitAuth}
            style={{
              display: "grid",
              gap: ".75rem",
              marginBottom: "1rem",
              maxWidth: "520px",
            }}
          >
            <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
              <button
                type="button"
                className={mode === "login" ? "" : "btn btn-outline-light"}
                onClick={() => {
                  setMode("login");
                  setErrorMsg("");
                  setStatusMsg("");
                }}
              >
                Log in
              </button>
              <button
                type="button"
                className={mode === "create" ? "" : "btn btn-outline-light"}
                onClick={() => {
                  setMode("create");
                  setErrorMsg("");
                  setStatusMsg("");
                }}
              >
                Create account
              </button>
              <small style={{ color: "var(--muted)", alignSelf: "center" }}>
                Pick a mode first, then submit once like a normal website.
              </small>
            </div>

            <div>
              <label htmlFor="home-email" style={{ display: "block", marginBottom: ".35rem" }}>
                Email
              </label>
              <input
                id="home-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="home-password" style={{ display: "block", marginBottom: ".35rem" }}>
                Password
              </label>
              <input
                id="home-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "create" ? "new-password" : "current-password"}
              />
            </div>

            {errorMsg ? (
              <div role="alert" style={{ color: "#ffb4b4" }}>
                {errorMsg}
              </div>
            ) : null}

            {statusMsg ? (
              <div style={{ color: "#b7ffb7" }}>
                {statusMsg}
              </div>
            ) : null}

            <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
              <button type="submit" disabled={loading}>
                {loading
                  ? mode === "create"
                    ? "Creating account..."
                    : "Logging in..."
                  : mode === "create"
                    ? "Create account"
                    : "Log in"}
              </button>
              <small style={{ color: "var(--muted)", alignSelf: "center" }}>
                DB deliverable behavior: MongoDB-backed auth with cookies and persistent decision history.
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
