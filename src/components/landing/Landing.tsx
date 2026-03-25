import { motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { STEPS, FEATURES, FAQS } from "./constants";
import { useScrollActiveIndex } from "./hooks";

interface LandingProps {
  onEnter: () => void;
}
// ── Shared styles ─────────────────────────────────────────────────────── (Done)
const BUTTON_FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-fg) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-bg)";
const SURFACE_CLASS =
  "border border-(--color-border)/55 bg-(--color-bg)/70 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl";
const SECTION_WRAP_CLASS = "mx-auto w-full max-w-5xl";

function useSectionReveal() {
  const prefersReducedMotion = useReducedMotion();

  return prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.6, ease: "easeOut" as const },
      };
}

// ── Reusable Section Heading ─────────────────────────────────────────────────────── (Done)
function SectionHeading({
  title,
}: {
  title: string;
}) {
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
      className={`fixed top-5 left-1/2 z-50 flex w-[min(25rem,calc(100%-2rem))] -translate-x-1/2 items-center justify-between rounded-full px-3 py-2 ${SURFACE_CLASS}`}
    >
      <div className="px-4 font-serif text-2xl font-semibold tracking-[0.08em]">
        FURŌ
      </div>
      <button
        type="button"
        onClick={onEnter}
        className={`rounded-full bg-(--color-fg) px-5 py-2.5 text-sm font-medium uppercase tracking-[0.16em] text-(--color-bg) transition hover:opacity-90 ${BUTTON_FOCUS_RING}`}
      >
        Open App
      </button>
    </nav>
  );
}

// ── First Section ────────────────────────────────────────────────────────────────────── (DONE)
function HeroSection({ onEnter }: LandingProps) {
  const prefersReducedMotion = useReducedMotion();
  const weekdayLabels = ["S", "M", "T", "W", "T", "F", "S"] as const;
  const heroTasks = ["Task 1", "Task 2", "Task 3"] as const;

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6 pb-16 pt-16 sm:px-10 lg:px-16">
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] xl:gap-24">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-left"
        >
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
              className={`rounded-full bg-(--color-fg) px-6 py-4 text-lead font-medium text-(--color-bg) transition hover:opacity-90 ${BUTTON_FOCUS_RING}`}
            >
              Open Furō
            </button>
            <a
              href="#features"
              className={`rounded-full border border-(--color-border) px-6 py-4 text-lead font-light text-(--color-fg) transition hover:bg-(--color-fg)/5 ${BUTTON_FOCUS_RING}`}
            >
              See features
            </a>
          </div>
        </motion.div>

        <div
          aria-hidden="true"
          className="relative hidden h-[30rem] items-center justify-center lg:flex xl:h-136"
        >
          <div className="relative h-full w-full max-w-[32rem] overflow-visible xl:max-w-136">
            <motion.div
              initial={
                prefersReducedMotion ? false : { opacity: 0, y: 24, rotate: 0 }
              }
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.12 }}
              className={`absolute right-21 top-7 z-20 w-56 rounded-[2rem] p-4 xl:right-31 xl:w-66 xl:p-5 ${SURFACE_CLASS}`}
            >
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
            </motion.div>

            {/* Calendar */}
            <motion.div
              initial={
                prefersReducedMotion
                  ? false
                  : { opacity: 0, x: -22, y: 18, rotate: 0 }
              }
              animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.22 }}
              className={`absolute right-50 top-55 z-10 w-52 rounded-[2rem] p-4 xl:top-65 xl:right-65 xl:w-60 xl:p-5 ${SURFACE_CLASS}`}
            >
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
            </motion.div>

            {/* TodoList */}
            <motion.div
              initial={
                prefersReducedMotion
                  ? false
                  : { opacity: 0, x: 22, y: 18, rotate: 0 }
              }
              animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.3 }}
              className={`absolute top-55 right-0 z-10 w-48 rounded-[2rem] p-4 xl:right-7 xl:top-65 xl:w-55 xl:p-5 ${SURFACE_CLASS}`}
            >
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
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Second Section ────────────────────────────────────────────────────────────── (Done)
function HowItWorksSection() {
  const reveal = useSectionReveal();

  return (
    <section className="border-y border-(--color-border)/60 px-6 py-18 sm:py-20">
      <motion.div {...reveal} className={SECTION_WRAP_CLASS}>
        <SectionHeading title="How it works" />
        <div
          className={`grid overflow-hidden rounded-[2rem] sm:grid-cols-3 ${SURFACE_CLASS}`}
        >
          {STEPS.map((step, i, arr) => {
            const Icon = step.icon;
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
      </motion.div>
    </section>
  );
}

// ── Third Section ────────────────────────────────────────────────────────── (Done)
function FeaturesSection() {
  const { containerRef, stickyRef, activeIndex } = useScrollActiveIndex(
    FEATURES.length,
  );
  const prefersReducedMotion = useReducedMotion();
  const reveal = useSectionReveal();
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
          <div className="mx-auto grid w-full max-w-4xl grid-cols-2 items-center gap-12 px-6">
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
              <div className="w-full max-w-[34rem]">
                <ActiveMock />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <section className="block border-t border-(--color-border)/60 px-6 py-16 sm:hidden">
        <motion.div {...reveal} className={SECTION_WRAP_CLASS}>
          <SectionHeading title="Features" />

          <div className="space-y-14">
            {FEATURES.map((f) => {
              const Mock = f.Mockup;
              return (
                <div key={f.title}>
                  <h3 className="mb-2 font-serif text-xl font-normal">{f.title}</h3>
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
        </motion.div>
      </section>
    </section>
  );
}

// ── Fourth Section ────────────────────────────────────────────────────────── (Done)
function WhySection() {
  const reveal = useSectionReveal();

  return (
    <section className="border-b border-(--color-border)/60 px-6 py-24">
      <motion.div
        {...reveal}
        className={`${SECTION_WRAP_CLASS} rounded-[2rem] p-8 sm:p-10 ${SURFACE_CLASS}`}
      >
        <SectionHeading title="Why I built this" />
        <div className="grid gap-6 text-sm leading-8 text-(--color-fg)/56 sm:grid-cols-[1.2fr_.8fr]">
          <p>
            At first, I just needed a focus timer. But I kept switching tabs:
            one for the timer, another for my to-do list, another for the
            calendar. The switching itself was breaking my focus.
          </p>
          <p>
            So I built Furō as one quiet place for flow. A timer, a task board,
            a calendar. Simple by design, not by accident.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

// ── Fifth Section ─────────────────────────────────────────────────────────────────────── (Done)
export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqId = useId();
  const reveal = useSectionReveal();

  return (
    <section className="border-b border-(--color-border)/60 px-6 py-20">
      <motion.div
        {...reveal}
        className={`${SECTION_WRAP_CLASS} rounded-[2rem] p-8 sm:p-10 ${SURFACE_CLASS}`}
      >
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
                  className={`flex w-full items-center justify-between gap-4 py-4 text-left transition-colors hover:text-(--color-fg) ${BUTTON_FOCUS_RING}`}
                >
                  <span className="font-serif text-base font-light text-(--color-fg)/80">
                    {faq.question}
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`shrink-0 transition-transform duration-300 ease-in-out text-(--color-fg)/80 ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                    size={18}
                  />
                </button>
              </dt>
              <dd
                id={`${faqId}-answer-${i}`}
                aria-labelledby={`${faqId}-question-${i}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
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
      </motion.div>
    </section>
  );
}

// ── Sixth Section ─────────────────────────────────────────────────────────────────────── (Done)
function CtaSection({ onEnter }: LandingProps) {
  const reveal = useSectionReveal();

  return (
    <section className="px-6 py-32 text-center">
      <motion.div {...reveal}>
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
          className={`rounded-full bg-(--color-fg) px-5 py-3 text-sm font-medium uppercase tracking-[0.18em] text-(--color-bg) transition hover:opacity-90 ${BUTTON_FOCUS_RING}`}
        >
          Open Furō
        </button>
      </motion.div>
    </section>
  );
}

// ── Last Section ──────────────────────────────────────────────────────────────────── (Done)
function Footer() {
  return (
    <footer className="flex flex-col justify-between gap-4 border-t border-(--color-border)/60 px-10 py-5 sm:flex-row sm:items-center">
      <div>
        <div className="font-serif text-sm font-semibold tracking-[0.2em]">FURŌ</div>
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
