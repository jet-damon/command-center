// Command Center ⚡ — Scriptable Widget
// Medium & Large sizes supported
// Tap widget → opens Command Center in Safari

const API_URL = "https://pjm-board.niksharma.co/projects.json"
const WEB_URL = "https://pjm-board.niksharma.co"

// Colors
const BG = new Color("#0a0a0b")
const SURFACE = new Color("#141417")
const BORDER = new Color("#232329")
const TEXT = new Color("#ededef")
const TEXT_SEC = new Color("#8b8b92")
const TEXT_TERT = new Color("#5c5c63")
const ACCENT = new Color("#6c5ce7")
const GREEN = new Color("#10b981")
const GREEN_BG = new Color("#10b981", 0.12)
const YELLOW = new Color("#f59e0b")
const YELLOW_BG = new Color("#f59e0b", 0.12)
const RED = new Color("#ef4444")
const RED_BG = new Color("#ef4444", 0.1)
const GRAY = new Color("#6b7280")
const GRAY_BG = new Color("#6b7280", 0.1)
const ALERT_RED = new Color("#f43f5e")

// Fetch projects
async function fetchProjects() {
  try {
    let req = new Request(API_URL)
    req.timeoutInterval = 10
    let data = await req.loadJSON()
    return data
  } catch (e) {
    return null
  }
}

// Status helpers
function statusColor(s) {
  if (s === "active") return GREEN
  if (s === "waiting") return YELLOW
  if (s === "paused") return GRAY
  if (s === "closed") return RED
  return TEXT_SEC
}

function statusBg(s) {
  if (s === "active") return GREEN_BG
  if (s === "waiting") return YELLOW_BG
  if (s === "paused") return GRAY_BG
  if (s === "closed") return RED_BG
  return GRAY_BG
}

function statusLabel(s) {
  if (s === "active") return "ACTIVE"
  if (s === "waiting") return "WAITING"
  if (s === "paused") return "PAUSED"
  if (s === "closed") return "CLOSED"
  return s.toUpperCase()
}

function statusEmoji(s) {
  if (s === "active") return "🟢"
  if (s === "waiting") return "🟡"
  if (s === "paused") return "⏸"
  if (s === "closed") return "🔴"
  return "⚪"
}

// Sort: alerts first, then by status priority
function sortProjects(list) {
  const pri = { active: 1, waiting: 2, paused: 3, closed: 4 }
  return list.sort((a, b) => {
    const aA = a.alert ? 0 : 1
    const bA = b.alert ? 0 : 1
    if (aA !== bA) return aA - bA
    return (pri[a.status] || 5) - (pri[b.status] || 5)
  })
}

// Build medium widget (4x2) — top 4 projects
function buildMediumWidget(projects) {
  let w = new ListWidget()
  w.backgroundColor = BG
  w.setPadding(14, 14, 14, 14)
  w.url = WEB_URL

  // Header
  let header = w.addStack()
  header.centerAlignContent()
  let bolt = header.addText("⚡")
  bolt.font = Font.systemFont(14)
  header.addSpacer(6)
  let title = header.addText("Command Center")
  title.font = Font.boldSystemFont(13)
  title.textColor = TEXT
  header.addSpacer()

  let sorted = sortProjects([...projects])
  let alertCount = sorted.filter(p => p.alert).length
  let activeCount = sorted.filter(p => p.status === "active").length

  let countText = header.addText(`${activeCount} active`)
  countText.font = Font.mediumSystemFont(11)
  countText.textColor = TEXT_TERT

  w.addSpacer(8)

  // Show top 4 projects
  let show = sorted.slice(0, 4)
  for (let i = 0; i < show.length; i++) {
    let p = show[i]
    let row = w.addStack()
    row.centerAlignContent()
    row.spacing = 6

    // Status dot
    let dot = row.addText(statusEmoji(p.status))
    dot.font = Font.systemFont(10)

    // Project name
    let name = row.addText(p.name)
    name.font = Font.semiboldSystemFont(12)
    name.textColor = TEXT
    name.lineLimit = 1

    row.addSpacer()

    // Alert indicator or latest date
    if (p.alert) {
      let alertDot = row.addText("⚠️")
      alertDot.font = Font.systemFont(10)
    } else if (p.updated) {
      let dateStr = p.updated.replace("2026-", "")
      let dt = row.addText(dateStr)
      dt.font = Font.systemFont(10)
      dt.textColor = TEXT_TERT
    }

    if (i < show.length - 1) {
      w.addSpacer(4)
    }
  }

  w.addSpacer()

  // Footer
  let footer = w.addStack()
  let remaining = sorted.length - show.length
  if (remaining > 0) {
    let more = footer.addText(`+${remaining} more`)
    more.font = Font.systemFont(10)
    more.textColor = TEXT_TERT
  }
  footer.addSpacer()
  let ts = footer.addText(formatTime())
  ts.font = Font.systemFont(9)
  ts.textColor = TEXT_TERT

  return w
}

// Build large widget (4x4) — all projects with more detail
function buildLargeWidget(projects) {
  let w = new ListWidget()
  w.backgroundColor = BG
  w.setPadding(16, 16, 16, 16)
  w.url = WEB_URL

  // Header
  let header = w.addStack()
  header.centerAlignContent()
  let bolt = header.addText("⚡")
  bolt.font = Font.systemFont(16)
  header.addSpacer(8)
  let title = header.addText("Command Center")
  title.font = Font.boldSystemFont(16)
  title.textColor = TEXT
  header.addSpacer()

  let sorted = sortProjects([...projects])
  let alertCount = sorted.filter(p => p.alert).length
  let activeCount = sorted.filter(p => p.status === "active").length

  let badge = header.addText(`${activeCount} active`)
  badge.font = Font.mediumSystemFont(11)
  badge.textColor = GREEN

  w.addSpacer(6)

  // Alert banner if any
  if (alertCount > 0) {
    let alertBanner = w.addStack()
    alertBanner.backgroundColor = RED_BG
    alertBanner.cornerRadius = 6
    alertBanner.setPadding(6, 10, 6, 10)
    alertBanner.centerAlignContent()

    let alertIcon = alertBanner.addText("⚠️")
    alertIcon.font = Font.systemFont(11)
    alertBanner.addSpacer(6)

    let alertNames = sorted.filter(p => p.alert).map(p => p.name).slice(0, 3).join(", ")
    let alertText = alertBanner.addText(`${alertCount} alert${alertCount > 1 ? 's' : ''}: ${alertNames}`)
    alertText.font = Font.mediumSystemFont(10)
    alertText.textColor = ALERT_RED
    alertText.lineLimit = 1

    w.addSpacer(8)
  }

  // Divider
  let div = w.addStack()
  div.size = new Size(0, 1)
  div.backgroundColor = BORDER
  w.addSpacer(6)

  // Projects — show up to 10 in large
  let show = sorted.slice(0, 10)
  for (let i = 0; i < show.length; i++) {
    let p = show[i]

    let card = w.addStack()
    card.layoutVertically()
    card.spacing = 2

    // Row 1: status + name + date
    let row1 = card.addStack()
    row1.centerAlignContent()
    row1.spacing = 6

    let dot = row1.addText(statusEmoji(p.status))
    dot.font = Font.systemFont(10)

    let name = row1.addText(p.name)
    name.font = Font.semiboldSystemFont(12)
    name.textColor = TEXT
    name.lineLimit = 1

    row1.addSpacer()

    if (p.alert) {
      let alertDot = row1.addText("⚠️")
      alertDot.font = Font.systemFont(10)
    }

    if (p.updated) {
      let dateStr = p.updated.replace("2026-", "")
      let dt = row1.addText(dateStr)
      dt.font = Font.systemFont(9)
      dt.textColor = TEXT_TERT
    }

    // Row 2: latest activity or current status snippet
    let snippet = ""
    if (p.recentActivity && p.recentActivity.length > 0) {
      snippet = p.recentActivity[0].text
    } else if (p.currentStatus) {
      snippet = p.currentStatus
    }
    if (snippet) {
      let row2 = card.addStack()
      row2.setPadding(0, 20, 0, 0)
      let desc = row2.addText(snippet)
      desc.font = Font.systemFont(10)
      desc.textColor = TEXT_SEC
      desc.lineLimit = 1
    }

    if (i < show.length - 1) {
      w.addSpacer(5)
    }
  }

  w.addSpacer()

  // Footer
  let footer = w.addStack()
  let remaining = sorted.length - show.length
  if (remaining > 0) {
    let more = footer.addText(`+${remaining} more projects`)
    more.font = Font.systemFont(10)
    more.textColor = TEXT_TERT
  }
  footer.addSpacer()
  let ts = footer.addText(`Updated ${formatTime()}`)
  ts.font = Font.systemFont(9)
  ts.textColor = TEXT_TERT

  return w
}

// Error widget
function buildErrorWidget(msg) {
  let w = new ListWidget()
  w.backgroundColor = BG
  w.setPadding(16, 16, 16, 16)
  w.url = WEB_URL

  let header = w.addStack()
  let bolt = header.addText("⚡")
  bolt.font = Font.systemFont(16)
  header.addSpacer(8)
  let title = header.addText("Command Center")
  title.font = Font.boldSystemFont(15)
  title.textColor = TEXT

  w.addSpacer()

  let err = w.addText(msg || "Unable to connect")
  err.font = Font.systemFont(12)
  err.textColor = RED
  err.centerAlignText()

  w.addSpacer()

  let hint = w.addText("Tap to open in browser")
  hint.font = Font.systemFont(10)
  hint.textColor = TEXT_TERT
  hint.centerAlignText()

  return w
}

function formatTime() {
  let d = new Date()
  let h = d.getHours()
  let m = d.getMinutes().toString().padStart(2, '0')
  let ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${h}:${m} ${ampm}`
}

// Main
let projects = await fetchProjects()

if (!projects) {
  let w = buildErrorWidget("Can't reach server")
  if (config.runsInWidget) {
    Script.setWidget(w)
  } else {
    w.presentMedium()
  }
  Script.complete()
} else {
  let size = config.widgetFamily || "medium"

  let w
  if (size === "large") {
    w = buildLargeWidget(projects)
  } else {
    w = buildMediumWidget(projects)
  }

  if (config.runsInWidget) {
    Script.setWidget(w)
  } else {
    // Preview: show both
    if (size === "large") {
      w.presentLarge()
    } else {
      w.presentMedium()
    }
  }
  Script.complete()
}
