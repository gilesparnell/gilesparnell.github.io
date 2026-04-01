# GitHub Pages Architecture Proposal

**Date:** 2026-04-01
**Author:** Giles Parnell + Claude
**Status:** Draft Proposal

---

## Problem

You have 7+ active projects, most with `docs/` folders containing plans, diagrams, user guides, and brainstorms — but only one repo (`claude-artefacts`) has GitHub Pages enabled. Project documentation is invisible unless someone clones the repo.

## Current State

| Repo | GitHub Pages URL | Has docs/ | Pages enabled |
|------|-----------------|-----------|---------------|
| `Claude` (claude-artefacts) | `gilesparnell.github.io/Claude/` | Yes (portal, skills, diagrams) | Yes |
| `SprintTracker` | — | Yes (plans, diagrams, user guide) | No |
| `LilyHealthDiary` | — | Yes | No |
| `parnellsystems-platform` | — | Yes (17 files: API tools, schema, plans) | No |
| `parnellsystems` (website) | — | Yes (plans, training) | No |
| `Vonnies` | — | Yes | No |
| `google-drive-migration` | — | Yes | No |

**No `gilesparnell.github.io` repo exists** — there's no top-level landing page for your GitHub presence.

---

## Proposed Architecture: Hub & Spoke

```
gilesparnell.github.io/                    ← Main portal (NEW repo)
├── index.html                             ← Landing page: who you are, what you're building
├── projects/                              ← Auto-generated project directory
│
├── /Claude/                               ← Knowledge portal (EXISTS, no changes)
│   ├── skills, walkthroughs, decisions
│   └── diagrams/gtm-plan-progress.html
│
├── /SprintTracker/                        ← Project docs (ENABLE Pages)
│   ├── plans/
│   ├── diagrams/plan-progress.html
│   └── user-guide.html
│
├── /LilyHealthDiary/                      ← Project docs (ENABLE Pages)
│   └── ...
│
├── /parnellsystems-platform/              ← Internal docs (ENABLE Pages)
│   └── ...
│
└── /parnellsystems/                       ← Website docs (ENABLE Pages)
    └── ...
```

### How it works

**GitHub Pages serves each repo independently** at `gilesparnell.github.io/<repo-name>/`. No build step needed — GitHub natively serves static files from a `/docs` folder on the `main` branch.

The **hub** (`gilesparnell.github.io`) is a single new repo that acts as the front door. It links to every spoke.

### Three layers

| Layer | Purpose | Repo | URL |
|-------|---------|------|-----|
| **Hub** | Main portal — "everything Parnell Systems" | `gilesparnell.github.io` (new) | `gilesparnell.github.io/` |
| **Knowledge** | Claude skills, patterns, decisions | `Claude` (exists) | `gilesparnell.github.io/Claude/` |
| **Project docs** | Per-project plans, guides, diagrams | Each project repo | `gilesparnell.github.io/<repo>/` |

---

## Hub Portal Design

The hub page would match the existing portal's visual style (dark theme, card grid, accent colours) and contain:

### 1. Hero section
- "Parnell Systems" branding
- Tagline: AI-powered SaaS platform for SMEs
- Key metrics (active projects, total plans, completion %)

### 2. Projects grid
Each project gets a card showing:
- Project name + one-line description
- Status badge (Active / Maintenance / Archived)
- Completion % (if plan-tracked)
- Quick links: Docs, Live App, GitHub repo
- Last updated date

### 3. Knowledge portal link
Prominent card linking to the existing `Claude` portal for skills, walkthroughs, and decisions.

### 4. Business sections (as your SaaS grows)
- Product overview cards
- Client showcase (Rob's Gardens, Moving4U, FSCA)
- GTM progress summary (pulling from the existing diagram)

---

## Implementation Plan

### Wave 1: Enable Pages on existing repos (30 min)

For each project repo, the only step is:
- **GitHub Settings → Pages → Source: Deploy from branch → `main` → `/docs`**

That's it. Every HTML file already in `docs/` becomes instantly accessible. No workflow needed.

**Repos to enable:**
1. `SprintTracker` — plans, diagrams, user-guide.html
2. `LilyHealthDiary` — docs
3. `parnellsystems-platform` — API tools, schema docs, plans
4. `parnellsystems` — plans, training docs

### Wave 2: Create the hub repo (1-2 hours)

1. Create repo `gilesparnell.github.io` (GitHub's special user-site repo name)
2. Add `index.html` with the same design system as the Knowledge Portal (reuse `portal.css`)
3. Build the project card grid with links to each spoke
4. Push — GitHub automatically deploys user-site repos

### Wave 3: Add index pages to project docs (optional, per-project)

Currently most project `docs/` folders are flat files with no `index.html`. Adding a simple index page to each gives visitors a landing page instead of a 404 when they hit the root.

For example, `SprintTracker/docs/index.html` would list:
- Plan documents
- User guide
- Progress diagrams

### Wave 4: Automation (optional, future)

- GitHub Action on the hub repo that polls each spoke repo's `docs/` and auto-updates the project cards (last updated, doc count, etc.)
- Similar to how `build-portal.yml` already works for the Knowledge Portal

---

## What NOT to do

- **Don't consolidate all docs into one repo.** Each project should own its docs. This scales naturally — when you add a new project, you just enable Pages on that repo and add a card to the hub.
- **Don't use Jekyll or a static site generator.** Your current hand-written HTML approach is simpler, faster, and matches what you already have. No Ruby, no build dependencies.
- **Don't duplicate docs across repos.** The hub links to spokes; it doesn't copy content.

---

## URL map (after implementation)

| URL | Content |
|-----|---------|
| `gilesparnell.github.io/` | Main portal — project directory |
| `gilesparnell.github.io/Claude/` | Knowledge portal (skills, walkthroughs, decisions) |
| `gilesparnell.github.io/Claude/diagrams/gtm-plan-progress.html` | GTM plan (already works) |
| `gilesparnell.github.io/SprintTracker/` | Sprint Tracker docs index |
| `gilesparnell.github.io/SprintTracker/diagrams/plan-progress.html` | Sprint Tracker progress |
| `gilesparnell.github.io/SprintTracker/user-guide.html` | User guide |
| `gilesparnell.github.io/SprintTracker/plans/` | Plan documents |
| `gilesparnell.github.io/LilyHealthDiary/` | Lily Health Diary docs |
| `gilesparnell.github.io/parnellsystems-platform/` | Platform internal docs |

---

## Scaling considerations

- **New project?** Create repo with `docs/` folder, enable Pages, add card to hub. Done.
- **Client projects?** Can have their own docs served from their repos (Rob's Gardens, FSCA, etc.)
- **Custom domain?** Point `docs.parnellsystems.com` at `gilesparnell.github.io` when ready
- **Private docs?** GitHub Pages only works for public repos on free plans. If you need private project docs, consider GitHub Enterprise or a separate hosting solution.
- **Search?** Add a client-side search (e.g., Pagefind) to the hub once you have 10+ projects

---

## Decision needed

1. **Do you want to proceed with this hub-and-spoke model?**
2. **Should I start with Wave 1 (enabling Pages on existing repos) now?**
3. **Any projects you want to keep private / exclude from Pages?**
