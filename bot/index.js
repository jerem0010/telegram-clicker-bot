import { Telegraf } from "telegraf";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const redis = new Redis(process.env.REDIS_URL);

// Commande /start
bot.start(async (ctx) => {
  const userId = ctx.from.id;
  let username = await redis.get(`user:${userId}:username`);

  if (!username) {
    await ctx.reply("Bienvenue ! 👋 Choisis un pseudo avec /changename <ton_pseudo>");
    return;
  }

  const clicks = (await redis.zscore("leaderboard", username)) || 0;

  await ctx.reply(
    `👋 Salut ${username} !\nTu as ${clicks} clics.\nJoue dans la mini app 👇`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🔥 Ouvrir le Clicker",
              web_app: {
                url: "https://oswaldo-unatrophied-algometrically.ngrok-free.dev", // 🔗 ton lien ngrok ici
              },
            },
          ],
        ],
      },
    }
  );

  // Optionnel : affiche aussi les stats directement après le message d’accueil
  // await showStats(ctx, userId, username);
});


// Commande /changename
bot.command("changename", async (ctx) => {
  const args = ctx.message.text.split(" ");
  const newName = args[1];

  if (!newName) {
    await ctx.reply("❌ Utilise /changename <nouveau_nom>");
    return;
  }

  const userId = ctx.from.id;
  await redis.set(`user:${userId}:username`, newName);
  await ctx.reply(`✅ Ton nouveau pseudo est maintenant ${newName}`);
});

// Commande /click
bot.command("click", async (ctx) => {
  const userId = ctx.from.id;
  let username = await redis.get(`user:${userId}:username`);

  if (!username) {
    await ctx.reply("⚠️ Choisis un pseudo avant de cliquer : /changename <nom>");
    return;
  }

  // --- Initialisation si la clé n'existe pas encore ---
  if (!(await redis.exists(`user:${userId}:clicks`))) {
    await redis.set(`user:${userId}:clicks`, 0);
  }

  // --- Incrément ---
  await redis.incr(`user:${userId}:clicks`);
  await redis.incr("global:clicks");
  await redis.zincrby("leaderboard", 1, username);

  await showStats(ctx, userId, username);
});


// Fonction pour afficher les stats
async function showStats(ctx, userId, username) {
  const usernameClicks = (await redis.zscore("leaderboard", username)) || 0;
  // const userClicks = (await redis.get(`user:${userId}:clicks`)) || 0;
  const totalClicks = (await redis.get("global:clicks")) || 0;

  const top20 = await redis.zrevrange("leaderboard", 0, 19, "WITHSCORES");
  let leaderboard = "🏆 Top 20 Clickers:\n";
  for (let i = 0; i < top20.length; i += 2) {
    leaderboard += `${i / 2 + 1}. ${top20[i]} — ${top20[i + 1]} clicks\n`;
  }

  await ctx.reply(
    `👋 Salut ${username} !\n` +
      `🔥 +1 click !\n` +
      `✨ Tes clics : ${usernameClicks}\n` +
      `🌍 Total global : ${totalClicks}\n\n` +
      `${leaderboard}`
  );
}


// Commande /click
bot.command("click", async (ctx) => {
  const userId = ctx.from.id;
  const username = ctx.from.username || `user${userId}`;

  await redis.incr(`user:${userId}:clicks`);
  await redis.incr("total_clicks");
  await redis.zincrby("leaderboard", 1, username);

  const userClicks = await redis.get(`user:${userId}:clicks`);
  const totalClicks = await redis.get("total_clicks");
  const top20 = await redis.zrevrange("leaderboard", 0, 19, "WITHSCORES");

  let leaderboard = "🏆 Top 20:\n";
  for (let i = 0; i < top20.length; i += 2) {
    leaderboard += `${i / 2 + 1}. ${top20[i]} - ${top20[i + 1]} clicks\n`;
  }

  await ctx.reply(
    `🔥 +1 click !\nToi : ${userClicks}\nTotal global : ${totalClicks}\n\n${leaderboard}`
  );
});

bot.launch();
