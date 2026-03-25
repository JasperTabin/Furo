import type { ComponentType } from "react";
import { AlarmClock, BarChart3, Monitor } from "lucide-react";
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

export interface Step {
  title: string;
  desc: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
}

export const STEPS: Step[] = [
  {
    title: "Open one tab",
    desc: "Zero distractions. One destination for your stream of consciousness.",
    icon: Monitor,
  },
  {
    title: "Set your session",
    desc: "Define your craft through structured intervals of deep work.",
    icon: AlarmClock,
  },
  {
    title: "Track your day",
    desc: "A visual record of focused time to guide tomorrow's flow.",
    icon: BarChart3,
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
      "It's for everyone who wants these productivity tools - Pomodoro, To-Do List, and Calendar - all in a single tab.",
  },
  {
    question: "What does the name 'Furo' mean?",
    answer:
      "Furo comes from the word 'flow' - it represents staying in the zone, focused, and productive.",
  },
];
