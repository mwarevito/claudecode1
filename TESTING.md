# Testing Guide

## Quick Test Workflow

Once your bot is running, follow this workflow to test all features:

### 1. Initial Setup Test

**Command:** `/start`

**Expected:**
- Welcome message appears
- Main menu keyboard with 6 buttons
- All buttons are clickable

**Command:** `/help`

**Expected:**
- Complete command reference
- Organized by category
- Tips section included

---

### 2. Planning Workflow Test

#### Prerequisites in Notion:
1. Create at least one Objective (Status: Active)
2. Create at least one Project (Status: Active, linked to Objective)
3. Create 2-3 Weekly Outcomes for this week:
   - Set "Week" property to this Monday's date
   - Set "Status" to "Not Started" or "In Progress"
   - Set "Priority" to 1, 2, 3

#### Test Planning

**Command:** `/plan`

**Expected:**
- Shows weekly outcomes for current week
- Each outcome has a selectable button
- "Done Selecting" button at bottom
- Can select/deselect outcomes (counter updates)

**Action:** Select 2-3 outcomes, click "Done Selecting"

**Expected:**
- "Creating MITs..." message
- Success message with count
- "View Status" button appears

---

### 3. Status & Tracking Test

**Command:** `/status`

**Expected:**
- Lists all today's MITs
- Shows status emoji (⭕ for Not Started)
- Shows priority if set
- Shows estimated time if set
- Numbered list (1, 2, 3...)

**Command:** `/progress 1`

**Expected:**
- First MIT marked as "In Progress"
- Confirmation message
- Status emoji changes to 🔄

**Command:** `/complete 2`

**Expected:**
- Second MIT marked as "Done"
- Confirmation message
- Status emoji changes to ✅
- Progress counter shown (e.g., "1/3 MITs completed")

**Test with keyboard:**
- Send `/complete` without number
- Should show inline keyboard with all MITs
- Click one to mark complete

---

### 4. Summary Test

**Command:** `/summary`

**Expected:**
- Shows today's date
- Total MITs count
- Breakdown by status (Completed, In Progress, Not Started, Blocked)
- Completion rate percentage
- List of achievements (completed tasks)

**Command:** `/week`

**Expected:**
- Weekly summary for last 7 days
- Days with MITs count
- Total MITs across the week
- Total completed
- Average completion rate

---

### 5. Context Commands Test

**Command:** `/objectives`

**Expected:**
- Lists all active objectives
- Shows status for each
- Shows due date if set
- Numbered list

**Command:** `/projects`

**Expected:**
- Lists all active projects
- Shows status for each
- Numbered list

---

### 6. Next Steps Test

**Command:** `/next`

**Expected:**
- Analyzes incomplete MITs from today
- Suggests carry-over tasks
- Suggests new tasks from weekly outcomes
- Maximum 5 suggestions
- If all complete: "All caught up!" message

---

## Edge Cases to Test

### Empty States

1. **No Weekly Outcomes**
   - Delete all weekly outcomes for this week
   - Run `/plan`
   - Expected: Warning message about no outcomes

2. **No MITs Today**
   - Don't plan any MITs
   - Run `/status`
   - Expected: "No MITs planned" with "Plan Today" button

3. **No Objectives**
   - Archive all objectives
   - Run `/objectives`
   - Expected: "No active objectives found"

### Error Handling

1. **Invalid Task Number**
   - Run `/complete 999`
   - Expected: "Could not find MIT" error

2. **Invalid Task Name**
   - Run `/complete NonexistentTask`
   - Expected: "Could not find MIT" error

3. **Already Completed**
   - Complete a task
   - Try to complete it again
   - Expected: Should still work (idempotent)

### Concurrent Actions

1. **Multiple Selections**
   - Run `/plan`
   - Rapidly click multiple outcomes
   - Expected: All selections register correctly

2. **Quick Commands**
   - Send multiple commands rapidly
   - Expected: All process correctly, no crashes

---

## Notion Integration Tests

### Database Permissions

1. **Check Integration Access**
   - Go to each database in Notion
   - Verify integration is connected
   - Expected: Integration appears in connections

2. **Create MIT from Bot**
   - Run `/plan` and create MITs
   - Check Notion Daily MITs database
   - Expected: New pages created with correct properties

3. **Update Status from Bot**
   - Mark MIT as complete in Telegram
   - Check Notion
   - Expected: Status updated to "Done"

### Data Validation

1. **Priority Order**
   - Create MITs with different priorities
   - Run `/status`
   - Expected: Listed in priority order

2. **Date Filtering**
   - Create MITs for different dates
   - Run `/status`
   - Expected: Only today's MITs shown

3. **Week Range**
   - Create weekly outcomes for different weeks
   - Run `/plan`
   - Expected: Only current week's outcomes shown

---

## Performance Tests

### Response Time
- All commands should respond within 2-3 seconds
- Notion API calls may take 1-2 seconds
- No command should timeout

### Memory Usage
```bash
# Monitor with PM2
pm2 monit

# Or with Docker
docker stats notion-bot
```

**Expected:**
- Memory: < 100MB idle
- Memory: < 200MB under load
- No memory leaks over time

---

## Automated Testing (Coming Soon)

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

---

## Test Checklist

Before deploying to production:

- [ ] All commands respond correctly
- [ ] Notion integration works (create, read, update)
- [ ] Error messages are user-friendly
- [ ] No console errors during normal operation
- [ ] Inline keyboards work properly
- [ ] Status emojis display correctly
- [ ] Date/time handling is correct
- [ ] Empty states handled gracefully
- [ ] Invalid inputs handled properly
- [ ] Bot recovers from errors
- [ ] Memory usage is stable
- [ ] No data loss on restart

---

## Debugging Tips

### Enable Verbose Logging
Add to your code:
```typescript
console.log('Debug:', JSON.stringify(data, null, 2));
```

### Check Notion API Responses
```typescript
const response = await notionClient.getWeeklyOutcomes();
console.log('Notion response:', response);
```

### Test Notion Queries Directly
Use Notion API playground: https://developers.notion.com/reference/intro

### Monitor Bot Activity
```bash
# PM2
pm2 logs notion-bot --lines 100

# Docker
docker logs -f --tail 100 notion-bot
```

---

## Reporting Issues

When reporting bugs, include:
1. Command that failed
2. Expected behavior
3. Actual behavior
4. Error messages from logs
5. Steps to reproduce
6. Environment (Node version, OS)

---

**Happy Testing!** 🧪
