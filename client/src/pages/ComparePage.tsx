/*
 * ComparePage — Lens Comparison Matrix
 * Responsive table + mobile card view comparing all 8 modalities
 */
import { motion } from "framer-motion";
import { Link } from "wouter";
import { COMPARE_DATA } from "@/data/modalities";

const COMPARE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/114222369/Uuign85Z3jY6wv4ZNuBNcb/compare-hero-RsouYLwExvQbahBRbUtoyb.webp";

const COLUMNS = [
  { key: "coreQuestion" as const, label: "Core Question" },
  { key: "assessmentFocus" as const, label: "Assessment Focus" },
  { key: "maintainingFactors" as const, label: "Maintaining Factors" },
  { key: "changeTargets" as const, label: "Change Targets" },
  { key: "firstLine" as const, label: "First-Line Interventions" },
  { key: "bestFit" as const, label: "Best Fit / When to Consider" },
];

export default function ComparePage() {
  return (
    <div className="container py-8 md:py-12 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero */}
        <div className="relative rounded-xl overflow-hidden mb-10">
          <img
            src={COMPARE_IMG}
            alt=""
            className="w-full h-40 md:h-52 object-cover opacity-25 dark:opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-8">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-2 block"
                  style={{ fontFamily: 'var(--font-body)' }}>
              Training Tool
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Compare Lenses at a Glance
            </h1>
            <p className="text-sm text-muted-foreground max-w-lg" style={{ fontFamily: 'var(--font-body)' }}>
              Use this matrix to quickly see how each modality frames the problem, what it targets,
              and which interventions are typical.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {["Assessment focus", "Maintaining factors", "Change targets", "Intervention fit"].map(tag => (
                <span key={tag} className="px-2 py-0.5 text-[10px] font-medium rounded-full border border-border bg-card/60 text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm" style={{ fontFamily: 'var(--font-body)' }}>
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-3 font-semibold text-foreground whitespace-nowrap border-b border-border">Lens</th>
                  {COLUMNS.map(col => (
                    <th key={col.key} className="text-left p-3 font-semibold text-foreground whitespace-nowrap border-b border-border">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_DATA.map((row, i) => (
                  <tr key={row.slug} className={`${i % 2 === 0 ? 'bg-card' : 'bg-card/50'} hover:bg-muted/30 transition-colors`}>
                    <td className="p-3 border-b border-border">
                      <Link href={`/modality/${row.slug}`} className="font-semibold text-primary hover:underline whitespace-nowrap">
                        {row.lens}
                      </Link>
                    </td>
                    <td className="p-3 border-b border-border text-muted-foreground min-w-[180px]">{row.coreQuestion}</td>
                    <td className="p-3 border-b border-border text-muted-foreground min-w-[160px]">{row.assessmentFocus}</td>
                    <td className="p-3 border-b border-border text-muted-foreground min-w-[160px]">{row.maintainingFactors}</td>
                    <td className="p-3 border-b border-border text-muted-foreground min-w-[160px]">{row.changeTargets}</td>
                    <td className="p-3 border-b border-border text-muted-foreground min-w-[160px]">{row.firstLine}</td>
                    <td className="p-3 border-b border-border text-muted-foreground min-w-[160px]">{row.bestFit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {COMPARE_DATA.map((row, i) => (
            <motion.div
              key={row.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="bg-card rounded-lg border border-border p-4"
            >
              <Link href={`/modality/${row.slug}`} className="text-base font-semibold text-primary hover:underline mb-3 block">
                {row.lens}
              </Link>
              <dl className="space-y-3 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                {COLUMNS.map(col => (
                  <div key={col.key}>
                    <dt className="text-xs font-semibold text-foreground mb-0.5">{col.label}</dt>
                    <dd className="text-muted-foreground leading-relaxed">{row[col.key]}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          ))}
        </div>

        {/* Advisory */}
        <div className="mt-6 p-4 rounded-lg border-l-4 bg-card/80" style={{ borderLeftColor: '#A7B3AA' }}>
          <p className="text-xs text-muted-foreground leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
            <strong className="text-foreground">Tip:</strong> Pair this matrix with the{" "}
            <Link href="/worksheets" className="text-primary hover:underline">printable worksheets</Link>{" "}
            on each modality page for quick supervision prep.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
