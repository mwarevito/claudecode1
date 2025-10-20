import { Context } from 'telegraf';
import { TrackingService } from '../../services/tracking';
import { PlanningService } from '../../services/planning';
import { NotionClient } from '../../notion/client';
import { createMITActionsKeyboard } from '../keyboards';

const notionClient = new NotionClient();
const trackingService = new TrackingService(notionClient);
const planningService = new PlanningService(notionClient);

export async function handleStatus(ctx: Context) {
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

    const statusMessage = [
      '📊 Today\'s MITs:\n',
      trackingService.formatMITList(mits),
      '\n💡 Quick actions: /complete <number> or /progress <number>',
    ].join('\n');

    await ctx.reply(statusMessage);
  } catch (error) {
    console.error('Error in handleStatus:', error);
    await ctx.reply('❌ Error loading status. Please try again.');
  }
}

export async function handleComplete(ctx: Context) {
  try {
    const text = ctx.message && 'text' in ctx.message ? ctx.message.text : '';
    const args = text.split(' ').slice(1).join(' ');

    const mits = await planningService.getTodaysMITs();

    if (mits.length === 0) {
      await ctx.reply('No MITs found for today.');
      return;
    }

    if (!args) {
      // Show selection keyboard
      await ctx.reply('Which MIT would you like to mark as complete?', {
        reply_markup: {
          inline_keyboard: mits.map((mit, index) => [
            {
              text: `${index + 1}. ${mit.title}`,
              callback_data: `complete:${mit.id}`,
            },
          ]),
        },
      });
      return;
    }

    // Find MIT by title or number
    const mit = await trackingService.findMITByTitle(args, mits);

    if (!mit) {
      await ctx.reply(`❌ Could not find MIT: "${args}"`);
      return;
    }

    await trackingService.completeMIT(mit.id);
    await ctx.reply(`✅ Marked as complete: ${mit.title}`);

    // Show updated status
    const updatedMITs = await planningService.getTodaysMITs();
    const completed = updatedMITs.filter((m) => m.status === 'Done').length;
    const total = updatedMITs.length;

    if (completed === total) {
      await ctx.reply(
        `🎉 Congratulations! All ${total} MITs completed!\n\n` +
        `Use /summary to see your daily summary.`
      );
    } else {
      await ctx.reply(`Progress: ${completed}/${total} MITs completed`);
    }
  } catch (error) {
    console.error('Error in handleComplete:', error);
    await ctx.reply('❌ Error marking task complete. Please try again.');
  }
}

export async function handleProgress(ctx: Context) {
  try {
    const text = ctx.message && 'text' in ctx.message ? ctx.message.text : '';
    const args = text.split(' ').slice(1).join(' ');

    const mits = await planningService.getTodaysMITs();

    if (mits.length === 0) {
      await ctx.reply('No MITs found for today.');
      return;
    }

    if (!args) {
      // Show selection keyboard
      await ctx.reply('Which MIT are you working on?', {
        reply_markup: {
          inline_keyboard: mits.map((mit, index) => [
            {
              text: `${index + 1}. ${mit.title}`,
              callback_data: `progress:${mit.id}`,
            },
          ]),
        },
      });
      return;
    }

    // Find MIT by title or number
    const mit = await trackingService.findMITByTitle(args, mits);

    if (!mit) {
      await ctx.reply(`❌ Could not find MIT: "${args}"`);
      return;
    }

    await trackingService.updateMITProgress(mit.id);
    await ctx.reply(`🔄 Marked as in progress: ${mit.title}`);
  } catch (error) {
    console.error('Error in handleProgress:', error);
    await ctx.reply('❌ Error updating task. Please try again.');
  }
}

export async function handleCompleteCallback(ctx: Context, mitId: string) {
  try {
    await trackingService.completeMIT(mitId);
    await ctx.answerCbQuery('✅ Marked as complete!');

    // Update the message
    const mits = await planningService.getTodaysMITs();
    const mit = mits.find((m) => m.id === mitId);

    if (mit) {
      await ctx.editMessageText(`✅ Completed: ${mit.title}`);
    }
  } catch (error) {
    console.error('Error in handleCompleteCallback:', error);
    await ctx.answerCbQuery('❌ Error');
  }
}

export async function handleProgressCallback(ctx: Context, mitId: string) {
  try {
    await trackingService.updateMITProgress(mitId);
    await ctx.answerCbQuery('🔄 Marked as in progress!');

    const mits = await planningService.getTodaysMITs();
    const mit = mits.find((m) => m.id === mitId);

    if (mit) {
      await ctx.editMessageText(`🔄 In Progress: ${mit.title}`);
    }
  } catch (error) {
    console.error('Error in handleProgressCallback:', error);
    await ctx.answerCbQuery('❌ Error');
  }
}
