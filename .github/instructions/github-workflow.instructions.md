# GitHub Workflow Instructions

Use this file for all branch, commit, pull request, and Git operations on the MEMELAND website.

## Branching

Always branch from `main`. Never commit directly to `main`.

```bash
git checkout main
git pull origin main
git checkout -b issue[N]-short-description
```

Replace `[N]` with the issue number and `short-description` with 2–4 words in kebab-case
(e.g. `issue7-add-iceland-coring`, `issue12-fix-oxford-link`).

## Commit messages

Use short, descriptive commit messages:

```
Add news post: UiT coring campaign Iceland 2026
Update About page: English section
Fix broken link on Team/people page
```

## Pull request format

Open the PR as **ready for review**. The PR description must contain:

```markdown
## Summary
[1–3 sentences describing what was changed and why]

## Changes
- [List of files added or modified]

## Closes
- close #[issue number]

---
_Requested by @[issue author's GitHub handle]_
```

**Always assign @OndrejMottl as reviewer.**

## PR workflow

1. Invoke the `change-reviewer` subagent
2. Fix any flagged issues
3. Open the PR as **ready for review**
4. Assign @OndrejMottl as reviewer

## Merge policy

- Squash-merge only (maintainer's responsibility)
- **The agent must NEVER merge a PR**
- Delete the branch after merge

## Generated output (`docs/`, `_preview/`)

PRs contain **source changes only**. `docs/` is rendered and committed by the `Re-render site after merge` workflow after every merge into `main`; `_preview/` is a local, git-ignored preview folder. Neither may appear in a PR.

If a branch contains `docs/` changes (for example from an older branch, or after a render without `--output-dir`), restore `docs/` from `main` and commit:

```bash
git fetch origin main
git checkout origin/main -- docs/
git commit -m "Remove generated docs/ from PR"
```

Because PRs no longer touch `docs/`, `docs/` merge conflicts should not occur. If one appears during a rebase, resolve it the same way: take `main`'s `docs/`.

Do not put `[no-render]` in the merge commit of a content change; it stops the re-render workflow, so the site would not be updated.

## PR iteration (after review comments)

1. Rebase onto main: `git rebase main`
2. For `docs/` conflicts, take `main`'s version (see "Generated output" above)
3. Apply requested fixes + preview render into `_preview/`
4. Force-push: `git push --force-with-lease`
5. Re-invoke `change-reviewer`
6. Re-request review from @OndrejMottl
