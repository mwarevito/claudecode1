# ⚡ Quick Reference Card

## 🚀 Getting Started (First Time)

```bash
# 1. Fill in .env with your credentials
open .env

# 2. Validate configuration
npm run check

# 3. Run the bot
npm run dev
```

---

## 📋 Bot Commands

| Command | What it does |
|---------|-------------|
| `/start` | Welcome message & main menu |
| `/plan` | Plan today's MITs from weekly outcomes |
| `/status` | View today's MITs and progress |
| `/complete <task>` | Mark task as done |
| `/progress <task>` | Mark task as in progress |
| `/summary` | Today's completion summary |
| `/week` | Weekly overview |
| `/objectives` | View active objectives |
| `/projects` | List active projects |
| `/next` | Suggestions for tomorrow |
| `/help` | Full command reference |

---

## 💻 Development Commands

```bash
npm run dev          # Start in development mode
npm run build        # Compile TypeScript
npm start            # Run production build
npm run check        # Validate .env configuration
npm run watch        # Watch for TypeScript changes
```

---

## 🚀 Deployment Commands

```bash
# PM2 (recommended for servers)
./scripts/deploy.sh pm2
pm2 logs notion-bot
pm2 restart notion-bot
pm2 stop notion-bot

# Docker
./scripts/deploy.sh docker
docker logs -f notion-bot
docker restart notion-bot
docker stop notion-bot

# Docker Compose
docker-compose up -d
docker-compose logs -f
docker-compose restart
docker-compose down
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `.env` | Your credentials (FILL THIS IN!) |
| `START_HERE.md` | 10-minute setup guide |
| `NEXT_STEPS.md` | Configuration steps |
| `DEPLOYMENT.md` | Production deployment |
| `TESTING.md` | Testing guide |
| `NOTION_SCHEMA.md` | Database properties |

---

## 🔑 Required Environment Variables

```env
NOTION_TOKEN=secret_xxxxx
TELEGRAM_BOT_TOKEN=123456:ABCxxx
NOTION_DB_OBJECTIVES=xxxxx
NOTION_DB_PROJECTS=xxxxx
NOTION_DB_WEEKLY_OUTCOMES=xxxxx
NOTION_DB_DAILY_MITS=xxxxx
TIMEZONE=UTC  # Optional
```

---

## 📊 Notion Databases Needed

1. **Objectives** - Your goals
   - Name (title), Status (select)

2. **Projects** - Your projects
   - Name (title), Status (select)

3. **Weekly Outcomes** - This week's outcomes
   - Name (title), Week (date), Status (select), Priority (number)

4. **Daily MITs** - Today's tasks
   - Name (title), Date (date), Status (select), Priority (number)

**Important:** Share each database with your Notion integration!

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Bot doesn't start | Run `npm run check` |
| Database not found | Share database with integration |
| No weekly outcomes | Add outcomes for this week |
| Configuration errors | Check `.env` file |
| Build fails | Run `npm install` |

---

## 📚 Documentation Index

- **Setup:** `START_HERE.md` → `NEXT_STEPS.md` → `SETUP.md`
- **Deploy:** `DEPLOYMENT.md`
- **Test:** `TESTING.md`
- **Reference:** `README.md` → `PROJECT_SUMMARY.md`
- **Database:** `NOTION_SCHEMA.md`

---

## 🎯 Typical Daily Workflow

**Morning:**
```
/plan → Select 3-5 outcomes → Done
```

**During Day:**
```
/status → Check progress
/complete 1 → Mark tasks done
/progress 2 → Update status
```

**Evening:**
```
/summary → Review your day
/next → Preview tomorrow
```

---

## 🔗 Quick Links

- Notion Integrations: https://www.notion.so/my-integrations
- Telegram BotFather: Search `@BotFather` in Telegram
- Notion API Docs: https://developers.notion.com

---

**Need more help?** Open `START_HERE.md` for the full setup guide!
