// ==========================================================================
// Modern, Ultra-Clean Navbar Component
// Minimalist, Balanced, and Fast: Direct View Switching, Search, and New Event
// ==========================================================================

export class Navbar {
  constructor({ currentView, onViewChange, onOpenModal, darkMode, onToggleTheme }) {
    this.currentView = currentView; // 'timeline' | 'calendar' | 'unstop'
    this.onViewChange = onViewChange;
    this.onOpenModal = onOpenModal;
    this.darkMode = darkMode;
    this.onToggleTheme = onToggleTheme;
  }

  update({ currentView, darkMode }) {
    if (currentView !== undefined) this.currentView = currentView;
    if (darkMode !== undefined) this.darkMode = darkMode;
    this.render();
  }

  render() {
    const container = document.getElementById('navbar-root');
    if (!container) return;

    container.innerHTML = `
      <header class="sticky top-0 z-40 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-3 pb-2 transition-all">
        <div class="glass-panel rounded-2xl shadow-sm px-4 py-3 flex items-center justify-between border border-slate-200 dark:border-white/10">
          
          <!-- LEFT: Brand Logo & Title -->
          <div class="flex items-center space-x-3 cursor-pointer group" id="nav-brand-click">
            <div class="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <i class="fas fa-compass text-sm"></i>
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <span class="font-display font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                  MyCampus
                </span>
                <span class="px-2 py-0.5 text-[10px] font-mono uppercase font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 rounded-full">
                  IIIT Delhi
                </span>
              </div>
            </div>
          </div>

          <!-- CENTER: Direct Segmented View Control -->
          <nav class="flex items-center bg-slate-100 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button data-view="timeline" class="nav-view-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              this.currentView === 'timeline'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }">
              <i class="fas fa-stream text-[11px]"></i>
              <span>Timeline</span>
            </button>

            <button data-view="calendar" class="nav-view-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              this.currentView === 'calendar'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }">
              <i class="far fa-calendar-alt text-[11px]"></i>
              <span>Calendar</span>
            </button>

            <button data-view="unstop" class="nav-view-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              this.currentView === 'unstop'
                ? 'bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }">
              <i class="fas fa-bolt text-[11px] text-orange-500"></i>
              <span>Unstop Hub</span>
            </button>
          </nav>

          <!-- RIGHT: Quick Search, Add Event & Theme Toggle -->
          <div class="flex items-center space-x-2">
            
            <!-- Search Omnibar (⌘K) -->
            <button id="btn-cmd-k" title="Search events (Cmd+K)" class="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
              <i class="fas fa-search text-[10px]"></i>
              <span>Search</span>
              <kbd class="font-mono text-[9px] bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-300 dark:border-slate-700 ml-1">⌘K</kbd>
            </button>

            <!-- + Add Event Button -->
            <button id="btn-add-event-direct" class="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-all">
              <i class="fas fa-plus text-[10px]"></i>
              <span>Add Event</span>
            </button>

            <!-- Theme Toggle Button -->
            <button id="btn-theme-toggle" title="Toggle Theme" class="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <i class="fas ${this.darkMode ? 'fa-sun text-amber-400' : 'fa-moon text-slate-600'} text-xs"></i>
            </button>

          </div>

        </div>
      </header>
    `;

    this.attachEvents();
  }

  attachEvents() {
    // Brand click returns to timeline
    const brand = document.getElementById('nav-brand-click');
    if (brand) {
      brand.onclick = () => this.onViewChange('timeline');
    }

    // View switcher buttons
    document.querySelectorAll('.nav-view-btn').forEach(btn => {
      btn.onclick = () => {
        const view = btn.getAttribute('data-view');
        this.onViewChange(view);
      };
    });

    // Search button
    const cmdKBtn = document.getElementById('btn-cmd-k');
    if (cmdKBtn) {
      cmdKBtn.onclick = () => this.onOpenModal('command-palette');
    }

    // Direct Add Event button
    const addBtn = document.getElementById('btn-add-event-direct');
    if (addBtn) {
      addBtn.onclick = () => this.onOpenModal('new-event');
    }

    // Theme toggle
    const themeBtn = document.getElementById('btn-theme-toggle');
    if (themeBtn) {
      themeBtn.onclick = () => this.onToggleTheme();
    }
  }
}
