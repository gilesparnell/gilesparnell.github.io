#!/usr/bin/env node
'use strict';
// build-project-pages.js — generates projects/<slug>.html showcase pages from a
// content spec, using the Deep Ocean Tech case-study template (matches the
// hand-authored whole-life-challenge.html / robgardens.html pages).
// Zero dependencies. Run: node scripts/build-project-pages.js

const fs = require('fs');
const path = require('path');

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const STYLE = `
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    :root {
      --font-display: 'Satoshi', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-body: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
      --bg-deep: #0a0c10; --bg-surface: #12151c; --bg-raised: #1a1e28;
      --text-primary: #e8eaf0; --text-secondary: #8b92a8; --text-tertiary: #4a5068;
      --accent: #38bfa0; --accent-light: #5edcb8; --accent-muted: rgba(56,191,160,0.15);
      --accent-glow: rgba(56,191,160,0.20); --border: rgba(255,255,255,0.06);
      --border-hover: rgba(255,255,255,0.14); --radius: 20px;
    }
    body { font-family: var(--font-body); background: var(--bg-deep); color: var(--text-primary);
      line-height: 1.6; letter-spacing: -0.01em; min-height: 100vh; overflow-x: hidden; }
    .mesh-bg { position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
    .mesh-bg .blob { position: absolute; border-radius: 50%; filter: blur(90px); will-change: transform; }
    .mesh-bg .blob:nth-child(1) { width: 650px; height: 650px; background: hsla(168,55%,32%,0.35); top: -12%; left: -8%; animation: drift1 20s ease-in-out infinite alternate; }
    .mesh-bg .blob:nth-child(2) { width: 500px; height: 500px; background: hsla(335,45%,28%,0.25); top: 5%; right: -12%; animation: drift2 24s ease-in-out infinite alternate; }
    .mesh-bg .blob:nth-child(3) { width: 580px; height: 580px; background: hsla(215,55%,28%,0.28); bottom: -18%; left: 25%; animation: drift3 28s ease-in-out infinite alternate; }
    @keyframes drift1 { to { transform: translate(90px,70px) scale(1.08); } }
    @keyframes drift2 { to { transform: translate(-70px,90px) scale(0.92); } }
    @keyframes drift3 { to { transform: translate(50px,-60px) scale(1.12); } }
    .page { position: relative; z-index: 1; max-width: 780px; margin: 0 auto; padding: 3rem 2rem 4rem; }
    .site-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 3rem; animation: fadeUp 0.5s ease-out both; }
    .brand { display: flex; align-items: center; gap: 14px; text-decoration: none; color: inherit; }
    .brand-mark { width: 42px; height: 42px; border-radius: 12px; background: linear-gradient(135deg, var(--accent), #2a8a74);
      display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-weight: 900; font-size: 1.2rem; color: #fff; letter-spacing: -0.03em; flex-shrink: 0; }
    .brand-text { font-family: var(--font-display); font-weight: 700; font-size: 1.25rem; letter-spacing: -0.03em; }
    .back-link { color: var(--text-secondary); text-decoration: none; font-size: 0.85rem; font-weight: 500; display: flex; align-items: center; gap: 6px; transition: color 0.2s; }
    .back-link:hover { color: var(--text-primary); }
    .cs-hero { margin-bottom: 2.5rem; animation: fadeUp 0.6s 0.05s ease-out both; }
    .cs-hero .eyebrow { display: block; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent); margin-bottom: 0.8rem; }
    .cs-hero h1 { font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 900; line-height: 1.05; letter-spacing: -0.04em; margin-bottom: 1rem; }
    .cs-hero .lede { font-size: clamp(0.95rem, 1.8vw, 1.1rem); color: var(--text-secondary); max-width: 620px; line-height: 1.7; }
    .cs-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 1.5rem; }
    .cs-pill { font-size: 0.62rem; font-weight: 600; letter-spacing: 0.06em; padding: 4px 12px; border-radius: 100px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: var(--text-secondary); }
    .cs-body { animation: fadeUp 0.6s 0.15s ease-out both; }
    .cs-section { background: rgba(255,255,255,0.025); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid var(--border); border-radius: var(--radius); padding: 2rem; margin-bottom: 14px; position: relative; }
    .cs-section::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.09), transparent); pointer-events: none; }
    .cs-section .label { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: var(--accent); margin-bottom: 0.9rem; }
    .cs-section p { color: var(--text-secondary); font-size: 1rem; line-height: 1.75; }
    .cs-section p strong { color: var(--text-primary); font-weight: 600; }
    .cs-note { margin-top: 1.5rem; font-size: 0.85rem; color: var(--text-tertiary); }
    .cs-note a { color: var(--text-secondary); text-decoration: none; transition: color 0.2s; }
    .cs-note a:hover { color: var(--accent); }
    .site-footer { margin-top: 3.5rem; padding-top: 2rem; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; font-size: 0.78rem; color: var(--text-tertiary); }
    .site-footer a { color: var(--text-secondary); text-decoration: none; transition: color 0.2s; }
    .site-footer a:hover { color: var(--accent); }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
    @media (max-width: 580px) { .page { padding: 2rem 1rem 3rem; } .site-header { flex-direction: column; align-items: flex-start; gap: 1rem; } .site-footer { flex-direction: column; gap: 0.75rem; text-align: center; } }`;

const GROUP_BACK = {
  products: ['products.html', 'Products'],
  clients: ['clients.html', 'Client work'],
  labs: ['labs.html', 'Labs'],
};

function renderProjectPage(p) {
  const [backHref, backLabel] = GROUP_BACK[p.group] || ['index.html', 'All projects'];
  const pills = (p.pills || []).map((t) => `<span class="cs-pill">${esc(t)}</span>`).join('\n      ');
  const note = p.note ? `<p class="cs-note">${esc(p.note)}</p>\n    ` : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(p.title)} — Parnell Systems</title>
  <meta name="description" content="${esc(p.lede)}">
  <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap">
  <style>
    /* PARNELL SYSTEMS — Case study detail · Deep Ocean Tech (matches hub index.html) */
${STYLE}
  </style>
</head>
<body>

<div class="mesh-bg" aria-hidden="true">
  <div class="blob"></div><div class="blob"></div><div class="blob"></div>
</div>

<div class="page">

  <header class="site-header">
    <a href="../index.html" class="brand">
      <div class="brand-mark">PS</div>
      <span class="brand-text">Parnell Systems</span>
    </a>
    <a href="${backHref}" class="back-link">&larr; ${esc(backLabel)}</a>
  </header>

  <section class="cs-hero">
    <span class="eyebrow">${esc(p.eyebrow)}</span>
    <h1>${esc(p.title)}</h1>
    <p class="lede">${esc(p.lede)}</p>
    <div class="cs-pills">
      ${pills}
    </div>
  </section>

  <div class="cs-body">

    <section class="cs-section">
      <div class="label">The problem</div>
      <p>${esc(p.problem)}</p>
    </section>

    <section class="cs-section">
      <div class="label">What was built</div>
      <p>${esc(p.built)}</p>
    </section>

    <section class="cs-section">
      <div class="label">The outcome</div>
      <p>${esc(p.outcome)}</p>
    </section>

    ${note}<p class="cs-note">Source code and implementation docs for this project are <a href="../private.html">private</a>.</p>

  </div>

  <footer class="site-footer">
    <span>&copy; 2026 Parnell Systems</span>
    <span><a href="../index.html">Back to hub</a></span>
  </footer>

</div>

</body>
</html>
`;
}

const SPEC = [
  // ── Labs / products ──
  {
    slug: 'sprint-tracker', group: 'labs', eyebrow: 'Product', title: 'Sprint Tracker',
    lede: 'A sprint and project tracking web app for small teams — plan work into workstreams, track progress, and manage access, with ClickUp sync so it fits an existing workflow.',
    pills: ['Next.js', 'TypeScript', 'Vercel', 'ClickUp API'],
    problem: 'Small teams delivering across several tools lose the thread — status lives in someone’s head, a spreadsheet, or a ticketing tool nobody opens. There was no single, fast answer to “what’s in this sprint and where is it?”',
    built: 'A web app that organises work into workstreams and tasks with team accounts, role-based admin, and a live progress view. It syncs with ClickUp so teams already living there don’t double-enter, and ships with an outcome-level public documentation site.',
    outcome: 'A deployable single source of truth for sprint progress — built on Next.js, shipped on Vercel, with authentication, an admin surface, and a clean docs site.',
  },
  {
    slug: 'habit-tracker', group: 'labs', eyebrow: 'Product', title: 'Habit Tracker',
    lede: 'A single-user sobriety tracker built as an installable app — day counters for cutting down on drinking and vaping, designed to open instantly and work offline.',
    pills: ['React', 'Vite', 'Supabase', 'PWA'],
    problem: 'Breaking a habit needs a frictionless daily signal — “how many days am I in?” Most trackers are heavy, cloud-locked, or lose your streak the moment you’re offline. A slip also needs to be handled with care, not punishment.',
    built: 'An installable Progressive Web App with day-since counters, streak history, and gentle milestone moments. It stores data locally so it opens instantly and survives having no signal, then syncs to the cloud when a connection returns. Add-to-home-screen makes it feel native.',
    outcome: 'A private, phone-first habit tool that’s always one tap away, keeps working offline, and treats a reset as a fresh start rather than a failure.',
  },
  {
    slug: 'google-drive-migration', group: 'labs', eyebrow: 'Tool', title: 'Google Drive Consolidation',
    lede: 'A tool that safely merges the contents of several Google Drive accounts into one — recreating native Google Docs, Sheets, and Slides rather than dumping dead copies.',
    pills: ['Python', 'Google Drive API', 'OAuth'],
    problem: 'Years of files scattered across multiple Google accounts is a genuine mess to consolidate. A naive copy breaks native Docs into unusable exports, loses folder structure, and risks touching the source data — and doing it by hand across thousands of files isn’t realistic.',
    built: 'A Python tool that authenticates read-only against each source account, walks the folder tree, and rebuilds everything in one destination — recreating Docs, Sheets, and Slides as live native files, preserving structure, and skipping “shared with me” noise. Later passes add UI-driven migration and optional source cleanup.',
    outcome: 'Multiple accounts’ worth of documents consolidated into a single trusted Drive, native files intact and the originals never modified — reversible, auditable, and hands-off.',
  },
  {
    slug: 'evernote-to-obsidian', group: 'labs', eyebrow: 'Tool', title: 'Evernote → Obsidian Knowledge Engine',
    lede: 'A migration and classification pipeline that turns a decade of unstructured Evernote notes into a linked, auto-categorised Obsidian knowledge graph — running mostly offline.',
    pills: ['Python', 'Local LLM (Gemma)', 'Obsidian', 'pytest'],
    problem: 'Thousands of notes exported from Evernote arrive as a flat, tag-less pile. Sorting them into a usable second brain — by type, project, people, and topic — is a multi-week job by hand, and running cloud AI over that volume is expensive and privacy-hostile.',
    built: 'A pipeline that converts Evernote exports to Markdown, then classifies each note with a rules-first engine that only falls back to a local LLM (Gemma via LM Studio) for the ambiguous cases — keeping most of the run fast, free, and offline. It emits a structured schema (type, org, people, tags, confidence) and auto-builds Maps of Content that link related notes across two vaults, backed by 163 tests.',
    outcome: 'A once-unmanageable note dump became a navigable, auto-linked knowledge graph — categorised, deduplicated, and cross-referenced — with the classification running locally so private notes never leave the machine.',
  },
  {
    slug: 'granola-sync', group: 'labs', eyebrow: 'Tool', title: 'Granola → Obsidian Sync',
    lede: 'A macOS background daemon that pulls AI meeting notes from Granola into Obsidian the instant a meeting ends, with attendees and organisation auto-detected.',
    pills: ['Python', 'macOS LaunchAgent', 'Obsidian'],
    problem: 'AI meeting notes are only useful if they land where you actually think — your notes vault — without a manual export every time. Polling an API on a timer is wasteful and laggy, and the notes arrive with no structure to connect them to people or projects.',
    built: 'A continuously-running LaunchAgent that watches Granola’s auth-token refresh and triggers a sync the moment new notes are ready — event-driven, not polled. Each meeting becomes a Markdown file with classified frontmatter: type, organisation (inferred from attendee email domains), and people, so notes slot straight into the knowledge graph.',
    outcome: 'Meeting notes appear in Obsidian automatically, correctly tagged and linked, with zero manual steps — a quiet daemon that keeps a second brain current without ever being opened.',
  },
  {
    slug: 'resume-builder', group: 'labs', eyebrow: 'Product', title: 'AI Résumé & Application Builder',
    lede: 'A browser-based CV editor that reads a job posting from a URL and generates a tailored professional profile and application packet for it.',
    pills: ['Next.js', 'TypeScript', 'Claude API'],
    problem: 'Tailoring a CV and cover letter to each role is slow, repetitive, and the part most people skip — yet generic applications are exactly what gets filtered out. The context (the specific job) is sitting right there in the posting, unused.',
    built: 'A Next.js app with an in-browser CV editor that takes a job URL, extracts the role’s requirements, and uses the Claude API to generate a tailored profile and application packet aligned to that posting — keeping the underlying CV structured and editable rather than locking output into a document.',
    outcome: 'The tedious, repeated work of tailoring an application to each role is reduced to pasting a link — producing a role-specific draft in seconds that’s then refined by hand.',
  },
  {
    slug: 'interview-prep', group: 'labs', eyebrow: 'Product', title: 'Interview & Career Compass',
    lede: 'A structured interview-preparation workspace — a bank of STAR stories, role-discovery exercises, and career-direction tooling, exportable into an Obsidian knowledge base.',
    pills: ['Structured content', 'Obsidian', 'Career frameworks'],
    problem: 'Interview prep is usually ad-hoc: scattered notes, half-remembered examples, and no system for turning experience into crisp, reusable answers. Deciding what role to even aim for is a separate, harder problem that rarely gets structured attention.',
    built: 'A workspace that organises achievements into reusable STAR stories, runs role-discovery and values exercises to clarify direction, and exports the whole thing into a structured Obsidian vault so it compounds over time instead of being rewritten for every interview.',
    outcome: 'Interview answers and career thinking captured once as structured, linkable content — ready to draw on for any conversation, and improving with each pass rather than starting from scratch.',
  },
  {
    slug: 'floor-quotes', group: 'labs', eyebrow: 'Product concept', title: 'Floor Quotes',
    lede: 'A validated product concept for flooring-quote automation — capture a room, visualise options, estimate material and cost, and turn a walkthrough into a structured quote.',
    pills: ['Product discovery', 'Market validation'],
    problem: 'Local flooring installers quote slowly and inconsistently — measuring by hand, guessing quantities, and losing leads between the site visit and the written quote. The question was whether a “scan a room → quote” product could win in an already-busy space.',
    built: 'A concept site articulating the product thesis — quote-ready room capture, product visualisation, quantity and cost estimation, and installer workflow — paired with a market scan to test where a defensible wedge might be: local trades, accurate quantity estimation, and lead qualification.',
    outcome: 'A disciplined validation pass that concluded the generic visualiser space is crowded and identified a narrower opportunity — a documented decision to park rather than build, which is its own kind of result.',
  },
  {
    slug: 'pitime', group: 'labs', eyebrow: 'Product', title: 'PiTime — Voice Timesheets',
    lede: 'A voice-activated timesheet and invoicing app for independent consultants — speak your hours, and it produces clients, projects, invoices, and a utilisation dashboard.',
    pills: ['Next.js 15', 'TypeScript', 'Turso', 'Drizzle', 'NextAuth'],
    problem: 'Consultants lose billable hours to the friction of time tracking — nobody wants to fill a timesheet grid at the end of a long day, so entries get estimated, delayed, or lost, and invoicing becomes a monthly scramble.',
    built: 'A Next.js app where time is entered by voice (OS speech-to-text plus a local fuzzy parser), with client and project management at hourly or daily rates. It generates sequentially-numbered invoices with GST and mileage line items, and a dashboard charts weekly hours, revenue by client, and aged receivables. Access is gated by Google OAuth with an email allowlist.',
    outcome: 'The end-of-day timesheet becomes a sentence spoken aloud, feeding straight into invoices and a live view of utilisation and receivables — the admin a solo consultant most wants to avoid, made almost frictionless.',
  },
  // ── Client deliveries (anonymised) ──
  {
    slug: 'removals-web-presence', group: 'clients', eyebrow: 'Client delivery', title: 'Removals Company Web Presence',
    lede: 'A marketing and lead-capture website for a local removals business — a fast, mobile-first presence built to turn searches into enquiries.',
    pills: ['React', 'Web', 'Lead capture'],
    problem: 'A local removals business needs to be found and to convert — a slow or dated site loses jobs to competitors before a quote is ever requested. The client needed a credible, mobile-first web presence with a clear path to enquiry.',
    built: 'A responsive marketing site presenting the business’s services with a streamlined enquiry path, built and iterated rapidly so the client could get live and start capturing leads quickly.',
    outcome: 'A professional, mobile-first web presence that gives the business a credible front door and a clear route from visitor to enquiry.',
    note: 'Delivered for a client; identity and specifics anonymised.',
  },
  {
    slug: 'field-services-automation', group: 'clients', eyebrow: 'Client delivery', title: 'Field-Services Automation',
    lede: 'A workflow-automation MVP for a field-services business, built around ServiceM8 to remove manual admin from the job-to-invoice pipeline.',
    pills: ['ServiceM8', 'Automation', 'Integration'],
    problem: 'A field-services operator was doing repetitive admin by hand — moving job data between systems and chasing the same steps on every job. Manual handoffs are slow, error-prone, and scale badly as the business grows.',
    built: 'An automation MVP integrating with ServiceM8 to streamline the job workflow — reducing manual data entry and standardising the steps between a booked job and getting paid.',
    outcome: 'Less manual admin per job and a more consistent workflow, freeing the operator to spend time on the work rather than the paperwork around it.',
    note: 'Delivered for a client; identity and specifics anonymised.',
  },
];

// The deployed projects/*.html are the 1C Console redesign (docs/DESIGN-HANDOVER.md),
// but STYLE/renderProjectPage above still emit the old Deep Ocean template.
// Claude Design flips this to false when the Console template lands here.
const TEMPLATE_IS_STALE = true;

function build({ root } = {}) {
  if (TEMPLATE_IS_STALE) {
    throw new Error(
      'build-project-pages: this template still emits the old Deep Ocean theme; ' +
      'regenerating would overwrite the deployed 1C Console pages. ' +
      'See docs/DESIGN-HANDOVER.md — Claude Design sets TEMPLATE_IS_STALE = false ' +
      'once the Console template lands.'
    );
  }
  const ROOT = root || path.join(__dirname, '..');
  const OUT = path.join(ROOT, 'projects');
  fs.mkdirSync(OUT, { recursive: true });
  for (const p of SPEC) {
    fs.writeFileSync(path.join(OUT, `${p.slug}.html`), renderProjectPage(p));
  }
  return SPEC.map((p) => `${p.slug}.html`);
}

module.exports = { renderProjectPage, SPEC, build };

if (require.main === module) {
  try {
    const files = build();
    console.log(`Wrote ${files.length} project pages:`);
    files.forEach((f) => console.log('  projects/' + f));
  } catch (err) {
    console.error(err.message);
    console.error('Refusing to write. See docs/DESIGN-HANDOVER.md.');
    process.exit(1);
  }
}
