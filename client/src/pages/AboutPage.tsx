/*
 * AboutPage — Project description and credits
 */
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container py-8 md:py-12 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: '#975F57' }}
          >
            <BookOpen size={20} color="#EEECE1" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            About This Guide
          </h1>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none" style={{ fontFamily: 'var(--font-body)' }}>
          <p className="text-muted-foreground leading-relaxed">
            The <strong className="text-foreground">Therapeutic Modalities Guide</strong> is a
            comprehensive digital reference tool designed for mental health counselors, trainees,
            and clinical supervisors. It covers 11 evidence-based therapy approaches, each
            presented through a case conceptualization lens.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">What's Included</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li><strong className="text-foreground">11 Modality Pages</strong> — ACT, Adlerian, CBT, DBT, EFT, EMDR, IFS, MI, Narrative, Psychodynamic, and SFBT with full conceptualization frameworks</li>
            <li><strong className="text-foreground">2,200+ Therapeutic Questions</strong> — Curated across self-awareness, counseling session, Gestalt, humanistic, and crisis/safety banks</li>
            <li><strong className="text-foreground">Printable Worksheets</strong> — One-page case conceptualization templates for each modality plus a safety plan</li>
            <li><strong className="text-foreground">Compare Lenses Matrix</strong> — Side-by-side comparison of how each modality frames assessment, maintaining factors, change targets, and interventions</li>
            <li><strong className="text-foreground">AI Case Formulation</strong> — Generate multi-lens case formulations using Claude AI</li>
            <li><strong className="text-foreground">Personal Toolkit</strong> — Star and save your favorite questions, modalities, and worksheets</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">For Clinical Use</h2>
          <p className="text-muted-foreground leading-relaxed">
            This tool is intended as a training and reference resource. It does not replace
            clinical judgment, supervision, or evidence-based treatment planning. All content
            should be applied within the context of the therapeutic relationship and the
            clinician's scope of practice.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Technology</h2>
          <p className="text-muted-foreground leading-relaxed">
            Built with React, Vite, Tailwind CSS, and Framer Motion. AI features powered by
            Anthropic's Claude API.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
