# Quarto Rendering Instructions

Use this file when rendering the MEMELAND website or committing the `docs/` output.

## Render command

The MEMELAND site must be rendered for **all five language profiles**. From the repository root:

```bash
quarto render --profile english
quarto render --profile german
quarto render --profile french
quarto render --profile czech
quarto render --profile norwegian
```

Or use the convenience scripts (from the repo root):

```bash
bash render_all.sh        # macOS / Linux / GitHub Actions
.\render_all.ps1          # Windows PowerShell
```

## After rendering — root redirect

After all five profiles complete, ensure `docs/index.html` exists as a redirect:

```bash
cat <<'EOF' > docs/index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="refresh" content="0; url=en/index.html" />
    <link rel="canonical" href="https://memeland-erc.github.io/en/index.html" />
    <title>Redirecting to English version...</title>
  </head>
  <body>
    <p>If you are not redirected automatically, <a href="en/index.html">click here</a>.</p>
  </body>
</html>
EOF
```

This redirect is created automatically by `render_all.sh` and `render_all.ps1`.

## Output directories

| Profile | Output directory |
|---------|-----------------|
| english | `docs/en/` |
| german | `docs/de/` |
| french | `docs/fr/` |
| czech | `docs/cs/` |
| norwegian | `docs/no/` |

The root `docs/index.html` redirect is generated after all profiles are rendered.

## Committing docs/

**ALL `docs/` changes must be committed** alongside source `.qmd` changes in the same branch and PR.

```bash
git add .
git commit -m "Add news post: Iceland coring 2026; render docs"
```

## No R or renv required

The MEMELAND site uses **no R code**. No R installation or `renv::restore()` is needed. Pure Quarto only.

## Environment setup (CI / sandbox)

```bash
# Install Quarto (latest)
wget -q https://quarto.org/download/latest/quarto-linux-amd64.deb
sudo dpkg -i quarto-linux-amd64.deb
quarto --version

# Render all profiles
quarto render --profile english
quarto render --profile german
quarto render --profile french
quarto render --profile czech
quarto render --profile norwegian
```

## Fallback if render fails

If `quarto render` fails for any profile:

1. Commit the source `.qmd` changes only (no `docs/` changes)
2. Note the failure in the PR description
3. Tag @OndrejMottl in the PR
4. Do NOT merge

## What to never do

- Do NOT edit files in `docs/` manually
- Do NOT commit `docs/` without re-rendering all five profiles
- Do NOT skip the `docs/index.html` redirect
- Do NOT use `quarto render` without `--profile` (it renders only the default profile)
