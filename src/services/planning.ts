import { NotionClient } from '../notion/client';
import { formatDate, getWeekRange } from '../utils/helpers';
import { WeeklyOutcome, DailyMIT } from '../notion/types';

export class PlanningService {
  constructor(private notionClient: NotionClient) {}

  async getWeeklyOutcomes(): Promise<WeeklyOutcome[]> {
    const { start, end } = getWeekRange();
    return await this.notionClient.getWeeklyOutcomes(
      formatDate(new Date(start)),
      formatDate(new Date(end))
    );
  }

  async getTodaysMITs(): Promise<DailyMIT[]> {
    const today = formatDate(new Date());
    return await this.notionClient.getDailyMITs(today);
  }

  async createMIT(
    title: string,
    options: {
      weeklyOutcomeId?: string;
      projectId?: string;
      priority?: number;
      estimatedTime?: number;
    } = {}
  ): Promise<string> {
    const today = formatDate(new Date());
    return await this.notionClient.createDailyMIT(title, today, options);
  }

  async planDailyMITs(weeklyOutcomeIds: string[], customMIT?: string): Promise<string[]> {
    const mitIds: string[] = [];
    let priority = 1;

    // Create MITs from selected weekly outcomes
    for (const outcomeId of weeklyOutcomeIds) {
      const outcome = await this.notionClient.getPage(outcomeId);
      const title = this.extractTitle(outcome.properties);

      const mitId = await this.createMIT(title, {
        weeklyOutcomeId: outcomeId,
        priority: priority++,
      });
      mitIds.push(mitId);
    }

    // Add custom MIT if provided
    if (customMIT) {
      const mitId = await this.createMIT(customMIT, {
        priority: priority++,
      });
      mitIds.push(mitId);
    }

    return mitIds;
  }

  private extractTitle(properties: any): string {
    const titleProp = properties.Name || properties.Title || properties.title;
    if (!titleProp) return 'Untitled';

    if (titleProp.title && titleProp.title.length > 0) {
      return titleProp.title[0]?.plain_text || 'Untitled';
    }
    if (titleProp.rich_text && titleProp.rich_text.length > 0) {
      return titleProp.rich_text[0]?.plain_text || 'Untitled';
    }
    return 'Untitled';
  }

  async suggestNextDayMITs(): Promise<string[]> {
    const weeklyOutcomes = await this.getWeeklyOutcomes();
    const todaysMITs = await this.getTodaysMITs();

    const suggestions: string[] = [];

    // Suggest incomplete MITs from today
    const incompleteMITs = todaysMITs.filter(
      (mit) => mit.status !== 'done'
    );
    incompleteMITs.forEach((mit) => {
      suggestions.push(`[Carry over] ${mit.title}`);
    });

    // Suggest from weekly outcomes that aren't done
    const activeMITTitles = new Set(todaysMITs.map((m) => m.title));
    weeklyOutcomes
      .filter((outcome) => outcome.status !== 'done')
      .slice(0, 3)
      .forEach((outcome) => {
        if (!activeMITTitles.has(outcome.title)) {
          suggestions.push(outcome.title);
        }
      });

    return suggestions.slice(0, 5); // Return top 5 suggestions
  }
}
