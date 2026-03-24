import { motion } from "motion/react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { STEPS, FEATURES, FAQS } from "./constants";
import { useScrollActiveIndex } from "./hooks";

interface LandingProps {
  onEnter: () => void;
}

// ── Navbar ─────────────────────────────────────────────────────────────────── (DONE)
function Navbar({ onEnter }: LandingProps) {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-60 px-6 py-3 flex items-center justify-between gap-4 bg-(--color-bg)/40 rounded-full border border-(--color-border)">
      <div className="font-mono text-sm font-bold tracking-[.16em]">FURŌ</div>
      <button
        onClick={onEnter}
        className="px-4 py-1.5 text-xs bg-(--color-fg) text-(--color-bg) rounded-full"
      >
        Open App
      </button>
    </nav>
  );
}

// ── First Section ────────────────────────────────────────────────────────────────────── (DONE)
function HeroSection({ onEnter }: LandingProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-left">
          <h1 className="font-serif font-normal leading-[.95] tracking-tight mb-8 text-[clamp(64px,9vw,100px)]">
            One tab.
            <br />
            <em className="text-(--color-fg)/40">All you need.</em>
          </h1>
          <p className="text-sm leading-relaxed mb-10 max-w-sm text-(--color-fg)/50">
            Timer, tasks, and calendar — together in one distraction-free
            workspace. No switching. No friction.
          </p>
          <div className="flex gap-2.5 flex-wrap">
            <button
              onClick={onEnter}
              className="px-4 py-2 text-base font-light bg-(--color-fg) text-(--color-bg)  rounded-full"
            >
              Open Furō
            </button>
            <a
              href="#features"
              className="px-4 py-2 text-base font-extralight border border-(--color-border) text-(--color-fg)/50  rounded-full"
            >
              See features
            </a>
          </div>
        </div>

        <div className="relative hidden lg:flex items-center justify-center h-124">
          <div className="relative w-full h-full overflow-hidden rounded-xl">
            <div className="absolute z-10 right-60 top-30 w-40 p-3 rounded-xl border border-(--color-border) ">
              <div className="font-mono text-xs text-(--color-fg) text-center">
                Pomodoro Timer
              </div>
              <div className="font-mono font-bold mb-2 leading-none text-4xl text-center">
                18:42
              </div>
              <div className="flex gap-1.5 justify-center">
                <div className="font-mono px-2 py-0.5 text-xs rounded-sm text-(--color-fg)/70 border border-(--color-border)">
                  PAUSE
                </div>
                <div className="font-mono px-2 py-0.5 text-xs rounded-sm text-red-500 border border-red-500/40 transition">
                  STOP
                </div>
              </div>
            </div>

            <div className="absolute z-10 right-10 top-20 w-45 p-3 rounded-xl border border-(--color-border)">
              <div className="font-mono text-xm text-(--color-fg) mb-2">
                Calendar
              </div>
              <div className="grid grid-cols-7 gap-0.5 text-xs text-center">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <div key={i} className="opacity-50">
                    {d}
                  </div>
                ))}
                {Array.from({ length: 35 }, (_, i) => (
                  <div key={i} className="py-0.5">
                    {i < 3 ? "" : i > 32 ? "" : i - 2}
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute z-10 right-30 bottom-18 w-48 p-3 rounded-xl border border-(--color-border)">
              <div className="font-mono text-xs text-(--color-fg) mb-2">
                Todo-list
              </div>
              <div className="space-y-1">
                {["Task 1", "Task 2", "Task 3"].map((task, i) => (
                  <div
                    key={i}
                    className="bg-(--color-border)/20 rounded p-1.5 text-xs"
                  >
                    {task}
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
  return (
    <section className="border-t border-b border-(--color-border) py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[.2em] text-(--color-fg)/40 mb-10">
          <span className="w-5 h-px bg-(--color-border)" /> How it works
        </p>
        <div className="grid sm:grid-cols-3 border border-(--color-border) rounded-xl overflow-hidden">
          {STEPS.map((step, i, arr) => (
            <div
              key={step.title}
              className={`p-8 ${i < arr.length - 1 ? "border-b sm:border-b-0 sm:border-r border-(--color-border)" : ""}`}
            >
              <h3 className="font-serif text-xl font-bold mb-3">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-(--color-fg)/50">
                {step.desc}
              </p>
            </div>
          ))}
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
          <div className="max-w-6xl mx-auto px-6 w-full grid grid-cols-2 gap-12 items-center">
            <div>
              <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[.2em] text-(--color-fg)/40 mb-10">
                <span className="w-5 h-px bg-(--color-border)" /> Features
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
                          activeIndex === i ? "text-xl" : "text-base"
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
        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[.2em] text-(--color-fg)/40 mb-10">
          <span className="w-5 h-px bg-(--color-border)" /> Features
        </p>
        <div className="space-y-14">
          {FEATURES.map((f) => {
            const Mock = f.Mockup;
            return (
              <div key={f.title}>
                <h3 className="font-serif text-2xl font-normal mb-2">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-(--color-fg)/50 mb-5">
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
      <div className="max-w-2xl mx-auto">
        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[.2em] text-(--color-fg)/40 mb-10">
          <span className="w-5 h-px bg-(--color-border)" /> Why I built this
        </p>
        <h2
          className="font-serif font-normal leading-snug mb-8"
          style={{ fontSize: "clamp(28px, 4vw, 46px)" }}
        >
          It started as a simple Pomodoro timer.
        </h2>
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
        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[.25em] text-(--color-fg)/40 mb-8">
          <span className="w-8 h-px bg-(--color-border)" /> Frequently Asked
          Questions
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
