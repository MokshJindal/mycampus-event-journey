// ==========================================================================
// Upgraded HeroStats Component
// Command Center Banner, Luxury Glass Stat Cards, and Interactive Filters
// ==========================================================================

import { sound } from '../utils/audio.js';
import { ICSExporter } from '../utils/icsExporter.js';
import { StorageManager } from '../utils/storage.js';

export class HeroStats {
  constructor({ stats, currentCategory, onCategoryChange, onOpenModal, onJumpToEvent, events }) {
    this.stats = stats;
    this.currentCategory = currentCategory;
    this.onCategoryChange = onCategoryChange;
    this.onOpenModal = onOpenModal;
    this.onJumpToEvent = onJumpToEvent;
    this.events = events;
    this.profile = StorageManager.getProfile();
    this.countdownTimer = null;
  }

  update({ stats, currentCategory, events }) {
    if (stats !== undefined) this.stats = stats;
    if (currentCategory !== undefined) this.currentCategory = currentCategory;
    if (events !== undefined) this.events = events;
    this.render();
  }

  startCountdown() {
    if (this.countdownTimer) clearInterval(this.countdownTimer);

    const updateTicker = () => {
      const el = document.getElementById('hero-countdown-ticker');
      if (!el) return;

      if (!this.stats.imminentList || this.stats.imminentList.length === 0) {
        el.innerHTML = `
          <div class="flex items-center space-x-1.5 text-xs text-emerald-500 font-semibold">
            <i class="fas fa-check-circle"></i>
            <span>All submissions on schedule</span>
          </div>
        `;
        return;
      }

      const next = this.stats.imminentList[0];
      const now = new Date();
      const diffMs = next.deadline - now;

      if (diffMs <= 0) {
        el.innerHTML = `
          <div class="flex items-center space-x-1.5 text-xs text-rose-500 font-bold animate-pulse">
            <i class="fas fa-triangle-exclamation"></i>
            <span>Submission due right now!</span>
          </div>
        `;
        return;
      }

      const totalSec = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSec / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;
      const pad = (n) => String(n).padStart(2, '0');

      el.innerHTML = `
        <div class="flex items-center space-x-1.5 font-mono text-xs font-bold text-amber-500">
          <span class="bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/30">${pad(hours)}h</span>
          <span class="text-amber-500/60">:</span>
          <span class="bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/30">${pad(minutes)}m</span>
          <span class="text-amber-500/60">:</span>
          <span class="bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/30">${pad(seconds)}s</span>
        </div>
      `;
    };

    updateTicker();
    this.countdownTimer = setInterval(updateTicker, 1000);
  }

  render() {
    const container = document.getElementById('hero-stats-root');
    if (!container) return;

    const nextImminent = this.stats.imminentList && this.stats.imminentList[0];
    const categories = [
      { id: 'All', label: 'All Journeys', icon: 'fa-globe' },
      { id: 'Hackathon', label: 'Hackathons', icon: 'fa-laptop-code' },
      { id: 'Workshop', label: 'Workshops', icon: 'fa-chalkboard-user' },
      { id: 'Conference', label: 'Conferences', icon: 'fa-book-open' },
      { id: 'Competition', label: 'Competitions', icon: 'fa-trophy' },
      { id: 'Cultural', label: 'Cultural', icon: 'fa-music' }
    ];

    container.innerHTML = `
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        
        <!-- Luxury Collegiate Command Banner -->
        <div class="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-950 border border-slate-800 shadow-2xl text-white">
          
          <!-- Ambient decorative light beams -->
          <div class="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <!-- Left: Student Identity & Headline -->
            <div class="space-y-3">
              <div class="flex flex-wrap items-center gap-2.5">
                <div class="flex items-center space-x-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span class="font-semibold text-slate-200">Autumn Season 2026 Active</span>
                </div>
                <span class="text-xs text-slate-400">•</span>
                <span class="text-xs font-mono text-amber-400 font-semibold">
                  ${this.profile.name} (${this.profile.rollNo})
                </span>
              </div>

              <h1 class="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-white leading-tight">
                One Intelligent Timeline for Every Event
              </h1>

              <p class="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Seamlessly unify registrations from Devpost, Unstop, Luma, and campus circulars with automated multi-phase milestone tracking, conflict alerts, and Day-of-Event survival tools.
              </p>
            </div>

            <!-- Right: Quick Sync Action Suite -->
            <div class="flex flex-wrap lg:flex-col items-stretch gap-2.5 flex-shrink-0">
              <button id="btn-export-ics" class="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/15 backdrop-blur-md flex items-center justify-center space-x-2 shadow-sm transition-all">
                <i class="far fa-calendar-plus text-blue-400"></i>
                <span>Export to Calendar (.ICS)</span>
              </button>

              <button id="btn-discover-feed" class="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md shadow-amber-500/20 transition-all">
                <i class="fas fa-compass"></i>
                <span>Explore Campus Feed</span>
              </button>
            </div>

          </div>

        </div>

        <!-- 4 Glass Stat Cards (Linear / Vercel Aesthetics) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          
          <!-- Card 1: Active Journeys -->
          <div class="glass-card p-5 rounded-2xl relative overflow-hidden group">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active Journeys
              </span>
              <div class="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-sm">
                <i class="fas fa-route"></i>
              </div>
            </div>
            <div class="mt-3 flex items-baseline space-x-2">
              <span class="text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
                ${this.stats.activeEvents}
              </span>
              <span class="text-xs text-slate-400">
                of ${this.stats.totalEvents} registered
              </span>
            </div>
            <div class="mt-3 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>${this.stats.completedEvents} completed</span>
              <span class="font-bold text-amber-500">${this.stats.wonEvents} podiums</span>
            </div>
          </div>

          <!-- Card 2: Urgency Radar Countdown -->
          <div class="glass-card p-5 rounded-2xl relative overflow-hidden ${nextImminent ? 'border-amber-500/40' : ''}">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold text-amber-500 uppercase tracking-wider flex items-center space-x-1.5">
                <i class="fas fa-bolt"></i>
                <span>Urgent Target (&lt;48h)</span>
              </span>
              <div class="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-sm">
                <i class="fas fa-stopwatch"></i>
              </div>
            </div>
            <div class="mt-3" id="hero-countdown-ticker">
              <!-- Live countdown injected here -->
            </div>
            <div class="mt-2 text-xs truncate font-semibold text-slate-800 dark:text-slate-200" title="${nextImminent ? nextImminent.milestoneTitle : ''}">
              ${nextImminent ? `<span class="text-blue-500">${nextImminent.eventTitle}:</span> ${nextImminent.milestoneTitle}` : 'All checkpoints completed'}
            </div>
          </div>

          <!-- Card 3: Clash Radar -->
          <div class="glass-card p-5 rounded-2xl relative overflow-hidden cursor-pointer ${this.stats.clashesCount > 0 ? 'border-rose-500/40 hover:border-rose-500' : ''}" id="card-clash-trigger">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold ${this.stats.clashesCount > 0 ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400'} uppercase tracking-wider">
                Schedule Clashes
              </span>
              <div class="w-9 h-9 rounded-xl ${this.stats.clashesCount > 0 ? 'bg-rose-500/10 text-rose-500 beacon-pulse' : 'bg-emerald-500/10 text-emerald-500'} flex items-center justify-center text-sm">
                <i class="fas fa-satellite-dish"></i>
              </div>
            </div>
            <div class="mt-3 flex items-baseline space-x-2">
              <span class="text-3xl font-extrabold font-serif ${this.stats.clashesCount > 0 ? 'text-rose-500' : 'text-slate-900 dark:text-white'}">
                ${this.stats.clashesCount}
              </span>
              <span class="text-xs text-slate-400">
                ${this.stats.clashesCount === 1 ? 'overlap detected' : 'overlaps detected'}
              </span>
            </div>
            <div class="mt-3 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center text-xs font-semibold ${
              this.stats.clashesCount > 0 ? 'text-rose-500' : 'text-emerald-500'
            }">
              ${this.stats.clashesCount > 0 ? '<i class="fas fa-triangle-exclamation mr-1.5"></i> Resolve in Clash Radar →' : '<i class="fas fa-shield-halved mr-1.5"></i> Optimal buffers'}
            </div>
          </div>

          <!-- Card 4: Student XP & Level -->
          <div class="glass-card p-5 rounded-2xl relative overflow-hidden cursor-pointer" id="card-passport-trigger">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold text-purple-500 uppercase tracking-wider">
                Event XP & Honors
              </span>
              <div class="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center text-sm">
                <i class="fas fa-medal"></i>
              </div>
            </div>
            <div class="mt-3 flex items-baseline space-x-2">
              <span class="text-3xl font-extrabold font-serif text-purple-600 dark:text-purple-400">
                ${this.stats.earnedXP} XP
              </span>
              <span class="text-xs text-slate-400">
                / ${this.stats.totalXP} max
              </span>
            </div>
            <div class="mt-3 w-full bg-slate-200 dark:bg-slate-700/60 h-1.5 rounded-full overflow-hidden">
              <div class="bg-gradient-to-r from-purple-500 to-indigo-500 h-1.5 rounded-full" style="width: ${Math.min(100, Math.round((this.stats.earnedXP / Math.max(1, this.stats.totalXP)) * 100))}%"></div>
            </div>
          </div>

        </div>

        <!-- Filter Chips Nav -->
        <div class="mt-5 flex flex-wrap items-center justify-between gap-3 pt-2">
          <div class="flex flex-wrap items-center gap-1.5">
            ${categories.map(cat => `
              <button data-cat="${cat.id}" class="hero-cat-pill px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                this.currentCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }">
                <i class="fas ${cat.icon} text-[11px]"></i>
                <span>${cat.label}</span>
              </button>
            `).join('')}
          </div>

          <div class="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-2">
            <span>Displaying <strong class="text-slate-900 dark:text-white font-mono">${this.events.length}</strong> journeys</span>
          </div>
        </div>

      </section>
    `;

    this.attachEvents();
    this.startCountdown();
  }

  attachEvents() {
    document.querySelectorAll('.hero-cat-pill').forEach(btn => {
      btn.onclick = () => {
        const cat = btn.getAttribute('data-cat');
        sound.playClick();
        this.onCategoryChange(cat);
      };
    });

    const clashCard = document.getElementById('card-clash-trigger');
    if (clashCard) {
      clashCard.onclick = () => {
        sound.playClick();
        this.onOpenModal('switch-view-clash-radar');
      };
    }

    const passCard = document.getElementById('card-passport-trigger');
    if (passCard) {
      passCard.onclick = () => {
        sound.playClick();
        this.onOpenModal('passport');
      };
    }

    const btnIcs = document.getElementById('btn-export-ics');
    if (btnIcs) {
      btnIcs.onclick = () => {
        sound.playClick();
        ICSExporter.downloadICS(this.events);
      };
    }

    const btnDiscover = document.getElementById('btn-discover-feed');
    if (btnDiscover) {
      btnDiscover.onclick = () => {
        sound.playClick();
        this.onOpenModal('discover');
      };
    }
  }
}
