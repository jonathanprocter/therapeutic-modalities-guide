/*
 * FormulatePage — AI Case Formulation Assistant
 * Uses Claude API via server endpoint to generate multi-lens case formulations
 */
import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles, Copy, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { MODALITY_LIST, COMPARE_DATA } from "@/data/modalities";

const EXAMPLE_VIGNETTES = [
  {
    label: "Anxious Avoidance",
    text: "32-year-old cisgender woman presenting with persistent anxiety and avoidance of social situations. She reports difficulty attending work meetings, frequently calling in sick, and increasing isolation over the past 6 months. She describes racing thoughts about being judged, physical tension, and a pattern of canceling plans at the last minute. She has a history of childhood criticism from her father and reports feeling \"never good enough.\" Currently single, works remotely as a software developer, and her only social contact is her sister."
  },
  {
    label: "Couples Conflict",
    text: "Couple in their 40s, married 12 years, presenting with escalating arguments and emotional distance. Partner A (he/him) describes feeling dismissed and shut out; Partner B (she/her) reports feeling overwhelmed by criticism and retreating to avoid conflict. They describe a pattern where A pursues and B withdraws. Recent stressor: Partner B received a promotion requiring more travel. Both report love for each other but feel \"stuck in the same fight.\" No history of violence. One child, age 8."
  },
  {
    label: "Trauma & Identity",
    text: "24-year-old non-binary client (they/them) referred by college counseling center. Presenting with flashbacks, nightmares, and hypervigilance following a sexual assault 18 months ago. Reports difficulty trusting others, shame about the assault, and identity confusion related to both gender identity and the trauma. Has supportive friend group but hasn't disclosed the assault. Academic performance declining. History of supportive family but hasn't come out to parents about gender identity. Currently on sertraline 50mg prescribed by psychiatrist."
  },
];

const MAX_CHARS = 2000;

export default function FormulatePage() {
  const [vignette, setVignette] = useState("");
  const [selectedModalities, setSelectedModalities] = useState<string[]>(
    MODALITY_LIST.map(m => m.slug)
  );
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const toggleModality = useCallback((slug: string) => {
    setSelectedModalities(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  }, []);

  const selectAll = () => setSelectedModalities(MODALITY_LIST.map(m => m.slug));
  const selectNone = () => setSelectedModalities([]);

  const handleGenerate = useCallback(async () => {
    if (!vignette.trim() || selectedModalities.length === 0) return;

    setLoading(true);
    setError(null);
    setResponse("");

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/formulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vignette: vignette.trim(),
          modalities: selectedModalities,
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Server error" }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      // Handle SSE streaming
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No response body");

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                setResponse(prev => prev + parsed.text);
              }
              if (parsed.error) {
                setError(parsed.error);
              }
            } catch {
              // non-JSON data line, append as text
              setResponse(prev => prev + data);
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError(err.message || "Failed to generate formulation");
      }
    } finally {
      setLoading(false);
    }
  }, [vignette, selectedModalities]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(response);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancel = () => {
    abortRef.current?.abort();
    setLoading(false);
  };

  return (
    <div className="container py-8 md:py-12 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={20} style={{ color: '#975F57' }} />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              AI Case Formulation Assistant
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl" style={{ fontFamily: 'var(--font-body)' }}>
            Enter a case vignette and select therapeutic lenses. Claude will generate parallel
            case formulations showing how each modality would conceptualize the case.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
          <label className="block text-sm font-semibold text-foreground mb-2" style={{ fontFamily: 'var(--font-body)' }}>
            Case Vignette
          </label>
          <textarea
            value={vignette}
            onChange={e => setVignette(e.target.value.slice(0, MAX_CHARS))}
            rows={6}
            placeholder="Describe the client's presenting concerns, history, and relevant context..."
            className="w-full bg-muted/30 border border-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            style={{ fontFamily: 'var(--font-body)' }}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
              {vignette.length}/{MAX_CHARS} characters
            </span>
            <div className="flex gap-2">
              {EXAMPLE_VIGNETTES.map(ex => (
                <button
                  key={ex.label}
                  onClick={() => setVignette(ex.text)}
                  className="text-xs px-2 py-1 rounded border border-border bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          {/* Modality Selection */}
          <div className="mt-5 pt-5 border-t border-border/50">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-body)' }}>
                Therapeutic Lenses ({selectedModalities.length}/{MODALITY_LIST.length})
              </label>
              <div className="flex gap-2">
                <button onClick={selectAll} className="text-xs text-primary hover:underline" style={{ fontFamily: 'var(--font-body)' }}>All</button>
                <button onClick={selectNone} className="text-xs text-primary hover:underline" style={{ fontFamily: 'var(--font-body)' }}>None</button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {MODALITY_LIST.map(mod => {
                const selected = selectedModalities.includes(mod.slug);
                return (
                  <button
                    key={mod.slug}
                    onClick={() => toggleModality(mod.slug)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${
                      selected
                        ? "border-primary/50 bg-primary/10 text-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary/30"
                    }`}
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {mod.abbr}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate Button */}
          <div className="mt-5 flex gap-3">
            <button
              onClick={handleGenerate}
              disabled={loading || !vignette.trim() || selectedModalities.length === 0}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{ background: '#975F57', fontFamily: 'var(--font-body)' }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate Formulations
                </>
              )}
            </button>
            {loading && (
              <button
                onClick={handleCancel}
                className="px-4 py-2.5 text-sm rounded-lg border border-border bg-card hover:bg-muted transition-colors"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-lg border border-destructive/30 bg-destructive/5 text-sm text-destructive" style={{ fontFamily: 'var(--font-body)' }}>
            {error}
          </div>
        )}

        {/* Response */}
        {response && (
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Case Formulations</h2>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-border bg-card hover:bg-muted transition-colors"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div
              className="prose prose-sm dark:prose-invert max-w-none text-foreground"
              style={{ fontFamily: 'var(--font-body)' }}
              dangerouslySetInnerHTML={{ __html: formatMarkdown(response) }}
            />
          </div>
        )}

        {/* Comparison Data Reference */}
        {!response && !loading && (
          <div className="bg-muted/30 rounded-lg border border-border/50 p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">How it works</h3>
            <ol className="space-y-2 text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 text-white" style={{ background: '#975F57' }}>1</span>
                Enter a clinical vignette describing the client and presenting concerns
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 text-white" style={{ background: '#975F57' }}>2</span>
                Select which therapeutic lenses to apply (default: all 11)
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 text-white" style={{ background: '#975F57' }}>3</span>
                Claude generates a formulation for each selected lens, identifying maintaining factors, change targets, and recommended interventions
              </li>
            </ol>
            <p className="text-xs text-muted-foreground/60 mt-4 italic" style={{ fontFamily: 'var(--font-body)' }}>
              Requires ANTHROPIC_API_KEY environment variable to be configured on the server.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* Simple markdown-to-HTML for streaming response */
function formatMarkdown(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-foreground mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-foreground mt-8 mb-3" style="color: #975F57">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-foreground mt-8 mb-3">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal">$2</li>')
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/\n/g, "<br>")
    .replace(/^/, "<p>")
    .replace(/$/, "</p>");
}
