import { format, startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns';

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatDateTime(date: Date): string {
  return format(date, 'yyyy-MM-dd HH:mm:ss');
}

export function getTodayRange(): { start: string; end: string } {
  const now = new Date();
  return {
    start: startOfDay(now).toISOString(),
    end: endOfDay(now).toISOString(),
  };
}

export function getWeekRange(): { start: string; end: string } {
  const now = new Date();
  return {
    start: startOfWeek(now, { weekStartsOn: 1 }).toISOString(), // Monday
    end: endOfWeek(now, { weekStartsOn: 1 }).toISOString(),
  };
}

export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

export function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}
