import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { Layout } from "./components/Layout";
import { SessionCompanion } from "./components/SessionCompanion";
import { lazy, Suspense, useEffect } from "react";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const ModalityPage = lazy(() => import("./pages/ModalityPage"));
const ComparePage = lazy(() => import("./pages/ComparePage"));
const QuestionsPage = lazy(() => import("./pages/QuestionsPage"));
const WorksheetsPage = lazy(() => import("./pages/WorksheetsPage"));
const WorksheetDetail = lazy(() => import("./pages/WorksheetDetail"));
const FormulatePage = lazy(() => import("./pages/FormulatePage"));
const ToolkitPage = lazy(() => import("./pages/ToolkitPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));

/* Skeleton loading state — replaces the old "Loading..." text */
function PageSkeleton() {
  return (
    <div className="container py-8 md:py-12 max-w-4xl mx-auto animate-pulse">
      {/* Title skeleton */}
      <div className="h-8 w-64 bg-muted rounded-md mb-3" />
      <div className="h-4 w-96 max-w-full bg-muted/60 rounded mb-8" />
      {/* Content skeleton blocks */}
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="h-5 w-48 bg-muted rounded" />
            <div className="h-3 w-full bg-muted/50 rounded" />
            <div className="h-3 w-5/6 bg-muted/40 rounded" />
            <div className="h-3 w-4/6 bg-muted/30 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* Dynamic page title manager */
const PAGE_TITLES: Record<string, string> = {
  "/": "Therapeutic Modalities Guide",
  "/compare": "Compare Lenses — Therapeutic Modalities Guide",
  "/questions": "Question Repository — Therapeutic Modalities Guide",
  "/worksheets": "Worksheets — Therapeutic Modalities Guide",
  "/formulate": "AI Case Formulation — Therapeutic Modalities Guide",
  "/toolkit": "My Toolkit — Therapeutic Modalities Guide",
  "/about": "About — Therapeutic Modalities Guide",
};

const MODALITY_NAMES: Record<string, string> = {
  act: "ACT", adlerian: "Adlerian", cbt: "CBT", emdr: "EMDR",
  ifs: "IFS", mi: "MI", narrative: "Narrative", sfbt: "SFBT",
  dbt: "DBT", eft: "EFT", psychodynamic: "Psychodynamic",
};

function TitleManager() {
  const [location] = useLocation();

  useEffect(() => {
    let title = PAGE_TITLES[location];
    if (!title) {
      if (location.startsWith("/modality/")) {
        const slug = location.split("/")[2];
        const name = MODALITY_NAMES[slug] || slug;
        title = `${name} — Therapeutic Modalities Guide`;
      } else if (location.startsWith("/worksheets/")) {
        const slug = location.split("/")[2];
        const name = slug === "safety-plan" ? "Safety Plan" : (MODALITY_NAMES[slug] || slug);
        title = `${name} Worksheet — Therapeutic Modalities Guide`;
      } else {
        title = "Therapeutic Modalities Guide";
      }
    }
    document.title = title;
  }, [location]);

  return null;
}

function Router() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/modality/:slug" component={ModalityPage} />
        <Route path="/compare" component={ComparePage} />
        <Route path="/questions" component={QuestionsPage} />
        <Route path="/worksheets" component={WorksheetsPage} />
        <Route path="/worksheets/:slug" component={WorksheetDetail} />
        <Route path="/formulate" component={FormulatePage} />
        <Route path="/toolkit" component={ToolkitPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <FavoritesProvider>
          <TooltipProvider>
            <Toaster />
            <TitleManager />
            <Layout>
              <Router />
            </Layout>
            <SessionCompanion />
          </TooltipProvider>
        </FavoritesProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
