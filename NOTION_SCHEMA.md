# Notion Database Schema

Detailed schema specifications for the 4 required Notion databases.

## Overview

The bot requires 4 interconnected databases:

```
Objectives
    ↓ (related to)
Projects
    ↓ (related to)
Weekly Outcomes
    ↓ (related to)
Daily MITs
```

## Database 1: Objectives

High-level goals you want to achieve.

### Properties

| Property Name | Type | Required | Description | Options/Format |
|--------------|------|----------|-------------|----------------|
| Name | Title | ✅ Yes | The objective title | Text |
| Status | Select | ✅ Yes | Current status | Active, In Progress, Done, On Hold |
| Due Date | Date | ❌ No | Target completion | Date only |
| Description | Text | ❌ No | Additional details | Long text |

### Example Entries

```
Name: Launch Q1 Product
Status: In Progress
Due Date: 2024-03-31
Description: Successfully launch MVP to first customers

Name: Build Engineering Team
Status: Active
Due Date: 2024-06-30
Description: Hire and onboard 5 senior engineers
```

### Setup Instructions

1. Create a new database in Notion
2. Name it "Objectives" (or your preference)
3. Add the properties above
4. Configure Select options exactly as listed
5. Share with your integration
6. Copy database ID to `.env` as `NOTION_DB_OBJECTIVES`

---

## Database 2: Projects

Specific projects that support your objectives.

### Properties

| Property Name | Type | Required | Description | Options/Format |
|--------------|------|----------|-------------|----------------|
| Name | Title | ✅ Yes | The project name | Text |
| Status | Select | ✅ Yes | Current status | Active, In Progress, Done, On Hold |
| Objective | Relation | ❌ No | Link to parent objective | → Objectives DB |
| Description | Text | ❌ No | Project details | Long text |

### Example Entries

```
Name: Mobile App MVP
Status: In Progress
Objective: [Link to "Launch Q1 Product"]
Description: Build core features for iOS and Android

Name: Recruitment Pipeline
Status: Active
Objective: [Link to "Build Engineering Team"]
Description: Source and interview candidates
```

### Setup Instructions

1. Create a new database named "Projects"
2. Add all properties
3. For Objective property:
   - Type: Relation
   - Link to: Objectives database
   - Show on Objectives: Optional
4. Share with your integration
5. Copy database ID to `.env` as `NOTION_DB_PROJECTS`

---

## Database 3: Weekly Outcomes

Weekly goals derived from your projects.

### Properties

| Property Name | Type | Required | Description | Options/Format |
|--------------|------|----------|-------------|----------------|
| Name | Title | ✅ Yes | The outcome description | Text |
| Week | Date | ✅ Yes | Week start date (Monday) | Date only |
| Project | Relation | ❌ No | Link to parent project | → Projects DB |
| Status | Select | ✅ Yes | Current status | Not Started, In Progress, Done |
| Priority | Number | ❌ No | Priority ranking | 1-5 (1 = highest) |

### Example Entries

```
Name: Complete user authentication flow
Week: 2024-01-15 (Monday of this week)
Project: [Link to "Mobile App MVP"]
Status: In Progress
Priority: 1

Name: Design onboarding screens
Week: 2024-01-15
Project: [Link to "Mobile App MVP"]
Status: Not Started
Priority: 2

Name: Screen 10 candidates
Week: 2024-01-15
Project: [Link to "Recruitment Pipeline"]
Status: Not Started
Priority: 3
```

### Setup Instructions

1. Create database named "Weekly Outcomes"
2. Add all properties
3. For Project property:
   - Type: Relation
   - Link to: Projects database
4. Important: Set Week to **Monday** of each week
5. Share with integration
6. Copy database ID to `.env` as `NOTION_DB_WEEKLY_OUTCOMES`

### Usage Notes

- The bot filters by current week when showing planning options
- Always set Week to the Monday start date
- Lower Priority numbers appear first (1 = highest priority)

---

## Database 4: Daily MITs

Most Important Tasks for each day.

### Properties

| Property Name | Type | Required | Description | Options/Format |
|--------------|------|----------|-------------|----------------|
| Name | Title | ✅ Yes | The task description | Text |
| Date | Date | ✅ Yes | The day for this MIT | Date only |
| Status | Select | ✅ Yes | Current status | Not Started, In Progress, Done, Blocked |
| Weekly Outcome | Relation | ❌ No | Link to outcome | → Weekly Outcomes DB |
| Project | Relation | ❌ No | Link to project | → Projects DB |
| Priority | Number | ❌ No | Daily priority | 1-5 (1 = highest) |
| Estimated Time | Number | ❌ No | Estimated hours | Number (0.5, 1, 2, etc.) |
| Actual Time | Number | ❌ No | Actual hours spent | Number |

### Example Entries

```
Name: Implement OAuth integration
Date: 2024-01-17
Status: In Progress
Weekly Outcome: [Link to "Complete user authentication flow"]
Project: [Link to "Mobile App MVP"]
Priority: 1
Estimated Time: 4
Actual Time: 3.5

Name: Review pull requests
Date: 2024-01-17
Status: Done
Project: [Link to "Mobile App MVP"]
Priority: 2
Estimated Time: 1
Actual Time: 0.5

Name: Team standup and planning
Date: 2024-01-17
Status: Done
Priority: 3
Estimated Time: 0.5
Actual Time: 0.5
```

### Setup Instructions

1. Create database named "Daily MITs"
2. Add all properties
3. For Weekly Outcome property:
   - Type: Relation
   - Link to: Weekly Outcomes database
4. For Project property:
   - Type: Relation
   - Link to: Projects database
5. Share with integration
6. Copy database ID to `.env` as `NOTION_DB_DAILY_MITS`

### Usage Notes

- Bot auto-creates MITs when you use `/plan`
- Status updates via `/complete`, `/progress` commands
- Actual Time can be manually updated in Notion
- Date should be set to specific day (not date range)

---

## Select Property Options

**IMPORTANT:** Select property options must match exactly (case-sensitive).

### Objectives & Projects Status Options
```
Active
In Progress
Done
On Hold
```

### Weekly Outcomes Status Options
```
Not Started
In Progress
Done
```

### Daily MITs Status Options
```
Not Started
In Progress
Done
Blocked
```

---

## Database Relations Diagram

```
┌─────────────┐
│ Objectives  │
└──────┬──────┘
       │
       │ (1-to-many)
       │
┌──────▼──────┐
│  Projects   │
└──────┬──────┘
       │
       │ (1-to-many)
       │
┌──────▼──────────┐
│ Weekly Outcomes │
└──────┬──────────┘
       │
       │ (1-to-many)
       │
┌──────▼──────┐
│ Daily MITs  │
└─────────────┘
```

---

## Validation Checklist

Before running the bot, verify:

- [ ] All 4 databases created
- [ ] All required properties added with exact names
- [ ] Select options match exactly (case-sensitive)
- [ ] Relations properly linked between databases
- [ ] Integration shared with all 4 databases
- [ ] Database IDs copied to `.env`
- [ ] At least one entry in each database for testing

---

## Sample Data SQL-style

```sql
-- Objectives
INSERT INTO Objectives (Name, Status, Due Date)
VALUES ('Launch Q1 Product', 'In Progress', '2024-03-31');

-- Projects
INSERT INTO Projects (Name, Status, Objective)
VALUES ('Mobile App MVP', 'In Progress', [Objectives:Launch Q1 Product]);

-- Weekly Outcomes (this week)
INSERT INTO Weekly_Outcomes (Name, Week, Project, Status, Priority)
VALUES ('Complete authentication', '2024-01-15', [Projects:Mobile App MVP], 'In Progress', 1);

-- Daily MITs (today)
INSERT INTO Daily_MITs (Name, Date, Status, Weekly_Outcome, Priority)
VALUES ('Implement OAuth', '2024-01-17', 'Not Started', [Weekly_Outcomes:Complete authentication], 1);
```

---

## Tips for Organizing

### Best Practices

1. **Keep Objectives broad** (3-6 month goals)
2. **Projects are specific** (1-3 month deliverables)
3. **Weekly Outcomes are concrete** (achievable in one week)
4. **Daily MITs are actionable** (2-4 hours each, 3-5 per day)

### Recommended Flow

1. **Monday morning**: Review objectives → Plan weekly outcomes
2. **Each morning**: Select 3-5 MITs from weekly outcomes using `/plan`
3. **Throughout day**: Update status with `/complete` and `/progress`
4. **End of day**: Review with `/summary`
5. **Evening before**: Preview tomorrow with `/next`

---

## Need Help?

If your databases aren't working:

1. Check property names match **exactly** (case-sensitive)
2. Verify Select options are correct
3. Ensure relations point to correct databases
4. Confirm integration has access to all databases
5. Test with sample data first

See `SETUP.md` for more troubleshooting tips.
