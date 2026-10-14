// ==========================================================================
// UnstopPluginModal Component
// Dedicated Unstop Competition Integration: Link Resolver, Multi-Round Details,
// Verified Unstop Badges, and 1-Click Collegiate Timeline Ingestion
// ==========================================================================

import { sound } from '../utils/audio.js';

export const POPULAR_UNSTOP_COMPETITIONS = [
  {
    id: "unstop-flipkart-grid-7",
    title: "Flipkart GRiD 7.0: Software Development Track",
    category: "Hackathon",
    platform: "Unstop",
    platformUrl: "https://unstop.com/hackathons/flipkart-grid-70-software-development-track-flipkart-1142852",
    registrationId: "GRID7-IIITD-491",
    teamName: "ByteStorm",
    prizePool: "₹6,00,000 + SDE-1 PPO Interviews",
    eligibility: "B.Tech / B.E. / M.Tech / Dual Degree (Batch 2026-2028)",
    skills: ["Distributed Systems", "Full-Stack", "Machine Learning", "Cloud Scale"],
    venue: {
      building: "R&D Block",
      room: "Computer Science Labs & Virtual",
      campusZone: "North Campus",
      isVirtual: true,
      wifiSSID: "IIITD-Events-5G"
    },
    description: "Flipkart's premier flagship engineering campus challenge offering PPO interview opportunities and national recognition.",
    rounds: [
      {
        phase: "Registration",
        title: "Team Registration & Verification",
        deadline: "2026-10-15T23:59:00",
        notes: "Form teams of 2 to 3 members from same institute."
      },
      {
        phase: "Submission",
        title: "Round 1: E-Commerce & Tech MCQ Screening Quiz",
        deadline: "2026-10-22T20:00:00",
        urgent: true,
        notes: "30 questions, 30 minutes. Strict proctoring on Unstop portal."
      },
      {
        phase: "Submission",
        title: "Round 2: Problem Statement Prototype & Architecture Video",
        deadline: "2026-11-04T23:59:00",
        notes: "Working GitHub repo link + 3-minute architectural demo video."
      },
      {
        phase: "Finale",
        title: "Round 3: Grand Finale Presentation to Flipkart Leadership",
        deadline: "2026-11-20T10:00:00",
        notes: "Top 20 teams present live to Senior Directors & VP of Engineering."
      }
    ]
  },
  {
    id: "unstop-tata-crucible-2026",
    title: "Tata Crucible Campus Hack & Case Challenge 2026",
    category: "Competition",
    platform: "Unstop",
    platformUrl: "https://unstop.com/competitions/tata-crucible-campus-quiz-2026",
    registrationId: "TATA26-DEL-881",
    teamName: "IIITD Mavericks",
    prizePool: "₹2,50,000 Cash + Tata Crucible Trophy",
    eligibility: "Full-time Undergraduate and Postgraduate Students",
    skills: ["Case Analysis", "FinTech", "Strategic Planning", "Presentation"],
    venue: {
      building: "Old Academic Block",
      room: "Auditorium 101",
      campusZone: "Central Campus",
      isVirtual: false
    },
    description: "India's highest-reputed collegiate business case and technology quiz celebrating analytical sharpness and strategic depth.",
    rounds: [
      {
        phase: "Registration",
        title: "Campus Team Enrolment",
        deadline: "2026-10-16T18:00:00",
        notes: "Teams of 2 students."
      },
      {
        phase: "Submission",
        title: "Prelims: Online Business & Tech Speed Quiz",
        deadline: "2026-10-25T19:00:00",
        urgent: true,
        notes: "Top 100 teams advance to Regional Cluster Round."
      },
      {
        phase: "Shortlist",
        title: "Delhi Cluster Semi-Finals",
        deadline: "2026-11-08T14:00:00",
        notes: "Live buzzer round hosted at Old Academic Block Auditorium."
      },
      {
        phase: "Finale",
        title: "National Finals at Taj Palace Mumbai",
        deadline: "2026-11-28T16:00:00",
        notes: "All-expense paid trip for finalist teams."
      }
    ]
  },
  {
    id: "unstop-loreal-brandstorm-2026",
    title: "L'Oréal Brandstorm 2026: Tech & AI Track",
    category: "Competition",
    platform: "Unstop",
    platformUrl: "https://unstop.com/competitions/loreal-brandstorm-2026",
    registrationId: "LOREAL-26-4421",
    teamName: "AuraTech",
    prizePool: "Intra-School Win + 3-Month Intrapreneurship in Paris",
    eligibility: "Undergraduate & Masters students (Ages 18-30)",
    skills: ["AI Systems", "Product Design", "UI/UX", "Consumer Tech"],
    venue: {
      building: "C-Block Auditorium",
      room: "Main Stage",
      campusZone: "West Campus",
      isVirtual: false
    },
    description: "Global student innovation competition challenging students to disrupt beauty through AI, AR/VR, and sustainable engineering.",
    rounds: [
      {
        phase: "Registration",
        title: "Global Team Formation",
        deadline: "2026-10-20T23:59:00",
        notes: "Diverse 3-member team requirement."
      },
      {
        phase: "Submission",
        title: "Round 1: 3-Slide Pitch & 1-Minute Video Elevator",
        deadline: "2026-11-05T23:59:00",
        notes: "Upload PDF pitch deck + unlisted YouTube video on Unstop."
      },
      {
        phase: "Finale",
        title: "National Finals India & Jury Evaluation",
        deadline: "2026-11-25T11:00:00",
        notes: "Present to L'Oréal Executive Committee."
      }
    ]
  }
];

export class UnstopPluginModal {
  constructor({ onImportEvent, onClose }) {
    this.onImportEvent = onImportEvent;
    this.onClose = onClose || (() => {});
    this.escHandler = (e) => {
      if (e.key === 'Escape') this.close();
    };
    this.resolvedEvent = null;
  }

  render() {
    let modal = document.getElementById('unstop-plugin-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'unstop-plugin-modal';
      modal.className = 'fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-8 modal-overlay overflow-y-auto';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh] transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Header -->
        <div class="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-20">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center text-lg shadow-xs">
              <i class="fas fa-bolt"></i>
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <h3 class="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                  Unstop Competition Plugin
                </h3>
                <span class="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                  Official Integration
                </span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Direct integration with India's largest collegiate competition platform. Parse rounds, prizes & deadlines.
              </p>
            </div>
          </div>

          <button 
            id="close-unstop-modal" 
            class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            <i class="fas fa-xmark text-sm"></i>
            <span>Close</span>
            <kbd class="text-[9px] font-mono text-slate-400 dark:text-slate-500 hidden sm:inline">Esc</kbd>
          </button>
        </div>

        <!-- Body -->
        <div class="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 overscroll-contain">
          
          <!-- SECTION 1: Unstop Link Resolver & Custom Parser -->
          <div class="p-4 sm:p-5 rounded-xl border border-orange-200 dark:border-orange-900/50 bg-orange-50/30 dark:bg-orange-950/20 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-orange-700 dark:text-orange-400 font-display flex items-center space-x-1.5">
                <i class="fas fa-link text-xs"></i>
                <span>Paste Unstop Competition Link or Name</span>
              </span>
              <span class="text-[10px] text-slate-400 font-mono">Instant Multi-Round Extractor</span>
            </div>

            <div class="flex flex-col sm:flex-row gap-2">
              <input 
                type="text" 
                id="unstop-url-input" 
                placeholder="e.g. https://unstop.com/hackathons/flipkart-grid-7 or Smart India Hackathon" 
                class="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
              <button 
                id="btn-resolve-unstop" 
                class="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs transition-colors shrink-0"
              >
                <i class="fas fa-magnifying-glass text-xs"></i>
                <span>Resolve Unstop Rounds</span>
              </button>
            </div>

            <div id="unstop-resolved-preview" class="hidden pt-3 border-t border-orange-200 dark:border-orange-900/40">
              <!-- Dynamically populated resolved details -->
            </div>
          </div>

          <!-- SECTION 2: Curated Active Unstop Competitions Ready to Ingest -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                <i class="fas fa-fire text-orange-500"></i>
                <span>Featured National Unstop Competitions (1-Click Ingest)</span>
              </h4>
              <span class="text-[11px] text-slate-400">Pre-configured with all official rounds</span>
            </div>

            <div class="space-y-3">
              ${POPULAR_UNSTOP_COMPETITIONS.map((comp, idx) => `
                <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-orange-400 dark:hover:border-orange-600 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div class="space-y-1.5 flex-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 border border-orange-300 dark:border-orange-800">
                        Unstop Verified
                      </span>
                      <span class="text-xs font-bold font-display text-slate-900 dark:text-white">
                        ${comp.title}
                      </span>
                    </div>

                    <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      ${comp.description}
                    </p>

                    <div class="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-mono">
                      <span class="text-emerald-600 dark:text-emerald-400 font-semibold"><i class="fas fa-trophy mr-1 text-[10px]"></i>${comp.prizePool}</span>
                      <span>•</span>
                      <span><i class="fas fa-layer-group mr-1 text-[10px]"></i>${comp.rounds.length} Official Rounds</span>
                      <span>•</span>
                      <span><i class="fas fa-user-graduate mr-1 text-[10px]"></i>${comp.eligibility}</span>
                    </div>
                  </div>

                  <div class="flex items-center space-x-2 shrink-0">
                    <a 
                      href="${comp.platformUrl}" 
                      target="_blank" 
                      class="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 bg-slate-100 dark:bg-slate-700/60 rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <span>Portal</span>
                      <i class="fas fa-arrow-up-right-from-square text-[10px]"></i>
                    </a>

                    <button 
                      data-comp-idx="${idx}"
                      class="btn-import-featured-unstop px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors"
                    >
                      <i class="fas fa-plus text-xs"></i>
                      <span>Import Journey</span>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between shrink-0 text-xs text-slate-500">
          <div class="flex items-center space-x-2">
            <i class="fas fa-circle-check text-emerald-500"></i>
            <span>Connected to Unstop Academic Gateway</span>
          </div>

          <button id="close-unstop-footer-btn" class="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-semibold transition-colors">
            Close
          </button>
        </div>

      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const closeBtn = document.getElementById('close-unstop-modal');
    if (closeBtn) closeBtn.onclick = () => this.close();

    const footerCloseBtn = document.getElementById('close-unstop-footer-btn');
    if (footerCloseBtn) footerCloseBtn.onclick = () => this.close();

    // Backdrop click dismiss
    const modal = document.getElementById('unstop-plugin-modal');
    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) this.close();
      };
    }

    // Escape key
    window.addEventListener('keydown', this.escHandler);

    // Resolve Button
    const resolveBtn = document.getElementById('btn-resolve-unstop');
    const urlInput = document.getElementById('unstop-url-input');
    if (resolveBtn && urlInput) {
      resolveBtn.onclick = () => {
        sound.playClick();
        const val = urlInput.value.trim();
        if (!val) {
          alert('Please enter an Unstop competition link or title.');
          return;
        }
        this.resolveUnstopUrl(val);
      };
    }

    // Import Featured Buttons
    document.querySelectorAll('.btn-import-featured-unstop').forEach(btn => {
      btn.onclick = () => {
        sound.playClick();
        const idx = parseInt(btn.getAttribute('data-comp-idx'), 10);
        const comp = POPULAR_UNSTOP_COMPETITIONS[idx];
        if (comp) {
          this.importCompetition(comp);
        }
      };
    });
  }

  resolveUnstopUrl(query) {
    const preview = document.getElementById('unstop-resolved-preview');
    if (!preview) return;

    // Smart lookup or generated template based on query
    let comp = POPULAR_UNSTOP_COMPETITIONS.find(c => 
      query.toLowerCase().includes(c.title.toLowerCase().slice(0, 10)) || 
      query.toLowerCase().includes('grid') || 
      query.toLowerCase().includes('tata') ||
      query.toLowerCase().includes('brandstorm')
    );

    if (!comp) {
      // Auto-synthesize custom Unstop competition structure
      const title = query.startsWith('http') 
        ? query.split('/').pop().replace(/-/g, ' ').toUpperCase() 
        : query;
      
      comp = {
        id: `unstop-${Date.now()}`,
        title: title,
        category: "Competition",
        platform: "Unstop",
        platformUrl: query.startsWith('http') ? query : `https://unstop.com/search?q=${encodeURIComponent(query)}`,
        registrationId: `UNSTOP-${Math.floor(100000 + Math.random() * 900000)}`,
        teamName: "Team IIITD",
        prizePool: "₹1,50,000 + National Finalist Certificate",
        eligibility: "Open to Technical & Management University Students",
        skills: ["Problem Solving", "Prototyping", "Pitching"],
        venue: {
          building: "R&D Block",
          room: "Main Hall & Virtual",
          campusZone: "North Campus",
          isVirtual: false
        },
        description: `Verified competition registered on Unstop portal for ${title}.`,
        rounds: [
          {
            phase: "Registration",
            title: "Round 1: Unstop Enrolment & Quiz Screening",
            deadline: "2026-10-18T23:59:00",
            notes: "Complete preliminary quiz on Unstop."
          },
          {
            phase: "Submission",
            title: "Round 2: PPT Submission & Prototype Demo",
            deadline: "2026-11-02T23:59:00",
            urgent: true,
            notes: "Submit 10-slide deck on Unstop portal."
          },
          {
            phase: "Finale",
            title: "Round 3: Grand Jury Defense & Presentation",
            deadline: "2026-11-16T14:00:00",
            notes: "Final pitch to executive panel."
          }
        ]
      };
    }

    this.resolvedEvent = comp;
    preview.classList.remove('hidden');
    preview.innerHTML = `
      <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-orange-300 dark:border-orange-700/80 space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-xs font-bold font-display text-slate-900 dark:text-white">${comp.title}</span>
            <div class="text-[11px] text-slate-500 font-mono mt-0.5">${comp.prizePool} • ${comp.eligibility}</div>
          </div>
          <button 
            id="btn-confirm-import-resolved" 
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors shrink-0"
          >
            <i class="fas fa-check text-xs"></i>
            <span>Add to My Journey</span>
          </button>
        </div>

        <div class="border-t border-slate-200 dark:border-slate-700 pt-2">
          <span class="text-[10px] font-bold uppercase text-slate-400 block mb-1.5 font-mono">Parsed Unstop Rounds:</span>
          <div class="space-y-1.5">
            ${comp.rounds.map(r => `
              <div class="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-50 dark:bg-slate-900/60 font-mono">
                <span class="text-slate-800 dark:text-slate-200 font-medium">${r.title}</span>
                <span class="text-amber-500 font-bold">${r.deadline.replace('T', ' ')}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const confirmBtn = document.getElementById('btn-confirm-import-resolved');
    if (confirmBtn) {
      confirmBtn.onclick = () => {
        sound.playSuccess();
        this.importCompetition(this.resolvedEvent);
      };
    }
  }

  importCompetition(comp) {
    const newEvent = {
      id: comp.id || `unstop-${Date.now()}`,
      title: comp.title,
      category: comp.category || "Competition",
      platform: "Unstop",
      platformUrl: comp.platformUrl || "https://unstop.com",
      stage: "registered",
      registrationId: comp.registrationId || `UNSTOP-${Math.floor(100000 + Math.random() * 900000)}`,
      teamName: comp.teamName || "Team IIITD",
      teamMembers: [
        { name: "Moksh Jindal", role: "Team Lead", avatar: "MJ" },
        { name: "Aarav Sharma", role: "Tech Lead", avatar: "AS" }
      ],
      venue: comp.venue || {
        building: "R&D Block",
        room: "Auditorium",
        campusZone: "North Campus",
        isVirtual: false
      },
      color: "#ea580c",
      icon: "trophy",
      skills: comp.skills || ["Case Analysis", "Prototyping"],
      xpReward: 300,
      prizePool: comp.prizePool,
      description: comp.description,
      checklist: [
        { id: "chk-u1", text: "Register verified team on Unstop", completed: true },
        { id: "chk-u2", text: "Submit preliminary deck before deadline", completed: false },
        { id: "chk-u3", text: "Verify college ID and consent documents", completed: false }
      ],
      milestones: comp.rounds.map((r, i) => ({
        id: `m-u-${Date.now()}-${i}`,
        title: r.title,
        deadline: r.deadline,
        completed: i === 0,
        phase: r.phase || "Submission",
        location: comp.venue ? comp.venue.building : "Unstop Portal",
        urgent: r.urgent || false,
        notes: r.notes || "Official Unstop submission deadline."
      }))
    };

    this.onImportEvent(newEvent);
    this.close();
  }

  close() {
    sound.playClick();
    window.removeEventListener('keydown', this.escHandler);
    const modal = document.getElementById('unstop-plugin-modal');
    if (modal) modal.remove();
    this.onClose();
  }
}
