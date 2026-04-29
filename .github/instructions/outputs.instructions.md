# Outputs Page — Editing Instructions

## Source files

The Outputs page is multilingual. Always edit **all five** per-language files:

| File | Language |
|------|----------|
| `Outputs/_outputs-en.qmd` | English |
| `Outputs/_outputs-de.qmd` | German |
| `Outputs/_outputs-fr.qmd` | French |
| `Outputs/_outputs-cs.qmd` | Czech |
| `Outputs/_outputs-no.qmd` | Norwegian |

The container file `Outputs/outputs.qmd` must **not** be edited by hand.

## Section names

Each per-language file contains five sections (in order):

1. `## Publications`
2. `## Datasets`
3. `## Presentations & Posters`
4. `## Reports & Deliverables`
5. `## Theses`

Match the issue's `Type of output` dropdown to the correct section.

## Entry order

Always insert new entries **at the top of the section** (newest first).
If the section currently shows only the `*No … yet.*` placeholder, replace that line with the new entry.

## Shields.io badge colours

Use static shields.io badge URLs with the MEMELAND brand hex colours (no R needed):

| Badge type | Colour | Hex |
|---|---|---|
| DOI | brown | `896a2b` |
| PDF / Slides / Poster | green | `8a9a5b` |
| Data | grey | `6a757d` |

Badge URL pattern:
```
[![LABEL](https://img.shields.io/badge/LABEL-TEXT-HEX?style=flat-square)](URL)
```

Spaces in the text must be replaced with `_`. Forward slashes `/` in DOI strings must be encoded as `%2F`.

## Entry formats

DOI is **required** for publications and datasets. Use a badge for every link provided.

### Publication

```markdown
**Author A, Author B** (YYYY).
Title of the paper.
*Journal Name*, volume(issue), pages.
[![DOI](https://img.shields.io/badge/DOI-10.xxxx%2Fxxxxx-896a2b?style=flat-square)](https://doi.org/10.xxxx/xxxxx) [![PDF](https://img.shields.io/badge/PDF-download-8a9a5b?style=flat-square)](link) [![Data](https://img.shields.io/badge/Data-repository-6a757d?style=flat-square)](link)
```

Omit the `PDF` and/or `Data` badges if those links were not provided.

### Dataset

```markdown
**Author A, Author B** (YYYY).
*Dataset title* [Data set].
Repository Name.
[![DOI](https://img.shields.io/badge/DOI-10.xxxx%2Fxxxxx-896a2b?style=flat-square)](https://doi.org/10.xxxx/xxxxx)
```

### Presentation or Poster

```markdown
**Author A** (YYYY, Month). *Presentation title*.
Conference Name, City, Country.
[![Slides](https://img.shields.io/badge/Slides-download-8a9a5b?style=flat-square)](link) [![Poster](https://img.shields.io/badge/Poster-download-8a9a5b?style=flat-square)](link)
```

Omit whichever badges were not provided. If a DOI was provided, add it as the first badge.

### Report or Deliverable

```markdown
**Deliverable D1.1** — *Title of deliverable* (YYYY, Month).
[![PDF](https://img.shields.io/badge/PDF-download-8a9a5b?style=flat-square)](link)
```

If no deliverable number was given, use:

```markdown
**Author A** (YYYY). *Report title*.
[![PDF](https://img.shields.io/badge/PDF-download-8a9a5b?style=flat-square)](link)
```

### Thesis

```markdown
**Student Name** (YYYY). *Thesis title*.
[PhD / MSc] thesis, University Name.
[![Link](https://img.shields.io/badge/Link-repository-896a2b?style=flat-square)](link)
```

## Translation

The Outputs page is listed in all five language versions, but entry content (author names, titles, links) is identical across languages — do not translate bibliographic data.
You may translate section headings or surrounding prose if the per-language file uses translated headings; otherwise copy the entry identically into all five files.

## Do not

- Do not edit `Outputs/outputs.qmd` — it is only a language-profile switcher.
- Do not reorder existing entries (newest-first order is maintained by placement).
- Do not add `categories:` frontmatter to `outputs.qmd` — it has none.
