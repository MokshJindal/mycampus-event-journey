// ==========================================================================
// Upgraded TimelineView Component
// Flagship Event Journey: Luxury Glass Cards, Connected Steppers,
// Animated Milestones, and Rapid Campus Waypoints
// ==========================================================================

import { sound } from '../utils/audio.js';
import { ICSExporter } from '../utils/icsExporter.js';

export class TimelineView {
  constructor({ events, onToggleMilestone, onEditEvent, onDeleteEvent, onOpenSurvivalMode, onOpenVenueMap, onAddEvent }) {
    this.events = events;
    this.onToggleMilestone = onToggleMilestone;
    this.onEditEvent = onEditEvent;
    this.onDeleteEvent = onDeleteEvent;
    this.onOpenSurvivalMode = onOpenSurvivalMode;
    this.onOpenVenueMap = onOpenVenueMap;
    this.onAddEvent = onAddEvent;
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
        return `<span class="px-2.5 py-0.5 text-[11px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-full border border-amber-500/30 flex items-center space-x-1 shadow-sm"><i class="fas fa-trophy text-amber-500 text-[10px]"></i><span>Podium Won</span></span>`;
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
          <div class="w-20 h-20 rounded-3xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-3xl mx-auto mb-5 border border-blue-500/20 shadow-lg">
            <i class="fas fa-calendar-xmark"></i>
          </div>
          <h3 class="text-2xl font-serif font-bold text-slate-900 dark:text-white">
            No Active Events In This View
          </h3>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
            Ready to track your next hackathon or conference? Paste a confirmation email using AI Smart Ingest or add a custom timeline.
          </p>
          <div class="mt-8 flex justify-center space-x-3">
            <button id="empty-add-btn" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all">
              <i class="fas fa-plus mr-1.5"></i> Add Custom Event
            </button>
            <button id="empty-import-btn" class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 transition-all">
              <i class="fas fa-wand-magic-sparkles mr-1.5 text-amber-500"></i> AI Smart Ingest
            </button>
          </div>
        </div>
      `;

      const addBtn = document.getElementById('empty-add-btn');
      if (addBtn) addBtn.onclick = () => this.onAddEvent();
      const impBtn = document.getElementById('empty-import-btn');
      if (impBtn) impBtn.onclick = () => {
        const smartBtn = document.getElementById('btn-smart-ingest');
        if (smartBtn) smartBtn.click();
      };
      return;
    }

    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6">
        
        <div class="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-white/5">
          <div class="flex items-center space-x-2.5">
            <h2 class="font-serif font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
              Event Journey Milestones
            </h2>
            <span class="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-mono font-bold">
              ${this.events.length} Active
            </span>
          </div>

          <div class="text-xs text-slate-400 font-medium hidden sm:block">
            <i class="fas fa-info-circle mr-1 text-blue-500"></i> Click checkmarks to mark milestones complete & claim XP
          </div>
        </div>

        <!-- 2-Column Responsive Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

    return `
      <article class="glass-card rounded-3xl overflow-hidden transition-all duration-300 relative group" id="card-${event.id}">
        
        <!-- Top Illuminated Gradient Accent Line -->
        <div class="h-1.5 w-full" style="background: linear-gradient(90deg, ${event.color || '#3b82f6'}, #8b5cf6, #f59e0b);"></div>

        <!-- Card Header Section -->
        <div class="p-6 sm:p-7 border-b border-slate-100 dark:border-white/5 space-y-4">
          
          <div class="flex items-start justify-between gap-4">
            
            <div class="space-y-2 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-lg text-white shadow-xs" style="background-color: ${event.color || '#3b82f6'};">
                  ${event.category || 'Event'}
                </span>
                
                <span class="px-2 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700/80 flex items-center space-x-1 font-mono">
                  <i class="fas fa-layer-group text-[9px] text-slate-400"></i>
                  <span>${event.platform || 'Campus'}</span>
                </span>

                ${this.getStageBadge(event.stage)}
              </div>

              <h3 class="font-serif font-bold text-xl sm:text-2xl text-slate-900 dark:text-white leading-tight tracking-tight">
                ${event.title}
              </h3>

              <div class="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                <span class="font-mono bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                  <i class="fas fa-barcode text-[9px] mr-1 text-slate-400"></i>${event.registrationId || 'REG-PENDING'}
                </span>

                ${event.teamName ? `
                  <span class="flex items-center space-x-1.5 font-medium">
                    <i class="fas fa-users text-blue-500"></i>
                    <span>Team <strong>${event.teamName}</strong></span>
                  </span>
                ` : ''}

                ${event.prizePool ? `
                  <span class="flex items-center space-x-1.5 text-amber-500 font-semibold">
                    <i class="fas fa-gift text-xs"></i>
                    <span>${event.prizePool}</span>
                  </span>
                ` : ''}
              </div>
            </div>

            <!-- Quick Action Floating Buttons -->
            <div class="flex items-center space-x-1.5 flex-shrink-0">
              <button data-action="survival" data-id="${event.id}" title="Launch Day-of-Event HUD & QR Admit Pass" class="p-2.5 text-amber-500 hover:bg-amber-500/10 rounded-xl border border-amber-500/30 transition-colors shadow-sm">
                <i class="fas fa-bolt text-sm"></i>
              </button>

              <button data-action="ics" data-id="${event.id}" title="Export event to calendar (.ICS)" class="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-colors">
                <i class="far fa-calendar-plus text-sm"></i>
              </button>

              <button data-action="edit" data-id="${event.id}" title="Edit event" class="p-2.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-colors">
                <i class="fas fa-pen text-xs"></i>
              </button>

              <button data-action="delete" data-id="${event.id}" title="Remove event" class="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-colors">
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
            <div class="bg-slate-50 dark:bg-slate-900/70 p-3 rounded-2xl border border-slate-200 dark:border-white/5 flex items-center justify-between text-xs">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xs">
                  <i class="fas fa-location-dot"></i>
                </div>
                <div>
                  <div class="font-bold text-slate-900 dark:text-white">
                    ${event.venue.building}
                  </div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400">
                    ${event.venue.room || 'Campus Zone'}
                  </div>
                </div>
              </div>

              <button data-action="map-venue" data-building="${event.venue.building}" class="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl border border-slate-300 dark:border-slate-700 text-[11px] flex items-center space-x-1.5 shadow-xs transition-colors">
                <i class="fas fa-compass text-xs"></i>
                <span>Wayfinder</span>
              </button>
            </div>
          ` : ''}

          <!-- Horizontal Stepper Bar (Linear Visual Pipeline) -->
          <div class="pt-2">
            <div class="flex items-center justify-between text-xs mb-2">
              <span class="font-semibold text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                <span>Journey Completion</span>
                <span class="font-mono text-slate-900 dark:text-white font-bold">(${completedCount}/${milestones.length})</span>
              </span>
              <span class="font-mono font-bold ${progressPercent === 100 ? 'text-emerald-500' : 'text-blue-500'}">
                ${progressPercent}%
              </span>
            </div>
            
            <div class="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div class="h-2 rounded-full transition-all duration-500 ${
                progressPercent === 100
                  ? 'bg-emerald-500'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
              }" style="width: ${progressPercent}%;"></div>
            </div>
          </div>

        </div>

        <!-- Milestones Stem Section -->
        <div class="p-6 sm:p-7 bg-slate-50/40 dark:bg-slate-950/40 space-y-4">
          <div class="space-y-3.5">
            ${milestones.map((milestone) => {
              const relative = this.getRelativeDeadline(milestone.deadline, milestone.completed);
              const isUrgent = milestone.urgent && !milestone.completed;

              return `
                <div class="flex items-start space-x-3.5 group" id="ms-${event.id}-${milestone.id}">
                  
                  <!-- Interactive Node Checkbox -->
                  <button 
                    data-action="toggle-ms" 
                    data-event-id="${event.id}" 
                    data-ms-id="${milestone.id}"
                    title="${milestone.completed ? 'Mark incomplete' : 'Mark completed'}"
                    class="w-8 h-8 rounded-xl flex items-center justify-center transition-all transform active:scale-90 shadow-sm flex-shrink-0 mt-0.5 ${
                      milestone.completed
                        ? 'bg-emerald-500 text-white shadow-emerald-500/25 ring-2 ring-emerald-500/30'
                        : (isUrgent
                            ? 'bg-rose-500/10 text-rose-500 border-2 border-rose-500 beacon-pulse'
                            : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-blue-500 border border-slate-300 dark:border-slate-700 hover:border-blue-500')
                    }"
                  >
                    <i class="fas ${milestone.completed ? 'fa-check text-xs' : this.getPhaseIcon(milestone.phase)} text-[11px]"></i>
                  </button>

                  <!-- Milestone Card Container -->
                  <div class="flex-1 bg-white dark:bg-slate-800/90 p-3.5 rounded-2xl border ${
                    isUrgent 
                      ? 'border-rose-500/50 dark:border-rose-500/40 shadow-rose-500/5 shadow-md' 
                      : 'border-slate-200/80 dark:border-white/5 shadow-2xs'
                  } group-hover:border-slate-300 dark:group-hover:border-white/10 transition-all">
                    
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div class="flex items-center space-x-2">
                        <span class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 font-mono">
                          ${milestone.phase || 'Round'}
                        </span>
                        <h4 class="text-xs sm:text-sm font-bold ${
                          milestone.completed 
                            ? 'line-through text-slate-400 dark:text-slate-500' 
                            : 'text-slate-900 dark:text-white'
                        }">
                          ${milestone.title}
                        </h4>
                      </div>

                      <div class="flex items-center space-x-2 text-[11px] font-mono">
                        ${isUrgent ? `
                          <span class="px-2 py-0.5 bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold rounded-lg border border-rose-500/30 animate-pulse">
                            ${relative}
                          </span>
                        ` : `
                          <span class="${milestone.completed ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400 font-medium'}">
                            ${this.formatDate(milestone.deadline)}
                          </span>
                        `}
                      </div>
                    </div>

                    ${milestone.notes ? `
                      <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                        ${milestone.notes}
                      </p>
                    ` : ''}

                    ${milestone.location ? `
                      <div class="mt-2.5 flex items-center space-x-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                        <i class="fas fa-location-pin text-[10px] text-emerald-500"></i>
                        <span>${milestone.location}</span>
                      </div>
                    ` : ''}

                  </div>

                </div>
              `;
            }).join('')}
          </div>

          <!-- Bottom Squad & Resource Bar -->
          <div class="pt-4 mt-2 border-t border-slate-200 dark:border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
            
            <div class="flex items-center space-x-2.5">
              <span class="text-[11px] text-slate-400 font-semibold">Squad:</span>
              <div class="flex -space-x-2 overflow-hidden">
                ${(event.teamMembers || []).map(m => `
                  <div class="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-slate-900 bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-[10px] flex items-center justify-center shadow-xs" title="${m.name} (${m.role})">
                    ${m.avatar || m.name.slice(0, 2).toUpperCase()}
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="flex items-center space-x-2.5">
              ${event.links && event.links.github ? `
                <a href="${event.links.github}" target="_blank" rel="noopener" class="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1" title="GitHub">
                  <i class="fab fa-github text-sm"></i>
                </a>
              ` : ''}
              ${event.links && event.links.figma ? `
                <a href="${event.links.figma}" target="_blank" rel="noopener" class="text-slate-400 hover:text-purple-500 p-1" title="Figma">
                  <i class="fab fa-figma text-sm"></i>
                </a>
              ` : ''}
              ${event.links && event.links.portal ? `
                <a href="${event.links.portal}" target="_blank" rel="noopener" class="text-slate-400 hover:text-blue-500 p-1" title="Portal">
                  <i class="fas fa-arrow-up-right-from-square text-xs"></i>
                </a>
              ` : ''}
              
              <button data-action="survival" data-id="${event.id}" class="px-3 py-1.5 bg-gradient-to-r from-amber-500/10 to-amber-500/20 hover:from-amber-500/20 hover:to-amber-500/30 text-amber-600 dark:text-amber-400 font-bold rounded-xl text-xs flex items-center space-x-1.5 border border-amber-500/30 transition-all">
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
  }
}
