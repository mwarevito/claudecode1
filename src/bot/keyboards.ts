import { InlineKeyboardMarkup, InlineKeyboardButton } from 'telegraf/types';
import { WeeklyOutcome, DailyMIT } from '../notion/types';

export function createWeeklyOutcomesKeyboard(outcomes: WeeklyOutcome[]): InlineKeyboardMarkup {
  const buttons: InlineKeyboardButton[][] = outcomes.map((outcome) => [
    {
      text: `${outcome.priority ? `[P${outcome.priority}] ` : ''}${outcome.title}`,
      callback_data: `select_outcome:${outcome.id}`,
    },
  ]);

  buttons.push([
    { text: '✅ Done Selecting', callback_data: 'done_selecting' },
    { text: '❌ Cancel', callback_data: 'cancel' },
  ]);

  return { inline_keyboard: buttons };
}

export function createMITActionsKeyboard(mitId: string): InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        { text: '✅ Complete', callback_data: `complete:${mitId}` },
        { text: '🔄 In Progress', callback_data: `progress:${mitId}` },
      ],
      [
        { text: '🚫 Block', callback_data: `block:${mitId}` },
        { text: '❌ Cancel', callback_data: 'cancel' },
      ],
    ],
  };
}

export function createMITListKeyboard(mits: DailyMIT[]): InlineKeyboardMarkup {
  const buttons: InlineKeyboardButton[][] = mits.map((mit, index) => [
    {
      text: `${index + 1}. ${mit.title}`,
      callback_data: `mit_action:${mit.id}`,
    },
  ]);

  buttons.push([{ text: '❌ Cancel', callback_data: 'cancel' }]);

  return { inline_keyboard: buttons };
}

export function createConfirmationKeyboard(action: string, itemId: string): InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        { text: '✅ Yes', callback_data: `confirm:${action}:${itemId}` },
        { text: '❌ No', callback_data: 'cancel' },
      ],
    ],
  };
}

export function createMainMenuKeyboard(): InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        { text: '📋 Plan Today', callback_data: 'menu_plan' },
        { text: '✅ Status', callback_data: 'menu_status' },
      ],
      [
        { text: '📊 Summary', callback_data: 'menu_summary' },
        { text: '➡️ Next Steps', callback_data: 'menu_next' },
      ],
      [
        { text: '🎯 Objectives', callback_data: 'menu_objectives' },
        { text: '📁 Projects', callback_data: 'menu_projects' },
      ],
    ],
  };
}
