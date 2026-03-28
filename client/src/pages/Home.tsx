/*
 * Home — The Clinician's Folio landing page
 * Editorial layout with hero CTA, case conceptualization toolkit, modality cards, features
 * Design: Warm earth-tone palette, Fraunces display + Source Sans 3 body
 */
import { useState, useMemo, useCallback } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { MODALITY_LIST } from "@/data/modalities";
import questionsRaw from "@/data/questions_data.json";
import {
  BookOpen, MessageSquare, GitCompare, FileText,
  Search, ClipboardCopy, Moon, Smartphone, ArrowRight, Shuffle, Copy, Check
} from "lucide-react";
import { toast } from "sonner";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/114222369/Uuign85Z3jY6wv4ZNuBNcb/hero-bg-Zx5MqfV3NvqdADyNr2EDz9.webp";

/* Build a flat list of all questions for QOTD */
interface QBank { questions: { text: string }[]; title: string; }
const allQs: { text: string; bank: string }[] = [];
for (const bank of (questionsRaw as QBank[])) {
  for (const q of bank.questions) {
    allQs.push({ text: q.text, bank: bank.title });
  }
}

/* Date-based deterministic seed for Question of the Day */
function getDailyIndex(date: Date): number {
  const day = Math.floor(date.getTime() / 86400000);
  // Simple hash
  let h = day;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = (h >> 16) ^ h;
  return Math.abs(h) % allQs.length;
}

/* Stagger-in animation */
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const TAG_LINKS: Record<string, string> = {
  "Assessment focus": "/compare",
  "Maintaining factors": "/compare",
  "Change targets": "/compare",
  "Sample formulation": "/worksheets",
  "2,208 Questions": "/questions",
};

const FEATURES = [
  { icon: Search, title: "Global Search", desc: "Quickly find techniques, concepts, and interventions across all therapy modalities." },
  { icon: ClipboardCopy, title: "Export Tools", desc: "Export content to PDF or clipboard for session planning and documentation." },
  { icon: Moon, title: "Dark Mode", desc: "Reduce eye strain with dark mode that respects your system preferences." },
  { icon: Smartphone, title: "Responsive", desc: "Optimized for all devices — desktop, tablet, and mobile with touch-friendly interface." },
];

export default function Home() {
  const dailyIdx = useMemo(() => getDailyIndex(new Date()), []);
  const [qotd, setQotd] = useState(allQs[dailyIdx]);
  const [copied, setCopied] = useState(false);

  const shuffleQuestion = useCallback(() => {
    const idx = Math.floor(Math.random() * allQs.length);
    setQotd(allQs[idx]);
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(qotd.text).then(() => {
      setCopied(true);
      toast.success("Copied!");
      setTimeout(() => setCopied(false), 1500);
    });
  }, [qotd]);

  return (
    <div className="min-h-screen">
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_IMG}
            alt=""
            className="w-full h-full object-cover opacity-30 dark:opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>
        <div className="container relative z-10 pt-16 pb-20 md:pt-24 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span
              className="inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: 'var(--font-body)', color: '#975F57' }}
            >
              Training Lens Guide
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.15] text-foreground mb-5">
              Case Conceptualization,{" "}
              <span style={{ color: '#975F57' }}>Organized by Lens</span>
            </h1>
            <p
              className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mb-6"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Built for trainees and supervisors: each modality page highlights what to assess,
              how problems are maintained, and how to select interventions.
            </p>

            {/* CTA button */}
            <Link
              href="/modality/act"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              style={{ background: '#975F57', fontFamily: 'var(--font-body)' }}
            >
              Explore Modalities
              <ArrowRight size={16} />
            </Link>

            {/* Interactive tag pills */}
            <div className="flex flex-wrap gap-2 mt-6">
              {Object.entries(TAG_LINKS).map(([tag, href]) => (
                <Link
                  key={tag}
                  href={href}
                  className="px-3 py-1 text-xs font-medium rounded-full border border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-card transition-all"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Question of the Day ─── */}
      <section className="container py-8 md:py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-5 rounded-lg border-l-4 bg-card border border-border"
          style={{ borderLeftColor: '#975F57' }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={14} style={{ color: '#975F57' }} />
                <span
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: '#975F57', fontFamily: 'var(--font-body)' }}
                >
                  Question of the Day
                </span>
              </div>
              <p className="text-sm md:text-base text-foreground leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                "{qotd.text}"
              </p>
              <p className="text-xs text-muted-foreground mt-2" style={{ fontFamily: 'var(--font-body)' }}>
                From: {qotd.bank}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleCopy}
                className="p-1.5 rounded hover:bg-muted transition-colors"
                aria-label="Copy question"
              >
                {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-muted-foreground" />}
              </button>
              <button
                onClick={shuffleQuestion}
                className="p-1.5 rounded hover:bg-muted transition-colors"
                aria-label="Get another question"
              >
                <Shuffle size={14} className="text-muted-foreground" />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── Case Conceptualization Toolkit ─── */}
      <section className="container py-12 md:py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0 }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-foreground">
            Case Conceptualization Toolkit
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground mt-2 max-w-2xl mb-8" style={{ fontFamily: 'var(--font-body)' }}>
            Use each modality as a lens to generate hypotheses, organize assessment data,
            and connect interventions to mechanism of change.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                num: "1",
                title: "Map the Maintaining Loop",
                items: [
                  "Trigger → meaning → emotion → behavior",
                  "Short-term relief vs. long-term cost",
                  "What keeps the loop going?"
                ]
              },
              {
                num: "2",
                title: "Name the Change Target",
                items: [
                  "Beliefs, avoidance, memory networks, parts",
                  "Motivation, language, or relational patterns",
                  "Values and goals that anchor the plan"
                ]
              },
              {
                num: "3",
                title: "Select Interventions",
                items: [
                  "Match technique to the target",
                  "Sequence: stabilize → process → integrate",
                  "Track outcome and refine"
                ]
              }
            ].map((card) => (
              <motion.div
                key={card.num}
                variants={fadeUp}
                className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: '#975F57', color: '#EEECE1' }}
                  >
                    {card.num}
                  </span>
                  <h3 className="text-base font-semibold text-foreground">{card.title}</h3>
                </div>
                <ul className="space-y-2" style={{ fontFamily: 'var(--font-body)' }}>
                  {card.items.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full mt-2 shrink-0" style={{ background: '#975F57' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Formulation callout */}
          <motion.div
            variants={fadeUp}
            className="mt-6 p-5 rounded-lg border-l-4 bg-card/80"
            style={{ borderLeftColor: '#975F57' }}
          >
            <p className="text-sm text-muted-foreground italic leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
              <strong className="text-foreground not-italic">Formulation starter:</strong>{" "}
              "When <em>trigger</em> happens, the client interprets it as <em>meaning</em>,
              feels <em>emotion</em>, and responds with <em>behavior</em>. The short-term payoff
              is <em>relief</em>, but the long-term cost is <em>impact</em>. This lens targets{" "}
              <em>process</em> to move toward <em>values/goal</em>."
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="container"><div className="h-px bg-border" /></div>

      {/* ─── Modality Cards Grid ─── */}
      <section className="container py-12 md:py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0 }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Therapy Modalities
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-muted-foreground mb-8 max-w-xl"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Explore {MODALITY_LIST.length} evidence-based approaches, each with case conceptualization lens,
            cultural context, measurement-based care, and modality-specific techniques.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MODALITY_LIST.map((mod) => (
              <motion.div key={mod.slug} variants={fadeUp}>
                <Link
                  href={`/modality/${mod.slug}`}
                  className="group block bg-card rounded-lg border border-border p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div
                    className="text-xs font-bold tracking-wider uppercase mb-2"
                    style={{ fontFamily: 'var(--font-body)', color: '#975F57' }}
                  >
                    {mod.abbr}
                  </div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-2 leading-snug">
                    {mod.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                    {mod.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Tool cards row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            {[
              { href: "/questions", icon: MessageSquare, abbr: "Questions", name: "Question Repository", desc: "Access 2,208 therapeutic questions across core, Gestalt, Humanistic, counseling session, and crisis/safety banks." },
              { href: "/compare", icon: GitCompare, abbr: "Matrix", name: "Compare Lenses", desc: "See how each modality frames the problem, what it targets, and which interventions fit best." },
              { href: "/worksheets", icon: FileText, abbr: "Print", name: "Worksheets", desc: "One-page case conceptualization templates for supervision, sessions, and case conferences." },
            ].map((tool) => (
              <motion.div key={tool.href} variants={fadeUp}>
                <Link
                  href={tool.href}
                  className="group block bg-card rounded-lg border border-border p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <tool.icon size={16} style={{ color: '#975F57' }} />
                    <span
                      className="text-xs font-bold tracking-wider uppercase"
                      style={{ fontFamily: 'var(--font-body)', color: '#975F57' }}
                    >
                      {tool.abbr}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                    {tool.desc}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="container"><div className="h-px bg-border" /></div>

      {/* ─── Printable Worksheets Section ─── */}
      <section className="container py-12 md:py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0 }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Printable Worksheets
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-muted-foreground mb-6"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            One-page case formulation templates designed for supervision and case conferences.
          </motion.p>
          <div className="flex flex-wrap gap-2">
            {[...MODALITY_LIST.map(m => ({ slug: m.slug, label: `${m.abbr} Worksheet` })),
              { slug: "safety-plan", label: "Safety Plan" }
            ].map((ws) => (
              <motion.div key={ws.slug} variants={fadeUp}>
                <Link
                  href={`/worksheets/${ws.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-border bg-card hover:bg-muted hover:border-primary/30 transition-all"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  <FileText size={14} style={{ color: '#975F57' }} />
                  {ws.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="container"><div className="h-px bg-border" /></div>

      {/* ─── Features Section ─── */}
      <section className="container py-12 md:py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0 }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            Features
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map((feat) => (
              <motion.div key={feat.title} variants={fadeUp} className="flex gap-4">
                <div
                  className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(151,95,87,0.1)' }}
                >
                  <feat.icon size={18} style={{ color: '#975F57' }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{feat.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
