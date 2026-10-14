// ==========================================================================
// SmartImportModal Component
// AI Natural Language Parser for Confirmation Emails & WhatsApp Circulars
// Includes 1-Click Realistic Preset Buttons and Instant JSON Backup Sync
// ==========================================================================

import { sound } from '../utils/audio.js';
import { SmartParser, SAMPLE_TEMPLATES } from '../utils/nlpParser.js';

export class SmartImportModal {
  constructor({ onImportEvent, onImportBackup, onClose }) {
    this.onImportEvent = onImportEvent;
    this.onImportBackup = onImportBackup;
    this.onClose = onClose;
    this.parsedResult = null;
    this.activeTab = 'nlp'; // 'nlp' | 'backup'
  }

  render() {
    let modal = document.getElementById('smart-import-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'smart-import-modal';
      modal.className = 'fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-8 modal-overlay overflow-y-auto';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh] transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Modal Header -->
        <div class="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/95 dark:bg-slate-900/95 sticky top-0 z-10">
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm shadow-xs">
              <i class="fas fa-wand-magic-sparkles text-amber-300"></i>
            </div>
            <div>
              <h3 class="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                AI Smart Circular Ingestion
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Paste any confirmation email, WhatsApp notice, or Unstop/Devpost circular to auto-extract your timeline.
              </p>
            </div>
          </div>

          <button id="close-smart-modal" class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold border border-slate-300 dark:border-slate-700 flex items-center space-x-1 transition-colors">
            <i class="fas fa-xmark"></i>
            <span>Close</span>
          </button>
        </div>

        <!-- Mode Tabs -->
        <div class="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-2">
          <button id="tab-nlp" class="px-4 py-2.5 font-semibold text-xs border-b-2 transition-all ${
            this.activeTab === 'nlp' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }">
            <i class="fas fa-envelope-open-text mr-1.5"></i> Natural Email & Text Parser
          </button>
          <button id="tab-backup" class="px-4 py-2.5 font-semibold text-xs border-b-2 transition-all ${
            this.activeTab === 'backup' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }">
            <i class="fas fa-file-code mr-1.5"></i> Backup File (.JSON)
          </button>
        </div>

        <div class="p-6 space-y-5">
          ${this.activeTab === 'nlp' ? this.renderNLPBody() : this.renderBackupBody()}
        </div>

      </div>
    `;

    this.attachEvents();
  }

  renderNLPBody() {
    return `
      <!-- 1-Click Sample Preset Chips -->
      <div>
        <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
          ⚡ Try A Realistic Sample Email (Click to Auto-Fill):
        </label>
        <div class="flex flex-wrap gap-2">
          <button data-sample="devpost" class="sample-preset-btn px-2.5 py-1.5 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium border border-blue-200 dark:border-blue-800 transition-colors flex items-center space-x-1.5">
            <i class="fas fa-laptop-code text-blue-500"></i>
            <span>Devpost Hackathon</span>
          </button>
          <button data-sample="unstop" class="sample-preset-btn px-2.5 py-1.5 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-medium border border-amber-200 dark:border-amber-800 transition-colors flex items-center space-x-1.5">
            <i class="fas fa-trophy text-amber-500"></i>
            <span>Unstop AI Challenge</span>
          </button>
          <button data-sample="luma" class="sample-preset-btn px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-medium border border-emerald-200 dark:border-emerald-800 transition-colors flex items-center space-x-1.5">
            <i class="fas fa-ticket text-emerald-500"></i>
            <span>Luma Workshop Pass</span>
          </button>
          <button data-sample="whatsapp" class="sample-preset-btn px-2.5 py-1.5 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-medium border border-purple-200 dark:border-purple-800 transition-colors flex items-center space-x-1.5">
            <i class="fab fa-whatsapp text-green-500"></i>
            <span>WhatsApp Circular</span>
          </button>
        </div>
      </div>

      <!-- Textarea Input -->
      <div>
        <label for="smart-input-text" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Paste Raw Email or Message Text:
        </label>
        <textarea 
          id="smart-input-text" 
          rows="6" 
          placeholder="Paste confirmation text here, e.g.:&#10;Subject: You are registered for HackDelhi 2026!&#10;Milestone 1 Abstract: Oct 20 at 11:59 PM&#10;Venue: R&D Block Auditorium&#10;Team: CyberKnights"
          class="w-full text-xs font-mono p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
        ></textarea>
      </div>

      <!-- Action Button -->
      <div class="flex items-center justify-between">
        <button id="btn-run-parser" class="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center space-x-2 transition-all">
          <i class="fas fa-brain"></i>
          <span>Run AI Entity Extraction</span>
        </button>

        <span class="text-[11px] text-slate-400">
          Extracts dates, venues, teams, & multi-phase rounds
        </span>
      </div>

      <!-- Parsed Preview Drawer -->
      <div id="smart-parsed-preview" class="space-y-3">
        ${this.parsedResult ? this.renderParsedPreview(this.parsedResult) : ''}
      </div>
    `;
  }

  renderParsedPreview(result) {
    return `
      <div class="mt-4 p-4 rounded-xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3 animate-in fade-in duration-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">
              <i class="fas fa-check"></i>
            </span>
            <span class="font-bold text-xs uppercase text-emerald-800 dark:text-emerald-300">
              Extraction Successful
            </span>
          </div>
          <span class="text-xs font-mono bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-emerald-300 text-emerald-700 dark:text-emerald-300 font-bold">
            ${result.milestones.length} Milestones Extracted
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-semibold">Event Title</span>
            <span class="font-display font-bold text-slate-900 dark:text-white">${result.title}</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-semibold">Category & Platform</span>
            <span class="font-medium text-slate-800 dark:text-slate-200">${result.category} • ${result.platform}</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-semibold">Venue Waypoint</span>
            <span class="font-medium text-slate-800 dark:text-slate-200">${result.venue.building}, ${result.venue.room}</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-semibold">Team & Registration</span>
            <span class="font-medium text-slate-800 dark:text-slate-200">${result.teamName} (${result.registrationId})</span>
          </div>
        </div>

        <!-- Milestones list -->
        <div class="space-y-1.5">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Detected Milestones:</span>
          ${result.milestones.map(m => `
            <div class="flex items-center justify-between text-xs bg-white dark:bg-slate-800 p-2 rounded-md border border-slate-200 dark:border-slate-700 font-medium">
              <div class="flex items-center space-x-2">
                <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>${m.title}</span>
              </div>
              <span class="font-mono text-[11px] text-slate-500">${m.deadline.replace('T', ' ')}</span>
            </div>
          `).join('')}
        </div>

        <div class="pt-2 flex justify-end">
          <button id="btn-confirm-import" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-all">
            <i class="fas fa-plus-circle"></i>
            <span>Add Event to My Journey</span>
          </button>
        </div>
      </div>
    `;
  }

  renderBackupBody() {
    return `
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Paste Backup JSON or Upload File:
          </label>
          <textarea 
            id="backup-input-text" 
            rows="8" 
            placeholder='{"app": "MyCampus", "events": [...]}'
            class="w-full text-xs font-mono p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
          ></textarea>
        </div>

        <div class="flex items-center justify-between pt-2">
          <button id="btn-restore-json" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all">
            <i class="fas fa-upload mr-1.5"></i> Restore Backup
          </button>
          <span class="text-[11px] text-slate-400">
            Overwrites current active state with backup
          </span>
        </div>
      </div>
    `;
  }

  attachEvents() {
    // Close
    const closeBtn = document.getElementById('close-smart-modal');
    if (closeBtn) closeBtn.onclick = () => this.close();

    // Tab buttons
    const tabNlp = document.getElementById('tab-nlp');
    const tabBackup = document.getElementById('tab-backup');
    if (tabNlp) {
      tabNlp.onclick = () => {
        sound.playClick();
        this.activeTab = 'nlp';
        this.render();
      };
    }
    if (tabBackup) {
      tabBackup.onclick = () => {
        sound.playClick();
        this.activeTab = 'backup';
        this.render();
      };
    }

    // Preset buttons
    document.querySelectorAll('.sample-preset-btn').forEach(btn => {
      btn.onclick = () => {
        sound.playClick();
        const type = btn.getAttribute('data-sample');
        const template = SAMPLE_TEMPLATES[type];
        if (template) {
          const textarea = document.getElementById('smart-input-text');
          if (textarea) textarea.value = template.text;
        }
      };
    });

    // Run Parser button
    const runBtn = document.getElementById('btn-run-parser');
    if (runBtn) {
      runBtn.onclick = () => {
        const textarea = document.getElementById('smart-input-text');
        const text = textarea ? textarea.value.trim() : '';
        if (!text) {
          alert('Please enter or select a sample email before parsing.');
          return;
        }
        sound.playSuccess();
        this.parsedResult = SmartParser.parseText(text);
        const preview = document.getElementById('smart-parsed-preview');
        if (preview) {
          preview.innerHTML = this.renderParsedPreview(this.parsedResult);
          this.attachConfirmEvent();
        }
      };
    }

    // Backup restore
    const restoreBtn = document.getElementById('btn-restore-json');
    if (restoreBtn) {
      restoreBtn.onclick = () => {
        const txt = document.getElementById('backup-input-text');
        const json = txt ? txt.value.trim() : '';
        if (!json) return;
        this.onImportBackup(json);
        this.close();
      };
    }

    this.attachConfirmEvent();
  }

  attachConfirmEvent() {
    const confirmBtn = document.getElementById('btn-confirm-import');
    if (confirmBtn && this.parsedResult) {
      confirmBtn.onclick = () => {
        sound.playFanfare();
        this.onImportEvent(this.parsedResult);
        this.close();
      };
    }
  }

  close() {
    sound.playClick();
    const modal = document.getElementById('smart-import-modal');
    if (modal) modal.remove();
    this.onClose();
  }
}
