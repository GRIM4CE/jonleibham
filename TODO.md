# Portfolio Site TODO

## Completed
- [x] Deploy to Netlify
- [x] Connect AWS domain
- [x] Update Footer with real social links
- [x] Add meta tags for SEO (description, Open Graph for social sharing)
- [x] Add professional photo to Hero or About section
- [x] Add downloadable resume/CV link
- [x] Add real projects to Projects section
- [x] Rebuild on the Dossier design: five screens, numbered work index, bottom tab bar

## Remaining
- [ ] Create og-image.png (1200x630px) — the current one still shows the old light design
- [ ] Add a screenshot per project for the detail hero (currently an empty 186px well)
- [ ] Test responsiveness on real devices (verified at 320/390/480/900 in Chromium)
- [ ] Decide whether the six dropped projects (Uppercut, Joebot, Stamp, Todos PWA,
      Chat App, bhamdesigns) come back into the index or stay off it

## Future Enhancements
- [ ] Per-project pages instead of hash routing, so each project gets its own
      `<title>` and OG card. Needs `scripts/prerender.mjs` to emit a file per route.
- [ ] Add subtle animations (fade-ins, hover effects)
- [ ] Add analytics (Google Analytics or Plausible)
- [ ] Swipe between project details — "03 OF 07" implies it, but it would need JS
