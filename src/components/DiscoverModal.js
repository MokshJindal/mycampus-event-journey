// ==========================================================================
// DiscoverModal Component
// Campus Discovery Catalog: Browse upcoming premier hackathons, conferences,
// workshops, and design sprints with 1-click timeline import
// ==========================================================================

import { sound } from '../utils/audio.js';
import { DISCOVERY_EVENTS } from '../data/discoveryData.js';

export class DiscoverModal {
  constructor({ onImportDiscoveredEvent, onClose, existingEventIds }) {
    this.onImportDiscoveredEvent = onImportDiscoveredEvent;
    this.onClose = onClose;
    this.existingEventIds = existingEventIds || new Set();
    this.filterCat = 'All';
  }

  render() {
    let modal = document.getElementById('discover-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'discover-modal';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay overflow-y-auto';
      document.body.appendChild(modal);
    }

    const filtered = this.filterCat === 'All' 
      ? DISCOVERY_EVENTS 
      : DISCOVERY_EVENTS.filter(e => e.category === this.filterCat);

    modal.innerHTML = `
      <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden my-6 transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Header -->
        <div class="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-900/10 via-blue-900/10 to-transparent">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center text-lg shadow-md">
              <i class="fas fa-compass"></i>
            </div>
            <div>
              <h3 class="font-serif-classic font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
                Campus & National Event Discovery
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Curated opportunities with pre-built milestone timelines ready for 1-click addition.
              </p>
            </div>
          </div>

          <button id="close-discover-modal" class="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <i class="fas fa-xmark text-lg"></i>
          </button>
        </div>

        <!-- Filter Chips -->
        <div class="px-6 pt-4 flex flex-wrap gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          ${['All', 'Hackathon', 'Conference', 'Competition'].map(cat => `
            <button data-cat="${cat}" class="disc-filter-btn px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              this.filterCat === cat
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }">
              ${cat === 'All' ? 'All Opportunities' : cat + 's'}
            </button>
          `).join('')}
        </div>

        <!-- Catalog Grid -->
        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
          ${filtered.map(evt => {
            const isAdded = this.existingEventIds.has(evt.id);

            return `
              <div class="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/80 space-y-3 flex flex-col justify-between">
                
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                      ${evt.category} • ${evt.platform}
                    </span>
                    <span class="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                      +${evt.xpReward} XP
                    </span>
                  </div>

                  <h4 class="font-serif-classic font-bold text-base text-slate-900 dark:text-white leading-tight">
                    ${evt.title}
                  </h4>

                  <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    ${evt.description}
                  </p>

                  <div class="flex flex-wrap gap-1.5 pt-1">
                    ${(evt.skills || []).map(s => `
                      <span class="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        ${s}
                      </span>
                    `).join('')}
                  </div>
                </div>

                <div class="pt-3 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                  <div class="text-[11px] text-slate-500">
                    <i class="fas fa-gift text-amber-500 mr-1"></i>
                    <span>${evt.prizePool}</span>
                  </div>

                  <button 
                    data-action="add-disc" 
                    data-id="${evt.id}" 
                    ${isAdded ? 'disabled' : ''}
                    class="px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center space-x-1.5 ${
                      isAdded 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 cursor-default' 
                        : 'bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white'
                    }"
                  >
                    <i class="fas ${isAdded ? 'fa-check' : 'fa-plus'}"></i>
                    <span>${isAdded ? 'In Timeline' : 'Add to Journey'}</span>
                  </button>
                </div>

              </div>
            `;
          }).join('')}
        </div>

      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const closeBtn = document.getElementById('close-discover-modal');
    if (closeBtn) closeBtn.onclick = () => this.close();

    document.querySelectorAll('.disc-filter-btn').forEach(btn => {
      btn.onclick = () => {
        sound.playClick();
        this.filterCat = btn.getAttribute('data-cat');
        this.render();
      };
    });

    document.querySelectorAll('[data-action="add-disc"]').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-id');
        const discEvent = DISCOVERY_EVENTS.find(e => e.id === id);
        if (discEvent) {
          sound.playFanfare();
          this.onImportDiscoveredEvent(discEvent);
          this.existingEventIds.add(id);
          this.render();
        }
      };
    });
  }

  close() {
    sound.playClick();
    const modal = document.getElementById('discover-modal');
    if (modal) modal.remove();
    this.onClose();
  }
}
