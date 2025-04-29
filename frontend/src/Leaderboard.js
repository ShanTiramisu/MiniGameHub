import { useEffect, useState } from "react";

function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [game, setGame] = useState("SkiingGame"); // Default selected game
  const [page, setPage] = useState(0);            // Current page number
  const pageSize = 10;                             // Number of scores per page
  const [isLoading, setIsLoading] = useState(false); // Optional: loading indicator

  // Fetch scores whenever game or page changes
  useEffect(() => {
    console.log("📡 Fetch triggered for game =", game, "page =", page);  // ✅ This must appear
    async function fetchScores() {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/scores/${game}?skip=${page * pageSize}&limit=${pageSize}`);
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }
        const data = await response.json();
        console.log("Fetched scores:", data);  // 👈 Add this line
        setScores(data);
      } catch (error) {
        console.error("Error fetching scores:", error);
        setScores([]);
      } finally {
        setIsLoading(false);
      }
    }
  
    fetchScores();
  }, [game, page]);
  

  // Handle game selection change
  function handleGameChange(event) {
    setGame(event.target.value);
    setPage(0); // Reset to first page when switching games
  }

  // Navigate pages
  function goToNextPage() {
    setPage((prev) => prev + 1);
  }

  function goToPreviousPage() {
    setPage((prev) => Math.max(prev - 1, 0));
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>🏆 Leaderboard ({game})</h1>

      {/* Game selection */}
      <select onChange={handleGameChange} value={game} style={{ marginBottom: "20px" }}>
        <option value="SkiingGame">Skiing Game</option>
        <option value="JumpingGame">Jumping Game</option>
      </select>

      {/* Loading state */}
      {isLoading ? (
        <p>Loading leaderboard...</p>
      ) : (
        <>
          {/* Scores list */}
          {scores.length === 0 ? (
            <p>No scores found.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {scores.map((entry, idx) => (
                <li key={idx} style={{ margin: "10px 0" }}>
                  {page * pageSize + idx + 1}. {entry.name} - {entry.points} pts - {new Date(entry.timestamp).toLocaleString()}
                </li>
              ))}
            </ul>
          )}

          {/* Pagination controls */}
          <div style={{ marginTop: "20px" }}>
            <button onClick={goToPreviousPage} disabled={page === 0}>
              ◀ Previous
            </button>
            <span style={{ margin: "0 10px" }}>Page {page + 1}</span>
            <button onClick={goToNextPage} disabled={scores.length < pageSize}>
              Next ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Leaderboard;
