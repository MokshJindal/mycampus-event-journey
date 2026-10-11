// ==========================================================================
// Initial Sample Data for MyCampus: Your Event Journey
// Rich, realistic campus events with multi-phase milestones, venues, and teams
// ==========================================================================

export const INITIAL_EVENTS = [
  {
    id: "evt-hack-iiitd-2026",
    title: "HackIIITD 2026: Quantum Leap",
    category: "Hackathon",
    platform: "Devpost",
    platformUrl: "https://devpost.com",
    stage: "in-prep", // registered, in-prep, finalist, completed, won
    registrationId: "HID26-TEAM-8942",
    teamName: "ByteCoders",
    teamMembers: [
      { name: "Moksh Jindal", role: "Full-Stack & Lead", avatar: "MJ" },
      { name: "Aarav Sharma", role: "AI/ML Engineer", avatar: "AS" },
      { name: "Diya Patel", role: "UI/UX & Pitch", avatar: "DP" },
      { name: "Rohan Sen", role: "Systems & Backend", avatar: "RS" }
    ],
    venue: {
      building: "R&D Block",
      room: "3rd Floor Main Auditorium & B-Wing Labs",
      campusZone: "North Campus",
      isVirtual: false,
      wifiSSID: "IIITD-Events-5G",
      wifiPass: "QuantumHack2026!"
    },
    color: "#3b82f6", // Blue accent
    icon: "code",
    skills: ["AI/ML", "React", "Cloud Architecture", "Pitching"],
    xpReward: 350,
    prizePool: "₹2,50,000",
    description: "Annual premier 36-hour flagship hackathon bringing 500+ student developers to build AI and systems innovations.",
    checklist: [
      { id: "chk-1", text: "Finalize problem statement and tech stack", completed: true },
      { id: "chk-2", text: "Prepare 5-slide architecture presentation", completed: false },
      { id: "chk-3", text: "Set up GitHub repository with CI/CD template", completed: true },
      { id: "chk-4", text: "Pack hardware test kits and HDMI adapters", completed: false },
      { id: "chk-5", text: "Record 2-minute elevator pitch video", completed: false }
    ],
    milestones: [
      {
        id: "m-h1",
        title: "Team Registration & Team Code Assigned",
        deadline: "2026-10-05T18:00:00",
        completed: true,
        phase: "Registration",
        location: "Devpost Portal",
        notes: "Registered under ByteCoders. Team code HID26-TEAM-8942 verified."
      },
      {
        id: "m-h2",
        title: "Round 1: Architecture PPT & Abstract Submission",
        deadline: "2026-10-18T23:59:00",
        completed: false,
        phase: "Submission",
        location: "Devpost Submission Portal",
        urgent: true,
        notes: "Strict 11:59 PM deadline. Max 10 slides PDF + Figma mockup link."
      },
      {
        id: "m-h3",
        title: "Shortlist Announcement & Mentor Allotment",
        deadline: "2026-10-21T16:00:00",
        completed: false,
        phase: "Shortlist",
        location: "Slack / Email Notice",
        notes: "Top 40 teams selected for 36-hour physical hack."
      },
      {
        id: "m-h4",
        title: "Hackathon Check-in & Hardware Swag Pickup",
        deadline: "2026-10-24T09:00:00",
        completed: false,
        phase: "Finale",
        location: "R&D Block Ground Floor Desk",
        notes: "Bring College ID card and signed parent consent form."
      },
      {
        id: "m-h5",
        title: "Mentorship Review Round 1",
        deadline: "2026-10-24T17:00:00",
        completed: false,
        phase: "Mentorship",
        location: "R&D Block Table #14",
        notes: "Live code walkthrough with Industry mentors (Google/Microsoft)."
      },
      {
        id: "m-h6",
        title: "Final Pitch Deck & Grand Jury Demo",
        deadline: "2026-10-25T14:30:00",
        completed: false,
        phase: "Finale",
        location: "C-Block Auditorium",
        notes: "5 minutes pitch + 3 minutes Q&A with venture capitalists."
      }
    ],
    links: {
      github: "https://github.com/mycampus-team/hackiiitd-entry",
      figma: "https://figma.com/@mycampus/hackiiitd",
      portal: "https://hackiiitd2026.devpost.com",
      whatsapp: "https://chat.whatsapp.com/demo-bytecoders"
    }
  },

  {
    id: "evt-sih-2026",
    title: "Smart India Hackathon (SIH) 2026: Campus Qualifier",
    category: "Hackathon",
    platform: "Internal Portal",
    platformUrl: "https://sih.gov.in",
    stage: "in-prep",
    registrationId: "SIH26-COL-441",
    teamName: "ByteCoders",
    teamMembers: [
      { name: "Moksh Jindal", role: "Team Lead", avatar: "MJ" },
      { name: "Aarav Sharma", role: "Member", avatar: "AS" },
      { name: "Diya Patel", role: "Member", avatar: "DP" },
      { name: "Sneha Roy", role: "Member", avatar: "SR" },
      { name: "Kabir Mehta", role: "Member", avatar: "KM" },
      { name: "Ananya Iyer", role: "Member", avatar: "AI" }
    ],
    venue: {
      building: "Old Academic Block",
      room: "Seminar Hall 1 (Ground Floor)",
      campusZone: "Central Campus",
      isVirtual: false,
      wifiSSID: "IIITD-Guest",
      wifiPass: "Innovation2026"
    },
    color: "#f59e0b", // Amber accent
    icon: "cpu",
    skills: ["National Challenge", "GovTech", "Edge AI", "System Design"],
    xpReward: 300,
    prizePool: "₹1,00,000",
    description: "Internal university nomination round to select the top 3 teams representing the university at SIH National Finals.",
    checklist: [
      { id: "chk-s1", text: "Select Problem Statement PS-1482 (Disaster Response Logistics)", completed: true },
      { id: "chk-s2", text: "Submit Ministry format proposal document", completed: false },
      { id: "chk-s3", text: "Faculty SPOC endorsement signature", completed: false }
    ],
    milestones: [
      {
        id: "m-s1",
        title: "Team Formation & SPOC Nomination",
        deadline: "2026-10-08T17:00:00",
        completed: true,
        phase: "Registration",
        location: "Dean Student Affairs Desk",
        notes: "6-member gender-diverse team confirmed by SPOC."
      },
      {
        id: "m-s2",
        title: "Internal PPT Submission & Solution Dossier",
        deadline: "2026-10-18T20:00:00", // CLASH with HackIIITD PPT!
        completed: false,
        phase: "Submission",
        location: "Internal SPOC Drive",
        urgent: true,
        notes: "Strict deadline. Evaluated by internal department jury."
      },
      {
        id: "m-s3",
        title: "Physical Jury Presentation & Q&A Defense",
        deadline: "2026-10-22T10:00:00",
        completed: false,
        phase: "Finale",
        location: "Old Academic Block Seminar Hall 1",
        notes: "Formal presentation in front of Academic Senate Committee."
      }
    ],
    links: {
      portal: "https://sih.gov.in",
      portalInternal: "https://campus-internal.edu/sih2026"
    }
  },

  {
    id: "evt-gdg-genai-2026",
    title: "GDG On-Campus: GenAI & WebAssembly Masterclass",
    category: "Workshop",
    platform: "Luma",
    platformUrl: "https://lu.ma/gdg-wasm-ai",
    stage: "registered",
    registrationId: "LUMA-TICK-90218",
    teamName: "Solo Participant",
    teamMembers: [
      { name: "Moksh Jindal", role: "Attendee", avatar: "MJ" }
    ],
    venue: {
      building: "Student Center",
      room: "Tech Sandbox Lab, 2nd Floor",
      campusZone: "East Campus",
      isVirtual: false,
      wifiSSID: "GDG-Open-Speed",
      wifiPass: "wasmgenai2026"
    },
    color: "#10b981", // Emerald accent
    icon: "sparkles",
    skills: ["GenAI", "WebAssembly", "Transformers.js", "ONNX Runtime"],
    xpReward: 150,
    prizePool: "Swag & Google Cloud Credits",
    description: "Hands-on engineering workshop by Google Developer Experts on deploying small language models in browser environments using WASM.",
    checklist: [
      { id: "chk-g1", text: "Install Node v24 & rustup toolchain", completed: true },
      { id: "chk-g2", text: "Claim Google Cloud $50 credit coupon", completed: false },
      { id: "chk-g3", text: "Star GitHub workshop starter repo", completed: true }
    ],
    milestones: [
      {
        id: "m-g1",
        title: "RSVP & Confirmation Pass Generated",
        deadline: "2026-10-10T12:00:00",
        completed: true,
        phase: "Registration",
        location: "Luma Event Page",
        notes: "QR pass sent to university email."
      },
      {
        id: "m-g2",
        title: "Hands-on Workshop & Live Hack Challenge",
        deadline: "2026-10-14T15:00:00",
        completed: false,
        phase: "Finale",
        location: "Student Center Tech Sandbox Lab",
        urgent: true,
        notes: "Bring fully charged laptop + USB Type-C charger."
      },
      {
        id: "m-g3",
        title: "Project Submission & GDG Certificate Claim",
        deadline: "2026-10-15T23:59:00",
        completed: false,
        phase: "Certificate",
        location: "Google Developer Student Club Portal",
        notes: "Push deployed web app to GitHub Pages for verified certificate."
      }
    ],
    links: {
      luma: "https://lu.ma/gdg-wasm-ai",
      repo: "https://github.com/gdg-campus/wasm-genai-starter"
    }
  },

  {
    id: "evt-acm-symposium-2026",
    title: "ACM Student Research Symposium 2026",
    category: "Conference",
    platform: "EasyChair",
    platformUrl: "https://easychair.org",
    stage: "finalist",
    registrationId: "ACM-CONF-774",
    teamName: "Research Duo",
    teamMembers: [
      { name: "Moksh Jindal", role: "Co-Author & Presenter", avatar: "MJ" },
      { name: "Prof. S. Sengupta", role: "Faculty Advisor", avatar: "SS" }
    ],
    venue: {
      building: "Library Building",
      room: "Executive Seminar Room 201",
      campusZone: "Central Quad",
      isVirtual: false,
      wifiSSID: "IIITD-Faculty-Net",
      wifiPass: "ResearchFirst"
    },
    color: "#8b5cf6", // Purple accent
    icon: "book-open",
    skills: ["Academic Research", "Distributed Systems", "Technical Writing", "Public Speaking"],
    xpReward: 400,
    prizePool: "Best Paper Award: ₹50,000",
    description: "Peer-reviewed research symposium showcasing undergraduate and graduate breakthroughs in high-performance computing.",
    checklist: [
      { id: "chk-a1", text: "Revise Camera Ready PDF based on reviewer feedback", completed: true },
      { id: "chk-a2", text: "Print 36x48 inch poster at campus print bureau", completed: false },
      { id: "chk-a3", text: "Submit signed IEEE/ACM copyright transfer form", completed: true }
    ],
    milestones: [
      {
        id: "m-a1",
        title: "Extended Abstract Submission",
        deadline: "2026-09-15T23:59:00",
        completed: true,
        phase: "Submission",
        location: "EasyChair Track 2",
        notes: "Double-blind review passed with score 4.2/5.0."
      },
      {
        id: "m-a2",
        title: "Acceptance Notice & Camera-Ready Paper",
        deadline: "2026-10-02T18:00:00",
        completed: true,
        phase: "Shortlist",
        location: "ACM Digital Library Submission",
        notes: "Selected for Oral Podium Presentation."
      },
      {
        id: "m-a3",
        title: "Oral Paper Defense & Poster Presentation",
        deadline: "2026-10-28T11:30:00",
        completed: false,
        phase: "Finale",
        location: "Library Executive Seminar Room 201",
        notes: "15 min presentation + 5 min Q&A from international reviewers."
      }
    ],
    links: {
      easychair: "https://easychair.org/conferences/?conf=acmsrs2026",
      paperDraft: "https://arxiv.org/abs/demo-paper-26"
    }
  },

  {
    id: "evt-fintech-disrupt-2026",
    title: "FinTech Disrupt: Algorithmic Trading Case Challenge",
    category: "Competition",
    platform: "Unstop",
    platformUrl: "https://unstop.com",
    stage: "registered",
    registrationId: "UNSTOP-REG-552190",
    teamName: "AlphaTraders",
    teamMembers: [
      { name: "Moksh Jindal", role: "Quantitative Dev", avatar: "MJ" },
      { name: "Tanvi Verma", role: "Financial Modeling", avatar: "TV" }
    ],
    venue: {
      building: "Old Academic Block",
      room: "Room 102 & Online Backtesting Sandbox",
      campusZone: "Central Campus",
      isVirtual: false,
      wifiSSID: "IIITD-Events-5G",
      wifiPass: "QuantumHack2026!"
    },
    color: "#06b6d4", // Cyan accent
    icon: "trending-up",
    skills: ["Python", "Backtesting", "Risk Management", "Statistical Arbitrage"],
    xpReward: 250,
    prizePool: "₹75,000 + PPI Interviews",
    description: "Design an algorithmic market-making and delta-hedging model tested on high-frequency order book historical data.",
    checklist: [
      { id: "chk-f1", text: "Download tick-level tick data from sandbox", completed: true },
      { id: "chk-f2", text: "Implement Sharpe ratio optimization filter", completed: false }
    ],
    milestones: [
      {
        id: "m-f1",
        title: "Registration & Online Quiz Round",
        deadline: "2026-10-12T19:00:00",
        completed: true,
        phase: "Registration",
        location: "Unstop Assessment Platform",
        notes: "Scored 94/100, qualified for Round 2 model submission."
      },
      {
        id: "m-f2",
        title: "Backtest Model Code & Executive Summary",
        deadline: "2026-10-21T18:00:00",
        completed: false,
        phase: "Submission",
        location: "Unstop Portal",
        urgent: false,
        notes: "Jupyter Notebook with documented Sharpe, Max Drawdown, and Sortino."
      },
      {
        id: "m-f3",
        title: "Final Trading Pitch to Goldman/Tower Capital Jury",
        deadline: "2026-10-26T15:00:00",
        completed: false,
        phase: "Finale",
        location: "Old Academic Block Room 102",
        notes: "Simulated paper trading demonstration."
      }
    ],
    links: {
      unstop: "https://unstop.com/competitions/fintech-disrupt-2026"
    }
  },

  {
    id: "evt-odyssey-2026",
    title: "Odyssey '26: Battle of the Bands & Production Stage",
    category: "Cultural",
    platform: "Campus Portal",
    platformUrl: "https://odyssey.iiitd.edu.in",
    stage: "registered",
    registrationId: "ODY-STAGE-304",
    teamName: "The Resonance Collective",
    teamMembers: [
      { name: "Moksh Jindal", role: "Audio Tech & Synth", avatar: "MJ" },
      { name: "Aarav Sharma", role: "Percussion", avatar: "AS" },
      { name: "Kunal Basu", role: "Lead Vocalist", avatar: "KB" }
    ],
    venue: {
      building: "Campus Amphitheatre",
      room: "Open Air Arena & Green Room 3",
      campusZone: "South Quad",
      isVirtual: false,
      wifiSSID: "IIITD-Events-5G",
      wifiPass: "QuantumHack2026!"
    },
    color: "#ec4899", // Pink accent
    icon: "music",
    skills: ["Live Production", "Sound Engineering", "Stage Presence"],
    xpReward: 180,
    prizePool: "₹60,000",
    description: "Annual university cultural fest musical showcase and inter-college battle of the bands.",
    checklist: [
      { id: "chk-o1", text: "Submit stage setup layout & audio rider", completed: true },
      { id: "chk-o2", text: "Soundcheck slot reservation", completed: false }
    ],
    milestones: [
      {
        id: "m-o1",
        title: "Audition Video & Track Submission",
        deadline: "2026-10-16T22:00:00",
        completed: true,
        phase: "Submission",
        location: "Google Drive Upload",
        notes: "Selected among top 6 campus bands."
      },
      {
        id: "m-o2",
        title: "Technical Soundcheck & Green Room Briefing",
        deadline: "2026-11-01T14:00:00",
        completed: false,
        phase: "Shortlist",
        location: "Campus Amphitheatre",
        notes: "30-minute line-in check with sound engineers."
      },
      {
        id: "m-o3",
        title: "Main Stage Live Performance",
        deadline: "2026-11-02T19:00:00",
        completed: false,
        phase: "Finale",
        location: "Campus Amphitheatre",
        notes: "20-minute set in front of 3,000+ fest attendees."
      }
    ],
    links: {
      portal: "https://odyssey.iiitd.edu.in"
    }
  },

  {
    id: "evt-ethindia-2026",
    title: "EthIndia '26: Asia's Largest Web3 Hackathon",
    category: "Hackathon",
    platform: "Devfolio",
    platformUrl: "https://ethindia.co",
    stage: "won", // Won podium badge!
    registrationId: "ETH26-DEV-9912",
    teamName: "ZkRollup Pioneers",
    teamMembers: [
      { name: "Moksh Jindal", role: "ZK Circuits & Smart Contracts", avatar: "MJ" },
      { name: "Aarav Sharma", role: "Zero-Knowledge Cryptographer", avatar: "AS" }
    ],
    venue: {
      building: "Main Expo Convention Centre & Hybrid Arena",
      room: "Booth #42 & Track Stage",
      campusZone: "Regional Venue",
      isVirtual: false,
      wifiSSID: "EthIndia-UltraFast",
      wifiPass: "buidl2026"
    },
    color: "#6366f1", // Indigo accent
    icon: "award",
    skills: ["Solidity", "Zero-Knowledge Proofs", "ZK-SNARKs", "ERC-4337"],
    xpReward: 500,
    prizePool: "Won ₹3,00,000 (1st Runner Up)",
    description: "Built private verifiable identity attestation for university student credentials using Circom and Noir circuits.",
    checklist: [
      { id: "chk-e1", text: "Submit smart contract code to GitHub", completed: true },
      { id: "chk-e2", text: "Deploy proof of concept to Arbitrum Sepolia", completed: true },
      { id: "chk-e3", text: "Pitch to Vitalik & Ethereum Foundation Jury", completed: true }
    ],
    milestones: [
      {
        id: "m-e1",
        title: "Devfolio Application & Stakeholder Review",
        deadline: "2026-08-20T23:59:00",
        completed: true,
        phase: "Registration",
        location: "Devfolio",
        notes: "Application accepted with hacker badge."
      },
      {
        id: "m-e2",
        title: "36-Hour Hackathon & Code Sprint",
        deadline: "2026-09-02T12:00:00",
        completed: true,
        phase: "Finale",
        location: "Main Convention Arena",
        notes: "Completed all test fixtures and deployed ZK verifier."
      },
      {
        id: "m-e3",
        title: "Podium Finish & Track Winner Award",
        deadline: "2026-09-03T18:00:00",
        completed: true,
        phase: "Podium",
        location: "Main Stage",
        notes: "Awarded 1st Runner Up in Privacy & Identity Track."
      }
    ],
    links: {
      devfolio: "https://devfolio.co/submissions/zk-creds-2026",
      github: "https://github.com/mycampus-team/zk-creds-noir"
    }
  }
];

export const CAMPUS_BUILDINGS = [
  {
    id: "b-rd",
    name: "R&D Block",
    code: "R&D",
    coords: { x: 310, y: 160 },
    description: "Advanced Computing Laboratories, Incubation Center & 3rd Floor Audi",
    facilities: ["High-Performance Cluster Lab", "Auditorium", "Incubation Hub", "Cafeteria B"],
    walkingDistances: {
      "b-oab": "3 mins",
      "b-sc": "6 mins",
      "b-lib": "4 mins",
      "b-amphi": "7 mins",
      "b-audi": "2 mins"
    }
  },
  {
    id: "b-oab",
    name: "Old Academic Block",
    code: "OAB",
    coords: { x: 490, y: 190 },
    description: "Lecture Halls 1-4, Seminar Hall 1, Administrative Offices",
    facilities: ["Seminar Hall 1", "Classrooms 101-205", "Dean Office", "Stationery Shop"],
    walkingDistances: {
      "b-rd": "3 mins",
      "b-sc": "4 mins",
      "b-lib": "3 mins",
      "b-amphi": "5 mins",
      "b-audi": "4 mins"
    }
  },
  {
    id: "b-lib",
    name: "Library Building",
    code: "LIB",
    coords: { x: 420, y: 310 },
    description: "Central Academic Library, Quiet Study Floors & Executive Seminar Room 201",
    facilities: ["Executive Seminar Room 201", "Digital Archives", "Discussion Cubicles", "Quiet Zone"],
    walkingDistances: {
      "b-rd": "4 mins",
      "b-oab": "3 mins",
      "b-sc": "3 mins",
      "b-amphi": "4 mins",
      "b-audi": "5 mins"
    }
  },
  {
    id: "b-sc",
    name: "Student Center",
    code: "SC",
    coords: { x: 620, y: 340 },
    description: "Tech Sandbox, Student Clubs Lounge, Food Court & Indoor Recreation",
    facilities: ["Tech Sandbox Lab", "Club Desks", "Main Food Court", "Recreation Lounge"],
    walkingDistances: {
      "b-rd": "6 mins",
      "b-oab": "4 mins",
      "b-lib": "3 mins",
      "b-amphi": "3 mins",
      "b-audi": "7 mins"
    }
  },
  {
    id: "b-amphi",
    name: "Campus Amphitheatre & Sports Arena",
    code: "AMPHI",
    coords: { x: 550, y: 470 },
    description: "Open-Air Amphitheatre, Green Rooms, Football Ground & Sports Complex",
    facilities: ["3,000 Capacity Open Arena", "Green Rooms 1-4", "Night Lighting", "Acoustic Stage"],
    walkingDistances: {
      "b-rd": "7 mins",
      "b-oab": "5 mins",
      "b-lib": "4 mins",
      "b-sc": "3 mins",
      "b-audi": "8 mins"
    }
  },
  {
    id: "b-audi",
    name: "C-Block Auditorium",
    code: "AUDI",
    coords: { x: 210, y: 280 },
    description: "Main University Auditorium, Grand Stage, VIP Guest Rooms",
    facilities: ["1,200 Seater Tiered Auditorium", "Sound & Lighting Console", "Press Box"],
    walkingDistances: {
      "b-rd": "2 mins",
      "b-oab": "4 mins",
      "b-lib": "5 mins",
      "b-sc": "7 mins",
      "b-amphi": "8 mins"
    }
  }
];
