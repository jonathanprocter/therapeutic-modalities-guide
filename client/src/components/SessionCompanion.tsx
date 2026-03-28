/*
 * SessionCompanion — Floating action button + slide-out panel
 * Quick access to questions, random question, and favorites during sessions
 */
import { useState, useMemo, useCallback } from "react";
import { MessageSquare, Search, Shuffle, Star, X, Copy, Check } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useFavorites } from "@/contexts/FavoritesContext";
import { toast } from "sonner";
import questionsRaw from "@/data/questions_data.json";

interface Question { text: string; theme: string; themeTitle: string; }
interface QuestionBank { id: string; title: string; questions: Question[]; }
const banks: QuestionBank[] = questionsRaw as QuestionBank[];

const allQuestions: { text: string; bank: string }[] = [];
for (const bank of banks) {
  for (const q of bank.questions) {
    allQuestions.push({ text: q.text, bank: bank.title });
  }
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => toast.error("Failed to copy"));
  };
  return (
    <button onClick={handleCopy} className="shrink-0 p-1 rounded hover:bg-muted transition-colors" aria-label="Copy">
      {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} className="text-muted-foreground/60" />}
    </button>
  );
}

export function SessionCompanion() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [randomQ, setRandomQ] = useState<{ text: string; bank: string } | null>(null);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const lower = query.toLowerCase();
    return allQuestions.filter(q => q.text.toLowerCase().includes(lower)).slice(0, 20);
  }, [query]);

  const getRandom = useCallback(() => {
    const idx = Math.floor(Math.random() * allQuestions.length);
    setRandomQ(allQuestions[idx]);
  }, []);

  const favQuestions = useMemo(() => {
    return favorites.questions.slice(0, 10).map(text => {
      const found = allQuestions.find(q => q.text === text);
      return found || { text, bank: "" };
    });
  }, [favorites.questions]);

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl hover:scale-105 transition-all no-print"
        style={{ background: '#975F57' }}
        aria-label="Open session companion"
      >
        <MessageSquare size={20} />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <MessageSquare size={18} style={{ color: '#975F57' }} />
              Session Companion
            </SheetTitle>
            <SheetDescription>
              Quick access to questions and favorites during sessions
            </SheetDescription>
          </SheetHeader>

          <div className="px-4 pb-6 space-y-5">
            {/* Search */}
            <div>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  style={{ fontFamily: 'var(--font-body)' }}
                />
              </div>
              {filtered.length > 0 && (
                <div className="mt-2 max-h-48 overflow-y-auto space-y-0.5">
                  {filtered.map((q, i) => (
                    <div key={i} className="flex items-start gap-2 py-1.5 px-2 rounded hover:bg-muted/40 transition-colors">
                      <button
                        onClick={() => toggleFavorite("questions", q.text)}
                        className="shrink-0 mt-0.5"
                      >
                        <Star size={12} fill={isFavorite("questions", q.text) ? "#975F57" : "none"} color={isFavorite("questions", q.text) ? "#975F57" : "currentColor"} className="text-muted-foreground/40" />
                      </button>
                      <span className="text-xs text-foreground flex-1" style={{ fontFamily: 'var(--font-body)' }}>{q.text}</span>
                      <CopyBtn text={q.text} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Random Question */}
            <div>
              <button
                onClick={getRandom}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md border border-border bg-card hover:bg-muted transition-colors"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <Shuffle size={14} />
                Random Question
              </button>
              {randomQ && (
                <div className="mt-2 p-3 rounded-md bg-muted/40 border border-border/50">
                  <div className="flex items-start gap-2">
                    <button
                      onClick={() => toggleFavorite("questions", randomQ.text)}
                      className="shrink-0 mt-0.5"
                    >
                      <Star size={12} fill={isFavorite("questions", randomQ.text) ? "#975F57" : "none"} color={isFavorite("questions", randomQ.text) ? "#975F57" : "currentColor"} className="text-muted-foreground/40" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground" style={{ fontFamily: 'var(--font-body)' }}>"{randomQ.text}"</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{randomQ.bank}</p>
                    </div>
                    <CopyBtn text={randomQ.text} />
                  </div>
                </div>
              )}
            </div>

            {/* Favorites */}
            {favQuestions.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Star size={14} style={{ color: '#975F57' }} />
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wider" style={{ fontFamily: 'var(--font-body)' }}>
                    Starred Questions
                  </span>
                </div>
                <div className="space-y-0.5 max-h-48 overflow-y-auto">
                  {favQuestions.map((q, i) => (
                    <div key={i} className="flex items-start gap-2 py-1.5 px-2 rounded hover:bg-muted/40 transition-colors">
                      <button
                        onClick={() => toggleFavorite("questions", q.text)}
                        className="shrink-0 mt-0.5"
                      >
                        <Star size={12} fill="#975F57" color="#975F57" />
                      </button>
                      <span className="text-xs text-foreground flex-1" style={{ fontFamily: 'var(--font-body)' }}>{q.text}</span>
                      <CopyBtn text={q.text} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
