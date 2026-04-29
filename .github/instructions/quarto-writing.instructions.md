# Quarto Writing Instructions

Use this file when creating or editing any `.qmd` file in the MEMELAND website.

## Required frontmatter (every `.qmd`)

```yaml
---
date: YYYY/MM/DD
date-format: long
date-modified: last-modified
sidebar: false
---
```

- `date:` — use `YYYY/MM/DD` format (forward slashes, **not** dashes)
- `date-format: long` — always include
- `date-modified: last-modified` — always include
- `sidebar: false` — always include

## YAML syntax rules

- Use **spaces only** — no tabs anywhere in YAML frontmatter
- Quote strings that contain colons: `title: "Fieldwork Update: Iceland 2026"`
- Dates always use `YYYY/MM/DD`
- Booleans lowercase: `true`, `false`

## Multilingual page structure

Most pages have a **container file** and **per-language include files**:

```
About/about.qmd              ← container (do not write content here)
About/_about-en.qmd          ← English content
About/_about-de.qmd          ← German content
About/_about-fr.qmd          ← French content
About/_about-cs.qmd          ← Czech content
About/_about-no.qmd          ← Norwegian content
```

The container file uses `{.content-visible when-profile="..."}` blocks:

```markdown
::::: {.content-visible when-profile="english"}
{{< include _about-en.qmd >}}
:::::

::::: {.content-visible when-profile="german"}
{{< include _about-de.qmd >}}
:::::
```

When updating a multilingual page, **edit the per-language `_<page>-<lang>.qmd` files**, not the container `.qmd`.

## News posts

News posts live in `Activities/news/` and are **English only**:
- File name: `YYYY-short-description.qmd` (kebab-case, date-prefixed)
- No per-language variants needed
- The listing in `Activities/activities.qmd` is auto-generated — do NOT edit it

See [activities.instructions.md](activities.instructions.md) for full details.

## File naming

| Content type | Convention | Example |
|---|---|---|
| News posts | `YYYY-slug.qmd` | `2026-coring-iceland.qmd` |
| Per-language page files | `_<page>-<lang>.qmd` | `_about-de.qmd` |
| Container pages | `<page>.qmd` | `about.qmd` |

Use lowercase, kebab-case or snake_case. No spaces. No special characters.

## Headings

- `#` — top-level title (one per file)
- `##` — sections
- `###` — subsections

Do NOT duplicate the `title:` frontmatter field as a `#` heading.

## Callouts

```markdown
::: {.callout-note}
## Note title
Content here.
:::

::: {.callout-tip}
## Tip
Content here.
:::

::: {.callout-important}
## Important
Content here.
:::

::: {.callout-warning}
## Warning
Content here.
:::
```

## Buttons

```markdown
[Button text](https://example.com){.btn}
```

## Images

```markdown
![Alt text description.](relative/path/to/image.jpg){fig-align="center" fig-alt="Alt text description."}

: *Caption text. Photo: Photographer Name / Institution.*
```

- Use relative paths from the current file's location
- Always include `fig-alt` for accessibility
- Place image files in `Materials/photos/` or the relevant subfolder

## What to never do

- Do NOT edit `Activities/activities.qmd` (auto-listing container)
- Do NOT edit files in `docs/` directly
- Do NOT use tabs in YAML frontmatter
- Do NOT use `YYYY-MM-DD` date format in frontmatter (use `YYYY/MM/DD`)
- Do NOT omit `sidebar: false`
