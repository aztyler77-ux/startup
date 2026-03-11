import { useEffect, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import Home from "./views/Home";
import Play from "./views/Play";
import Scores from "./views/Scores";
import About from "./views/About";
import NotFound from "./views/NotFound";

function Nav() {
  const navClass = ({ isActive }) => (isActive ? "active" : undefined);

  return (
    <nav className="site-nav" aria-label="Primary">
      <NavLink to="/" end className={navClass}>Home</NavLink>
      <NavLink to="/play" className={navClass}>Play</NavLink>
      <NavLink to="/scores" className={navClass}>Scores</NavLink>
      <NavLink to="/about" className={navClass}>About</NavLink>
    </nav>
  );
}

export default function App() {
  const [userEmail, setUserEmail] = useState("");
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    async function loadSession() {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUserEmail(data.email || "");
        } else {
          setUserEmail("");
        }
      } catch {
        setUserEmail("");
      } finally {
        setAuthChecked(true);
      }
    }

    loadSession();
  }, []);

  async function handleAuthSuccess(email) {
    setUserEmail(email || "");
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "DELETE",
        credentials: "include",
      });
    } catch {
      // ignore logout fetch failures for now
    }

    setUserEmail("");
  }

  return (
    <>
      <header id="site-header">
        <div className="app-shell">
          <div className="brand">
            <h1>Decision Helper</h1>
            <span className="tagline">Make hard choices. Faster.</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: ".75rem",
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            <small style={{ color: "var(--muted)" }}>
              Logged in as:{" "}
              <strong style={{ color: "var(--text)" }}>
                {authChecked ? (userEmail || "guest") : "checking session..."}
              </strong>
            </small>

            {userEmail ? (
              <button
                type="button"
                className="btn btn-sm btn-outline-light"
                onClick={handleLogout}
              >
                Log out
              </button>
            ) : null}
          </div>

          <Nav />
        </div>
      </header>

      <main className="site-main">
        <div className="app-shell">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  userEmail={userEmail}
                  authChecked={authChecked}
                  onAuthSuccess={handleAuthSuccess}
                />
              }
            />
            <Route path="/play" element={<Play userEmail={userEmail} />} />
            <Route path="/scores" element={<Scores userEmail={userEmail} />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>

      <footer id="site-footer">
        <div className="app-shell">
          <small>
            Built by Tyler Nichols •{" "}
            <a href="https://github.com/aztyler77-ux/startup" target="_blank" rel="noreferrer">
              GitHub Repo
            </a>
          </small>
        </div>
      </footer>
    </>
  );
}
