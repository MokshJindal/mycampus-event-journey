# MyCampus: Your Event Journey 🎓

> **A classic, intelligent, unified event lifecycle timeline for collegiate students.**
> Consolidating registrations, multi-phase milestone deadlines, campus venues, team rosters, and competition schedules scattered across Devpost, Unstop, Luma, Devfolio, EasyChair, and university club portals.

---

## 🌟 The Problem
University students participate in dozens of high-stakes hackathons, conferences, workshops, case challenges, and campus fests. However, their experience is plagued by fragmentation:
- **Scattered Registrations:** Split across Google Forms, Devpost, Unstop, Luma, WhatsApp groups, and departmental circulars.
- **Lost Deadlines:** Missing Round 1 abstract deadlines, PPT submissions, camera-ready papers, or dry-run mentorship calls.
- **Venue Confusion & Transit Clashes:** Overlapping rounds across physical campus blocks (R&D Block vs Old Academic Block) with zero buffer time.
- **Disjointed Team Roster:** Lost team IDs, missing slide links, and last-minute scramble for HDMI dongles or Wi-Fi passwords.

---

## 🚀 Key Innovations & Features

### 1. Unified Multi-Phase Journey Timeline
Every event is structured not as an isolated date, but as a rich milestone journey:
- **Phase Flow:** `Registration` ➔ `Proposal / Abstract Due` ➔ `Shortlist Announcement` ➔ `Mentorship Review` ➔ `Grand Finale Pitch` ➔ `Podium & Certificate`.
- **Milestone Checkboxes:** Mark deliverables complete with procedural audio chimes and live XP rewards.
- **Urgency Radar:** Automatic countdown tickers for imminent deliverables due in `< 48 hours`.

### 2. Four Interactive Views
- **Journey Timeline (Flagship):** Grouped milestone flows with status tags, team avatars, and direct links.
- **Monthly Academic Calendar:** Interactive calendar with color-coded event markers and click-to-inspect date drawer.
- **Lifecycle Pipeline (Kanban):** Visual columns (`Registered`, `In Prep`, `Finalist`, `Completed`, `Podium / Won 🏆`). Advancing to *Podium / Won* triggers sound fanfare and celebratory confetti!
- **Clash & Overlap Radar:** Algorithmic detector flagging conflicting deadlines within 6 hours, overlapping presentation slots, and cross-campus building transit bottlenecks with AI recommendations.

### 3. AI Smart Ingestion & Email Parser
- Paste raw registration confirmation emails, WhatsApp notices, or circulars.
- Instant extraction of: **Event Name**, **Category**, **Platform**, **Registration ID**, **Team Name**, **Venue Building & Room**, and **All Milestone Deadlines**.
- Includes 1-click realistic sample presets (`Devpost Hackathon Confirmation`, `Unstop AI Challenge Email`, `Luma Workshop Ticket`, `WhatsApp Club Circular`).

### 4. Day-of-Event "Survival Mode" (Live HUD)
- Distraction-free high-focus dashboard for the competition day.
- Live ticking countdown to the next milestone deadline.
- **Digital Event Pass:** Dynamically generated SVG QR Code, Attendee Roll No, Team Pass, and Barcode.
- **Campus Essentials:** Wi-Fi credentials with 1-click password copy, emergency security contacts, and medical desk extensions.
- **Interactive Pitch Readiness Checklist:** Persistent hardware, slide export, and demo video checklist.

### 5. Interactive Campus Blueprint & Wayfinder
- Stylized architectural SVG map of the campus (R&D Block, Old Academic Block, Library Building, Student Center, Campus Amphitheatre, C-Block Auditorium).
- Live pins showing buildings currently hosting events.
- **Transit Calculator:** Computes walking distance and route guidance between any two campus blocks.

### 6. Student Event Passport & Printable Brag Sheet
- Verified achievements portfolio with total accumulated XP and Level ranking.
- Visual skills radar (AI/ML, Systems, Web3, Case Analysis, Live Pitching).
- Unlocked achievement badges (*Hackathon Victor*, *Oral Defense*, *SIH Finalist*, *WASM Practitioner*).
- **1-Click Printable Resume Brag Sheet:** Formatted as an executive academic report ready to print or save to PDF for recruiters and scholarship applications.

### 7. Universal Calendar Sync & Backup
- **RFC 5545 `.ics` Export:** 1-click export of your full journey straight to Google Calendar, Apple Calendar, and Outlook.
- **JSON Backup & Restore:** Zero data loss with full export/import support.

### 8. Collegiate Power User Experience
- Global **Command Palette** (`⌘K` / `Ctrl+K`) for instant search and actions.
- Keyboard shortcuts (`1` = Timeline, `2` = Calendar, `3` = Kanban, `4` = Clash Radar).
- Full **Dark (Obsidian Slate)** / **Light (Collegiate Classic)** theme toggle.
- Web Audio API procedural sound engine with tactile feedback.

---

## 💻 Quick Start & Running Locally

The project is built with zero-build-step modern native ES modules, running instantly in any browser.

### Option A: Standard Local Server (Recommended)
Run Python's built-in HTTP server:
```bash
python3 -m http.server 3000
```
Then visit:
```
http://localhost:3000
```

### Option B: Open Directly
Double-click `index.html` in your file explorer or open it in Google Chrome, Safari, or Microsoft Edge.

---

## 📁 Project Architecture

```
cmd-shift-iiit-d/
├── index.html                   # Main application entry point
├── styles/
│   └── main.css                 # Collegiate design tokens, glassmorphism, animations & print styles
├── src/
│   ├── app.js                   # Application state orchestrator and event bus
│   ├── data/
│   │   ├── initialData.js       # Authentic campus events & venue coordinates
│   │   └── discoveryData.js     # Curated campus discovery catalog
│   ├── components/
│   │   ├── Navbar.js            # Collegiate navigation bar with live clock & view tabs
│   │   ├── HeroStats.js         # Intelligence metrics, countdown ticker & filter pills
│   │   ├── TimelineView.js      # Flagship multi-phase milestone journey view
│   │   ├── CalendarView.js      # Interactive monthly calendar & day inspector
│   │   ├── KanbanView.js        # Stage pipeline Kanban with confetti
│   │   ├── ClashRadarView.js    # Conflict analyzer & AI resolution advice
│   │   ├── SmartImportModal.js  # Natural language email parser & backup import
│   │   ├── SurvivalModeModal.js # Day-of-Event HUD, digital QR pass, Wi-Fi & checklist
│   │   ├── CampusMapModal.js    # Interactive SVG campus map & transit wayfinder
│   │   ├── PassportModal.js     # Student Event Passport & printable resume brag sheet
│   │   ├── DiscoverModal.js     # Campus discovery hub with 1-click import
│   │   ├── EventModal.js        # Add / Edit event modal with dynamic milestone builder
│   │   └── CommandPalette.js    # Cmd+K keyboard omnibar
│   └── utils/
│       ├── audio.js             # Web Audio API synthesizer for tactile sound effects
│       ├── storage.js           # LocalStorage persistence, clash detection & stats engine
│       ├── icsExporter.js       # RFC 5545 iCalendar (.ics) generator
│       └── nlpParser.js         # Smart natural language regex/NLP email parser
└── README.md                    # Project documentation
```
