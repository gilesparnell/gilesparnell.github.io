# Design handover — Portal redesign (Deep Ocean Tech → 1C "Console")

**For:** Claude Code (and future me)
**From:** Claude Design
**Last updated:** 2026-07-23 (rev 2 — added `personal/` tree + trading reader sub-system)
**Repo:** `gilesparnell/gilesparnell.github.io` · branch `main`

---

## TL;DR for Claude Code

The look-and-feel of this site is being redesigned (old "Deep Ocean Tech" dark-teal
theme → new **1C "Console"** theme: black/white/violet, geometric, mono-technical type).
That work is owned by **Claude Design**, in a separate tool. To avoid the two tools
overwriting each other, we've agreed a **content / design split**:

- **You (Claude Code) own CONTENT + logic.** Edit project copy, add/remove projects,
  fix data, change build behaviour.
- **Claude Design owns LOOK-AND-FEEL.** The page templates, CSS, and the visual shell.

**The golden rule:** _Do not edit the visual template or CSS._ If a design change is
needed, note it and leave it for Claude Design. If content needs to change, edit the
**data file only** — never the generated HTML.

---

## How the case-study pages work (important)

`projects/<slug>.html` are **generated files — do not hand-edit them.** They are printed by:

```
node scripts/build-project-pages.js
```

That script is being refactored into a clean split:

| File | Owner | Contains |
|------|-------|----------|
| `scripts/projects.data.js` | **Claude Code** | The `SPEC` array — every project's copy (title, lede, pills, problem/built/outcome, group, note). **Edit here to change content or add a project.** |
| `scripts/build-project-pages.js` | **Claude Design** | The `STYLE` block + `renderProjectPage()` template + build loop. Imports `SPEC` from `projects.data.js`. **Design lives here — do not edit for content.** |

> If you (Claude Code) are reading this *before* that refactor has landed, `SPEC` and
> `STYLE` may still both live inside `build-project-pages.js`. In that case: edit only
> the `SPEC` array, leave everything else alone, and flag that the split is pending.

### To add or change a project (Claude Code)
1. Edit `scripts/projects.data.js` only.
2. Run `node scripts/build-project-pages.js` to regenerate `projects/*.html`.
3. Commit the data file **and** the regenerated HTML.
4. Do **not** touch the `STYLE` string, `renderProjectPage()`, or the class names in the
   template — those are the design contract.

---

## Page inventory & ownership

**Generated (design lives in the build script; content in `projects.data.js`):**
- `projects/sprint-tracker.html`, `habit-tracker.html`, `google-drive-migration.html`,
  `evernote-to-obsidian.html`, `granola-sync.html`, `resume-builder.html`,
  `interview-prep.html`, `floor-quotes.html`, `pitime.html`,
  `removals-web-presence.html`, `field-services-automation.html`
  (+ any others added to `SPEC`)

**Hand-authored (Claude Design edits markup/CSS directly — Claude Code: leave the layout/CSS alone):**
- `index.html` — the hub
- `private.html`
- `projects/index.html` — all-projects listing
- `projects/products.html`, `projects/clients.html`, `projects/labs.html` — group listings
- `Claude/skills.html`, `Claude/walkthroughs.html`, `Claude/templates.html` — **new**,
  currently shells awaiting content direction

> Note: `robgardens.html`, `whole-life-challenge.html`, `parnell-systems-platform.html`
> were hand-authored originally. Confirm whether they should be folded into the generator
> or kept hand-authored before editing.

**Personal zone — hand-authored (Claude Design owns markup/CSS):**
- `personal/index.html` — personal hub (Trading + Family cards)
- `personal/family/index.html` — unlisted family corner
- `personal/trading/index.html` — options primer landing (issue list)
- `personal/trading/01-at-a-glance.html` … `05-reading-the-chain.html` — 5 reader pages

### ⚠ Trading reader sub-system (different from the rest of the site)
Unlike every other page (which **inlines** its CSS), the trading reader pulls **shared
external stylesheets**:
- `personal/trading/assets/style.css` — landing/list styling
- `personal/trading/assets/reader.css` — the long-form reader pages

Editing these files restyles **all five reader pages at once** — that's the intended
leverage point. Two consequences:
- **Claude Code:** treat `personal/trading/assets/*.css` as design-owned; don't edit for content.
- Each issue also links a **print-ready PDF** (`options-cheat-sheet-0N-*.pdf`). A visual
  restyle of the reader must keep the PDFs in sync, or they'll drift from the web pages.
  Flag PDF regeneration whenever the reader design changes.

---

## The 1C "Console" design contract (so content edits stay on-brand)

- **Two colour worlds (decided):** one shared Console geometry + type system, two
  distinct accent identities so work and personal never read as the same thing.
  - **Parnell Systems / work / hub / Claude:** near-black bg, white text, **violet** accent.
  - **Personal** (trading + family + **friends** — friends is planned, not yet in repo):
    same Console shell, **one flat warm accent** across all of personal (decided),
    kept clearly distinct from work.
- **Trading reader keeps its own editorial identity** regardless of the above: the light,
  serif, print-like `reader.css` theme stays — harmonised with Console type/spacing but
  NOT recoloured into it (user: trading must look very distinct from Parnell Systems).
- Open sub-decision: RESOLVED — one flat warm accent across all of personal.
- Subtle differentiation within work: Knowledge/Claude vs. client/product.
- **Type:** Space Grotesk (display) + Space Mono (mono/technical), via Google Fonts.
- **Feel:** geometric, minimal, high-craft, engineering-credible. No blob gradients,
  no glassmorphism cards (that was the old theme).
- Keep copy in **British English** and in the existing problem → built → outcome structure.

---

## Deploy loop

1. Claude Design produces files (in the design project).
2. You (or the user) pull them into this repo.
3. Push to `main`. The live site redeploys on push.

**Check before pushing:** confirm whether the live site is served by **GitHub Pages**
(the `*.github.io` convention) or the **Vercel** project the user mentioned, so the push
targets the branch that actually deploys. Either way it is `main` today.

---

## Open items

- [ ] Refactor `SPEC` out of `build-project-pages.js` into `scripts/projects.data.js` (Claude Design).
- [ ] Rewrite generator `STYLE` + template to 1C Console (Claude Design).
- [ ] Redesign hand-authored pages to 1C Console (Claude Design).
- [ ] **User to decide content for `Claude/{skills,walkthroughs,templates}.html`** before they can be populated.
- [x] Confirm Pages vs. Vercel as the live deploy target. → **GitHub Pages** (verified 2026-07-23 AEST: push to `main` redeploys `gilesparnell.github.io` in ~30s; no Vercel project attached to this repo).
- [ ] **Hub `Personal` panel (03) re-added by Claude Code** (2026-07-23 AEST): the redesigned hub shipped with no link to `personal/`, but `personal/index.html` links back to `../` and the user had just asked for Parnell Systems first + Personal second on the hub. Content-only fix reusing existing `panel`/`row` classes — Claude Design to apply the warm personal accent + intended panel layout (it currently sits as a third violet panel in the 2-col grid).
- [ ] Port `personal/` to the warm Console variant (amber/rose) \u2014 Claude Design.
- [ ] Restyle `personal/trading/assets/*.css`; regenerate the 5 PDFs to match \u2014 Claude Design.
