// ==========================================================================
// Main Application State Orchestrator
// Pure, Clean, Intuitive: Timeline, Calendar, and Unstop Hub
// Includes Student Profile & Campus Ranking Hub (#4 IIIT Delhi)
// ==========================================================================

import { StorageManager } from './utils/storage.js';
import { ICSExporter } from './utils/icsExporter.js';
import { Navbar } from './components/Navbar.js';
import { HeroStats } from './components/HeroStats.js';
import { TimelineView } from './components/TimelineView.js';
import { CalendarView } from './components/CalendarView.js';
import { UnstopHubView } from './components/UnstopHubView.js';
import { EventModal } from './components/EventModal.js';
import { ProfileModal } from './components/ProfileModal.js';
import { CommandPalette } from './components/CommandPalette.js';
import { Footer } from './components/Footer.js';

class MyCampusApp {
  constructor() {
    this.events = StorageManager.getEvents();
    this.profile = StorageManager.getProfile();
    this.currentView = 'timeline'; // 'timeline' | 'calendar' | 'unstop'
    this.currentCategory = 'All';
    this.darkMode = localStorage.getItem('mycampus_theme') !== 'light';

    this.initTheme();
    this.initComponents();
    this.attachGlobalListeners();
  }

  initTheme() {
    if (this.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('mycampus_theme', this.darkMode ? 'dark' : 'light');
    this.initTheme();
    this.navbar.update({ darkMode: this.darkMode, profile: this.profile });
    this.showToast(`Switched to ${this.darkMode ? 'Dark' : 'Light'} Mode`);
  }

  getFilteredEvents() {
    if (this.currentCategory === 'All') return this.events;
    return this.events.filter(e => e.category === this.currentCategory);
  }

  initComponents() {
    // 1. Clean Top Navbar with Profile Icon & Ranking Badge
    this.navbar = new Navbar({
      currentView: this.currentView,
      darkMode: this.darkMode,
      profile: this.profile,
      onViewChange: (view) => this.switchView(view),
      onOpenModal: (modalId) => this.openModal(modalId),
      onToggleTheme: () => this.toggleTheme()
    });
    this.navbar.render();

    // 2. Overview Metrics & Category Filter Pills
    this.heroStats = new HeroStats({
      currentCategory: this.currentCategory,
      events: this.getFilteredEvents(),
      onCategoryChange: (cat) => this.setCategory(cat),
      onOpenModal: (modalId) => this.openModal(modalId)
    });
    this.heroStats.render();

    // 3. Render Active Main View
    this.renderCurrentView();

    // 4. Render Minimal Footer
    this.footer = new Footer({
      onOpenModal: (modalId) => this.openModal(modalId),
      onViewChange: (view) => this.switchView(view)
    });
    this.footer.render();
  }

  refreshAll() {
    const filtered = this.getFilteredEvents();

    this.navbar.update({
      currentView: this.currentView,
      darkMode: this.darkMode,
      profile: this.profile
    });

    this.heroStats.update({
      currentCategory: this.currentCategory,
      events: filtered
    });

    this.renderCurrentView();
  }

  switchView(viewName) {
    this.currentView = viewName;
    this.navbar.update({ currentView: this.currentView });
    this.renderCurrentView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setCategory(cat) {
    this.currentCategory = cat;
    this.heroStats.update({
      currentCategory: this.currentCategory,
      events: this.getFilteredEvents()
    });
    this.renderCurrentView();
  }

  renderCurrentView() {
    const filteredEvents = this.getFilteredEvents();

    switch (this.currentView) {
      case 'timeline':
        this.timelineView = new TimelineView({
          events: filteredEvents,
          onToggleMilestone: (eventId, msId) => this.handleToggleMilestone(eventId, msId),
          onEditEvent: (eventId) => this.openEditEventModal(eventId),
          onDeleteEvent: (eventId) => this.handleDeleteEvent(eventId),
          onAddEvent: () => this.openModal('new-event'),
          onOpenUnstopHub: () => this.switchView('unstop')
        });
        this.timelineView.render();
        break;

      case 'calendar':
        this.calendarView = new CalendarView({
          events: filteredEvents,
          onSelectEvent: (eventId) => this.jumpToEvent(eventId)
        });
        this.calendarView.render();
        break;

      case 'unstop':
        this.unstopHubView = new UnstopHubView({
          events: this.events,
          onImportEvent: (newEvent) => {
            this.events = StorageManager.addEvent(newEvent);
            this.showToast(`Imported "${newEvent.title}" to your timeline!`);
            this.refreshAll();
          },
          onViewTimeline: () => this.switchView('timeline')
        });
        this.unstopHubView.render();
        break;
    }
  }

  // Milestone toggling
  handleToggleMilestone(eventId, milestoneId) {
    const { events, completed, milestone } = StorageManager.toggleMilestone(eventId, milestoneId);
    this.events = events;

    if (completed) {
      this.showToast(`Completed "${milestone ? milestone.title : 'Milestone'}"`);
    } else {
      this.showToast(`Marked milestone pending`);
    }

    this.refreshAll();
  }

  handleDeleteEvent(eventId) {
    this.events = StorageManager.deleteEvent(eventId);
    this.showToast('Event removed');
    this.refreshAll();
  }

  jumpToEvent(eventId) {
    this.switchView('timeline');
    setTimeout(() => {
      const el = document.getElementById(`card-${eventId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-2', 'ring-blue-500');
        setTimeout(() => el.classList.remove('ring-2', 'ring-blue-500'), 2000);
      }
    }, 150);
  }

  // Modals
  openModal(modalType) {
    switch (modalType) {
      case 'profile':
        new ProfileModal({
          events: this.events,
          profile: this.profile,
          onProfileUpdated: (updatedProfile) => {
            this.profile = updatedProfile;
            this.showToast(`Saved profile for ${updatedProfile.name}`);
            this.refreshAll();
          },
          onClose: () => {}
        }).render();
        break;

      case 'unstop-hub':
        this.switchView('unstop');
        break;

      case 'new-event':
        new EventModal({
          event: null,
          onSave: (newEvent) => {
            this.events = StorageManager.addEvent(newEvent);
            this.showToast(`Created "${newEvent.title}"`);
            this.refreshAll();
          },
          onClose: () => {}
        }).render();
        break;

      case 'command-palette':
        new CommandPalette({
          events: this.events,
          onAction: (act, param) => {
            if (act === 'profile') this.openModal('profile');
            else if (act === 'view-timeline') this.switchView('timeline');
            else if (act === 'view-calendar') this.switchView('calendar');
            else if (act === 'view-unstop') this.switchView('unstop');
            else if (act === 'new-event') this.openModal('new-event');
            else if (act === 'export-ics') ICSExporter.downloadICS(this.events);
            else if (act === 'toggle-theme') this.toggleTheme();
            else if (act === 'select-event') this.jumpToEvent(param);
          },
          onClose: () => {}
        }).render();
        break;
    }
  }

  openEditEventModal(eventId) {
    const evt = this.events.find(e => e.id === eventId);
    if (!evt) return;

    new EventModal({
      event: evt,
      onSave: (updated) => {
        this.events = StorageManager.updateEvent(eventId, updated);
        this.showToast(`Updated "${updated.title}"`);
        this.refreshAll();
      },
      onClose: () => {}
    }).render();
  }

  // Toast Notification System
  showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'pointer-events-auto bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center space-x-2 transform translate-y-3 opacity-0 transition-all duration-200 border border-slate-700/60 dark:border-slate-200';
    toast.innerHTML = `
      <i class="fas fa-check-circle text-emerald-400 dark:text-emerald-600"></i>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-3', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('translate-y-2', 'opacity-0');
      setTimeout(() => toast.remove(), 250);
    }, 2500);
  }

  attachGlobalListeners() {
    window.addEventListener('keydown', (e) => {
      // Cmd+K or Ctrl+K for search omnibar
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.openModal('command-palette');
      }

      // Quick keys if not typing in form inputs
      if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        if (e.key === '1') this.switchView('timeline');
        if (e.key === '2') this.switchView('calendar');
        if (e.key === '3') this.switchView('unstop');
        if (e.key.toLowerCase() === 'p') {
          e.preventDefault();
          this.openModal('profile');
        }
        if (e.key.toLowerCase() === 'n') {
          e.preventDefault();
          this.openModal('new-event');
        }
      }
    });
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.myCampusApp = new MyCampusApp();
});
