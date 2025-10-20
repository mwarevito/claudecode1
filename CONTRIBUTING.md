# Contributing Guide

Thank you for considering contributing to the Notion Telegram Bot!

## Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/claudecode1.git
   cd claudecode1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your test credentials
   ```

4. **Run in development mode**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── bot/
│   ├── bot.ts              # Main bot setup
│   ├── commands/           # Command handlers
│   │   ├── start.ts        # /start, /help
│   │   ├── planning.ts     # /plan, /next
│   │   ├── tracking.ts     # /status, /complete, /progress
│   │   └── reporting.ts    # /summary, /week, /objectives, /projects
│   └── keyboards.ts        # Telegram inline keyboards
├── notion/
│   ├── client.ts           # Notion API wrapper
│   └── types.ts            # TypeScript types
├── services/
│   ├── planning.ts         # Planning logic
│   ├── tracking.ts         # Task tracking
│   └── summary.ts          # Summary generation
├── utils/
│   ├── config.ts           # Configuration management
│   └── helpers.ts          # Utility functions
└── index.ts                # Entry point
```

## Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Use Prettier (will be added)
- **Naming**: camelCase for variables, PascalCase for classes
- **Async/Await**: Prefer over promises
- **Error Handling**: Always use try/catch blocks

## Adding a New Command

1. **Create handler in appropriate file** (`src/bot/commands/`)
   ```typescript
   export async function handleMyCommand(ctx: Context) {
     try {
       // Your logic here
       await ctx.reply('Response');
     } catch (error) {
       console.error('Error in handleMyCommand:', error);
       await ctx.reply('❌ Error message');
     }
   }
   ```

2. **Register in bot.ts**
   ```typescript
   this.bot.command('mycommand', handleMyCommand);
   ```

3. **Update help text** in `commands/start.ts`

4. **Test thoroughly** before submitting PR

## Testing

Currently manual testing. Automated tests coming soon!

**Manual Test Checklist:**
- [ ] Command responds correctly
- [ ] Error handling works
- [ ] Notion data updates correctly
- [ ] Telegram formatting looks good
- [ ] No console errors

## Submitting Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make your changes**
   - Write clean, documented code
   - Follow existing patterns
   - Test thoroughly

3. **Commit with clear messages**
   ```bash
   git commit -m "Add: New feature description"
   ```
   
   Commit prefixes:
   - `Add:` New features
   - `Fix:` Bug fixes
   - `Update:` Changes to existing features
   - `Refactor:` Code improvements
   - `Docs:` Documentation only

4. **Push and create PR**
   ```bash
   git push origin feature/my-new-feature
   ```

## Feature Ideas

- [ ] Custom MIT creation (not from weekly outcomes)
- [ ] Time tracking integration
- [ ] Recurring tasks
- [ ] Voice message support
- [ ] Weekly planning wizard
- [ ] Analytics and insights
- [ ] Multi-user support
- [ ] Webhook mode (instead of polling)

## Questions?

Open an issue or discussion on GitHub!
