/**
 * ─────────────────────────────────────────────────────────────
 *  EDIT ME — all event copy, dates, links and sponsors live here.
 *  Items marked TBA / placeholder should be replaced with real
 *  event details before the site goes public.
 * ─────────────────────────────────────────────────────────────
 */

export const REGISTER_URL = '#register';          // ← replace with your Google Form / registration link
export const SPONSOR_MAIL = 'mailto:circuitverse@example.com?subject=Sponsoring%20IEEE%20Circuit%20Verse'; // placeholder
export const ORGANISER = 'IEEE Kerala Section';

export const NAV = [
  { label: 'Home', href: '#home', keys: ['home', 'about'] },
  { label: 'Events', href: '#events', keys: ['events', 'workshop', 'hackathon'] },
  { label: 'Tracks', href: '#tracks', keys: ['tracks'] },
  { label: 'Timeline', href: '#timeline', keys: ['timeline', 'prizes'] },
  { label: 'FAQs', href: '#faqs', keys: ['faqs', 'sponsors', 'register'] },
] as const;

export const PILLARS = [
  { icon: 'build', title: 'Build', text: 'Move from schematics to working hardware. Learn by soldering, probing, simulating and debugging real circuits.' },
  { icon: 'innovate', title: 'Innovate', text: 'Prototype bold ideas under a ticking clock and pressure-test them with mentors and fellow engineers.' },
  { icon: 'connect', title: 'Connect', text: 'Meet makers, mentors and IEEE volunteers who share your obsession with electronics, code and systems.' },
] as const;

export const WORKSHOP = {
  blurb:
    'Part one of the odyssey. A guided, hands-on session where circuits stop being diagrams and start doing things. You leave with practical skills and a prototype you built yourself.',
  learn: [
    'Circuit design fundamentals and reading real schematics',
    'Microcontrollers, sensors and signal interfacing',
    'Simulation, measurement and systematic debugging',
    'From breadboard prototype to a working system',
  ],
  facts: [
    { k: 'Format', v: 'Hands-on lab session' },
    { k: 'Date', v: 'To be announced' },
    { k: 'Venue', v: 'To be announced' },
    { k: 'Seats', v: 'Limited — register early' },
  ],
};

export const HACKATHON = {
  blurb:
    'Part two. Form a team, pick a real-world problem, and turn a circuit idea into a working solution — then pitch it to a panel of engineers and mentors.',
  facts: [
    { k: 'Format', v: 'Team-based build sprint' },
    { k: 'Date', v: 'To be announced' },
    { k: 'Venue', v: 'To be announced' },
    { k: 'Team size', v: 'To be announced' },
  ],
  tracks: [
    { icon: 'cpu', name: 'Embedded & IoT', text: 'Connected devices, sensor networks and low-power firmware that sense and act on the real world.' },
    { icon: 'bot', name: 'AI at the Edge', text: 'Put intelligence on tiny hardware — vision, audio and prediction without the cloud.' },
    { icon: 'leaf', name: 'Energy & Sustainability', text: 'Power electronics, monitoring and smart-grid ideas that waste less and last longer.' },
    { icon: 'radio', name: 'Smart Systems & Automation', text: 'Robotics, control and automation solutions for industry, campus and community.' },
  ],
};

export const TIMELINE = [
  { when: 'Phase 01', title: 'Registrations open', text: 'Sign up for the Workshop, the Hackathon, or both.', date: 'Date TBA' },
  { when: 'Phase 02', title: 'Workshop', text: 'Hands-on circuits and systems session with mentors.', date: 'Date TBA' },
  { when: 'Phase 03', title: 'Hackathon kick-off', text: 'Problem statements revealed, teams lock in and the build begins.', date: 'Date TBA' },
  { when: 'Phase 04', title: 'Build & mentor rounds', text: 'Prototype, test and iterate with mentor check-ins.', date: 'Date TBA' },
  { when: 'Phase 05', title: 'Demo & judging', text: 'Teams present working prototypes to the judging panel.', date: 'Date TBA' },
  { when: 'Phase 06', title: 'Results & closing', text: 'Winners announced, certificates handed out, circuits powered down.', date: 'Date TBA' },
];

export const PRIZES = [
  { place: '2nd', title: 'First Runner-up', amount: 'Prize TBA', tier: 2 },
  { place: '1st', title: 'Winner', amount: 'Prize TBA', tier: 1 },
  { place: '3rd', title: 'Second Runner-up', amount: 'Prize TBA', tier: 3 },
];

export const BENEFITS = [
  { icon: 'award', title: 'Certificates', text: 'Participation and achievement certificates.' },
  { icon: 'users', title: 'Mentorship', text: 'Guidance from engineers and IEEE volunteers.' },
  { icon: 'rocket', title: 'Showcase', text: 'Present your prototype to a live panel.' },
  { icon: 'gift', title: 'Goodies', text: 'Swag and surprises for participants.' },
  { icon: 'network', title: 'Networking', text: 'Meet makers, peers and industry people.' },
  { icon: 'zap', title: 'Real skills', text: 'Take home techniques you can use tomorrow.' },
];

export const FAQS = [
  { q: 'Who can participate?', a: 'Circuit Verse is built for students and early-career makers who like electronics, embedded systems and building things. Final eligibility details will be published with registration.' },
  { q: 'Do I need prior experience?', a: 'The Workshop starts from fundamentals, and the Hackathon welcomes ideas at every level. Curiosity matters more than a long CV.' },
  { q: 'Can I join only the Workshop or only the Hackathon?', a: 'Yes. They are two parts of one odyssey, but you can register for either — or both for the full Circuit Verse experience.' },
  { q: 'How do teams work in the Hackathon?', a: 'You build in teams. Team size and formation rules will be announced; if you do not have a team yet, you can find teammates at the Workshop.' },
  { q: 'What should I bring?', a: 'A laptop, a charger and your own energy. Specific hardware requirements, if any, will be shared before the event.' },
  { q: 'Is there a registration fee?', a: 'Fee details will be announced with registration. Check this page and our IEEE channels for updates.' },
];

export const SPONSOR_SLOTS = [
  { tier: 'Title Sponsor', slots: 1 },
  { tier: 'Associate Sponsors', slots: 3 },
  { tier: 'Community Partners', slots: 4 },
];
