// ==========================================================================
// Footer Component
// Modern Bottom Dashboard Bar with Keyboard Cheatsheet,
// Event Bus Status, and Quick Launch Shortcuts
// ==========================================================================

import { sound } from '../utils/audio.js';

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
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          
          <!-- Bottom Command Dashboard Bar -->
          <div class="glass-panel rounded-2xl px-5 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-200 dark:border-white/10 shadow-sm">
            
            <!-- Left: Institution & Live Status -->
            <div class="flex items-center space-x-3 shrink-0">
              <div class="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-display font-bold text-xs shadow-xs">
                MC
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <span class="font-display font-bold text-slate-900 dark:text-white">MyCampus</span>
                  <span class="text-slate-400">•</span>
                  <span class="text-slate-500 dark:text-slate-400 font-mono text-[11px]">HACKSHIFT • IIITD</span>
                </div>
                <div class="flex items-center space-x-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Event Bus Synced • RFC 5545 Ready</span>
                </div>
              </div>
            </div>

            <!-- Center: Keyboard Shortcuts Cheatsheet -->
            <div class="hidden lg:flex items-center space-x-3 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span class="text-[10px] uppercase font-bold tracking-wider text-slate-400">Shortcuts:</span>
              <span class="flex items-center space-x-1"><kbd class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200">1</kbd><span>Timeline</span></span>
              <span class="flex items-center space-x-1"><kbd class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200">2</kbd><span>Calendar</span></span>
              <span class="flex items-center space-x-1"><kbd class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200">3</kbd><span>Pipeline</span></span>
              <span class="flex items-center space-x-1"><kbd class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200">4</kbd><span>Radar</span></span>
              <span class="flex items-center space-x-1"><kbd class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200">⌘K</kbd><span>Search</span></span>
              <span class="flex items-center space-x-1"><kbd class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200">U</kbd><span>Unstop</span></span>
            </div>

            <!-- Right: Quick Direct Action Chips -->
            <div class="flex flex-wrap items-center gap-1.5 shrink-0 text-xs">
              <button id="footer-btn-unstop" class="px-2.5 py-1 unstop-pill hover:opacity-80 rounded-lg font-bold flex items-center space-x-1 transition-all">
                <i class="fas fa-bolt text-[10px]"></i>
                <span>Unstop Hub</span>
              </button>

              <button id="footer-btn-map" class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors">
                <i class="fas fa-map-location-dot text-[10px] text-emerald-500 mr-1"></i>Wayfinder
              </button>

              <button id="footer-btn-passport" class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors">
                <i class="fas fa-id-card-clip text-[10px] text-indigo-500 mr-1"></i>Passport
              </button>

              <button id="footer-btn-ingest" class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors">
                <i class="fas fa-wand-magic-sparkles text-[10px] text-purple-500 mr-1"></i>AI Ingest
              </button>
            </div>

          </div>

        </div>
      </footer>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const btnUnstop = document.getElementById('footer-btn-unstop');
    if (btnUnstop) btnUnstop.onclick = () => { sound.playClick(); this.onOpenModal('unstop-plugin'); };

    const btnMap = document.getElementById('footer-btn-map');
    if (btnMap) btnMap.onclick = () => { sound.playClick(); this.onOpenModal('campus-map'); };

    const btnPass = document.getElementById('footer-btn-passport');
    if (btnPass) btnPass.onclick = () => { sound.playClick(); this.onOpenModal('passport'); };

    const btnIngest = document.getElementById('footer-btn-ingest');
    if (btnIngest) btnIngest.onclick = () => { sound.playClick(); this.onOpenModal('smart-ingest'); };
  }
}
