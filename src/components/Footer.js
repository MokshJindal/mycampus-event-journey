// ==========================================================================
// Footer Component
// Minimalist, Clean Student Dashboard Footer with 1-Click Calendar Export
// ==========================================================================

import { ICSExporter } from '../utils/icsExporter.js';
import { StorageManager } from '../utils/storage.js';

export class Footer {
  constructor({ onOpenModal, onViewChange }) {
    this.onOpenModal = onOpenModal;
    this.onViewChange = onViewChange;
  }

  render() {
    const container = document.getElementById('footer-root');
    if (!container) return;

    container.innerHTML = `
      <footer class="no-print mt-auto py-6 text-xs text-slate-500 dark:text-slate-400">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="glass-panel rounded-2xl px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 border border-slate-200 dark:border-white/10 shadow-xs">
            
            <!-- Left: Brand & Info -->
            <div class="flex items-center space-x-2">
              <span class="font-display font-bold text-slate-900 dark:text-white">MyCampus</span>
              <span class="text-slate-400">•</span>
              <span class="text-slate-500 dark:text-slate-400">IIIT Delhi Collegiate Event Timeline</span>
            </div>

            <!-- Center: Navigation -->
            <div class="flex items-center space-x-4 text-xs">
              <button id="footer-link-timeline" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Timeline
              </button>
              <button id="footer-link-calendar" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Calendar
              </button>
              <button id="footer-link-unstop" class="text-orange-600 dark:text-orange-400 hover:underline transition-colors font-semibold">
                Unstop Hub
              </button>
            </div>

            <!-- Right: 1-Click Export -->
            <div class="flex items-center space-x-2">
              <button 
                id="footer-export-ics"
                title="Export all events to Google/Apple Calendar (.ICS)"
                class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <i class="far fa-calendar-plus text-xs"></i>
                <span>Export to Calendar (.ics)</span>
              </button>
            </div>

          </div>

        </div>
      </footer>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const linkTimeline = document.getElementById('footer-link-timeline');
    if (linkTimeline) linkTimeline.onclick = () => this.onViewChange('timeline');

    const linkCalendar = document.getElementById('footer-link-calendar');
    if (linkCalendar) linkCalendar.onclick = () => this.onViewChange('calendar');

    const linkUnstop = document.getElementById('footer-link-unstop');
    if (linkUnstop) linkUnstop.onclick = () => this.onViewChange('unstop');

    const exportBtn = document.getElementById('footer-export-ics');
    if (exportBtn) {
      exportBtn.onclick = () => {
        const events = StorageManager.getEvents();
        ICSExporter.downloadICS(events);
      };
    }
  }
}
