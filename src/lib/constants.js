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

export const CONTACT_INFO = {
  emailAcademic: "bscdelivery@futurense.com",
  emailProgram: "office_eep@iitj.ac.in",
  forumLink: "https://discourse.bscaiunity.space",
};

export const FOOTER_LINKS = {
  EXPLORE: [
    { href: "/ai-tools", label: "AI Tools" },
    { href: "/events", label: "Events" },
    { href: "/notices", label: "Notice Board" },
    { href: "/status-board", label: "Status Board" },
    { href: "/about-course", label: "About Course" },
  ],
  ACADEMICS: [
    { href: "/semester-quizzes", label: "Semester Quizzes" },
    { href: "/polls-surveys", label: "Polls & Surveys" },
    { href: "/student-achievements", label: "Achievements" },
    { href: "/know-your-rights", label: "Know Your Rights" },
  ],
  CONNECT: [
    { href: "/contact", label: "Contact Us" },
    { href: "https://bscaiunity.discourse.group/", label: "Discussion Forum", external: true },
    { href: "/add-concern", label: "Voice Concerns" },
    { href: "/concerns", label: "Browse Concerns" },
  ],
  LEGAL: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-of-service", label: "Terms of Service" },
  ],
};

export const SOCIAL_LINKS = [
  {
    name: "GitHub",
    href: "https://github.com/bscaiunity",
    icon: "Github",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/bscaiunity",
    icon: "Linkedin",
  },
  {
    name: "Twitter",
    href: "https://twitter.com/bscaiunity",
    icon: "Twitter",
  },
];

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
