// ==========================================================================
// KanbanView Component
// Pipeline Stage Columns: Registered -> In Prep -> Finalist -> Completed -> Won
// ==========================================================================

import { sound } from '../utils/audio.js';

export class KanbanView {
  constructor({ events, onUpdateStage, onOpenSurvivalMode, onEditEvent }) {
    this.events = events;
    this.onUpdateStage = onUpdateStage;
    this.onOpenSurvivalMode = onOpenSurvivalMode;
    this.onEditEvent = onEditEvent;
  }

  update({ events }) {
    if (events !== undefined) this.events = events;
    this.render();
  }

  triggerConfetti() {
    // Lightweight canvas confetti particle generator
    const count = 60;
    const colors = ['#3b82f6', '#d97706', '#10b981', '#8b5cf6', '#ec4899'];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'fixed pointer-events-none z-50 rounded-full';
      el.style.width = `${Math.random() * 8 + 4}px`;
      el.style.height = `${Math.random() * 8 + 4}px`;
      el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      el.style.left = `${Math.random() * 100}vw`;
      el.style.top = '-10px';
      el.style.opacity = '1';
      el.style.transition = `all ${Math.random() * 1.5 + 1.2}s cubic-bezier(0.25, 1, 0.5, 1)`;
      document.body.appendChild(el);

      requestAnimationFrame(() => {
        el.style.transform = `translateY(${window.innerHeight + 50}px) rotate(${Math.random() * 720}deg)`;
        el.style.opacity = '0';
      });

      setTimeout(() => el.remove(), 2500);
    }
  }

  render() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const columns = [
      { key: 'registered', title: 'Registered', color: 'border-slate-400', icon: 'fa-ticket' },
      { key: 'in-prep', title: 'In Prep & Submissions', color: 'border-blue-500', icon: 'fa-hammer' },
      { key: 'finalist', title: 'Finalist / Shortlisted', color: 'border-purple-500', icon: 'fa-star' },
      { key: 'completed', title: 'Completed', color: 'border-emerald-500', icon: 'fa-circle-check' },
      { key: 'won', title: 'Podium / Won 🏆', color: 'border-amber-500', icon: 'fa-trophy' }
    ];

    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
        
        <div class="flex items-center justify-between">
          <div>
            <h2 class="font-serif-classic font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
              Event Lifecycle Pipeline
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Track event readiness from registration to podium finish. Use arrows to advance stages.
            </p>
          </div>
        </div>

        <!-- 5 Columns Kanban Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          ${columns.map(col => {
            const colEvents = this.events.filter(e => (e.stage || 'registered') === col.key);

            return `
              <div class="glass-card rounded-3xl p-3.5 flex flex-col min-h-[520px]">
                
                <!-- Column Header -->
                <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-white/5 ${col.color} border-t-2 pt-2 px-1">
                  <div class="flex items-center space-x-2 font-bold text-xs text-slate-900 dark:text-white">
                    <i class="fas ${col.icon} text-slate-400"></i>
                    <span>${col.title}</span>
                  </div>
                  <span class="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold flex items-center justify-center shadow-2xs">
                    ${colEvents.length}
                  </span>
                </div>

                <!-- Column Items -->
                <div class="space-y-3 flex-1 overflow-y-auto">
                  ${colEvents.map(evt => this.renderKanbanCard(evt, col.key)).join('')}
                  ${colEvents.length === 0 ? `
                    <div class="h-28 flex items-center justify-center text-[11px] text-slate-400 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
                      No events here
                    </div>
                  ` : ''}
                </div>

              </div>
            `;
          }).join('')}
        </div>

      </div>
    `;

    this.attachEvents();
  }

  renderKanbanCard(evt, currentStage) {
    const stages = ['registered', 'in-prep', 'finalist', 'completed', 'won'];
    const currentIndex = stages.indexOf(currentStage);
    const prevStage = currentIndex > 0 ? stages[currentIndex - 1] : null;
    const nextStage = currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null;

    const milestones = evt.milestones || [];
    const completedMs = milestones.filter(m => m.completed).length;

    return `
      <div class="bg-white dark:bg-slate-800/90 rounded-2xl p-3.5 border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md transition-all space-y-2.5">
        
        <div class="flex items-start justify-between gap-1">
          <span class="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md text-white shadow-3xs" style="background-color: ${evt.color || '#3b82f6'};">
            ${evt.category}
          </span>
          <span class="text-[10px] text-slate-400 font-mono font-medium">
            ${evt.platform || 'Campus'}
          </span>
        </div>

        <h4 class="font-serif font-bold text-sm text-slate-900 dark:text-white leading-tight">
          ${evt.title}
        </h4>

        <div class="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between font-medium">
          <span>${evt.teamName || 'Solo'}</span>
          <span class="font-mono text-purple-600 dark:text-purple-400 font-bold">+${evt.xpReward || 100} XP</span>
        </div>

        <!-- Milestones mini progress -->
        <div class="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-white/5">
          <span>Milestones: ${completedMs}/${milestones.length}</span>
          <span class="font-bold ${completedMs === milestones.length ? 'text-emerald-500' : 'text-blue-500'}">
            ${milestones.length > 0 ? Math.round((completedMs / milestones.length) * 100) : 0}%
          </span>
        </div>

        <!-- Action advancement controls -->
        <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5">
          <div class="flex items-center space-x-1">
            ${prevStage ? `
              <button data-action="stage-prev" data-id="${evt.id}" data-target="${prevStage}" title="Move back to ${prevStage}" class="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white text-[10px] hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md">
                <i class="fas fa-arrow-left"></i>
              </button>
            ` : '<span class="w-4"></span>'}

            ${nextStage ? `
              <button data-action="stage-next" data-id="${evt.id}" data-target="${nextStage}" title="Advance to ${nextStage}" class="px-2 py-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 font-bold text-[10px] rounded-md flex items-center space-x-1 transition-colors">
                <span>Advance</span>
                <i class="fas fa-arrow-right"></i>
              </button>
            ` : '<span class="text-[10px] text-amber-500 font-bold">🏆 Victory</span>'}
          </div>

          <button data-action="pass-quick" data-id="${evt.id}" title="Day HUD pass" class="text-slate-400 hover:text-amber-500 text-xs p-1">
            <i class="fas fa-qrcode"></i>
          </button>
        </div>

      </div>
    `;
  }

  attachEvents() {
    document.querySelectorAll('[data-action="stage-prev"], [data-action="stage-next"]').forEach(btn => {
      btn.onclick = (e) => {
        const id = btn.getAttribute('data-id');
        const target = btn.getAttribute('data-target');
        if (target === 'won') {
          sound.playFanfare();
          this.triggerConfetti();
        } else {
          sound.playSuccess();
        }
        this.onUpdateStage(id, target);
      };
    });

    document.querySelectorAll('[data-action="pass-quick"]').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-id');
        sound.playClick();
        this.onOpenSurvivalMode(id);
      };
    });
  }
}
