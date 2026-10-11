// ==========================================================================
// ClashRadarView Component
// Intelligent Conflict & Schedule Overlap Analyzer
// Detects overlapping deadlines, venue transit clashes, and offers AI resolution tips
// ==========================================================================

import { sound } from '../utils/audio.js';

export class ClashRadarView {
  constructor({ clashes, events, onResolveClash, onOpenVenueMap }) {
    this.clashes = clashes;
    this.events = events;
    this.onResolveClash = onResolveClash;
    this.onOpenVenueMap = onOpenVenueMap;
  }

  update({ clashes, events }) {
    if (clashes !== undefined) this.clashes = clashes;
    if (events !== undefined) this.events = events;
    this.render();
  }

  render() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const criticalCount = this.clashes.filter(c => c.severity === 'critical').length;
    const highCount = this.clashes.filter(c => c.severity === 'high').length;

    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6">
        
        <!-- Radar Top Header & Health Gauge -->
        <div class="glass-card rounded-3xl p-6 sm:p-8 border ${
          this.clashes.length > 0 ? 'border-rose-500/40' : 'border-emerald-500/40'
        }">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div class="flex items-start space-x-4">
              <div class="w-14 h-14 rounded-2xl ${
                this.clashes.length > 0 ? 'bg-rose-500/10 text-rose-500 beacon-pulse' : 'bg-emerald-500/10 text-emerald-500'
              } flex items-center justify-center text-2xl flex-shrink-0 shadow-lg">
                <i class="fas fa-satellite-dish"></i>
              </div>

              <div>
                <div class="flex items-center space-x-2">
                  <span class="text-xs uppercase font-bold tracking-wider text-rose-600 dark:text-rose-400">
                    Conflict Intelligence Engine
                  </span>
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    this.clashes.length > 0 ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                  } font-semibold">
                    ${this.clashes.length > 0 ? `${this.clashes.length} Active Overlaps` : 'Optimal Schedule'}
                  </span>
                </div>

                <h2 class="font-serif-classic font-bold text-2xl text-slate-900 dark:text-white mt-1">
                  Schedule Clash & Travel Radar
                </h2>

                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Real-time algorithmic detection of simultaneous milestone cutoffs, tight presentation slots, and cross-campus building transitions.
                </p>
              </div>
            </div>

            <!-- Health Metric Gauge -->
            <div class="flex items-center space-x-4 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div class="text-right">
                <div class="text-[11px] text-slate-400 font-semibold uppercase">Schedule Health</div>
                <div class="text-lg font-bold font-serif-classic ${
                  this.clashes.length === 0 ? 'text-emerald-600' : (criticalCount > 0 ? 'text-rose-600' : 'text-amber-500')
                }">
                  ${this.clashes.length === 0 ? '100% Clear' : (criticalCount > 0 ? 'Action Required' : 'Moderate Stress')}
                </div>
              </div>
              <div class="w-10 h-10 rounded-full border-4 ${
                this.clashes.length === 0 ? 'border-emerald-500' : (criticalCount > 0 ? 'border-rose-500' : 'border-amber-500')
              } flex items-center justify-center font-mono text-xs font-bold text-slate-800 dark:text-white">
                ${Math.max(0, 100 - (this.clashes.length * 25))}%
              </div>
            </div>

          </div>
        </div>

        <!-- Detected Clashes List -->
        ${this.clashes.length === 0 ? `
          <div class="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <div class="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-4 border border-emerald-200 dark:border-emerald-800">
              <i class="fas fa-shield-halved"></i>
            </div>
            <h3 class="font-serif-classic font-bold text-lg text-slate-900 dark:text-white">
              Zero Schedule Collisions!
            </h3>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Your registered events, submission deadlines, and campus venues have ample buffer times. You're fully set for peak performance.
            </p>
          </div>
        ` : `
          <div class="space-y-4">
            ${this.clashes.map(clash => this.renderClashCard(clash)).join('')}
          </div>
        `}

        <!-- Proactive Prevention Tips -->
        <div class="bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-900/60 p-5 space-y-2">
          <div class="flex items-center space-x-2 text-blue-800 dark:text-blue-300 font-bold text-xs uppercase tracking-wider">
            <i class="fas fa-lightbulb text-amber-500"></i>
            <span>Campus Strategy & Overlap Best Practices</span>
          </div>
          <ul class="text-xs text-blue-900/80 dark:text-blue-200/80 space-y-1 list-disc pl-5">
            <li><strong>The 24-Hour Buffer Rule:</strong> Submit high-stakes PPTs (like SIH / HackIIITD) 1 day before the formal cutoff to avoid portal crashes and server throttling.</li>
            <li><strong>Squad Role Delegation:</strong> When two presentations occur on the same day, assign dedicated co-presenters to lead technical Q&A across the two venues.</li>
            <li><strong>Walking Distance Checks:</strong> Transit between R&D Block and Old Academic Block takes 3-4 minutes via the skybridge walkway.</li>
          </ul>
        </div>

      </div>
    `;

    this.attachEvents();
  }

  renderClashCard(clash) {
    const isCritical = clash.severity === 'critical';
    const isHigh = clash.severity === 'high';

    return `
      <div class="bg-white dark:bg-slate-800/90 rounded-2xl border ${
        isCritical ? 'border-rose-300 dark:border-rose-800/80' : 'border-amber-300 dark:border-amber-800/80'
      } p-5 sm:p-6 shadow-sm space-y-4">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-700/60">
          <div class="flex items-center space-x-2">
            <span class="px-2.5 py-0.5 text-xs font-bold rounded-full ${
              isCritical 
                ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300' 
                : 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
            }">
              ${isCritical ? '⚠️ Direct Conflict' : '⚡ Tight Window'}
            </span>
            <span class="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300">
              Only ${clash.diffHours} hours apart
            </span>
            <span class="text-slate-400">•</span>
            <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">
              ${clash.date}
            </span>
          </div>

          <button data-action="resolve-clash" data-event-id="${clash.m1.eventId}" data-ms-id="${clash.m1.milestoneId}" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs flex items-center space-x-1.5 transition-colors self-start sm:self-auto">
            <i class="fas fa-check-circle"></i>
            <span>Mark Prepared / Done</span>
          </button>
        </div>

        <!-- Conflicting Pair Comparison Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <!-- Event 1 -->
          <div class="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/70 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                ${clash.m1.eventCategory}
              </span>
              <span class="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                ${clash.m1.deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h4 class="font-serif-classic font-bold text-sm text-slate-900 dark:text-white">
              ${clash.m1.eventTitle}
            </h4>
            <div class="text-xs text-slate-600 dark:text-slate-300 font-medium flex items-center space-x-1">
              <i class="fas fa-file-lines text-blue-500"></i>
              <span>${clash.m1.milestoneTitle}</span>
            </div>
            <div class="text-[11px] text-slate-400 flex items-center space-x-1">
              <i class="fas fa-location-dot text-emerald-500"></i>
              <span>${clash.m1.eventVenue}</span>
            </div>
          </div>

          <!-- Event 2 -->
          <div class="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/70 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                ${clash.m2.eventCategory}
              </span>
              <span class="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                ${clash.m2.deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h4 class="font-serif-classic font-bold text-sm text-slate-900 dark:text-white">
              ${clash.m2.eventTitle}
            </h4>
            <div class="text-xs text-slate-600 dark:text-slate-300 font-medium flex items-center space-x-1">
              <i class="fas fa-file-lines text-amber-500"></i>
              <span>${clash.m2.milestoneTitle}</span>
            </div>
            <div class="text-[11px] text-slate-400 flex items-center space-x-1">
              <i class="fas fa-location-dot text-emerald-500"></i>
              <span>${clash.m2.eventVenue}</span>
            </div>
          </div>

        </div>

        <!-- AI Advice Box -->
        <div class="bg-amber-50/70 dark:bg-amber-950/30 p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/50 flex items-start space-x-2.5 text-xs text-amber-900 dark:text-amber-200">
          <i class="fas fa-robot text-amber-600 text-sm mt-0.5"></i>
          <div>
            <span class="font-bold">Algorithmic Recommendation:</span>
            <span class="ml-1">${clash.advice}</span>
          </div>
        </div>

      </div>
    `;
  }

  attachEvents() {
    document.querySelectorAll('[data-action="resolve-clash"]').forEach(btn => {
      btn.onclick = () => {
        const eventId = btn.getAttribute('data-event-id');
        const msId = btn.getAttribute('data-ms-id');
        sound.playSuccess();
        this.onResolveClash(eventId, msId);
      };
    });
  }
}
