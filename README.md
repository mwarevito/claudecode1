# Notion Daily Planner Telegram Bot

A Telegram bot that integrates with your Notion Daily HQ databases to streamline daily planning, MIT tracking, and progress summaries.

## Features

- 📋 **Daily Planning**: Plan your Most Important Tasks (MITs) for the day
- ✅ **Status Tracking**: Update task progress in real-time via Telegram
- 📊 **Summaries**: Get daily and weekly completion summaries
- 🎯 **Next Steps**: Smart planning for upcoming tasks based on objectives and weekly outcomes

## Setup

### 1. Prerequisites

- Node.js 18+ installed
- Notion account with integration token
- Telegram bot token (get from @BotFather)

### 2. Notion Setup

1. Create a Notion integration at https://www.notion.so/my-integrations
2. Copy the integration token
3. Share your databases with the integration:
   - Objectives database
   - Projects database
   - Weekly Outcomes database
   - Daily MITs database
4. Get each database ID from the URL (the 32-character code)

### 3. Telegram Bot Setup

1. Message @BotFather on Telegram
2. Create a new bot with `/newbot`
3. Copy the bot token

### 4. Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your tokens and database IDs
nano .env
```

### 5. Configuration

Edit `.env` file with your credentials:
- `NOTION_TOKEN`: Your Notion integration token
- `NOTION_DB_*`: Your database IDs
- `TELEGRAM_BOT_TOKEN`: Your Telegram bot token

### 6. Run

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

## Commands

- `/start` - Welcome message and quick start guide
- `/plan` - Start daily planning session
- `/status` - View today's MITs and their status
- `/complete <task>` - Mark a task as completed
- `/progress <task>` - Update task progress
- `/summary` - Get today's summary
- `/next` - Plan tomorrow's MITs
- `/objectives` - View current objectives
- `/projects` - List active projects
- `/week` - Show this week's outcomes
- `/help` - Show all available commands

## Usage Examples

```
/plan
> Shows this week's outcomes and prompts you to select MITs for today

/status
> MIT 1: [In Progress] Write project proposal (Project: Q1 Launch)
> MIT 2: [Not Started] Team meeting prep
> MIT 3: [Done] ✅ Review pull requests

/complete Write project proposal
> ✅ Marked "Write project proposal" as complete!

/summary
> 📊 Today's Summary:
> Completed: 2/3 MITs (67%)
> Time: 6h 30m tracked
> Top achievement: Launched new feature
```

## Architecture

```
src/
├── index.ts                 # Main entry point
├── bot/
│   ├── bot.ts              # Telegram bot setup
│   ├── commands/           # Command handlers
│   └── keyboards.ts        # Inline keyboards
├── notion/
│   ├── client.ts           # Notion API client
│   ├── databases/          # Database-specific operations
│   └── types.ts            # TypeScript types
├── services/
│   ├── planning.ts         # Daily planning logic
│   ├── tracking.ts         # Status tracking
│   └── summary.ts          # Summary generation
└── utils/
    ├── config.ts           # Configuration
    └── helpers.ts          # Helper functions
```

## License

MIT
