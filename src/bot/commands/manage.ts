import { Context } from 'telegraf';
import { PlanningService } from '../../services/planning';
import { TrackingService } from '../../services/tracking';
import { NotionClient } from '../../notion/client';
import { InlineKeyboardMarkup } from 'telegraf/types';

const notionClient = new NotionClient();
const planningService = new PlanningService(notionClient);
const trackingService = new TrackingService(notionClient);

// Store for managing multi-step flows
const userContext = new Map<number, { mitId: string; mitTitle: string }>();

export async function handleManageMITs(ctx: Context) {
  try {
    const mits = await planningService.getTodaysMITs();

    if (mits.length === 0) {
      await ctx.reply(
        '📋 No MITs planned for today.\n\n' +
        'Use /plan to create your daily plan.',
        {
          reply_markup: {
            inline_keyboard: [[{ text: '📋 Plan Today', callback_data: 'menu_plan' }]],
          },
        }
      );
      return;
    }

    // Create keyboard with all MITs
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        ...mits.map((mit, index) => {
          const emoji = trackingService.getStatusEmoji(mit.status);
          return [{
            text: `${index + 1}. ${emoji} ${mit.title}`,
            callback_data: `manage_mit:${mit.id}`,
          }];
        }),
        [{ text: '❌ Cancel', callback_data: 'cancel' }],
      ],
    };

    await ctx.reply(
      '🎯 Select a MIT to manage:\n\n' +
      'Choose a task to edit, complete, or add notes.',
      { reply_markup: keyboard }
    );
  } catch (error) {
    console.error('Error in handleManageMITs:', error);
    await ctx.reply('❌ Error loading MITs. Please try again.');
  }
}

export async function handleMITSelection(ctx: Context, mitId: string) {
  try {
    const mits = await planningService.getTodaysMITs();
    const mit = mits.find((m) => m.id === mitId);

    if (!mit) {
      await ctx.answerCbQuery('❌ MIT not found');
      return;
    }

    // Store context for this user
    const userId = ctx.from?.id;
    if (userId) {
      userContext.set(userId, { mitId: mit.id, mitTitle: mit.title });
    }

    const emoji = trackingService.getStatusEmoji(mit.status);
    const statusText = mit.status.toUpperCase();

    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          { text: '✅ Complete', callback_data: `mit_action:complete:${mitId}` },
          { text: '🔄 In Progress', callback_data: `mit_action:progress:${mitId}` },
        ],
        [
          { text: '⏭️ Skip', callback_data: `mit_action:skip:${mitId}` },
          { text: '📝 Add Note', callback_data: `mit_action:note:${mitId}` },
        ],
        [
          { text: '🗑️ Delete', callback_data: `mit_action:delete:${mitId}` },
        ],
        [
          { text: '⬅️ Back to List', callback_data: 'manage_back' },
          { text: '❌ Cancel', callback_data: 'cancel' },
        ],
      ],
    };

    await ctx.editMessageText(
      `${emoji} **${mit.title}**\n\n` +
      `Status: ${statusText}\n` +
      `Priority: ${mit.priority || 'Not set'}\n\n` +
      `What would you like to do?`,
      { 
        reply_markup: keyboard,
        parse_mode: 'Markdown',
      }
    );
  } catch (error) {
    console.error('Error in handleMITSelection:', error);
    await ctx.answerCbQuery('❌ Error');
  }
}

export async function handleMITAction(ctx: Context, action: string, mitId: string) {
  try {
    const mits = await planningService.getTodaysMITs();
    const mit = mits.find((m) => m.id === mitId);

    if (!mit) {
      await ctx.answerCbQuery('❌ MIT not found');
      return;
    }

    switch (action) {
      case 'complete':
        await trackingService.completeMIT(mitId);
        await ctx.editMessageText(
          `✅ **Completed!**\n\n${mit.title}\n\nGreat job! 🎉`,
          { parse_mode: 'Markdown' }
        );
        break;

      case 'progress':
        await trackingService.updateMITProgress(mitId);
        await ctx.editMessageText(
          `🔄 **In Progress**\n\n${mit.title}\n\nKeep going! 💪`,
          { parse_mode: 'Markdown' }
        );
        break;

      case 'skip':
        await trackingService.blockMIT(mitId);
        await ctx.editMessageText(
          `⏭️ **Skipped**\n\n${mit.title}\n\nMoved to skipped.`,
          { parse_mode: 'Markdown' }
        );
        break;

      case 'note':
        const userId = ctx.from?.id;
        if (userId) {
          userContext.set(userId, { mitId, mitTitle: mit.title });
        }
        await ctx.editMessageText(
          `📝 **Add Note**\n\n${mit.title}\n\n` +
          `Please send your note as a text message.\n\n` +
          `(Send /cancel to abort)`,
          { parse_mode: 'Markdown' }
        );
        break;

      case 'delete':
        // Show confirmation
        const keyboard: InlineKeyboardMarkup = {
          inline_keyboard: [
            [
              { text: '✅ Yes, Delete', callback_data: `mit_confirm_delete:${mitId}` },
              { text: '❌ No, Cancel', callback_data: 'cancel' },
            ],
          ],
        };
        await ctx.editMessageText(
          `🗑️ **Delete MIT?**\n\n${mit.title}\n\n` +
          `Are you sure you want to delete this task?`,
          { 
            reply_markup: keyboard,
            parse_mode: 'Markdown',
          }
        );
        break;
    }
  } catch (error) {
    console.error('Error in handleMITAction:', error);
    await ctx.answerCbQuery('❌ Error');
  }
}

export async function handleMITDelete(ctx: Context, mitId: string) {
  try {
    const mits = await planningService.getTodaysMITs();
    const mit = mits.find((m) => m.id === mitId);

    if (!mit) {
      await ctx.answerCbQuery('❌ MIT not found');
      return;
    }

    // Archive the page in Notion (soft delete)
    await notionClient.archivePage(mitId);

    await ctx.editMessageText(
      `🗑️ **Deleted**\n\n${mit.title}\n\nTask has been removed.`,
      { parse_mode: 'Markdown' }
    );
  } catch (error) {
    console.error('Error in handleMITDelete:', error);
    await ctx.answerCbQuery('❌ Error deleting MIT');
  }
}

export async function handleNoteInput(ctx: Context) {
  try {
    const userId = ctx.from?.id;
    if (!userId) return;

    const context = userContext.get(userId);
    if (!context) return;

    const text = 'text' in ctx.message! ? ctx.message.text : '';
    if (!text || text.startsWith('/')) return;

    // Add note to Notion
    await notionClient.addNoteToMIT(context.mitId, text);

    await ctx.reply(
      `📝 **Note Added!**\n\n` +
      `Task: ${context.mitTitle}\n` +
      `Note: ${text}\n\n` +
      `✅ Saved to Notion!`,
      { parse_mode: 'Markdown' }
    );

    // Clear context
    userContext.delete(userId);
  } catch (error) {
    console.error('Error in handleNoteInput:', error);
    await ctx.reply('❌ Error saving note. Please try again.');
  }
}

export async function handleBackToList(ctx: Context) {
  await handleManageMITs(ctx);
}
