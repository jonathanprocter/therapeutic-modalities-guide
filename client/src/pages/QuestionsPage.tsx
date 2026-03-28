/*
 * QuestionsPage — Therapeutic Question Repository
 * Collapsed-by-default accordions, copy single question, random question, search + filters
 */
import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronDown, ChevronUp, Copy, Shuffle, Check, Star } from "lucide-react";
import { toast } from "sonner";
import { useFavorites } from "@/contexts/FavoritesContext";
import questionsRaw from "@/data/questions_data.json";

interface Question {
  text: string;
  theme: string;
  themeTitle: string;
}

interface QuestionBank {
  id: string;
  sectionId: string;
  title: string;
  description: string;
  count: number;
  questions: Question[];
  clinicalApplications?: string[];
}

const banks: QuestionBank[] = questionsRaw as QuestionBank[];

const QUESTIONS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/114222369/Uuign85Z3jY6wv4ZNuBNcb/questions-hero-TPMqAZjqV7tZ9Lpm26ZP9X.webp";

const THEMES = [
  { value: "all", label: "All counseling themes" },
  { value: "intake", label: "Intake & Background" },
  { value: "emotions", label: "Emotions" },
  { value: "relationships", label: "Relationships" },
  { value: "cognitions", label: "Thoughts & Beliefs" },
  { value: "behavior", label: "Behavior & Patterns" },
  { value: "values", label: "Values & Identity" },
  { value: "goals", label: "Goals & Future" },
  { value: "coping", label: "Coping & Strengths" },
  { value: "trauma", label: "Trauma & Safety" },
  { value: "body", label: "Body & Mindfulness" },
  { value: "change", label: "Change & Motivation" },
  { value: "self-compassion", label: "Self-Compassion" },
  { value: "other", label: "Other" },
];

/* Copy-to-clipboard for a single question */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {
      toast.error("Failed to copy");
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="shrink-0 p-1 rounded hover:bg-muted transition-colors opacity-0 group-hover/q:opacity-100 focus:opacity-100"
      aria-label="Copy question"
      title="Copy question"
    >
      {copied ? (
        <Check size={13} className="text-green-600 dark:text-green-400" />
      ) : (
        <Copy size={13} className="text-muted-foreground/60" />
      )}
    </button>
  );
}

function QuestionRow({ q, idx }: { q: Question; idx: number }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const starred = isFavorite("questions", q.text);
  return (
    <li className="group/q text-sm text-muted-foreground flex items-start gap-2 py-1 px-2 -mx-2 rounded hover:bg-muted/40 transition-colors">
      <span className="text-xs text-muted-foreground/50 mt-0.5 shrink-0 w-5 text-right select-none">{idx + 1}.</span>
      <span className="flex-1 min-w-0">{q.text}</span>
      <button
        onClick={() => toggleFavorite("questions", q.text)}
        className="shrink-0 p-1 rounded hover:bg-muted transition-colors opacity-0 group-hover/q:opacity-100 focus:opacity-100"
        aria-label={starred ? "Remove from favorites" : "Add to favorites"}
        style={starred ? {} : undefined}
      >
        <Star size={13} fill={starred ? "#975F57" : "none"} color={starred ? "#975F57" : "currentColor"} className={starred ? "" : "text-muted-foreground/60"} />
      </button>
      <CopyButton text={q.text} />
    </li>
  );
}

function BankSection({ bank, searchQuery, themeFilter, forceOpen }: {
  bank: QuestionBank;
  searchQuery: string;
  themeFilter: string;
  forceOpen: boolean;
}) {
  const [open, setOpen] = useState(forceOpen);
  const hasClinicalApps = bank.clinicalApplications && bank.clinicalApplications.length > 0;

  const filteredQuestions = useMemo(() => {
    let qs = bank.questions;
    if (themeFilter !== "all") {
      qs = qs.filter(q => q.theme === themeFilter);
    }
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      qs = qs.filter(q => q.text.toLowerCase().includes(lower));
    }
    return qs;
  }, [bank.questions, searchQuery, themeFilter]);

  if (filteredQuestions.length === 0) return null;

  // Group by theme if counseling bank
  const grouped = useMemo(() => {
    if (bank.id !== "counseling" && !bank.questions[0]?.themeTitle) {
      return [{ title: "", questions: filteredQuestions }];
    }
    const groups: Record<string, Question[]> = {};
    for (const q of filteredQuestions) {
      const key = q.themeTitle || "General";
      if (!groups[key]) groups[key] = [];
      groups[key].push(q);
    }
    return Object.entries(groups).map(([title, questions]) => ({ title, questions }));
  }, [filteredQuestions, bank.id, bank.questions]);

  return (
    <section id={bank.sectionId} className="scroll-mt-20">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 border-b border-border group"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3 min-w-0">
          <h2 className="text-base md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors text-left truncate">
            {bank.title}
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0" style={{ fontFamily: 'var(--font-body)' }}>
            {filteredQuestions.length}
          </span>
        </div>
        {open ? <ChevronUp size={18} className="text-muted-foreground shrink-0" /> : <ChevronDown size={18} className="text-muted-foreground shrink-0" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="py-4">
              {bank.description && (
                <p className="text-sm text-muted-foreground mb-4" style={{ fontFamily: 'var(--font-body)' }}>
                  {bank.description}
                </p>
              )}

              {/* Clinical Applications */}
              {hasClinicalApps && !searchQuery && (
                <div className="mb-5 p-4 rounded-lg bg-muted/30 border border-border/50">
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2" style={{ fontFamily: 'var(--font-body)' }}>Clinical Applications</h3>
                  <ul className="space-y-1" style={{ fontFamily: 'var(--font-body)' }}>
                    {bank.clinicalApplications!.map((app, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2 py-0.5">
                        <span className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
                        <span>{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {grouped.map((group, gi) => (
                <div key={gi} className="mb-4">
                  {group.title && group.title !== "Questions" && (
                    <h3 className="text-sm font-semibold text-foreground mb-2">{group.title}</h3>
                  )}
                  <ol className="space-y-0.5" style={{ fontFamily: 'var(--font-body)' }}>
                    {group.questions.map((q, qi) => (
                      <QuestionRow key={qi} q={q} idx={qi} />
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default function QuestionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [bankFilter, setBankFilter] = useState("all");
  const [themeFilter, setThemeFilter] = useState("all");
  const [randomQuestion, setRandomQuestion] = useState<{ text: string; bank: string } | null>(null);

  // Banks are collapsed by default, but open when user searches or filters
  const hasActiveFilter = searchQuery.length > 0 || bankFilter !== "all" || themeFilter !== "all";

  const filteredBanks = useMemo(() => {
    if (bankFilter === "all") return banks;
    return banks.filter(b => b.id === bankFilter);
  }, [bankFilter]);

  const totalVisible = useMemo(() => {
    let count = 0;
    for (const bank of filteredBanks) {
      let qs = bank.questions;
      if (themeFilter !== "all") qs = qs.filter(q => q.theme === themeFilter);
      if (searchQuery) {
        const lower = searchQuery.toLowerCase();
        qs = qs.filter(q => q.text.toLowerCase().includes(lower));
      }
      count += qs.length;
    }
    return count;
  }, [filteredBanks, searchQuery, themeFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setBankFilter("all");
    setThemeFilter("all");
  };

  const showThemeFilter = bankFilter === "all" || bankFilter === "counseling";

  const getRandomQuestion = useCallback(() => {
    const allQuestions: { text: string; bank: string }[] = [];
    for (const bank of banks) {
      for (const q of bank.questions) {
        allQuestions.push({ text: q.text, bank: bank.title });
      }
    }
    const idx = Math.floor(Math.random() * allQuestions.length);
    setRandomQuestion(allQuestions[idx]);
  }, []);

  const dismissRandom = () => setRandomQuestion(null);

  return (
    <div className="container py-8 md:py-12 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero */}
        <div className="relative rounded-xl overflow-hidden mb-8">
          <img src={QUESTIONS_IMG} alt="" className="w-full h-36 md:h-48 object-cover opacity-25 dark:opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Therapeutic Question Repository
            </h1>
            <p className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
              {banks.reduce((sum, b) => sum + b.count, 0).toLocaleString()} curated therapeutic questions across
              {" "}{banks.length} banks.
            </p>
          </div>
        </div>

        {/* Random Question Card */}
        <AnimatePresence>
          {randomQuestion && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-5 rounded-lg border-l-4 bg-card border border-border"
              style={{ borderLeftColor: '#975F57' }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Shuffle size={14} style={{ color: '#975F57' }} />
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#975F57', fontFamily: 'var(--font-body)' }}>
                      Random Question
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                    "{randomQuestion.text}"
                  </p>
                  <p className="text-xs text-muted-foreground mt-2" style={{ fontFamily: 'var(--font-body)' }}>
                    From: {randomQuestion.bank}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => navigator.clipboard.writeText(randomQuestion.text).then(() => toast.success('Copied!'))}
                    className="p-1.5 rounded hover:bg-muted transition-colors"
                    aria-label="Copy question"
                  >
                    <Copy size={14} className="text-muted-foreground" />
                  </button>
                  <button
                    onClick={getRandomQuestion}
                    className="p-1.5 rounded hover:bg-muted transition-colors"
                    aria-label="Get another random question"
                  >
                    <Shuffle size={14} className="text-muted-foreground" />
                  </button>
                  <button
                    onClick={dismissRandom}
                    className="p-1.5 rounded hover:bg-muted transition-colors"
                    aria-label="Dismiss"
                  >
                    <X size={14} className="text-muted-foreground" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <div className="sticky top-14 md:top-16 z-20 bg-background/95 backdrop-blur-md py-3 -mx-4 px-4 border-b border-border mb-6 no-print">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions across all banks..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                style={{ fontFamily: 'var(--font-body)' }}
              />
            </div>
            <select
              value={bankFilter}
              onChange={(e) => { setBankFilter(e.target.value); if (e.target.value !== "all" && e.target.value !== "counseling") setThemeFilter("all"); }}
              className="px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <option value="all">All banks</option>
              {banks.map(b => (
                <option key={b.id} value={b.id}>{b.title}</option>
              ))}
            </select>
            {showThemeFilter && (
              <select
                value={themeFilter}
                onChange={(e) => setThemeFilter(e.target.value)}
                className="px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {THEMES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            )}
            <button
              onClick={getRandomQuestion}
              className="px-3 py-2 text-sm rounded-md border border-border bg-card hover:bg-muted transition-colors flex items-center gap-1.5"
              style={{ fontFamily: 'var(--font-body)' }}
              title="Get a random question for supervision"
            >
              <Shuffle size={14} />
              <span className="hidden sm:inline">Random</span>
            </button>
            {(searchQuery || bankFilter !== "all" || themeFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm rounded-md border border-border bg-card hover:bg-muted transition-colors flex items-center gap-1"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <X size={14} />
                Clear
              </button>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-2" style={{ fontFamily: 'var(--font-body)' }}>
            Showing {totalVisible.toLocaleString()} questions
          </div>
        </div>

        {/* Quick Jump */}
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-6 no-print">
          <span className="text-xs font-semibold text-foreground" style={{ fontFamily: 'var(--font-body)' }}>Quick Jump:</span>
          {banks.map(b => (
            <a
              key={b.sectionId}
              href={`#${b.sectionId}`}
              className="text-xs text-primary hover:underline"
              style={{ fontFamily: 'var(--font-body)' }}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(b.sectionId)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {b.title}
            </a>
          ))}
        </div>

        {/* Question Banks — collapsed by default, open when filtering */}
        <div className="space-y-2">
          {filteredBanks.map(bank => (
            <BankSection
              key={bank.id}
              bank={bank}
              searchQuery={searchQuery}
              themeFilter={themeFilter}
              forceOpen={hasActiveFilter}
            />
          ))}
        </div>

        {totalVisible === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
              No questions match your current filters.
            </p>
            <button
              onClick={clearFilters}
              className="mt-3 text-sm text-primary hover:underline"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Clear all filters
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}