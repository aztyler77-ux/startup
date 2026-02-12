import { NavLink, Route, Routes } from 'react-router-dom';
import Home from './views/Home';
import Play from './views/Play';
import Scores from './views/Scores';
import About from './views/About';
import NotFound from './views/NotFound';

function Nav() {
  const navClass = ({ isActive }) => (isActive ? 'active' : undefined);

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
  return (
    <>
      <header id="site-header">
        <div className="app-shell">
          <div className="brand">
            <h1>Decision Helper</h1>
            <span className="tagline">Make hard choices. Faster.</span>
          </div>
          <Nav />
        </div>
      </header>

      <main className="site-main">
        <div className="app-shell">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/play" element={<Play />} />
            <Route path="/scores" element={<Scores />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>

      <footer id="site-footer">
        <div className="app-shell">
          <small>
            Built by Tyler Nichols •{' '}
            <a href="https://github.com/aztyler77-ux/startup" target="_blank" rel="noreferrer">
              GitHub Repo
            </a>
          </small>
        </div>
      </footer>
    </>
  );
}
