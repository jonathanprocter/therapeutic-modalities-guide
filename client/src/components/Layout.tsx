/*
 * Layout — Clinician's Folio editorial design
 * Persistent header + collapsible sidebar + breadcrumb + footer
 * Mobile hamburger on ALL pages, improved footer with more links
 */
import { useState, useEffect, useRef, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Moon, Sun, Menu, X, Search, ChevronRight, Home,
  BookOpen, MessageSquare, GitCompare, FileText, Sparkles, Star, Info
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/modality/act", label: "ACT", icon: BookOpen },
  { href: "/modality/adlerian", label: "Adlerian", icon: BookOpen },
  { href: "/modality/cbt", label: "CBT", icon: BookOpen },
  { href: "/modality/dbt", label: "DBT", icon: BookOpen },
  { href: "/modality/eft", label: "EFT", icon: BookOpen },
  { href: "/modality/emdr", label: "EMDR", icon: BookOpen },
  { href: "/modality/ifs", label: "IFS", icon: BookOpen },
  { href: "/modality/mi", label: "MI", icon: BookOpen },
  { href: "/modality/narrative", label: "Narrative", icon: BookOpen },
  { href: "/modality/psychodynamic", label: "Psychodynamic", icon: BookOpen },
  { href: "/modality/sfbt", label: "SFBT", icon: BookOpen },
  { href: "/questions", label: "Questions", icon: MessageSquare },
  { href: "/compare", label: "Compare Lenses", icon: GitCompare },
  { href: "/worksheets", label: "Worksheets", icon: FileText },
  { href: "/formulate", label: "AI Formulator", icon: Sparkles },
  { href: "/toolkit", label: "My Toolkit", icon: Star },
];

const MODALITY_NAMES: Record<string, string> = {
  act: "ACT", adlerian: "Adlerian", cbt: "CBT", dbt: "DBT",
  eft: "EFT", emdr: "EMDR", ifs: "IFS", mi: "MI",
  narrative: "Narrative", psychodynamic: "Psychodynamic", sfbt: "SFBT",
};

function getBreadcrumbs(path: string) {
  const crumbs: { label: string; href: string }[] = [{ label: "Home", href: "/" }];
  if (path === "/") return crumbs;

  if (path.startsWith("/modality/")) {
    const slug = path.split("/")[2];
    crumbs.push({ label: MODALITY_NAMES[slug] || slug, href: path });
  } else if (path === "/compare") {
    crumbs.push({ label: "Compare Lenses", href: "/compare" });
  } else if (path === "/questions") {
    crumbs.push({ label: "Question Repository", href: "/questions" });
  } else if (path === "/worksheets") {
    crumbs.push({ label: "Worksheets", href: "/worksheets" });
  } else if (path.startsWith("/worksheets/")) {
    crumbs.push({ label: "Worksheets", href: "/worksheets" });
    const slug = path.split("/")[2];
    const name = slug === "safety-plan" ? "Safety Plan" : (MODALITY_NAMES[slug] || slug);
    crumbs.push({ label: name, href: path });
  } else if (path === "/formulate") {
    crumbs.push({ label: "AI Formulator", href: "/formulate" });
  } else if (path === "/toolkit") {
    crumbs.push({ label: "My Toolkit", href: "/toolkit" });
  } else if (path === "/about") {
    crumbs.push({ label: "About", href: "/about" });
  }
  return crumbs;
}

/* Global Search Modal */
function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
    }
  }, [open]);

  if (!open) return null;

  const SEARCH_ITEMS = [
    ...NAV_ITEMS.filter(i => i.href !== "/").map(i => ({ label: i.label, href: i.href, type: "page" as const })),
    { label: "Safety Plan Worksheet", href: "/worksheets/safety-plan", type: "worksheet" as const },
    ...Object.entries(MODALITY_NAMES).map(([slug, name]) => ({
      label: `${name} Worksheet`, href: `/worksheets/${slug}`, type: "worksheet" as const,
    })),
  ];

  // Deduplicate by href
  const uniqueItems = SEARCH_ITEMS.filter((item, i, arr) => arr.findIndex(x => x.href === item.href) === i);

  const filtered = query.trim()
    ? uniqueItems.filter(i => i.label.toLowerCase().includes(query.toLowerCase()))
    : uniqueItems.slice(0, 10);

  const handleSelect = (href: string) => {
    onClose();
    setLocation(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg mx-4 bg-card rounded-xl border border-border shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search size={18} className="text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, modalities, worksheets..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            style={{ fontFamily: 'var(--font-body)' }}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "Enter" && filtered.length > 0) handleSelect(filtered[0].href);
            }}
          />
          <button onClick={onClose} className="p-1 rounded hover:bg-muted transition-colors">
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>
        <div className="max-h-[300px] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground text-center" style={{ fontFamily: 'var(--font-body)' }}>
              No results found.
            </p>
          ) : (
            filtered.map(item => (
              <button
                key={item.href}
                onClick={() => handleSelect(item.href)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-muted transition-colors"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <span className="text-foreground">{item.label}</span>
                <span className="text-[10px] text-muted-foreground/60 ml-auto">{item.type}</span>
              </button>
            ))
          )}
        </div>
        <div className="px-4 py-2 border-t border-border/50 text-[10px] text-muted-foreground flex gap-4" style={{ fontFamily: 'var(--font-body)' }}>
          <span><kbd className="px-1 py-0.5 rounded bg-muted text-[9px]">↵</kbd> select</span>
          <span><kbd className="px-1 py-0.5 rounded bg-muted text-[9px]">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const breadcrumbs = getBreadcrumbs(location);
  const isHome = location === "/";
  const showSidebar = !isHome; // Sidebar on inner pages only

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(o => !o); }
      if (e.altKey && e.key === "d") { e.preventDefault(); toggleTheme?.(); }
      if (e.key === "Escape") { setSidebarOpen(false); setSearchOpen(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggleTheme]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip link */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 no-print ${
          scrolled
            ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
            : "bg-background/80 backdrop-blur-sm"
        }`}
      >
        <div className="container flex items-center justify-between h-14 md:h-16">
          <div className="flex items-center gap-3">
            {/* Hamburger menu — visible on mobile for ALL pages */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 -ml-2 rounded-md hover:bg-muted transition-colors"
              aria-label="Toggle navigation"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link href="/" className="flex items-center gap-2 group">
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold"
                style={{ background: '#975F57', color: '#EEECE1' }}
              >
                TM
              </div>
              <div className="hidden sm:block">
                <div
                  className="text-sm font-semibold leading-tight text-foreground group-hover:text-primary transition-colors"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Therapeutic Modalities
                </div>
                <div
                  className="text-[10px] text-muted-foreground tracking-wide uppercase"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Training Lens Guide
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-1">
            {/* Search button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-md hover:bg-muted transition-colors hidden sm:flex items-center gap-2 text-xs text-muted-foreground"
              aria-label="Search"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <Search size={16} />
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden md:inline px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground/60">⌘K</kbd>
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-md hover:bg-muted transition-colors sm:hidden"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <button
              onClick={() => toggleTheme?.()}
              className="p-2 rounded-md hover:bg-muted transition-colors"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* Breadcrumb — inner pages only */}
        {!isHome && (
          <div className="container pb-2">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb.href} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight size={12} className="opacity-50" />}
                  {i === breadcrumbs.length - 1 ? (
                    <span className="text-foreground font-medium">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="hover:text-primary transition-colors">
                      {crumb.label}
                    </Link>
                  )}
                </span>
              ))}
            </nav>
          </div>
        )}
      </header>

      <div className="flex flex-1">
        {/* Mobile overlay — always available */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar navigation drawer */}
        <aside
          className={`fixed lg:sticky top-14 md:top-16 left-0 z-30 h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border overflow-y-auto transition-transform duration-300 shrink-0 ${
            sidebarOpen
              ? "translate-x-0"
              : showSidebar
                ? "-translate-x-full lg:translate-x-0"
                : "-translate-x-full"
          }`}
        >
          <nav className="p-4 space-y-1" aria-label="Main navigation">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40 px-3 mb-2" style={{ fontFamily: 'var(--font-body)' }}>
              Navigation
            </div>
            {NAV_ITEMS.map((item) => {
              const isActive = location === item.href ||
                (item.href !== "/" && location.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`}
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  <Icon size={16} className="shrink-0 opacity-70" />
                  {item.label}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#975F57' }} />
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main id="main-content" className="flex-1 min-w-0">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-auto no-print">
        <div className="container py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
            <div>
              <div className="font-semibold text-foreground mb-2 text-[11px] uppercase tracking-wider">Modalities</div>
              <div className="space-y-1.5">
                {Object.entries(MODALITY_NAMES).slice(0, 6).map(([slug, name]) => (
                  <Link key={slug} href={`/modality/${slug}`} className="block hover:text-primary transition-colors">{name}</Link>
                ))}
              </div>
            </div>
            <div>
              <div className="font-semibold text-foreground mb-2 text-[11px] uppercase tracking-wider">More</div>
              <div className="space-y-1.5">
                {Object.entries(MODALITY_NAMES).slice(6).map(([slug, name]) => (
                  <Link key={slug} href={`/modality/${slug}`} className="block hover:text-primary transition-colors">{name}</Link>
                ))}
              </div>
            </div>
            <div>
              <div className="font-semibold text-foreground mb-2 text-[11px] uppercase tracking-wider">Tools</div>
              <div className="space-y-1.5">
                <Link href="/compare" className="block hover:text-primary transition-colors">Compare Lenses</Link>
                <Link href="/questions" className="block hover:text-primary transition-colors">Question Repository</Link>
                <Link href="/worksheets" className="block hover:text-primary transition-colors">Worksheets</Link>
                <Link href="/formulate" className="block hover:text-primary transition-colors">AI Formulator</Link>
                <Link href="/toolkit" className="block hover:text-primary transition-colors">My Toolkit</Link>
              </div>
            </div>
            <div>
              <div className="font-semibold text-foreground mb-2 text-[11px] uppercase tracking-wider">Quick Links</div>
              <div className="space-y-1.5">
                <Link href="/worksheets/safety-plan" className="block hover:text-primary transition-colors">Safety Plan</Link>
                <Link href="/about" className="block hover:text-primary transition-colors">About</Link>
                <Link href="/" className="block hover:text-primary transition-colors">Home</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
