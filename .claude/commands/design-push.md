---
description: Rebuild the design bundle and push it to the Claude Design project
---

Push `src/design-system/` to the Claude Design project **Jon Leibham Portfolio DS**
(`19746144-6183-4f19-bbc3-c5c057d68436`).

Run after a merge that touches `src/design-system/` or `src/entry-design.tsx`.

## Why this is a command and not CI

`DesignSync` authenticates through the user's claude.ai login from a Claude Code
session, so it cannot run as a GitHub Action. Something has to push it
deliberately — this is that something.

## Steps

1. **Get current.** `git checkout main && git pull`. Never push a bundle built
   from a stale or dirty tree — say so and stop if the tree is dirty.

2. **Build.** `npm run build:design`. This runs the full `npm run build` first,
   because the generator reads the stylesheet that pass emits to
   `dist/assets/*.css`.

3. **Measure.** `node scripts/measure-design-cards.mjs`. If it flags any card
   with more than 40px of unused height, retune that card's `viewport` in
   `src/entry-design.tsx`, rebuild, and re-measure. A card that declares far
   more height than it uses renders as a mostly-empty box in the pane.
   Negative waste means the content overflows — fix that too.

4. **Check for drift — this is the important step.** The uploaded cards are
   generated output. If someone edited a card *in the Design space*, `write_files`
   will silently overwrite that edit.

   Call `DesignSync` `list_files`, then `get_file` on each `cards/*.html` and
   compare against the freshly built local copy. The cards are 1–5 KB each, so
   reading all eight is cheap. **Skip `styles.css`** — it is ~45 KB of generated
   CSS and nobody hand-edits it.

   Report any card whose remote content differs from the local build, and ask
   before overwriting. A difference means either someone edited it remotely, or
   the local build has legitimately moved on — you cannot tell which from the
   diff alone, so the user decides.

5. **Show the plan and get an explicit yes.** List the exact paths, the project
   id, and the local directory. This publishes to claude.ai. Do not proceed on
   silence.

6. **Upload.**
   - `finalize_plan` with `projectId`, `writes: ["styles.css", "cards/*.html"]`,
     `deletes: []` (required, even when empty), and `localDir` set to the
     absolute path of `design-bundle`.
   - `write_files` with the returned `planId` and one entry per file using
     `localPath`, never inline `data` — `localPath` uploads straight from disk
     without the contents entering context.
   - Do **not** upload `design-bundle/cards.json`. It is local metadata for the
     measure script; the app compiles its own `_ds_manifest.json` from the
     `@dsCard` markers.

7. **Confirm and hand off.** `list_files` to verify the paths landed, then ask
   the user to open the pane and check the cards render — visible on the dark
   ground, fonts applied or acceptably fallen back, variants visually distinct.
   `list_files` confirms upload, not render; nothing available here can see the
   pane.

## Card format

Line 1 of every card must be the marker, carrying all four attributes:

```
<!-- @dsCard group="Components" viewport="720x395" name="Button" subtitle="..." -->
```

`viewport` is a `WxH` string. Emitting only `group` loses the card's name,
subtitle and dimensions in the pane. `scripts/build-design-bundle.mjs` handles
this; the note is here so a change to it does not quietly regress.
