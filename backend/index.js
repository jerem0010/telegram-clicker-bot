import express from "express";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://redis:6379");

app.post("/click", async (req, res) => {
    try {
        const { userId, username } = req.body;

        if (!userId || !username) {
            return res.status(400).json({ error: "Missing userId or username" });
        }

        await redis.incr(`user:${userId}:clicks`);
        await redis.incr("total_clicks");
        await redis.zincrby("leaderboard", 1, username);

        const userClicks = await redis.get(`user:${userId}:clicks`);
        const totalClicks = await redis.get("total_clicks");

        res.json({
            message: "+1 click!",
            userClicks: parseInt(userClicks),
            totalClicks: parseInt(totalClicks),
        });
    } catch (err) {
        console.error("Error in /click:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/leaderboard", async (_, res) => {
    try {
        const top20 = await redis.zrevrange("leaderboard", 0, 19, "WITHSCORES");
        const leaderboard = [];
        for (let i = 0; i < top20.length; i += 2) {
            leaderboard.push({ username: top20[i], clicks: parseInt(top20[i + 1]) });
        }
        res.json(leaderboard);
    } catch (err) {
        console.error("Error in /leaderboard:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(3000, () => console.log("🚀 Backend running on port 3000"));
