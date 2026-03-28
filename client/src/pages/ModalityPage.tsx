/*
 * ModalityPage — Editorial modality detail page
 * All sections collapsed by default, skeleton loading, prev/next nav
 */
import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { loadModalities, type Modality, MODALITY_LIST } from "@/data/modalities";
import {
  ChevronDown, ChevronUp, FileText, Printer, ClipboardCopy, ArrowLeft, ArrowRight
} from "lucide-react";
import { toast } from "sonner";

function SectionBlock({ section, defaultOpen = false }: { section: any; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section id={section.id} className="scroll-mt-20">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 border-b border-border group"
        aria-expanded={open}
      >
        <h2 className="text-lg md:text-xl font-semibold text-foreground group-hover:text-primary transition-colors text-left">
          {section.title}
        </h2>
        {open ? <ChevronUp size={18} className="text-muted-foreground shrink-0" /> : <ChevronDown size={18} className="text-muted-foreground shrink-0" />}
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="py-4 space-y-4"
        >
          {section.paragraphs?.map((p: string, i: number) => (
            <p key={i} className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
              {p}
            </p>
          ))}

          {section.subsections?.length > 0 && (
            <div className="space-y-5">
              {section.subsections.map((sub: any, i: number) => (
                <div key={i}>
                  {sub.title && (
                    <h3 className="text-sm font-semibold text-foreground mb-2">{sub.title}</h3>
                  )}
                  {sub.paragraphs?.map((p: string, j: number) => (
                    <p key={j} className="text-sm text-muted-foreground leading-relaxed mb-2" style={{ fontFamily: 'var(--font-body)' }}>
                      {p}
                    </p>
                  ))}
                  {sub.items?.length > 0 && (
                    <ul className="space-y-1.5 ml-4">
                      {sub.items.map((item: string, j: number) => (
                        <li key={j} className="text-sm text-muted-foreground flex items-start gap-2" style={{ fontFamily: 'var(--font-body)' }}>
                          <span className="w-1 h-1 rounded-full mt-2 shrink-0" style={{ background: '#975F57' }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {section.items?.length > 0 && !section.subsections?.length && (
            <ul className="space-y-1.5 ml-4">
              {section.items.map((item: string, i: number) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2" style={{ fontFamily: 'var(--font-body)' }}>
                  <span className="w-1 h-1 rounded-full mt-2 shrink-0" style={{ background: '#975F57' }} />
                  {item}
                </li>
              ))}
            </ul>
          )}

          {section.callout && (
            <div className="p-4 rounded-lg border-l-4 bg-card/80" style={{ borderLeftColor: '#975F57' }}>
              <p className="text-sm text-muted-foreground italic leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                {section.callout}
              </p>
            </div>
          )}
        </motion.div>
      )}
    </section>
  );
}

/* Skeleton for loading state */
function ModalitySkeleton() {
  return (
    <div className="container py-8 md:py-12 max-w-4xl mx-auto animate-pulse">
      <div className="h-9 w-72 bg-muted rounded-md mb-3" />
      <div className="h-4 w-96 max-w-full bg-muted/60 rounded mb-8" />
      <div className="flex gap-2 mb-6">
        <div className="h-8 w-24 bg-muted/50 rounded" />
        <div className="h-8 w-28 bg-muted/50 rounded" />
        <div className="h-8 w-24 bg-muted/50 rounded" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 w-full bg-muted/40 rounded border-b border-border" />
        ))}
      </div>
    </div>
  );
}

export default function ModalityPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const [modality, setModality] = useState<Modality | null>(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    loadModalities().then((data) => {
      setModality(data[slug] || null);
      setLoading(false);
    });
  }, [slug]);

  const currentIdx = MODALITY_LIST.findIndex(m => m.slug === slug);
  const prev = currentIdx > 0 ? MODALITY_LIST[currentIdx - 1] : null;
  const next = currentIdx < MODALITY_LIST.length - 1 ? MODALITY_LIST[currentIdx + 1] : null;

  const handleCopy = () => {
    if (!contentRef.current) return;
    const text = contentRef.current.innerText;
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Content copied to clipboard");
    }).catch(() => {
      toast.error("Failed to copy");
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <ModalitySkeleton />;

  if (!modality) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Modality Not Found</h1>
        <p className="text-muted-foreground mb-4" style={{ fontFamily: 'var(--font-body)' }}>
          The modality "{slug}" could not be found.
        </p>
        <Link href="/" className="text-primary hover:underline" style={{ fontFamily: 'var(--font-body)' }}>Return home</Link>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            {modality.name} ({modality.abbr})
          </h1>
          <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
            {modality.description}
          </p>
        </div>

        {/* Tools bar */}
        <div className="flex flex-wrap gap-2 mb-6 no-print">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-card hover:bg-muted transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <Printer size={14} />
            Export PDF
          </button>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-card hover:bg-muted transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <ClipboardCopy size={14} />
            Copy to Clipboard
          </button>
          <Link
            href={`/worksheets/${slug}`}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-card hover:bg-muted transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <FileText size={14} />
            Print Worksheet
          </Link>
        </div>

        {/* Quick jump */}
        <div className="flex flex-wrap gap-2 mb-8 no-print">
          <span className="text-xs font-semibold text-foreground" style={{ fontFamily: 'var(--font-body)' }}>Quick Jump:</span>
          {modality.sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-xs hover:underline"
              style={{ fontFamily: 'var(--font-body)', color: '#975F57' }}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {s.title}
            </a>
          ))}
        </div>

        {/* Content sections — ALL collapsed by default */}
        <div ref={contentRef} className="space-y-2">
          {modality.sections.map((section) => (
            <SectionBlock key={section.id} section={section} defaultOpen={false} />
          ))}
        </div>

        {/* Previous / Next navigation */}
        <div className="flex justify-between items-center mt-12 pt-6 border-t border-border no-print">
          {prev ? (
            <Link
              href={`/modality/${prev.slug}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <ArrowLeft size={16} />
              <span>{prev.abbr}</span>
            </Link>
          ) : <div />}
          {next ? (
            <Link
              href={`/modality/${next.slug}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <span>{next.abbr}</span>
              <ArrowRight size={16} />
            </Link>
          ) : <div />}
        </div>
      </motion.div>
    </div>
  );
}
