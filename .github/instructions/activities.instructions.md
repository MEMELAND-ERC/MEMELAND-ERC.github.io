# Activities / News Post Instructions

Use this file when creating or updating news posts in `Activities/news/`.

## File path

```
Activities/news/YYYY-short-description.qmd
```

- Use lowercase kebab-case: `2026-coring-iceland.qmd`
- Prefix with the year (or `YYYY-MM-` if the month matters): `2026-03-myvatan-coring.qmd`
- Never use spaces or special characters in file names

## Required frontmatter

```yaml
---
title: "Post Title Here"
date: YYYY/MM/DD
date-format: long
date-modified: last-modified
description: "One or two sentences shown in the news card. Keep under 200 characters."
image: "../../Materials/photos/your-photo.jpg"
categories: [uit, fieldwork, coring]
sidebar: false
---
```

### Frontmatter rules

- `title:` — required; wrap in quotes if it contains a colon
- `date:` — required; use `YYYY/MM/DD` format (forward slashes, **not** dashes)
- `date-format: long` — always include exactly this
- `date-modified: last-modified` — always include exactly this
- `description:` — required; wrap in quotes; keep concise (≤ 200 characters)
- `image:` — optional; relative path from the news file to the image in `Materials/photos/`; omit entirely if no real image is available
- `categories:` — required; list of tags in square brackets (see Category tags below)
- `sidebar: false` — always include

### Category tags

**Team tags** — use exactly these spellings:

| Tag | Institution |
|-----|------------|
| `uit` | UiT — The Arctic University of Norway |
| `oxford` | University of Oxford |
| `eawag` | Eawag (Swiss Federal Institute of Aquatic Science and Technology) |
| `salzburg` | University of Salzburg |
| `cuni` | Charles University Prague |

**Free-form tags** (examples):
- `fieldwork`, `coring`, `conference`, `workshop`, `outreach`, `publication`, `collaboration`

You may combine both: `categories: [fieldwork, coring, uit, oxford]`

## Standard content structure

News posts are published in **English only**. No language variant files are needed.

### Recommended sections (adapt as needed)

1. **Opening paragraph** — 2–4 sentences: what happened, where, why it matters
2. **Key Information callout** (optional) — dates, location, link
3. **Background** — context and significance for MEMELAND
4. **Details** — what happened / programme / outcomes
5. **Photo** — if available (see image insertion below)
6. **Resources** — links (optional)

### Key Information callout pattern

```markdown
::: {.callout-note}
## Key Information

📅 **Date:** DD Month YYYY

🗺️ **Location:** City, Country

🔗 **More info:** [Link title](https://example.com)
:::
```

### Image insertion

```markdown
![Description of the photo.](../../Materials/photos/your-photo.jpg){fig-align="center" fig-alt="Description of the photo."}

: *Caption: What is shown and photographer credit. Photo: Jane Doe / UiT.*
```

- Always include `fig-alt` equal to a description of the image (accessibility requirement)
- Relative path goes two levels up from `Activities/news/` to reach repo root, then into `Materials/photos/`
- Place image files in `Materials/photos/` before referencing them

### Optional callouts

```markdown
::: {.callout-tip}
## How to get involved

Describe registration, contact, or next steps.
:::
```

## Listing auto-discovery

`Activities/activities.qmd` lists all files in `Activities/news/` automatically via Quarto's listing feature.

**Do NOT edit `Activities/activities.qmd`** — posts appear in the listing as soon as the file is placed in `Activities/news/` and the site is rendered.

## Reference files

- `Activities/_template.qmd` — blank template to copy for new posts
- `Activities/news/test.qmd` — full fictional example showing every section
