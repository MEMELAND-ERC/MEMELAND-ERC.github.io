# Quarto Rendering Instructions

Use this file when rendering the MEMELAND website.

## Who builds `docs/`

`docs/` is the published website (GitHub Pages serves it from `main`). It is generated **only** by the `Re-render site after merge` workflow (`.github/workflows/rerender-on-merge.yml`), which renders all five languages after every merge into `main` and commits the result.

**Pull requests change source files only. Never commit `docs/`.**

You still render locally (or in the agent sandbox) to check that your change builds and looks right, but into the git-ignored `_preview/` folder, never into `docs/`.

## Pinned Quarto version

The Quarto version is declared in `QUARTO_VERSION` at the repository root. The re-render workflow installs exactly this version, so use the same one for previews:

```bash
cat QUARTO_VERSION   # e.g. 1.11.9
quarto --version     # should match
```

**Linux / GitHub Actions sandbox (install the pinned version):**

```bash
REQUIRED=$(tr -d '[:space:]' < QUARTO_VERSION)
INSTALLED=$(quarto --version 2>/dev/null || echo "none")
if [ "$INSTALLED" != "$REQUIRED" ]; then
  wget -q "https://github.com/quarto-dev/quarto-cli/releases/download/v${REQUIRED}/quarto-${REQUIRED}-linux-amd64.deb"
  sudo dpkg -i "quarto-${REQUIRED}-linux-amd64.deb"
fi
quarto --version
```

**macOS / Windows:** download the installer for the pinned version from <https://github.com/quarto-dev/quarto-cli/releases>.

To upgrade Quarto for the whole project, change `QUARTO_VERSION` in its own PR; the next merge re-renders the site with the new version.

## Preview render

Render each language profile you need into `_preview/<lang>/` with `--output-dir`:

```bash
quarto render --profile english   --output-dir _preview/en
quarto render --profile german    --output-dir _preview/de
quarto render --profile french    --output-dir _preview/fr
quarto render --profile czech     --output-dir _preview/cs
quarto render --profile norwegian --output-dir _preview/no
```

Or render all five at once with the convenience scripts (from the repo root):

```bash
bash render_all.sh        # macOS / Linux / Git Bash / sandbox
.\render_all.ps1          # Windows PowerShell
```

Which profiles to render:

- **News posts** (`Activities/news/`, English only): `english` is enough.
- **Multilingual pages** (About, Team, Outputs, JoinUs, Home): every language you changed.
- **Config or style changes** (`_quarto*.yml`, `*.scss`): all five.

To browse the preview with working search and listings:

```bash
python -m http.server 8000 -d _preview   # then open http://localhost:8000/en/
```

| Profile | Preview directory | Published directory (CI only) |
|---------|-------------------|-------------------------------|
| english | `_preview/en/` | `docs/en/` |
| german | `_preview/de/` | `docs/de/` |
| french | `_preview/fr/` | `docs/fr/` |
| czech | `_preview/cs/` | `docs/cs/` |
| norwegian | `_preview/no/` | `docs/no/` |

## If a render fails

1. Fix the cause if it is in your change, and render again.
2. If it is not fixable from your change (environment, Quarto bug), commit the source changes anyway, describe the failure in the PR, and tag @OndrejMottl. Do NOT merge.

## What to never do

- Do NOT commit `docs/` or `_preview/`. If `git status` shows changes in `docs/`, discard them: `git checkout origin/main -- docs/`
- Do NOT render without `--output-dir _preview/<lang>`: plain `quarto render --profile <name>` writes into `docs/`
- Do NOT edit files in `docs/` manually
- Do NOT use `quarto render` without `--profile` (it renders only the default profile)
- Do NOT use `[no-render]` in the merge commit of a content change: it stops the site from being re-rendered

## No R or renv required

The MEMELAND site uses **no R code**. No R installation or `renv::restore()` is needed. Pure Quarto only.
