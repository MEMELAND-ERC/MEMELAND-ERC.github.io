# MEMELAND Website

This repository contains the source code for the MEMELAND project website:
<https://memeland-erc.github.io/>

The site is built with Quarto. Source files are written in `.qmd` and the generated website is published from the `docs/` folder.

## Quick Start (For Non-Technical Editors)

If you only need to update text/news/people:

1. Edit the relevant `.qmd` source file (not the `.html` file in `docs/`).
2. Save your changes.
3. Render the website:

```bash
quarto render
```

1. Check that updated pages appear in `docs/`.
2. Commit and push changes to GitHub.

## What To Edit vs What Not To Edit

Edit these:

- Source content files (`*.qmd`) in the project root and subfolders.
- Site configuration in `_quarto.yml`.
- Styling files (`custom_style.scss`, `_colors.scss`, `_fonts.scss`).
- Images and static assets in `Materials/`.

Do not edit these manually:

- `docs/` HTML files (they are generated output).
- `docs/site_libs/` files (generated dependencies).
- `search.json`, `sitemap.xml`, and similar generated files in `docs/`.

## Project Structure

Main areas of the repository:

- `index.qmd`: Homepage.
- `about.qmd`: Project overview and research teams summary.
- `join_us.qmd`: Recruitment/collaboration page (currently placeholder).
- `Activities/activities.qmd`: News listing page (auto-collects posts from `Activities/news/`).
- `Activities/news/*.qmd`: Individual news/activity posts.
- `Activities/_template.qmd`: Copy this to create a new news post.
- `Team/*.qmd`: Team pages (`uit`, `oxford`, `eawag`, `salzburg`, `cuni`) and `people.qmd`.
- `Outputs/outputs.qmd`: Publications, datasets, presentations, deliverables, theses.
- `Materials/`: Logos, faces, photos, visual identity docs, and content support files.
- `_quarto.yml`: Global website settings (navbar, links, output location, theme).
- `custom_style.scss`, `_colors.scss`, `_fonts.scss`: Visual style and typography.
- `docs/`: Generated website output (published by GitHub Pages).

## Content Editing Guide

### 1) Homepage

File: `index.qmd`

Edit this when updating:

- Main project summary text.
- Hero title/subtitle.
- Introductory project details.

### 2) About Page

File: `about.qmd`

Edit this when updating:

- Long-form project description.
- Research framing and goals.
- Links to research teams.

### 3) Team Pages

Files:

- `Team/people.qmd` for the full people directory.
- `Team/uit.qmd`, `Team/oxford.qmd`, `Team/eawag.qmd`, `Team/salzburg.qmd`, `Team/cuni.qmd` for institution-specific information.

Important:

- Team pages auto-display recent posts by category.
- Categories in news posts must match team names exactly: `uit`, `oxford`, `eawag`, `salzburg`, `cuni`.

### 4) Activities / News

Files:

- Listing page: `Activities/activities.qmd`
- New posts: `Activities/news/*.qmd`
- Template: `Activities/_template.qmd`

How to add a news post:

1. Copy `Activities/_template.qmd` into `Activities/news/`.
2. Rename it, for example: `2026-coring-campaign.qmd`.
3. Fill in front matter fields:
   - `title`
   - `date`
   - `description`
   - `image`
   - `categories`

4. Replace placeholder body content.
5. Render the site.

### 5) Outputs

File: `Outputs/outputs.qmd`

Use this page to add:

- Publications
- Datasets
- Presentations/Posters
- Reports/Deliverables
- Theses

The page already includes formatting examples in comments.

## Navigation and Site Settings

File: `_quarto.yml`

This file controls:

- Website title
- Footer
- Navigation bar and menu links
- Repo links
- Output location (`docs/`)
- Theme (`custom_style.scss`)

When adding a new top-level page, also add it to `website.navbar.left`.

## Styling and Visual Identity

Files:

- `custom_style.scss`: Main style rules (layout, headings, links, navbar, code blocks).
- `_colors.scss`: Brand color definitions and helper classes.
- `_fonts.scss`: Font imports and text utility classes.

If you only need a minor style tweak, start in `custom_style.scss`.

## Images and Media

Store image files in:

- `Materials/photos/` (general photos)
- `Materials/Faces/` (people photos)
- `Materials/Logos/` (logos)

Tips:

- Use descriptive filenames.
- Prefer compressed web images (`.jpg`, `.png`, `.webp`) with reasonable file sizes.
- Always include meaningful alt text in page image markdown.

## Build and Publish Workflow

### Local build

Run:

```bash
quarto render
```

### Preview locally (optional)

Run:

```bash
quarto preview
```

### Publish

This project publishes from `docs/` on the `main` branch (GitHub Pages).

Typical update sequence:

1. Edit source files (`.qmd`, `.scss`, `_quarto.yml`, assets).
2. Run `quarto render`.
3. Review updated pages.
4. Commit source and generated `docs/` changes.
5. Push to `main`.

## Common Mistakes To Avoid

- Editing generated files in `docs/` instead of source `.qmd` files.
- Forgetting to run `quarto render` after content edits.
- Forgetting to add category tags in news posts, causing missing team-news cards.
- Breaking image paths by using wrong relative locations.
- Renaming files without updating navbar/menu links in `_quarto.yml`.

## Troubleshooting

If a page does not update:

1. Confirm you edited the source `.qmd` file.
2. Run `quarto render` and check for errors in terminal output.
3. Verify the corresponding HTML in `docs/` changed.
4. Check links/paths in `_quarto.yml` and page front matter.

If news does not appear on a team page:

1. Open the news post front matter.
2. Confirm `categories` includes one of: `uit`, `oxford`, `eawag`, `salzburg`, `cuni`.
3. Re-render.

## Handover Checklist

Before handing to another editor, confirm:

- Quarto is installed and `quarto render` works.
- They know to edit source files, not `docs/` HTML directly.
- They know where to add people/news/outputs.
- They can add a post from `Activities/_template.qmd`.
- They can run render and commit both source and `docs/` updates.
