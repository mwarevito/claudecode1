# 🚀 START HERE

## Welcome to Your Notion Telegram Bot!

Your bot is **100% ready** - all code is implemented and tested. You just need to configure it with your credentials.

---

## ⚡ Quick Start (10 Minutes)

### Step 1: Get Your Tokens (5 min)

#### Notion Integration Token
1. Visit https://www.notion.so/my-integrations
2. Click "**+ New integration**"
3. Name it "Daily Planner Bot"
4. Copy the **Internal Integration Token** (starts with `secret_`)

#### Telegram Bot Token
1. Open Telegram, search for `@BotFather`
2. Send `/newbot`
3. Choose a name (e.g., "My Daily Planner")
4. Choose a username (e.g., "my_daily_planner_bot")
5. Copy the **bot token** (looks like `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Step 2: Configure .env (2 min)

Open the `.env` file (it's already created in your project):

```bash
open .env
# or
nano .env
```

Replace the placeholder values with your actual tokens:

```env
NOTION_TOKEN=secret_your_actual_token_here
TELEGRAM_BOT_TOKEN=123456789:your_actual_token_here
```

**Don't fill in the database IDs yet** - we'll do that in Step 3.

### Step 3: Set Up Notion Databases (3 min)

You need 4 databases in Notion. Here's the **fastest way**:

#### Option A: Minimal Setup (Recommended)
1. In Notion, create a new page called "Daily HQ"
2. Create 4 **inline databases** with these exact names:
   - **Objectives**
   - **Projects**  
   - **Weekly Outcomes**
   - **Daily MITs**

3. For each database, add these properties:

**Objectives:**
- Name (title) - already there
- Status (select) - add options: Active, Done

**Projects:**
- Name (title) - already there
- Status (select) - add options: Active, Done

**Weekly Outcomes:**
- Name (title) - already there
- Week (date)
- Status (select) - add options: Not Started, In Progress, Done
- Priority (number)

**Daily MITs:**
- Name (title) - already there
- Date (date)
- Status (select) - add options: Not Started, In Progress, Done, Blocked
- Priority (number)

4. **Share each database** with your integration:
   - Click `•••` menu → "Add connections" → Select your integration

5. **Get database IDs:**
   - Open each database as a full page
   - Copy the URL - it looks like: `https://notion.so/workspace/DATABASE_ID?v=...`
   - The DATABASE_ID is the 32-character code
   - Paste each into your `.env` file

#### Option B: Detailed Setup
See `NOTION_SCHEMA.md` for complete property specifications.

### Step 4: Test Configuration (30 sec)

```bash
npm run check
```

If you see all ✅ green checkmarks, you're ready!

### Step 5: Run the Bot! (30 sec)

```bash
npm run dev
```

You should see:
```
🚀 Starting Notion Daily Planner Bot...
✅ Configuration validated
🤖 Bot started successfully!
```

### Step 6: Test in Telegram (1 min)

1. Open Telegram
2. Search for your bot (the username you chose)
3. Send `/start`
4. You should get a welcome message with buttons!

---

## 🎯 First Real Use

### Add Some Data to Notion

1. **Create an Objective:**
   - Name: "Q4 Goals"
   - Status: Active

2. **Create a Project:**
   - Name: "Launch New Feature"
   - Status: Active

3. **Create Weekly Outcomes** (for this week):
   - Name: "Design mockups"
   - Week: [Select this Monday's date]
   - Status: Not Started
   - Priority: 1

   Add 2-3 more outcomes for variety.

### Plan Your Day

In Telegram:
1. Send `/plan`
2. Select 2-3 outcomes
3. Click "Done Selecting"
4. Send `/status` to see your MITs!

### Track Progress

- `/complete 1` - Mark first task done
- `/progress 2` - Mark second as in progress
- `/summary` - See your progress

---

## 📚 What to Read Next

| If you want to... | Read this |
|-------------------|-----------|
| **Get started quickly** | `QUICKSTART.md` |
| **Understand all features** | `README.md` |
| **Detailed setup help** | `SETUP.md` |
| **Deploy to production** | `DEPLOYMENT.md` |
| **Test everything** | `TESTING.md` |
| **See what's built** | `PROJECT_SUMMARY.md` |

---

## 🆘 Troubleshooting

### "Database not found"
→ Make sure you shared each database with your integration

### "No weekly outcomes found"  
→ Add outcomes with "Week" = this Monday's date

### Bot doesn't respond
→ Check the console for errors, verify tokens are correct

### Configuration errors
→ Run `npm run check` to see what's missing

---

## 💡 Tips

- **Start simple:** Create 2-3 weekly outcomes, plan 2-3 MITs daily
- **Use priorities:** Number your outcomes 1, 2, 3 for ordering
- **Check summaries:** Use `/summary` at end of day for motivation
- **Plan ahead:** Use `/next` to preview tomorrow's tasks

---

## 🎉 You're Ready!

1. ✅ Code is fully implemented
2. ✅ Dependencies installed (0 vulnerabilities)
3. ✅ Build successful
4. ⏳ **Just needs your credentials in `.env`**

**Next:** Open `.env` and add your tokens! 🚀

---

**Questions?** Check the other documentation files or the console output for detailed error messages.

**Happy Planning!** 📋✅
