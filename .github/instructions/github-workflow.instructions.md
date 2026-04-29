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

## docs/ merge conflicts

Conflicts in the `docs/` folder are expected and harmless — the site is fully re-rendered after every merge to `main`.

When a PR or rebase produces conflicts in `docs/`, **always prefer the branch's version** (i.e. keep the newly rendered output):

```bash
# During a rebase or merge conflict
git checkout --ours docs/
git add docs/
```

> `--ours` keeps the current branch's files when rebasing onto main.
> If using `git merge` instead of `git rebase`, swap `--ours` / `--theirs` accordingly — always keep the branch's rendered output.

Note this in the PR description if it applied, e.g.:

> _`docs/` conflicts resolved in favour of this branch; site will be re-rendered on merge._

## PR iteration (after review comments)

1. Rebase onto main: `git rebase main`
2. For `docs/` conflicts, resolve with: `git checkout --ours docs/` (see "docs/ merge conflicts" above)
3. Apply requested fixes + re-render
4. Force-push: `git push --force-with-lease`
5. Re-invoke `change-reviewer`
6. Re-request review from @OndrejMottl
