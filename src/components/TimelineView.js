// ==========================================================================
// TimelineView Component
// Clean, Modern, Card-Based Event Journey
// Visual Multi-Round Stepper, Checkpoint Toggles, and Real Venue Details
// ==========================================================================

import { ICSExporter } from '../utils/icsExporter.js';

export class TimelineView {
  constructor({ events, onToggleMilestone, onEditEvent, onDeleteEvent, onAddEvent, onOpenUnstopHub }) {
    this.events = events;
    this.onToggleMilestone = onToggleMilestone;
    this.onEditEvent = onEditEvent;
    this.onDeleteEvent = onDeleteEvent;
    this.onAddEvent = onAddEvent;
    this.onOpenUnstopHub = onOpenUnstopHub;
  }

  update({ events }) {
    if (events !== undefined) this.events = events;
    this.render();
  }

  formatDate(dateStr) {
    if (!dateStr) return 'TBA';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  }

  getStageBadge(stage) {
    switch (stage) {
      case 'won':
        return `<span class="px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full border border-amber-500/20">Podium Won</span>`;
      case 'completed':
        return `<span class="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20">Completed</span>`;
      case 'finalist':
        return `<span class="px-2 py-0.5 text-[10px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full border border-purple-500/20">Finalist</span>`;
      case 'in-prep':
        return `<span class="px-2 py-0.5 text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full border border-blue-500/20">In Progress</span>`;
      default:
        return `<span class="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full border border-slate-200 dark:border-slate-700">Registered</span>`;
    }
  }

  render() {
    const container = document.getElementById('view-container');
    if (!container) return;

    if (this.events.length === 0) {
      container.innerHTML = `
        <div class="max-w-md mx-auto py-16 px-4 text-center space-y-4">
          <div class="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl mx-auto border border-blue-500/20">
            <i class="fas fa-calendar-plus"></i>
          </div>
          <div>
            <h3 class="text-lg font-display font-bold text-slate-900 dark:text-white">
              No Events Found
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Add your upcoming hackathon, competition, or workshop to start your journey.
            </p>
          </div>
          <div class="flex justify-center space-x-2 pt-2">
            <button id="empty-add-btn" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs">
              <i class="fas fa-plus mr-1"></i> Add Event
            </button>
            <button id="empty-unstop-btn" class="px-4 py-2 unstop-pill hover:opacity-80 rounded-xl text-xs font-bold transition-all">
              <i class="fas fa-bolt mr-1 text-orange-500"></i> Explore Unstop
            </button>
          </div>
        </div>
      `;

      const addBtn = document.getElementById('empty-add-btn');
      if (addBtn) addBtn.onclick = () => this.onAddEvent();
      const unstopBtn = document.getElementById('empty-unstop-btn');
      if (unstopBtn) unstopBtn.onclick = () => this.onOpenUnstopHub();
      return;
    }

    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-5">
        
        <!-- Header row -->
        <div class="flex items-center justify-between pb-1 border-b border-slate-200/80 dark:border-white/5">
          <div class="flex items-center space-x-2">
            <h2 class="font-display font-bold text-lg text-slate-900 dark:text-white">
              Timeline Milestones
            </h2>
            <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-mono font-semibold">
              ${this.events.length} Events
            </span>
          </div>

          <div class="text-xs text-slate-400 hidden sm:block">
            Click round checkboxes to mark deliverables done
          </div>
        </div>

        <!-- Event Cards Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          ${this.events.map(event => this.renderCard(event)).join('')}
        </div>

      </div>
    `;

    this.attachEvents();
  }

  renderCard(event) {
    const milestones = event.milestones || [];
    const completedCount = milestones.filter(m => m.completed).length;
    const progressPercent = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;
    const isUnstop = event.platform === 'Unstop';
    const venue = event.venue;

    return `
      <article class="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 p-5 sm:p-6 space-y-4 transition-all" id="card-${event.id}">
        
        <!-- Top Info Header -->
        <div class="space-y-2">
          
          <div class="flex items-center justify-between gap-2">
            <div class="flex flex-wrap items-center gap-1.5">
              ${isUnstop ? `
                <span class="unstop-pill px-2.5 py-0.5 rounded-md text-[10px] font-bold flex items-center space-x-1">
                  <i class="fas fa-bolt text-[9px] text-orange-500"></i>
                  <span>Unstop</span>
                </span>
              ` : `
                <span class="px-2.5 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-700 font-mono">
                  ${event.platform || 'Campus'}
                </span>
              `}

              <span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                ${event.category || 'Event'}
              </span>

              ${this.getStageBadge(event.stage)}
            </div>

            <!-- Card Actions -->
            <div class="flex items-center space-x-1 shrink-0">
              ${event.platformUrl ? `
                <a 
                  href="${event.platformUrl}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  title="Open Portal" 
                  class="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <i class="fas fa-arrow-up-right-from-square text-xs"></i>
                </a>
              ` : ''}

              <button 
                data-action="ics" 
                data-id="${event.id}" 
                title="Download Calendar (.ICS)" 
                class="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <i class="far fa-calendar-plus text-xs"></i>
              </button>

              <button 
                data-action="edit" 
                data-id="${event.id}" 
                title="Edit Event" 
                class="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <i class="fas fa-pen text-xs"></i>
              </button>

              <button 
                data-action="delete" 
                data-id="${event.id}" 
                title="Remove Event" 
                class="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <i class="fas fa-trash-can text-xs"></i>
              </button>
            </div>
          </div>

          <!-- Title -->
          <h3 class="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white leading-snug">
            ${event.title}
          </h3>

          <!-- Meta tags -->
          <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            ${event.registrationId ? `
              <span class="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                ${event.registrationId}
              </span>
            ` : ''}

            ${event.teamName ? `
              <span class="flex items-center space-x-1 font-medium text-slate-600 dark:text-slate-300">
                <i class="fas fa-users text-xs text-blue-500"></i>
                <span>Team <strong>${event.teamName}</strong></span>
              </span>
            ` : ''}

            ${venue && venue.building ? `
              <span class="flex items-center space-x-1 text-slate-600 dark:text-slate-300">
                <i class="fas fa-location-dot text-xs text-emerald-500"></i>
                <span>${venue.building}${venue.room ? `, ${venue.room}` : ''}</span>
              </span>
            ` : (venue && venue.isVirtual ? `
              <span class="flex items-center space-x-1 text-slate-600 dark:text-slate-300">
                <i class="fas fa-globe text-xs text-blue-500"></i>
                <span>Virtual / Online</span>
              </span>
            ` : '')}

            ${event.prizePool ? `
              <span class="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <i class="fas fa-gift text-xs"></i>
                <span>${event.prizePool}</span>
              </span>
            ` : ''}
          </div>

          ${event.description ? `
            <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
              ${event.description}
            </p>
          ` : ''}

        </div>

        <!-- Milestones Section (Rounds Stepper) -->
        <div class="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
          
          <div class="flex items-center justify-between text-xs">
            <span class="font-semibold text-slate-700 dark:text-slate-300">
              Rounds & Deadlines (${completedCount}/${milestones.length})
            </span>
            <span class="font-mono text-slate-400">
              ${progressPercent}% Complete
            </span>
          </div>

          <!-- Progress Bar -->
          <div class="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div class="h-full bg-blue-600 rounded-full transition-all duration-300" style="width: ${progressPercent}%"></div>
          </div>

          <!-- Round Items -->
          <div class="space-y-1.5 pt-1">
            ${milestones.map((m, idx) => `
              <div 
                data-milestone-toggle
                data-event-id="${event.id}"
                data-milestone-id="${m.id}"
                class="flex items-start justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                  m.completed
                    ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/20 text-slate-500 dark:text-slate-400'
                    : 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200'
                }"
              >
                <div class="flex items-start space-x-2.5 flex-1 pr-2">
                  <div class="mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    m.completed 
                      ? 'bg-emerald-600 border-emerald-600 text-white' 
                      : 'border-slate-300 dark:border-slate-600 hover:border-blue-500'
                  }">
                    ${m.completed ? '<i class="fas fa-check text-[9px]"></i>' : ''}
                  </div>
                  <div>
                    <div class="text-xs font-semibold ${m.completed ? 'line-through text-slate-400' : ''}">
                      ${m.title}
                    </div>
                    ${m.notes ? `
                      <div class="text-[11px] text-slate-400 mt-0.5">
                        ${m.notes}
                      </div>
                    ` : ''}
                  </div>
                </div>

                <div class="shrink-0 text-right">
                  <span class="text-[10px] font-mono font-medium px-2 py-0.5 rounded ${
                    m.completed 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      : (m.urgent 
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400')
                  }">
                    ${this.formatDate(m.deadline)}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>

        </div>

      </article>
    `;
  }

  attachEvents() {
    // Milestone toggles
    document.querySelectorAll('[data-milestone-toggle]').forEach(el => {
      el.onclick = () => {
        const eId = el.getAttribute('data-event-id');
        const mId = el.getAttribute('data-milestone-id');
        this.onToggleMilestone(eId, mId);
      };
    });

    // ICS download
    document.querySelectorAll('[data-action="ics"]').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const evt = this.events.find(ev => ev.id === id);
        if (evt) {
          ICSExporter.downloadSingleEvent(evt);
        }
      };
    });

    // Edit event
    document.querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        this.onEditEvent(id);
      };
    });

    // Delete event
    document.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to remove this event from your journey?')) {
          this.onDeleteEvent(id);
        }
      };
    });
  }
}
