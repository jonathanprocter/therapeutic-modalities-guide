/*
 * WorksheetsPage — Landing page for printable worksheets
 * Cards linking to each modality worksheet + safety plan
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { FileText, Printer } from "lucide-react";
import { MODALITY_LIST } from "@/data/modalities";

const WORKSHEETS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/114222369/Uuign85Z3jY6wv4ZNuBNcb/worksheets-hero-oXGEg8MVVdsmBcHsXUfbh2.webp";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.5 }
  }),
};

const WORKSHEETS = [
  ...MODALITY_LIST.map(m => ({
    slug: m.slug,
    title: `${m.abbr} Worksheet`,
    subtitle: m.name,
    description: `One-page case conceptualization template using the ${m.abbr} lens.`
  })),
  {
    slug: "safety-plan",
    title: "Safety Plan",
    subtitle: "Crisis Response & Means Safety",
    description: "Crisis response and means safety planning template for clinical use."
  }
];

export default function WorksheetsPage() {
  return (
    <div className="container py-8 md:py-12 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero */}
        <div className="relative rounded-xl overflow-hidden mb-10">
          <img src={WORKSHEETS_IMG} alt="" className="w-full h-40 md:h-52 object-cover opacity-30 dark:opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Printable Worksheets
            </h1>
            <p className="text-sm text-muted-foreground max-w-lg" style={{ fontFamily: 'var(--font-body)' }}>
              One-page case formulation templates designed for supervision and case conferences.
              Print or export for use in clinical settings.
            </p>
          </div>
        </div>

        {/* How to Use */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">How to Use These Worksheets</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { num: "1", title: "Choose the Lens", desc: "Select the modality that best fits your client's presentation and your theoretical orientation." },
              { num: "2", title: "Fill the Loop", desc: "Map the maintaining cycle: trigger, meaning, emotion, behavior, and short/long-term consequences." },
              { num: "3", title: "Translate to Plan", desc: "Connect the formulation to specific change targets and evidence-based interventions." },
            ].map((step) => (
              <div key={step.num} className="bg-card rounded-lg border border-border p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground"
                        style={{ background: '#975F57' }}>
                    {step.num}
                  </span>
                  <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Worksheet Cards */}
        <h2 className="text-xl font-semibold text-foreground mb-4">Available Worksheets</h2>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {WORKSHEETS.map((ws, i) => (
            <motion.div key={ws.slug} variants={fadeUp} custom={i}>
              <Link
                href={`/worksheets/${ws.slug}`}
                className="group block bg-card rounded-lg border border-border p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-2">
                  {ws.slug === "safety-plan" ? (
                    <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: 'rgba(151,95,87,0.1)' }}>
                      <FileText size={16} style={{ color: '#975F57' }} />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: 'rgba(151,95,87,0.1)' }}>
                      <Printer size={16} style={{ color: '#975F57' }} />
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                  {ws.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                  {ws.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
