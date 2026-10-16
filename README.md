# The Gift of Life — Organ Donation in Australia (V5 responsive layout)

## V5 layout refresh (16 October 2026)

- Fixed the **orphan half-width chart problem** caused by the old `nth-child(3n+1)` CSS selector.
- Expanded the desktop story canvas to 1480px, using paired cards only when two cards exist and a full-width first chart for three-chart chapters.
- Added editorial data-callout panels to charts 04 (state registrations) and 13 (waffle), making effective use of horizontal space without stretching Australian geography.
- Improved responsive spacing and the waffle cells. The 13 charts, existing sources, and **working V4 map geometry JavaScript are retained**.
- Test the website locally through `python -m http.server 8000`. The Vega libraries and map boundary are remote.
- When updating an existing GitHub repository, replace `index.html`, `style.css`, and `charts/13_waffle_coverage.json` only. The other files are unchanged from V4.


**Status: development draft / critique preparation, not verified as a final assessed submission.**

A single-page, Vega-Lite-based, data-storytelling site for FIT3179 DV2 with **13 separately authored JSON chart specifications**, **3 proposed different map idioms**, 11 local CSV tables (source data + derived data), and a detailed explanation of marks, channels, sources and limitations.

## 1. Important course rules

From the uploaded **FIT3179 Data Visualisation 2 v1.2** assignment PDF:
- **Due:** Sun 25 Oct 2026, 11:55pm. Assignment worth **25% of the unit**.
- Publicly available **single-page scrolling website on your GitHub account** (no main section swaps); JSON for every map/chart must be easy to inspect and readable.
- At least **10 charts**, and **3 different map idioms**. For HD idiom criterion: **more than 10 charts and at least 8 advanced idioms**, all used effectively. Every map idiom is advanced.
- At least **2 different data sources**; accurate real-world data; appropriate interactions and storytelling.
- Audience is general Australian for **Clayton** campus, or general Malaysian for **Malaysia** campus. **You are at the Malaysia campus**; ask your tutor to approve the Australia focus, since relevance/audience is assessed.
- A4 **hand-drawn sketch**, digitised into a PDF and hosted in the GitHub repo. **Digitally created sketch receives 0 sketch marks**. Hand-draw it yourself, scan or photograph, and add `sketch.pdf` separately. A different-topic sketch incurs a **3% penalty**.
- Include who/what/why/how submission description, author name/date, sources, explicit **AI-use acknowledgement**.
- Tutors may restrict marking if maps do not load or public URL inaccessible.

**Separate Week 11 critique (4% overall unit mark):** See `docs/CRITIQUE_PREP.md`.

## 2. Open the website locally

1. **Extract this ZIP completely**. Do not drag the ZIP itself into GitHub.
2. Open the extracted folder in **Visual Studio Code**.
3. Open VS Code Terminal (`Terminal` → `New Terminal`) and run:

   ```bash
   python -m http.server 8000
   ```

   Windows alternative: `py -m http.server 8000`.
4. In Chrome, visit `http://localhost:8000`.
5. Scroll through every chapter. Inspect **Developer Tools → Console** (`F12`) for fetch failures and Vega-Lite warnings.
6. **Internet is required** for the Vega libraries (loaded from jsDelivr), Google Fonts and the external state-geometry GeoJSON file. If chart 04/05 are blank, test that raw GitHub asset can load.

Opening `index.html` directly from the file system may block reading local JSON/CSV files.

## 3. Publish the draft with GitHub Pages

1. Log in to <https://github.com> → top right **+** → **New repository**.
2. Repository name: `organ-donation-australia` (or your preferred name). Choose **Public**.
3. In the empty repo select **uploading an existing file**; upload all contents of the extracted project folder, including `index.html` at the **repository root**, `charts`, `data`, `style.css` and `script.js`. Commit changes.
4. Open **Settings → Pages**. For Build and deployment, choose **Deploy from a branch**; **main** and **/(root)**, then Save.
5. Wait for your URL, generally `https://YOUR-USERNAME.github.io/organ-donation-australia/`.
6. Open the URL in an **incognito** window and verify **every chart/map** plus responsive layout. The assistant has not created a repository or uploaded the project.
7. Post this actual working URL on the **Moodle critique group forum** as required.

If you connected GitHub through ChatGPT, you may be able to streamline further, but **nothing has been uploaded by this package**.

## 4. Folder structure

```text
organ_donation_australia_v2/
├── index.html             Main one-page story
├── style.css              Typography, palette, layout, responsive rules
├── script.js              Vega embedding, error messages
├── charts/                13 human-readable Vega-Lite JSON specifications
├── data/                  11 local CSV datasets and derived plotting data
├── docs/
│   ├── README or this top-level README.md
│   ├── CRITIQUE_PREP.md
│   ├── COMPLETE_ASSIGNMENT_GUIDE.md
│   ├── chart_inventory.csv
│   └── MOODLE_SUBMISSION_DRAFT.md
└── [sketch.pdf]           NOT INCLUDED — must be hand-drawn by you
```

## 5. Data provenance and key verified numbers

**Dataset A: DonateLife / Organ and Tissue Authority**
- Annual registrations, 2020–2025, and state registration rates in 2025: https://www.donatelife.gov.au/all-about-donation/donation-and-transplantation-data?section=registration-data
- 2025 state deceased donors, transplant recipients and consent rates: https://www.donatelife.gov.au/all-about-donation/donation-and-transplantation-data?section=overview
- National 2025 medically eligible / family approach / donor pathway: https://www.donatelife.gov.au/sites/default/files/2026-03/2025%20donation%20and%20transplantation%20data%20summary%20factsheet%20-%20FINAL%20accessible%20PDF.pdf

Cross-checks in generator: annual total for 2025 = **147,969** new registrations; national 2025 deceased donors = **557**; recipients = **1,438**. National 2025 16+ registration rate **35%**, family consent **53%**. Annual new registrations peak in 2021 at **349,947**.

**Dataset B: Services Australia**
- AODR state × sex × age, as at **31 August 2026**: https://www.servicesaustralia.gov.au/australian-organ-donor-register-statistics?context=22
- Published female subtotal (legally valid consent registrations) **2,301,230**; male **1,349,260**. Published official source explicitly warns the table includes **objection records**; don't claim everyone counted wants to donate. These are a different population/month/year from DonateLife 2025. AODR also contains *intent* records in a distinct table; the project **does not add intent records to the age/sex analysis**.

**Geography (third-party)**: <https://github.com/rowanhogan/australian-states> — externally loaded GeoJSON at `https://raw.githubusercontent.com/rowanhogan/australian-states/master/states.min.geojson`. Properties joined by `STATE_NAME`. **This map geometry file could not be downloaded/test-rendered inside this environment. Confirm availability/licence and visual appearance yourself before final submission.**

## 6. Three proposed map idioms

1. **Choropleth** (04): colour lightness of states encodes **2025 registered % of age 16+**.
2. **Proportional symbol map** (05): symbol circle area encodes **2025 deceased donor count** against a state boundary outline.
3. **Schematic tile grid map** (06): equal-size labelled state tiles encode **2025 family consent rate**. It is *not geographically to scale*.

The tile-grid map's acceptance as a distinct map idiom is a **tutor decision**; request approval. Geographic 04 and 05 use remote geometry: if it doesn't load, the site is *not* ready for assessment.

## 7. Limitations and quality gate

This draft is not represented as ready for final assessment:
- **Cannot verify remote Vega libraries or remote boundary shapes rendering** in this network-limited execution environment.
- No public GitHub URL yet; publication needs your GitHub account/action.
- Distinctness of three maps and classification of 8 advanced idioms **not formally approved**.
- Some non-map idioms can be considered basic by a marker despite the design label. A count of 13 JSON specs does **not guarantee** 13 charts will be counted separately.
- Wordings, sources and figures need a final student audit. Comparisons between counts and rates are carefully separated, but interpretation needs review.
- **Handwritten** A4 sketch must be created and uploaded by you; not provided here.
- Add **your author name**, review each chart, make actual edits, then include the required Moodle explanation.
- External GeoJSON licence was not established; consider replacing it with an official openly licensed ABS state boundary file.

## 8. Before submission

[ ] Confirm Australia topic with tutor (Malaysia-campus audience requirement).
[ ] Draw your actual A4 sketch and host the scanned PDF on GitHub.
[ ] Verify 13 chart renderings, source links, and 3 map idioms, on laptop and mobile.
[ ] Ask tutor whether each proposed advanced idiom meets rubric definitions.
[ ] Reconcile unusual state differences (e.g. SA’s historic registration system) without inventing explanations.
[ ] Explain data coverage dates, methodology and limitations in your own words.
[ ] Replace name placeholder and cite AI use, external geometry and data.
[ ] Publish public GitHub Pages and test with incognito.
[ ] Submit the live URL, sketch PDF URL and Who/What/Why/How through Moodle.

---
AI transparency: This development draft was substantially generated with AI assistance. The assignment allows AI if acknowledged; you are responsible for verifying, understanding and making the submitted visuals your genuine work.


## Superseded map fix v2 (historical notes — see version 3 below)

The original Version 2 maps 04 and 05 were plotted with the Mercator projection centred at the default coordinates, causing Australia to be rendered at the far edge of the canvas. This version sets a centre near Australia (134.2°E, 27.2°S) and scales the projection to the browser chart width. These changes affect `charts/04_choropleth_reg_rate.json`, `charts/05_symbol_map_donors.json`, and `script.js`.

**After uploading this version to GitHub:** overwrite the corresponding files, wait for GitHub Pages to redeploy, and hard-refresh with Ctrl+Shift+R. Chart 06 is deliberately a schematic tile grid, not a literal geographical boundary map.

**Verification (v2):** This attempted correction was insufficient, as later screenshots showed. Version 3 below replaces it.


## Map fix version 3 (16 October 2026)

**Why the previous fix failed:** the external state GeoJSON may use GeoJSON (RFC 7946) ring directions; D3's spherical polygon renderer expects the reverse direction. This causes a huge solid sea-coloured rectangle and incomplete coastlines, as seen in the screenshots. The prior hotfix also overrode Vega-Lite's projection scale, preventing the map from auto-fitting.

**What changed:** a new readable `map_geometry.js` fetches the original GeoJSON once, checks that there are precisely 8 valid Australian state/territory features, reverses polygon rings to the winding that D3 expects, checks geographic coordinates, then passes the cleaned GeoJSON into map charts 04 and 05 via `data.values`. Both charts use `projection: {type: 'mercator'}` with Vega-Lite's automatic geometry fit. The map is still a Vega-Lite `geoshape` visualisation; no bitmap screenshots are substituted. Chart 06 remains intentionally schematic.

**For existing GitHub repos:** replace `script.js`, `index.html`, both map-chart JSON files and **add the new `map_geometry.js`**. Or replace the whole repository contents. Hard-refresh after Pages redeploys.

**Limitations:** Source GeoJSON is fetched from GitHub at runtime and its licence needs independent verification. This sandbox can unit-test the winding correction with synthetic GeoJSON and verify source code, but cannot check a live browser rendering of the 233-KB hosted boundary dataset. If a source boundary file is changed/removed, the charts will display a detailed error instead of a misleading partial map.


## Map fix version 4 — degenerate GeoJSON rings (16 October 2026)

Version 3 rejected the whole map when a small ring in the third-party GeoJSON had fewer than four positions or collapsed to zero area, producing “Invalid GeoJSON polygon ring”. Version 4 cleans valid rings (closing them and removing adjacent duplicates), skips malformed shells/holes while keeping the remainder of the multipolygon, and checks that **all 8 states and territories** still contain drawable shapes. This avoids the throw for individual invalid fragments. The fix preserves D3-compatible ring winding and automatic projection fitting.

If you already have V3, **replace just `map_geometry.js`**. If refreshing a published site, ensure the new file deploys and use Ctrl+Shift+R (or verify network contents). Verify maps 04 and 05 visually before critique.

Important limitation: The externally hosted GeoJSON was not fetchable in this execution environment, so real-browser rendering of this boundary dataset is **not verified**. The new test suite uses synthetic valid and malformed boundaries. Please screenshot the result to confirm.
