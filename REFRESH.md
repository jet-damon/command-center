# Dashboard Auto-Refresh Instructions

You are updating two project tracker dashboards. Your job is to pull fresh data from all available sources and update the project cards.

## Sources to Check
1. **Calendar** — `gog calendar events primary --from <now> --to <+48h> --account nik@nik.co` and jet@nik.co
2. **Email** — `gog gmail search 'newer_than:4h is:unread' --max 15 --account nik@nik.co` and jet@nik.co
3. **Slack** — Check key channels for project-relevant activity
4. **Fireflies** — Check for recent meeting transcripts with decisions

## What to Update
For each project in both dashboards:
- `currentStatus` — what's happening RIGHT NOW based on latest data
- `recentActivity` — add new activity items with dates (keep last 3-5)
- `upcomingEvents` — pull from calendar, match to projects
- `decisions` — extract from Fireflies transcripts or email threads
- `alert` — add/remove based on upcoming deadlines (<24h)
- `status` — change if warranted (e.g., waiting → active if someone responded)

## Dashboards
1. **Command Center**: `/Users/jetdamon/.openclaw/workspace/projects/tracker/index.html`
   - All projects, full internal view
2. **YoSharma**: `/Users/jetdamon/.openclaw/workspace/projects/troy-tracker/index.html`
   - 7 projects (Zurp, Rolling Ventures, After Ours, Chef Trey, Macra, Kids Vitamin, Flexpower)
3. **Internal (Friends)**: `/Users/jetdamon/.openclaw/workspace/projects/internal-tracker/index.html`
   - Same as Command Center MINUS Macra and Rolling Ventures (friend-safe view)

## Process
1. Pull data from all sources
2. Read both index.html files
3. Update the JavaScript project data arrays with fresh info
4. Git commit and push both repos
5. Be surgical — only update the data, don't touch CSS/HTML/JS logic

## Git Push
```bash
cd /Users/jetdamon/.openclaw/workspace/projects/tracker && git add -A && git commit -m "auto-refresh: $(date +%Y-%m-%d_%H:%M)" && git push
cd /Users/jetdamon/.openclaw/workspace/projects/troy-tracker && git add -A && git commit -m "auto-refresh: $(date +%Y-%m-%d_%H:%M)" && git push
```
