import { Context } from 'telegraf';
import { PlanningService } from '../../services/planning';
import { NotionClient } from '../../notion/client';
import { createWeeklyOutcomesKeyboard } from '../keyboards';

const notionClient = new NotionClient();
const planningService = new PlanningService(notionClient);

// Store user selections temporarily (in production, use Redis or similar)
const userSelections = new Map<number, string[]>();

export async function handlePlan(ctx: Context) {
  try {
    const userId = ctx.from?.id;
    if (!userId) return;

    // Check if MITs already exist for today
    const existingMITs = await planningService.getTodaysMITs();
    if (existingMITs.length > 0) {
      await ctx.reply(
        `You already have ${existingMITs.length} MITs planned for today.\n\n` +
        `Use /status to view them or continue to add more.`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                { text: '➕ Add More', callback_data: 'plan_add_more' },
                { text: '📋 View Status', callback_data: 'menu_status' },
              ],
            ],
          },
        }
      );
      return;
    }

    // Get weekly outcomes
    const outcomes = await planningService.getWeeklyOutcomes();

    if (outcomes.length === 0) {
      await ctx.reply(
        '⚠️ No weekly outcomes found for this week.\n\n' +
        'Please add weekly outcomes in Notion first, or create a custom MIT.'
      );
      return;
    }

    // Initialize selections for this user
    userSelections.set(userId, []);

    await ctx.reply(
      `🗓️ Weekly Outcomes\n\n` +
      `Select the outcomes you want to work on today (recommended: 3-5):\n`,
      {
        reply_markup: createWeeklyOutcomesKeyboard(outcomes),
      }
    );
  } catch (error) {
    console.error('Error in handlePlan:', error);
    await ctx.reply('❌ Error loading weekly outcomes. Please try again.');
  }
}

export async function handleOutcomeSelection(ctx: Context, outcomeId: string) {
  try {
    const userId = ctx.from?.id;
    if (!userId) return;

    const selections = userSelections.get(userId) || [];

    if (selections.includes(outcomeId)) {
      // Deselect
      const index = selections.indexOf(outcomeId);
      selections.splice(index, 1);
    } else {
      // Select
      selections.push(outcomeId);
    }

    userSelections.set(userId, selections);
  } catch (error) {
    console.error('Error in handleOutcomeSelection:', error);
  }
}

export async function handleDoneSelecting(ctx: Context) {
  try {
    const userId = ctx.from?.id;
    if (!userId) return;

    const selections = userSelections.get(userId) || [];

    if (selections.length === 0) {
      await ctx.answerCbQuery('⚠️ Please select at least one outcome');
      return;
    }

    await ctx.answerCbQuery('Creating MITs...');
    await ctx.editMessageText('Creating your daily MITs... ⏳');

    // Create MITs from selections
    const mitIds = await planningService.planDailyMITs(selections);

    // Clear selections
    userSelections.delete(userId);

    await ctx.editMessageText(
      `✅ Created ${mitIds.length} MITs for today!\n\n` +
      `Use /status to view your daily plan.`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '📋 View Status', callback_data: 'menu_status' }],
          ],
        },
      }
    );
  } catch (error) {
    console.error('Error in handleDoneSelecting:', error);
    await ctx.reply('❌ Error creating MITs. Please try again.');
  }
}

export async function handleNext(ctx: Context) {
  try {
    await ctx.reply('🔮 Analyzing and suggesting next steps... ⏳');

    const suggestions = await planningService.suggestNextDayMITs();

    if (suggestions.length === 0) {
      await ctx.reply(
        '✨ All caught up! No pending tasks found.\n\n' +
        'Check your weekly outcomes to plan ahead.'
      );
      return;
    }

    const message = [
      '💡 Suggested MITs for Tomorrow:\n',
      ...suggestions.map((s, i) => `${i + 1}. ${s}`),
      '\n📝 Use /plan tomorrow to create these tasks.',
    ].join('\n');

    await ctx.reply(message);
  } catch (error) {
    console.error('Error in handleNext:', error);
    await ctx.reply('❌ Error generating suggestions. Please try again.');
  }
}
