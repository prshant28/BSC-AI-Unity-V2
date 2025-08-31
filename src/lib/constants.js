import React from "react";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/add-concern", label: "Add Concern" },
  { href: "/ai-tools", label: "AI Tools" },
  { href: "/concerns", label: "Concerns" },
  { href: "/events", label: "Event" },
  { href: "/notices", label: "Notice Board" },
  { href: "/contact", label: "Contact Us" },
  { href: "/status-board", label: "Status Board" },
  { href: "/admin-login", label: "Admin Login" },
];

export const TYPING_TEXTS_HERO = [
  "Raising Our Voice",
  "Pioneering the Future",
  "United as the First Batch",
  "Fairness, Transparency, Growth",
  "IIT Jodhpur's Online B.Sc. AI & DS",
];

export const HERO_SUBHEADING =
  "We are the trailblazing first batch of the B.Sc. (Applied AI & Data Science) program at IIT Jodhpur. This is our united platform for progress and advocacy.";

export const HERO_ADDITIONAL_INFO = [
  "No JEE required for admission.",
  "Flexible 4-year stackable model: Certificate → Diploma → BSc → BS.",
  "Join a community of innovators and leaders.",
];

export const HERO_CTA_BUTTONS = [
  { href: "/add-concern", label: "Add Your Concern", variant: "default" },
  { href: "/concerns", label: "View All Concerns", variant: "outline" },
  {
    href: "/about-course",
    label: "Learn About The Course",
    variant: "secondary",
  },
];

export const CONCERN_TYPES = [
  "Exam",
  "Lectures",
  "Futurense",
  "Mental Health",
  "Administrative",
  "Technical",
  "Fees & Payments",
  "Campus Immersion",
  "Other",
];

export const CONCERN_STATUSES = {
  NEW: "New",
  UNDER_REVIEW: "Under Review",
  SOLVED: "Solved",
  IGNORED: "Ignored",
};

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
  ],
};

export const SOCIAL_LINKS = [];

export const SEMESTER_1_SUBJECTS = [
  {
    id: "ATA",
    name: "Algorithmic Thinking and its Applications",
    color: "bg-gradient-to-br from-blue-500 to-blue-700",
    icon: "Cpu",
  },
  {
    id: "BDA",
    name: "Basics Of Data Analytics",
    color: "bg-gradient-to-br from-green-500 to-green-700",
    icon: "BarChart3",
  },
  {
    id: "FSP",
    name: "Foundations Of Statistics and Probability",
    color: "bg-gradient-to-br from-purple-500 to-purple-700",
    icon: "Sigma",
  },
  {
    id: "LANA",
    name: "Linear Algebra and Numerical Analysis",
    color: "bg-gradient-to-br from-red-500 to-red-700",
    icon: "SquareRoot",
  },
];