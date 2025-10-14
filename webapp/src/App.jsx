import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);
  const [clicks, setClicks] = useState(0);
  const [total, setTotal] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

  // Récupère les infos Telegram (depuis WebApp)
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      setUser(tg.initDataUnsafe?.user);
      console.log("Telegram user:", tg.initDataUnsafe?.user);
    }
  }, []);

  const handleClick = async () => {
    if (!user) return alert("Utilisateur Telegram introuvable 😅");

    const res = await fetch("http://localhost:3000/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        username: user.username || "anonymous",
      }),
    });

    const data = await res.json();
    setClicks(data.userClicks);
    setTotal(data.totalClicks);

    const lb = await fetch("http://localhost:3000/leaderboard");
    setLeaderboard(await lb.json());
  };

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h1>🔥 Telegram Clicker</h1>
      {user ? (
        <>
          <h2>Welcome {user.username || "Anonymous"}</h2>
          <button
            onClick={handleClick}
            style={{
              background: "linear-gradient(to right, #f90, #f00)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "15px 30px",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            CLICK ME 🔥
          </button>

          <p style={{ marginTop: 20 }}>
            You: <b>{clicks}</b> clicks <br />
            Total: <b>{total}</b>
          </p>

          <h3>🏆 Leaderboard</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {leaderboard.map((p, i) => (
              <li key={i}>
                {i + 1}. {p.username} — {p.clicks}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Chargement des infos Telegram...</p>
      )}
    </div>
  );
}

export default App;
