import { Context } from 'telegraf';
import { SummaryService } from '../../services/summary';
import { NotionClient } from '../../notion/client';

const notionClient = new NotionClient();
const summaryService = new SummaryService(notionClient);

export async function handleSummary(ctx: Context) {
  try {
    await ctx.reply('📊 Generating summary... ⏳');

    const summary = await summaryService.generateDailySummary();
    const formattedSummary = summaryService.formatSummary(summary);

    await ctx.reply(formattedSummary);

    // Show options
    if (summary.completed === summary.totalMITs && summary.totalMITs > 0) {
      await ctx.reply(
        '🎉 Perfect day! All MITs completed!\n\n' +
        'Use /next to plan tomorrow\'s tasks.',
        {
          reply_markup: {
            inline_keyboard: [[{ text: '➡️ Plan Next', callback_data: 'menu_next' }]],
          },
        }
      );
    }
  } catch (error) {
    console.error('Error in handleSummary:', error);
    await ctx.reply('❌ Error generating summary. Please try again.');
  }
}

export async function handleWeekSummary(ctx: Context) {
  try {
    await ctx.reply('📈 Generating weekly summary... ⏳');

    const weeklySummary = await summaryService.getWeeklySummary();
    await ctx.reply(weeklySummary);
  } catch (error) {
    console.error('Error in handleWeekSummary:', error);
    await ctx.reply('❌ Error generating weekly summary. Please try again.');
  }
}

export async function handleObjectives(ctx: Context) {
  try {
    const objectives = await notionClient.getObjectives();

    if (objectives.length === 0) {
      await ctx.reply('🎯 No active objectives found.');
      return;
    }

    const message = [
      '🎯 Active Objectives:\n',
      ...objectives.map((obj, i) => {
        const priority = obj.status ? `[${obj.status}]` : '';
        const due = obj.dueDate ? `(Due: ${obj.dueDate})` : '';
        return `${i + 1}. ${priority} ${obj.title} ${due}`;
      }),
    ].join('\n');

    await ctx.reply(message);
  } catch (error) {
    console.error('Error in handleObjectives:', error);
    await ctx.reply('❌ Error loading objectives. Please try again.');
  }
}

export async function handleProjects(ctx: Context) {
  try {
    const projects = await notionClient.getProjects();

    if (projects.length === 0) {
      await ctx.reply('📁 No active projects found.');
      return;
    }

    const message = [
      '📁 Active Projects:\n',
      ...projects.map((proj, i) => {
        const status = proj.status ? `[${proj.status}]` : '';
        return `${i + 1}. ${status} ${proj.title}`;
      }),
    ].join('\n');

    await ctx.reply(message);
  } catch (error) {
    console.error('Error in handleProjects:', error);
    await ctx.reply('❌ Error loading projects. Please try again.');
  }
}
