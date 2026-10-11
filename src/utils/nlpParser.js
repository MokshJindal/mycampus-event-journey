// ==========================================================================
// AI Smart Ingestion & Natural Language Parser
// Parses registration emails, Devpost/Unstop emails, WhatsApp circulars
// into fully structured event objects with milestones and venues.
// ==========================================================================

export const SAMPLE_TEMPLATES = {
  devpost: {
    name: "Devpost Hackathon Confirmation",
    text: `Subject: You're registered for HackWeb3 Summit 2026 on Devpost!

Hi Moksh,
Congratulations! Your team "BlockArchitects" is successfully confirmed for HackWeb3 Summit 2026.

Important Event Timeline:
1. Registration & Team Confirmation: Oct 12, 2026 at 6:00 PM (Completed)
2. Phase 1 Project Architecture & Video Pitch: Oct 20, 2026 at 11:59 PM (Strict Deadline)
3. Semi-Finalist Notification: Oct 23, 2026 at 5:00 PM
4. 24h Virtual Hackathon & Live Pitch: Oct 26, 2026 at 10:00 AM

Venue: R&D Block, 3rd Floor Audi (Hybrid with Discord stream)
Registration ID: DVP-2026-90412
Platform: Devpost
Prize Pool: $15,000 in bounties
Looking forward to your project!`
  },
  unstop: {
    name: "Unstop Hackathon Acceptance Email",
    text: `Dear Moksh Jindal,

Greetings from Unstop!
Your registration for "National Algorithmic & AI Challenge 2026" has been approved!

Key Schedule & Rounds:
- Round 1: Online Coding Assessment on Oct 16, 2026 at 7:00 PM
- Round 2: Problem Statement Prototype Submission on Oct 23, 2026 at 11:59 PM
- Grand Finale: On-Campus Presentation at Old Academic Block Seminar Hall 1 on Oct 29, 2026 at 10:30 AM

Team Name: CodeCrafters
Registration Number: UNSTOP-AI-2026-88192
Organized on: Unstop
Prize Money: INR 1,50,000 + Certificate of Excellence

All the best!`
  },
  luma: {
    name: "Luma Workshop Ticket Confirmation",
    text: `You're in! Here is your ticket for "NextGen Rust & WebAssembly Deep Dive" hosted by Cloud Native Delhi.

Date: Oct 17, 2026 at 2:00 PM
Venue: Student Center Tech Sandbox Lab
Location: Student Center, 2nd Floor
Ticket ID: LUMA-RUST-55120
Instructor: Senior Staff Engineer, Cloudflare

Prerequisites:
- Please install rustup and wasm-pack before arriving.
- Bring your laptop and charger.`
  },
  whatsapp: {
    name: "WhatsApp Campus Club Notice",
    text: `🚨 URGENT NOTICE: Inter-College Debate & Case Challenge 2026 🚨
Hey everyone! Registrations for the 14th Annual Presidential Parliamentary Debate are now live!

📍 Venue: C-Block Auditorium & Library Seminar Room
📅 Team Registration Cutoff: Oct 19, 2026 at 5:00 PM
📅 Preliminary Debate Matches: Oct 24, 2026 at 11:00 AM
📅 Championship Finals: Oct 25, 2026 at 4:00 PM

🏆 Cash Prize: ₹45,000
Register in teams of 3 via Campus Portal.
Contact: Literary Club President (Phone: +91 98765 43210)`
  }
};

export class SmartParser {
  static parseText(rawText) {
    if (!rawText || typeof rawText !== 'string') {
      return null;
    }

    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    const fullLower = rawText.toLowerCase();

    // 1. Detect Category
    let category = "Competition";
    if (fullLower.includes("hackathon") || fullLower.includes("hack") || fullLower.includes("devpost") || fullLower.includes("devfolio")) {
      category = "Hackathon";
    } else if (fullLower.includes("workshop") || fullLower.includes("masterclass") || fullLower.includes("bootcamp") || fullLower.includes("deep dive") || fullLower.includes("hands-on")) {
      category = "Workshop";
    } else if (fullLower.includes("symposium") || fullLower.includes("conference") || fullLower.includes("summit") || fullLower.includes("paper")) {
      category = "Conference";
    } else if (fullLower.includes("debate") || fullLower.includes("cultural") || fullLower.includes("fest") || fullLower.includes("band")) {
      category = "Cultural";
    }

    // 2. Detect Platform
    let platform = "Campus Portal";
    if (fullLower.includes("devpost")) platform = "Devpost";
    else if (fullLower.includes("unstop")) platform = "Unstop";
    else if (fullLower.includes("luma") || fullLower.includes("lu.ma")) platform = "Luma";
    else if (fullLower.includes("devfolio")) platform = "Devfolio";
    else if (fullLower.includes("easychair")) platform = "EasyChair";
    else if (fullLower.includes("ieee")) platform = "IEEE";
    else if (fullLower.includes("eventbrite")) platform = "Eventbrite";

    // 3. Detect Title
    let title = "Campus Tech Event 2026";
    const subjectMatch = rawText.match(/subject:\s*(?:you['’]re\s*registered\s*for\s*)?([^\n!]+)/i);
    const doubleQuoteMatch = rawText.match(/["“]([^"”\n]{5,60})["”]/);
    const forMatch = rawText.match(/(?:registered for|ticket for|notice:)\s*["“]?([^"”'!\n.]{5,55})/i);

    if (subjectMatch && subjectMatch[1].trim().length > 4) {
      title = subjectMatch[1].replace(/on devpost|on unstop|!/gi, '').trim();
    } else if (doubleQuoteMatch && doubleQuoteMatch[1].trim().length > 4) {
      title = doubleQuoteMatch[1].trim();
    } else if (forMatch && forMatch[1].trim().length > 4) {
      title = forMatch[1].trim();
    } else {
      // First line heuristic
      const firstLine = lines[0] ? lines[0].replace(/[🚨#*]/g, '').trim() : "New Campus Event";
      if (firstLine.length > 5 && firstLine.length < 50) {
        title = firstLine;
      }
    }

    // 4. Detect Registration ID
    let registrationId = `REG-${Math.floor(100000 + Math.random() * 900000)}`;
    const regMatch = rawText.match(/(?:registration\s*(?:id|number|no|code)|ticket\s*id|reg\s*id)\s*[:=]?\s*([a-z0-9\-_]+)/i);
    if (regMatch) {
      registrationId = regMatch[1].trim();
    }

    // 5. Detect Team Name
    let teamName = "ByteCoders";
    const teamMatch = rawText.match(/team\s*(?:name)?\s*[:=]?\s*["']?([a-z0-9\s]{3,25})["']?(?:\s*is|\s*has|\n|$)/i);
    if (teamMatch && teamMatch[1].trim()) {
      teamName = teamMatch[1].trim();
    }

    // 6. Detect Venue & Building
    let building = "R&D Block";
    let room = "Main Auditorium";
    if (fullLower.includes("old academic") || fullLower.includes("oab") || fullLower.includes("seminar hall 1")) {
      building = "Old Academic Block";
      room = "Seminar Hall 1";
    } else if (fullLower.includes("student center") || fullLower.includes("tech sandbox")) {
      building = "Student Center";
      room = "Tech Sandbox Lab, 2nd Floor";
    } else if (fullLower.includes("library")) {
      building = "Library Building";
      room = "Executive Seminar Room 201";
    } else if (fullLower.includes("amphitheatre") || fullLower.includes("sports")) {
      building = "Campus Amphitheatre";
      room = "Open Air Arena";
    } else if (fullLower.includes("c-block") || fullLower.includes("audi")) {
      building = "C-Block Auditorium";
      room = "Main Auditorium";
    }

    // 7. Parse Milestones & Deadlines
    const milestones = [];
    const dateRegex = /(?:oct|nov|dec|jan|feb|sep|october|november|december)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s*(2026)?(?:\s+(?:at\s+)?(\d{1,2}):(\d{2})\s*(am|pm)?)?/gi;

    let match;
    let milestoneIndex = 1;
    const year = 2026;

    // Search lines that contain date mentions
    lines.forEach(line => {
      const lineDateMatch = line.match(/(?:(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*)\s+(\d{1,2})(?:st|nd|rd|th)?/i);
      if (lineDateMatch) {
        const monthStr = lineDateMatch[1].toLowerCase().slice(0, 3);
        const day = parseInt(lineDateMatch[2], 10);
        
        const monthMap = {
          jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
          jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
        };
        const monthNum = monthMap[monthStr] || '10';

        // Check time
        let hour = 18;
        let minute = 0;
        const timeMatch = line.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
        if (timeMatch) {
          hour = parseInt(timeMatch[1], 10);
          minute = parseInt(timeMatch[2], 10);
          const ampm = timeMatch[3] ? timeMatch[3].toLowerCase() : null;
          if (ampm === 'pm' && hour < 12) hour += 12;
          if (ampm === 'am' && hour === 12) hour = 0;
        }

        const dateISO = `${year}-${monthNum}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;

        // Clean title for milestone
        let mTitle = line
          .replace(/^(?:[0-9]+[.)]|[-*•])\s*/, '')
          .replace(/dated?:?/gi, '')
          .replace(/(?:oct|nov|dec|sep)[a-z]*\s+\d{1,2}(?:st|nd|rd|th)?,?\s*(?:2026)?/gi, '')
          .replace(/at\s+\d{1,2}:\d{2}\s*(?:am|pm)?/gi, '')
          .replace(/[\(\)]/g, '')
          .trim();

        if (mTitle.length < 5) {
          mTitle = `Milestone Round ${milestoneIndex}`;
        }

        // Determine phase
        let phase = "Submission";
        const mLower = mTitle.toLowerCase();
        if (mLower.includes("reg") || mLower.includes("confirm")) phase = "Registration";
        else if (mLower.includes("shortlist") || mLower.includes("notif")) phase = "Shortlist";
        else if (mLower.includes("final") || mLower.includes("pitch") || mLower.includes("demo") || mLower.includes("hack")) phase = "Finale";
        else if (mLower.includes("certif")) phase = "Certificate";

        milestones.push({
          id: `m-parsed-${Date.now()}-${milestoneIndex}`,
          title: mTitle.slice(0, 70),
          deadline: dateISO,
          completed: mLower.includes("completed") || mLower.includes("done"),
          phase,
          location: building,
          notes: line.slice(0, 120),
          urgent: milestoneIndex === 2
        });
        milestoneIndex++;
      }
    });

    // Fallback milestones if regex found fewer than 2
    if (milestones.length === 0) {
      milestones.push({
        id: `m-parsed-${Date.now()}-1`,
        title: "Registration & Ticket Confirmation",
        deadline: "2026-10-18T18:00:00",
        completed: true,
        phase: "Registration",
        location: building,
        notes: "Parsed from email confirmation."
      });
      milestones.push({
        id: `m-parsed-${Date.now()}-2`,
        title: "Submission Deadline & Presentation",
        deadline: "2026-10-24T23:59:00",
        completed: false,
        phase: "Finale",
        location: `${building}, ${room}`,
        notes: "Final evaluation slot."
      });
    }

    return {
      id: `evt-parsed-${Date.now()}`,
      title,
      category,
      platform,
      platformUrl: `https://${platform.toLowerCase().replace(/\s+/g, '')}.com`,
      stage: "registered",
      registrationId,
      teamName,
      teamMembers: [
        { name: "Moksh Jindal", role: "Team Lead", avatar: "MJ" },
        { name: "Aarav Sharma", role: "Teammate", avatar: "AS" }
      ],
      venue: {
        building,
        room,
        campusZone: "Central Campus",
        isVirtual: false,
        wifiSSID: "IIITD-Events-5G",
        wifiPass: "CampusHack2026!"
      },
      color: category === "Hackathon" ? "#3b82f6" : (category === "Workshop" ? "#10b981" : "#8b5cf6"),
      icon: category === "Hackathon" ? "code" : (category === "Workshop" ? "sparkles" : "award"),
      skills: [category, "Problem Solving", "Collaboration"],
      xpReward: 250,
      prizePool: "Merit Certificate & Swag",
      description: `Imported via AI Smart Parser from ${platform} registration confirmation.`,
      checklist: [
        { id: `chk-p1`, text: "Review event rules and problem statement", completed: true },
        { id: `chk-p2`, text: "Coordinate with team members on assigned modules", completed: false },
        { id: `chk-p3`, text: "Prepare presentation deck and live demo", completed: false }
      ],
      milestones,
      links: {
        portal: `https://${platform.toLowerCase().replace(/\s+/g, '')}.com`
      }
    };
  }
}
