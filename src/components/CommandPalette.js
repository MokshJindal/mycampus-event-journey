// ==========================================================================
// CommandPalette Component
// Fast Keyboard Omnibar (Cmd+K) for Instant Event Search & Navigation
// ==========================================================================

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
      { id: 'act-view-timeline', title: 'Timeline: View Event Journey', category: 'Navigation', icon: 'fa-stream', action: () => this.onAction('view-timeline') },
      { id: 'act-view-calendar', title: 'Calendar: View Axes & Schedule', category: 'Navigation', icon: 'fa-calendar-alt', action: () => this.onAction('view-calendar') },
      { id: 'act-view-unstop', title: 'Unstop Hub: Explore Competitions & Rounds', category: 'Navigation', icon: 'fa-bolt', action: () => this.onAction('view-unstop') },
      { id: 'act-add', title: 'Add New Event', category: 'Action', icon: 'fa-plus', action: () => this.onAction('new-event') },
      { id: 'act-ics', title: 'Export All Events to Calendar (.ics)', category: 'Export', icon: 'fa-calendar-plus', action: () => this.onAction('export-ics') },
      { id: 'act-theme', title: 'Toggle Light / Dark Mode', category: 'Preferences', icon: 'fa-circle-half-stroke', action: () => this.onAction('toggle-theme') }
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
      <div class="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Search Input -->
        <div class="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <i class="fas fa-search text-slate-400 text-sm"></i>
          <input 
            type="text" 
            id="cmd-input" 
            value="${this.query}" 
            placeholder="Search events, competitions, or actions... (Esc to close)"
            class="w-full text-sm bg-transparent border-0 focus:outline-none text-slate-900 dark:text-white placeholder-slate-400 font-medium"
            autofocus
          />
          <kbd class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-500">ESC</kbd>
        </div>

        <!-- Filtered Items List -->
        <div class="max-h-80 overflow-y-auto p-2 space-y-1" id="cmd-items-list">
          ${items.length === 0 ? `
            <div class="py-8 text-center text-xs text-slate-400">
              No matching events or actions found.
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
              <span class="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                idx === this.selectedIndex 
                  ? 'bg-blue-700 text-white' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }">
                ${item.category}
              </span>
            </div>
          `).join('')}
        </div>

        <div class="p-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Navigate: <strong>↑</strong> <strong>↓</strong></span>
          <span>Select: <strong>↵ Enter</strong></span>
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
