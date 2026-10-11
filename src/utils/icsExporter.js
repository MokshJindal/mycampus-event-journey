// ==========================================================================
// RFC 5545 iCalendar (.ics) Exporter
// Direct integration with Google Calendar, Apple Calendar, Outlook
// ==========================================================================

export class ICSExporter {
  static formatDate(date) {
    const pad = (n) => (n < 10 ? '0' + n : n);
    return (
      date.getUTCFullYear() +
      pad(date.getUTCMonth() + 1) +
      pad(date.getUTCDate()) +
      'T' +
      pad(date.getUTCHours()) +
      pad(date.getUTCMinutes()) +
      pad(date.getUTCSeconds()) +
      'Z'
    );
  }

  static escapeText(str) {
    if (!str) return '';
    return str
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');
  }

  static generateICS(events) {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//MyCampus//Student Event Journey V2//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:MyCampus Event Journey',
      'X-WR-TIMEZONE:Asia/Kolkata'
    ];

    const now = new Date();
    const dtstamp = this.formatDate(now);

    events.forEach(evt => {
      if (!evt.milestones) return;

      evt.milestones.forEach(m => {
        if (!m.deadline) return;

        const start = new Date(m.deadline);
        // Default milestone duration: 1 hour for deadlines/meetings
        const end = new Date(start.getTime() + 60 * 60 * 1000);

        const uid = `mycampus-${evt.id}-${m.id}@mycampus.iiitd.ac.in`;
        const summary = `[${evt.category}] ${evt.title}: ${m.title}`;
        const location = m.location || (evt.venue ? `${evt.venue.building}, ${evt.venue.room}` : 'Campus');
        const description = `Event: ${evt.title}\\nCategory: ${evt.category}\\nPhase: ${m.phase || 'General'}\\nPlatform: ${evt.platform || 'Campus'}\\nVenue: ${location}\\n\\nNotes: ${m.notes || 'None'}\\nReg ID: ${evt.registrationId || 'N/A'}`;

        lines.push('BEGIN:VEVENT');
        lines.push(`UID:${uid}`);
        lines.push(`DTSTAMP:${dtstamp}`);
        lines.push(`DTSTART:${this.formatDate(start)}`);
        lines.push(`DTEND:${this.formatDate(end)}`);
        lines.push(`SUMMARY:${this.escapeText(summary)}`);
        lines.push(`DESCRIPTION:${description}`);
        lines.push(`LOCATION:${this.escapeText(location)}`);
        lines.push(`STATUS:${m.completed ? 'COMPLETED' : 'CONFIRMED'}`);

        // Add 24-hour and 2-hour reminders
        lines.push('BEGIN:VALARM');
        lines.push('TRIGGER:-PT24H');
        lines.push('ACTION:DISPLAY');
        lines.push(`DESCRIPTION:Reminder: 24h until ${this.escapeText(m.title)}`);
        lines.push('END:VALARM');

        lines.push('BEGIN:VALARM');
        lines.push('TRIGGER:-PT2H');
        lines.push('ACTION:DISPLAY');
        lines.push(`DESCRIPTION:Urgent: 2h until ${this.escapeText(m.title)}`);
        lines.push('END:VALARM');

        lines.push('END:VEVENT');
      });
    });

    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  }

  static downloadICS(events, filename = 'mycampus-event-journey.ics') {
    const icsContent = this.generateICS(events);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
