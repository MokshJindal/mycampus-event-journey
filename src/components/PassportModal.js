// ==========================================================================
// PassportModal Component
// Student Event Passport, Skills Radar, Verified Badges,
// and 1-Click Printable Resume Brag Sheet Export
// ==========================================================================

import { sound } from '../utils/audio.js';
import { StorageManager } from '../utils/storage.js';

export class PassportModal {
  constructor({ events, profile, onClose }) {
    this.events = events;
    this.profile = profile || StorageManager.getProfile();
    this.onClose = onClose;
    this.viewMode = 'passport'; // 'passport' | 'resume'
  }

  render() {
    let modal = document.getElementById('passport-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'passport-modal';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay overflow-y-auto';
      document.body.appendChild(modal);
    }

    const wonEvents = this.events.filter(e => e.stage === 'won');
    const completedEvents = this.events.filter(e => e.stage === 'completed' || e.stage === 'won');
    const totalXP = this.events.reduce((acc, e) => acc + (e.stage === 'won' || e.stage === 'completed' ? (e.xpReward || 100) : 0), 0);

    // Calculate level based on XP
    const level = Math.floor(totalXP / 250) + 1;

    modal.innerHTML = `
      <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden my-6 transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Header -->
        <div class="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-transparent">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center text-lg shadow-md">
              <i class="fas fa-id-card-clip"></i>
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <h3 class="font-serif-classic font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
                  Student Event Passport & Brag Sheet
                </h3>
                <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                  Level ${level} Fellow
                </span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Verified portfolio of hackathon achievements, research symposiums, and university fests.
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <button id="btn-toggle-resume" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors">
              <i class="fas ${this.viewMode === 'resume' ? 'fa-id-card' : 'fa-print'}"></i>
              <span>${this.viewMode === 'resume' ? 'View Passport' : 'Print Brag Sheet'}</span>
            </button>

            <button id="close-passport-modal" class="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <i class="fas fa-xmark text-lg"></i>
            </button>
          </div>
        </div>

        <div class="p-6">
          ${this.viewMode === 'passport' ? this.renderPassportView(totalXP, level, wonEvents, completedEvents) : this.renderResumeView(wonEvents, completedEvents, totalXP)}
        </div>

      </div>
    `;

    this.attachEvents();
  }

  renderPassportView(totalXP, level, wonEvents, completedEvents) {
    return `
      <div class="space-y-6">
        
        <!-- Student Identity Header Card -->
        <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-slate-700/80 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-indigo-600 text-white font-bold font-serif-classic text-2xl flex items-center justify-center shadow-md border-2 border-white/20">
              ${this.profile.avatar}
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <h4 class="font-serif-classic font-bold text-xl text-white">
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

          <div class="text-center sm:text-right bg-white/10 px-4 py-3 rounded-xl border border-white/10">
            <span class="text-[10px] text-amber-300 uppercase font-mono font-bold tracking-wider block">Total Lifetime XP</span>
            <span class="font-mono text-2xl font-extrabold text-white">${totalXP}</span>
            <span class="text-[10px] text-slate-300 block">Top 5% of Department</span>
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
              <div class="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center text-lg mx-auto shadow-sm">
                <i class="fas fa-trophy"></i>
              </div>
              <div class="font-bold text-xs text-slate-900 dark:text-white">Hackathon Victor</div>
              <div class="text-[10px] text-slate-500 dark:text-slate-400">EthIndia '26 Podium Finish</div>
            </div>

            <div class="p-3.5 rounded-xl border border-blue-300 dark:border-blue-700/60 bg-blue-50/40 dark:bg-blue-950/20 text-center space-y-1.5">
              <div class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg mx-auto shadow-sm">
                <i class="fas fa-microphone-lines"></i>
              </div>
              <div class="font-bold text-xs text-slate-900 dark:text-white">Oral Paper Defense</div>
              <div class="text-[10px] text-slate-500 dark:text-slate-400">ACM Research Symposium</div>
            </div>

            <div class="p-3.5 rounded-xl border border-purple-300 dark:border-purple-700/60 bg-purple-50/40 dark:bg-purple-950/20 text-center space-y-1.5">
              <div class="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center text-lg mx-auto shadow-sm">
                <i class="fas fa-shield-halved"></i>
              </div>
              <div class="font-bold text-xs text-slate-900 dark:text-white">SIH Finalist</div>
              <div class="text-[10px] text-slate-500 dark:text-slate-400">Smart India Hackathon '26</div>
            </div>

            <div class="p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-700/60 bg-emerald-50/40 dark:bg-emerald-950/20 text-center space-y-1.5">
              <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center text-lg mx-auto shadow-sm">
                <i class="fas fa-wand-magic"></i>
              </div>
              <div class="font-bold text-xs text-slate-900 dark:text-white">WASM Practitioner</div>
              <div class="text-[10px] text-slate-500 dark:text-slate-400">GDG GenAI Masterclass</div>
            </div>
          </div>
        </div>

        <!-- Skills Matrix -->
        <div class="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Domain Competencies & Acquired Skills
            </h4>
            <span class="text-[11px] text-slate-500">Based on verified event submissions</span>
          </div>

          <div class="space-y-2.5 pt-1">
            <div>
              <div class="flex justify-between text-xs font-medium mb-1">
                <span class="text-slate-800 dark:text-slate-200 font-semibold">AI/ML & Systems Engineering</span>
                <span class="font-mono text-blue-600 dark:text-blue-400">92%</span>
              </div>
              <div class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div class="bg-blue-600 h-2 rounded-full" style="width: 92%;"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-medium mb-1">
                <span class="text-slate-800 dark:text-slate-200 font-semibold">Zero-Knowledge & Web3 Architecture</span>
                <span class="font-mono text-purple-600 dark:text-purple-400">88%</span>
              </div>
              <div class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div class="bg-purple-600 h-2 rounded-full" style="width: 88%;"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-medium mb-1">
                <span class="text-slate-800 dark:text-slate-200 font-semibold">Pitching, Defenses & Technical Writing</span>
                <span class="font-mono text-amber-600 dark:text-amber-400">85%</span>
              </div>
              <div class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div class="bg-amber-500 h-2 rounded-full" style="width: 85%;"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-medium mb-1">
                <span class="text-slate-800 dark:text-slate-200 font-semibold">Quantitative Modeling & Algorithmic Trading</span>
                <span class="font-mono text-cyan-600 dark:text-cyan-400">76%</span>
              </div>
              <div class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div class="bg-cyan-500 h-2 rounded-full" style="width: 76%;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Verified Event Participation Ledger -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Verified Event History Ledger
          </h4>
          <div class="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th class="p-3">Event</th>
                  <th class="p-3">Platform</th>
                  <th class="p-3">Role & Team</th>
                  <th class="p-3">Stage Result</th>
                  <th class="p-3 text-right">Prize / XP</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                ${this.events.map(e => `
                  <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td class="p-3 font-semibold text-slate-900 dark:text-white">
                      ${e.title}
                    </td>
                    <td class="p-3 font-mono text-[11px] text-slate-500">
                      ${e.platform || 'Campus'}
                    </td>
                    <td class="p-3">
                      ${e.teamName || 'Solo'}
                    </td>
                    <td class="p-3">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
                        e.stage === 'won' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }">
                        ${e.stage ? e.stage.toUpperCase() : 'REGISTERED'}
                      </span>
                    </td>
                    <td class="p-3 text-right font-mono font-bold text-purple-600 dark:text-purple-400">
                      +${e.xpReward || 100} XP
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  }

  renderResumeView(wonEvents, completedEvents, totalXP) {
    return `
      <div id="print-section" class="bg-white text-slate-900 p-8 rounded-2xl border border-slate-300 shadow-sm space-y-6 max-w-3xl mx-auto">
        
        <!-- Header for Formal Resume Brag Sheet -->
        <div class="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
          <div>
            <h1 class="text-2xl font-serif-classic font-bold tracking-tight text-slate-900">
              ${this.profile.name}
            </h1>
            <p class="text-xs font-mono text-slate-600 mt-0.5">
              ${this.profile.department} • ${this.profile.university}
            </p>
            <p class="text-xs text-slate-500">
              Email: ${this.profile.email} • Student ID: ${this.profile.rollNo}
            </p>
          </div>
          <div class="text-right">
            <span class="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Executive Event Portfolio</span>
            <span class="font-serif-classic font-bold text-lg text-slate-900">${totalXP} XP Recorded</span>
          </div>
        </div>

        <!-- Academic & Event Honors Section -->
        <div>
          <h2 class="text-xs font-bold uppercase tracking-widest text-blue-900 border-b border-slate-200 pb-1 mb-3">
            Major Hackathon Honors & Competitions
          </h2>
          <div class="space-y-3 text-xs">
            ${this.events.map(e => `
              <div class="border-b border-slate-100 pb-2">
                <div class="flex justify-between items-baseline">
                  <span class="font-bold text-slate-900">${e.title}</span>
                  <span class="font-mono text-[11px] text-slate-500">${e.platform || 'Campus'}</span>
                </div>
                <div class="text-slate-600 mt-0.5">
                  Role: <strong>${e.teamName || 'Solo'}</strong> • ${e.description || ''}
                </div>
                <div class="text-slate-500 text-[11px] mt-0.5">
                  Status: <strong>${e.stage ? e.stage.toUpperCase() : 'PARTICIPANT'}</strong> ${e.prizePool ? `• Honors: ${e.prizePool}` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Competencies Section -->
        <div>
          <h2 class="text-xs font-bold uppercase tracking-widest text-blue-900 border-b border-slate-200 pb-1 mb-2">
            Demonstrated Technical Competencies
          </h2>
          <p class="text-xs text-slate-700 leading-relaxed">
            Full-Stack Web Development, Distributed Systems, Zero-Knowledge Proofs (Circom/Noir), WebAssembly, High-Frequency Trading Models, Rapid Prototyping, Technical Architecture Defense.
          </p>
        </div>

        <div class="pt-4 border-t border-slate-300 flex justify-between items-center text-[10px] text-slate-400">
          <span>Generated via MyCampus: Your Event Journey • IIIT Delhi</span>
          <span>Verified Timestamp: ${new Date().toLocaleDateString()}</span>
        </div>

        <!-- Print Action CTA inside modal -->
        <div class="no-print pt-2 flex justify-center">
          <button id="btn-trigger-print" class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-2 transition-all">
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
  }

  close() {
    sound.playClick();
    const modal = document.getElementById('passport-modal');
    if (modal) modal.remove();
    this.onClose();
  }
}
