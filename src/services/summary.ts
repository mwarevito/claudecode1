import { NotionClient } from '../notion/client';
import { formatDate } from '../utils/helpers';
import { DailyMIT, DailySummary } from '../notion/types';

export class SummaryService {
  constructor(private notionClient: NotionClient) {}

  async generateDailySummary(date?: string): Promise<DailySummary> {
    const targetDate = date || formatDate(new Date());
    const mits = await this.notionClient.getDailyMITs(targetDate);

    const completed = mits.filter((mit) => mit.status === 'done').length;
    const inProgress = mits.filter((mit) => mit.status === 'wip').length;
    const notStarted = mits.filter((mit) => mit.status === 'planned').length;
    const blocked = mits.filter((mit) => mit.status === 'skipped').length;

    const completionRate = mits.length > 0 ? (completed / mits.length) * 100 : 0;

    const achievements = mits
      .filter((mit) => mit.status === 'done')
      .map((mit) => mit.title);

    return {
      date: targetDate,
      totalMITs: mits.length,
      completed,
      inProgress,
      notStarted,
      blocked,
      completionRate: Math.round(completionRate),
      achievements,
    };
  }

  formatSummary(summary: DailySummary): string {
    const lines = [
      `📊 Daily Summary - ${summary.date}`,
      ``,
      `Total MITs: ${summary.totalMITs}`,
      `✅ Completed: ${summary.completed}`,
      `🔄 In Progress: ${summary.inProgress}`,
      `⭕ Not Started: ${summary.notStarted}`,
      `🚫 Blocked: ${summary.blocked}`,
      ``,
      `Completion Rate: ${summary.completionRate}%`,
    ];

    if (summary.achievements.length > 0) {
      lines.push('', '🎯 Achievements:');
      summary.achievements.forEach((achievement) => {
        lines.push(`  • ${achievement}`);
      });
    }

    return lines.join('\n');
  }

  async getWeeklySummary(): Promise<string> {
    // Simple implementation - can be expanded
    const today = new Date();
    const summaries: DailySummary[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const summary = await this.generateDailySummary(formatDate(date));
      if (summary.totalMITs > 0) {
        summaries.push(summary);
      }
    }

    const totalCompleted = summaries.reduce((sum, s) => sum + s.completed, 0);
    const totalMITs = summaries.reduce((sum, s) => sum + s.totalMITs, 0);
    const avgCompletion = totalMITs > 0 ? (totalCompleted / totalMITs) * 100 : 0;

    return [
      `📈 Weekly Summary (Last 7 Days)`,
      ``,
      `Days with MITs: ${summaries.length}`,
      `Total MITs: ${totalMITs}`,
      `Completed: ${totalCompleted}`,
      `Average Completion: ${Math.round(avgCompletion)}%`,
    ].join('\n');
  }
}
