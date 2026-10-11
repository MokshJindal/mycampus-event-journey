// ==========================================================================
// CalendarView Component
// Monthly Collegiate Calendar with Event Milestone Markers,
// Clash Visualizers, and Day Inspection Drawer
// ==========================================================================

import { sound } from '../utils/audio.js';

export class CalendarView {
  constructor({ events, onSelectEvent, onOpenSurvivalMode }) {
    this.events = events;
    this.onSelectEvent = onSelectEvent;
    this.onOpenSurvivalMode = onOpenSurvivalMode;
    this.currentYear = 2026;
    this.currentMonth = 9; // October (0-indexed: 9 = October)
    this.selectedDate = null;
  }

  update({ events }) {
    if (events !== undefined) this.events = events;
    this.render();
  }

  getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  getFirstDayOfMonth(year, month) {
    // 0 = Sunday, 1 = Monday...
    let day = new Date(year, month, 1).getDay();
    // Normalize to Monday = 0, Sunday = 6
    return (day + 6) % 7;
  }

  render() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const daysInMonth = this.getDaysInMonth(this.currentYear, this.currentMonth);
    const startDay = this.getFirstDayOfMonth(this.currentYear, this.currentMonth);

    // Map milestones by YYYY-MM-DD
    const dateMap = {};
    this.events.forEach(evt => {
      if (!evt.milestones) return;
      evt.milestones.forEach(m => {
        if (!m.deadline) return;
        const key = m.deadline.slice(0, 10);
        if (!dateMap[key]) dateMap[key] = [];
        dateMap[key].push({
          event: evt,
          milestone: m
        });
      });
    });

    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
        
        <!-- Calendar Header Controls -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
          <div class="flex items-center space-x-3">
            <h2 class="font-serif-classic font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
              ${monthNames[this.currentMonth]} ${this.currentYear}
            </h2>
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-semibold">
              Academic Term 2026-27
            </span>
          </div>

          <!-- Month Navigation -->
          <div class="flex items-center space-x-2">
            <button id="cal-prev-month" class="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center space-x-1 shadow-2xs transition-colors">
              <i class="fas fa-chevron-left"></i>
              <span class="hidden sm:inline">Prev</span>
            </button>

            <button id="cal-today-btn" class="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors">
              Today
            </button>

            <button id="cal-next-month" class="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center space-x-1 shadow-2xs transition-colors">
              <span class="hidden sm:inline">Next</span>
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          <!-- Calendar Grid (3 Cols) -->
          <div class="lg:col-span-3 glass-card rounded-3xl p-5 sm:p-7">
            
            <!-- Weekday headers -->
            <div class="grid grid-cols-7 text-center font-bold text-xs text-slate-400 pb-3 border-b border-slate-100 dark:border-white/5">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span class="text-blue-500 font-bold">Sat</span>
              <span class="text-blue-500 font-bold">Sun</span>
            </div>

            <!-- Days Grid -->
            <div class="grid grid-cols-7 gap-2 sm:gap-2.5 pt-3">
              ${this.renderCalendarDays(startDay, daysInMonth, dateMap)}
            </div>

          </div>

          <!-- Day Inspector Sidebar (1 Col) -->
          <div class="lg:col-span-1 glass-card rounded-3xl p-5 sm:p-6 space-y-4" id="calendar-day-inspector">
            ${this.renderDayInspector(dateMap)}
          </div>

        </div>

      </div>
    `;

    this.attachEvents(dateMap);
  }

  renderCalendarDays(startDay, daysInMonth, dateMap) {
    const cells = [];
    const pad = (n) => String(n).padStart(2, '0');

    // Empty lead cells
    for (let i = 0; i < startDay; i++) {
      cells.push(`
        <div class="min-h-[75px] sm:min-h-[95px] p-1.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/20 border border-transparent"></div>
      `);
    }

    // Days in current month
    const today = new Date();
    const isCurrentMonthYear = today.getFullYear() === this.currentYear && today.getMonth() === this.currentMonth;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${this.currentYear}-${pad(this.currentMonth + 1)}-${pad(day)}`;
      const items = dateMap[dateKey] || [];
      const isToday = isCurrentMonthYear && today.getDate() === day;
      const isSelected = this.selectedDate === dateKey;
      const hasClash = items.length >= 2;

      cells.push(`
        <div 
          data-date="${dateKey}"
          class="cal-day-cell min-h-[75px] sm:min-h-[95px] p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
            isSelected 
              ? 'ring-2 ring-blue-600 border-blue-600 bg-blue-50/50 dark:bg-blue-950/30' 
              : (isToday
                  ? 'border-blue-400 bg-blue-50/30 dark:bg-blue-950/20'
                  : (hasClash 
                      ? 'border-amber-300 dark:border-amber-800/60 bg-amber-50/20 dark:bg-amber-950/10 hover:border-amber-400'
                      : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'))
          }"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold ${
              isToday 
                ? 'w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold' 
                : 'text-slate-800 dark:text-slate-200'
            }">
              ${day}
            </span>

            ${hasClash ? `
              <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="${items.length} milestones clash!"></span>
            ` : ''}
          </div>

          <!-- Event pills snippet -->
          <div class="space-y-1 mt-1 overflow-hidden">
            ${items.slice(0, 2).map(({ event, milestone }) => `
              <div 
                class="text-[9px] sm:text-[10px] truncate px-1 py-0.5 rounded font-medium text-white shadow-3xs"
                style="background-color: ${event.color || '#3b82f6'};"
                title="${event.title}: ${milestone.title}"
              >
                ${milestone.completed ? '✓ ' : ''}${milestone.title}
              </div>
            `).join('')}

            ${items.length > 2 ? `
              <div class="text-[9px] text-slate-500 dark:text-slate-400 font-semibold px-1">
                +${items.length - 2} more
              </div>
            ` : ''}
          </div>

        </div>
      `);
    }

    return cells.join('');
  }

  renderDayInspector(dateMap) {
    if (!this.selectedDate) {
      // Default to next upcoming date or Oct 18, 2026
      const keys = Object.keys(dateMap).sort();
      this.selectedDate = keys[0] || '2026-10-18';
    }

    const items = dateMap[this.selectedDate] || [];
    const dateObj = new Date(this.selectedDate);
    const formatted = dateObj.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return `
      <div>
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/80 pb-3">
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Selected Day
            </span>
            <h3 class="font-serif-classic font-bold text-base text-slate-900 dark:text-white">
              ${formatted}
            </h3>
          </div>
          <span class="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            ${items.length} ${items.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>

        ${items.length === 0 ? `
          <div class="py-12 text-center text-slate-400 text-xs">
            <i class="far fa-calendar-check text-2xl mb-2 text-slate-300 dark:text-slate-600 block"></i>
            No milestones scheduled for this date.
          </div>
        ` : `
          <div class="mt-4 space-y-3">
            ${items.map(({ event, milestone }) => `
              <div class="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded text-white" style="background-color: ${event.color || '#3b82f6'};">
                    ${event.category}
                  </span>
                  <span class="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400">
                    ${milestone.deadline.slice(11, 16)}
                  </span>
                </div>

                <div class="font-bold text-xs text-slate-900 dark:text-white">
                  ${event.title}
                </div>

                <div class="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  ${milestone.completed ? '<i class="fas fa-check-circle text-emerald-500 mr-1"></i>' : '<i class="far fa-circle mr-1 text-slate-400"></i>'}
                  ${milestone.title}
                </div>

                ${milestone.location ? `
                  <div class="text-[11px] text-slate-500 flex items-center space-x-1">
                    <i class="fas fa-location-dot text-[10px] text-emerald-600"></i>
                    <span>${milestone.location}</span>
                  </div>
                ` : ''}

                <div class="pt-2 flex items-center justify-end space-x-2 border-t border-slate-200/60 dark:border-slate-800">
                  <button data-action="pass-inspect" data-id="${event.id}" class="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                    Day HUD Pass →
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  }

  attachEvents(dateMap) {
    // Month nav
    const prev = document.getElementById('cal-prev-month');
    if (prev) {
      prev.onclick = () => {
        sound.playClick();
        this.currentMonth--;
        if (this.currentMonth < 0) {
          this.currentMonth = 11;
          this.currentYear--;
        }
        this.render();
      };
    }

    const next = document.getElementById('cal-next-month');
    if (next) {
      next.onclick = () => {
        sound.playClick();
        this.currentMonth++;
        if (this.currentMonth > 11) {
          this.currentMonth = 0;
          this.currentYear++;
        }
        this.render();
      };
    }

    const todayBtn = document.getElementById('cal-today-btn');
    if (todayBtn) {
      todayBtn.onclick = () => {
        sound.playClick();
        this.currentYear = 2026;
        this.currentMonth = 9; // October 2026
        this.selectedDate = '2026-10-18';
        this.render();
      };
    }

    // Day cell click
    document.querySelectorAll('.cal-day-cell').forEach(cell => {
      cell.onclick = () => {
        const date = cell.getAttribute('data-date');
        sound.playClick();
        this.selectedDate = date;
        const inspector = document.getElementById('calendar-day-inspector');
        if (inspector) {
          inspector.innerHTML = this.renderDayInspector(dateMap);
          this.attachInspectorEvents();
        }
        // Update highlight classes
        document.querySelectorAll('.cal-day-cell').forEach(c => {
          c.classList.remove('ring-2', 'ring-blue-600', 'border-blue-600');
        });
        cell.classList.add('ring-2', 'ring-blue-600', 'border-blue-600');
      };
    });

    this.attachInspectorEvents();
  }

  attachInspectorEvents() {
    document.querySelectorAll('[data-action="pass-inspect"]').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-id');
        sound.playClick();
        this.onOpenSurvivalMode(id);
      };
    });
  }
}
