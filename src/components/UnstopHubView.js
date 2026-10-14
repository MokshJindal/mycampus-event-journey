// ==========================================================================
// UnstopHubView Component
// Clean, Dedicated Unstop Competition Explorer & Link Ingest
// Direct access to multi-round milestones, eligibility, prizes, and 1-click import
// ==========================================================================

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
    eligibility: "B.Tech / M.Tech / Dual Degree (Batch 2026-2028)",
    skills: ["Distributed Systems", "Full-Stack", "Machine Learning", "Cloud Scale"],
    venue: {
      building: "R&D Block",
      room: "CS Labs & Unstop Portal",
      campusZone: "North Campus",
      isVirtual: true
    },
    description: "Flipkart's premier flagship engineering campus challenge offering PPO interview opportunities and national recognition.",
    milestones: [
      {
        id: "grid-m1",
        title: "Team Registration & Verification",
        deadline: "2026-10-15T23:59:00",
        completed: true,
        phase: "Registration",
        notes: "Form teams of 2 to 3 members from same institute."
      },
      {
        id: "grid-m2",
        title: "Round 1: E-Commerce & Tech MCQ Screening Quiz",
        deadline: "2026-10-22T20:00:00",
        completed: false,
        phase: "Submission",
        urgent: true,
        notes: "30 questions, 30 minutes. Strict proctoring on Unstop portal."
      },
      {
        id: "grid-m3",
        title: "Round 2: Problem Statement Prototype & Architecture Video",
        deadline: "2026-11-04T23:59:00",
        completed: false,
        phase: "Submission",
        notes: "Working GitHub repo link + 3-minute architectural demo video."
      },
      {
        id: "grid-m4",
        title: "Round 3: Grand Finale Presentation to Flipkart Leadership",
        deadline: "2026-11-20T10:00:00",
        completed: false,
        phase: "Finale",
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
    milestones: [
      {
        id: "tata-m1",
        title: "Campus Team Enrolment",
        deadline: "2026-10-16T18:00:00",
        completed: true,
        phase: "Registration",
        notes: "Teams of 2 students."
      },
      {
        id: "tata-m2",
        title: "Prelims: Online Business & Tech Speed Quiz",
        deadline: "2026-10-25T19:00:00",
        completed: false,
        phase: "Submission",
        urgent: true,
        notes: "Top 100 teams advance to Regional Cluster Round."
      },
      {
        id: "tata-m3",
        title: "Delhi Cluster Semi-Finals (Live Buzzers)",
        deadline: "2026-11-08T14:00:00",
        completed: false,
        phase: "Shortlist",
        notes: "Live buzzer round hosted at Old Academic Block Auditorium."
      },
      {
        id: "tata-m4",
        title: "National Finals at Taj Palace Mumbai",
        deadline: "2026-11-28T16:00:00",
        completed: false,
        phase: "Finale",
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
    prizePool: "National Trophy + 3-Month Intrapreneurship in Paris",
    eligibility: "Undergraduate & Masters students (Ages 18-30)",
    skills: ["AI Systems", "Product Design", "UI/UX", "Consumer Tech"],
    venue: {
      building: "C-Block Auditorium",
      room: "Main Stage",
      campusZone: "West Campus",
      isVirtual: false
    },
    description: "Global student innovation competition challenging students to disrupt beauty through AI, AR/VR, and sustainable engineering.",
    milestones: [
      {
        id: "lor-m1",
        title: "Global Team Formation",
        deadline: "2026-10-20T23:59:00",
        completed: true,
        phase: "Registration",
        notes: "Diverse 3-member team requirement."
      },
      {
        id: "lor-m2",
        title: "Round 1: 3-Slide Pitch & 1-Minute Video Elevator",
        deadline: "2026-11-05T23:59:00",
        completed: false,
        phase: "Submission",
        notes: "Upload PDF pitch deck + unlisted YouTube video on Unstop."
      },
      {
        id: "lor-m3",
        title: "National Finals India & Jury Evaluation",
        deadline: "2026-11-25T11:00:00",
        completed: false,
        phase: "Finale",
        notes: "Present to L'Oréal Executive Committee."
      }
    ]
  },
  {
    id: "unstop-sih-2026",
    title: "Smart India Hackathon (SIH 2026) - Hardware & Software",
    category: "Hackathon",
    platform: "Unstop",
    platformUrl: "https://unstop.com/hackathons/smart-india-hackathon-2026",
    registrationId: "SIH26-IIITD-102",
    teamName: "Delhi Titans",
    prizePool: "₹1,00,000 per problem statement",
    eligibility: "Indian College Students (Team of 6 with at least 1 female)",
    skills: ["IoT", "Web3", "AI", "Mobile Apps", "GovTech"],
    venue: {
      building: "R&D Block",
      room: "Innovation Nodal Center",
      campusZone: "North Campus",
      isVirtual: false
    },
    description: "Nationwide initiative to provide students with a platform to solve pressing problems of ministries, departments, and industries.",
    milestones: [
      {
        id: "sih-m1",
        title: "Internal College Hackathon Screening",
        deadline: "2026-10-28T18:00:00",
        completed: false,
        phase: "Submission",
        urgent: true,
        notes: "College SPOC nominates top 30 teams for ministry portal."
      },
      {
        id: "sih-m2",
        title: "Central Portal Idea Submission",
        deadline: "2026-11-12T23:59:00",
        completed: false,
        phase: "Submission",
        notes: "Detailed architecture diagram, tech stack, and feasibility study."
      },
      {
        id: "sih-m3",
        title: "Grand Finale (36-Hour Continuous Hackathon)",
        deadline: "2026-12-18T09:00:00",
        completed: false,
        phase: "Finale",
        notes: "Hosted across designated nodal centers in India."
      }
    ]
  }
];

export class UnstopHubView {
  constructor({ events, onImportEvent, onViewTimeline }) {
    this.events = events;
    this.onImportEvent = onImportEvent;
    this.onViewTimeline = onViewTimeline;
  }

  update({ events }) {
    if (events !== undefined) this.events = events;
    this.render();
  }

  formatDate(dateStr) {
    if (!dateStr) return 'TBA';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  }

  render() {
    const container = document.getElementById('view-container');
    if (!container) return;

    const existingIds = new Set(this.events.map(e => e.id));

    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6">
        
        <!-- Header & Quick Ingest -->
        <div class="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/10 space-y-4">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="space-y-1">
              <div class="flex items-center space-x-2">
                <span class="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-sm">
                  <i class="fas fa-bolt"></i>
                </span>
                <h2 class="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
                  Unstop Competition Hub
                </h2>
              </div>
              <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Track India's biggest collegiate challenges, hackathons, quizzes, and hiring rounds in one place.
              </p>
            </div>

            <div class="flex items-center space-x-2 text-xs font-mono text-slate-500 dark:text-slate-400">
              <span class="px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 font-semibold border border-orange-500/20">
                Direct Sync Active
              </span>
            </div>
          </div>

          <!-- URL Ingest Bar -->
          <div class="bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-2">
            <div class="relative flex-1 w-full">
              <i class="fas fa-link absolute left-3 top-3 text-slate-400 text-xs"></i>
              <input 
                type="url" 
                id="unstop-url-input" 
                placeholder="Paste any Unstop competition link (e.g. https://unstop.com/hackathons/flipkart-grid-70...)" 
                class="w-full pl-8 pr-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40"
              />
            </div>
            <button 
              id="unstop-url-submit-btn" 
              class="w-full sm:w-auto px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-colors shrink-0 shadow-xs"
            >
              <i class="fas fa-plus text-[10px]"></i>
              <span>Import to Journey</span>
            </button>
          </div>
        </div>

        <!-- Section: Popular Campus Competitions -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <h3 class="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                Featured National Competitions
              </h3>
              <span class="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                ${POPULAR_UNSTOP_COMPETITIONS.length} Available
              </span>
            </div>
            <span class="text-xs text-slate-400 hidden sm:inline">1-Click add to your calendar & timeline</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            ${POPULAR_UNSTOP_COMPETITIONS.map(comp => {
              const isAdded = existingIds.has(comp.id);
              return `
                <div class="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/10 flex flex-col justify-between space-y-4">
                  
                  <div class="space-y-3">
                    <!-- Badges -->
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-2">
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                          ${comp.category}
                        </span>
                        <span class="text-xs text-slate-400">•</span>
                        <span class="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          ${comp.platform}
                        </span>
                      </div>
                      
                      ${comp.prizePool ? `
                        <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          ${comp.prizePool}
                        </span>
                      ` : ''}
                    </div>

                    <!-- Title & Description -->
                    <div>
                      <h4 class="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                        ${comp.title}
                      </h4>
                      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        ${comp.description}
                      </p>
                    </div>

                    <!-- Eligibility & Skills -->
                    <div class="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-white/5">
                      <div><strong class="text-slate-700 dark:text-slate-300">Eligibility:</strong> ${comp.eligibility}</div>
                      <div><strong class="text-slate-700 dark:text-slate-300">Skills:</strong> ${comp.skills.join(', ')}</div>
                    </div>

                    <!-- Multi-Round Milestones Breakdown -->
                    <div class="space-y-1.5">
                      <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Competition Schedule (${comp.milestones.length} Rounds):
                      </div>
                      <div class="space-y-1.5">
                        ${comp.milestones.map((m, idx) => `
                          <div class="flex items-start justify-between text-xs p-2 rounded-lg bg-slate-50/70 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5">
                            <div class="space-y-0.5">
                              <div class="font-semibold text-slate-800 dark:text-slate-200">
                                ${m.title}
                              </div>
                              <div class="text-[10px] text-slate-500 dark:text-slate-400">
                                ${m.notes || ''}
                              </div>
                            </div>
                            <span class="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded ${
                              m.urgent 
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30' 
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }">
                              ${this.formatDate(m.deadline)}
                            </span>
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <a 
                      href="${comp.platformUrl}" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="text-xs text-orange-600 dark:text-orange-400 hover:underline flex items-center space-x-1 font-semibold"
                    >
                      <span>View on Unstop</span>
                      <i class="fas fa-arrow-up-right-from-square text-[10px]"></i>
                    </a>

                    ${isAdded ? `
                      <button 
                        data-action="view-timeline"
                        class="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-lg flex items-center space-x-1"
                      >
                        <i class="fas fa-check text-[10px]"></i>
                        <span>Added to Journey</span>
                      </button>
                    ` : `
                      <button 
                        data-action="import-comp" 
                        data-comp-id="${comp.id}"
                        class="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 shadow-xs transition-colors"
                      >
                        <i class="fas fa-plus text-[10px]"></i>
                        <span>Add to My Journey</span>
                      </button>
                    `}
                  </div>

                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    // Add popular competition button clicks
    document.querySelectorAll('[data-action="import-comp"]').forEach(btn => {
      btn.onclick = () => {
        const compId = btn.getAttribute('data-comp-id');
        const comp = POPULAR_UNSTOP_COMPETITIONS.find(c => c.id === compId);
        if (comp) {
          this.onImportEvent(comp);
        }
      };
    });

    // View on timeline
    document.querySelectorAll('[data-action="view-timeline"]').forEach(btn => {
      btn.onclick = () => {
        if (this.onViewTimeline) this.onViewTimeline();
      };
    });

    // Custom URL input
    const submitBtn = document.getElementById('unstop-url-submit-btn');
    const urlInput = document.getElementById('unstop-url-input');

    if (submitBtn && urlInput) {
      const handleImport = () => {
        const url = urlInput.value.trim();
        if (!url) {
          alert('Please enter an Unstop competition URL');
          return;
        }

        // Parse competition from link
        let parsedTitle = "Unstop Campus Challenge";
        try {
          const urlObj = new URL(url);
          const parts = urlObj.pathname.split('/').filter(Boolean);
          if (parts.length > 0) {
            const rawSlug = parts[parts.length - 1];
            parsedTitle = rawSlug
              .split('-')
              .map(w => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ');
          }
        } catch (e) {
          // Keep default
        }

        const now = new Date();
        const d1 = new Date(now.getTime() + 4 * 86400000).toISOString();
        const d2 = new Date(now.getTime() + 14 * 86400000).toISOString();
        const d3 = new Date(now.getTime() + 28 * 86400000).toISOString();

        const customEvent = {
          id: `unstop-${Date.now()}`,
          title: parsedTitle,
          category: "Competition",
          platform: "Unstop",
          platformUrl: url,
          registrationId: `UNSTOP-${Math.floor(100000 + Math.random() * 900000)}`,
          teamName: "My Team",
          prizePool: "Cash & Certificates",
          description: `Imported from Unstop: ${url}`,
          venue: {
            building: "Virtual / Campus Center",
            room: "Unstop Online Portal",
            isVirtual: true
          },
          milestones: [
            {
              id: `m-un-${Date.now()}-1`,
              title: "Online Screening Round / Quiz",
              deadline: d1,
              completed: false,
              phase: "Submission",
              urgent: true,
              notes: "Screening round hosted on Unstop portal"
            },
            {
              id: `m-un-${Date.now()}-2`,
              title: "Problem Statement Solution Deck",
              deadline: d2,
              completed: false,
              phase: "Submission",
              notes: "Upload solution PPT/PDF on Unstop"
            },
            {
              id: `m-un-${Date.now()}-3`,
              title: "Grand Finale Presentation",
              deadline: d3,
              completed: false,
              phase: "Finale",
              notes: "Final presentation to jury"
            }
          ]
        };

        this.onImportEvent(customEvent);
        urlInput.value = '';
      };

      submitBtn.onclick = handleImport;
      urlInput.onkeydown = (e) => {
        if (e.key === 'Enter') handleImport();
      };
    }
  }
}
