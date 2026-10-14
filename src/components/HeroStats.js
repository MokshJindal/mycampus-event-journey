// ==========================================================================
// Upgraded HeroStats Component
// Modern Command Center Banner, Side-Positioned AI Circular Ingest Panel,
// Clean Stat Cards, and Interactive Category Filters
// ==========================================================================

import { sound } from '../utils/audio.js';
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
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-2">
        
        <!-- Modern Command Banner with Side AI Ingest Panel -->
        <div class="relative overflow-hidden rounded-2xl p-6 sm:p-7 bg-slate-900 border border-slate-800 shadow-md text-white">
          
          <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <!-- Left Side: Student Identity & Headline (7 Cols) -->
            <div class="lg:col-span-7 space-y-3">
              <div class="flex flex-wrap items-center gap-2">
                <div class="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-medium">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                  <span>Autumn 2026 Season</span>
                </div>
                <span class="text-xs text-slate-500">•</span>
                <span class="text-xs font-mono text-slate-300 font-semibold">
                  ${this.profile.name} <span class="text-slate-500">(${this.profile.rollNo})</span>
                </span>
              </div>

              <h1 class="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white leading-tight">
                One Clean Timeline for Every Event
              </h1>

              <p class="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Bring scattered hackathon registrations, Unstop competition rounds, workshop checkpoints, and campus venues into a single synchronized schedule.
              </p>
            </div>

            <!-- Right Side: Dedicated AI Smart Ingest Card (5 Cols) -->
            <div class="lg:col-span-5 bg-slate-800/80 rounded-xl p-4 border border-slate-700/80 shadow-inner flex flex-col justify-between space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs">
                    <i class="fas fa-wand-magic-sparkles"></i>
                  </span>
                  <span class="font-display font-bold text-xs sm:text-sm text-white">Smart Ingest Engine</span>
                </div>
                <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Side Assistant</span>
              </div>

              <p class="text-[11px] text-slate-300 leading-snug">
                Paste any unstructured email, WhatsApp club circular, or Unstop notice to auto-build milestones and venue tags.
              </p>

              <div class="flex items-center space-x-2 pt-1">
                <button 
                  id="hero-side-ingest-btn" 
                  class="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                >
                  <i class="fas fa-paste text-xs"></i>
                  <span>Paste & Auto-Import</span>
                </button>

                <button 
                  id="hero-side-unstop-btn"
                  title="Open Unstop Plugin" 
                  class="py-2 px-3 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all"
                >
                  <i class="fas fa-bolt text-xs"></i>
                  <span>Unstop</span>
                </button>
              </div>

              <!-- Quick Presets -->
              <div class="flex items-center space-x-1.5 pt-1 text-[10px] text-slate-400 overflow-x-auto">
                <span class="text-slate-500 shrink-0">Presets:</span>
                <button data-preset="devpost" class="hero-preset-btn px-2 py-0.5 rounded bg-slate-700/60 hover:bg-slate-700 text-slate-300">Devpost</button>
                <button data-preset="unstop" class="hero-preset-btn px-2 py-0.5 rounded bg-slate-700/60 hover:bg-slate-700 text-slate-300">Unstop</button>
                <button data-preset="luma" class="hero-preset-btn px-2 py-0.5 rounded bg-slate-700/60 hover:bg-slate-700 text-slate-300">Luma</button>
                <button data-preset="whatsapp" class="hero-preset-btn px-2 py-0.5 rounded bg-slate-700/60 hover:bg-slate-700 text-slate-300">WhatsApp</button>
              </div>
            </div>

          </div>

        </div>

        <!-- 4 Clean Stat Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
          
          <!-- Card 1: Active Journeys -->
          <div class="glass-card p-4 rounded-xl relative overflow-hidden group">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active Journeys
              </span>
              <div class="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center text-xs">
                <i class="fas fa-route"></i>
              </div>
            </div>
            <div class="mt-2.5 flex items-baseline space-x-2">
              <span class="text-2xl font-display font-bold text-slate-900 dark:text-white">
                ${this.stats.activeEvents}
              </span>
              <span class="text-xs text-slate-400">
                of ${this.stats.totalEvents} registered
              </span>
            </div>
            <div class="mt-2.5 pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>${this.stats.completedEvents} completed</span>
              <span class="font-bold text-amber-500">${this.stats.wonEvents} podiums</span>
            </div>
          </div>

          <!-- Card 2: Urgency Radar Countdown -->
          <div class="glass-card p-4 rounded-xl relative overflow-hidden ${nextImminent ? 'border-amber-500/40' : ''}">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold text-amber-500 uppercase tracking-wider flex items-center space-x-1.5">
                <i class="fas fa-bolt"></i>
                <span>Urgent Target (&lt;48h)</span>
              </span>
              <div class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center text-xs">
                <i class="fas fa-stopwatch"></i>
              </div>
            </div>
            <div class="mt-2" id="hero-countdown-ticker">
              <!-- Live countdown injected here -->
            </div>
            <div class="mt-1.5 text-xs truncate font-semibold text-slate-800 dark:text-slate-200" title="${nextImminent ? nextImminent.milestoneTitle : ''}">
              ${nextImminent ? `<span class="text-blue-500">${nextImminent.eventTitle}:</span> ${nextImminent.milestoneTitle}` : 'All checkpoints completed'}
            </div>
          </div>

          <!-- Card 3: Clash Radar -->
          <div class="glass-card p-4 rounded-xl relative overflow-hidden cursor-pointer ${this.stats.clashesCount > 0 ? 'border-rose-500/40 hover:border-rose-500' : ''}" id="card-clash-trigger">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold ${this.stats.clashesCount > 0 ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400'} uppercase tracking-wider">
                Schedule Clashes
              </span>
              <div class="w-8 h-8 rounded-lg ${this.stats.clashesCount > 0 ? 'bg-rose-500/10 text-rose-500 beacon-pulse' : 'bg-emerald-500/10 text-emerald-500'} flex items-center justify-center text-xs">
                <i class="fas fa-satellite-dish"></i>
              </div>
            </div>
            <div class="mt-2.5 flex items-baseline space-x-2">
              <span class="text-2xl font-display font-bold ${this.stats.clashesCount > 0 ? 'text-rose-500' : 'text-slate-900 dark:text-white'}">
                ${this.stats.clashesCount}
              </span>
              <span class="text-xs text-slate-400">
                ${this.stats.clashesCount === 1 ? 'overlap detected' : 'overlaps detected'}
              </span>
            </div>
            <div class="mt-2.5 pt-2 border-t border-slate-100 dark:border-white/5 flex items-center text-xs font-semibold ${
              this.stats.clashesCount > 0 ? 'text-rose-500' : 'text-emerald-500'
            }">
              ${this.stats.clashesCount > 0 ? '<i class="fas fa-triangle-exclamation mr-1.5"></i> Resolve in Clash Radar →' : '<i class="fas fa-shield-halved mr-1.5"></i> Optimal transit buffers'}
            </div>
          </div>

          <!-- Card 4: Student XP & Level -->
          <div class="glass-card p-4 rounded-xl relative overflow-hidden cursor-pointer" id="card-passport-trigger">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">
                Event XP & Honors
              </span>
              <div class="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-xs">
                <i class="fas fa-medal"></i>
              </div>
            </div>
            <div class="mt-2.5 flex items-baseline space-x-2">
              <span class="text-2xl font-display font-bold text-indigo-600 dark:text-indigo-400">
                ${this.stats.earnedXP} XP
              </span>
              <span class="text-xs text-slate-400">
                / ${this.stats.totalXP} max
              </span>
            </div>
            <div class="mt-2.5 w-full bg-slate-200 dark:bg-slate-700/60 h-1.5 rounded-full overflow-hidden">
              <div class="bg-indigo-600 dark:bg-indigo-500 h-1.5 rounded-full" style="width: ${Math.min(100, Math.round((this.stats.earnedXP / Math.max(1, this.stats.totalXP)) * 100))}%"></div>
            </div>
          </div>

        </div>

        <!-- Filter Chips Nav -->
        <div class="mt-4 flex flex-wrap items-center justify-between gap-3 pt-1">
          <div class="flex flex-wrap items-center gap-1.5">
            ${categories.map(cat => `
              <button data-cat="${cat.id}" class="hero-cat-pill px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                this.currentCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }">
                <i class="fas ${cat.icon} text-[10px]"></i>
                <span>${cat.label}</span>
              </button>
            `).join('')}
          </div>

          <div class="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-2">
            <span>Tracking <strong class="text-slate-900 dark:text-white font-mono">${this.events.length}</strong> event journeys</span>
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

    const btnSideIngest = document.getElementById('hero-side-ingest-btn');
    if (btnSideIngest) {
      btnSideIngest.onclick = () => {
        sound.playClick();
        this.onOpenModal('smart-ingest');
      };
    }

    const btnSideUnstop = document.getElementById('hero-side-unstop-btn');
    if (btnSideUnstop) {
      btnSideUnstop.onclick = () => {
        sound.playClick();
        this.onOpenModal('unstop-plugin');
      };
    }

    document.querySelectorAll('.hero-preset-btn').forEach(btn => {
      btn.onclick = () => {
        sound.playClick();
        const preset = btn.getAttribute('data-preset');
        this.onOpenModal('smart-ingest', preset);
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
  }
}
