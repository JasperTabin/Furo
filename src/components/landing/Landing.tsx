import { motion } from "motion/react";
import { useState } from "react";
import { AlarmClock, BarChart3, ChevronDown, Monitor } from "lucide-react";
import { STEPS, FEATURES, FAQS } from "./constants";
import { useScrollActiveIndex } from "./hooks";

interface LandingProps {
  onEnter: () => void;
}

// ── Navbar ─────────────────────────────────────────────────────────────────── (DONE)
function Navbar({ onEnter }: LandingProps) {
  return (
    <nav className="fixed top-6 left-1/2 z-50 flex w-[min(22rem,calc(100%-2rem))] -translate-x-1/2 items-center justify-between rounded-full border border-(--color-border)/80 px-3 py-2 ">
      <div className="px-4 text-2xl font-semibold">FURŌ</div>
      <button
        onClick={onEnter}
        className="rounded-full bg-(--color-fg) px-6 py-3 text-base font-medium text-(--color-bg) "
      >
        Open App
      </button>
    </nav>
  );
}

// ── First Section ────────────────────────────────────────────────────────────────────── (DONE)
function HeroSection({ onEnter }: LandingProps) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6 pb-16 pt-32 sm:px-10 lg:px-16">
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] xl:gap-24">
        <div className="text-left">
          <h1 className="mb-7 font-serif text-[clamp(68px,9vw,110px)] font-normal leading-[0.88] tracking-tight">
            <span className="block">One tab.</span>
            <em className="block not-italic text-(--color-fg)/60">
              All you need.
            </em>
          </h1>
          <p className="mb-10 max-w-lg text-lg text-(--color-fg)/70">
            Timer, tasks, and calendar — together in one distraction-free
            workspace. No switching. No friction.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={onEnter}
              className="rounded-full bg-(--color-fg) px-6 py-4 text-lead font-medium text-(--color-bg) transition hover:opacity-90"
            >
              Open Furō
            </button>
            <a
              href="#features"
              className="rounded-full border border-(--color-border) px-6 py-4 text-lead font-light text-(--color-fg) transition hover:bg-(--color-fg)/5"
            >
              See features
            </a>
          </div>
        </div>

        <div className="relative hidden h-136 items-center justify-center lg:flex">
          <div className="relative h-full w-full max-w-136 overflow-visible">
            <div className="absolute right-30 top-2 z-20 w-66 rounded-3xl border border-(--color-border)/80 p-5 ">
              <div className="mb-4 text-center text-lg font-light text-(--color-fg)/80">
                Pomodoro Timer
              </div>
              <div className="mb-5 text-center font-mono text-[4.5rem] font-semibold leading-none tracking-tight ">
                18:42
              </div>
              <div className="flex gap-2">
                <div className="flex-1 rounded-full bg-(--color-fg)/10 px-4 py-2 text-center font-mono text-base text-(--color-fg)/90">
                  PAUSE
                </div>
                <div className="flex-1 rounded-full bg-(--color-fg)/10 px-4 py-2 text-center font-mono text-base text-(--color-fg)/90">
                  STOP
                </div>
              </div>
            </div>

            {/* Calendar */}
            <div className="absolute bottom-17 left-10 z-10 w-60 rounded-3xl border border-(--color-border)/80 p-5">
              <div className="mb-4 grid grid-cols-7 text-center text-lead text-(--color-fg)/65">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <div key={i}>{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-2 text-center text-xs ">
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i < 4 ? null : i - 3;
                  const isActiveDay = day === 18;

                  return (
                    <div
                      key={i}
                      className={`mx-auto flex h-6 w-6 items-center justify-center rounded-full ${
                        day
                          ? isActiveDay
                            ? "bg-(--color-fg)/20 "
                            : "text-(--color-fg)"
                          : "text-transparent"
                      }`}
                    >
                      {day ?? ""}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TodoList */}
            <div className="absolute bottom-30 right-7 z-10 w-55 rounded-3xl border border-(--color-border)/80 p-5">
              <div className="mb-4 text-lg font-light text-(--color-fg)/80">
                Todo-list
              </div>
              <div className="space-y-3">
                {["Task 1", "Task 2", "Task 3"].map((task, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-base"
                  >
                    <span>{task}</span>
                    <span className="h-4 w-4 rounded-[0.3rem] border border-(--color-border)" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Second Section ────────────────────────────────────────────────────────────── (Done)
function HowItWorksSection() {
  const stepIcons = [Monitor, AlarmClock, BarChart3];

  return (
    <section className="border-t border-b border-(--color-border) px-6 py-18 sm:py-20">
      <div className="max-w-4xl mx-auto">
        <p className="mb-5 flex items-center gap-3 font-serif text-[clamp(2rem,3vw,3.1rem)] italic">
          <span className="h-px w-8 bg-(--color-border)/70" />
          How it works
        </p>
        <div className="grid overflow-hidden rounded-2xl border border-(--color-border)/80 sm:grid-cols-3">
          {STEPS.map((step, i, arr) => {
            const Icon = stepIcons[i] ?? Monitor;

            return (
              <article
                key={step.title}
                className={`flex min-h-46 flex-col px-8 py-8 sm:min-h-42 sm:px-9 sm:py-9 ${
                  i < arr.length - 1
                    ? "border-b border-(--color-border)/80 sm:border-b-0 sm:border-r"
                    : ""
                }`}
              >
                <div className="mb-4 flex items-center gap-3">
                  <Icon
                    className="h-4 w-4 shrink-0 text-(--color-fg)/65"
                    strokeWidth={1.9}
                  />
                  <h3 className="font-serif text-[clamp(1.55rem,1.8vw,1.85rem)] tracking-tight text-(--color-fg)/92">
                    {step.title}
                  </h3>
                </div>
                <p className="max-w-[18rem] text-sm leading-6 text-(--color-fg)/45 sm:text-[15px]">
                  {step.desc}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Third Section ────────────────────────────────────────────────────────── (Done)
function FeaturesSection() {
  const { containerRef, stickyRef, activeIndex } = useScrollActiveIndex(
    FEATURES.length,
  );
  const activeFeature = FEATURES[activeIndex] ?? FEATURES[0];

  if (!activeFeature) {
    return null;
  }

  const ActiveMock = activeFeature.Mockup;

  return (
    <section id="features" className="relative scroll-mt-24">
      <div
        ref={containerRef}
        style={{ height: `${(FEATURES.length + 1) * 100}dvh` }}
        className="hidden sm:block border-b border-(--color-border) relative"
      >
        <div
          ref={stickyRef}
          className="sticky top-0 h-dvh flex items-center overflow-hidden bg-(--color-bg)"
        >
          <div className="max-w-4xl mx-auto px-6 w-full grid grid-cols-2 gap-12 items-center">
            <div>
              <p className="mb-5 flex items-center gap-3 font-serif text-[clamp(2rem,3vw,3.1rem)] italic">
                <span className="h-px w-8 bg-(--color-border)/70" />
                Features
              </p>

              <div className="relative space-y-0">
                <div className="absolute w-px bg-(--color-border)/30 left-1.75 top-4 bottom-10" />
                {FEATURES.map((f, i) => (
                  <motion.div
                    key={f.title}
                    className="relative flex gap-5"
                    animate={{ opacity: activeIndex === i ? 1 : 0.22 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <motion.div
                      className="relative shrink-0 pt-1.5 rounded-full top-2 border z-10"
                      animate={{
                        width: activeIndex === i ? 13 : 8,
                        height: activeIndex === i ? 13 : 8,
                        marginLeft: activeIndex === i ? 0 : 3,
                        backgroundColor:
                          activeIndex === i ? "var(--color-fg)" : "transparent",
                        borderColor:
                          activeIndex === i
                            ? "var(--color-fg)"
                            : "var(--color-border)",
                      }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    />

                    <div className="pb-8 flex-1">
                      <h3
                        className={`font-serif font-normal leading-snug text-(--color-fg) transition-all duration-200 ${
                          activeIndex === i ? "text-lg" : "text-base"
                        }`}
                      >
                        {f.title}
                      </h3>
                      <motion.p
                        className="text-sm leading-relaxed text-(--color-fg)/50 max-w-65 overflow-hidden"
                        animate={{
                          maxHeight: activeIndex === i ? 80 : 0,
                          opacity: activeIndex === i ? 1 : 0,
                          marginTop: activeIndex === i ? 6 : 0,
                        }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        {f.desc}
                      </motion.p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full flex items-center"
            >
              <ActiveMock />
            </motion.div>
          </div>
        </div>
      </div>

      <section className="block sm:hidden border-t border-(--color-border) py-16 px-6">
        <p className="mb-5 flex items-center gap-2.5 font-serif text-[clamp(1.45rem,7vw,1.9rem)] italic">
          <span className="h-px w-7 bg-(--color-border)/70" />
          Features
        </p>

        <div className="space-y-14">
          {FEATURES.map((f) => {
            const Mock = f.Mockup;
            return (
              <div key={f.title}>
                <h3 className="font-serif text-xl font-normal mb-2">
                  {f.title}
                </h3>
                <p className="text-xs leading-relaxed text-(--color-fg)/50 mb-5">
                  {f.desc}
                </p>
                <div className="w-full">
                  <Mock />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
}

// ── Fourth Section ────────────────────────────────────────────────────────── (Done)
function WhySection() {
  return (
    <section className="border-b border-(--color-border) py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <p className="mb-5 flex items-center gap-3 font-serif text-[clamp(2rem,3vw,3.1rem)] italic">
          <span className="h-px w-8 bg-(--color-border)/70" />
          Why I built this
        </p>
        <p className="text-sm leading-relaxed text-(--color-fg)/50 mb-5">
          At first, I just needed a focus timer. But I kept switching tabs — one
          for the timer, another for my to-do list, another for the calendar.
          The switching itself was breaking my focus.
        </p>
        <p className="text-sm leading-relaxed text-(--color-fg)/50">
          So I built Furō: one place that holds everything I need to stay in
          flow. A timer, a task board, a calendar. That's it. Simple by design,
          not by accident.
        </p>
      </div>
    </section>
  );
}

// ── Fifth Section ─────────────────────────────────────────────────────────────────────── (Done)
export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="border-b border-(--color-border) py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <p className="mb-5 flex items-center gap-3 font-serif text-[clamp(2rem,3vw,3.1rem)] italic">
          <span className="h-px w-8 bg-(--color-border)/70" />
          FAQS
        </p>

        <dl>
          {FAQS.map((faq, i) => (
            <div
              key={faq.question}
              className="border-b border-(--color-border) last:border-b-0"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
                aria-controls={`faq-answer-${i}`}
                className="w-full py-4 text-left flex justify-between items-center gap-4 hover:text-(--color-fg) transition-colors"
              >
                <dt className="font-serif text-base font-light text-(--color-fg)/80">
                  {faq.question}
                </dt>
                <ChevronDown
                  className={`shrink-0 transition-transform duration-300 ease-in-out text-(--color-fg)/80 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                  size={18}
                />
              </button>
              <dd
                id={`faq-answer-${i}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === i ? "max-h-40 pb-4" : "max-h-0"
                }`}
              >
                <p className="text-sm leading-relaxed text-(--color-fg)/20">
                  {faq.answer}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

// ── Sixth Section ─────────────────────────────────────────────────────────────────────── (Done)
function CtaSection({ onEnter }: LandingProps) {
  return (
    <section className="py-32 px-6 text-center">
      <h2
        className="font-serif font-normal leading-[.94] tracking-tight mb-7"
        style={{ fontSize: "clamp(56px, 8vw, 108px)" }}
      >
        Your focus
        <br />
        <em className="text-(--color-fg)/40">starts here.</em>
      </h2>
      <p className="font-mono text-[9px] tracking-[.18em] uppercase text-(--color-fg)/40 mb-10">
        No account &nbsp;·&nbsp; No download &nbsp;·&nbsp; No friction
      </p>
      <button
        onClick={onEnter}
        className="px-4 py-2 text-base font-light bg-(--color-fg) text-(--color-bg)  rounded-full"
      >
        Open Furō
      </button>
    </section>
  );
}

// ── Last Section ──────────────────────────────────────────────────────────────────── (Done)
function Footer() {
  return (
    <footer className="border-t border-(--color-border) px-10 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <div className="font-mono text-sm font-bold tracking-[.14em]">FURŌ</div>
        <div className="text-xs text-(--color-fg)/40 mt-1">
          Built by Jasper Tabin
        </div>
      </div>
      <div className="text-xs text-(--color-fg)/20">
        © 2026 Furō. All rights reserved.
      </div>
    </footer>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────────
export function Landing({ onEnter }: LandingProps) {
  return (
    <div className="min-h-screen bg-(--color-bg) text-(--color-fg)">
      <Navbar onEnter={onEnter} />
      <HeroSection onEnter={onEnter} />
      <HowItWorksSection />
      <FeaturesSection />
      <WhySection />
      <FAQ />
      <CtaSection onEnter={onEnter} />
      <Footer />
    </div>
  );
}
