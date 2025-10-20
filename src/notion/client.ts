import { Client } from '@notionhq/client';
import { config } from '../utils/config';
import {
  Objective,
  Project,
  WeeklyOutcome,
  DailyMIT,
  NotionPage,
} from './types';

export class NotionClient {
  private client: Client;

  constructor() {
    this.client = new Client({ auth: config.notion.token });
  }

  // Helper to extract title from Notion property
  private extractTitle(properties: any, propertyName: string = 'Name'): string {
    const prop = properties[propertyName] || properties['Title'] || properties['title'];
    if (!prop) return 'Untitled';

    if (prop.title && prop.title.length > 0) {
      return prop.title[0]?.plain_text || 'Untitled';
    }
    if (prop.rich_text && prop.rich_text.length > 0) {
      return prop.rich_text[0]?.plain_text || 'Untitled';
    }
    return 'Untitled';
  }

  // Helper to extract select property
  private extractSelect(properties: any, propertyName: string): string | undefined {
    const prop = properties[propertyName];
    return prop?.select?.name;
  }

  // Helper to extract date property
  private extractDate(properties: any, propertyName: string): string | undefined {
    const prop = properties[propertyName];
    return prop?.date?.start;
  }

  // Helper to extract relation property
  private extractRelation(properties: any, propertyName: string): string[] {
    const prop = properties[propertyName];
    if (!prop?.relation) return [];
    return prop.relation.map((rel: any) => rel.id);
  }

  // Helper to extract number property
  private extractNumber(properties: any, propertyName: string): number | undefined {
    const prop = properties[propertyName];
    return prop?.number;
  }

  // Objectives
  async getObjectives(): Promise<Objective[]> {
    const response = await this.client.databases.query({
      database_id: config.notion.databases.objectives,
      filter: {
        or: [
          { property: 'Status', select: { equals: 'Active' } },
          { property: 'Status', select: { equals: 'In Progress' } },
        ],
      },
    });

    return response.results.map((page: any) => ({
      id: page.id,
      title: this.extractTitle(page.properties),
      status: this.extractSelect(page.properties, 'Status'),
      dueDate: this.extractDate(page.properties, 'Due Date'),
    }));
  }

  // Projects
  async getProjects(activeOnly: boolean = true): Promise<Project[]> {
    const filter = activeOnly
      ? {
          or: [
            { property: 'Status', select: { equals: 'Active' } },
            { property: 'Status', select: { equals: 'In Progress' } },
          ],
        }
      : undefined;

    const response = await this.client.databases.query({
      database_id: config.notion.databases.projects,
      filter,
    });

    return response.results.map((page: any) => ({
      id: page.id,
      title: this.extractTitle(page.properties),
      status: this.extractSelect(page.properties, 'Status'),
    }));
  }

  // Weekly Outcomes
  async getWeeklyOutcomes(weekStart: string, weekEnd: string): Promise<WeeklyOutcome[]> {
    const response = await this.client.databases.query({
      database_id: config.notion.databases.weeklyOutcomes,
      filter: {
        and: [
          {
            property: 'Week',
            date: { on_or_after: weekStart },
          },
          {
            property: 'Week',
            date: { on_or_before: weekEnd },
          },
        ],
      },
      sorts: [{ property: 'Priority', direction: 'ascending' }],
    });

    return response.results.map((page: any) => ({
      id: page.id,
      title: this.extractTitle(page.properties),
      week: this.extractDate(page.properties, 'Week') || '',
      status: this.extractSelect(page.properties, 'Status'),
      priority: this.extractNumber(page.properties, 'Priority'),
    }));
  }

  // Daily MITs
  async getDailyMITs(date: string): Promise<DailyMIT[]> {
    const response = await this.client.databases.query({
      database_id: config.notion.databases.dailyMITs,
      filter: {
        property: 'Date',
        date: { equals: date },
      },
      sorts: [{ property: 'Priority', direction: 'ascending' }],
    });

    return response.results.map((page: any) => ({
      id: page.id,
      title: this.extractTitle(page.properties),
      date: this.extractDate(page.properties, 'Date') || date,
      status: (this.extractSelect(page.properties, 'Status') as any) || 'Not Started',
      priority: this.extractNumber(page.properties, 'Priority'),
      estimatedTime: this.extractNumber(page.properties, 'Estimated Time'),
      actualTime: this.extractNumber(page.properties, 'Actual Time'),
    }));
  }

  // Create Daily MIT
  async createDailyMIT(
    title: string,
    date: string,
    options: {
      weeklyOutcomeId?: string;
      projectId?: string;
      priority?: number;
      estimatedTime?: number;
    } = {}
  ): Promise<string> {
    const properties: any = {
      Name: { title: [{ text: { content: title } }] },
      Date: { date: { start: date } },
      Status: { select: { name: 'Not Started' } },
    };

    if (options.weeklyOutcomeId) {
      properties['Weekly Outcome'] = {
        relation: [{ id: options.weeklyOutcomeId }],
      };
    }

    if (options.projectId) {
      properties['Project'] = {
        relation: [{ id: options.projectId }],
      };
    }

    if (options.priority) {
      properties['Priority'] = { number: options.priority };
    }

    if (options.estimatedTime) {
      properties['Estimated Time'] = { number: options.estimatedTime };
    }

    const response = await this.client.pages.create({
      parent: { database_id: config.notion.databases.dailyMITs },
      properties,
    });

    return response.id;
  }

  // Update MIT Status
  async updateMITStatus(mitId: string, status: string): Promise<void> {
    await this.client.pages.update({
      page_id: mitId,
      properties: {
        Status: { select: { name: status } },
      },
    });
  }

  // Update MIT Progress (with actual time)
  async updateMITProgress(mitId: string, actualTime?: number): Promise<void> {
    const properties: any = {
      Status: { select: { name: 'In Progress' } },
    };

    if (actualTime !== undefined) {
      properties['Actual Time'] = { number: actualTime };
    }

    await this.client.pages.update({
      page_id: mitId,
      properties,
    });
  }

  // Get page details (useful for fetching related data)
  async getPage(pageId: string): Promise<any> {
    return await this.client.pages.retrieve({ page_id: pageId });
  }
}
