import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import SkiingGame from "./games/SkiingGame";
import JumpingGame from "./games/JumpingGame";
import Leaderboard from "./Leaderboard";

function Home() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/games")
      .then(res => res.json())
      .then(data => setGames(data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🎮 Game Collections</h1>
      <p>
        <Link to="/leaderboard">🏆 Leaderboard</Link>
      </p>
      <ul>
        {games.map(game => (
          <li key={game.id} style={{ marginBottom: "20px" }}>
            <Link to={`/games/${game.id}`} className="game-link">
              <strong>{game.name}</strong>
            </Link>
            <p>{game.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games/skiinggame" element={<SkiingGame />} />
        <Route path="/games/jumpinggame" element={<JumpingGame />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;
