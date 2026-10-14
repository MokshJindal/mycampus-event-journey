// ==========================================================================
// SurvivalModeModal Component
// Day-of-Event Live HUD: High-Focus Companion, Digital QR Pass,
// Campus Wi-Fi Quick Access, Emergency Contacts, and Interactive Checklist
// ==========================================================================

import { sound } from '../utils/audio.js';

export class SurvivalModeModal {
  constructor({ events, selectedEventId, onToggleChecklist, onClose }) {
    this.events = events;
    this.selectedEventId = selectedEventId || (events[0] ? events[0].id : null);
    this.onToggleChecklist = onToggleChecklist;
    this.onClose = onClose;
    this.timerInterval = null;
  }

  update({ events }) {
    if (events !== undefined) this.events = events;
    this.render();
  }

  getSelectedEvent() {
    return this.events.find(e => e.id === this.selectedEventId) || this.events[0];
  }

  render() {
    let modal = document.getElementById('survival-mode-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'survival-mode-modal';
      modal.className = 'fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-8 modal-overlay overflow-y-auto';
      document.body.appendChild(modal);
    }

    const event = this.getSelectedEvent();
    if (!event) {
      modal.innerHTML = `
        <div class="bg-white dark:bg-slate-900 p-8 rounded-2xl max-w-md text-center space-y-4 my-auto">
          <p class="text-sm text-slate-500">No active events found for Day-of-Event HUD.</p>
          <button id="close-empty-survival" class="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold">Close</button>
        </div>
      `;
      const btn = document.getElementById('close-empty-survival');
      if (btn) btn.onclick = () => this.close();
      return;
    }

    const nextMilestone = (event.milestones || []).find(m => !m.completed && m.deadline);
    const checklist = event.checklist || [];
    const checkDone = checklist.filter(c => c.completed).length;

    modal.innerHTML = `
      <div class="bg-slate-900 text-white rounded-2xl max-w-4xl w-full border border-slate-700 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh] transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Top HUD Navigation Bar -->
        <div class="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center space-x-3">
            <span class="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
            <div>
              <span class="text-[10px] font-mono tracking-widest uppercase text-emerald-400 font-bold">
                ● LIVE DAY-OF-EVENT HUD
              </span>
              <div class="text-xs text-slate-400 font-medium">
                Focus Companion & Emergency Desk
              </div>
            </div>
          </div>

          <!-- Switch Active Event Dropdown -->
          <div class="flex items-center space-x-2">
            <label class="text-xs text-slate-400 hidden sm:inline">Active Event:</label>
            <select id="hud-event-select" class="bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500">
              ${this.events.map(e => `
                <option value="${e.id}" ${e.id === event.id ? 'selected' : ''}>
                  ${e.title}
                </option>
              `).join('')}
            </select>

            <button id="close-hud-btn" class="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
              <i class="fas fa-xmark text-lg"></i>
            </button>
          </div>
        </div>

        <!-- Main HUD Body Grid -->
        <div class="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Col 1 & 2: Urgency Timer, Event Details, Checklist -->
          <div class="lg:col-span-2 space-y-6">
            
            <!-- Live Next Milestone Ticker -->
            <div class="bg-gradient-to-br from-slate-800/90 to-slate-900 p-5 rounded-2xl border border-slate-700/80 shadow-inner space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                  <i class="fas fa-stopwatch text-amber-400"></i>
                  <span>Next Milestone Target</span>
                </span>
                <span class="text-xs font-mono text-slate-400">
                  ${nextMilestone ? nextMilestone.phase : 'All Complete'}
                </span>
              </div>

              <div class="text-lg sm:text-xl font-bold font-display text-white">
                ${nextMilestone ? nextMilestone.title : 'Congratulations! All event milestones have been completed.'}
              </div>

              <!-- Live Countdown Display -->
              <div class="pt-1 flex items-baseline space-x-3" id="hud-live-countdown">
                <!-- Injected by startCountdown -->
              </div>

              ${nextMilestone && nextMilestone.notes ? `
                <p class="text-xs text-slate-400 italic pt-1 border-t border-slate-700/60">
                  "${nextMilestone.notes}"
                </p>
              ` : ''}
            </div>

            <!-- Packing & Submission Checklist -->
            <div class="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/80 space-y-3">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                  <i class="fas fa-list-check text-blue-400"></i>
                  <span>Pitch & Hackathon Checklist</span>
                </h4>
                <span class="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                  ${checkDone} / ${checklist.length} Ready
                </span>
              </div>

              <div class="space-y-2 pt-1">
                ${checklist.map(item => `
                  <label class="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer">
                    <input 
                      type="checkbox" 
                      data-check-id="${item.id}" 
                      ${item.completed ? 'checked' : ''}
                      class="hud-check-input mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-0 focus:ring-offset-0 bg-slate-800 border-slate-600"
                    />
                    <span class="text-xs ${item.completed ? 'line-through text-slate-500' : 'text-slate-200 font-medium'}">
                      ${item.text}
                    </span>
                  </label>
                `).join('')}
              </div>
            </div>

            <!-- Campus Essentials & Wi-Fi -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              <!-- Wi-Fi Details -->
              <div class="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/70 space-y-2">
                <div class="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span class="flex items-center space-x-1.5">
                    <i class="fas fa-wifi text-emerald-400"></i>
                    <span>Campus Wi-Fi</span>
                  </span>
                  <button id="copy-wifi-btn" data-pass="${event.venue ? event.venue.wifiPass : ''}" class="text-[10px] text-blue-400 hover:text-blue-300 font-mono">
                    Copy Pass
                  </button>
                </div>
                <div class="font-mono text-xs text-slate-400 bg-slate-900/70 p-2 rounded-lg border border-slate-800">
                  SSID: <strong class="text-white">${event.venue ? event.venue.wifiSSID : 'IIITD-Events'}</strong><br/>
                  Pass: <strong class="text-emerald-400">${event.venue ? event.venue.wifiPass : 'Campus2026'}</strong>
                </div>
              </div>

              <!-- Emergency Contact -->
              <div class="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/70 space-y-2">
                <div class="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span class="flex items-center space-x-1.5">
                    <i class="fas fa-headset text-rose-400"></i>
                    <span>Support & Medical</span>
                  </span>
                </div>
                <div class="font-mono text-xs text-slate-400 bg-slate-900/70 p-2 rounded-lg border border-slate-800">
                  Campus Control: <strong class="text-white">+91 11 2690 7400</strong><br/>
                  Medical Desk: <strong class="text-rose-400">Ext 7555 (Health Ctr)</strong>
                </div>
              </div>

            </div>

          </div>

          <!-- Col 3: Digital Event Pass & QR Badge -->
          <div class="space-y-4">
            
            <div class="bg-gradient-to-b from-blue-900/30 via-slate-800 to-slate-900 p-5 rounded-2xl border border-blue-500/40 shadow-xl space-y-4 text-center">
              
              <div class="flex items-center justify-between text-[10px] font-mono font-bold tracking-wider uppercase text-blue-400 border-b border-slate-700 pb-2">
                <span>OFFICIAL ADMIT PASS</span>
                <span class="text-amber-400">VERIFIED</span>
              </div>

              <!-- Generated Dynamic SVG QR Code -->
              <div class="w-44 h-44 bg-white p-3 rounded-2xl mx-auto shadow-inner flex flex-col items-center justify-center">
                <svg viewBox="0 0 100 100" class="w-full h-full">
                  <!-- Simulated crisp vector QR code pattern with campus crest center -->
                  <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
                  
                  <!-- Top Left Finder -->
                  <rect x="6" y="6" width="26" height="26" fill="#0f172a" rx="3" />
                  <rect x="10" y="10" width="18" height="18" fill="#ffffff" rx="1" />
                  <rect x="14" y="14" width="10" height="10" fill="#1e3a8a" rx="1" />
                  
                  <!-- Top Right Finder -->
                  <rect x="68" y="6" width="26" height="26" fill="#0f172a" rx="3" />
                  <rect x="72" y="10" width="18" height="18" fill="#ffffff" rx="1" />
                  <rect x="76" y="14" width="10" height="10" fill="#1e3a8a" rx="1" />
                  
                  <!-- Bottom Left Finder -->
                  <rect x="6" y="68" width="26" height="26" fill="#0f172a" rx="3" />
                  <rect x="10" y="72" width="18" height="18" fill="#ffffff" rx="1" />
                  <rect x="14" y="76" width="10" height="10" fill="#1e3a8a" rx="1" />

                  <!-- Random QR Data Bits -->
                  <rect x="36" y="8" width="6" height="6" fill="#0f172a" />
                  <rect x="46" y="14" width="6" height="6" fill="#0f172a" />
                  <rect x="56" y="8" width="6" height="6" fill="#0f172a" />
                  <rect x="38" y="24" width="6" height="6" fill="#0f172a" />
                  <rect x="52" y="22" width="6" height="6" fill="#0f172a" />

                  <rect x="8" y="38" width="6" height="6" fill="#0f172a" />
                  <rect x="20" y="44" width="6" height="6" fill="#0f172a" />
                  <rect x="12" y="52" width="6" height="6" fill="#0f172a" />

                  <!-- Center Badge -->
                  <rect x="42" y="42" width="16" height="16" fill="#d97706" rx="3" />
                  <path d="M50 45 L54 55 L46 55 Z" fill="#ffffff" />

                  <!-- Bottom Right Data -->
                  <rect x="40" y="68" width="6" height="6" fill="#0f172a" />
                  <rect x="52" y="72" width="6" height="6" fill="#0f172a" />
                  <rect x="64" y="64" width="6" height="6" fill="#0f172a" />
                  <rect x="76" y="52" width="6" height="6" fill="#0f172a" />
                  <rect x="86" y="44" width="6" height="6" fill="#0f172a" />
                  <rect x="72" y="76" width="6" height="6" fill="#0f172a" />
                  <rect x="84" y="84" width="6" height="6" fill="#0f172a" />
                </svg>
              </div>

              <!-- Attendee Pass Credentials -->
              <div class="space-y-1">
                <div class="font-display font-bold text-base text-white">
                  Moksh Jindal
                </div>
                <div class="text-xs text-blue-300 font-mono">
                  Roll: 2023BCS-042 • Team ${event.teamName || 'Solo'}
                </div>
                <div class="text-[11px] text-slate-400 font-mono">
                  ${event.registrationId || 'REG-ACTIVE'}
                </div>
              </div>

              <!-- Barcode Graphic -->
              <div class="pt-2 border-t border-slate-800">
                <div class="h-8 bg-slate-950 p-1 rounded flex items-center justify-center space-x-1">
                  <span class="w-1 h-5 bg-white"></span>
                  <span class="w-0.5 h-5 bg-white"></span>
                  <span class="w-2 h-5 bg-white"></span>
                  <span class="w-0.5 h-5 bg-white"></span>
                  <span class="w-1 h-5 bg-white"></span>
                  <span class="w-3 h-5 bg-white"></span>
                  <span class="w-0.5 h-5 bg-white"></span>
                  <span class="w-1.5 h-5 bg-white"></span>
                  <span class="w-2 h-5 bg-white"></span>
                  <span class="w-0.5 h-5 bg-white"></span>
                  <span class="w-1 h-5 bg-white"></span>
                  <span class="w-2.5 h-5 bg-white"></span>
                </div>
                <div class="text-[9px] font-mono text-slate-500 mt-1">
                  SCAN AT DESK FOR FOOD & VENUE ENTRY
                </div>
              </div>

            </div>

            <!-- Offline Pass Note -->
            <div class="text-center text-[11px] text-slate-400">
              <i class="fas fa-shield-cat mr-1 text-emerald-400"></i>
              Pass valid offline without active cellular connection.
            </div>

          </div>

        </div>

      </div>
    `;

    this.attachEvents(nextMilestone);
    this.startCountdown(nextMilestone);
  }

  startCountdown(nextMilestone) {
    if (this.timerInterval) clearInterval(this.timerInterval);

    const updateTimer = () => {
      const container = document.getElementById('hud-live-countdown');
      if (!container) return;

      if (!nextMilestone || !nextMilestone.deadline) {
        container.innerHTML = `<span class="text-emerald-400 text-sm font-semibold">Stage Complete</span>`;
        return;
      }

      const diffMs = new Date(nextMilestone.deadline) - new Date();
      if (diffMs <= 0) {
        container.innerHTML = `<span class="text-rose-400 text-sm font-bold animate-pulse">Deadline Reached</span>`;
        return;
      }

      const totalSec = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSec / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;
      const pad = (n) => String(n).padStart(2, '0');

      container.innerHTML = `
        <div class="flex items-center space-x-2 font-mono text-2xl sm:text-3xl font-extrabold text-amber-400">
          <div class="bg-slate-950 px-3 py-1.5 rounded-xl border border-amber-500/30">${pad(hours)}<span class="text-xs text-slate-400 block font-sans">hours</span></div>
          <span>:</span>
          <div class="bg-slate-950 px-3 py-1.5 rounded-xl border border-amber-500/30">${pad(minutes)}<span class="text-xs text-slate-400 block font-sans">mins</span></div>
          <span>:</span>
          <div class="bg-slate-950 px-3 py-1.5 rounded-xl border border-amber-500/30">${pad(seconds)}<span class="text-xs text-slate-400 block font-sans">secs</span></div>
        </div>
      `;
    };

    updateTimer();
    this.timerInterval = setInterval(updateTimer, 1000);
  }

  attachEvents(nextMilestone) {
    // Close button
    const closeBtn = document.getElementById('close-hud-btn');
    if (closeBtn) closeBtn.onclick = () => this.close();

    // Event select switcher
    const select = document.getElementById('hud-event-select');
    if (select) {
      select.onchange = (e) => {
        sound.playClick();
        this.selectedEventId = e.target.value;
        this.render();
      };
    }

    // Checkbox toggles
    document.querySelectorAll('.hud-check-input').forEach(box => {
      box.onchange = (e) => {
        const checkId = box.getAttribute('data-check-id');
        sound.playSuccess();
        this.onToggleChecklist(this.selectedEventId, checkId);
      };
    });

    // Copy Wi-Fi button
    const copyBtn = document.getElementById('copy-wifi-btn');
    if (copyBtn) {
      copyBtn.onclick = () => {
        const pass = copyBtn.getAttribute('data-pass');
        if (navigator.clipboard && pass) {
          navigator.clipboard.writeText(pass);
          sound.playSuccess();
          copyBtn.innerText = 'Copied!';
          setTimeout(() => (copyBtn.innerText = 'Copy Pass'), 2000);
        }
      };
    }
  }

  close() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    sound.playClick();
    const modal = document.getElementById('survival-mode-modal');
    if (modal) modal.remove();
    this.onClose();
  }
}
