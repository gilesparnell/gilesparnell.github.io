# Handoff — gilesparnell.github.io (portfolio hub)

Newest entry at top. A fresh session should read the top entry, then skim the files it names.

## 2026-07-23 AEST (later) — Claude/ shells deleted, generator guarded, recovery requirement recorded

**Runner:** Claude. **State: COMPLETE** (committed + pushed after this entry was written).

- **`Claude/` shells DELETED** from this repo (Giles's decision): Knowledge stays in the separate `gilesparnell/Claude` repo, which owns the live `/Claude/` path and the self-rebuilding portal Action. Claude Design restyles Knowledge THERE — never recreate `Claude/` pages here. Recorded in DESIGN-HANDOVER open items.
- **Generator guarded:** `scripts/build-project-pages.js` still emits the old Deep Ocean template, so `build()` now throws (`TEMPLATE_IS_STALE = true`) and the CLI exits 1 — running it would overwrite the 11 deployed Console pages (verified: it really does; the working tree had to be restored during testing). Two guard tests added; suite is 10/10. Claude Design flips the flag when the Console template + `projects.data.js` split land.
- **Giles's standing requirement recorded** (memory `github-recovery-requirement`): everything needed to rebuild his machine/cloud instance must be pullable from GitHub. Known gap: the trading reader build sources (`build-readers.js`, `_src_0N.html`) lived only in an ephemeral Cowork session and are NOT in any repo — reader HTML is self-contained so content is safe, but the regenerate workflow needs recreating if wanted.

## 2026-07-23 AEST — 1C "Console" redesign from Claude Design copied in and published

**Runner:** Claude. **Read `docs/DESIGN-HANDOVER.md` before touching any page markup or CSS** — content/design split now applies: Claude Code owns content (`SPEC` data, copy), Claude Design owns templates/CSS.

- Copied `/Users/gilesparnell/Downloads/export/` → repo: `index.html`, `private.html`, all `projects/*.html`, redesigned `personal/{index,family,trading landing}`, NEW `Claude/{skills,walkthroughs,templates}.html` shells, `docs/DESIGN-HANDOVER.md`.
- **Excluded per instruction:** `personal/trading/assets/{reader,style}.css` and the 5 PDFs (export CSS was byte-identical anyway; the 5 reader pages were also identical, so nothing broke).
- **Personal panel re-added to hub by Claude Code:** the export's hub had NO link to `personal/` (contradicting the pillar-order request earlier today). Added panel 03 "Personal" (Trading + Family & Friends rows) reusing the design's classes; flagged in DESIGN-HANDOVER open items for Claude Design to restyle.
- Pre-copy checks: PII/anonymisation scan clean (no moving4u/fsca/allconvos/collegerocket/emails); family page keeps `noindex`; trading landing still links all 5 PDFs.
- **Watch item:** `Claude/` dir now exists in THIS repo while the live `/Claude/` path is served by the separate `gilesparnell/Claude` project-site repo. Verify which one GitHub Pages serves (project sites normally take precedence). The shells are placeholders — content decision belongs to Giles (handover open item).

## 2026-07-23 AEST — Personal umbrella PUBLISHED (commit 81ca84d)

**Runner:** Claude. **State: COMPLETE and live-verified.** The 2026-07-22 entry below described work sitting uncommitted in the working tree; on Giles's instruction ("do what's required") it was committed and pushed.

- Commit `81ca84d` — `feat(personal): add Giles Parnell personal umbrella to homepage` — 16 files (`index.html` + full `personal/` tree), pushed to `main`.
- Live-verified with curl, all 200: `/`, `/personal/`, `/personal/trading/`, `/personal/family/`, `/personal/trading/01-at-a-glance.html`, and one PDF.
- Pre-commit sanity checks passed: both `<section class="pillar">` blocks present; business links unchanged (Knowledge → `gilesparnell.github.io/Claude/…`, Work → `projects/{products,clients,labs}.html`).
- `docs/handoff/` remains untracked by design (Giles's call whether to commit it).
- Still open: **Route B connector** (write-capable GitHub MCP) — see the 2026-07-22 entry's "Open follow-up".
- **Pillar order flipped on Giles's request** (same day, after publish): Parnell Systems (Knowledge + Work) now FIRST, Personal (Trading, Family & Friends) second — reverses the "Personal pillar first" decision in the 2026-07-22 entry. Edited in working tree by swapping the two `<section class="pillar">` blocks in `index.html`.

## 2026-07-22 AEST — Personal umbrella added: homepage restructured + Options "Trading" series published

**Runner:** Claude (Cowork). **State: WRITTEN TO WORKING TREE, NOT YET COMMITTED.** All files are on disc in the repo; Giles reviews and does the `git commit` + `git push` himself. One open decision noted at the bottom (route B connector).

### What changed (the mental model)

The site was reframed from "Parnell Systems (the business)" to the **"Giles Parnell" personal umbrella**, with two pillars:

- **Personal** (shown first) — `personal/` tree, NEW.
- **Parnell Systems** (the business) — the existing **Knowledge** + **Work** cards, links **UNCHANGED**. Knowledge still points at the separate `gilesparnell/Claude` repo (`/Claude/…`); Work still points at `projects/…`. Nothing in `projects/` or the Claude repo was touched.

### Files (git status = ` M index.html` + `?? personal/`)

| Path | What it is |
|---|---|
| `index.html` | **Overwritten.** Homepage rebuilt into the two-pillar umbrella. Brand is now "Giles Parnell" (GP mark). Business card links unchanged. |
| `personal/index.html` | Personal hub — two cards: Trading (amber) + Family & Friends (rose). |
| `personal/family/index.html` | Family & Friends **placeholder**. `noindex,nofollow`, not linked publicly = "unlisted", NOT real auth. |
| `personal/trading/index.html` | Options series landing (amber theme) — 5 issue cards, each "Read online" + "PDF". |
| `personal/trading/01..05-*.html` | Native, responsive **reader pages** — dark Deep-Ocean chrome bar (back link / title / Download-PDF) wrapping the light cheat-sheet "paper" body. |
| `personal/trading/assets/style.css` | Shared cheat-sheet CSS (Spectral / Inter / IBM Plex Mono; green=bullish, red=bearish, amber=time, blue=neutral). |
| `personal/trading/assets/reader.css` | Responsive + chrome overrides, loaded AFTER style.css. **Note:** `body.reader .page{color:#1d1d1b}` is deliberate — without it the dark canvas text colour leaks onto the white paper and the serif titles go near-invisible. |
| `personal/trading/options-cheat-sheet-0N-*.pdf` | The five print-ready A4 PDFs (also saved in `personal/trading/Docs/Cheatsheet/` on Giles's Mac, outside this repo). |

### How the reader pages were built (so you don't hand-edit 5 files)

- Generated by `build-readers.js` from `_src_01.html … _src_05.html` (the print-layout primers) — the script injects the site fonts + `reader.css`, adds the chrome bar and prev/next nav, and wraps wide tables in `.tscroll` for mobile.
- **Those build sources (`build-readers.js`, `_src_0N.html`) lived in the ephemeral Cowork session and are NOT in the repo.** The committed reader HTML is self-contained and safe to hand-edit. If you want the regenerate-don't-hand-edit workflow (like `scripts/build-project-pages.js`), ask Claude to commit the generator + sources into `scripts/` — it can reproduce them.
- No. 01's source was **reconstructed** from the PDF (the original No. 01 was made in another session), so its web page matches the series system but isn't a byte-copy of that PDF's layout.

### Decisions made (flip any of these freely)

- **Personal pillar first** on the homepage (matches how Giles phrased "Giles Parnell personal, then Parnell Systems"). Swap the two `<section class="pillar">` blocks to reverse.
- **Knowledge kept under Parnell Systems** (read as business/engineering knowledge, not personal learning).
- **Family & Friends = unlisted only** (noindex + unlinked). Real privacy would need Cloudflare Access on the `parnell-projects.pages.dev` surface — not done.

### To publish

```
cd ~/Documents/VSStudio/personal/gilesparnell.github.io
git add index.html personal/
git commit -m "Add Giles Parnell personal umbrella: options series + family placeholder"
git push
```

Scope the `git add` to `index.html personal/` — `.claude/` and `docs/handoff/` also show untracked but are pre-existing/yours to decide. **Gotcha (unchanged):** `git push` may print a benign `Please commit or stash` from its `pull --rebase`; success is the `main -> main` line. Pages propagates in ~30s. Verify live: `/`, `/personal/`, `/personal/trading/`, `/personal/family/`.

### Open follow-up

- **Route B not set up.** A write-capable GitHub MCP connector (GitHub's official server added as a *custom* connector — paid) would let Claude commit + open a PR via the API instead of a manual push. No ready-made GitHub connector exists in Giles's connector directory today; the native GitHub integration is read-only.

---

## 2026-07-11 AEST — Work section rebuilt: 3 isolated category pages + 14 case studies

**Runner:** Claude. **State: COMPLETE and live-verified.** No open task blocking; only optional polish remains (below).

### What the Work section is now

The hub (`index.html`) has two cards — **Knowledge** (→ the Claude portal, separate repo) and **Work**. The Work card links to three **separate, fully-isolated** category pages (this was the hard-won requirement — Giles wanted each click to show ONLY that category, not sections on one scrollable page):

| Hub link | Page | Contains (ONLY) |
|---|---|---|
| Products | `projects/products.html` | Parnell Systems Platform — the flagship, shown as a hero. The one product. |
| Client work | `projects/clients.html` | Rob's Gardens, Removals Company (anon), Field-Services Automation (anon) |
| Labs | `projects/labs.html` | 10 projects: whole-life-challenge, pitime, floor-quotes, sprint-tracker, habit-tracker, evernote-to-obsidian, granola-sync, google-drive-migration, resume-builder, interview-prep |

Each category page contains zero cross-category content (verified live). Each of the 14 project detail pages (`projects/<slug>.html`) has a "problem / what was built / outcome" case study, tech pills, and a **back-link that returns to its own category page** (Products→products.html, clients→clients.html, labs→labs.html) — never a mixed list.

### How it's built (so you don't hand-edit 14 files)

- **Generator:** `scripts/build-project-pages.js` (zero-dep Node). `SPEC` array = the 11 generated projects, each with `group: 'clients' | 'labs'`; `renderProjectPage()` picks the back-link from `GROUP_BACK`. Run `node scripts/build-project-pages.js` to regenerate `projects/<slug>.html`. Tests: `node --test scripts/build-project-pages.test.js` (8, all green).
- **3 pages are hand-authored, NOT in SPEC** (don't regenerate them): `parnell-systems-platform.html`, `robgardens.html`, `whole-life-challenge.html`. Their back-links were hand-set to products/clients/labs respectively.
- **The 3 category pages** (`products/clients/labs.html`) were generated by a one-off Python split of the old combined `projects/index.html`; they reuse its full inline CSS (`.proj-hero`, `.entry-card`, `.proj-group`). No build step regenerates them — edit by hand or re-run a split.
- **To add a project:** add a card to the ONE matching category page, add a `projects/<slug>.html` detail page (add to SPEC + `group` and regenerate, or hand-author), and keep the category isolated.

### Decisions locked with Giles (don't re-litigate)

- **Anonymise genuine external clients** (moving4u → "removals company", fsca → "field-services business"). No client names/emails/other-venture refs (allconvos, collegerocket) on public pages.
- floor-quotes and PiTime are **Giles's own products/concepts**, named freely — not clients.
- **Parnell Systems Platform = the flagship product** he's building back toward; it is the ONLY thing under Products, never grouped with labs.
- **Skipped 3 empty repos** (biasEngine, collegerocket, leadgen-site) — no source material; a thin page hurts a showcase.

### Gotchas

- `git push` prints `error: Please commit or stash them` from the `git pull --rebase` step when the tree has staged changes — **benign**, the commit+push still succeeds (check the `main -> main` line).
- GitHub Pages takes ~30s to propagate; verify live with curl, don't trust local-only.
- agent-browser needs the explicit chrome path: `--executable-path "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"` (the bare `agent-browser open` hangs).

### Optional polish (NOT done — only if Giles asks)

- **`projects/index.html` (combined all-projects page) is now orphaned** — nothing links to it (hub → category pages; detail pages → category pages). Harmless fallback if someone visits `/projects/` directly, but it shows a mixed view. Could point it at a category or make it a "pick a category" landing.
- **Case-study copy is Claude's draft** from each repo's README/plans — accurate but generic. Giles should add real outcomes/metrics (user counts, time saved) to make it land harder with recruiters.
- The **google-drive-migration** page was deliberately generalised (its README had personal emails + named other ventures).

### Related session work (other repos, same 2-day session)

- **Knowledge portal** `claude/claude-public` (→ `gilesparnell/Claude`): per-skill detail pages + self-rebuilding `build-portal.yml` Action; all 23 skills enriched; templates fixed. See its own memory `reference_portal_build_system`.
- **Repo lockdown / secrets audit** `private-ops/public-repo-lockdown`: Unit 7 secrets audit (clean, no exposure), 3 dead repos deleted, resume-builder made private. See that repo's `docs/handoff/handoff.md`.
- **VSStudio folder reorg** executed 2026-07-09 (labs/, clients/, claude/ top-level). See `reference_project_showcase_pages` and `reference_portal_build_system` memories.
