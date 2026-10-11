// ==========================================================================
// Curated Campus Discovery Catalog
// Real-world collegiate opportunities that students can 1-click import into their journey
// ==========================================================================

export const DISCOVERY_EVENTS = [
  {
    id: "disc-google-solution-challenge",
    title: "Google Solution Challenge 2026",
    category: "Hackathon",
    platform: "Google Developers",
    platformUrl: "https://developers.google.com/community/gdsc-solution-challenge",
    organizer: "Google Developer Student Clubs",
    venue: {
      building: "Student Center",
      room: "Innovation Hub / Virtual",
      campusZone: "East Campus",
      isVirtual: false,
      wifiSSID: "IIITD-Events-5G",
      wifiPass: "QuantumHack2026!"
    },
    dates: "Nov 10 - Nov 25, 2026",
    prizePool: "$10,000 + Google Mentorship",
    xpReward: 450,
    skills: ["Flutter", "TensorFlow", "Firebase", "UN SDGs"],
    description: "Build a technology solution using Google products that addresses one or more of the United Nations 17 Sustainable Development Goals.",
    tags: ["Global", "Prizes", "Official Google"],
    defaultMilestones: [
      {
        id: "dm-1",
        title: "Team Registration & UN SDG Selection",
        deadline: "2026-11-10T23:59:00",
        completed: false,
        phase: "Registration",
        location: "Google Developer Portal",
        notes: "Teams of up to 4 university students."
      },
      {
        id: "dm-2",
        title: "Working Prototype & 3-Min YouTube Demo Submission",
        deadline: "2026-11-25T23:59:00",
        completed: false,
        phase: "Submission",
        location: "YouTube / GitHub / Form",
        notes: "Demonstrate working code and SDG impact metric."
      },
      {
        id: "dm-3",
        title: "Top 100 Global Semi-Finalist Announcement",
        deadline: "2026-12-10T18:00:00",
        completed: false,
        phase: "Shortlist",
        location: "Google Developers Blog",
        notes: "Receive mentorship from senior Google engineers."
      }
    ]
  },
  {
    id: "disc-ieee-embed-ai",
    title: "IEEE Embedded AI & Robotics Conclave 2026",
    category: "Conference",
    platform: "IEEE Xplore",
    platformUrl: "https://ieee.org",
    organizer: "IEEE Student Branch",
    venue: {
      building: "R&D Block",
      room: "Robotics Laboratory & Audi",
      campusZone: "North Campus",
      isVirtual: false,
      wifiSSID: "IIITD-Faculty-Net",
      wifiPass: "ResearchFirst"
    },
    dates: "Nov 05 - Nov 07, 2026",
    prizePool: "Best Demo Grant ₹40,000",
    xpReward: 320,
    skills: ["ROS 2", "Edge AI", "Embedded C++", "Computer Vision"],
    description: "Hands-on symposium featuring keynote lectures by Nvidia autonomous robotics scientists and live robotic arm obstacle demonstrations.",
    tags: ["IEEE Certified", "Robotics", "Hardware"],
    defaultMilestones: [
      {
        id: "dm-ie-1",
        title: "Delegate Registration & Hardware Kit Allocation",
        deadline: "2026-10-30T18:00:00",
        completed: false,
        phase: "Registration",
        location: "IEEE Portal",
        notes: "Early bird student registration passes."
      },
      {
        id: "dm-ie-2",
        title: "Live Hardware Hack & ROS 2 Challenge",
        deadline: "2026-11-06T14:00:00",
        completed: false,
        phase: "Finale",
        location: "R&D Block Robotics Lab",
        notes: "Deploy real-time path planning on autonomous rover."
      }
    ]
  },
  {
    id: "disc-tedx-iiitd",
    title: "TEDxCampus 2026: Beyond Horizons",
    category: "Conference",
    platform: "TED / Campus Desk",
    platformUrl: "https://ted.com",
    organizer: "TEDx University Chapter",
    venue: {
      building: "C-Block Auditorium",
      room: "Main Auditorium",
      campusZone: "Central Campus",
      isVirtual: false,
      wifiSSID: "IIITD-Events-5G",
      wifiPass: "QuantumHack2026!"
    },
    dates: "Nov 15, 2026",
    prizePool: "Curated Swag Bag & Networking",
    xpReward: 200,
    skills: ["Idea Generation", "Networking", "Design Thinking"],
    description: "An afternoon of thought-provoking ideas, pioneering speakers from aerospace, neurotech, and social innovation, and musical acts.",
    tags: ["TEDx Official", "Inspiration", "Networking"],
    defaultMilestones: [
      {
        id: "dm-ted-1",
        title: "Attendee Ticket Confirmation & Seat Number Issued",
        deadline: "2026-10-25T20:00:00",
        completed: false,
        phase: "Registration",
        location: "TEDx Desk",
        notes: "Exclusive access badge with student roll number."
      },
      {
        id: "dm-ted-2",
        title: "Auditorium Doors Open & Red Dot Keynotes",
        deadline: "2026-11-15T09:30:00",
        completed: false,
        phase: "Finale",
        location: "C-Block Auditorium",
        notes: "Formal or smart-casual attire recommended."
      }
    ]
  },
  {
    id: "disc-uiux-design-jam",
    title: "Campus Design Sprint: AI Interaction Paradigms",
    category: "Competition",
    platform: "Figma Community",
    platformUrl: "https://figma.com",
    organizer: "Campus Design Guild",
    venue: {
      building: "Student Center",
      room: "Design Innovation Lab",
      campusZone: "East Campus",
      isVirtual: false,
      wifiSSID: "GDG-Open-Speed",
      wifiPass: "wasmgenai2026"
    },
    dates: "Oct 29 - Oct 30, 2026",
    prizePool: "₹50,000 + 1-Year Figma Enterprise & Spline Pro",
    xpReward: 280,
    skills: ["Figma", "Design Systems", "Micro-interactions", "Generative UI"],
    description: "24-hour design sprint challenging designers to re-imagine human-AI workflows for multimodal creative assistants.",
    tags: ["Design", "Figma", "Sprint"],
    defaultMilestones: [
      {
        id: "dm-ui-1",
        title: "Figma Team File Setup & Prompt Release",
        deadline: "2026-10-29T10:00:00",
        completed: false,
        phase: "Registration",
        location: "Figma Jam Board",
        notes: "Secret prompt unveiled at 10 AM sharp."
      },
      {
        id: "dm-ui-2",
        title: "Interactive Prototype & Case Study Deck",
        deadline: "2026-10-30T12:00:00",
        completed: false,
        phase: "Submission",
        location: "Design Guild Submission Link",
        notes: "Must include interactive Figma prototype link + video walkthrough."
      }
    ]
  }
];
