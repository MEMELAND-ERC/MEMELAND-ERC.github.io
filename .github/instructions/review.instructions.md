# Review Instructions (change-reviewer)

Use this checklist to review all changes before marking a PR as ready for review.
Report each item as **PASS** or **FLAG**.

---

## Checklist

### 1. YAML Validity

| Check | Detail |
|-------|--------|
| Valid YAML frontmatter | No syntax errors, no unclosed quotes, no tabs |
| Required fields present | `date`, `date-format`, `date-modified`, `sidebar: false` in every `.qmd` |
| Date format correct | `YYYY/MM/DD` (forward slashes), not `YYYY-MM-DD` |
| Title quoting | Strings containing colons are wrapped in quotes |
| Category tag spellings | News post `categories:` uses correct team tags: `uit`, `oxford`, `eawag`, `salzburg`, `cuni` |

### 2. Content vs Issue

| Check | Detail |
|-------|--------|
| All required fields implemented | Every piece of content the issue requested is present |
| No placeholder text remaining | No template skeleton text such as `"Write a short introductory paragraph here."`, `"Describe the problem here."`, or similar |
| Dates, links, names match issue | Values in the file match what the submitter provided |
| Image path is real or omitted | `image:` in frontmatter points to a file that actually exists in `Materials/photos/`, or is absent |

### 3. File Paths and Links

| Check | Detail |
|-------|--------|
| News post in correct location | `Activities/news/YYYY-slug.qmd` — lowercase kebab-case, date-prefixed |
| Multilingual files all present | For multilingual page updates: all edited language files (`_<page>-en.qmd`, `_<page>-de.qmd`, etc.) are committed |
| `Activities/activities.qmd` not hand-edited | This auto-listing container must not be modified |
| External URLs plausible | URLs in the file look valid |
| Image relative paths resolve | Paths like `../../Materials/photos/...` resolve correctly from the file's location |

### 4. Instruction Compliance

| Check | Detail |
|-------|--------|
| Branch named correctly | `issue[N]-short-description` format |
| `docs/` committed | For news-only changes: `docs/en/Activities/news/` at minimum; for multilingual changes: all five `docs/<lang>/` dirs |
| `docs/index.html` redirect present | Root redirect file exists after render |
| `- close #[N]` in PR description | Issue closing reference is present |
| @OndrejMottl assigned as reviewer | PR has @OndrejMottl as reviewer |
| Agent has NOT merged the PR | Confirm the PR is still open |

### 5. Spelling and Grammar

| Check | Detail |
|-------|--------|
| No spelling errors | Check body text of new/edited content |
| Correct capitalisation | "MEMELAND", "ERC", "UiT", "Eawag", "CUNI", "Oxford", "Salzburg" |
| Consistent English | British or American English is acceptable; must be consistent within a single post |

### 6. Rendered HTML

| Check | Detail |
|-------|--------|
| HTML file exists and is non-empty | Expected output file(s) in `docs/` exist and are not empty |
| News post appears in listing | `docs/en/Activities/activities.html` contains the new post title |
| Images render | `<img>` src attributes in HTML resolve (no broken image references) |
| No Quarto error banners | No `"Error:"` or `"Warning:"` banners visible in the rendered HTML body |
| Language pages render | For multilingual updates: check that each updated language's HTML in `docs/<lang>/` contains the new text |

---

## Output format

Report results as a Markdown table:

```
| # | Category | Check | Status | Notes |
|---|----------|-------|--------|-------|
| 1 | YAML | Valid frontmatter | ✅ PASS | |
| 2 | YAML | Required fields | ✅ PASS | |
| 3 | YAML | Date format | ✅ PASS | |
...
```

End with either:

**✅ ALL CHECKS PASSED — PR is ready to mark as ready for review.**

or

**⚠️ FLAGS FOUND — fix the following before marking ready:**
- [describe each flag clearly, one per line]
