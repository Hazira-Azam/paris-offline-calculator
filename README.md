# PARIS Thrombosis Risk Score Calculator — Offline PWA

This independent offline-capable web app reproduces the six variables and displayed point values on the [Appcardio PARIS Thrombosis Risk Score Calculator](https://appcardio.com/paris-thrombosis-risk-score-calculator/) page. It is not affiliated with or endorsed by Appcardio.

## Parameters reproduced from the referenced page

| Variable | Yes points |
|---|---:|
| Diabetes Mellitus | 1 |
| Current Smoking | 1 |
| Acute Coronary Syndrome (ACS) as indication for PCI | 1 |
| Prior PCI | 1 |
| Stent Diameter < 3 mm | 1 |
| Multivessel PCI | 2 |

Maximum displayed total: 7. The source page describes 0–2 as Low Risk, 3–4 as Intermediate Risk, and >5 as High Risk. It does not specify a category for exactly 5 points, so the app flags 5 as “Category not specified” rather than inventing a category.

## Clinical caution

This project reproduces the inputs and point descriptions displayed by the referenced website; it does not independently establish that they match the original validated PARIS model. The published PARIS score literature may describe different variables or scoring. Have a qualified clinician verify every parameter, weight, threshold, intended population, and interpretation against primary sources before clinical use. Do not use this prototype alone to guide patient care.

## Files

- `index.html` — interface and variable inputs
- `styles.css` — responsive styling
- `app.js` — local scoring and result display
- `service-worker.js` — offline app-shell caching
- `manifest.webmanifest` — installable web app metadata
- `icon.svg` — app icon

## Test locally

From this directory run `python -m http.server 8000`, then open `http://localhost:8000`. Service workers require HTTPS or localhost. Load the page once, wait for caching, then test with browser developer tools set to Offline.

## Publish on GitHub Pages

1. Commit and push the files to the root of the public repository.
2. Open repository **Settings → Pages**.
3. Select **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
4. Open the published HTTPS URL while online and wait for the service worker to cache the app.
5. On Android Chrome, use the browser menu's **Install app** or **Add to Home screen** option if offered.
6. Test offline by enabling airplane mode and reopening the installed app.

## Privacy

Scoring runs locally in the browser. This app does not send entered selections to a server or store them in localStorage, IndexedDB, cookies, or a database. Hosting providers may keep standard web access logs.
