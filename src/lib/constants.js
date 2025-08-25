import React from 'react';

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/concerns", label: "Concerns" },
  { href: "/add-concern", label: "Add Concern" },
  { href: "/status-board", label: "Status Board" },
  { href: "/about-course", label: "About Course" },
  { href: "/contact", label: "Contact" },
];

export const TYPING_TEXTS_HERO = [
  "Raising Our Voice",
  "Pioneering the Future",
  "United as the First Batch",
  "Fairness, Transparency, Growth",
  "IIT Jodhpur's Online B.Sc. AI/DS",
];

export const HERO_SUBHEADING = "We are the trailblazing first batch of the B.Sc. (Applied AI & Data Science) program at IIT Jodhpur, in collaboration with Futurense. This is our united platform for progress and advocacy.";

export const HERO_ADDITIONAL_INFO = [
  "Fully online, industry-focused degree.",
  "No JEE required for admission.",
  "Flexible 4-year stackable model: Certificate → Diploma → BSc → BS.",
  "Join a community of innovators and leaders."
];

export const HERO_CTA_BUTTONS = [
  { href: "/add-concern", label: "Add Your Concern", variant: "default" },
  { href: "/concerns", label: "View All Concerns", variant: "outline" },
  { href: "/about-course", label: "Learn About The Course", variant: "secondary" },
];

export const CONCERN_TYPES = [
  "Exam",
  "Lectures",
  "Futurense",
  "Mental Health",
  "Administrative",
  "Technical",
  "Fee & Payments",
  "Campus Immersion",
  "Other",
];

export const CONCERN_STATUSES = {
  NEW: "New",
  UNDER_REVIEW: "Under Review",
  SOLVED: "Solved",
  IGNORED: "Ignored",
};

// SAMPLE_CONCERNS and CONCERNS_STORAGE_KEY are no longer needed as data comes from Supabase.
// They are removed to avoid confusion. If needed for fallback, they can be reinstated.

export const FOOTER_LINKS = {
  EXPLORE: [
    { href: "/about-course", label: "About The Course" },
    { href: "/concerns", label: "View Concerns" },
    { href: "/status-board", label: "Status Dashboard" },
    { href: "/know-your-rights", label: "Student Rights" },
  ],
  CONNECT: [
    { href: "/contact", label: "Contact Us" },
    { href: "/add-concern", label: "Submit a Concern" },
  ],
  LEGAL: [
    { href: "/privacy-policy", label: "Privacy Policy (Placeholder)" },
    { href: "/terms-of-service", label: "Terms of Service (Placeholder)" },
  ]
};

export const SOCIAL_LINKS = [];