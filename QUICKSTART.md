# Quick Start Guide

Get up and running with the Notion Daily Planner Bot in 10 minutes!

## TL;DR

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env
# Edit .env with your tokens

# 3. Run
npm run dev
```

## 5-Minute Setup

### 1. Get Your Tokens (3 minutes)

**Notion Token:**
1. Go to https://www.notion.so/my-integrations
2. Create integration → Copy token

**Telegram Bot:**
1. Message `@BotFather` on Telegram
2. Send `/newbot` → Follow prompts → Copy token

**Database IDs:**
1. Create 4 databases in Notion (see schemas below)
2. Share each with your integration
3. Copy IDs from URLs

### 2. Configure .env (1 minute)

```env
NOTION_TOKEN=secret_xxxxx
TELEGRAM_BOT_TOKEN=123456:ABCxxx
NOTION_DB_OBJECTIVES=xxxxx
NOTION_DB_PROJECTS=xxxxx
NOTION_DB_WEEKLY_OUTCOMES=xxxxx
NOTION_DB_DAILY_MITS=xxxxx
```

### 3. Run Bot (1 minute)

```bash
npm install
npm run dev
```

Send `/start` to your bot on Telegram!

## Minimal Database Setup

### Objectives Database
Properties: `Name` (title), `Status` (select: Active, Done)

### Projects Database
Properties: `Name` (title), `Status` (select: Active, Done), `Objective` (relation to Objectives)

### Weekly Outcomes Database
Properties: `Name` (title), `Week` (date), `Status` (select: Not Started, In Progress, Done), `Project` (relation), `Priority` (number)

### Daily MITs Database
Properties: `Name` (title), `Date` (date), `Status` (select: Not Started, In Progress, Done, Blocked), `Weekly Outcome` (relation), `Priority` (number)

## Quick Test

1. Add a Weekly Outcome in Notion for this week
2. Open Telegram bot
3. Send `/plan`
4. Select your outcome
5. Send `/status` to see it!

## Common Issues

**"Database not found"**
→ Make sure you shared each database with your integration

**"No weekly outcomes found"**
→ Add entries with Week = this Monday's date

**Bot doesn't respond**
→ Check tokens in .env and verify bot is running

## Full Documentation

- See `SETUP.md` for detailed setup
- See `NOTION_SCHEMA.md` for complete database specs
- See `README.md` for all features

## Daily Workflow

**Morning:**
```
/plan → Select 3-5 MITs for today
```

**Throughout day:**
```
/complete 1 → Mark first MIT done
/progress 2 → Update second MIT status
/status → Check progress
```

**Evening:**
```
/summary → Review your day
/next → Preview tomorrow
```

That's it! 🚀 Happy planning!
