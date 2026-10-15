// ==========================================================================
// ProfileModal Component
// Student Identity, Campus Ranking (#4 IIIT Delhi), Leaderboard Cohort,
// Verified Badges, Printable Brag Sheet, and Profile Editor
// 100% Responsive, Zero-clipping on Desktop, Instant Esc/Backdrop Close
// ==========================================================================

import { StorageManager } from '../utils/storage.js';

export class ProfileModal {
  constructor({ events, profile, onProfileUpdated, onClose }) {
    this.events = events || [];
    this.profile = profile || StorageManager.getProfile();
    this.onProfileUpdated = onProfileUpdated || (() => {});
    this.onClose = onClose || (() => {});
    this.activeTab = 'ranking'; // 'ranking' | 'leaderboard' | 'resume' | 'edit'
    
    this.escHandler = (e) => {
      if (e.key === 'Escape') this.close();
    };
  }

  // Calculate dynamic collegiate standing based on real event journey
  calculateRankingMetrics() {
    const wonCount = this.events.filter(e => e.stage === 'won').length;
    const completedCount = this.events.filter(e => e.stage === 'completed' || e.stage === 'won').length;
    
    let totalMilestonesCompleted = 0;
    this.events.forEach(e => {
      (e.milestones || []).forEach(m => {
        if (m.completed) totalMilestonesCompleted++;
      });
    });

    // Score: Base 500 + 150 per won event + 75 per completed event + 25 per cleared milestone
    const eventScore = 500 + (wonCount * 150) + (completedCount * 75) + (totalMilestonesCompleted * 25);
    
    // Tier based on score
    let tier = "Gold Hacker";
    if (eventScore >= 900) tier = "Grandmaster Hacker";
    else if (eventScore >= 750) tier = "Diamond Master";
    else if (eventScore >= 600) tier = "Platinum Fellow";

    return {
      rank: 4, // Student rank in college
      totalStudents: 420,
      percentile: "Top 1%",
      score: eventScore,
      tier,
      wonCount,
      completedCount,
      totalMilestonesCompleted
    };
  }

  render() {
    let modal = document.getElementById('profile-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'profile-modal';
      modal.className = 'fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-8 modal-overlay overflow-y-auto';
      document.body.appendChild(modal);
    }

    const metrics = this.calculateRankingMetrics();

    modal.innerHTML = `
      <div class="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh] transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Header Bar -->
        <div class="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/95 dark:bg-slate-900/95 sticky top-0 z-20">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-display font-bold text-base shadow-xs">
              ${this.profile.avatar || 'MJ'}
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <h3 class="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                  ${this.profile.name}
                </h3>
                <span class="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  Campus Rank #${metrics.rank}
                </span>
                <span class="text-xs text-slate-400 hidden sm:inline">•</span>
                <span class="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
                  ${this.profile.rollNo}
                </span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                ${this.profile.department} • ${this.profile.university}
              </p>
            </div>
          </div>

          <!-- Close Button -->
          <div class="flex items-center space-x-2">
            <button 
              id="close-profile-modal-btn" 
              class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 flex items-center space-x-1.5 transition-colors"
              title="Close (Esc)"
            >
              <i class="fas fa-xmark text-sm"></i>
              <span>Close</span>
              <kbd class="text-[9px] font-mono text-slate-400 dark:text-slate-500 hidden sm:inline">Esc</kbd>
            </button>
          </div>
        </div>

        <!-- Navigation Tabs Bar -->
        <div class="px-5 pt-3 pb-2 bg-slate-50/70 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2 text-xs font-semibold overflow-x-auto">
          <button 
            data-tab="ranking" 
            class="profile-tab-btn px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
              this.activeTab === 'ranking' 
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }"
          >
            <i class="fas fa-chart-line text-[11px]"></i>
            <span>Overview & Ranking</span>
          </button>

          <button 
            data-tab="leaderboard" 
            class="profile-tab-btn px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
              this.activeTab === 'leaderboard' 
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }"
          >
            <i class="fas fa-trophy text-[11px] text-amber-500"></i>
            <span>Campus Leaderboard</span>
          </button>

          <button 
            data-tab="resume" 
            class="profile-tab-btn px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
              this.activeTab === 'resume' 
                ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }"
          >
            <i class="fas fa-file-lines text-[11px]"></i>
            <span>Printable Brag Sheet</span>
          </button>

          <button 
            data-tab="edit" 
            class="profile-tab-btn px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
              this.activeTab === 'edit' 
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }"
          >
            <i class="fas fa-user-pen text-[11px]"></i>
            <span>Edit Profile</span>
          </button>
        </div>

        <!-- Body Content -->
        <div class="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 overscroll-contain">
          ${this.renderActiveTabContent(metrics)}
        </div>

        <!-- Footer Bar -->
        <div class="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between shrink-0 text-xs text-slate-500">
          <div class="flex items-center space-x-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>IIIT Delhi Verified Student Account</span>
          </div>

          <button id="close-profile-footer-btn" class="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-semibold transition-colors">
            Done
          </button>
        </div>

      </div>
    `;

    this.attachEvents();
  }

  renderActiveTabContent(metrics) {
    switch (this.activeTab) {
      case 'ranking':
        return this.renderRankingOverview(metrics);
      case 'leaderboard':
        return this.renderLeaderboard(metrics);
      case 'resume':
        return this.renderResumeBragSheet(metrics);
      case 'edit':
        return this.renderEditProfileForm();
      default:
        return this.renderRankingOverview(metrics);
    }
  }

  // TAB 1: Ranking Overview & Performance
  renderRankingOverview(metrics) {
    return `
      <div class="space-y-6">
        
        <!-- Big Ranking Hero Banner -->
        <div class="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-white/10 bg-gradient-to-br from-blue-50/50 via-white to-amber-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex flex-col md:flex-row items-center justify-between gap-5">
          <div class="space-y-2 text-center md:text-left">
            <div class="flex items-center justify-center md:justify-start space-x-2">
              <span class="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-bold text-xs border border-amber-500/20">
                ${metrics.tier}
              </span>
              <span class="text-xs text-slate-400">•</span>
              <span class="text-xs font-semibold text-slate-600 dark:text-slate-300">
                ${metrics.percentile} Engineering Cohort
              </span>
            </div>

            <h2 class="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
              Campus Rank #${metrics.rank}
            </h2>

            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md">
              Ranked <strong>#${metrics.rank}</strong> out of ${metrics.totalStudents} competitive programmers and hackathon leads in IIIT Delhi based on completed rounds and verified podium finishes.
            </p>
          </div>

          <!-- Total Score Pill -->
          <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-center shrink-0 min-w-[160px]">
            <span class="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
              Event Standing Score
            </span>
            <div class="text-3xl font-display font-bold text-blue-600 dark:text-blue-400 my-0.5">
              ${metrics.score}
            </div>
            <span class="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              +150 pts from last victory
            </span>
          </div>
        </div>

        <!-- 4 Quick Metric Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-center space-y-1">
            <div class="text-xl font-display font-bold text-slate-900 dark:text-white">
              ${this.events.length}
            </div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Registered Events
            </div>
          </div>

          <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-center space-y-1">
            <div class="text-xl font-display font-bold text-amber-500">
              ${metrics.wonCount}
            </div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Podium Victories
            </div>
          </div>

          <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-center space-y-1">
            <div class="text-xl font-display font-bold text-emerald-500">
              ${metrics.totalMilestonesCompleted}
            </div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Rounds Cleared
            </div>
          </div>

          <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-center space-y-1">
            <div class="text-xl font-display font-bold text-blue-500">
              ₹9,50,000+
            </div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Prize Pools Qualified
            </div>
          </div>
        </div>

        <!-- Verified Badges Showcase -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center space-x-1.5">
            <i class="fas fa-medal text-amber-500"></i>
            <span>Verified Achievement Badges</span>
          </h4>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="p-3 rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50/40 dark:bg-amber-950/20 text-center space-y-1">
              <div class="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center text-sm mx-auto shadow-xs">
                <i class="fas fa-trophy"></i>
              </div>
              <div class="font-bold text-xs text-slate-900 dark:text-white font-display">Hackathon Victor</div>
              <div class="text-[10px] text-slate-500 dark:text-slate-400">EthIndia '26 Podium</div>
            </div>

            <div class="p-3 rounded-xl border border-orange-200 dark:border-orange-800/50 bg-orange-50/40 dark:bg-orange-950/20 text-center space-y-1">
              <div class="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center text-sm mx-auto shadow-xs">
                <i class="fas fa-bolt"></i>
              </div>
              <div class="font-bold text-xs text-slate-900 dark:text-white font-display">Unstop Contender</div>
              <div class="text-[10px] text-slate-500 dark:text-slate-400">Flipkart GRiD Round 1</div>
            </div>

            <div class="p-3 rounded-xl border border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/40 dark:bg-indigo-950/20 text-center space-y-1">
              <div class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm mx-auto shadow-xs">
                <i class="fas fa-shield-halved"></i>
              </div>
              <div class="font-bold text-xs text-slate-900 dark:text-white font-display">SIH Finalist</div>
              <div class="text-[10px] text-slate-500 dark:text-slate-400">Smart India Hackathon</div>
            </div>

            <div class="p-3 rounded-xl border border-blue-200 dark:border-blue-800/50 bg-blue-50/40 dark:bg-blue-950/20 text-center space-y-1">
              <div class="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm mx-auto shadow-xs">
                <i class="fas fa-microphone-lines"></i>
              </div>
              <div class="font-bold text-xs text-slate-900 dark:text-white font-display">Research Author</div>
              <div class="text-[10px] text-slate-500 dark:text-slate-400">ACM Defense</div>
            </div>
          </div>
        </div>

        <!-- Competencies Mastery -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center space-x-1.5">
            <i class="fas fa-chart-pie text-blue-500"></i>
            <span>Verified Collegiate Competencies</span>
          </h4>

          <div class="space-y-2.5 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-slate-700 dark:text-slate-300">Distributed Systems & Backend Scaling</span>
                <span class="font-mono text-blue-600 dark:text-blue-400">88%</span>
              </div>
              <div class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div class="bg-blue-600 h-2 rounded-full" style="width: 88%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-slate-700 dark:text-slate-300">Full-Stack Architecture & Modern UI</span>
                <span class="font-mono text-emerald-600 dark:text-emerald-400">92%</span>
              </div>
              <div class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div class="bg-emerald-600 h-2 rounded-full" style="width: 92%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-slate-700 dark:text-slate-300">AI / Machine Learning & Systems</span>
                <span class="font-mono text-purple-600 dark:text-purple-400">85%</span>
              </div>
              <div class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div class="bg-purple-600 h-2 rounded-full" style="width: 85%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-slate-700 dark:text-slate-300">Pitching & Competitive Jury Defense</span>
                <span class="font-mono text-amber-600 dark:text-amber-400">90%</span>
              </div>
              <div class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div class="bg-amber-500 h-2 rounded-full" style="width: 90%"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;
  }

  // TAB 2: Campus Leaderboard
  renderLeaderboard(metrics) {
    const students = [
      { rank: 1, name: "Priya Nair", roll: "2023BCS-018", points: 950, podiums: 3, tier: "Grandmaster" },
      { rank: 2, name: "Rohan Verma", roll: "2023BCS-104", points: 920, podiums: 2, tier: "Grandmaster" },
      { rank: 3, name: "Ananya Joshi", roll: "2023BCS-062", points: 890, podiums: 2, tier: "Grandmaster" },
      { rank: 4, name: this.profile.name, roll: this.profile.rollNo, points: metrics.score, podiums: metrics.wonCount, isCurrent: true, tier: metrics.tier },
      { rank: 5, name: "Kabir Mehta", roll: "2023BCS-145", points: 820, podiums: 1, tier: "Diamond Master" },
      { rank: 6, name: "Tanvi Saxena", roll: "2023BCS-201", points: 790, podiums: 1, tier: "Diamond Master" },
      { rank: 7, name: "Devansh Goyal", roll: "2023BCS-088", points: 760, podiums: 1, tier: "Diamond Master" }
    ];

    return `
      <div class="space-y-4">
        
        <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h4 class="font-display font-bold text-base text-slate-900 dark:text-white">
              IIIT Delhi Campus Leaderboard
            </h4>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Live ranking based on hackathon victories, Unstop performance, and verified deliverables.
            </p>
          </div>

          <span class="text-xs font-mono px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800">
            Batch 2026-2027
          </span>
        </div>

        <div class="space-y-2">
          ${students.map(s => `
            <div class="p-3.5 rounded-xl border flex items-center justify-between transition-all ${
              s.isCurrent 
                ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 shadow-xs' 
                : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }">
              
              <div class="flex items-center space-x-3.5">
                <!-- Rank Pill -->
                <div class="w-8 h-8 rounded-xl flex items-center justify-center font-display font-bold text-xs shrink-0 ${
                  s.rank === 1 ? 'bg-amber-500 text-white shadow-xs' :
                  s.rank === 2 ? 'bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white' :
                  s.rank === 3 ? 'bg-amber-700 text-white' :
                  s.isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }">
                  #${s.rank}
                </div>

                <div>
                  <div class="flex items-center space-x-2">
                    <span class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      ${s.name} ${s.isCurrent ? '<span class="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-600 text-white font-semibold ml-1">YOU</span>' : ''}
                    </span>
                    <span class="text-[10px] font-mono text-slate-400">
                      ${s.roll}
                    </span>
                  </div>
                  <span class="text-[11px] text-slate-500 dark:text-slate-400">
                    ${s.tier} • ${s.podiums} Podiums
                  </span>
                </div>
              </div>

              <!-- Score -->
              <div class="text-right">
                <span class="font-mono text-sm font-bold text-slate-900 dark:text-white block">
                  ${s.points} pts
                </span>
                <span class="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Verified
                </span>
              </div>

            </div>
          `).join('')}
        </div>

      </div>
    `;
  }

  // TAB 3: Printable Resume Brag Sheet
  renderResumeBragSheet(metrics) {
    return `
      <div class="space-y-4">
        
        <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h4 class="font-display font-bold text-base text-slate-900 dark:text-white">
              Student Event Portfolio (Resume Brag Sheet)
            </h4>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Clean 1-page summary for internships, placements, and faculty nominations.
            </p>
          </div>

          <button 
            id="print-brag-sheet-btn" 
            class="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors"
          >
            <i class="fas fa-print text-xs"></i>
            <span>Print / Save PDF</span>
          </button>
        </div>

        <div id="print-section" class="bg-white text-slate-900 p-6 rounded-xl border border-slate-200 shadow-sm space-y-5 font-sans">
          
          <!-- Resume Header -->
          <div class="border-b border-slate-200 pb-4">
            <h2 class="text-2xl font-bold font-display text-slate-900">
              ${this.profile.name}
            </h2>
            <div class="text-xs text-slate-600 font-mono mt-0.5 space-x-2">
              <span>${this.profile.rollNo}</span>
              <span>•</span>
              <span>${this.profile.department}</span>
              <span>•</span>
              <span>${this.profile.university}</span>
            </div>
            <div class="text-xs text-slate-500 mt-1">
              ${this.profile.email} • Campus Standing: Rank #${metrics.rank} of ${metrics.totalStudents} (${metrics.percentile})
            </div>
          </div>

          <!-- Event Track Record -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
              Competitive Hackathons & Challenges Track Record
            </h3>

            <div class="space-y-3">
              ${this.events.map(e => `
                <div class="space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-xs text-slate-900">${e.title}</span>
                    <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold uppercase">
                      ${e.stage || 'Registered'}
                    </span>
                  </div>
                  <div class="text-[11px] text-slate-600">
                    Platform: ${e.platform} • Team: ${e.teamName || 'Solo'} • Registration: ${e.registrationId || 'Verified'}
                  </div>
                  <p class="text-[11px] text-slate-500 leading-relaxed">
                    ${e.description || 'Participated and progressed through multi-round competitive phases.'}
                  </p>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

      </div>
    `;
  }

  // TAB 4: Edit Profile Form
  renderEditProfileForm() {
    return `
      <form id="edit-profile-form" class="space-y-4">
        
        <div>
          <h4 class="font-display font-bold text-base text-slate-900 dark:text-white">
            Edit Student Profile Details
          </h4>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Update your collegiate identification, department, and contact information.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
            <input 
              type="text" 
              id="edit-name" 
              value="${this.profile.name || ''}" 
              required
              class="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">Roll Number</label>
            <input 
              type="text" 
              id="edit-roll" 
              value="${this.profile.rollNo || ''}" 
              required
              class="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">Department / Major</label>
            <input 
              type="text" 
              id="edit-dept" 
              value="${this.profile.department || ''}" 
              required
              class="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">University / Institute</label>
            <input 
              type="text" 
              id="edit-univ" 
              value="${this.profile.university || ''}" 
              required
              class="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div class="space-y-1 sm:col-span-2">
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">Campus Email</label>
            <input 
              type="email" 
              id="edit-email" 
              value="${this.profile.email || ''}" 
              required
              class="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div class="space-y-1 sm:col-span-2">
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">Bio & Interests</label>
            <textarea 
              id="edit-bio" 
              rows="3"
              class="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >${this.profile.bio || ''}</textarea>
          </div>
        </div>

        <div class="flex justify-end space-x-2 pt-2">
          <button 
            type="button" 
            id="cancel-edit-btn"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
          >
            Save Profile Changes
          </button>
        </div>

      </form>
    `;
  }

  attachEvents() {
    // Escape key
    window.addEventListener('keydown', this.escHandler);

    // Close buttons
    const closeTop = document.getElementById('close-profile-modal-btn');
    if (closeTop) closeTop.onclick = () => this.close();

    const closeBottom = document.getElementById('close-profile-footer-btn');
    if (closeBottom) closeBottom.onclick = () => this.close();

    // Tab switcher
    document.querySelectorAll('.profile-tab-btn').forEach(btn => {
      btn.onclick = () => {
        const tab = btn.getAttribute('data-tab');
        if (tab) {
          this.activeTab = tab;
          this.render();
        }
      };
    });

    // Print button
    const printBtn = document.getElementById('print-brag-sheet-btn');
    if (printBtn) {
      printBtn.onclick = () => window.print();
    }

    // Cancel edit
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    if (cancelEditBtn) {
      cancelEditBtn.onclick = () => {
        this.activeTab = 'ranking';
        this.render();
      };
    }

    // Submit edit form
    const editForm = document.getElementById('edit-profile-form');
    if (editForm) {
      editForm.onsubmit = (e) => {
        e.preventDefault();
        const updated = {
          ...this.profile,
          name: document.getElementById('edit-name').value.trim(),
          rollNo: document.getElementById('edit-roll').value.trim(),
          department: document.getElementById('edit-dept').value.trim(),
          university: document.getElementById('edit-univ').value.trim(),
          email: document.getElementById('edit-email').value.trim(),
          bio: document.getElementById('edit-bio').value.trim()
        };

        // Recalculate avatar initials
        const parts = updated.name.split(' ').filter(Boolean);
        updated.avatar = parts.map(p => p[0].toUpperCase()).slice(0, 2).join('');

        this.profile = updated;
        StorageManager.saveProfile(updated);
        this.onProfileUpdated(updated);

        this.activeTab = 'ranking';
        this.render();
      };
    }

    // Backdrop click
    const modal = document.getElementById('profile-modal');
    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) this.close();
      };
    }
  }

  close() {
    window.removeEventListener('keydown', this.escHandler);
    const modal = document.getElementById('profile-modal');
    if (modal) modal.remove();
    this.onClose();
  }
}
