import { NavLink, Route, Routes } from 'react-router-dom';
import Home from './views/Home';
import Play from './views/Play';
import Scores from './views/Scores';
import About from './views/About';
import NotFound from './views/NotFound';

function Nav() {
  return (
    <nav className="site-nav">
      <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>
        Home
      </NavLink>
      <NavLink to="/play" className={({ isActive }) => (isActive ? 'active' : undefined)}>
        Play
      </NavLink>
      <NavLink to="/scores" className={({ isActive }) => (isActive ? 'active' : undefined)}>
        Scores
      </NavLink>
      <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : undefined)}>
        About
      </NavLink>
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
            <div className="tagline">Turn chaos into a call you can live with.</div>
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
          <small>© {new Date().getFullYear()} Decision Helper</small>
        </div>
      </footer>
    </>
  );
}
