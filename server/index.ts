import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "16kb" }));

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // AI Case Formulation endpoint
  app.post("/api/formulate", async (req, res) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return res.status(503).json({
        error: "ANTHROPIC_API_KEY not configured. Set the environment variable and restart the server.",
      });
    }

    const { vignette, modalities } = req.body;

    if (!vignette || typeof vignette !== "string" || vignette.length > 2500) {
      return res.status(400).json({ error: "Invalid vignette (max 2500 chars)" });
    }

    if (!Array.isArray(modalities) || modalities.length === 0) {
      return res.status(400).json({ error: "Select at least one modality" });
    }

    const modalityNames: Record<string, string> = {
      act: "ACT (Acceptance and Commitment Therapy)",
      adlerian: "Adlerian Therapy",
      cbt: "CBT (Cognitive Behavioral Therapy)",
      dbt: "DBT (Dialectical Behavior Therapy)",
      eft: "EFT (Emotionally Focused Therapy)",
      emdr: "EMDR (Eye Movement Desensitization and Reprocessing)",
      ifs: "IFS (Internal Family Systems)",
      mi: "MI (Motivational Interviewing)",
      narrative: "Narrative Therapy",
      psychodynamic: "Psychodynamic Therapy",
      sfbt: "SFBT (Solution-Focused Brief Therapy)",
    };

    const selectedNames = modalities
      .filter((s: string) => modalityNames[s])
      .map((s: string) => modalityNames[s]);

    if (selectedNames.length === 0) {
      return res.status(400).json({ error: "No valid modalities selected" });
    }

    const systemPrompt = `You are a clinical supervisor and expert in multiple therapeutic modalities. Given a case vignette, generate a case formulation from each selected therapeutic lens.

For each modality, provide:
1. **Core Question** — What this lens asks about the client
2. **Assessment Focus** — What to look for from this lens
3. **Maintaining Factors** — What keeps the problem going
4. **Change Targets** — What treatment will target
5. **Recommended Interventions** — First-line techniques
6. **Brief Formulation** — 2-3 sentence formulation from this lens

Format each modality as a section with ## heading. Be concise, clinical, and practical. Write for a graduate-level trainee audience.`;

    const userPrompt = `Case Vignette:
${vignette}

Generate case formulations using these therapeutic lenses: ${selectedNames.join(", ")}`;

    try {
      // Dynamic import to avoid issues if not installed
      const { default: Anthropic } = await import("@anthropic-ai/sdk");
      const client = new Anthropic({ apiKey });

      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });

      const stream = client.messages.stream({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      });

      stream.on("text", (text) => {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      });

      stream.on("end", () => {
        res.write("data: [DONE]\n\n");
        res.end();
      });

      stream.on("error", (err) => {
        res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
        res.write("data: [DONE]\n\n");
        res.end();
      });

      // Handle client disconnect
      req.on("close", () => {
        stream.abort();
      });
    } catch (err: any) {
      if (!res.headersSent) {
        res.status(500).json({ error: err.message || "Failed to generate formulation" });
      }
    }
  });

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
