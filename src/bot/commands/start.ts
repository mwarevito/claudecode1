import { Context } from 'telegraf';
import { createMainMenuKeyboard } from '../keyboards';

export async function handleStart(ctx: Context) {
  const welcomeMessage = `
👋 Welcome to Notion Daily Planner!

I help you streamline your daily MIT planning, track progress, and generate summaries.

🎯 Quick Commands:
• /plan - Start daily planning
• /status - View today's MITs
• /complete - Mark task complete
• /summary - Get daily summary
• /next - Plan next steps

📚 More Commands:
• /objectives - View objectives
• /projects - List projects
• /week - Show weekly outcomes
• /help - Full command list

Let's get started! What would you like to do?
  `.trim();

  await ctx.reply(welcomeMessage, {
    reply_markup: createMainMenuKeyboard(),
  });
}

export async function handleHelp(ctx: Context) {
  const helpMessage = `
📖 Command Reference

📋 Planning:
• /plan - Start daily planning session
• /next - Plan tomorrow's MITs with suggestions

✅ Tracking:
• /status - View today's MITs and status
• /mits - 🆕 Manage MITs interactively (edit/delete/complete/note)
• /complete <task> - Mark task as done
• /progress <task> - Mark as in progress

📊 Reporting:
• /summary - Today's completion summary
• /week - Weekly outcomes overview

🗂️ Context:
• /objectives - View active objectives
• /projects - List active projects

💡 Tips:
- Use /mits for full MIT management with buttons
- Use task numbers (e.g., /complete 1) for quick actions
- Click the menu button (☰) to see all commands
- Tasks link automatically to projects and objectives

Need more help? Visit the GitHub repo or contact support.
  `.trim();

  await ctx.reply(helpMessage);
}
