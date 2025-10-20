# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2024-10-20

### Added
- Initial release
- Telegram bot integration with Telegraf
- Notion API integration for 4 databases (Objectives, Projects, Weekly Outcomes, Daily MITs)
- Core commands:
  - `/start` - Welcome and quick start
  - `/help` - Command reference
  - `/plan` - Daily planning from weekly outcomes
  - `/status` - View today's MITs
  - `/complete` - Mark tasks as done
  - `/progress` - Update task progress
  - `/summary` - Daily completion summary
  - `/week` - Weekly summary
  - `/objectives` - View active objectives
  - `/projects` - List active projects
  - `/next` - Suggest tomorrow's tasks
- Interactive inline keyboards for task selection
- Automatic MIT creation from weekly outcomes
- Status tracking (Not Started, In Progress, Done, Blocked)
- Priority-based task ordering
- Completion rate calculation
- TypeScript implementation with strict typing
- Comprehensive documentation (README, SETUP, QUICKSTART, DEPLOYMENT)
- Docker support with multi-stage builds
- PM2 configuration for production deployment
- Configuration validation script
- GitHub Actions CI workflow
- Deployment scripts (setup.sh, deploy.sh)

### Features
- 📋 Daily planning workflow
- ✅ Real-time task tracking
- 📊 Daily and weekly summaries
- 🎯 Objectives and projects overview
- 💡 Smart next-day suggestions
- 🔄 Carry-over incomplete tasks
- ⚡ Quick actions via inline keyboards

### Technical
- Node.js 18+ support
- TypeScript 5.3+
- Notion SDK 2.2.15
- Telegraf 4.15.0
- Date-fns for date handling
- Environment-based configuration
- Error handling and logging
- Graceful shutdown handling

## [Unreleased]

### Planned
- Custom MIT creation (manual entry)
- Time tracking enhancements
- Recurring tasks support
- Voice message commands
- Multi-user support
- Webhook mode option
- Unit tests
- Integration tests
- Prettier configuration
- ESLint setup
