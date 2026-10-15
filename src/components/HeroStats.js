// ==========================================================================
// Clean HeaderStats Component
// Clear Overview, Real Next Deadline, and Category Filter Pills
// 100% Bluff-free, fast, and intuitive
// ==========================================================================

export class HeroStats {
  constructor({ stats, currentCategory, onCategoryChange, onOpenModal, events }) {
    this.stats = stats;
    this.currentCategory = currentCategory;
    this.onCategoryChange = onCategoryChange;
    this.onOpenModal = onOpenModal;
    this.events = events;
  }

  update({ stats, currentCategory, events }) {
    if (stats !== undefined) this.stats = stats;
    if (currentCategory !== undefined) this.currentCategory = currentCategory;
    if (events !== undefined) this.events = events;
    this.render();
  }

  getNextMilestone() {
    const now = new Date();
    let nextMs = null;
    let nextEvt = null;
    let minDiff = Infinity;

    this.events.forEach(e => {
      (e.milestones || []).forEach(m => {
        if (!m.completed && m.deadline) {
          const d = new Date(m.deadline);
          const diff = d - now;
          if (diff > 0 && diff < minDiff) {
            minDiff = diff;
            nextMs = m;
            nextEvt = e;
          }
        }
      });
    });

    if (!nextMs) return null;

    const diffDays = Math.ceil(minDiff / (1000 * 60 * 60 * 24));
    return {
      title: nextMs.title,
      eventTitle: nextEvt.title,
      daysLeft: diffDays,
      deadlineStr: new Date(nextMs.deadline).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      })
    };
  }

  getMilestoneProgress() {
    let total = 0;
    let completed = 0;
    this.events.forEach(e => {
      (e.milestones || []).forEach(m => {
        total++;
        if (m.completed) completed++;
      });
    });
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percent };
  }

  render() {
    const container = document.getElementById('hero-stats-root');
    if (!container) return;

    const nextDeadline = this.getNextMilestone();
    const progress = this.getMilestoneProgress();

    const categories = [
      { id: 'All', label: 'All Events', icon: 'fa-globe' },
      { id: 'Hackathon', label: 'Hackathons', icon: 'fa-laptop-code' },
      { id: 'Competition', label: 'Competitions', icon: 'fa-trophy' },
      { id: 'Workshop', label: 'Workshops', icon: 'fa-chalkboard-user' },
      { id: 'Conference', label: 'Conferences', icon: 'fa-book-open' }
    ];

    container.innerHTML = `
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 space-y-4">
        
        <!-- Top Metrics Row -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          
          <!-- Card 1: Total Registered -->
          <div class="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div class="space-y-0.5">
              <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active Events
              </span>
              <div class="text-2xl font-display font-bold text-slate-900 dark:text-white">
                ${this.events.length} <span class="text-xs font-sans text-slate-400 font-normal">Registered</span>
              </div>
            </div>
            <div class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm">
              <i class="fas fa-calendar-check"></i>
            </div>
          </div>

          <!-- Card 2: Next Imminent Deadline -->
          <div class="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div class="space-y-0.5 max-w-[70%]">
              <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Next Deadline
              </span>
              ${nextDeadline ? `
                <div class="text-xs font-bold text-slate-900 dark:text-white truncate">
                  ${nextDeadline.title}
                </div>
                <div class="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                  ${nextDeadline.deadlineStr} • In ${nextDeadline.daysLeft} days
                </div>
              ` : `
                <div class="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  All rounds on schedule
                </div>
              `}
            </div>
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-sm">
              <i class="fas fa-clock"></i>
            </div>
          </div>

          <!-- Card 3: Milestone Progress -->
          <div class="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div class="space-y-0.5 w-full mr-3">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Rounds Completed
                </span>
                <span class="text-xs font-bold text-blue-600 dark:text-blue-400">
                  ${progress.percent}%
                </span>
              </div>
              <div class="text-xs font-medium text-slate-700 dark:text-slate-300">
                ${progress.completed} of ${progress.total} milestones checked
              </div>
              <div class="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1.5">
                <div class="h-full bg-blue-600 rounded-full transition-all duration-300" style="width: ${progress.percent}%"></div>
              </div>
            </div>
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm shrink-0">
              <i class="fas fa-list-check"></i>
            </div>
          </div>

        </div>

        <!-- Category Filter Pills Bar -->
        <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div class="flex flex-wrap items-center gap-1.5 bg-slate-100/80 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            ${categories.map(cat => `
              <button 
                data-category="${cat.id}"
                class="category-pill-btn px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                  this.currentCategory === cat.id
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }"
              >
                <i class="fas ${cat.icon} text-[10px]"></i>
                <span>${cat.label}</span>
              </button>
            `).join('')}
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex items-center space-x-2">
            <button 
              id="hero-btn-ranking" 
              class="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/25 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all"
            >
              <i class="fas fa-trophy text-[10px] text-amber-500"></i>
              <span>Campus Rank #4</span>
            </button>

            <button 
              id="hero-btn-unstop" 
              class="px-3 py-1.5 unstop-pill hover:opacity-90 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all"
            >
              <i class="fas fa-bolt text-[10px] text-orange-500"></i>
              <span>Browse Unstop</span>
            </button>

            <button 
              id="hero-btn-add" 
              class="px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all"
            >
              <i class="fas fa-plus text-[10px]"></i>
              <span>Add Event</span>
            </button>
          </div>
        </div>

      </section>
    `;

    this.attachEvents();
  }

  attachEvents() {
    document.querySelectorAll('.category-pill-btn').forEach(btn => {
      btn.onclick = () => {
        const cat = btn.getAttribute('data-category');
        this.onCategoryChange(cat);
      };
    });

    const rankingBtn = document.getElementById('hero-btn-ranking');
    if (rankingBtn) {
      rankingBtn.onclick = () => this.onOpenModal('profile');
    }

    const unstopBtn = document.getElementById('hero-btn-unstop');
    if (unstopBtn) {
      unstopBtn.onclick = () => this.onOpenModal('unstop-hub');
    }

    const addBtn = document.getElementById('hero-btn-add');
    if (addBtn) {
      addBtn.onclick = () => this.onOpenModal('new-event');
    }
  }
}
