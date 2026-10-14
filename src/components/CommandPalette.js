// ==========================================================================
// CommandPalette Component
// Global Cmd+K Keyboard Omnibar for Lightning Fast Search & Navigation
// ==========================================================================

import { sound } from '../utils/audio.js';

export class CommandPalette {
  constructor({ events, onAction, onClose }) {
    this.events = events;
    this.onAction = onAction;
    this.onClose = onClose;
    this.query = "";
    this.selectedIndex = 0;
  }

  getFilteredItems() {
    const q = this.query.toLowerCase().trim();

    const staticActions = [
      { id: 'act-unstop', title: 'Unstop Competition Plugin: Ingest Challenges & Multi-Round Milestones', category: 'Action', icon: 'fa-bolt', action: () => this.onAction('unstop-plugin') },
      { id: 'act-smart', title: 'AI Smart Ingest: Paste Confirmation Email', category: 'Action', icon: 'fa-wand-magic-sparkles', action: () => this.onAction('smart-ingest') },
      { id: 'act-add', title: 'Add New Event Journey', category: 'Action', icon: 'fa-plus', action: () => this.onAction('new-event') },
      { id: 'act-survival', title: 'Day-of-Event Survival Mode (Live HUD & Pass)', category: 'Focus', icon: 'fa-bolt', action: () => this.onAction('survival-mode') },
      { id: 'act-map', title: 'Interactive Campus Map & Building Wayfinder', category: 'Navigation', icon: 'fa-map-location-dot', action: () => this.onAction('campus-map') },
      { id: 'act-passport', title: 'Student Passport & Resume Brag Sheet', category: 'Profile', icon: 'fa-id-card-clip', action: () => this.onAction('passport') },
      { id: 'act-discover', title: 'Discover Campus Opportunities Catalog', category: 'Explore', icon: 'fa-compass', action: () => this.onAction('discover') },
      { id: 'act-ics', title: 'Export All Events to Calendar (.ICS)', category: 'Sync', icon: 'fa-calendar-plus', action: () => this.onAction('export-ics') },
      { id: 'act-view-timeline', title: 'Switch View: Journey Timeline', category: 'View', icon: 'fa-stream', action: () => this.onAction('view-timeline') },
      { id: 'act-view-calendar', title: 'Switch View: Calendar', category: 'View', icon: 'fa-calendar-alt', action: () => this.onAction('view-calendar') },
      { id: 'act-view-kanban', title: 'Switch View: Pipeline Kanban', category: 'View', icon: 'fa-columns', action: () => this.onAction('view-kanban') },
      { id: 'act-view-clash', title: 'Switch View: Clash & Overlap Radar', category: 'View', icon: 'fa-satellite-dish', action: () => this.onAction('view-clash-radar') },
      { id: 'act-theme', title: 'Toggle Light / Dark Mode', category: 'System', icon: 'fa-circle-half-stroke', action: () => this.onAction('toggle-theme') },
      { id: 'act-sound', title: 'Toggle Audio Feedback', category: 'System', icon: 'fa-volume-high', action: () => this.onAction('toggle-sound') }
    ];

    const eventItems = this.events.map(e => ({
      id: `evt-${e.id}`,
      title: `${e.title} (${e.category})`,
      category: 'Event',
      icon: 'fa-calendar-check',
      action: () => this.onAction('select-event', e.id)
    }));

    const all = [...staticActions, ...eventItems];

    if (!q) return all;

    return all.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.category.toLowerCase().includes(q)
    );
  }

  render() {
    let modal = document.getElementById('cmd-palette-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'cmd-palette-modal';
      modal.className = 'fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 modal-overlay';
      document.body.appendChild(modal);
    }

    const items = this.getFilteredItems();
    if (this.selectedIndex >= items.length) {
      this.selectedIndex = Math.max(0, items.length - 1);
    }

    modal.innerHTML = `
      <div class="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Search Input -->
        <div class="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <i class="fas fa-search text-slate-400 text-sm"></i>
          <input 
            type="text" 
            id="cmd-input" 
            value="${this.query}" 
            placeholder="Type a command or search events... (Esc to close)"
            class="w-full text-sm bg-transparent border-0 focus:outline-none text-slate-900 dark:text-white placeholder-slate-400 font-medium"
            autofocus
          />
          <kbd class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-500">ESC</kbd>
        </div>

        <!-- Filtered Items List -->
        <div class="max-h-80 overflow-y-auto p-2 space-y-1" id="cmd-items-list">
          ${items.length === 0 ? `
            <div class="py-8 text-center text-xs text-slate-400">
              No matching actions or events found.
            </div>
          ` : items.map((item, idx) => `
            <div 
              data-cmd-idx="${idx}"
              class="cmd-item p-2.5 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-colors ${
                idx === this.selectedIndex 
                  ? 'bg-blue-600 text-white font-semibold' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }"
            >
              <div class="flex items-center space-x-2.5 truncate">
                <i class="fas ${item.icon} text-xs w-4 text-center ${idx === this.selectedIndex ? 'text-white' : 'text-slate-400'}"></i>
                <span class="truncate">${item.title}</span>
              </div>
              <span class="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded ${
                idx === this.selectedIndex 
                  ? 'bg-blue-700 text-white' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }">
                ${item.category}
              </span>
            </div>
          `).join('')}
        </div>

        <div class="p-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate: <strong>↑</strong> <strong>↓</strong></span>
          <span>Execute: <strong>↵ Enter</strong></span>
        </div>

      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const input = document.getElementById('cmd-input');
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);

      input.oninput = (e) => {
        this.query = e.target.value;
        this.selectedIndex = 0;
        this.render();
      };

      input.onkeydown = (e) => {
        const items = this.getFilteredItems();
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.selectedIndex = (this.selectedIndex + 1) % Math.max(1, items.length);
          this.render();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.selectedIndex = (this.selectedIndex - 1 + items.length) % Math.max(1, items.length);
          this.render();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (items[this.selectedIndex]) {
            sound.playClick();
            items[this.selectedIndex].action();
            this.close();
          }
        } else if (e.key === 'Escape') {
          this.close();
        }
      };
    }

    document.querySelectorAll('.cmd-item').forEach(item => {
      item.onclick = () => {
        const idx = parseInt(item.getAttribute('data-cmd-idx'), 10);
        const items = this.getFilteredItems();
        if (items[idx]) {
          sound.playClick();
          items[idx].action();
          this.close();
        }
      };
    });

    const modal = document.getElementById('cmd-palette-modal');
    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) this.close();
      };
    }
  }

  close() {
    const modal = document.getElementById('cmd-palette-modal');
    if (modal) modal.remove();
    this.onClose();
  }
}
