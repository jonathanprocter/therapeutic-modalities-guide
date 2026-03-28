/*
 * WorksheetDetail — Individual fillable worksheet
 * Renders a case conceptualization form with editable textareas and localStorage persistence
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { Printer, ArrowLeft, Trash2 } from "lucide-react";
import worksheetsRaw from "@/data/worksheets_data.json";

interface WorksheetField {
  name: string;
  prompt: string;
}

interface WorksheetData {
  slug: string;
  title: string;
  subtitle: string;
  fields: WorksheetField[];
}

const worksheets: WorksheetData[] = worksheetsRaw as WorksheetData[];

function storageKey(slug: string) {
  return `worksheet-${slug}`;
}

export default function WorksheetDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const worksheet = worksheets.find(w => w.slug === slug);

  const [values, setValues] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(storageKey(slug));
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-save on change (debounced)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      localStorage.setItem(storageKey(slug), JSON.stringify(values));
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [values, slug]);

  const handleChange = useCallback((fieldIdx: number, value: string) => {
    setValues(prev => ({ ...prev, [fieldIdx]: value }));
  }, []);

  const handleClearAll = useCallback(() => {
    if (window.confirm("Clear all responses on this worksheet?")) {
      setValues({});
      localStorage.removeItem(storageKey(slug));
    }
  }, [slug]);

  if (!worksheet) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Worksheet Not Found</h1>
        <Link href="/worksheets" className="text-primary hover:underline">Back to worksheets</Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const isSafetyPlan = slug === "safety-plan";
  const hasContent = Object.values(values).some(v => v.trim().length > 0);

  return (
    <div className="container py-8 md:py-12 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Tools bar */}
        <div className="flex items-center justify-between mb-6 no-print">
          <Link
            href="/worksheets"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <ArrowLeft size={16} />
            All Worksheets
          </Link>
          <div className="flex items-center gap-2">
            {hasContent && (
              <button
                onClick={handleClearAll}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border border-border bg-card hover:bg-destructive/10 hover:text-destructive transition-colors"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <Trash2 size={14} />
                Clear All
              </button>
            )}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-border bg-card hover:bg-muted transition-colors"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <Printer size={14} />
              Print / Export PDF
            </button>
          </div>
        </div>

        {/* Worksheet */}
        <div className="bg-card rounded-lg border border-border p-6 md:p-8 worksheet-print">
          {/* Header */}
          <div className="text-center mb-6 pb-4 border-b border-border">
            <h1 className="text-xl md:text-2xl font-bold text-foreground mb-1">
              {worksheet.title}
            </h1>
            <p className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
              {worksheet.subtitle}
            </p>
            {isSafetyPlan && (
              <p className="text-xs mt-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive inline-block" style={{ fontFamily: 'var(--font-body)' }}>
                Complete collaboratively with client — review and update regularly
              </p>
            )}
          </div>

          {/* Client info row — only for modality worksheets */}
          {!isSafetyPlan && (
            <div className="grid grid-cols-2 gap-4 mb-6 pb-4 border-b border-border/50">
              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1" style={{ fontFamily: 'var(--font-body)' }}>
                  Client
                </label>
                <input
                  type="text"
                  value={values["client-name"] || ""}
                  onChange={e => setValues(prev => ({ ...prev, "client-name": e.target.value }))}
                  className="w-full border-b border-border bg-transparent text-sm text-foreground focus:outline-none focus:border-primary h-7 print:border-0"
                  style={{ fontFamily: 'var(--font-body)' }}
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1" style={{ fontFamily: 'var(--font-body)' }}>
                  Date
                </label>
                <input
                  type="text"
                  value={values["client-date"] || ""}
                  onChange={e => setValues(prev => ({ ...prev, "client-date": e.target.value }))}
                  className="w-full border-b border-border bg-transparent text-sm text-foreground focus:outline-none focus:border-primary h-7 print:border-0"
                  style={{ fontFamily: 'var(--font-body)' }}
                />
              </div>
            </div>
          )}

          {/* Safety plan: client info */}
          {isSafetyPlan && (
            <div className="grid grid-cols-3 gap-4 mb-6 pb-4 border-b border-border/50">
              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1" style={{ fontFamily: 'var(--font-body)' }}>
                  Client
                </label>
                <input
                  type="text"
                  value={values["sp-client"] || ""}
                  onChange={e => setValues(prev => ({ ...prev, "sp-client": e.target.value }))}
                  className="w-full border-b border-border bg-transparent text-sm text-foreground focus:outline-none focus:border-primary h-7 print:border-0"
                  style={{ fontFamily: 'var(--font-body)' }}
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1" style={{ fontFamily: 'var(--font-body)' }}>
                  Date Created
                </label>
                <input
                  type="text"
                  value={values["sp-created"] || ""}
                  onChange={e => setValues(prev => ({ ...prev, "sp-created": e.target.value }))}
                  className="w-full border-b border-border bg-transparent text-sm text-foreground focus:outline-none focus:border-primary h-7 print:border-0"
                  style={{ fontFamily: 'var(--font-body)' }}
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1" style={{ fontFamily: 'var(--font-body)' }}>
                  Date Reviewed
                </label>
                <input
                  type="text"
                  value={values["sp-reviewed"] || ""}
                  onChange={e => setValues(prev => ({ ...prev, "sp-reviewed": e.target.value }))}
                  className="w-full border-b border-border bg-transparent text-sm text-foreground focus:outline-none focus:border-primary h-7 print:border-0"
                  style={{ fontFamily: 'var(--font-body)' }}
                />
              </div>
            </div>
          )}

          {/* Fields */}
          <div className={isSafetyPlan ? "space-y-5" : "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5"}>
            {worksheet.fields.map((field, i) => {
              const isWide = !isSafetyPlan && (
                field.name.toLowerCase().includes("hypothesis") ||
                field.name.toLowerCase().includes("formulation") ||
                field.name.toLowerCase().includes("plan") ||
                field.name.toLowerCase().includes("notes") ||
                field.name.toLowerCase().includes("context")
              );
              const rows = isSafetyPlan ? 4 : (isWide ? 4 : 3);
              return (
                <div
                  key={i}
                  className={`worksheet-field-print ${isWide ? "md:col-span-2" : ""}`}
                >
                  <label className="block text-xs font-semibold text-foreground mb-1" style={{ fontFamily: 'var(--font-body)' }}>
                    {isSafetyPlan && <span className="inline-block w-5 h-5 rounded-full text-[10px] font-bold text-center leading-5 mr-2 text-primary-foreground" style={{ background: '#975F57' }}>{i + 1}</span>}
                    {field.name}
                  </label>
                  {field.prompt && (
                    <p className="text-[11px] text-muted-foreground/70 italic mb-2 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                      {field.prompt}
                    </p>
                  )}
                  <textarea
                    value={values[i] || ""}
                    onChange={e => handleChange(i, e.target.value)}
                    rows={rows}
                    placeholder="Type here..."
                    className="w-full bg-muted/30 border border-border/50 rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring resize-y print:bg-transparent print:border-0 print:ring-0 print:p-0 print:resize-none"
                    style={{ fontFamily: 'var(--font-body)' }}
                  />
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-border text-center">
            <p className="text-[10px] text-muted-foreground/60" style={{ fontFamily: 'var(--font-body)' }}>
              Therapeutic Modalities Guide &mdash; {isSafetyPlan ? "Safety Plan" : "Case Conceptualization Worksheet"} &mdash; For clinical use only
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
