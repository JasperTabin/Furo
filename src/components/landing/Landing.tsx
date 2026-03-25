import { motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { STEPS, FEATURES, FAQS } from "./constants";
import { useScrollActiveIndex } from "./hooks";

interface LandingProps {
  onEnter: () => void;
}
// ── Shared styles ─────────────────────────────────────────────────────── (Done)
const SECTION_WRAP_CLASS = "mx-auto w-full max-w-5xl";

// ── Reusable Section Heading ─────────────────────────────────────────────────────── (Done)
function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-8">
      <h2 className="flex items-center gap-3 font-serif text-[clamp(2rem,3vw,3.1rem)] italic tracking-tight">
        <span className="h-px w-8 bg-(--color-border)/70" />
        {title}
      </h2>
    </div>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────────────── (DONE)
function Navbar({ onEnter }: LandingProps) {
  return (
    <nav
      aria-label="Primary"
      className="fixed top-5 left-1/2 z-50 flex w-[min(25rem,calc(100%-2rem))] -translate-x-1/2 items-center justify-between rounded-full border border-(--color-border)/55 bg-(--color-bg)/70 px-3 py-2 backdrop-blur-xl"
    >
      <div className="px-4 font-serif text-2xl font-semibold tracking-[0.08em]">
        FURŌ
      </div>
      <button
        type="button"
        onClick={onEnter}
        className="rounded-full bg-(--color-fg) px-5 py-2.5 text-sm font-medium uppercase tracking-[0.16em] text-(--color-bg) hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-fg) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-bg)"
      >
        Open App
      </button>
    </nav>
  );
}

// ── First Section ────────────────────────────────────────────────────────────────────── (DONE)
function HeroSection({ onEnter }: LandingProps) {
  const weekdayLabels = ["S", "M", "T", "W", "T", "F", "S"] as const;
  const heroTasks = ["Task 1", "Task 2", "Task 3"] as const;

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6 pb-16 pt-16 sm:px-10 lg:px-16">
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] xl:gap-24">
        <div className="text-left">
          <h1 className="mb-7 font-serif text-[clamp(68px,9vw,110px)] font-normal leading-[0.88] tracking-tight">
            <span className="block">One tab.</span>
            <em className="block not-italic text-(--color-fg)/58">
              All you need.
            </em>
          </h1>
          <p className="mb-10 max-w-xl text-lg leading-8 text-(--color-fg)/68">
            Timer, tasks, and calendar — together in one distraction-free
            workspace. Designed like a quiet desk: everything present, nothing
            competing for attention.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={onEnter}
              className="rounded-full bg-(--color-fg) px-6 py-4 text-lead font-medium text-(--color-bg) hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-fg) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-bg)"
            >
              Open Furō
            </button>
            <a
              href="#features"
              className="rounded-full border border-(--color-border) px-6 py-4 text-lead font-light text-(--color-fg) hover:bg-(--color-fg)/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-fg) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-bg)"
            >
              See features
            </a>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="relative hidden h-120 items-center justify-center lg:flex xl:h-136"
        >
          <div className="relative h-full w-full max-w-lg overflow-visible xl:max-w-136">
            <div className="absolute right-21 top-7 z-20 w-56 rounded-4xl border border-(--color-border) p-4 xl:right-31 xl:w-66 xl:p-5">
              <div className="mb-3 text-center text-base font-light text-(--color-fg)/80 xl:mb-4 xl:text-lg">
                Pomodoro Timer
              </div>
              <div className="mb-4 text-center font-mono text-[3.8rem] font-semibold leading-none tracking-tight xl:mb-5 xl:text-[4.5rem]">
                18:42
              </div>
              <div className="flex gap-2">
                <div className="flex-1 rounded-full bg-(--color-fg)/10 px-4 py-2 text-center font-mono text-sm text-(--color-fg)/90 xl:text-base">
                  PAUSE
                </div>
                <div className="flex-1 rounded-full bg-(--color-fg)/10 px-4 py-2 text-center font-mono text-sm text-(--color-fg)/90 xl:text-base">
                  STOP
                </div>
              </div>
            </div>

            {/* Calendar */}
            <div className="absolute right-50 top-55 z-10 w-52 rounded-4xl border border-(--color-border) p-4 xl:top-65 xl:right-65 xl:w-60 xl:p-5">
              <div className="mb-3 grid grid-cols-7 text-center text-sm text-(--color-fg)/65 xl:mb-4 xl:text-lead">
                {weekdayLabels.map((dayLabel, index) => (
                  <div key={`${dayLabel}-${index}`}>{dayLabel}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-2 text-center text-[11px] xl:text-xs">
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i < 4 ? null : i - 3;
                  const isActiveDay = day === 18;

                  return (
                    <div
                      key={i}
                      className={`mx-auto flex h-5 w-5 items-center justify-center rounded-full xl:h-6 xl:w-6 ${
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
            <div className="absolute top-55 right-0 z-10 w-48 rounded-4xl border border-(--color-border) p-4 xl:right-7 xl:top-65 xl:w-55 xl:p-5">
              <div className="mb-3 text-base font-light text-(--color-fg)/80 xl:mb-4 xl:text-lg">
                Todo-list
              </div>
              <div className="space-y-3">
                {heroTasks.map((task) => (
                  <div
                    key={task}
                    className="flex items-center justify-between text-sm xl:text-base"
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
  return (
    <section className="border-y border-(--color-border)/60 px-6 py-0">
      <div className="mx-auto w-full max-w-7xl">
        <div className="sm:grid sm:grid-cols-3">
          {STEPS.map((step, i, arr) => {
            const Icon = step.icon;
            return (
              <article
                key={step.title}
                className={`flex min-h-40 flex-col items-center justify-center px-6 py-10 text-center sm:min-h-52 sm:px-8 ${
                  i < arr.length - 1
                    ? "border-b border-(--color-fg)/8 sm:border-b-0 sm:border-r"
                    : ""
                }`}
              >
                <div className="mb-3 flex items-center justify-center gap-3 whitespace-nowrap text-(--color-fg)">
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.7} />
                  <h3 className="font-serif text-[clamp(1.5rem,2vw,2.35rem)] font-normal tracking-tight text-(--color-fg)">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-3 max-w-68 text-[11px] uppercase tracking-[0.18em] text-(--color-fg)/40 sm:text-sm">
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
  const prefersReducedMotion = useReducedMotion();
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
        className="relative hidden border-b border-(--color-border)/60 sm:block"
      >
        <div
          ref={stickyRef}
          className="sticky top-0 h-dvh flex items-center overflow-hidden bg-(--color-bg)"
        >
          <div
            className={`${SECTION_WRAP_CLASS} grid grid-cols-2 items-center gap-12 px-6`}
          >
            <div>
              <SectionHeading title="Features" />

              <div aria-live="polite" className="relative space-y-0">
                <div className="absolute w-px bg-(--color-border)/30 left-1.75 top-4 bottom-10" />
                {FEATURES.map((f, i) => (
                  <motion.div
                    key={f.title}
                    className="relative flex gap-5"
                    animate={{ opacity: activeIndex === i ? 1 : 0.22 }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { duration: 0.25, ease: "easeOut" }
                    }
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
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { duration: 0.2, ease: "easeOut" }
                      }
                    />

                    <div className="pb-8 flex-1">
                      <h3
                        className={`font-serif font-normal leading-snug text-(--color-fg) ${
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
                        transition={
                          prefersReducedMotion
                            ? { duration: 0 }
                            : { duration: 0.2, ease: "easeOut" }
                        }
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
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.3, ease: "easeOut" }
              }
              className="flex w-full items-center justify-center"
            >
              <div className="w-full max-w-136">
                <ActiveMock />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <section className="block border-t border-(--color-border)/60 px-6 py-16 sm:hidden">
        <div className={SECTION_WRAP_CLASS}>
          <SectionHeading title="Features" />

          <div className="space-y-14">
            {FEATURES.map((f) => {
              const Mock = f.Mockup;
              return (
                <div key={f.title}>
                  <h3 className="mb-2 font-serif text-xl font-normal">
                    {f.title}
                  </h3>
                  <p className="mb-5 text-xs leading-relaxed text-(--color-fg)/50">
                    {f.desc}
                  </p>
                  <div className="w-full">
                    <Mock />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </section>
  );
}

// ── Fourth Section ────────────────────────────────────────────────────────── (Done)
function WhySection() {
  return (
    <section className="border-b border-(--color-border)/60 px-6 py-24">
      <div className={SECTION_WRAP_CLASS}>
        <SectionHeading title="Why I built this" />
        <div className="space-y-6 text-sm leading-8 text-(--color-fg)/56">
          <p>
            At first, I just needed a focus timer. But I kept switching tabs:
            one for the timer, another for my to-do list, another for the
            calendar. The switching itself was breaking my focus. So I built
            Furō as one quiet place for flow. A timer, a task board, a calendar.
            Simple by design, not by accident.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Fifth Section ─────────────────────────────────────────────────────────────────────── (Done)
export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqId = useId();

  return (
    <section className="border-b border-(--color-border)/60 px-6 py-20">
      <div className={SECTION_WRAP_CLASS}>
        <SectionHeading title="FAQs" />

        <dl>
          {FAQS.map((faq, i) => (
            <div
              key={faq.question}
              className="border-b border-(--color-border) last:border-b-0"
            >
              <dt>
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                  aria-controls={`${faqId}-answer-${i}`}
                  id={`${faqId}-question-${i}`}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left hover:text-(--color-fg) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-fg) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-bg)"
                >
                  <span className="font-serif text-base font-light text-(--color-fg)/80">
                    {faq.question}
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`shrink-0 text-(--color-fg)/80 ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                    size={18}
                  />
                </button>
              </dt>
              <dd
                id={`${faqId}-answer-${i}`}
                aria-labelledby={`${faqId}-question-${i}`}
                className={`overflow-hidden ${
                  openIndex === i ? "max-h-40 pb-4" : "max-h-0"
                }`}
              >
                <p className="text-sm leading-relaxed text-(--color-fg)/50">
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
    <section className="px-6 py-32 text-center">
      <div>
        <h2
          className="mb-7 font-serif font-normal leading-[.94] tracking-tight"
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
          type="button"
          onClick={onEnter}
          className="rounded-full bg-(--color-fg) px-5 py-3 text-sm font-medium uppercase tracking-[0.18em] text-(--color-bg) hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-fg) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-bg)"
        >
          Open Furō
        </button>
      </div>
    </section>
  );
}

// ── Last Section ──────────────────────────────────────────────────────────────────── (Done)
function Footer() {
  return (
    <footer className="flex flex-col justify-between gap-4 border-t border-(--color-border)/60 px-10 py-5 sm:flex-row sm:items-center">
      <div>
        <div className="font-serif text-sm font-semibold tracking-[0.2em]">
          FURŌ
        </div>
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
    <div className="relative min-h-screen bg-(--color-bg) text-(--color-fg)">
      <Navbar onEnter={onEnter} />
      <main>
        <HeroSection onEnter={onEnter} />
        <HowItWorksSection />
        <FeaturesSection />
        <WhySection />
        <FAQSection />
        <CtaSection onEnter={onEnter} />
      </main>
      <Footer />
    </div>
  );
}

export default Landing;
