import { NotionPlannerBot } from './bot/bot';
import { config } from './utils/config';

async function main() {
  console.log('🚀 Starting Notion Daily Planner Bot...');
  console.log(`📅 Timezone: ${config.timezone}`);

  try {
    // Validate configuration
    if (!config.notion.token) {
      throw new Error('NOTION_TOKEN is required');
    }
    if (!config.telegram.botToken) {
      throw new Error('TELEGRAM_BOT_TOKEN is required');
    }

    console.log('✅ Configuration validated');

    // Initialize and launch bot
    const bot = new NotionPlannerBot();
    await bot.launch();
  } catch (error) {
    console.error('❌ Failed to start bot:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

// Start the application
main();
