/*
 * ToolkitPage — Favorites / My Toolkit
 * Shows all starred questions, modalities, and worksheets
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Star, MessageSquare, BookOpen, FileText, Trash2 } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { MODALITY_LIST } from "@/data/modalities";
import questionsRaw from "@/data/questions_data.json";

interface Question { text: string; theme: string; themeTitle: string; }
interface QuestionBank { id: string; title: string; questions: Question[]; }
const banks: QuestionBank[] = questionsRaw as QuestionBank[];

const allQuestions: Record<string, { text: string; bank: string }> = {};
for (const bank of banks) {
  for (const q of bank.questions) {
    allQuestions[q.text] = { text: q.text, bank: bank.title };
  }
}

export default function ToolkitPage() {
  const { favorites, toggleFavorite, clearAll, count } = useFavorites();

  if (count === 0) {
    return (
      <div className="container py-16 max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Star size={48} className="mx-auto mb-4 text-muted-foreground/30" />
          <h1 className="text-2xl font-bold text-foreground mb-3">Your Toolkit is Empty</h1>
          <p className="text-muted-foreground mb-6" style={{ fontFamily: 'var(--font-body)' }}>
            Star questions, modalities, and worksheets to build your personal toolkit.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/questions" className="px-4 py-2 text-sm rounded-md border border-border bg-card hover:bg-muted transition-colors" style={{ fontFamily: 'var(--font-body)' }}>
              Browse Questions
            </Link>
            <Link href="/modality/act" className="px-4 py-2 text-sm rounded-md border border-border bg-card hover:bg-muted transition-colors" style={{ fontFamily: 'var(--font-body)' }}>
              Explore Modalities
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Toolkit</h1>
            <p className="text-sm text-muted-foreground mt-1" style={{ fontFamily: 'var(--font-body)' }}>
              {count} saved item{count !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => { if (window.confirm("Clear all favorites?")) clearAll(); }}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-border bg-card hover:bg-destructive/10 hover:text-destructive transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <Trash2 size={14} />
            Clear All
          </button>
        </div>

        {/* Favorite Questions */}
        {favorites.questions.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={16} style={{ color: '#975F57' }} />
              <h2 className="text-lg font-semibold text-foreground">Starred Questions</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{favorites.questions.length}</span>
            </div>
            <div className="space-y-1">
              {favorites.questions.map(qText => {
                const info = allQuestions[qText];
                return (
                  <div key={qText} className="flex items-start gap-2 py-2 px-3 rounded-md hover:bg-muted/40 transition-colors group">
                    <button
                      onClick={() => toggleFavorite("questions", qText)}
                      className="shrink-0 mt-0.5"
                      aria-label="Remove from favorites"
                    >
                      <Star size={14} fill="#975F57" color="#975F57" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground" style={{ fontFamily: 'var(--font-body)' }}>{qText}</p>
                      {info && <p className="text-xs text-muted-foreground mt-0.5">{info.bank}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Favorite Modalities */}
        {favorites.modalities.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={16} style={{ color: '#975F57' }} />
              <h2 className="text-lg font-semibold text-foreground">Starred Modalities</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{favorites.modalities.length}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {favorites.modalities.map(slug => {
                const mod = MODALITY_LIST.find(m => m.slug === slug);
                if (!mod) return null;
                return (
                  <div key={slug} className="flex items-center gap-3 p-3 rounded-md border border-border bg-card">
                    <button
                      onClick={() => toggleFavorite("modalities", slug)}
                      className="shrink-0"
                      aria-label="Remove from favorites"
                    >
                      <Star size={14} fill="#975F57" color="#975F57" />
                    </button>
                    <Link href={`/modality/${slug}`} className="flex-1 min-w-0 hover:text-primary transition-colors">
                      <span className="text-sm font-medium text-foreground">{mod.name}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Favorite Worksheets */}
        {favorites.worksheets.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={16} style={{ color: '#975F57' }} />
              <h2 className="text-lg font-semibold text-foreground">Starred Worksheets</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{favorites.worksheets.length}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {favorites.worksheets.map(slug => {
                const mod = MODALITY_LIST.find(m => m.slug === slug);
                const label = slug === "safety-plan" ? "Safety Plan" : (mod ? `${mod.abbr} Worksheet` : slug);
                return (
                  <div key={slug} className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-card">
                    <button
                      onClick={() => toggleFavorite("worksheets", slug)}
                      className="shrink-0"
                      aria-label="Remove from favorites"
                    >
                      <Star size={14} fill="#975F57" color="#975F57" />
                    </button>
                    <Link href={`/worksheets/${slug}`} className="text-sm text-foreground hover:text-primary transition-colors" style={{ fontFamily: 'var(--font-body)' }}>
                      {label}
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </motion.div>
    </div>
  );
}
