# 🚀 Next Steps - Your Bot is Ready!

## ✅ What's Done

- ✅ Dependencies installed (no vulnerabilities)
- ✅ TypeScript compiled successfully
- ✅ All code fully implemented
- ✅ `.env` file created

## 📝 Configuration Required

You need to fill in your `.env` file with your credentials:

### 1. Open the .env file
```bash
open .env
# or
nano .env
```

### 2. Fill in these values:

#### **Notion Token**
1. Go to https://www.notion.so/my-integrations
2. Click "New integration"
3. Give it a name (e.g., "Daily Planner Bot")
4. Copy the "Internal Integration Token"
5. Paste it in `.env` as `NOTION_TOKEN`

#### **Telegram Bot Token**
1. Open Telegram and message `@BotFather`
2. Send `/newbot`
3. Follow the prompts (choose a name and username)
4. Copy the token BotFather gives you
5. Paste it in `.env` as `TELEGRAM_BOT_TOKEN`

#### **Notion Database IDs**
You need 4 databases in Notion. For each:
1. Open the database in Notion
2. Copy the URL - it looks like: `https://notion.so/workspace/DATABASE_ID?v=...`
3. The DATABASE_ID is the 32-character code between the last `/` and the `?`
4. Paste each ID into `.env`

**Required Databases:**
- `NOTION_DB_OBJECTIVES` - Your objectives/goals database
- `NOTION_DB_PROJECTS` - Your projects database
- `NOTION_DB_WEEKLY_OUTCOMES` - Weekly outcomes database
- `NOTION_DB_DAILY_MITS` - Daily MITs (Most Important Tasks) database

**Database Schemas:** See `NOTION_SCHEMA.md` for the exact properties each database needs.

### 3. Share Databases with Integration
⚠️ **IMPORTANT**: For each database in Notion:
1. Click the `•••` menu in the top right
2. Select "Add connections"
3. Choose your integration (e.g., "Daily Planner Bot")

## 🧪 Testing the Bot

Once your `.env` is configured:

```bash
# Run in development mode
npm run dev
```

The bot should start and show:
```
🚀 Starting Notion Daily Planner Bot...
📅 Timezone: UTC
✅ Configuration validated
🤖 Bot started successfully!
Press Ctrl+C to stop
```

## 💬 Test Commands

Open Telegram and message your bot:

1. `/start` - See welcome message
2. `/plan` - Plan today's MITs (requires weekly outcomes in Notion)
3. `/status` - View today's MITs
4. `/objectives` - List your objectives
5. `/projects` - List your projects
6. `/help` - See all commands

## 🐛 Troubleshooting

### "Database not found"
- Make sure you shared each database with your Notion integration
- Verify the database IDs are correct (32 characters, no spaces)

### "No weekly outcomes found"
- Add at least one entry to your Weekly Outcomes database
- Set the "Week" property to this week's Monday

### Bot doesn't respond
- Check your Telegram bot token is correct
- Make sure the bot is running (`npm run dev`)
- Check the console for error messages

### "Missing required environment variable"
- Make sure all variables in `.env` are filled in
- No quotes needed around values
- No spaces around the `=` sign

## 📚 Database Setup Help

If you haven't created your Notion databases yet, see:
- `NOTION_SCHEMA.md` - Complete database property specifications
- `SETUP.md` - Detailed setup instructions
- `QUICKSTART.md` - Minimal setup to get started quickly

## 🎯 Quick Database Templates

### Minimal Setup (5 minutes)
Create 4 databases with these properties:

**Objectives**: Name (title), Status (select: Active, Done)
**Projects**: Name (title), Status (select: Active, Done), Objective (relation)
**Weekly Outcomes**: Name (title), Week (date), Status (select), Priority (number)
**Daily MITs**: Name (title), Date (date), Status (select), Priority (number)

## 🚀 Production Deployment

Once tested, you can deploy using:
- **PM2** (recommended for VPS)
- **Docker** (see below)
- **Heroku/Railway** (cloud platforms)

### Quick Docker Setup
```bash
# Coming soon - Docker configuration will be added
```

## 📞 Need Help?

- Check the console output for detailed error messages
- Review `SETUP.md` for step-by-step instructions
- All code is in `src/` - fully commented and readable

---

**Ready?** Fill in your `.env` file and run `npm run dev`! 🎉
