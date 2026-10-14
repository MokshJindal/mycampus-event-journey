// ==========================================================================
// Upgraded CalendarView Component
// Event Schedule Calendar with Months and Dates Labeled Along Axes
// Eliminates cramped side panel in favor of full-width Timeline Schedule
// and Interactive Full-Width Date Matrix
// ==========================================================================

import { sound } from '../utils/audio.js';

export class CalendarView {
  constructor({ events, onSelectEvent, onOpenSurvivalMode }) {
    this.events = events;
    this.onSelectEvent = onSelectEvent;
    this.onOpenSurvivalMode = onOpenSurvivalMode;
    this.currentYear = 2026;
    this.currentMonth = 9; // October (0-indexed: 9 = October)
    this.calendarMode = 'schedule-axis'; // 'schedule-axis' | 'month-grid'
    this.selectedDate = '2026-10-18'; // Default to high-density clash date
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
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-5">
        
        <!-- Calendar Header: Month, Navigation & Axis View Switcher -->
        <div class="glass-card rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200 dark:border-slate-800">
          
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm shadow-xs">
              <i class="far fa-calendar-alt"></i>
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <h2 class="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
                  ${monthNames[this.currentMonth]} ${this.currentYear}
                </h2>
                <span class="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-mono font-semibold border border-blue-200 dark:border-blue-800">
                  Semester Schedule
                </span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Full schedule timeline with labeled axes for multi-round hackathons and deadlines.
              </p>
            </div>
          </div>

          <!-- Controls: Mode Switcher & Month Navigation -->
          <div class="flex flex-wrap items-center gap-2">
            
            <!-- Axis / Grid Mode Toggle -->
            <div class="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <button 
                id="cal-mode-axis-btn" 
                class="px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition-all ${
                  this.calendarMode === 'schedule-axis'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }"
              >
                <i class="fas fa-chart-gantt text-xs"></i>
                <span>Schedule Matrix (Axes)</span>
              </button>

              <button 
                id="cal-mode-grid-btn" 
                class="px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition-all ${
                  this.calendarMode === 'month-grid'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }"
              >
                <i class="fas fa-table-cells text-xs"></i>
                <span>Monthly Grid</span>
              </button>
            </div>

            <!-- Month Stepper -->
            <div class="flex items-center space-x-1">
              <button id="cal-prev-month" class="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-2xs transition-colors">
                <i class="fas fa-chevron-left"></i>
              </button>

              <button id="cal-today-btn" class="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors">
                Today
              </button>

              <button id="cal-next-month" class="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-2xs transition-colors">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>

          </div>

        </div>

        <!-- MAIN CALENDAR CONTAINER (FULL WIDTH - NO SIDE PANEL) -->
        ${this.calendarMode === 'schedule-axis' 
          ? this.renderScheduleAxisView(daysInMonth, dateMap, monthNames[this.currentMonth]) 
          : this.renderMonthGridView(startDay, daysInMonth, dateMap)}

        <!-- FULL-WIDTH INTERACTIVE DAY SCHEDULE DRAWER (DIRECTLY BELOW, NOT ON SIDE) -->
        <div id="calendar-day-schedule-panel" class="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800">
          ${this.renderDayScheduleDetails(dateMap)}
        </div>

      </div>
    `;

    this.attachEvents(dateMap);
  }

  // =========================================================================
  // VIEW MODE 1: Event Schedule Matrix with Months & Dates Labeled on Axes
  // X-Axis = Dates (1..31) + Weekday labels
  // Y-Axis = Event Tracks / Names
  // =========================================================================
  renderScheduleAxisView(daysInMonth, dateMap, monthName) {
    const pad = (n) => String(n).padStart(2, '0');
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    return `
      <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 overflow-hidden space-y-4">
        
        <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span class="font-display font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Schedule Timeline Axis: ${monthName} ${this.currentYear}
            </span>
          </div>
          <span class="text-[11px] text-slate-400 font-mono">
            Scroll horizontally to view all 31 days →
          </span>
        </div>

        <!-- Scrollable Schedule Matrix with Sticky Y-Axis -->
        <div class="overflow-x-auto pb-3">
          <div class="min-w-[1050px]">
            
            <!-- TOP AXIS HEADER: Month & Dates (1..31) -->
            <div class="flex border-b-2 border-slate-200 dark:border-slate-700 pb-2 bg-slate-50/80 dark:bg-slate-900/60 rounded-t-xl py-2">
              
              <!-- Sticky Left Axis Label (Y-Axis Header) -->
              <div class="w-48 shrink-0 px-3 font-display font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between border-r border-slate-200 dark:border-slate-700">
                <span>Event Tracks</span>
                <span class="text-[10px] text-slate-400 font-mono">(${this.events.length})</span>
              </div>

              <!-- Horizontal Date Axis Columns (1..31) -->
              <div class="flex-1 flex">
                ${Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const dateKey = `${this.currentYear}-${pad(this.currentMonth + 1)}-${pad(day)}`;
                  const dateObj = new Date(this.currentYear, this.currentMonth, day);
                  const weekday = dayNames[dateObj.getDay()];
                  const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
                  const hasEvents = dateMap[dateKey] && dateMap[dateKey].length > 0;
                  const isSelected = this.selectedDate === dateKey;
                  const hasClash = dateMap[dateKey] && dateMap[dateKey].length >= 2;

                  return `
                    <div 
                      data-date="${dateKey}"
                      class="cal-axis-header-cell flex-1 min-w-[34px] text-center cursor-pointer transition-all rounded-md mx-0.5 py-1 ${
                        isSelected 
                          ? 'bg-blue-600 text-white font-bold shadow-xs' 
                          : (hasClash 
                              ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30' 
                              : (hasEvents 
                                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold' 
                                  : (isWeekend ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-400')))
                      }"
                    >
                      <div class="text-[10px] font-mono leading-none">${pad(day)}</div>
                      <div class="text-[9px] mt-0.5 opacity-70 leading-none">${weekday}</div>
                    </div>
                  `;
                }).join('')}
              </div>

            </div>

            <!-- ROWS: One row per Event, with Milestones plotted on their exact Date cell -->
            <div class="divide-y divide-slate-100 dark:divide-slate-800">
              ${this.events.map(evt => {
                const milestonesByDay = {};
                (evt.milestones || []).forEach(m => {
                  if (!m.deadline) return;
                  const dayNum = parseInt(m.deadline.slice(8, 10), 10);
                  const monthNum = parseInt(m.deadline.slice(5, 7), 10);
                  if (monthNum === this.currentMonth + 1) {
                    if (!milestonesByDay[dayNum]) milestonesByDay[dayNum] = [];
                    milestonesByDay[dayNum].push(m);
                  }
                });

                return `
                  <div class="flex items-center py-2.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    
                    <!-- Left Y-Axis Header: Event Name & Category -->
                    <div class="w-48 shrink-0 px-3 pr-4 border-r border-slate-200 dark:border-slate-800">
                      <div class="flex items-center space-x-1.5 truncate">
                        <span class="w-2 h-2 rounded-full ${evt.platform === 'Unstop' ? 'bg-orange-500' : 'bg-blue-500'}"></span>
                        <span class="font-display font-semibold text-xs text-slate-900 dark:text-white truncate" title="${evt.title}">
                          ${evt.title}
                        </span>
                      </div>
                      <div class="text-[10px] text-slate-400 truncate mt-0.5 flex items-center space-x-1">
                        <span>${evt.category}</span>
                        <span>•</span>
                        <span class="font-mono text-slate-500">${evt.venue ? evt.venue.building : 'Virtual'}</span>
                      </div>
                    </div>

                    <!-- Horizontal Grid Cells for each Day -->
                    <div class="flex-1 flex">
                      ${Array.from({ length: daysInMonth }, (_, i) => {
                        const day = i + 1;
                        const dateKey = `${this.currentYear}-${pad(this.currentMonth + 1)}-${pad(day)}`;
                        const msList = milestonesByDay[day] || [];
                        const isSelected = this.selectedDate === dateKey;

                        return `
                          <div 
                            data-date="${dateKey}"
                            class="cal-axis-data-cell flex-1 min-w-[34px] h-9 mx-0.5 rounded flex items-center justify-center cursor-pointer transition-all ${
                              isSelected ? 'bg-blue-500/10 dark:bg-blue-500/20' : ''
                            }"
                          >
                            ${msList.length > 0 ? `
                              <div 
                                title="${evt.title}: ${msList.map(m => m.title).join(', ')}"
                                class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-xs ${
                                  msList.some(m => m.completed)
                                    ? 'bg-emerald-600'
                                    : (msList.some(m => m.urgent) ? 'bg-amber-500 animate-pulse' : 'bg-blue-600')
                                }"
                              >
                                ${msList.some(m => m.completed) ? '✓' : msList.length}
                              </div>
                            ` : `
                              <span class="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-800"></span>
                            `}
                          </div>
                        `;
                      }).join('')}
                    </div>

                  </div>
                `;
              }).join('')}
            </div>

          </div>
        </div>

      </div>
    `;
  }

  // =========================================================================
  // VIEW MODE 2: Full-Width Monthly Grid (Days on X-Axis, Weeks on Y-Axis)
  // =========================================================================
  renderMonthGridView(startDay, daysInMonth, dateMap) {
    const pad = (n) => String(n).padStart(2, '0');
    const cells = [];

    // Empty lead cells
    for (let i = 0; i < startDay; i++) {
      cells.push(`
        <div class="min-h-[85px] p-2 rounded-xl bg-slate-50/40 dark:bg-slate-900/20 border border-transparent"></div>
      `);
    }

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
          class="cal-day-cell min-h-[85px] p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
            isSelected 
              ? 'ring-2 ring-blue-600 border-blue-600 bg-blue-50/50 dark:bg-blue-950/30' 
              : (isToday
                  ? 'border-blue-400 bg-blue-50/30 dark:bg-blue-950/20'
                  : (hasClash 
                      ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 bg-white/70 dark:bg-slate-900/50'))
          }"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono font-bold ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}">
              ${day}
            </span>
            ${items.length > 0 ? `
              <span class="text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                hasClash 
                  ? 'bg-rose-500 text-white' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
              }">
                ${items.length} ${items.length === 1 ? 'task' : 'tasks'}
              </span>
            ` : ''}
          </div>

          <div class="space-y-1 mt-1 overflow-hidden">
            ${items.slice(0, 2).map(it => `
              <div class="text-[10px] truncate px-1.5 py-0.5 rounded font-medium ${
                it.milestone.completed 
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 line-through' 
                  : (it.milestone.urgent 
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold' 
                      : 'bg-blue-100/70 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300')
              }" title="${it.event.title}: ${it.milestone.title}">
                ${it.milestone.title}
              </div>
            `).join('')}
            ${items.length > 2 ? `
              <div class="text-[9px] text-slate-400 font-mono pl-1">+${items.length - 2} more</div>
            ` : ''}
          </div>
        </div>
      `);
    }

    return `
      <div class="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
        
        <!-- X-AXIS: Weekday headers -->
        <div class="grid grid-cols-7 text-center font-display font-bold text-xs text-slate-400 pb-3 border-b border-slate-100 dark:border-slate-800">
          <span>Monday</span>
          <span>Tuesday</span>
          <span>Wednesday</span>
          <span>Thursday</span>
          <span>Friday</span>
          <span class="text-blue-600 dark:text-blue-400">Saturday</span>
          <span class="text-blue-600 dark:text-blue-400">Sunday</span>
        </div>

        <!-- DAYS GRID -->
        <div class="grid grid-cols-7 gap-2 pt-3">
          ${cells.join('')}
        </div>

      </div>
    `;
  }

  // =========================================================================
  // FULL-WIDTH INTERACTIVE DAY SCHEDULE DRAWER (NOT ON SIDE)
  // =========================================================================
  renderDayScheduleDetails(dateMap) {
    if (!this.selectedDate) {
      return `
        <div class="text-center py-6 text-slate-400">
          <i class="far fa-calendar-check text-2xl mb-2 block text-blue-500/60"></i>
          <span class="font-display font-semibold text-sm text-slate-600 dark:text-slate-300">
            Select any date along the axis or calendar above to inspect scheduled milestones and venues.
          </span>
        </div>
      `;
    }

    const items = dateMap[this.selectedDate] || [];
    const dateObj = new Date(this.selectedDate + 'T00:00:00');
    const formatted = dateObj.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    const isClashDay = items.length >= 2;

    return `
      <div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-xl ${isClashDay ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-600 text-white'} flex items-center justify-center text-sm">
              <i class="fas ${isClashDay ? 'fa-triangle-exclamation' : 'fa-calendar-day'}"></i>
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <h3 class="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                  ${formatted}
                </h3>
                ${isClashDay ? `
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800">
                    Clash Detected (${items.length} Milestones)
                  </span>
                ` : `
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    ${items.length} ${items.length === 1 ? 'Milestone' : 'Milestones'}
                  </span>
                `}
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Detailed day-of deliverables, room locations, and squad assignments.
              </p>
            </div>
          </div>

          <button 
            id="btn-day-survival-trigger" 
            class="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors self-start sm:self-auto"
          >
            <i class="fas fa-bolt text-xs"></i>
            <span>Open Day-of HUD</span>
          </button>
        </div>

        <!-- Milestones list -->
        <div class="mt-4">
          ${items.length === 0 ? `
            <div class="text-center py-6 text-slate-400">
              <span class="text-xs">No scheduled deliverables on this date. Perfect buffer day for preparation.</span>
            </div>
          ` : `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              ${items.map(it => `
                <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 flex flex-col justify-between space-y-2">
                  <div>
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        it.event.platform === 'Unstop' 
                          ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800' 
                          : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                      }">
                        ${it.event.platform}
                      </span>
                      <span class="text-[11px] font-mono text-slate-500">
                        ${it.milestone.deadline.slice(11, 16)} IST
                      </span>
                    </div>

                    <h4 class="font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      ${it.milestone.title}
                    </h4>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      ${it.event.title}
                    </p>
                  </div>

                  <div class="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <span class="text-slate-400 text-[11px] flex items-center space-x-1">
                      <i class="fas fa-location-dot text-[10px] text-emerald-500"></i>
                      <span>${it.event.venue ? it.event.venue.building : 'Virtual'}</span>
                    </span>

                    <span class="font-bold text-[10px] ${it.milestone.completed ? 'text-emerald-500' : 'text-amber-500'}">
                      ${it.milestone.completed ? '✓ Completed' : 'Pending'}
                    </span>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

      </div>
    `;
  }

  attachEvents(dateMap) {
    // Mode toggles
    const axisBtn = document.getElementById('cal-mode-axis-btn');
    if (axisBtn) {
      axisBtn.onclick = () => {
        sound.playClick();
        this.calendarMode = 'schedule-axis';
        this.render();
      };
    }

    const gridBtn = document.getElementById('cal-mode-grid-btn');
    if (gridBtn) {
      gridBtn.onclick = () => {
        sound.playClick();
        this.calendarMode = 'month-grid';
        this.render();
      };
    }

    // Month Navigation
    const prevBtn = document.getElementById('cal-prev-month');
    if (prevBtn) {
      prevBtn.onclick = () => {
        sound.playClick();
        if (this.currentMonth === 0) {
          this.currentMonth = 11;
          this.currentYear--;
        } else {
          this.currentMonth--;
        }
        this.render();
      };
    }

    const nextBtn = document.getElementById('cal-next-month');
    if (nextBtn) {
      nextBtn.onclick = () => {
        sound.playClick();
        if (this.currentMonth === 11) {
          this.currentMonth = 0;
          this.currentYear++;
        } else {
          this.currentMonth++;
        }
        this.render();
      };
    }

    const todayBtn = document.getElementById('cal-today-btn');
    if (todayBtn) {
      todayBtn.onclick = () => {
        sound.playClick();
        const now = new Date();
        this.currentYear = now.getFullYear();
        this.currentMonth = now.getMonth();
        const pad = (n) => String(n).padStart(2, '0');
        this.selectedDate = `${this.currentYear}-${pad(this.currentMonth + 1)}-${pad(now.getDate())}`;
        this.render();
      };
    }

    // Click on date cells (axis headers, axis cells, or month grid cells)
    const selectDateHandler = (dateStr) => {
      sound.playClick();
      this.selectedDate = dateStr;
      this.render();
      // Scroll to bottom drawer if not visible
      const drawer = document.getElementById('calendar-day-schedule-panel');
      if (drawer) {
        drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    };

    document.querySelectorAll('.cal-axis-header-cell, .cal-axis-data-cell, .cal-day-cell').forEach(el => {
      el.onclick = () => {
        const d = el.getAttribute('data-date');
        if (d) selectDateHandler(d);
      };
    });

    const btnSurvival = document.getElementById('btn-day-survival-trigger');
    if (btnSurvival) {
      btnSurvival.onclick = () => {
        sound.playClick();
        const items = dateMap[this.selectedDate] || [];
        const evtId = items[0] ? items[0].event.id : null;
        this.onOpenSurvivalMode(evtId);
      };
    }
  }
}
