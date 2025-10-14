# 🔥 Telegram Clicker Game Bot

Un mini-jeu **Clicker** intégré à Telegram, développé pour un test technique.  
Chaque utilisateur peut cliquer pour augmenter son score, voir son classement global et changer de pseudo directement depuis le chat.

---

## 🚀 Fonctionnalités

✅ Commandes Telegram :
- `/start` → démarre le jeu, affiche ton score et le leaderboard  
- `/click` → ajoute un clic à ton total et met à jour le classement  
- `/changename <pseudo>` → change ton nom d’utilisateur affiché  

✅ Stockage :
- Toutes les données (clics, pseudos, leaderboard) sont stockées dans **Redis**  
- Classement dynamique mis à jour en temps réel  
- Persistance possible via volumes Docker  

✅ Bonus :
- Mini App Telegram (bouton intégré au `/start`)  
- Infrastructure entièrement **containerisée** avec Docker  

---

## 🧠 Stack technique

| Composant | Technologie |
|------------|-------------|
| Bot Telegram | Node.js + Telegraf |
| Base de données | Redis |
| Front (Mini App) | React + Vite |
| Conteneurisation | Docker + Docker Compose |

---

## ⚙️ Installation (en local)

### 1️⃣ Cloner le projet
```bash
git clone https://github.com/jerem0010/telegram-clicker-bot.git
cd telegram-clicker-bot
