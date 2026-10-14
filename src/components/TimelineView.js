// ==========================================================================
// Upgraded TimelineView Component
// Flagship Event Journey: Modern Glass Cards, Connected Steppers,
// Animated Milestones, Unstop Plugin Integration, and Campus Waypoints
// ==========================================================================

import { sound } from '../utils/audio.js';
import { ICSExporter } from '../utils/icsExporter.js';

export class TimelineView {
  constructor({ events, onToggleMilestone, onEditEvent, onDeleteEvent, onOpenSurvivalMode, onOpenVenueMap, onAddEvent, onOpenUnstopPlugin }) {
    this.events = events;
    this.onToggleMilestone = onToggleMilestone;
    this.onEditEvent = onEditEvent;
    this.onDeleteEvent = onDeleteEvent;
    this.onOpenSurvivalMode = onOpenSurvivalMode;
    this.onOpenVenueMap = onOpenVenueMap;
    this.onAddEvent = onAddEvent;
    this.onOpenUnstopPlugin = onOpenUnstopPlugin;
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

  getRelativeDeadline(dateStr, completed) {
    if (completed) return 'Completed';
    if (!dateStr) return '';
    const now = new Date();
    const d = new Date(dateStr);
    const diffMs = d - now;
    if (diffMs < 0) return 'Past Deadline';

    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHrs < 24) {
      return `Due in ${diffHrs}h`;
    }
    const diffDays = Math.floor(diffHrs / 24);
    return `Due in ${diffDays}d`;
  }

  getPhaseIcon(phase) {
    const p = (phase || '').toLowerCase();
    if (p.includes('reg')) return 'fa-user-check';
    if (p.includes('subm') || p.includes('ppt') || p.includes('paper')) return 'fa-file-arrow-up';
    if (p.includes('short') || p.includes('notif')) return 'fa-bullhorn';
    if (p.includes('mentor')) return 'fa-user-tie';
    if (p.includes('final') || p.includes('pitch') || p.includes('hack')) return 'fa-flag-checkered';
    if (p.includes('cert') || p.includes('podium') || p.includes('award')) return 'fa-trophy';
    return 'fa-circle-dot';
  }

  getStageBadge(stage) {
    switch (stage) {
      case 'won':
        return `<span class="px-2.5 py-0.5 text-[11px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-full border border-amber-500/30 flex items-center space-x-1 shadow-2xs"><i class="fas fa-trophy text-amber-500 text-[10px]"></i><span>Podium Won</span></span>`;
      case 'completed':
        return `<span class="px-2.5 py-0.5 text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/30 flex items-center space-x-1"><i class="fas fa-check-circle text-emerald-500 text-[10px]"></i><span>Completed</span></span>`;
      case 'finalist':
        return `<span class="px-2.5 py-0.5 text-[11px] font-semibold bg-purple-500/15 text-purple-600 dark:text-purple-400 rounded-full border border-purple-500/30 flex items-center space-x-1"><i class="fas fa-star text-purple-500 text-[10px]"></i><span>Finalist</span></span>`;
      case 'in-prep':
        return `<span class="px-2.5 py-0.5 text-[11px] font-semibold bg-blue-500/15 text-blue-600 dark:text-blue-400 rounded-full border border-blue-500/30 flex items-center space-x-1"><i class="fas fa-hammer text-blue-500 text-[10px]"></i><span>In Prep</span></span>`;
      default:
        return `<span class="px-2.5 py-0.5 text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full border border-slate-300 dark:border-slate-700">Registered</span>`;
    }
  }

  render() {
    const container = document.getElementById('view-container');
    if (!container) return;

    if (this.events.length === 0) {
      container.innerHTML = `
        <div class="max-w-xl mx-auto py-20 px-4 text-center">
          <div class="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-2xl mx-auto mb-4 border border-blue-500/20 shadow-sm">
            <i class="fas fa-calendar-xmark"></i>
          </div>
          <h3 class="text-xl font-display font-bold text-slate-900 dark:text-white">
            No Active Events In This View
          </h3>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
            Ready to track your next hackathon or competition? Use the Unstop plugin, paste an email, or add a custom timeline.
          </p>
          <div class="mt-6 flex justify-center space-x-3">
            <button id="empty-add-btn" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all">
              <i class="fas fa-plus mr-1.5"></i> Add Custom Event
            </button>
            <button id="empty-unstop-btn" class="px-4 py-2 unstop-pill hover:opacity-80 rounded-xl text-xs font-bold transition-all">
              <i class="fas fa-bolt mr-1.5 text-orange-500"></i> Unstop Plugin
            </button>
          </div>
        </div>
      `;

      const addBtn = document.getElementById('empty-add-btn');
      if (addBtn) addBtn.onclick = () => this.onAddEvent();
      const unstopBtn = document.getElementById('empty-unstop-btn');
      if (unstopBtn) unstopBtn.onclick = () => {
        if (this.onOpenUnstopPlugin) this.onOpenUnstopPlugin();
      };
      return;
    }

    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-5">
        
        <div class="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-white/5">
          <div class="flex items-center space-x-2.5">
            <h2 class="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
              Event Journey Milestones
            </h2>
            <span class="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-mono font-bold border border-blue-200 dark:border-blue-800">
              ${this.events.length} Active
            </span>
          </div>

          <div class="text-xs text-slate-400 font-medium hidden sm:flex items-center space-x-2">
            <span>Click checkmarks to complete deliverables & claim XP</span>
          </div>
        </div>

        <!-- 2-Column Responsive Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          ${this.events.map(event => this.renderEventCard(event)).join('')}
        </div>

      </div>
    `;

    this.attachEvents();
  }

  renderEventCard(event) {
    const milestones = event.milestones || [];
    const completedCount = milestones.filter(m => m.completed).length;
    const progressPercent = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;
    const hasVenue = event.venue && event.venue.building;
    const isUnstop = event.platform === 'Unstop';

    return `
      <article class="glass-card rounded-2xl overflow-hidden transition-all duration-200 relative group" id="card-${event.id}">
        
        <!-- Top Accent Line -->
        <div class="h-1 w-full" style="background-color: ${isUnstop ? '#ea580c' : (event.color || '#2563eb')};"></div>

        <!-- Card Header Section -->
        <div class="p-5 sm:p-6 border-b border-slate-100 dark:border-white/5 space-y-3.5">
          
          <div class="flex items-start justify-between gap-3">
            
            <div class="space-y-1.5 flex-1">
              <div class="flex flex-wrap items-center gap-1.5">
                <span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md text-white shadow-2xs" style="background-color: ${isUnstop ? '#ea580c' : (event.color || '#2563eb')};">
                  ${event.category || 'Event'}
                </span>
                
                ${isUnstop ? `
                  <button data-action="unstop-details" data-id="${event.id}" title="View Unstop Competition Details" class="unstop-pill px-2 py-0.5 text-[10px] font-bold rounded flex items-center space-x-1 hover:opacity-80 transition-opacity">
                    <i class="fas fa-bolt text-[9px]"></i>
                    <span>Unstop Track</span>
                  </button>
                ` : `
                  <span class="px-2 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700/80 font-mono">
                    ${event.platform || 'Campus'}
                  </span>
                `}

                ${this.getStageBadge(event.stage)}
              </div>

              <h3 class="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white leading-snug tracking-tight">
                ${event.title}
              </h3>

              <div class="flex flex-wrap items-center gap-y-1 gap-x-2.5 text-xs text-slate-500 dark:text-slate-400">
                <span class="font-mono bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                  ${event.registrationId || 'REG-PENDING'}
                </span>

                ${event.teamName ? `
                  <span class="flex items-center space-x-1 font-medium text-slate-700 dark:text-slate-300">
                    <i class="fas fa-users text-blue-500 text-xs"></i>
                    <span>Team <strong>${event.teamName}</strong></span>
                  </span>
                ` : ''}

                ${event.prizePool ? `
                  <span class="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <i class="fas fa-gift text-xs"></i>
                    <span>${event.prizePool}</span>
                  </span>
                ` : ''}
              </div>
            </div>

            <!-- Quick Action Floating Buttons -->
            <div class="flex items-center space-x-1 flex-shrink-0">
              <button data-action="survival" data-id="${event.id}" title="Launch Day-of HUD & QR Pass" class="p-2 text-amber-500 hover:bg-amber-500/10 rounded-lg border border-amber-500/30 transition-colors">
                <i class="fas fa-bolt text-xs"></i>
              </button>

              <button data-action="ics" data-id="${event.id}" title="Export event (.ICS)" class="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg border border-slate-200 dark:border-slate-700/80 transition-colors">
                <i class="far fa-calendar-plus text-xs"></i>
              </button>

              <button data-action="edit" data-id="${event.id}" title="Edit event" class="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700/80 transition-colors">
                <i class="fas fa-pen text-xs"></i>
              </button>

              <button data-action="delete" data-id="${event.id}" title="Remove event" class="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg border border-slate-200 dark:border-slate-700/80 transition-colors">
                <i class="fas fa-trash-can text-xs"></i>
              </button>
            </div>

          </div>

          <!-- Description -->
          ${event.description ? `
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              ${event.description}
            </p>
          ` : ''}

          <!-- Venue Waypoint Card -->
          ${hasVenue ? `
            <div class="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-white/5 flex items-center justify-between text-xs">
              <div class="flex items-center space-x-2.5">
                <div class="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xs">
                  <i class="fas fa-location-dot"></i>
                </div>
                <div>
                  <div class="font-bold text-slate-900 dark:text-white font-display">
                    ${event.venue.building}
                  </div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400">
                    ${event.venue.room || 'Campus Zone'}
                  </div>
                </div>
              </div>

              <button data-action="map-venue" data-building="${event.venue.building}" class="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-xs flex items-center space-x-1 transition-colors">
                <span>View on Map</span>
                <i class="fas fa-arrow-right text-[10px]"></i>
              </button>
            </div>
          ` : ''}

          <!-- Progress Bar & Milestone Counter -->
          <div class="space-y-1.5 pt-1">
            <div class="flex justify-between items-center text-xs font-semibold">
              <span class="text-slate-500 dark:text-slate-400">
                Milestone Progress (${completedCount}/${milestones.length})
              </span>
              <span class="font-mono ${progressPercent === 100 ? 'text-emerald-500 font-bold' : 'text-blue-500'}">
                ${progressPercent}%
              </span>
            </div>

            <div class="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                class="h-2 rounded-full transition-all duration-500 ${progressPercent === 100 ? 'bg-emerald-500' : 'bg-blue-600'}" 
                style="width: ${progressPercent}%;"
              ></div>
            </div>
          </div>

        </div>

        <!-- Milestones Section (Steppers & Deliverables) -->
        <div class="p-5 sm:p-6 space-y-4">
          
          <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between font-mono">
            <span>Milestone Checkpoints</span>
            <span>Reward: +${event.xpReward || 200} XP</span>
          </div>

          <div class="space-y-3">
            ${milestones.map((milestone, idx) => {
              const isUrgent = milestone.urgent && !milestone.completed;
              const relTime = this.getRelativeDeadline(milestone.deadline, milestone.completed);
              const phaseIcon = this.getPhaseIcon(milestone.phase);

              return `
                <div class="flex items-start space-x-3 p-3 rounded-xl border transition-all ${
                  milestone.completed
                    ? 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-80'
                    : (isUrgent
                        ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/60 shadow-2xs'
                        : 'bg-white/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60')
                }">
                  
                  <!-- Checkbox Toggle -->
                  <button 
                    data-action="toggle-ms" 
                    data-event-id="${event.id}" 
                    data-ms-id="${milestone.id}"
                    class="mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      milestone.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 hover:border-blue-500 bg-white dark:bg-slate-800 text-transparent'
                    }"
                  >
                    <i class="fas fa-check text-[10px]"></i>
                  </button>

                  <!-- Milestone Content -->
                  <div class="flex-1 space-y-1">
                    <div class="flex flex-wrap items-center justify-between gap-1">
                      <span class="text-xs font-semibold ${milestone.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}">
                        ${milestone.title}
                      </span>

                      <div class="flex items-center space-x-1.5 font-mono text-[11px]">
                        ${isUrgent ? `
                          <span class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500 text-slate-950 animate-pulse">
                            ${relTime}
                          </span>
                        ` : `
                          <span class="text-slate-400 text-[10px]">${relTime}</span>
                        `}
                      </div>
                    </div>

                    <div class="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span class="flex items-center space-x-1 font-mono">
                        <i class="far fa-clock text-[10px] text-slate-400"></i>
                        <span>${this.formatDate(milestone.deadline)}</span>
                      </span>

                      ${milestone.phase ? `
                        <span class="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium">
                          ${milestone.phase}
                        </span>
                      ` : ''}
                    </div>

                    ${milestone.notes ? `
                      <p class="text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                        ${milestone.notes}
                      </p>
                    ` : ''}
                  </div>

                </div>
              `;
            }).join('')}
          </div>

          <!-- Bottom Squad & Resource Bar -->
          <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            
            <div class="flex items-center space-x-2">
              <span class="text-[11px] text-slate-400 font-semibold font-mono">Squad:</span>
              <div class="flex -space-x-1.5 overflow-hidden">
                ${(event.teamMembers || []).map(m => `
                  <div class="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-900 bg-blue-600 text-white font-bold text-[9px] flex items-center justify-center font-display" title="${m.name} (${m.role})">
                    ${m.avatar || m.name.slice(0, 2).toUpperCase()}
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="flex items-center space-x-2">
              ${isUnstop ? `
                <button data-action="unstop-details" data-id="${event.id}" class="px-2.5 py-1 text-xs unstop-pill hover:opacity-80 rounded-lg font-bold flex items-center space-x-1 transition-all">
                  <i class="fas fa-bolt text-[10px]"></i>
                  <span>Unstop Rounds</span>
                </button>
              ` : ''}

              <button data-action="survival" data-id="${event.id}" class="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold rounded-lg text-xs flex items-center space-x-1 border border-amber-500/30 transition-all">
                <i class="fas fa-qrcode text-xs"></i>
                <span>Digital Pass</span>
              </button>
            </div>

          </div>

        </div>

      </article>
    `;
  }

  attachEvents() {
    document.querySelectorAll('[data-action="toggle-ms"]').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const eventId = btn.getAttribute('data-event-id');
        const msId = btn.getAttribute('data-ms-id');
        this.onToggleMilestone(eventId, msId);
      };
    });

    document.querySelectorAll('[data-action="survival"]').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        sound.playClick();
        this.onOpenSurvivalMode(id);
      };
    });

    document.querySelectorAll('[data-action="map-venue"]').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const building = btn.getAttribute('data-building');
        sound.playClick();
        this.onOpenVenueMap(building);
      };
    });

    document.querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        sound.playClick();
        this.onEditEvent(id);
      };
    });

    document.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const evt = this.events.find(ev => ev.id === id);
        const title = evt ? evt.title : 'this event';
        if (confirm(`Remove "${title}" from your journey?`)) {
          sound.playClick();
          this.onDeleteEvent(id);
        }
      };
    });

    document.querySelectorAll('[data-action="ics"]').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const evt = this.events.find(ev => ev.id === id);
        if (evt) {
          sound.playClick();
          ICSExporter.downloadICS([evt], `${evt.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.ics`);
        }
      };
    });

    document.querySelectorAll('[data-action="unstop-details"]').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        sound.playClick();
        if (this.onOpenUnstopPlugin) {
          this.onOpenUnstopPlugin();
        }
      };
    });
  }
}
