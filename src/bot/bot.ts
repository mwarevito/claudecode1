import { Telegraf, Context } from 'telegraf';
import { config } from '../utils/config';
import { handleStart, handleHelp } from './commands/start';
import {
  handlePlan,
  handleOutcomeSelection,
  handleDoneSelecting,
  handleNext,
} from './commands/planning';
import {
  handleStatus,
  handleComplete,
  handleProgress,
  handleCompleteCallback,
  handleProgressCallback,
} from './commands/tracking';
import {
  handleSummary,
  handleWeekSummary,
  handleObjectives,
  handleProjects,
} from './commands/reporting';
import {
  handleManageMITs,
  handleMITSelection,
  handleMITAction,
  handleMITDelete,
  handleBackToList,
  handleNoteInput,
} from './commands/manage';
import { createMainMenuKeyboard } from './keyboards';

export class NotionPlannerBot {
  private bot: Telegraf;

  constructor() {
    this.bot = new Telegraf(config.telegram.botToken);
    this.setupCommands();
    this.setupCallbacks();
    this.setupErrorHandling();
  }

  private setupCommands() {
    // Basic commands
    this.bot.command('start', handleStart);
    this.bot.command('help', handleHelp);

    // Planning commands
    this.bot.command('plan', handlePlan);
    this.bot.command('next', handleNext);

    // Tracking commands
    this.bot.command('status', handleStatus);
    this.bot.command('complete', handleComplete);
    this.bot.command('progress', handleProgress);
    this.bot.command('mits', handleManageMITs);

    // Reporting commands
    this.bot.command('summary', handleSummary);
    this.bot.command('week', handleWeekSummary);
    this.bot.command('objectives', handleObjectives);
    this.bot.command('projects', handleProjects);
  }

  private setupCallbacks() {
    // Main menu callbacks
    this.bot.action('menu_plan', async (ctx) => {
      await ctx.answerCbQuery();
      await handlePlan(ctx);
    });

    this.bot.action('menu_status', async (ctx) => {
      await ctx.answerCbQuery();
      await handleStatus(ctx);
    });

    this.bot.action('menu_summary', async (ctx) => {
      await ctx.answerCbQuery();
      await handleSummary(ctx);
    });

    this.bot.action('menu_next', async (ctx) => {
      await ctx.answerCbQuery();
      await handleNext(ctx);
    });

    this.bot.action('menu_objectives', async (ctx) => {
      await ctx.answerCbQuery();
      await handleObjectives(ctx);
    });

    this.bot.action('menu_projects', async (ctx) => {
      await ctx.answerCbQuery();
      await handleProjects(ctx);
    });

    // Planning callbacks
    this.bot.action(/^select_outcome:(.+)$/, async (ctx) => {
      await ctx.answerCbQuery();
      const outcomeId = ctx.match[1];
      await handleOutcomeSelection(ctx, outcomeId);
    });

    this.bot.action('done_selecting', async (ctx) => {
      await ctx.answerCbQuery();
      await handleDoneSelecting(ctx);
    });

    this.bot.action('plan_add_more', async (ctx) => {
      await ctx.answerCbQuery();
      await ctx.editMessageText('Select additional outcomes to add:');
      await handlePlan(ctx);
    });

    // Tracking callbacks
    this.bot.action(/^complete:(.+)$/, async (ctx) => {
      await ctx.answerCbQuery();
      const mitId = ctx.match[1];
      await handleCompleteCallback(ctx, mitId);
    });

    this.bot.action(/^progress:(.+)$/, async (ctx) => {
      await ctx.answerCbQuery();
      const mitId = ctx.match[1];
      await handleProgressCallback(ctx, mitId);
    });

    // MIT Management callbacks
    this.bot.action(/^manage_mit:(.+)$/, async (ctx) => {
      await ctx.answerCbQuery();
      const mitId = ctx.match[1];
      await handleMITSelection(ctx, mitId);
    });

    this.bot.action(/^mit_action:(\w+):(.+)$/, async (ctx) => {
      await ctx.answerCbQuery();
      const action = ctx.match[1];
      const mitId = ctx.match[2];
      await handleMITAction(ctx, action, mitId);
    });

    this.bot.action(/^mit_confirm_delete:(.+)$/, async (ctx) => {
      await ctx.answerCbQuery();
      const mitId = ctx.match[1];
      await handleMITDelete(ctx, mitId);
    });

    this.bot.action('manage_back', async (ctx) => {
      await ctx.answerCbQuery();
      await handleBackToList(ctx);
    });

    // Cancel action
    this.bot.action('cancel', async (ctx) => {
      await ctx.answerCbQuery('Cancelled');
      await ctx.editMessageText('Action cancelled.', {
        reply_markup: createMainMenuKeyboard(),
      });
    });
  }

  private setupErrorHandling() {
    this.bot.catch((err, ctx) => {
      console.error('Bot error:', err);
      ctx.reply('❌ An error occurred. Please try again later.');
    });

    // Handle unknown commands
    this.bot.on('message', async (ctx) => {
      const text = 'text' in ctx.message ? ctx.message.text : '';
      if (text && text.startsWith('/')) {
        await ctx.reply(
          '❓ Unknown command. Use /help to see available commands.',
          {
            reply_markup: createMainMenuKeyboard(),
          }
        );
      }
    });
  }

  async launch() {
    try {
      // Enable graceful stop
      process.once('SIGINT', () => this.bot.stop('SIGINT'));
      process.once('SIGTERM', () => this.bot.stop('SIGTERM'));

      await this.bot.launch();
      console.log('🤖 Bot started successfully!');
      
      // Set bot commands for menu button (after launch)
      await this.bot.telegram.setMyCommands([
        { command: 'start', description: '🏠 Main menu' },
        { command: 'plan', description: '📋 Plan today\'s MITs' },
        { command: 'status', description: '✅ View today\'s MITs' },
        { command: 'mits', description: '🎯 Manage MITs (interactive)' },
        { command: 'complete', description: '✅ Mark task complete' },
        { command: 'progress', description: '🔄 Mark as in progress' },
        { command: 'summary', description: '📊 Daily summary' },
        { command: 'week', description: '📈 Weekly summary' },
        { command: 'objectives', description: '🎯 View objectives' },
        { command: 'projects', description: '📁 View projects' },
        { command: 'next', description: '➡️ Plan next day' },
        { command: 'help', description: '❓ Show help' },
      ]);
      console.log('✅ Menu button configured');
      console.log('Press Ctrl+C to stop');
    } catch (error) {
      console.error('Failed to start bot:', error);
      process.exit(1);
    }
  }

  async stop() {
    await this.bot.stop();
    console.log('Bot stopped');
  }
}
