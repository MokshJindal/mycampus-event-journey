// ==========================================================================
// Upgraded PassportModal Component
// Student Event Passport, Skills Radar, Verified Badges,
// and 1-Click Printable Resume Brag Sheet Export
// Fixed Desktop Viewport Clipping & Foolproof Closing Handlers (Esc / Click / Button)
// ==========================================================================

import { sound } from '../utils/audio.js';
import { StorageManager } from '../utils/storage.js';

export class PassportModal {
  constructor({ events, profile, onClose }) {
    this.events = events;
    this.profile = profile || StorageManager.getProfile();
    this.onClose = onClose || (() => {});
    this.viewMode = 'passport'; // 'passport' | 'resume'
    this.escHandler = (e) => {
      if (e.key === 'Escape') this.close();
    };
  }

  render() {
    let modal = document.getElementById('passport-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'passport-modal';
      // Use items-start so content never clips off the top in desktop
      modal.className = 'fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-8 modal-overlay overflow-y-auto';
      document.body.appendChild(modal);
    }

    const wonEvents = this.events.filter(e => e.stage === 'won');
    const completedEvents = this.events.filter(e => e.stage === 'completed' || e.stage === 'won');
    const totalXP = this.events.reduce((acc, e) => acc + (e.stage === 'won' || e.stage === 'completed' ? (e.xpReward || 100) : 0), 0);

    // Calculate level based on XP
    const level = Math.floor(totalXP / 250) + 1;

    modal.innerHTML = `
      <div class="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh] transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Pinned Sticky Top Header -->
        <div class="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-20">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-base shadow-xs">
              <i class="fas fa-id-card-clip"></i>
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <h3 class="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                  Student Event Passport & Brag Sheet
                </h3>
                <span class="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  Level ${level} Fellow
                </span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Verified portfolio of hackathon achievements, symposiums, and university competitions.
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <button id="btn-toggle-resume" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors">
              <i class="fas ${this.viewMode === 'resume' ? 'fa-id-card' : 'fa-print'}"></i>
              <span>${this.viewMode === 'resume' ? 'View Passport' : 'Print Brag Sheet'}</span>
            </button>

            <!-- Prominent Close Button -->
            <button 
              id="close-passport-modal" 
              class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 flex items-center space-x-1.5 transition-colors shadow-2xs"
              title="Close Modal (Esc)"
            >
              <i class="fas fa-xmark text-sm"></i>
              <span>Close</span>
              <kbd class="text-[9px] font-mono text-slate-400 dark:text-slate-500 hidden sm:inline">Esc</kbd>
            </button>
          </div>
        </div>

        <!-- Scrollable Content Body -->
        <div class="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 overscroll-contain">
          ${this.viewMode === 'passport' 
            ? this.renderPassportView(totalXP, level, wonEvents, completedEvents) 
            : this.renderResumeView(wonEvents, completedEvents, totalXP)}
        </div>

        <!-- Sticky Bottom Footer Bar for Easy Dismissal -->
        <div class="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between shrink-0 text-xs text-slate-500">
          <div class="flex items-center space-x-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Verified IIITD Credentials</span>
          </div>

          <div class="flex items-center space-x-2">
            <button id="close-passport-footer-btn" class="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-semibold transition-colors">
              Done & Close
            </button>
          </div>
        </div>

      </div>
    `;

    this.attachEvents();
  }

  renderPassportView(totalXP, level, wonEvents, completedEvents) {
    return `
      <div class="space-y-6">
        
        <!-- Student Identity Header Card -->
        <div class="bg-slate-900 text-white p-5 sm:p-6 rounded-xl border border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center space-x-4">
            <div class="w-14 h-14 rounded-xl bg-blue-600 text-white font-bold font-display text-xl flex items-center justify-center shadow-sm">
              ${this.profile.avatar}
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <h4 class="font-display font-bold text-lg sm:text-xl text-white">
                  ${this.profile.name}
                </h4>
                <span class="text-amber-400 text-xs" title="Verified Collegiate Hacker">
                  <i class="fas fa-certificate"></i>
                </span>
              </div>
              <p class="text-xs text-slate-300 font-mono mt-0.5">
                Roll No: ${this.profile.rollNo} • ${this.profile.department}
              </p>
              <p class="text-xs text-slate-400 mt-1 max-w-lg">
                ${this.profile.university}
              </p>
            </div>
          </div>

          <div class="text-center sm:text-right bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700">
            <span class="text-[10px] text-amber-400 uppercase font-mono font-bold tracking-wider block">Total Earned XP</span>
            <span class="font-mono text-2xl font-bold text-white">${totalXP}</span>
            <span class="text-[10px] text-slate-400 block">Top 5% Cohort</span>
          </div>
        </div>

        <!-- 4 Badges Unlocked Showcase -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center space-x-1.5">
            <i class="fas fa-medal text-amber-500"></i>
            <span>Verified Achievement Badges</span>
          </h4>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="p-3.5 rounded-xl border border-amber-300 dark:border-amber-700/60 bg-amber-50/40 dark:bg-amber-950/20 text-center space-y-1.5">
              <div class="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center text-base mx-auto shadow-xs">
                <i class="fas fa-trophy"></i>
              </div>
              <div class="font-bold text-xs text-slate-900 dark:text-white font-display">Hackathon Victor</div>
              <div class="text-[10px] text-slate-500 dark:text-slate-400">EthIndia '26 Podium Finish</div>
            </div>

            <div class="p-3.5 rounded-xl border border-blue-300 dark:border-blue-700/60 bg-blue-50/40 dark:bg-blue-950/20 text-center space-y-1.5">
              <div class="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-base mx-auto shadow-xs">
                <i class="fas fa-microphone-lines"></i>
              </div>
              <div class="font-bold text-xs text-slate-900 dark:text-white font-display">Oral Paper Defense</div>
              <div class="text-[10px] text-slate-500 dark:text-slate-400">ACM Research Symposium</div>
            </div>

            <div class="p-3.5 rounded-xl border border-indigo-300 dark:border-indigo-700/60 bg-indigo-50/40 dark:bg-indigo-950/20 text-center space-y-1.5">
              <div class="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-base mx-auto shadow-xs">
                <i class="fas fa-shield-halved"></i>
              </div>
              <div class="font-bold text-xs text-slate-900 dark:text-white font-display">SIH Finalist</div>
              <div class="text-[10px] text-slate-500 dark:text-slate-400">Smart India Hackathon '26</div>
            </div>

            <div class="p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-700/60 bg-emerald-50/40 dark:bg-emerald-950/20 text-center space-y-1.5">
              <div class="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center text-base mx-auto shadow-xs">
                <i class="fas fa-wand-magic"></i>
              </div>
              <div class="font-bold text-xs text-slate-900 dark:text-white font-display">WASM Practitioner</div>
              <div class="text-[10px] text-slate-500 dark:text-slate-400">GDG AI Masterclass</div>
            </div>
          </div>
        </div>

        <!-- 5-Dimensional Skills Radar Breakdown -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center space-x-1.5">
            <i class="fas fa-chart-pie text-blue-500"></i>
            <span>Verified Collegiate Competencies</span>
          </h4>

          <div class="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-slate-700 dark:text-slate-300">AI / Machine Learning & LLM Systems</span>
                <span class="font-mono text-blue-600 dark:text-blue-400">88% Mastery</span>
              </div>
              <div class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div class="bg-blue-600 h-2 rounded-full" style="width: 88%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-slate-700 dark:text-slate-300">Distributed Systems & High-Perf Backend</span>
                <span class="font-mono text-indigo-600 dark:text-indigo-400">82% Mastery</span>
              </div>
              <div class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div class="bg-indigo-600 h-2 rounded-full" style="width: 82%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-slate-700 dark:text-slate-300">Web3 & Zero-Knowledge Cryptography</span>
                <span class="font-mono text-purple-600 dark:text-purple-400">74% Mastery</span>
              </div>
              <div class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div class="bg-purple-600 h-2 rounded-full" style="width: 74%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-slate-700 dark:text-slate-300">Live Pitching & Venture Capital Defense</span>
                <span class="font-mono text-amber-600 dark:text-amber-400">92% Mastery</span>
              </div>
              <div class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div class="bg-amber-500 h-2 rounded-full" style="width: 92%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Verified Journey List -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center space-x-1.5">
            <i class="fas fa-list-check text-emerald-500"></i>
            <span>Track Record & Participated Rounds (${this.events.length})</span>
          </h4>

          <div class="space-y-2">
            ${this.events.map(evt => `
              <div class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 flex items-center justify-between text-xs">
                <div class="flex items-center space-x-3">
                  <span class="w-2 h-2 rounded-full ${evt.stage === 'won' ? 'bg-amber-400' : 'bg-blue-500'}"></span>
                  <div>
                    <span class="font-bold font-display text-slate-900 dark:text-white">${evt.title}</span>
                    <span class="text-[11px] text-slate-400 block">${evt.category} • ${evt.platform} • ${evt.teamName || 'Solo'}</span>
                  </div>
                </div>
                <div class="flex items-center space-x-3 font-mono">
                  <span class="text-slate-400">${(evt.milestones || []).filter(m => m.completed).length}/${(evt.milestones || []).length} Milestones</span>
                  <span class="px-2 py-0.5 rounded font-bold ${evt.stage === 'won' ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}">
                    ${evt.stage.toUpperCase()}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;
  }

  renderResumeView(wonEvents, completedEvents, totalXP) {
    return `
      <div id="print-section" class="bg-white text-slate-900 p-8 rounded-xl border border-slate-200 shadow-sm space-y-6 text-sm font-sans">
        
        <!-- Printable Header -->
        <div class="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
          <div>
            <h1 class="text-2xl font-bold font-display text-slate-900">${this.profile.name}</h1>
            <p class="text-xs text-slate-600 mt-0.5 font-mono">
              Roll No: ${this.profile.rollNo} • ${this.profile.department} • ${this.profile.university}
            </p>
            <p class="text-xs text-slate-500">
              Verified Collegiate Competition & Research Colloquium Brag Sheet
            </p>
          </div>
          <div class="text-right">
            <span class="text-xs font-mono font-bold px-2 py-1 bg-slate-100 border border-slate-300 rounded">
              Total XP: ${totalXP}
            </span>
            <span class="block text-[10px] text-slate-500 mt-1">Generated: ${new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <!-- Honors & Key Wins -->
        <div>
          <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
            Honors & Podium Finishes
          </h2>
          <div class="space-y-3">
            ${wonEvents.length > 0 ? wonEvents.map(w => `
              <div>
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-900">${w.title}</span>
                  <span class="font-mono text-xs text-amber-700 font-bold">1st Place / Podium Winner</span>
                </div>
                <p class="text-xs text-slate-600">${w.description || 'Awarded flagship recognition and cash prize pool.'}</p>
                <div class="text-[11px] text-slate-500 mt-0.5">
                  Platform: ${w.platform} • Team: ${w.teamName} (${w.registrationId}) • Skills: ${(w.skills || []).join(', ')}
                </div>
              </div>
            `).join('') : '<p class="text-xs text-slate-500">Multiple active rounds in preparation for podium defense.</p>'}
          </div>
        </div>

        <!-- All Participated Events -->
        <div>
          <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
            Verified Event Record & Multi-Round Milestones
          </h2>
          <div class="space-y-3">
            ${this.events.map(e => `
              <div>
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-900">${e.title}</span>
                  <span class="text-xs text-slate-600">${e.category} (${e.platform})</span>
                </div>
                <p class="text-xs text-slate-600">${e.description || ''}</p>
                <div class="mt-1 flex flex-wrap gap-1">
                  ${(e.milestones || []).map(m => `
                    <span class="text-[10px] px-1.5 py-0.5 rounded ${m.completed ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}">
                      ${m.completed ? '✓' : '○'} ${m.title}
                    </span>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Print Action Trigger -->
        <div class="no-print pt-2 flex justify-center space-x-3">
          <button id="btn-trigger-print" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-2 transition-all">
            <i class="fas fa-print"></i>
            <span>Print or Save as PDF</span>
          </button>
        </div>

      </div>
    `;
  }

  attachEvents() {
    const closeBtn = document.getElementById('close-passport-modal');
    if (closeBtn) closeBtn.onclick = () => this.close();

    const footerCloseBtn = document.getElementById('close-passport-footer-btn');
    if (footerCloseBtn) footerCloseBtn.onclick = () => this.close();

    const toggleBtn = document.getElementById('btn-toggle-resume');
    if (toggleBtn) {
      toggleBtn.onclick = () => {
        sound.playClick();
        this.viewMode = this.viewMode === 'passport' ? 'resume' : 'passport';
        this.render();
      };
    }

    const printBtn = document.getElementById('btn-trigger-print');
    if (printBtn) {
      printBtn.onclick = () => {
        window.print();
      };
    }

    // Dismiss on backdrop click
    const modal = document.getElementById('passport-modal');
    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) {
          this.close();
        }
      };
    }

    // Register Escape key listener
    window.addEventListener('keydown', this.escHandler);
  }

  close() {
    sound.playClick();
    window.removeEventListener('keydown', this.escHandler);
    const modal = document.getElementById('passport-modal');
    if (modal) modal.remove();
    this.onClose();
  }
}
