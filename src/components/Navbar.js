// ==========================================================================
// Upgraded Symmetrical Navbar Component
// Minimalist, Balanced Layout with Central Segmented Control
// and Consolidated Actions Dropdown Menu (3-dots toggle)
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
    this.isMenuOpen = false;
    this.clockInterval = null;
    this.outsideClickHandler = null;
  }

  update({ currentView, clashesCount, soundMuted, darkMode }) {
    if (currentView !== undefined) this.currentView = currentView;
    if (clashesCount !== undefined) this.clashesCount = clashesCount;
    if (soundMuted !== undefined) this.soundMuted = soundMuted;
    if (darkMode !== undefined) this.darkMode = darkMode;
    this.render();
  }

  toggleActionsMenu(e) {
    if (e) e.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
    const menu = document.getElementById('navbar-actions-dropdown');
    if (menu) {
      if (this.isMenuOpen) {
        menu.classList.remove('hidden');
        menu.classList.add('dropdown-menu-enter');
      } else {
        menu.classList.add('hidden');
      }
    }
  }

  closeActionsMenu() {
    this.isMenuOpen = false;
    const menu = document.getElementById('navbar-actions-dropdown');
    if (menu) {
      menu.classList.add('hidden');
    }
  }

  startClock() {
    if (this.clockInterval) clearInterval(this.clockInterval);
    const updateTime = () => {
      const el = document.getElementById('navbar-live-clock');
      if (el) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        el.innerHTML = `
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>${timeStr}</span>
          <span class="text-[9px] text-slate-400 font-sans hidden 2xl:inline">IST</span>
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
        <div class="glass-panel rounded-2xl shadow-sm px-4 py-2.5 flex items-center justify-between border border-slate-200 dark:border-white/10">
          
          <!-- LEFT: Brand Logo & Title (Symmetric 1/3) -->
          <div class="flex items-center space-x-3 cursor-pointer group flex-1 justify-start" id="nav-brand-click">
            <div class="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <i class="fas fa-layer-group text-sm"></i>
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <span class="font-display font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                  MyCampus
                </span>
                <span class="px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 rounded">
                  HACKSHIFT
                </span>
              </div>
              <div class="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                IIIT Delhi Event Command
              </div>
            </div>
          </div>

          <!-- CENTER: Segmented Control View Switcher (Symmetric 1/3) -->
          <nav class="hidden md:flex items-center bg-slate-100/90 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner">
            <button data-view="timeline" class="nav-view-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              this.currentView === 'timeline'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }">
              <i class="fas fa-stream text-[11px]"></i>
              <span>Journey</span>
            </button>

            <button data-view="calendar" class="nav-view-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              this.currentView === 'calendar'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }">
              <i class="far fa-calendar-alt text-[11px]"></i>
              <span>Calendar</span>
            </button>

            <button data-view="kanban" class="nav-view-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              this.currentView === 'kanban'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }">
              <i class="fas fa-columns text-[11px]"></i>
              <span>Pipeline</span>
            </button>

            <button data-view="clash-radar" class="nav-view-btn relative px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              this.currentView === 'clash-radar'
                ? 'bg-white dark:bg-slate-800 text-rose-500 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }">
              <i class="fas fa-satellite-dish text-[11px]"></i>
              <span>Clash Radar</span>
              ${this.clashesCount > 0 ? `
                <span class="px-1.5 py-0.2 text-[9px] font-bold text-white bg-rose-600 rounded-full animate-pulse">
                  ${this.clashesCount}
                </span>
              ` : ''}
            </button>
          </nav>

          <!-- RIGHT: Minimal Actions Suite (Symmetric 1/3) -->
          <div class="flex items-center space-x-2 flex-1 justify-end relative">
            
            <!-- Live Clock (Desktop) -->
            <div id="navbar-live-clock" class="hidden xl:flex items-center space-x-1.5 text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-100/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80">
              <span>--:--:--</span>
            </div>

            <!-- UNSTOP Plugin Quick Launch Pill -->
            <button id="btn-unstop-quick" title="Unstop Competition Plugin" class="px-2.5 py-1.5 unstop-pill hover:opacity-90 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-2xs transition-all">
              <i class="fas fa-bolt text-xs text-orange-500"></i>
              <span class="font-display">Unstop</span>
            </button>

            <!-- Command Palette Shortcut (⌘K) -->
            <button id="btn-cmd-k" title="Search (Cmd+K)" class="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
              <i class="fas fa-search text-[10px]"></i>
              <kbd class="font-mono text-[10px] bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-300 dark:border-slate-700">⌘K</kbd>
            </button>

            <!-- Actions Dropdown Toggle Button (3 Dots / Consolidated Menu) -->
            <div class="relative">
              <button 
                id="btn-actions-toggle" 
                title="Open Actions & Tools"
                class="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-all"
              >
                <i class="fas fa-ellipsis text-xs"></i>
                <span class="hidden sm:inline">Actions</span>
                <i class="fas fa-chevron-down text-[9px] opacity-70"></i>
              </button>

              <!-- Consolidated Actions Dropdown Menu -->
              <div 
                id="navbar-actions-dropdown" 
                class="hidden absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 p-2 z-50 transition-all text-xs"
              >
                <!-- Group 1: Core Action Creation -->
                <div class="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Quick Actions
                </div>

                <button id="menu-btn-add-event" class="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold flex items-center justify-between transition-colors">
                  <div class="flex items-center space-x-2.5">
                    <span class="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs">
                      <i class="fas fa-plus"></i>
                    </span>
                    <span>Add New Event</span>
                  </div>
                  <kbd class="font-mono text-[10px] text-slate-400">N</kbd>
                </button>

                <button id="menu-btn-unstop" class="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold flex items-center justify-between transition-colors">
                  <div class="flex items-center space-x-2.5">
                    <span class="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center text-xs">
                      <i class="fas fa-bolt"></i>
                    </span>
                    <span>Unstop Competition Hub</span>
                  </div>
                  <span class="px-1.5 py-0.2 text-[9px] font-bold bg-orange-500/10 text-orange-500 rounded">Plugin</span>
                </button>

                <button id="menu-btn-smart-ingest" class="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold flex items-center justify-between transition-colors">
                  <div class="flex items-center space-x-2.5">
                    <span class="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs">
                      <i class="fas fa-wand-magic-sparkles"></i>
                    </span>
                    <span>AI Circular Ingest</span>
                  </div>
                  <span class="px-1.5 py-0.2 text-[9px] font-bold bg-purple-500/10 text-purple-400 rounded">NLP</span>
                </button>

                <div class="my-1.5 border-t border-slate-100 dark:border-slate-800"></div>

                <!-- Group 2: Student Tools -->
                <div class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Student Tools
                </div>

                <button id="menu-btn-campus-map" class="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold flex items-center space-x-2.5 transition-colors">
                  <span class="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs">
                    <i class="fas fa-map-location-dot"></i>
                  </span>
                  <span>Campus Wayfinder & Map</span>
                </button>

                <button id="menu-btn-passport" class="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold flex items-center space-x-2.5 transition-colors">
                  <span class="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs">
                    <i class="fas fa-id-card-clip"></i>
                  </span>
                  <span>Event Passport & Brag Sheet</span>
                </button>

                <button id="menu-btn-survival" class="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold flex items-center space-x-2.5 transition-colors">
                  <span class="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs">
                    <i class="fas fa-shield-halved"></i>
                  </span>
                  <span>Survival Mode (Day-of HUD)</span>
                </button>

                <button id="menu-btn-discover" class="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold flex items-center space-x-2.5 transition-colors">
                  <span class="w-6 h-6 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xs">
                    <i class="fas fa-compass"></i>
                  </span>
                  <span>Discover Opportunities</span>
                </button>

                <button id="menu-btn-export-ics" class="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold flex items-center space-x-2.5 transition-colors">
                  <span class="w-6 h-6 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center text-xs">
                    <i class="far fa-calendar-plus"></i>
                  </span>
                  <span>Export to Calendar (.ICS)</span>
                </button>

                <div class="my-1.5 border-t border-slate-100 dark:border-slate-800"></div>

                <!-- Group 3: Preferences -->
                <div class="flex items-center justify-between px-2 pt-1 pb-1">
                  <button id="menu-btn-theme" class="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium flex items-center space-x-1.5 transition-colors">
                    <i class="fas ${this.darkMode ? 'fa-sun text-amber-400' : 'fa-moon text-indigo-600'} text-xs"></i>
                    <span>${this.darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>

                  <button id="menu-btn-sound" class="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium flex items-center space-x-1.5 transition-colors">
                    <i class="fas ${this.soundMuted ? 'fa-volume-xmark text-slate-400' : 'fa-volume-high text-blue-500'} text-xs"></i>
                    <span>${this.soundMuted ? 'Muted' : 'Sound On'}</span>
                  </button>
                </div>

              </div>
            </div>

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

    const btnUnstop = document.getElementById('btn-unstop-quick');
    if (btnUnstop) {
      btnUnstop.onclick = () => {
        sound.playClick();
        this.onOpenModal('unstop-plugin');
      };
    }

    const btnCmdK = document.getElementById('btn-cmd-k');
    if (btnCmdK) {
      btnCmdK.onclick = () => {
        sound.playClick();
        this.onOpenModal('command-palette');
      };
    }

    // Actions Menu Toggle Button
    const btnActions = document.getElementById('btn-actions-toggle');
    if (btnActions) {
      btnActions.onclick = (e) => this.toggleActionsMenu(e);
    }

    // Menu Actions
    const bindMenu = (id, action) => {
      const el = document.getElementById(id);
      if (el) {
        el.onclick = () => {
          sound.playClick();
          this.closeActionsMenu();
          action();
        };
      }
    };

    bindMenu('menu-btn-add-event', () => this.onOpenModal('new-event'));
    bindMenu('menu-btn-unstop', () => this.onOpenModal('unstop-plugin'));
    bindMenu('menu-btn-smart-ingest', () => this.onOpenModal('smart-ingest'));
    bindMenu('menu-btn-campus-map', () => this.onOpenModal('campus-map'));
    bindMenu('menu-btn-passport', () => this.onOpenModal('passport'));
    bindMenu('menu-btn-survival', () => this.onOpenModal('survival-mode'));
    bindMenu('menu-btn-discover', () => this.onOpenModal('discover'));
    bindMenu('menu-btn-export-ics', () => this.onOpenModal('export-ics'));
    bindMenu('menu-btn-theme', () => this.onToggleTheme());
    bindMenu('menu-btn-sound', () => this.onToggleSound());

    // Dismiss dropdown when clicking outside
    if (this.outsideClickHandler) {
      document.removeEventListener('click', this.outsideClickHandler);
    }
    this.outsideClickHandler = (e) => {
      const dropdown = document.getElementById('navbar-actions-dropdown');
      const toggle = document.getElementById('btn-actions-toggle');
      if (this.isMenuOpen && dropdown && toggle && !dropdown.contains(e.target) && !toggle.contains(e.target)) {
        this.closeActionsMenu();
      }
    };
    document.addEventListener('click', this.outsideClickHandler);
  }
}
