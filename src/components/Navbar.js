// ==========================================================================
// Upgraded Navbar Component
// Floating Luxury Glassmorphism Navigation Bar, Segmented Control & Quick Actions
// ==========================================================================

import { sound } from '../utils/audio.js';

export class Navbar {
  constructor({ currentView, onViewChange, onOpenModal, clashesCount, soundMuted, onToggleSound, darkMode, onToggleTheme }) {
    this.currentView = currentView;
    this.onViewChange = onViewChange;
    this.onOpenModal = onOpenModal;
    this.clashesCount = clashesCount;
    this.soundMuted = soundMuted;
    this.onToggleSound = onToggleSound;
    this.darkMode = darkMode;
    this.onToggleTheme = onToggleTheme;
    this.clockInterval = null;
  }

  update({ currentView, clashesCount, soundMuted, darkMode }) {
    if (currentView !== undefined) this.currentView = currentView;
    if (clashesCount !== undefined) this.clashesCount = clashesCount;
    if (soundMuted !== undefined) this.soundMuted = soundMuted;
    if (darkMode !== undefined) this.darkMode = darkMode;
    this.render();
  }

  startClock() {
    if (this.clockInterval) clearInterval(this.clockInterval);
    const updateTime = () => {
      const el = document.getElementById('navbar-live-clock');
      if (el) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        el.innerHTML = `
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>${timeStr}</span>
          <span class="text-[10px] text-slate-400 font-sans hidden lg:inline">IST</span>
        `;
      }
    };
    updateTime();
    this.clockInterval = setInterval(updateTime, 1000);
  }

  render() {
    const container = document.getElementById('navbar-root');
    if (!container) return;

    container.innerHTML = `
      <header class="sticky top-2 z-40 w-full px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-200">
        <div class="glass-panel rounded-2xl shadow-xl px-4 py-2.5 flex items-center justify-between border border-slate-200/80 dark:border-white/10">
          
          <!-- Brand Logo & University Title -->
          <div class="flex items-center space-x-3 cursor-pointer group" id="nav-brand-click">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <i class="fas fa-graduation-cap text-base text-amber-300"></i>
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <span class="font-serif font-bold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  MyCampus
                </span>
                <span class="px-1.5 py-0.2 text-[9px] uppercase tracking-wider font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-md">
                  Prestige
                </span>
              </div>
              <div class="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                IIIT Delhi • Event Command
              </div>
            </div>
          </div>

          <!-- Central Segmented Control View Switcher (Linear Style) -->
          <nav class="hidden md:flex items-center bg-slate-100/80 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner">
            <button data-view="timeline" class="nav-view-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all ${
              this.currentView === 'timeline'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }">
              <i class="fas fa-stream text-xs"></i>
              <span>Journey</span>
            </button>

            <button data-view="calendar" class="nav-view-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all ${
              this.currentView === 'calendar'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }">
              <i class="far fa-calendar-alt text-xs"></i>
              <span>Calendar</span>
            </button>

            <button data-view="kanban" class="nav-view-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all ${
              this.currentView === 'kanban'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }">
              <i class="fas fa-columns text-xs"></i>
              <span>Pipeline</span>
            </button>

            <button data-view="clash-radar" class="nav-view-btn relative px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all ${
              this.currentView === 'clash-radar'
                ? 'bg-white dark:bg-slate-800 text-rose-500 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }">
              <i class="fas fa-satellite-dish text-xs"></i>
              <span>Clash Radar</span>
              ${this.clashesCount > 0 ? `
                <span class="px-1.5 py-0.2 text-[10px] font-bold text-white bg-rose-600 rounded-full animate-pulse">
                  ${this.clashesCount}
                </span>
              ` : ''}
            </button>
          </nav>

          <!-- Right: Power Tools & Quick Actions -->
          <div class="flex items-center space-x-2">
            
            <!-- Live Clock -->
            <div id="navbar-live-clock" class="hidden xl:flex items-center space-x-1.5 text-xs font-mono px-2.5 py-1.5 rounded-lg bg-slate-100/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <span>--:--:--</span>
            </div>

            <!-- AI Smart Ingest (Glowing Gradient Pill) -->
            <button id="btn-smart-ingest" class="px-3 py-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all">
              <i class="fas fa-wand-magic-sparkles text-amber-300 text-xs"></i>
              <span class="hidden sm:inline">AI Smart Ingest</span>
            </button>

            <!-- Day-of HUD -->
            <button id="btn-survival-mode" title="Live Day-of-Event HUD & QR Admit Pass" class="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all">
              <i class="fas fa-bolt text-xs"></i>
              <span class="hidden lg:inline">Day HUD</span>
            </button>

            <!-- Campus Wayfinder Map -->
            <button id="btn-campus-map" title="Interactive Campus Blueprint Map" class="p-2 sm:px-2.5 sm:py-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 flex items-center space-x-1 transition-all">
              <i class="fas fa-map-location-dot text-emerald-500 text-xs"></i>
              <span class="hidden xl:inline">Campus Map</span>
            </button>

            <!-- Student Passport -->
            <button id="btn-passport" title="Student Event Passport & Brag Sheet" class="p-2 sm:px-2.5 sm:py-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 flex items-center space-x-1 transition-all">
              <i class="fas fa-id-card-clip text-purple-500 text-xs"></i>
              <span class="hidden xl:inline">Passport</span>
            </button>

            <!-- Add Event Button -->
            <button id="btn-new-event" title="Add Event" class="p-2 sm:px-2.5 sm:py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-xl text-xs font-bold flex items-center space-x-1 shadow-sm transition-all">
              <i class="fas fa-plus text-xs"></i>
              <span class="hidden md:inline">Add</span>
            </button>

            <!-- Command Palette Shortcut (⌘K) -->
            <button id="btn-cmd-k" title="Search Omnibar (Cmd+K)" class="hidden sm:flex items-center space-x-1 px-2 py-1.5 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
              <i class="fas fa-search text-[10px]"></i>
              <kbd class="font-mono text-[10px] bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-300 dark:border-slate-700">⌘K</kbd>
            </button>

            <!-- Sound Mute Toggle -->
            <button id="btn-sound-toggle" title="${this.soundMuted ? 'Unmute Audio' : 'Mute Audio'}" class="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <i class="fas ${this.soundMuted ? 'fa-volume-xmark text-slate-400' : 'fa-volume-high text-blue-500'} text-xs"></i>
            </button>

            <!-- Dark / Light Toggle -->
            <button id="btn-theme-toggle" title="Toggle Theme" class="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <i class="fas ${this.darkMode ? 'fa-sun text-amber-400' : 'fa-moon text-indigo-600'} text-xs"></i>
            </button>

          </div>

        </div>

        <!-- Mobile View Switcher Bar -->
        <div class="flex md:hidden items-center justify-around py-2 px-3 mt-2 glass-panel rounded-xl text-xs">
          <button data-view="timeline" class="nav-view-btn px-2.5 py-1 rounded-lg font-semibold ${
            this.currentView === 'timeline' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'
          }">
            <i class="fas fa-stream mr-1"></i> Timeline
          </button>
          <button data-view="calendar" class="nav-view-btn px-2.5 py-1 rounded-lg font-semibold ${
            this.currentView === 'calendar' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'
          }">
            <i class="far fa-calendar-alt mr-1"></i> Calendar
          </button>
          <button data-view="kanban" class="nav-view-btn px-2.5 py-1 rounded-lg font-semibold ${
            this.currentView === 'kanban' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'
          }">
            <i class="fas fa-columns mr-1"></i> Pipeline
          </button>
          <button data-view="clash-radar" class="nav-view-btn px-2.5 py-1 rounded-lg font-semibold relative ${
            this.currentView === 'clash-radar' ? 'bg-rose-600 text-white' : 'text-slate-600 dark:text-slate-400'
          }">
            <i class="fas fa-satellite-dish mr-1"></i> Radar
            ${this.clashesCount > 0 ? `<span class="ml-1 px-1 text-[9px] bg-rose-500 text-white rounded-full">${this.clashesCount}</span>` : ''}
          </button>
        </div>

      </header>
    `;

    this.attachEvents();
    this.startClock();
  }

  attachEvents() {
    const brand = document.getElementById('nav-brand-click');
    if (brand) {
      brand.onclick = () => {
        sound.playClick();
        this.onViewChange('timeline');
      };
    }

    document.querySelectorAll('.nav-view-btn').forEach(btn => {
      btn.onclick = () => {
        const view = btn.getAttribute('data-view');
        sound.playClick();
        this.onViewChange(view);
      };
    });

    const btnSmart = document.getElementById('btn-smart-ingest');
    if (btnSmart) btnSmart.onclick = () => { sound.playClick(); this.onOpenModal('smart-ingest'); };

    const btnSurvival = document.getElementById('btn-survival-mode');
    if (btnSurvival) btnSurvival.onclick = () => { sound.playClick(); this.onOpenModal('survival-mode'); };

    const btnMap = document.getElementById('btn-campus-map');
    if (btnMap) btnMap.onclick = () => { sound.playClick(); this.onOpenModal('campus-map'); };

    const btnPassport = document.getElementById('btn-passport');
    if (btnPassport) btnPassport.onclick = () => { sound.playClick(); this.onOpenModal('passport'); };

    const btnNew = document.getElementById('btn-new-event');
    if (btnNew) btnNew.onclick = () => { sound.playClick(); this.onOpenModal('new-event'); };

    const btnCmdK = document.getElementById('btn-cmd-k');
    if (btnCmdK) btnCmdK.onclick = () => { sound.playClick(); this.onOpenModal('command-palette'); };

    const btnSound = document.getElementById('btn-sound-toggle');
    if (btnSound) btnSound.onclick = () => this.onToggleSound();

    const btnTheme = document.getElementById('btn-theme-toggle');
    if (btnTheme) btnTheme.onclick = () => { sound.playClick(); this.onToggleTheme(); };
  }
}
