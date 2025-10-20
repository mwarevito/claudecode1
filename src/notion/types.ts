export interface NotionPage {
  id: string;
  created_time: string;
  last_edited_time: string;
  properties: any;
}

export interface Objective {
  id: string;
  title: string;
  status?: string;
  description?: string;
  dueDate?: string;
}

export interface Project {
  id: string;
  title: string;
  status?: string;
  objective?: Objective;
  description?: string;
}

export interface WeeklyOutcome {
  id: string;
  title: string;
  week: string;
  project?: Project;
  status?: string;
  priority?: number;
}

export interface DailyMIT {
  id: string;
  title: string;
  date: string;
  status: 'Not Started' | 'In Progress' | 'Done' | 'Blocked';
  weeklyOutcome?: WeeklyOutcome;
  project?: Project;
  objective?: Objective;
  priority?: number;
  estimatedTime?: number;
  actualTime?: number;
  notes?: string;
}

export interface DailySummary {
  date: string;
  totalMITs: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  blocked: number;
  completionRate: number;
  achievements: string[];
}
