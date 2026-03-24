// ── Feature list ────────────────────────────────────────────────────────────
import type { ComponentType } from "react";
import {
  MockCalendar,
  MockKanban,
  MockMiniPlayer,
  MockMusic,
  MockPomodoro,
} from "./mockups";

export interface Feature {
  title: string;
  desc: string;
  Mockup: ComponentType;
}

export const FEATURES: Feature[] = [
  {
    title: "Pomodoro Timer",
    desc: "Classic countdown or Reverse mode. Focus on your own terms, without the pressure of a ticking clock.",
    Mockup: MockPomodoro,
  },
  {
    title: "Kanban Board",
    desc: "Drag tasks across To Do, Doing, and Done. Keep your work visible without switching tabs.",
    Mockup: MockKanban,
  },
  {
    title: "Calendar",
    desc: "Plan your days and set events without leaving the app. Your week, always in view.",
    Mockup: MockCalendar,
  },
  {
    title: "Music Player",
    desc: "Built-in ambient music to keep you in the zone. No extra tabs, no playlist hunting.",
    Mockup: MockMusic,
  },
  {
    title: "Mini Player",
    desc: "Your tasks, uninterrupted. Floats above your workspace so your timer stays visible.",
    Mockup: MockMiniPlayer,
  },
];

// ── How it works steps ──────────────────────────────────────────────────────
export interface Step {
  title: string;
  desc: string;
}

export const STEPS: Step[] = [
  {
    title: "Open one tab",
    desc: "No download, no account. Open Furō and your workspace is instantly ready — timer, tasks, and calendar all in one place.",
  },
  {
    title: "Set your session",
    desc: "Pick Classic to count down or Reverse to count up. Add your tasks for the day. Hit start and stay in the zone.",
  },
  {
    title: "Track your day",
    desc: "Move tasks across the board, mark events on the calendar. Your whole day stays visible and in control.",
  },
];

export interface FAQ {
  question: string;
  answer: string;
}

export const FAQS: FAQ[] = [
  {
    question: "Is this app free to use?",
    answer:
      "Yes, it's completely free. It's a personal project built for productivity and showcasing.",
  },
  {
    question: "Do I need an account or is my data collected?",
    answer:
      "No account is required, and no data is collected or shared. All your tasks, timers, and calendar events are saved locally on the device you use.",
  },
  {
    question: "Is it available on all devices?",
    answer:
      "It's responsive on most screens, but since I'm still practicing and this project is in early stages, some layouts (like tablets) may not be fully optimized yet.",
  },
  {
    question: "Who's this app for?",
    answer:
      "It's for everyone who wants these productivity tools — Pomodoro, To‑Do List, and Calendar — all in a single tab.",
  },
  {
    question: "What does the name 'Furo' mean?",
    answer:
      "Furo comes from the word 'flow' — it represents staying in the zone, focused, and productive.",
  },
];
