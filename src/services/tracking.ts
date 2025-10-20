import { NotionClient } from '../notion/client';
import { DailyMIT } from '../notion/types';

export class TrackingService {
  constructor(private notionClient: NotionClient) {}

  async completeMIT(mitId: string): Promise<void> {
    await this.notionClient.updateMITStatus(mitId, 'done');
  }

  async updateMITProgress(mitId: string, actualTime?: number): Promise<void> {
    await this.notionClient.updateMITProgress(mitId, actualTime);
  }

  async blockMIT(mitId: string): Promise<void> {
    await this.notionClient.updateMITStatus(mitId, 'skipped');
  }

  async findMITByTitle(title: string, mits: DailyMIT[]): Promise<DailyMIT | null> {
    const normalized = title.toLowerCase().trim();

    // Exact match
    let found = mits.find((mit) => mit.title.toLowerCase() === normalized);
    if (found) return found;

    // Partial match
    found = mits.find((mit) => mit.title.toLowerCase().includes(normalized));
    if (found) return found;

    // Fuzzy match by index
    const index = parseInt(title);
    if (!isNaN(index) && index > 0 && index <= mits.length) {
      return mits[index - 1];
    }

    return null;
  }

  getStatusEmoji(status: string): string {
    switch (status) {
      case 'done':
        return '✅';
      case 'wip':
        return '🔄';
      case 'skipped':
        return '⏭️';
      case 'planned':
      default:
        return '⭕';
    }
  }

  formatMITList(mits: DailyMIT[]): string {
    if (mits.length === 0) {
      return 'No MITs planned for today.';
    }

    return mits
      .map((mit, index) => {
        const emoji = this.getStatusEmoji(mit.status);
        const priority = mit.priority ? `[P${mit.priority}]` : '';
        const time = mit.estimatedTime ? `(~${mit.estimatedTime}h)` : '';
        return `${index + 1}. ${emoji} ${priority} ${mit.title} ${time}`;
      })
      .join('\n');
  }
}
