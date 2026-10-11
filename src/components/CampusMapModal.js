// ==========================================================================
// CampusMapModal Component
// Interactive SVG Campus Blueprint, Building Event Pins,
// Walking Distances, and Venue Wayfinder
// ==========================================================================

import { sound } from '../utils/audio.js';
import { CAMPUS_BUILDINGS } from '../data/initialData.js';

export class CampusMapModal {
  constructor({ events, selectedBuildingCode, onClose, onSelectEvent }) {
    this.events = events;
    this.selectedBuilding = CAMPUS_BUILDINGS.find(b => b.name === selectedBuildingCode) || CAMPUS_BUILDINGS[0];
    this.onClose = onClose;
    this.onSelectEvent = onSelectEvent;
    this.fromBuildingId = this.selectedBuilding.id;
    this.toBuildingId = 'b-oab';
  }

  render() {
    let modal = document.getElementById('campus-map-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'campus-map-modal';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay overflow-y-auto';
      document.body.appendChild(modal);
    }

    const currentEvents = this.events.filter(e => e.venue && e.venue.building === this.selectedBuilding.name);

    modal.innerHTML = `
      <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-5xl w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden my-6 transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Header -->
        <div class="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-900/10 via-blue-900/10 to-transparent">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center text-lg shadow-md">
              <i class="fas fa-map-location-dot"></i>
            </div>
            <div>
              <h3 class="font-serif-classic font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
                Interactive Campus Blueprint & Wayfinder
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Pinpoint event venues, check walking buffers, and plan transitions between campus blocks.
              </p>
            </div>
          </div>

          <button id="close-map-modal" class="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <i class="fas fa-xmark text-lg"></i>
          </button>
        </div>

        <!-- Map & Details Grid -->
        <div class="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Left 2 Cols: Interactive SVG Campus Map -->
          <div class="lg:col-span-2 bg-slate-900 rounded-2xl p-4 border border-slate-800 relative overflow-hidden shadow-inner flex flex-col justify-between">
            
            <div class="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
              <span class="flex items-center space-x-1.5 text-emerald-400 font-mono font-semibold">
                <i class="fas fa-satellite"></i>
                <span>IIIT Delhi Campus Grid • Interactive Blueprint</span>
              </span>
              <span>Click any building block to inspect</span>
            </div>

            <!-- SVG Campus Canvas -->
            <div class="relative py-4 flex items-center justify-center">
              <svg viewBox="0 0 800 580" class="w-full h-auto max-h-[380px] drop-shadow-xl select-none">
                <!-- Campus Boundary & Lawns -->
                <rect x="20" y="20" width="760" height="540" rx="30" fill="#0b1329" stroke="#1e293b" stroke-width="3" />
                
                <!-- Central Quad Green Lawn -->
                <circle cx="430" cy="270" r="140" fill="#064e3b" opacity="0.35" />
                <circle cx="430" cy="270" r="90" fill="#064e3b" opacity="0.5" />

                <!-- Walkway Pathways -->
                <path d="M 310 160 L 490 190 L 620 340 L 550 470 L 210 280 Z" fill="none" stroke="#334155" stroke-dasharray="6 6" stroke-width="2" />
                <path d="M 310 160 L 420 310 L 490 190" fill="none" stroke="#475569" stroke-width="2.5" />
                <path d="M 420 310 L 550 470" fill="none" stroke="#475569" stroke-width="2.5" />
                <path d="M 210 280 L 310 160" fill="none" stroke="#475569" stroke-width="2.5" />

                <!-- Skywalk indicator between R&D and OAB -->
                <line x1="330" y1="165" x2="470" y2="185" stroke="#38bdf8" stroke-width="3" opacity="0.8" />
                <text x="375" y="165" fill="#38bdf8" font-size="10" font-family="monospace">Skywalk (3 min)</text>

                <!-- Buildings Pins & Nodes -->
                ${CAMPUS_BUILDINGS.map(b => {
                  const isSelected = this.selectedBuilding.id === b.id;
                  const bEvents = this.events.filter(e => e.venue && e.venue.building === b.name);
                  const hasActiveEvents = bEvents.length > 0;

                  return `
                    <g class="cursor-pointer map-building-node" data-building-id="${b.id}">
                      <!-- Shadow glow if selected -->
                      ${isSelected ? `
                        <circle cx="${b.coords.x}" cy="${b.coords.y}" r="46" fill="#3b82f6" opacity="0.25" class="animate-pulse" />
                      ` : ''}

                      <!-- Building Block Base -->
                      <rect 
                        x="${b.coords.x - 48}" 
                        y="${b.coords.y - 28}" 
                        width="96" 
                        height="56" 
                        rx="12" 
                        fill="${isSelected ? '#1e3a8a' : (hasActiveEvents ? '#1e293b' : '#0f172a')}" 
                        stroke="${isSelected ? '#60a5fa' : (hasActiveEvents ? '#10b981' : '#334155')}" 
                        stroke-width="${isSelected ? '3' : '2'}" 
                      />

                      <!-- Building Code -->
                      <text 
                        x="${b.coords.x}" 
                        y="${b.coords.y - 5}" 
                        text-anchor="middle" 
                        fill="#ffffff" 
                        font-family="sans-serif" 
                        font-weight="bold" 
                        font-size="13"
                      >${b.code}</text>

                      <!-- Subtitle -->
                      <text 
                        x="${b.coords.x}" 
                        y="${b.coords.y + 13}" 
                        text-anchor="middle" 
                        fill="${isSelected ? '#93c5fd' : '#94a3b8'}" 
                        font-family="sans-serif" 
                        font-size="9"
                      >${b.name.slice(0, 14)}</text>

                      <!-- Active Event Badge Dot -->
                      ${hasActiveEvents ? `
                        <circle cx="${b.coords.x + 40}" cy="${b.coords.y - 22}" r="7" fill="#10b981" />
                        <text x="${b.coords.x + 40}" y="${b.coords.y - 19}" text-anchor="middle" fill="#ffffff" font-size="8" font-weight="bold">${bEvents.length}</text>
                      ` : ''}
                    </g>
                  `;
                }).join('')}

              </svg>
            </div>

            <!-- Legend -->
            <div class="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <div class="flex items-center space-x-3">
                <span class="flex items-center space-x-1">
                  <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span>Selected Building</span>
                </span>
                <span class="flex items-center space-x-1">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>Active Events Hosted</span>
                </span>
              </div>
              <span class="font-mono text-slate-500">Scale: 1:1500 Campus Quad</span>
            </div>

          </div>

          <!-- Right Col: Selected Building Details & Commute Estimator -->
          <div class="space-y-4">
            
            <!-- Selected Building Info -->
            <div class="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div class="flex items-start justify-between">
                <div>
                  <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Campus Block Details
                  </span>
                  <h4 class="font-serif-classic font-bold text-lg text-slate-900 dark:text-white">
                    ${this.selectedBuilding.name}
                  </h4>
                </div>
                <span class="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                  ${this.selectedBuilding.code}
                </span>
              </div>

              <p class="text-xs text-slate-600 dark:text-slate-300">
                ${this.selectedBuilding.description}
              </p>

              <!-- Facilities Chips -->
              <div class="space-y-1.5 pt-1">
                <span class="text-[10px] uppercase font-bold text-slate-400">Key Venues & Facilities:</span>
                <div class="flex flex-wrap gap-1">
                  ${(this.selectedBuilding.facilities || []).map(f => `
                    <span class="text-[10px] px-2 py-0.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700">
                      ${f}
                    </span>
                  `).join('')}
                </div>
              </div>

              <!-- Events scheduled here -->
              <div class="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-slate-800 dark:text-slate-200">Events at this Venue:</span>
                  <span class="font-mono text-[11px] font-bold text-blue-600">${currentEvents.length}</span>
                </div>

                ${currentEvents.length === 0 ? `
                  <p class="text-xs text-slate-400 italic">No events currently scheduled in this building.</p>
                ` : `
                  <div class="space-y-2">
                    ${currentEvents.map(evt => `
                      <div class="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                        <div>
                          <div class="font-bold text-slate-900 dark:text-white">${evt.title}</div>
                          <div class="text-[11px] text-slate-500">${evt.venue.room || 'Main Hall'}</div>
                        </div>
                        <span class="px-1.5 py-0.2 rounded text-[10px] uppercase font-bold text-white" style="background-color: ${evt.color || '#3b82f6'};">
                          ${evt.category}
                        </span>
                      </div>
                    `).join('')}
                  </div>
                `}
              </div>

            </div>

            <!-- Commute Estimator Widget -->
            <div class="bg-blue-50/60 dark:bg-blue-950/30 p-4 rounded-2xl border border-blue-200 dark:border-blue-900/60 space-y-3">
              <div class="flex items-center space-x-2 text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider">
                <i class="fas fa-person-walking text-blue-600 dark:text-blue-400"></i>
                <span>Walking Transition Calculator</span>
              </div>

              <div class="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label class="block text-[10px] text-slate-500 font-semibold mb-1">From:</label>
                  <select id="select-from-building" class="w-full p-1.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg border border-slate-300 dark:border-slate-700 text-xs">
                    ${CAMPUS_BUILDINGS.map(b => `
                      <option value="${b.id}" ${b.id === this.fromBuildingId ? 'selected' : ''}>${b.name}</option>
                    `).join('')}
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] text-slate-500 font-semibold mb-1">To:</label>
                  <select id="select-to-building" class="w-full p-1.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg border border-slate-300 dark:border-slate-700 text-xs">
                    ${CAMPUS_BUILDINGS.map(b => `
                      <option value="${b.id}" ${b.id === this.toBuildingId ? 'selected' : ''}>${b.name}</option>
                    `).join('')}
                  </select>
                </div>
              </div>

              <div class="p-3 bg-white dark:bg-slate-800 rounded-xl border border-blue-200 dark:border-blue-900 flex items-center justify-between text-xs" id="commute-result-box">
                ${this.renderCommuteResult()}
              </div>

            </div>

          </div>

        </div>

      </div>
    `;

    this.attachEvents();
  }

  renderCommuteResult() {
    const fromB = CAMPUS_BUILDINGS.find(b => b.id === this.fromBuildingId);
    const toB = CAMPUS_BUILDINGS.find(b => b.id === this.toBuildingId);

    if (this.fromBuildingId === this.toBuildingId) {
      return `
        <span class="text-slate-500">Same building: 0 min walking</span>
        <span class="font-bold text-emerald-600 font-mono">Immediate</span>
      `;
    }

    const dist = (fromB && fromB.walkingDistances && fromB.walkingDistances[this.toBuildingId]) || '4 mins';

    return `
      <div class="flex items-center space-x-2">
        <i class="fas fa-shoe-prints text-blue-600 dark:text-blue-400"></i>
        <span class="text-slate-700 dark:text-slate-300">Transit Duration:</span>
      </div>
      <div class="font-mono font-bold text-blue-700 dark:text-blue-400 text-sm">
        ${dist} via Campus Quad
      </div>
    `;
  }

  attachEvents() {
    const closeBtn = document.getElementById('close-map-modal');
    if (closeBtn) closeBtn.onclick = () => this.close();

    // Node click
    document.querySelectorAll('.map-building-node').forEach(node => {
      node.onclick = () => {
        const id = node.getAttribute('data-building-id');
        const b = CAMPUS_BUILDINGS.find(item => item.id === id);
        if (b) {
          sound.playClick();
          this.selectedBuilding = b;
          this.fromBuildingId = b.id;
          this.render();
        }
      };
    });

    // Selectors
    const selFrom = document.getElementById('select-from-building');
    const selTo = document.getElementById('select-to-building');

    if (selFrom) {
      selFrom.onchange = (e) => {
        this.fromBuildingId = e.target.value;
        const resBox = document.getElementById('commute-result-box');
        if (resBox) resBox.innerHTML = this.renderCommuteResult();
      };
    }

    if (selTo) {
      selTo.onchange = (e) => {
        this.toBuildingId = e.target.value;
        const resBox = document.getElementById('commute-result-box');
        if (resBox) resBox.innerHTML = this.renderCommuteResult();
      };
    }
  }

  close() {
    sound.playClick();
    const modal = document.getElementById('campus-map-modal');
    if (modal) modal.remove();
    this.onClose();
  }
}
