import { useEffect, useState } from "react";

function App() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/games")
      .then(res => res.json())
      .then(data => setGames(data))
      .catch(err => console.error("Error fetching games:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Game Collections</h1>
      <ul>
        {games.map(game => (
          <li key={game.id}>
            <h2>{game.name}</h2>
            <p>{game.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
