# Setup Guide

Complete guide to set up your Notion Daily Planner Telegram Bot.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Notion account
- Telegram account

## Part 1: Notion Setup

### Step 1: Create Notion Integration

1. Go to https://www.notion.so/my-integrations
2. Click "+ New integration"
3. Name it "Daily Planner Bot"
4. Select your workspace
5. Click "Submit"
6. Copy the **Internal Integration Token** (starts with `secret_`)

### Step 2: Create Required Databases

You need to create 4 databases in Notion. See `NOTION_SCHEMA.md` for detailed property specifications.

#### Database 1: Objectives
Properties:
- **Name** (Title) - The objective title
- **Status** (Select) - Options: Active, In Progress, Done, On Hold
- **Due Date** (Date) - Target completion date
- **Description** (Text) - Optional details

#### Database 2: Projects
Properties:
- **Name** (Title) - The project name
- **Status** (Select) - Options: Active, In Progress, Done, On Hold
- **Objective** (Relation) - Link to Objectives database
- **Description** (Text) - Optional details

#### Database 3: Weekly Outcomes
Properties:
- **Name** (Title) - The outcome description
- **Week** (Date) - Week start date
- **Project** (Relation) - Link to Projects database
- **Status** (Select) - Options: Not Started, In Progress, Done
- **Priority** (Number) - 1-5 (1 = highest)

#### Database 4: Daily MITs
Properties:
- **Name** (Title) - The MIT description
- **Date** (Date) - The day for this MIT
- **Status** (Select) - Options: Not Started, In Progress, Done, Blocked
- **Weekly Outcome** (Relation) - Link to Weekly Outcomes database
- **Project** (Relation) - Link to Projects database
- **Priority** (Number) - 1-5 (1 = highest)
- **Estimated Time** (Number) - Hours estimated
- **Actual Time** (Number) - Hours actually spent

### Step 3: Share Databases with Integration

For EACH of the 4 databases:
1. Open the database in Notion
2. Click the "•••" menu in the top right
3. Scroll to "Connections"
4. Click "+ Add connections"
5. Select "Daily Planner Bot" (your integration name)
6. Click "Confirm"

### Step 4: Get Database IDs

For each database:
1. Open the database as a full page
2. Look at the URL: `https://notion.so/workspace/{database_id}?v=...`
3. The `database_id` is the 32-character code (with dashes)
4. Copy it for your `.env` file

Example URL:
```
https://www.notion.so/myworkspace/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6?v=...
                                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                 This is your database ID
```

## Part 2: Telegram Bot Setup

### Step 1: Create Bot with BotFather

1. Open Telegram and search for `@BotFather`
2. Start a chat and send `/newbot`
3. Follow prompts:
   - Choose a name (e.g., "My Daily Planner")
   - Choose a username (e.g., "my_daily_planner_bot")
4. BotFather will send you a **token** - copy it!

### Step 2: Configure Bot Settings (Optional)

Send these commands to BotFather:

```
/setdescription
Select your bot
Enter: Daily planner integrated with Notion for MIT tracking

/setabouttext
Select your bot
Enter: Plan your day, track progress, and achieve your goals with Notion integration.

/setcommands
Select your bot
Enter:
plan - Start daily planning
status - View today's MITs
complete - Mark task complete
progress - Update task progress
summary - Get daily summary
next - Plan next steps
objectives - View objectives
projects - List projects
week - Show weekly outcomes
help - Show help
```

## Part 3: Install and Configure Bot

### Step 1: Install Dependencies

```bash
cd /home/user/claudecode1
npm install
```

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Your Notion integration token
NOTION_TOKEN=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Your database IDs (32 characters each)
NOTION_DB_OBJECTIVES=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
NOTION_DB_PROJECTS=b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6a1
NOTION_DB_WEEKLY_OUTCOMES=c3d4e5f6g7h8i9j0k1l2m3n4o5p6a1b2
NOTION_DB_DAILY_MITS=d4e5f6g7h8i9j0k1l2m3n4o5p6a1b2c3

# Your Telegram bot token
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz

# Optional: Your timezone (default: UTC)
TIMEZONE=America/New_York
```

### Step 3: Build and Run

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

### Step 4: Test the Bot

1. Open Telegram
2. Search for your bot's username
3. Send `/start`
4. You should see the welcome message!

## Part 4: Populate Your Notion Databases

### Quick Start Data

To test the bot, add some sample data:

#### Objectives Database:
1. "Launch Q1 Product" - Status: Active, Due: 2024-03-31
2. "Build Team Skills" - Status: Active, Due: 2024-06-30

#### Projects Database:
1. "Mobile App MVP" - Status: In Progress, Objective: Launch Q1 Product
2. "Team Training Program" - Status: Active, Objective: Build Team Skills

#### Weekly Outcomes Database (this week):
1. "Complete app authentication" - Week: [This Monday], Project: Mobile App MVP, Priority: 1
2. "Design user dashboard" - Week: [This Monday], Project: Mobile App MVP, Priority: 2
3. "Schedule team workshops" - Week: [This Monday], Project: Team Training Program, Priority: 3

Now when you use `/plan` in Telegram, you'll see these weekly outcomes to select from!

## Troubleshooting

### "Missing required environment variable"
- Check that all variables in `.env` match `.env.example`
- Ensure no spaces around `=` signs
- Verify tokens and IDs are copied correctly

### "Database not found"
- Verify database IDs are correct (32 characters)
- Ensure integration is connected to ALL 4 databases
- Check database is in the same workspace as integration

### "Unauthorized" from Notion
- Verify NOTION_TOKEN is correct
- Check token hasn't been regenerated
- Ensure integration has proper capabilities

### Bot doesn't respond
- Check TELEGRAM_BOT_TOKEN is correct
- Verify bot is running (`npm run dev` or `npm start`)
- Check logs for errors

### "No weekly outcomes found"
- Add entries to Weekly Outcomes database
- Ensure Week date is set to current week
- Check Status is not "Done"

## Production Deployment

### Option 1: VPS/Server

```bash
# Use PM2 for process management
npm install -g pm2
pm2 start dist/index.js --name notion-planner
pm2 save
pm2 startup
```

### Option 2: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
CMD ["node", "dist/index.js"]
```

### Option 3: Cloud Platform

Deploy to:
- Heroku
- Railway
- Render
- DigitalOcean App Platform

All require:
- Node.js 18+
- Environment variables set
- Build command: `npm run build`
- Start command: `npm start`

## Next Steps

1. Start using `/plan` every morning
2. Update status throughout the day with `/complete` and `/progress`
3. Review your day with `/summary`
4. Plan ahead with `/next`

Happy planning! 🚀
