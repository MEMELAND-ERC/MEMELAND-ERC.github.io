# GitHub Workflow Instructions

Use this file for all branch, commit, pull request, and Git operations on the MEMELAND website.

## Copilot Cloud-Agent Exception

When these instructions run inside GitHub Copilot cloud agent, GitHub has already provisioned a `copilot/` branch and draft PR. In that environment:

- Work only on the current managed branch; do not create or switch branches.
- Do not run `git commit`, `git push`, or create another PR. GitHub's managed finalizer performs those operations after the session.
- Before finishing an implementation, verify `git status --short` and the staged/unstaged diff contain the intended files. An empty diff is not a completed implementation.
- Keep the PR in draft. Copilot cannot mark its own PR ready for review; @OndrejMottl does that after reviewing the result.

The manual commands below are for human/local workflows only.

## Manual Human/Local Workflow

The remaining branch, commit, and PR commands in this file are for maintainers working locally. They do not override the Copilot cloud-agent exception above.

### Branching

Always branch from `main`. Never commit directly to `main`.

```bash
git checkout main
git pull origin main
git checkout -b issue[N]-short-description
```

Replace `[N]` with the issue number and `short-description` with 2–4 words in kebab-case
(e.g. `issue7-add-iceland-coring`, `issue12-fix-oxford-link`).

### Commit messages

Use short, descriptive commit messages:

```
Add news post: UiT coring campaign Iceland 2026
Update About page: English section
Fix broken link on Team/people page
```

### Pull request format

Open the PR as a **draft** first. The PR description must contain:

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

### PR workflow

1. Open the PR as a **draft**
2. Invoke the `change-reviewer` subagent
3. Fix any flagged issues
4. Mark the PR as **ready for review** only after the reviewer passes
5. Assign @OndrejMottl as reviewer

### Merge policy

- Squash-merge only (maintainer's responsibility)
- **The agent must NEVER merge a PR**
- Delete the branch after merge

## Generated output (`docs/`, `_preview/`)

PRs contain **source changes only**. `docs/` is rendered and committed by the `Re-render site after merge` workflow after every merge into `main`; `_preview/` is a local, git-ignored preview folder. Neither may appear in a PR.

If a branch contains `docs/` changes (for example from an older branch, or after a render without `--output-dir`), restore `docs/` from `main`. In a Copilot cloud-agent session, run only the `git checkout` line and leave the commit to the managed finalizer. Locally, also commit:

```bash
git fetch origin main
git checkout origin/main -- docs/
git commit -m "Remove generated docs/ from PR"
```

Because PRs no longer touch `docs/`, `docs/` merge conflicts should not occur. If one appears during a rebase, resolve it the same way: take `main`'s `docs/`.

Do not put `[no-render]` in the merge commit of a content change; it stops the re-render workflow, so the site would not be updated.

## PR iteration (after review comments, human/local)

1. Rebase onto main: `git rebase main`
2. For `docs/` conflicts, take `main`'s version (see "Generated output" above)
3. Apply requested fixes + preview render into `_preview/`
4. Force-push: `git push --force-with-lease`
5. Re-invoke `change-reviewer`
6. Re-request review from @OndrejMottl

In a Copilot cloud-agent session, follow Step G of [website-maintainer.agent.md](.github/agents/website-maintainer.agent.md) instead: no commit, push, or force-push.
