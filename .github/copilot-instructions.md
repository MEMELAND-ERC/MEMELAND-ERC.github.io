# MEMELAND Website — Copilot Instructions

## Project Overview

This repository hosts the **MEMELAND** website at <https://memeland-erc.github.io/>.
MEMELAND is a European Research Council (ERC) project studying lake sediment archives across Europe.
The website is maintained by @OndrejMottl. Content is primarily submitted by Yulia Mun (project coordinator) and team members via GitHub Issues.

**Maintainer:** @OndrejMottl

## Technology Stack

| Component | Details |
|-----------|---------|
| Static site generator | [Quarto](https://quarto.org/) |
| Source files | `*.qmd` files (YAML frontmatter + Markdown) |
| Output | `docs/` folder — generated **only** by the `Re-render site after merge` workflow; never committed in PRs |
| Styling | `custom_style.scss` + `_colors.scss` + `_fonts.scss` |
| Site config | `_quarto.yml` (global) + `_quarto-<lang>.yml` per language |
| Languages | English (`en`), German (`de`), French (`fr`), Czech (`cs`), Norwegian (`no`) |

## Rendering Process

The published site in `docs/` is rendered and committed automatically by the `Re-render site after merge` workflow after every merge into `main`, using the Quarto version pinned in `QUARTO_VERSION`.

**PRs contain source changes only. Never commit `docs/`.**

To check a change, render a preview into the git-ignored `_preview/` folder:

```bash
quarto render --profile english --output-dir _preview/en   # repeat per affected language
```

Or render all five languages into `_preview/` with the convenience scripts:
- `bash render_all.sh` — macOS / Linux / GitHub Actions
- `.\render_all.ps1` — Windows PowerShell

**No R or renv is required.** The MEMELAND site uses pure Quarto only.

See [quarto-rendering.instructions.md](.github/instructions/quarto-rendering.instructions.md).

## Multilingual Structure

Most pages exist in five language variants:

- **Container file**: `About/about.qmd` — do not write content here; it only includes per-language files
- **Per-language files**: `About/_about-en.qmd`, `About/_about-de.qmd`, `About/_about-fr.qmd`, `About/_about-cs.qmd`, `About/_about-no.qmd`

News posts (`Activities/news/`) are **English only** — no per-language variants needed.

## Content Areas and File Paths

| Area | Source files | Output URL prefix |
|------|-------------|-------------------|
| Home | `index.qmd` + `_index-<lang>.qmd` | `/<lang>/` |
| About | `About/about.qmd` + `About/_about-<lang>.qmd` | `/<lang>/About/` |
| Team | `Team/<team>.qmd` + `Team/_<team>-<lang>.qmd` | `/<lang>/Team/` |
| Activities / News | `Activities/activities.qmd` + `Activities/news/*.qmd` | `/<lang>/Activities/` |
| Outputs | `Outputs/outputs.qmd` + `Outputs/_outputs-<lang>.qmd` | `/<lang>/Outputs/` |
| Join Us | `JoinUs/join_us.qmd` + `JoinUs/_join_us-<lang>.qmd` | `/<lang>/JoinUs/` |

## Issue Templates

| File | Purpose |
|------|---------|
| `01_news_post.yml` | New activity or news post (primary template) |
| `02_update_content.yml` | Edit existing page content |
| `03_media_request.yml` | Add, replace, or remove an image |
| `04_language_correction.yml` | Fix typo, grammar, or translation error |
| `05_website_bug.yml` | Report broken pages or links |
| `06_new_output.yml` | Add a publication, dataset, presentation, report, or thesis |

## Agent Workflow (Issue → PR)

When assigned an issue, follow this sequence:

1. **Validate** — Check all required fields are present and not placeholder text.
   If anything is missing, post exactly one friendly comment tagging the issue author.
   If blocked by an unexpected problem, tag @OndrejMottl.

2. **Branch** — Create `issue[N]-short-description` from `main`. Never work on `main` directly.

3. **Implement** — Write/edit `.qmd` files following the relevant instruction files.

4. **Preview render** — Render the affected profiles into `_preview/` to check the result. Commit source files only, never `docs/`.

5. **Review** — Invoke the `change-reviewer` subagent. Fix any flagged items before continuing.

6. **Open PR** — Create a PR (ready for review) with summary, changes list, and `- close #[N]`. Assign @OndrejMottl as reviewer.

> **The agent must NEVER merge a PR.**

## Instruction Files

| Task | Instruction file |
|------|-----------------|
| News / activity posts | [activities.instructions.md](.github/instructions/activities.instructions.md) |
| Outputs page | [outputs.instructions.md](.github/instructions/outputs.instructions.md) |
| Any `.qmd` file | [quarto-writing.instructions.md](.github/instructions/quarto-writing.instructions.md) |
| Preview rendering (and why `docs/` is never committed) | [quarto-rendering.instructions.md](.github/instructions/quarto-rendering.instructions.md) |
| Branch / PR / Git workflow | [github-workflow.instructions.md](.github/instructions/github-workflow.instructions.md) |
| Reviewing changes | [review.instructions.md](.github/instructions/review.instructions.md) |

## Custom Agents

| Agent | Purpose |
|-------|---------|
| `website-maintainer` | Orchestrates the full issue → PR workflow |
| `change-reviewer` | Validates changes before a PR is opened |
