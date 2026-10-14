// ==========================================================================
// Main Application State Orchestrator
// Connects Navbar, HeroStats, Views, Modals, Audio, and Keyboard Shortcuts
// ==========================================================================

import { sound } from './utils/audio.js';
import { StorageManager } from './utils/storage.js';
import { ICSExporter } from './utils/icsExporter.js';
import { Navbar } from './components/Navbar.js';
import { HeroStats } from './components/HeroStats.js';
import { TimelineView } from './components/TimelineView.js';
import { CalendarView } from './components/CalendarView.js';
import { KanbanView } from './components/KanbanView.js';
import { ClashRadarView } from './components/ClashRadarView.js';
import { SmartImportModal } from './components/SmartImportModal.js';
import { SurvivalModeModal } from './components/SurvivalModeModal.js';
import { CampusMapModal } from './components/CampusMapModal.js';
import { PassportModal } from './components/PassportModal.js';
import { DiscoverModal } from './components/DiscoverModal.js';
import { EventModal } from './components/EventModal.js';
import { CommandPalette } from './components/CommandPalette.js';
import { UnstopPluginModal } from './components/UnstopPluginModal.js';
import { Footer } from './components/Footer.js';

class MyCampusApp {
  constructor() {
    this.events = StorageManager.getEvents();
    this.profile = StorageManager.getProfile();
    this.currentView = 'timeline'; // 'timeline' | 'calendar' | 'kanban' | 'clash-radar'
    this.currentCategory = 'All';
    this.darkMode = localStorage.getItem('mycampus_theme') !== 'light';
    this.activeModal = null;

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
    this.navbar.update({ darkMode: this.darkMode });
    this.showToast(`Switched to ${this.darkMode ? 'Obsidian Slate (Dark)' : 'Collegiate Classic (Light)'}`);
  }

  toggleSound() {
    const isMuted = sound.toggleMute();
    this.navbar.update({ soundMuted: isMuted });
    this.showToast(isMuted ? 'Sound muted' : 'Audio sound effects enabled');
  }

  getFilteredEvents() {
    if (this.currentCategory === 'All') return this.events;
    return this.events.filter(e => e.category === this.currentCategory);
  }

  getStats() {
    return StorageManager.calculateStats(this.events);
  }

  initComponents() {
    const stats = this.getStats();

    // 1. Navbar
    this.navbar = new Navbar({
      currentView: this.currentView,
      clashesCount: stats.clashesCount,
      soundMuted: sound.isMuted(),
      darkMode: this.darkMode,
      onViewChange: (view) => this.switchView(view),
      onOpenModal: (modalId) => this.openModal(modalId),
      onToggleSound: () => this.toggleSound(),
      onToggleTheme: () => this.toggleTheme()
    });
    this.navbar.render();

    // 2. HeroStats
    this.heroStats = new HeroStats({
      stats,
      currentCategory: this.currentCategory,
      events: this.getFilteredEvents(),
      onCategoryChange: (cat) => this.setCategory(cat),
      onOpenModal: (modalId) => this.openModal(modalId),
      onJumpToEvent: (eventId) => this.jumpToEvent(eventId)
    });
    this.heroStats.render();

    // 3. Render Active View
    this.renderCurrentView();

    // 4. Render Bottom Dashboard Footer
    this.footer = new Footer({
      onOpenModal: (modalId) => this.openModal(modalId),
      onViewChange: (view) => this.switchView(view)
    });
    this.footer.render();
  }

  refreshAll() {
    const stats = this.getStats();
    const filtered = this.getFilteredEvents();

    this.navbar.update({
      currentView: this.currentView,
      clashesCount: stats.clashesCount,
      soundMuted: sound.isMuted(),
      darkMode: this.darkMode
    });

    this.heroStats.update({
      stats,
      currentCategory: this.currentCategory,
      events: filtered
    });

    this.renderCurrentView();
  }

  switchView(viewName) {
    this.currentView = viewName;
    this.navbar.update({ currentView: this.currentView });
    this.renderCurrentView();
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
    const stats = this.getStats();

    switch (this.currentView) {
      case 'timeline':
        this.timelineView = new TimelineView({
          events: filteredEvents,
          onToggleMilestone: (eventId, msId) => this.handleToggleMilestone(eventId, msId),
          onEditEvent: (eventId) => this.openEditEventModal(eventId),
          onDeleteEvent: (eventId) => this.handleDeleteEvent(eventId),
          onOpenSurvivalMode: (eventId) => this.openSurvivalMode(eventId),
          onOpenVenueMap: (building) => this.openVenueMap(building),
          onAddEvent: () => this.openModal('new-event')
        });
        this.timelineView.render();
        break;

      case 'calendar':
        this.calendarView = new CalendarView({
          events: filteredEvents,
          onSelectEvent: (eventId) => this.openSurvivalMode(eventId),
          onOpenSurvivalMode: (eventId) => this.openSurvivalMode(eventId)
        });
        this.calendarView.render();
        break;

      case 'kanban':
        this.kanbanView = new KanbanView({
          events: filteredEvents,
          onUpdateStage: (eventId, newStage) => this.handleUpdateStage(eventId, newStage),
          onOpenSurvivalMode: (eventId) => this.openSurvivalMode(eventId),
          onEditEvent: (eventId) => this.openEditEventModal(eventId)
        });
        this.kanbanView.render();
        break;

      case 'clash-radar':
        this.clashRadarView = new ClashRadarView({
          clashes: stats.clashes,
          events: this.events,
          onResolveClash: (eventId, msId) => this.handleToggleMilestone(eventId, msId),
          onOpenVenueMap: (building) => this.openVenueMap(building)
        });
        this.clashRadarView.render();
        break;
    }
  }

  // Milestone toggling
  handleToggleMilestone(eventId, milestoneId) {
    const { events, completed, milestone, event } = StorageManager.toggleMilestone(eventId, milestoneId);
    this.events = events;

    if (completed) {
      sound.playSuccess();
      this.showToast(`Completed "${milestone ? milestone.title : 'Milestone'}"! (+50 XP)`);
    } else {
      sound.playClick();
      this.showToast(`Marked milestone incomplete.`);
    }

    this.refreshAll();
  }

  handleUpdateStage(eventId, newStage) {
    this.events = StorageManager.updateEvent(eventId, { stage: newStage });
    this.showToast(`Moved to ${newStage.toUpperCase()}`);
    this.refreshAll();
  }

  handleDeleteEvent(eventId) {
    this.events = StorageManager.deleteEvent(eventId);
    this.showToast('Event removed from journey.');
    this.refreshAll();
  }

  jumpToEvent(eventId) {
    this.switchView('timeline');
    setTimeout(() => {
      const el = document.getElementById(`card-${eventId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-4', 'ring-blue-500');
        setTimeout(() => el.classList.remove('ring-4', 'ring-blue-500'), 2000);
      }
    }, 150);
  }

  // Modals
  openModal(modalType) {
    if (modalType === 'switch-view-clash-radar') {
      this.switchView('clash-radar');
      return;
    }

    if (modalType === 'reset-demo') {
      this.events = StorageManager.resetToDefault();
      this.showToast('Reset back to official demo event journey.');
      this.refreshAll();
      return;
    }

    switch (modalType) {
      case 'smart-ingest':
        new SmartImportModal({
          onImportEvent: (newEvent) => {
            this.events = StorageManager.addEvent(newEvent);
            this.showToast(`Imported "${newEvent.title}" with ${newEvent.milestones.length} milestones!`);
            this.refreshAll();
          },
          onImportBackup: (jsonStr) => {
            const res = StorageManager.importJSON(jsonStr);
            if (res.success) {
              this.events = StorageManager.getEvents();
              this.profile = StorageManager.getProfile();
              this.showToast(`Restored ${res.count} events from backup!`);
              this.refreshAll();
            } else {
              alert('Error importing backup: ' + res.error);
            }
          },
          onClose: () => {}
        }).render();
        break;

      case 'survival-mode':
        this.openSurvivalMode();
        break;

      case 'campus-map':
        this.openVenueMap();
        break;

      case 'passport':
        new PassportModal({
          events: this.events,
          profile: this.profile,
          onClose: () => {}
        }).render();
        break;

      case 'discover':
        const existingIds = new Set(this.events.map(e => e.id));
        new DiscoverModal({
          existingEventIds: existingIds,
          onImportDiscoveredEvent: (disc) => {
            const newEvent = {
              ...disc,
              stage: 'registered',
              registrationId: `DISC-${Math.floor(100000 + Math.random() * 900000)}`,
              milestones: disc.defaultMilestones || []
            };
            this.events = StorageManager.addEvent(newEvent);
            this.showToast(`Added "${disc.title}" to your Journey!`);
            this.refreshAll();
          },
          onClose: () => {}
        }).render();
        break;

      case 'new-event':
        new EventModal({
          event: null,
          onSave: (newEvent) => {
            this.events = StorageManager.addEvent(newEvent);
            this.showToast(`Created "${newEvent.title}"!`);
            this.refreshAll();
          },
          onClose: () => {}
        }).render();
        break;

      case 'unstop-plugin':
        new UnstopPluginModal({
          onImportEvent: (newEvent) => {
            this.events = StorageManager.addEvent(newEvent);
            this.showToast(`Imported Unstop Challenge: "${newEvent.title}" (${newEvent.milestones.length} rounds synced)`);
            this.refreshAll();
          },
          onClose: () => {}
        }).render();
        break;

      case 'command-palette':
        new CommandPalette({
          events: this.events,
          onAction: (act, param) => {
            if (act === 'unstop-plugin') this.openModal('unstop-plugin');
            else if (act === 'smart-ingest') this.openModal('smart-ingest');
            else if (act === 'new-event') this.openModal('new-event');
            else if (act === 'survival-mode') this.openModal('survival-mode');
            else if (act === 'campus-map') this.openModal('campus-map');
            else if (act === 'passport') this.openModal('passport');
            else if (act === 'discover') this.openModal('discover');
            else if (act === 'export-ics') ICSExporter.downloadICS(this.events);
            else if (act === 'view-timeline') this.switchView('timeline');
            else if (act === 'view-calendar') this.switchView('calendar');
            else if (act === 'view-kanban') this.switchView('kanban');
            else if (act === 'view-clash-radar') this.switchView('clash-radar');
            else if (act === 'toggle-theme') this.toggleTheme();
            else if (act === 'toggle-sound') this.toggleSound();
            else if (act === 'select-event') this.jumpToEvent(param);
          },
          onClose: () => {}
        }).render();
        break;
    }
  }

  openSurvivalMode(eventId) {
    new SurvivalModeModal({
      events: this.events,
      selectedEventId: eventId || (this.events[0] ? this.events[0].id : null),
      onToggleChecklist: (eId, cId) => {
        this.events = StorageManager.toggleChecklistItem(eId, cId);
        this.refreshAll();
      },
      onClose: () => {}
    }).render();
  }

  openVenueMap(buildingName) {
    new CampusMapModal({
      events: this.events,
      selectedBuildingCode: buildingName,
      onClose: () => {},
      onSelectEvent: (eventId) => this.jumpToEvent(eventId)
    }).render();
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
    toast.className = 'pointer-events-auto bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center space-x-2 transform translate-y-4 opacity-0 transition-all duration-200 border border-slate-700/60 dark:border-slate-200';
    toast.innerHTML = `
      <i class="fas fa-circle-check text-emerald-400 dark:text-emerald-600"></i>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('translate-y-2', 'opacity-0');
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }

  attachGlobalListeners() {
    window.addEventListener('keydown', (e) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        sound.playClick();
        this.openModal('command-palette');
      }

      // Quick 1-4 view keys and 'u' for Unstop if not in input/textarea
      if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        if (e.key === '1') this.switchView('timeline');
        if (e.key === '2') this.switchView('calendar');
        if (e.key === '3') this.switchView('kanban');
        if (e.key === '4') this.switchView('clash-radar');
        if (e.key.toLowerCase() === 'u') {
          sound.playClick();
          this.openModal('unstop-plugin');
        }
      }
    });
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.myCampusApp = new MyCampusApp();
});
