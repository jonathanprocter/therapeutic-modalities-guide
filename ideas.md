# Therapeutic Modalities Guide — Design Brainstorm

## Context
A digital reference tool for mental health counselors and trainees. Must feel like a premium, organized clinical notebook. Color palette is fixed: Raindance #A7B3AA, Narragansett Green #435155, First Crush #E8DECF, Swiss Coffee #EEECE1, Sherwood Tan #B8A183, Southwest Pottery #975F57, Batik #CCB9B5, Silhouette #57504C. Typography: Fraunces (display) + Source Sans 3 (body).

---

<response>
<text>

## Idea 1: "The Clinician's Folio" — Editorial Print Design

**Design Movement:** Editorial / Print-Inspired Design (think Kinfolk magazine meets clinical reference)

**Core Principles:**
1. Asymmetric editorial layouts with generous margins and pull-quotes
2. Typography-driven hierarchy using dramatic scale contrast (72px headings vs 16px body)
3. Tactile paper-like textures with subtle grain overlays
4. Information density balanced by generous breathing room

**Color Philosophy:** Swiss Coffee as the "paper" base, Narragansett Green for structural elements (sidebar, headers), Southwest Pottery as the sole accent for interactive/CTA elements. Silhouette for body text. Batik and Raindance as subtle dividers and background washes.

**Layout Paradigm:** Magazine-style asymmetric grid. Left-heavy content columns with a narrow right margin for annotations/quick-jump. Cards use a masonry-like stagger rather than uniform grid. Modality pages use a two-column layout with a sticky table-of-contents rail.

**Signature Elements:**
1. Thin horizontal rules with small decorative dots (like section breaks in a journal)
2. Pull-quote callouts with oversized Fraunces italic text and a thin left border in Southwest Pottery
3. Subtle paper grain texture overlay on the background

**Interaction Philosophy:** Interactions feel like turning pages — smooth crossfades between sections, content reveals from bottom with slight parallax. Hover states are understated: slight color shifts and underline animations.

**Animation:** Staggered fade-up reveals (50ms delay between siblings). Section headers slide in from left. Cards have a subtle lift on hover (2px translateY + shadow deepening). Page transitions use a gentle opacity crossfade. All animations respect prefers-reduced-motion.

**Typography System:** Fraunces 700 for page titles (clamp 36-48px), Fraunces 600 for section headers (24-28px), Source Sans 3 600 for subsection labels (18px), Source Sans 3 400 for body (16px, 1.65 line-height). Generous letter-spacing on uppercase kickers.

</text>
<probability>0.08</probability>
</response>

---

<response>
<text>

## Idea 2: "The Warm Workspace" — Scandinavian Functional Design

**Design Movement:** Scandinavian Functionalism meets Digital Product Design (think Linear app meets warm tones)

**Core Principles:**
1. Function-first layout with every pixel serving a purpose
2. Soft, rounded containers with warm shadows creating depth layers
3. Monochromatic sections with accent pops only on interactive elements
4. Dense but scannable information architecture

**Color Philosophy:** First Crush as the warm canvas. Cards float on Swiss Coffee with soft warm shadows. Narragansett Green for the persistent sidebar and navigation chrome. Southwest Pottery exclusively for buttons, links, and active states. Sherwood Tan for secondary interactive elements. Silhouette for text.

**Layout Paradigm:** Fixed left sidebar (collapsible on mobile) with a scrollable main content area. Content uses a single-column layout with max-width 720px for readability. Cards stack vertically with clear section demarcation. The sidebar acts as the primary navigation spine.

**Signature Elements:**
1. Rounded pill-shaped tags and badges with soft pastel fills (Raindance/Batik at 20% opacity)
2. Floating action bar at bottom of modality pages (export, print, next/prev)
3. Subtle left-border color coding per modality (each gets a unique shade from the palette)

**Interaction Philosophy:** Crisp, immediate feedback. Buttons have micro-scale animations (0.97 press). Sidebar items highlight with a smooth background slide. Tooltips appear instantly. Everything feels responsive and tool-like.

**Animation:** Minimal but precise — 150ms ease-out for all transitions. Cards fade in on scroll with 0 delay (immediate). Sidebar collapse/expand is a smooth width transition. Page content crossfades in 200ms. Accordion sections use spring-like open/close.

**Typography System:** Fraunces 600 for page titles (32px), Fraunces 500 for section headers (22px), Source Sans 3 600 for labels and navigation (14px uppercase, tracked), Source Sans 3 400 for body (15px, 1.6 line-height). Tight, efficient type scale.

</text>
<probability>0.06</probability>
</response>

---

<response>
<text>

## Idea 3: "The Therapeutic Journal" — Wabi-Sabi Digital Craft

**Design Movement:** Wabi-Sabi meets Digital Craft (imperfect beauty, handmade warmth, like a well-loved Moleskine)

**Core Principles:**
1. Organic shapes and slightly irregular borders that feel hand-drawn
2. Layered depth through overlapping cards and soft, warm shadows
3. Content organized in "chapters" with clear wayfinding
4. Warmth through texture, not decoration

**Color Philosophy:** A gradient wash from First Crush (top) to Swiss Coffee (bottom) as the page canvas. Narragansett Green for deep structural elements (header, footer). Southwest Pottery and Sherwood Tan alternate as section accents. Batik for hover/selected states. Raindance for success/positive states. Silhouette for all readable text.

**Layout Paradigm:** Top navigation bar with breadcrumbs. Content flows in a centered column (max 900px) with "chapter" sections that have distinct background washes. Cards use a 2-column grid on desktop, single column on mobile. Modality pages have a floating quick-jump pill bar that sticks below the header.

**Signature Elements:**
1. Slightly rounded, irregular card corners (border-radius varies: 8px 12px 10px 6px) for organic feel
2. Thin watercolor-style dividers between major sections (CSS gradient lines)
3. Small circular "chapter number" badges at section starts

**Interaction Philosophy:** Gentle and unhurried. Hover reveals additional context (not just color change). Cards tilt very slightly on hover (1-2deg). Scrolling feels smooth with snap points on major sections. Everything invites exploration.

**Animation:** Slow, gentle reveals — 400ms ease with 100ms stagger. Cards float up from 20px below. Section backgrounds fade in as you scroll. The quick-jump bar slides down smoothly when scrolling past the hero. Reduced motion disables all transforms but keeps opacity fades.

**Typography System:** Fraunces 700 for chapter titles (40px), Fraunces 600 italic for pull-quotes and callouts (22px), Source Sans 3 500 for navigation and labels (14px), Source Sans 3 400 for body (16px, 1.7 line-height for maximum readability). Extra generous paragraph spacing (1.5em).

</text>
<probability>0.04</probability>
</response>
