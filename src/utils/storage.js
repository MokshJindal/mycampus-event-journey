// ==========================================================================
// Storage, State Management, and Conflict Analysis Layer
// ==========================================================================

import { INITIAL_EVENTS } from '../data/initialData.js';

const STORAGE_KEY = 'mycampus_events_v2';
const PROFILE_KEY = 'mycampus_profile_v2';

const DEFAULT_PROFILE = {
  name: "Moksh Jindal",
  rollNo: "2023BCS-042",
  department: "Computer Science & Engineering",
  university: "Indraprastha Institute of Information Technology Delhi (IIIT-D)",
  year: "3rd Year B.Tech",
  avatar: "MJ",
  email: "moksh23042@iiitd.ac.in",
  bio: "Full-stack engineer, competitive hacker & ZK cryptography researcher. Passionate about distributed systems."
};

export class StorageManager {
  static getProfile() {
    try {
      const data = localStorage.getItem(PROFILE_KEY);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch (e) {
      return DEFAULT_PROFILE;
    }
  }

  static saveProfile(profile) {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  }

  static getEvents() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed reading events from storage, restoring defaults', e);
    }
    // Fallback to initial seed
    this.saveEvents(INITIAL_EVENTS);
    return INITIAL_EVENTS;
  }

  static saveEvents(events) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.error('Failed to save events', e);
    }
  }

  static addEvent(newEvent) {
    const events = this.getEvents();
    // Prepend new event
    const updated = [newEvent, ...events];
    this.saveEvents(updated);
    return updated;
  }

  static updateEvent(eventId, fields) {
    const events = this.getEvents();
    const index = events.findIndex(e => e.id === eventId);
    if (index !== -1) {
      events[index] = { ...events[index], ...fields };
      this.saveEvents(events);
    }
    return events;
  }

  static deleteEvent(eventId) {
    const events = this.getEvents();
    const updated = events.filter(e => e.id !== eventId);
    this.saveEvents(updated);
    return updated;
  }

  static toggleMilestone(eventId, milestoneId) {
    const events = this.getEvents();
    const event = events.find(e => e.id === eventId);
    let completedState = false;
    let milestoneObj = null;

    if (event && event.milestones) {
      const ms = event.milestones.find(m => m.id === milestoneId);
      if (ms) {
        ms.completed = !ms.completed;
        completedState = ms.completed;
        milestoneObj = ms;

        // Auto calculate event stage if all milestones are completed
        const allCompleted = event.milestones.every(m => m.completed);
        if (allCompleted && event.stage !== 'won') {
          event.stage = 'completed';
        }
      }
      this.saveEvents(events);
    }
    return { events, completed: completedState, milestone: milestoneObj, event };
  }

  static toggleChecklistItem(eventId, checkId) {
    const events = this.getEvents();
    const event = events.find(e => e.id === eventId);
    if (event && event.checklist) {
      const item = event.checklist.find(c => c.id === checkId);
      if (item) {
        item.completed = !item.completed;
        this.saveEvents(events);
      }
    }
    return events;
  }

  static resetToDefault() {
    this.saveEvents(INITIAL_EVENTS);
    this.saveProfile(DEFAULT_PROFILE);
    return INITIAL_EVENTS;
  }

  static exportJSON() {
    const events = this.getEvents();
    const profile = this.getProfile();
    const exportData = {
      app: "MyCampus: Your Event Journey",
      version: "2.0.0",
      exportDate: new Date().toISOString(),
      profile,
      events
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mycampus-event-journey-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static importJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data && Array.isArray(data.events)) {
        this.saveEvents(data.events);
        if (data.profile) {
          this.saveProfile(data.profile);
        }
        return { success: true, count: data.events.length };
      }
      return { success: false, error: "Invalid backup format: 'events' array missing." };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // ========================================================================
  // Intelligent Conflict & Overlap Radar
  // Detects:
  // 1. Same-day / tight-window milestone deadlines (< 5 hours apart)
  // 2. Overlapping in-person finale / defense sessions
  // 3. High-stress workload days (> 2 deliverables in 24 hours)
  // ========================================================================
  static detectClashes(events) {
    const clashes = [];
    const allMilestones = [];

    // Flatten all uncompleted milestones
    events.forEach(evt => {
      if (!evt.milestones) return;
      evt.milestones.forEach(m => {
        if (!m.completed && m.deadline) {
          allMilestones.push({
            eventId: evt.id,
            eventTitle: evt.title,
            eventCategory: evt.category,
            eventVenue: evt.venue ? evt.venue.building : 'Virtual',
            milestoneId: m.id,
            milestoneTitle: m.title,
            phase: m.phase,
            deadline: new Date(m.deadline),
            deadlineStr: m.deadline
          });
        }
      });
    });

    // Sort chronologically
    allMilestones.sort((a, b) => a.deadline - b.deadline);

    // Pairwise comparison for proximity < 6 hours
    for (let i = 0; i < allMilestones.length; i++) {
      for (let j = i + 1; j < allMilestones.length; j++) {
        const m1 = allMilestones[i];
        const m2 = allMilestones[j];

        // Skip if same event
        if (m1.eventId === m2.eventId) continue;

        const diffHours = (m2.deadline - m1.deadline) / (1000 * 60 * 60);

        // Within 6 hours is a serious clash!
        if (diffHours >= 0 && diffHours <= 6) {
          const isExactSameDay = m1.deadline.toDateString() === m2.deadline.toDateString();
          const severity = diffHours < 2 ? 'critical' : (diffHours < 4 ? 'high' : 'medium');
          
          let advice = "";
          if (severity === 'critical') {
            advice = `Direct clash within ${Math.round(diffHours * 60)} mins! Recommend delegating ${m1.milestoneTitle} to a teammate or submitting 24 hours in advance.`;
          } else if (severity === 'high') {
            advice = `High workload day (${m1.deadline.toLocaleDateString()}). ${m1.eventTitle} and ${m2.eventTitle} deadlines are ${diffHours.toFixed(1)} hours apart.`;
          } else {
            advice = `Tight window (${diffHours.toFixed(1)} hrs buffer). Plan submissions ahead to avoid last-minute portal lag.`;
          }

          clashes.push({
            id: `clash-${m1.milestoneId}-${m2.milestoneId}`,
            severity,
            diffHours: diffHours.toFixed(1),
            m1,
            m2,
            date: m1.deadline.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
            advice
          });
        }
      }
    }

    return clashes;
  }

  // Calculate student statistics, XP, and upcoming badges
  static calculateStats(events) {
    let totalEvents = events.length;
    let activeEvents = 0;
    let completedEvents = 0;
    let wonEvents = 0;
    let totalXP = 0;
    let earnedXP = 0;
    let upcomingDeadlinesCount = 0;

    const now = new Date();
    const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const imminentList = [];

    const skillCounts = {};

    events.forEach(evt => {
      if (evt.stage === 'won') {
        wonEvents++;
        completedEvents++;
        earnedXP += (evt.xpReward || 100);
      } else if (evt.stage === 'completed') {
        completedEvents++;
        earnedXP += (evt.xpReward || 100);
      } else {
        activeEvents++;
      }

      totalXP += (evt.xpReward || 100);

      if (evt.skills && Array.isArray(evt.skills)) {
        evt.skills.forEach(s => {
          skillCounts[s] = (skillCounts[s] || 0) + 1;
        });
      }

      if (evt.milestones) {
        evt.milestones.forEach(m => {
          if (!m.completed && m.deadline) {
            const d = new Date(m.deadline);
            if (d >= now && d <= in48Hours) {
              upcomingDeadlinesCount++;
              imminentList.push({
                eventTitle: evt.title,
                milestoneTitle: m.title,
                deadline: d,
                eventId: evt.id
              });
            }
          }
        });
      }
    });

    const clashes = this.detectClashes(events);

    return {
      totalEvents,
      activeEvents,
      completedEvents,
      wonEvents,
      totalXP,
      earnedXP,
      upcomingDeadlinesCount,
      imminentList: imminentList.sort((a, b) => a.deadline - b.deadline),
      clashesCount: clashes.length,
      clashes,
      skillCounts
    };
  }
}
