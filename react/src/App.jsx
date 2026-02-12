import { NavLink, Route, Routes } from 'react-router-dom';
import Home from './views/Home';
import Play from './views/Play';
import Scores from './views/Scores';
import About from './views/About';
import NotFound from './views/NotFound';

function Nav() {
  const linkStyle = ({ isActive }) => ({
    fontWeight: isActive ? '700' : '400',
    textDecoration: 'none',
    marginRight: '0.75rem',
  });

  return (
    <nav style={{ padding: '0.75rem 0' }}>
      <NavLink to="/" style={linkStyle} end>Home</NavLink>
      <NavLink to="/play" style={linkStyle}>Play</NavLink>
      <NavLink to="/scores" style={linkStyle}>Scores</NavLink>
      <NavLink to="/about" style={linkStyle}>About</NavLink>
    </nav>
  );
}

export default function App() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
      <header>
        <Nav />
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<Play />} />
        <Route path="/scores" element={<Scores />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
