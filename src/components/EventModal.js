// ==========================================================================
// EventModal Component
// Full Event Add / Edit Dialog with Dynamic Multi-Milestone Builder
// ==========================================================================

import { CAMPUS_BUILDINGS } from '../data/initialData.js';

export class EventModal {
  constructor({ event, onSave, onClose }) {
    this.event = event || this.getDefaultEvent();
    this.isEditing = !!event;
    this.onSave = onSave;
    this.onClose = onClose;
    this.milestones = JSON.parse(JSON.stringify(this.event.milestones || []));
  }

  getDefaultEvent() {
    return {
      id: `evt-${Date.now()}`,
      title: "",
      category: "Hackathon",
      platform: "Devpost",
      stage: "registered",
      registrationId: `REG-${Math.floor(100000 + Math.random() * 900000)}`,
      teamName: "ByteCoders",
      teamMembers: [
        { name: "Moksh Jindal", role: "Team Lead", avatar: "MJ" },
        { name: "Aarav Sharma", role: "Member", avatar: "AS" }
      ],
      venue: {
        building: "R&D Block",
        room: "3rd Floor Audi",
        campusZone: "North Campus",
        wifiSSID: "IIITD-Events-5G",
        wifiPass: "QuantumHack2026!"
      },
      color: "#3b82f6",
      prizePool: "₹1,00,000",
      xpReward: 300,
      description: "",
      checklist: [
        { id: `chk-${Date.now()}-1`, text: "Review problem statement", completed: true },
        { id: `chk-${Date.now()}-2`, text: "Finalize solution pitch deck", completed: false }
      ],
      milestones: [
        {
          id: `m-${Date.now()}-1`,
          title: "Team Registration",
          deadline: "2026-10-18T18:00:00",
          completed: true,
          phase: "Registration",
          location: "Online Portal",
          notes: "Confirmed entry."
        },
        {
          id: `m-${Date.now()}-2`,
          title: "Round 1 Proposal Submission",
          deadline: "2026-10-24T23:59:00",
          completed: false,
          phase: "Submission",
          location: "R&D Block",
          notes: "Submit 5-slide PDF."
        }
      ]
    };
  }

  render() {
    let modal = document.getElementById('event-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'event-modal';
      modal.className = 'fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-8 modal-overlay overflow-y-auto';
      document.body.appendChild(modal);
    }

    const categories = ['Hackathon', 'Workshop', 'Conference', 'Competition', 'Cultural'];
    const platforms = ['Devpost', 'Unstop', 'Luma', 'Devfolio', 'EasyChair', 'Campus Portal', 'Google Form'];

    modal.innerHTML = `
      <div class="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh] transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Header -->
        <div class="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/95 dark:bg-slate-900/95 sticky top-0 z-10">
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm shadow-xs">
              <i class="fas ${this.isEditing ? 'fa-pen-to-square' : 'fa-plus'}"></i>
            </div>
            <div>
              <h3 class="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                ${this.isEditing ? 'Edit Event Journey' : 'Create New Event Journey'}
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Configure event details, campus venue waypoint, and multi-phase milestones.
              </p>
            </div>
          </div>

          <button id="close-event-modal" class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold border border-slate-300 dark:border-slate-700 flex items-center space-x-1 transition-colors">
            <i class="fas fa-xmark"></i>
            <span>Close</span>
          </button>
        </div>

        <!-- Form Body -->
        <form id="event-form" class="p-6 space-y-5 max-h-[72vh] overflow-y-auto">
          
          <!-- Event Title -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Event Title *
            </label>
            <input 
              type="text" 
              id="f-title" 
              required
              value="${this.event.title || ''}" 
              placeholder="e.g. HackIIITD 2026: Quantum Leap" 
              class="w-full text-xs font-medium p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>

          <!-- Category, Platform, and Color Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select id="f-category" class="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">
                ${categories.map(c => `
                  <option value="${c}" ${this.event.category === c ? 'selected' : ''}>${c}</option>
                `).join('')}
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Platform Source
              </label>
              <select id="f-platform" class="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">
                ${platforms.map(p => `
                  <option value="${p}" ${this.event.platform === p ? 'selected' : ''}>${p}</option>
                `).join('')}
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Theme Color
              </label>
              <div class="flex items-center space-x-2">
                <input 
                  type="color" 
                  id="f-color" 
                  value="${this.event.color || '#3b82f6'}" 
                  class="w-9 h-9 p-0.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer"
                />
                <span class="text-xs text-slate-400 font-mono">Accent</span>
              </div>
            </div>

          </div>

          <!-- Registration ID, Team Name & Prize -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Registration ID / Code
              </label>
              <input 
                type="text" 
                id="f-reg-id" 
                value="${this.event.registrationId || ''}" 
                placeholder="REG-8921"
                class="w-full text-xs font-mono p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Team Name
              </label>
              <input 
                type="text" 
                id="f-team" 
                value="${this.event.teamName || ''}" 
                placeholder="e.g. ByteCoders"
                class="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Prize Pool / Honors
              </label>
              <input 
                type="text" 
                id="f-prize" 
                value="${this.event.prizePool || ''}" 
                placeholder="₹1,00,000"
                class="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <!-- Campus Venue -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Campus Building
              </label>
              <select id="f-venue-building" class="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">
                ${CAMPUS_BUILDINGS.map(b => `
                  <option value="${b.name}" ${this.event.venue && this.event.venue.building === b.name ? 'selected' : ''}>
                    ${b.name} (${b.code})
                  </option>
                `).join('')}
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Room / Lab / Floor
              </label>
              <input 
                type="text" 
                id="f-venue-room" 
                value="${(this.event.venue && this.event.venue.room) || ''}" 
                placeholder="e.g. 3rd Floor Audi & B-Wing Labs"
                class="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description / Problem Statement
            </label>
            <textarea 
              id="f-desc" 
              rows="2" 
              placeholder="Brief description of the event or track..."
              class="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            >${this.event.description || ''}</textarea>
          </div>

          <!-- Dynamic Multi-Milestones Builder -->
          <div class="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Event Milestones Timeline
                </h4>
                <p class="text-[11px] text-slate-400">Add all registration, submission, and final pitch dates.</p>
              </div>

              <button type="button" id="btn-add-milestone" class="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-semibold text-xs rounded-lg border border-blue-200 dark:border-blue-800 flex items-center space-x-1 transition-colors">
                <i class="fas fa-plus text-xs"></i>
                <span>Add Milestone</span>
              </button>
            </div>

            <div id="milestones-builder-container" class="space-y-3">
              ${this.renderMilestonesList()}
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end space-x-3">
            <button type="button" id="btn-cancel-modal" class="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all">
              ${this.isEditing ? 'Save Changes' : 'Create Event'}
            </button>
          </div>

        </form>

      </div>
    `;

    this.attachEvents();
  }

  renderMilestonesList() {
    return this.milestones.map((m, idx) => `
      <div class="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 relative" data-ms-idx="${idx}">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-mono font-bold uppercase text-slate-400">Milestone #${idx + 1}</span>
          ${this.milestones.length > 1 ? `
            <button type="button" data-action="remove-ms" data-idx="${idx}" class="text-rose-500 hover:text-rose-700 text-xs">
              <i class="fas fa-trash-can"></i>
            </button>
          ` : ''}
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div class="sm:col-span-2">
            <input 
              type="text" 
              data-field="title" 
              data-idx="${idx}"
              value="${m.title || ''}" 
              placeholder="Milestone title, e.g. Abstract Submission" 
              required
              class="w-full text-xs p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <select data-field="phase" data-idx="${idx}" class="w-full text-xs p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">
              <option value="Registration" ${m.phase === 'Registration' ? 'selected' : ''}>Registration</option>
              <option value="Submission" ${m.phase === 'Submission' ? 'selected' : ''}>Submission</option>
              <option value="Shortlist" ${m.phase === 'Shortlist' ? 'selected' : ''}>Shortlist</option>
              <option value="Mentorship" ${m.phase === 'Mentorship' ? 'selected' : ''}>Mentorship</option>
              <option value="Finale" ${m.phase === 'Finale' ? 'selected' : ''}>Finale / Pitch</option>
              <option value="Certificate" ${m.phase === 'Certificate' ? 'selected' : ''}>Certificate</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <input 
              type="datetime-local" 
              data-field="deadline" 
              data-idx="${idx}"
              value="${m.deadline ? m.deadline.slice(0, 16) : '2026-10-20T18:00'}" 
              required
              class="w-full text-xs font-mono p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <input 
              type="text" 
              data-field="notes" 
              data-idx="${idx}"
              value="${m.notes || ''}" 
              placeholder="Notes or submission link" 
              class="w-full text-xs p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>
    `).join('');
  }

  attachEvents() {
    const closeBtn = document.getElementById('close-event-modal');
    if (closeBtn) closeBtn.onclick = () => this.close();

    const cancelBtn = document.getElementById('btn-cancel-modal');
    if (cancelBtn) cancelBtn.onclick = () => this.close();

    // Add milestone
    const addMsBtn = document.getElementById('btn-add-milestone');
    if (addMsBtn) {
      addMsBtn.onclick = () => {
        this.saveCurrentInputs();
        this.milestones.push({
          id: `m-${Date.now()}-${this.milestones.length + 1}`,
          title: "",
          deadline: "2026-10-25T18:00:00",
          completed: false,
          phase: "Submission",
          location: "Campus",
          notes: ""
        });
        const container = document.getElementById('milestones-builder-container');
        if (container) {
          container.innerHTML = this.renderMilestonesList();
          this.attachMilestoneInputListeners();
        }
      };
    }

    this.attachMilestoneInputListeners();

    // Form submit
    const form = document.getElementById('event-form');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        this.saveCurrentInputs();

        const title = document.getElementById('f-title').value.trim();
        const category = document.getElementById('f-category').value;
        const platform = document.getElementById('f-platform').value;
        const color = document.getElementById('f-color').value;
        const registrationId = document.getElementById('f-reg-id').value.trim() || `REG-${Date.now()}`;
        const teamName = document.getElementById('f-team').value.trim() || 'Solo';
        const prizePool = document.getElementById('f-prize').value.trim();
        const building = document.getElementById('f-venue-building').value;
        const room = document.getElementById('f-venue-room').value.trim() || 'Main Hall';
        const description = document.getElementById('f-desc').value.trim();

        const updatedEvent = {
          ...this.event,
          title,
          category,
          platform,
          color,
          registrationId,
          teamName,
          prizePool,
          description,
          venue: {
            ...this.event.venue,
            building,
            room
          },
          milestones: this.milestones
        };

        this.onSave(updatedEvent);
        this.close();
      };
    }
  }

  saveCurrentInputs() {
    document.querySelectorAll('[data-field]').forEach(input => {
      const idx = parseInt(input.getAttribute('data-idx'), 10);
      const field = input.getAttribute('data-field');
      if (this.milestones[idx]) {
        this.milestones[idx][field] = input.value;
      }
    });
  }

  attachMilestoneInputListeners() {
    document.querySelectorAll('[data-action="remove-ms"]').forEach(btn => {
      btn.onclick = () => {
        this.saveCurrentInputs();
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        this.milestones.splice(idx, 1);
        const container = document.getElementById('milestones-builder-container');
        if (container) {
          container.innerHTML = this.renderMilestonesList();
          this.attachMilestoneInputListeners();
        }
      };
    });
  }

  close() {
    const modal = document.getElementById('event-modal');
    if (modal) modal.remove();
    this.onClose();
  }
}
