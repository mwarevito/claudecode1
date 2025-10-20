import dotenv from 'dotenv';

dotenv.config();

export interface Config {
  notion: {
    token: string;
    databases: {
      objectives: string;
      projects: string;
      weeklyOutcomes: string;
      dailyMITs: string;
    };
  };
  telegram: {
    botToken: string;
  };
  timezone: string;
}

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config: Config = {
  notion: {
    token: getEnvVar('NOTION_TOKEN'),
    databases: {
      objectives: getEnvVar('NOTION_DB_OBJECTIVES'),
      projects: getEnvVar('NOTION_DB_PROJECTS'),
      weeklyOutcomes: getEnvVar('NOTION_DB_WEEKLY_OUTCOMES'),
      dailyMITs: getEnvVar('NOTION_DB_DAILY_MITS'),
    },
  },
  telegram: {
    botToken: getEnvVar('TELEGRAM_BOT_TOKEN'),
  },
  timezone: process.env.TIMEZONE || 'UTC',
};
