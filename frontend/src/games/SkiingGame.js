import { useEffect, useRef, useState, useCallback } from "react";

function SkiingGame() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [playerX, setPlayerX] = useState(185);
  const [name, setName] = useState("Player");
  const [gameStarted, setGameStarted] = useState(false); // NEW: control game start
  const hasSubmitted = useRef(false);
  const animationId = useRef(null);
  const obstacles = useRef([]);
  const running = useRef(false);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "ArrowLeft") {
        setPlayerX((prev) => Math.max(prev - 20, 0));
      } else if (e.key === "ArrowRight") {
        setPlayerX((prev) => Math.min(prev + 20, 400 - 30));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const startGame = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const playerY = 250;
    const playerSize = 30;
    let frameCount = 0;
    running.current = true;

    function createObstacle() {
      const size = 30;
      const x = Math.random() * (400 - size);
      const type = Math.random() < 0.5 ? "tree" : "rock";
      obstacles.current.push({ x, y: -size, size, type });
    }

    function drawPlayer() {
      ctx.fillStyle = "blue";
      ctx.fillRect(playerX, playerY, playerSize, playerSize);
    }

    function drawObstacle(ob) {
      ctx.fillStyle = ob.type === "tree" ? "green" : "gray";
      ctx.beginPath();
      ctx.arc(ob.x + ob.size / 2, ob.y + ob.size / 2, ob.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    function checkCollision(ob) {
      return (
        playerX < ob.x + ob.size &&
        playerX + playerSize > ob.x &&
        playerY < ob.y + ob.size &&
        playerY + playerSize > ob.y
      );
    }

    function updateGame() {
      if (!running.current) return;
      ctx.clearRect(0, 0, 400, 300);
      ctx.fillStyle = "#F0F8FF";
      ctx.fillRect(0, 0, 400, 300);

      drawPlayer();

      obstacles.current.forEach((ob) => {
        ob.y += 3;
        drawObstacle(ob);
        if (checkCollision(ob)) {
          running.current = false;
          setGameOver(true);
        }
      });

      obstacles.current = obstacles.current.filter((ob) => ob.y < 300);

      if (frameCount % 60 === 0) {
        createObstacle();
        setScore((prev) => prev + 1);
      }

      frameCount++;
      animationId.current = requestAnimationFrame(updateGame);
    }

    animationId.current = requestAnimationFrame(updateGame);
  }, [playerX]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      startGame();
    }
    return () => cancelAnimationFrame(animationId.current);
  }, [gameStarted, gameOver, startGame]);

  useEffect(() => {
    if (gameOver && !hasSubmitted.current) {
      hasSubmitted.current = true;
      fetch("http://localhost:8000/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "Player",
          points: score,
          game: "SkiingGame",
        }),
      })
      .then(res => {
        if (!res.ok) throw new Error("Failed to submit score");
        return res.json();
      })
      .then(data => console.log("Score submitted:", data))
      .catch(err => console.error("Failed to submit score:", err));
    }
  }, [gameOver, score, name]);

  function handleStart() {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setPlayerX(185);
    obstacles.current = [];
    hasSubmitted.current = false;
    running.current = true;
  }

  function handleRestart() {
    handleStart();
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <div>
        <label>Player Name: </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          maxLength={20}
          disabled={gameStarted && !gameOver} // lock name after starting
        />
      </div>

      <h1>🎿 Skiing Game</h1>
      <p>Score: {score}</p>
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        style={{ border: "2px solid black", marginBottom: "20px" }}
      />

      {!gameStarted && !gameOver && (
        <div style={{ marginTop: "10px" }}>
          <button onClick={handleStart}>▶ Start Game</button>
        </div>
      )}

      {gameOver && (
        <div style={{ marginTop: "20px", color: "red", fontWeight: "bold" }}>
          Game Over! Your Score: {score}
          <div style={{ marginTop: "10px" }}>
            <button onClick={handleRestart}>🔁 Restart</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SkiingGame;

