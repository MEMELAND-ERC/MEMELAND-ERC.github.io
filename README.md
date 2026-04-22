# MEMELAND Website

This repository contains the source code for the MEMELAND project website:
<https://memeland-erc.github.io/>

The site is built with [Quarto](https://quarto.org/). Source files are written in `.qmd` format and the generated website is published from the `docs/` folder via GitHub Pages.

The website is **multilingual**: it is available in **English, German, French, Czech, and Norwegian**. Each language has its own dedicated section under `docs/en/`, `docs/de/`, `docs/fr/`, `docs/cs/`, and `docs/no/`. Visitors can switch languages using the 🌐 menu in the navigation bar.

---

## For Non-Technical Editors

This section covers everything you need to update content without knowing Quarto or web development.

### The Golden Rule

> **Always edit source `.qmd` files — never edit files inside the `docs/` folder.**

Files in `docs/` are automatically generated. Any manual changes there will be overwritten the next time the site is rendered.

### How the Multilingual Files Work

Every page on the site has one main file (e.g., `index.qmd`) that acts as a container. The actual content for each language lives in a separate file named with a two-letter language code:

| Language   | Code | Example content file      |
|------------|------|---------------------------|
| English    | `en` | `_index-en.qmd`           |
| German     | `de` | `_index-de.qmd`           |
| French     | `fr` | `_index-fr.qmd`           |
| Czech      | `cs` | `_index-cs.qmd`           |
| Norwegian  | `no` | `_index-no.qmd`           |

**To update a page in a specific language, open and edit the corresponding `_<page>-<lang>.qmd` file.** For example:

- To update the German About page → edit `About/_about-de.qmd`
- To update the French homepage → edit `_index-fr.qmd`
- To update the English Join Us page → edit `JoinUs/_join_us-en.qmd`

Do not edit the main container files (e.g., `index.qmd`, `About/about.qmd`) — they just glue the language files together and rarely need changing.

### News / Activity Posts

News posts are published **in English only** and appear in the Activities section. To add a post:

1. Copy `Activities/_template.qmd` into the `Activities/news/` folder.
2. Rename it with a descriptive name, e.g. `2026-coring-svalbard.qmd`.
3. Open the file and fill in the fields at the top (between the `---` lines):
   - `title` — the post headline
   - `date` — format: `YYYY/MM/DD`
   - `description` — one or two sentences shown in the listing card
   - `image` — path to a photo in `Materials/photos/` (or leave the placeholder)
   - `categories` — tags for filtering; use team names (`uit`, `oxford`, `eawag`, `salzburg`, `cuni`) so the post appears on the right team page
4. Replace the placeholder body text with your content.
5. Ask Ondřej to render and publish the site (or follow the Build section below).

The template file itself contains step-by-step instructions in its comments.

### What To Edit vs What Not To Edit

| Edit these | Do NOT edit these |
|---|---|
| `_<page>-<lang>.qmd` files (language content) | `docs/` folder (generated output) |
| `Activities/news/*.qmd` (news posts) | `docs/site_libs/` (generated dependencies) |
| `Outputs/outputs.qmd` (publications etc.) | `search.json`, `sitemap.xml` in `docs/` |
| `Team/people.qmd` and institution pages | Any `.html` file anywhere |
| `Materials/` (photos, logos) | `_quarto.yml` or `_quarto-<lang>.yml` (unless you know what you're doing) |

---

## Project Structure

```
root/
├── index.qmd                  Main container: Homepage
├── _index-en.qmd              Homepage content — English
├── _index-de.qmd              Homepage content — German
├── _index-fr.qmd              Homepage content — French
├── _index-cs.qmd              Homepage content — Czech
├── _index-no.qmd              Homepage content — Norwegian
│
├── About/
│   ├── about.qmd              Main container: About page
│   ├── _about-en.qmd          About content — English
│   ├── _about-de.qmd          About content — German
│   └── ...                    (fr, cs, no)
│
├── Activities/
│   ├── activities.qmd         Main container: News listing page
│   ├── _activities-en.qmd     (rarely needs editing)
│   ├── _template.qmd          Template for new news posts
│   └── news/                  Individual news post files go here
│
├── JoinUs/
│   ├── join_us.qmd            Main container: Join Us page
│   ├── _join_us-en.qmd        Join Us content — English
│   └── ...                    (de, fr, cs, no)
│
├── Outputs/
│   ├── outputs.qmd            Main container: Outputs page
│   ├── _outputs-en.qmd        Outputs content — English
│   └── ...                    (de, fr, cs, no)
│
├── Team/
│   ├── people.qmd             Full people directory
│   ├── _people-en.qmd         People content — English
│   ├── uit.qmd / _uit-en.qmd  UiT team page and its language files
│   ├── oxford.qmd / ...       Oxford team page and its language files
│   ├── eawag.qmd / ...        Eawag team page and its language files
│   ├── salzburg.qmd / ...     Salzburg team page and its language files
│   └── cuni.qmd / ...         CUNI team page and its language files
│
├── Materials/
│   ├── photos/                General site photos
│   ├── Faces/                 People profile photos
│   └── Logos/                 Project and institution logos
│
├── _quarto.yml                Global site settings (shared across languages)
├── _quarto-english.yml        English-specific settings (output-dir, navbar)
├── _quarto-german.yml         German-specific settings
├── _quarto-french.yml         French-specific settings
├── _quarto-czech.yml          Czech-specific settings
├── _quarto-norwegian.yml      Norwegian-specific settings
│
├── custom_style.scss          Visual styling
├── _colors.scss               Brand colours
├── _fonts.scss                Typography
│
├── render_all.ps1             Render script — Windows PowerShell
├── render_all.sh              Render script — macOS / Linux / Git Bash
└── docs/                      Generated website output (do not edit manually)
    ├── index.html             Auto-redirect to English
    ├── en/                    English site
    ├── de/                    German site
    ├── fr/                    French site
    ├── cs/                    Czech site
    └── no/                    Norwegian site
```

---

## Content Editing Guide

### Homepage

Edit the `_index-<lang>.qmd` file in the project root for the language you want to update.

### About Page

Edit `About/_about-<lang>.qmd`.

### Join Us Page

Edit `JoinUs/_join_us-<lang>.qmd`.

### Outputs Page

Edit `Outputs/_outputs-<lang>.qmd`. This page lists publications, datasets, presentations, deliverables, and theses. The file contains formatting examples in its comments.

### Team / People Pages

- **Full people directory**: edit `Team/_people-<lang>.qmd`
- **Institution-specific pages**: edit `Team/_<institution>-<lang>.qmd`
  - Institutions: `uit`, `oxford`, `eawag`, `salzburg`, `cuni`

> Team pages automatically show recent news posts that include the institution's name as a category tag (e.g. `categories: [oxford]`).

### News Posts (Activities)

See the [News / Activity Posts](#news--activity-posts) section above. Posts are English-only.

---

## Images and Media

Store files in:

- `Materials/photos/` — general photos used in pages and news posts
- `Materials/Faces/` — profile photos for people pages
- `Materials/Logos/` — project and institution logos

Tips:

- Use descriptive, lowercase filenames without spaces (e.g. `coring-svalbard-2026.jpg`).
- Prefer compressed web images (`.jpg`, `.png`, `.webp`) with reasonable file sizes (under 1 MB per image where possible).
- When referencing images in `.qmd` files, use paths relative to the file's location.

---

## Build and Publish Workflow

### Prerequisites

[Quarto](https://quarto.org/docs/get-started/) must be installed. Verify with:

```powershell
quarto --version
```

### Rendering the Full Multilingual Site

You **must** use the render scripts to build all five languages at once. Running plain `quarto render` only builds one profile.

**Windows PowerShell:**

```powershell
.\render_all.ps1
```

**macOS / Linux / Git Bash:**

```bash
bash render_all.sh
```

The script renders each language profile in sequence and writes output to `docs/en/`, `docs/de/`, `docs/fr/`, `docs/cs/`, and `docs/no/`. It also recreates `docs/index.html` as a redirect to the English version.

### Rendering a Single Language (faster for quick checks)

```powershell
quarto render --profile english
quarto render --profile german
quarto render --profile french
quarto render --profile czech
quarto render --profile norwegian
```

### Preview Locally (Optional)

```powershell
quarto preview --profile english
```

Open the URL shown in your terminal to view the site before publishing.

### Publish

The site is published automatically from the `docs/` folder on the `main` branch via GitHub Pages.

Typical update sequence:

1. Edit the relevant `_<page>-<lang>.qmd` source file(s).
2. Run `.\render_all.ps1` (or `bash render_all.sh`).
3. Review the updated pages in `docs/`.
4. Commit all changed source files **and** the updated `docs/` folder.
5. Push to `main` — the live site updates automatically within a minute.

---

## Common Mistakes To Avoid

- Editing files in `docs/` instead of the source `_<page>-<lang>.qmd` files.
- Running plain `quarto render` instead of the `render_all` script — this only renders one language and leaves the others stale.
- Forgetting to add category tags in news posts (`categories: [uit]`), which causes the post to not appear on team pages.
- Breaking image paths by placing photos outside `Materials/` or using absolute paths.
- Renaming page files without also updating the corresponding `_quarto-<lang>.yml` navbar entries.

---

## Troubleshooting

**A page does not update after editing:**

1. Confirm you edited the source `_<page>-<lang>.qmd` file, not a file in `docs/`.
2. Run `.\render_all.ps1` and check for errors in the terminal output.
3. Verify the corresponding HTML in `docs/<lang>/` changed.

**A news post does not appear on a team page:**

1. Open the news post and check the `categories:` field in the front matter.
2. Make sure it includes the institution tag exactly as written: `uit`, `oxford`, `eawag`, `salzburg`, or `cuni`.
3. Re-render.

**Render script fails:**

1. Run `quarto --version` to confirm Quarto is installed.
2. Check that you are running the script from the project root folder.
3. Read the error message — it will name the profile and file that failed.

---

## Handover Checklist

Before handing the site over to another editor, confirm they:

- Have Quarto installed and can run `quarto --version` successfully.
- Know to edit `_<page>-<lang>.qmd` files, never files in `docs/`.
- Know how to add a news post from `Activities/_template.qmd`.
- Can run `.\render_all.ps1` and commit both source and `docs/` changes.
- Know that news posts are English-only and appear on team pages via category tags.
