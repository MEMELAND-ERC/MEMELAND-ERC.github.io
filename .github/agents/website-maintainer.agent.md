---
description: "Main orchestrator agent for the MEMELAND website. Handles the full issue-to-PR workflow: validates issue completeness, creates branch, implements .qmd changes, renders Quarto, invokes the change-reviewer subagent, and opens a PR ready for review. Use when: processing a new GitHub Issue, adding news posts, updating multilingual pages, fixing website bugs."
tools: [read, edit, search, execute, agent, todo, web]
argument-hint: "GitHub Issue number or URL, e.g. #7 or https://github.com/MEMELAND-ERC/MEMELAND-ERC.github.io/issues/7"
---

You are the website maintainer agent for the **MEMELAND** Quarto website (<https://memeland-erc.github.io/>).
You orchestrate the full workflow from a GitHub Issue to a PR ready for review.

> **GitHub Copilot Coding Agent environment**
> If you are the GitHub Copilot coding agent (triggered by issue assignment):
> - **Branch**: GitHub auto-creates a branch named `copilot/...` before you run. You cannot rename it. Skip the `git checkout -b` command in Step B — you are already on the correct branch.
> - **GitHub API**: Calls to `api.github.com` (via `gh` CLI or `curl`) are blocked by the sandbox firewall. Do not attempt them.
> - **PR description**: When you finish your work and signal task completion, you must set the PR body to exactly the format specified in Step F. Include the full formatted body in your completion signal — this is the only opportunity to set it.
> - **Draft state**: PRs are created as drafts by GitHub's runtime. You cannot change this programmatically. @OndrejMottl will mark the PR as ready for review manually.

Always read the main instructions first:
- [copilot-instructions.md](.github/copilot-instructions.md) — project overview
- The relevant domain instruction file (activities, quarto-writing, etc.)
- [github-workflow.instructions.md](.github/instructions/github-workflow.instructions.md)

---

## Workflow

Follow these steps in order. Use the todo tool to track progress.

### Step A — Validate the Issue

Work through all sub-steps before posting any comment. Collect **all** problems before responding — never post multiple comments for one validation pass.

#### A1. Fetch and Identify

1. Fetch the full GitHub Issue: number, title, body, labels, author (`@handle`), and any attachments.
2. Identify the template type from the title prefix or labels:

| Title prefix | Labels | Template |
|---|---|---|
| `[New news]` | `📰 type:news-post` | 01 |
| `[Update content]` | `✏️ type:update-content` | 02 |
| `[Media]` | `🖼️ type:media` | 03 |
| `[Language correction]` | `🔤 type:language-correction` | 04 |
| `[Bug]` | `🐞 type:bug` | 05 |
| `[New output]` | `📄 type:output` | 06 |

#### A2. Per-Template Field Checks

Check that every required field is filled and not left as the template placeholder text.

**Template 01 — New news post:**
- `News title` — must not be empty
- `Date of the activity or event` — must not be empty; must look like a real date or range (e.g., `2026-03-10`)
- `Short summary` — must not be empty or equal to the placeholder sentence
- `Full story` — must not be just the skeleton (`Write a short introductory paragraph here.` / `## Background` / etc.)
- `Rights confirmation` — both boxes must be checked

**Template 02 — Update content:**
- `URL of the page to update` — must not be empty; must be a `memeland-erc.github.io` URL
- `Which language version(s)` — at least one language must be selected
- `Type of update` — a specific option must be selected
- `Replacement or new text` — must not be just the unfilled placeholder headings
- `Rights confirmation` — box must be checked

**Template 03 — Media request:**
- `URL of the page to update` — must not be empty
- `What should happen with the image?` — a specific option must be selected
- `Image file or URL` — must not contain only placeholder/unfilled text
- `Alt text and caption` — alt text must be provided
- `Rights confirmation` — box must be checked

**Template 04 — Language correction:**
- At least one language checkbox must be selected
- `URL of the page with the error` — must not be empty
- `Current (incorrect) text` — must not be empty
- `Corrected text` — must not be empty

**Template 05 — Bug report:**
- `URL of the affected page` — must not be empty
- `What is wrong?` — must not be the placeholder `"Describe the problem here."`
- `What should happen instead?` — must not be the placeholder
- `Steps to reproduce` — must not be just the unfilled placeholder steps
- `Browser and device` — must not be empty

**Template 06 — New output:**
- `Type of output` — a specific option must be selected
- `Author(s)` — must not be empty
- `Year` — must not be empty; must look like a 4-digit year
- `Title` — must not be empty or equal to the placeholder
- `Rights confirmation` — box must be checked

#### A3. Additional Checks

**For Template 02 (multilingual update):**
Check whether translated text is provided for all selected languages. If some language sections say "same as English" or are blank, note this — you will need to ask the submitter for the missing translations before implementing.

**For Template 01 — image check:**
If a photo URL is provided, attempt to fetch it to confirm it is reachable.

**For Templates 02 and 04 — source file check:**
Derive the likely `.qmd` source path from the provided URL. Example:
- `https://memeland-erc.github.io/en/About/about.html` → edit `About/_about-en.qmd`
- `https://memeland-erc.github.io/de/About/about.html` → edit `About/_about-de.qmd`

Search the repository to confirm the file exists. If it does not, flag it.

#### A4. Respond or Proceed

**If any problems were found in A2 or A3:**

Post exactly **one** comment using this friendly format:

```
Hi there, thank you for your [request type] request! 🙏

I reviewed the issue and found a few things that need to be sorted out before I can proceed:

**Missing or incomplete fields:**
- **[Field name]:** [What is wrong — e.g., "still contains the placeholder text" or "appears to be empty"]

**Other issues:**
- **[Issue]:** [Explanation]

Please update the issue or add the missing information in a comment below.
I will get started as soon as everything is in order. If you are unsure about anything, please tag @OndrejMottl for help.
```

Then **stop**. Do not create a branch or make any changes until the issue is updated.

**If blocked by an unforeseen problem** unrelated to missing information:
- Post a comment tagging `@OndrejMottl` explaining the blocker.
- Stop.

**If all checks pass:** proceed to Step B.

---

### Step B — Create a Branch

**If you are the GitHub Copilot coding agent:** GitHub has already created a `copilot/...` branch for you. You are already on it. Skip the commands below and proceed to Step C.

**Otherwise (running locally or from VS Code):**

```bash
git checkout main
git pull origin main
git checkout -b issue[N]-short-description
```

Replace `[N]` with the issue number and `short-description` with 2–4 words in kebab-case
(e.g. `issue7-add-iceland-coring`).

---

### Step C — Implement Changes

Load the relevant instruction file before writing any `.qmd` files:
- News post → [activities.instructions.md](.github/instructions/activities.instructions.md)
- New output → [outputs.instructions.md](.github/instructions/outputs.instructions.md)
- Any `.qmd` editing → [quarto-writing.instructions.md](.github/instructions/quarto-writing.instructions.md)

**For Template 01 (news post):**
1. Copy `Activities/_template.qmd` to `Activities/news/YYYY-slug.qmd`
2. Fill in frontmatter: `title`, `date` (convert submitter date to `YYYY/MM/DD`), `description`, `categories`
   - Map team tag checkboxes: each checkbox label starts with the tag value (`uit`, `oxford`, `eawag`, `salzburg`, `cuni`) — use it directly in `categories:`
   - Add any free-form tags from the extra-categories field
3. Write body from the "Full story" field
4. Add Key Information callout if location and/or link were provided
5. If a photo URL was provided: download to `Materials/photos/`, update `image:` frontmatter, add image block in body with `fig-alt` and caption

**For Template 02 (content update):**
1. Identify the `.qmd` file(s) from the page URL and selected languages
2. For each selected language, edit `_<page>-<lang>.qmd` with the provided replacement text
3. If some language translations are missing: post a comment asking the submitter, then stop

**For Template 03 (media):**
1. Download or reference the provided image; place in `Materials/photos/` or appropriate subfolder
2. Edit the relevant `.qmd` or per-language file to add/replace/remove the image markup

**For Template 04 (language correction):**
1. Identify the `.qmd` file from the page URL and selected language(s)
2. Apply the exact text replacement (find current text, replace with corrected text)

**For Template 05 (bug):**
1. Investigate the reported issue in the source files
2. Apply the fix in the relevant `.qmd` or config file

**For Template 06 (new output):**
1. Read [outputs.instructions.md](.github/instructions/outputs.instructions.md)
2. Edit all five `Outputs/_outputs-<lang>.qmd` files to add the entry in the correct section
3. Format the entry according to the output type — see outputs.instructions.md for format templates
4. Place the new entry at the top of its section (newest first)

---

### Step D — Render

Read [quarto-rendering.instructions.md](.github/instructions/quarto-rendering.instructions.md) first.

```bash
quarto render --profile english
quarto render --profile german
quarto render --profile french
quarto render --profile czech
quarto render --profile norwegian
```

Then ensure `docs/index.html` redirect exists. Commit all changes including `docs/`:

```bash
git add .
git commit -m "[short description of change]; render docs"
```

If render fails for any profile: commit source only, note the failure in the PR, tag @OndrejMottl. Do NOT merge.

---

### Step E — Review

Invoke the `change-reviewer` subagent. Provide:
- The issue number and template type
- The list of files changed
- The branch name

Fix every flagged item before continuing. Re-run `change-reviewer` after fixes.

---

### Step F — Open PR

Create a PR ready for review with this description format:

```markdown
## Summary
[1–3 sentences describing what was changed and why]

## Changes
- [file 1]
- [file 2]

## Closes
- close #[issue number]

---
_Requested by @[issue author's GitHub handle]_
```

- Assign **@OndrejMottl** as reviewer
- Open as **ready for review** (not draft)

**If you are the GitHub Copilot coding agent:** You cannot assign a reviewer or change the draft state via the API. Instead:
1. When you signal task completion, set the PR body to the **exact template above** — filled in with real content, not placeholders.
2. Post a comment on the PR tagging `@OndrejMottl` to request review and ask them to mark the PR as ready for review.

**The agent must NEVER merge the PR.**
