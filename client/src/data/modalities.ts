export interface SubSection {
  title: string;
  items: string[];
  paragraphs: string[];
}

export interface Section {
  id: string;
  title: string;
  paragraphs: string[];
  items: string[];
  subsections: SubSection[];
  callout: string;
}

export interface Modality {
  slug: string;
  abbr: string;
  name: string;
  description: string;
  sections: Section[];
}

export const MODALITIES: Record<string, Modality> = {} as any;

// This will be populated from the JSON data
let _loaded = false;

export async function loadModalities(): Promise<Record<string, Modality>> {
  if (_loaded) return MODALITIES;
  const data = await import("./modalities_data.json");
  Object.assign(MODALITIES, data.default || data);
  _loaded = true;
  return MODALITIES;
}

export const MODALITY_LIST = [
  { slug: "act", abbr: "ACT", name: "Acceptance and Commitment Therapy", description: "Increase psychological flexibility through acceptance, mindfulness, and values-based action." },
  { slug: "adlerian", abbr: "Adlerian", name: "Adlerian Therapy", description: "Foster social interest and belonging through encouragement and insight-oriented techniques." },
  { slug: "cbt", abbr: "CBT", name: "Cognitive Behavioral Therapy", description: "Transform thoughts, emotions, and behaviors through cognitive restructuring and behavioral activation." },
  { slug: "dbt", abbr: "DBT", name: "Dialectical Behavior Therapy", description: "Balance acceptance and change through skills training, mindfulness, distress tolerance, and emotion regulation." },
  { slug: "eft", abbr: "EFT", name: "Emotionally Focused Therapy", description: "Transform distressed relationships by identifying and reshaping negative interaction cycles through attachment theory." },
  { slug: "emdr", abbr: "EMDR", name: "Eye Movement Desensitization and Reprocessing", description: "Process traumatic memories through bilateral stimulation and structured 8-phase protocol." },
  { slug: "ifs", abbr: "IFS", name: "Internal Family Systems", description: "Heal internal parts and access Self-energy through compassionate exploration of the inner system." },
  { slug: "mi", abbr: "MI", name: "Motivational Interviewing", description: "Enhance intrinsic motivation for change through collaborative, empathetic conversation." },
  { slug: "narrative", abbr: "Narrative", name: "Narrative Therapy", description: "Re-author life stories by externalizing problems and discovering alternative narratives." },
  { slug: "psychodynamic", abbr: "Psychodynamic", name: "Psychodynamic Therapy", description: "Explore unconscious processes, early relational patterns, and defense mechanisms to increase self-awareness." },
  { slug: "sfbt", abbr: "SFBT", name: "Solution-Focused Brief Therapy", description: "Build solutions and leverage strengths through future-focused, goal-oriented questions." },
];

export const COMPARE_DATA = [
  { lens: "ACT", slug: "act", coreQuestion: "What reduces psychological flexibility?", assessmentFocus: "Fusion, avoidance, values blocks", maintainingFactors: "Avoidance and rigid self-stories", changeTargets: "Acceptance, defusion, values-based action", firstLine: "Mindfulness, defusion, values work", bestFit: "Chronic avoidance, anxiety, stuckness" },
  { lens: "Adlerian", slug: "adlerian", coreQuestion: "How does belonging shape behavior?", assessmentFocus: "Lifestyle, early recollections, life tasks", maintainingFactors: "Mistaken beliefs and discouragement", changeTargets: "Insight, encouragement, reorientation", firstLine: "Lifestyle assessment, acting as if", bestFit: "Identity, relational patterns, discouragement" },
  { lens: "CBT", slug: "cbt", coreQuestion: "Which thoughts and behaviors maintain distress?", assessmentFocus: "Triggers, automatic thoughts, safety behaviors", maintainingFactors: "Cognitive distortions, avoidance, reinforcement", changeTargets: "Belief testing, behavior change", firstLine: "Thought records, exposure, activation", bestFit: "Anxiety, depression, skills-oriented work" },
  { lens: "DBT", slug: "dbt", coreQuestion: "How does emotion dysregulation drive the problem?", assessmentFocus: "Biosocial history, emotion vulnerability, skills deficits", maintainingFactors: "Emotion-driven behaviors, invalidation cycle", changeTargets: "Distress tolerance, emotion regulation, interpersonal skills", firstLine: "Diary card, chain analysis, skills training", bestFit: "BPD, chronic suicidality, self-harm, emotion dysregulation" },
  { lens: "EFT", slug: "eft", coreQuestion: "What attachment needs are unmet in the cycle?", assessmentFocus: "Negative cycle, attachment fears, primary emotions", maintainingFactors: "Pursue-withdraw cycle, secondary reactive emotions", changeTargets: "Access primary emotions, create bonding events", firstLine: "Cycle de-escalation, evocative responding, enactments", bestFit: "Couple distress, attachment injuries, relational trauma" },
  { lens: "EMDR", slug: "emdr", coreQuestion: "Which memories are unprocessed?", assessmentFocus: "Target memories, triggers, negative cognition", maintainingFactors: "Stuck memory networks, dysregulation", changeTargets: "Adaptive reprocessing, regulation", firstLine: "Target sequencing, resourcing, BLS", bestFit: "Trauma histories, somatic reactivity" },
  { lens: "IFS", slug: "ifs", coreQuestion: "What parts are protecting what pain?", assessmentFocus: "Parts map, polarizations, Self access", maintainingFactors: "Protectors overfunction, exiles hidden", changeTargets: "Unblending, unburdening, integration", firstLine: "Parts mapping, 6 F's, resourcing", bestFit: "Internal conflict, shame, complex trauma" },
  { lens: "MI", slug: "mi", coreQuestion: "How does ambivalence block change?", assessmentFocus: "Change talk, readiness, confidence", maintainingFactors: "Sustain talk, discord, low self-efficacy", changeTargets: "Resolve ambivalence, build motivation", firstLine: "OARS, scaling, decisional balance", bestFit: "Mandated, ambivalent, health behavior change" },
  { lens: "Narrative", slug: "narrative", coreQuestion: "Which story is shaping identity?", assessmentFocus: "Dominant narratives, language, unique outcomes", maintainingFactors: "Problem-saturated story, internalized labels", changeTargets: "Externalization, re-authoring", firstLine: "Mapping influence, documentation practices", bestFit: "Identity concerns, cultural context, meaning" },
  { lens: "Psychodynamic", slug: "psychodynamic", coreQuestion: "What unconscious patterns repeat in relationships?", assessmentFocus: "Core conflicts, defenses, object relations, transference", maintainingFactors: "Unconscious repetition, rigid defenses, unresolved grief", changeTargets: "Insight, defense maturation, relational repair", firstLine: "Interpretation, transference analysis, free association", bestFit: "Chronic relational issues, personality, complex trauma" },
  { lens: "SFBT", slug: "sfbt", coreQuestion: "What already works and what is the preferred future?", assessmentFocus: "Exceptions, strengths, goals, scaling", maintainingFactors: "Problem focus, vague goals", changeTargets: "Amplify exceptions, small steps", firstLine: "Miracle question, scaling, compliments", bestFit: "Short-term focus, goal clarity needed" },
];
