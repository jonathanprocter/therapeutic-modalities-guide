/*
 * WorksheetDetail — Individual printable worksheet
 * Renders a one-page case conceptualization form with scaffold prompts
 */
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { Printer, ArrowLeft } from "lucide-react";
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

export default function WorksheetDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const worksheet = worksheets.find(w => w.slug === slug);

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
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-border bg-card hover:bg-muted transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <Printer size={14} />
            Print / Export PDF
          </button>
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
                <div className="h-6 border-b border-border" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1" style={{ fontFamily: 'var(--font-body)' }}>
                  Date
                </label>
                <div className="h-6 border-b border-border" />
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
                <div className="h-6 border-b border-border" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1" style={{ fontFamily: 'var(--font-body)' }}>
                  Date Created
                </label>
                <div className="h-6 border-b border-border" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1" style={{ fontFamily: 'var(--font-body)' }}>
                  Date Reviewed
                </label>
                <div className="h-6 border-b border-border" />
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
                  <div className="space-y-3">
                    {Array.from({ length: isSafetyPlan ? 4 : (isWide ? 4 : 3) }).map((_, j) => (
                      <div key={j} className="h-px bg-border/70" />
                    ))}
                  </div>
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
