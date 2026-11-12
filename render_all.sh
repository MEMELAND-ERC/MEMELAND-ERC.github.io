#!/bin/bash
set -e

# Local preview of the full multilingual site.
#
# Renders all five languages into _preview/ (git-ignored), NOT into docs/.
# docs/ is the published site and is generated only by the
# "Re-render site after merge" workflow after a PR is merged into main.
# Never commit docs/ or _preview/.

# --- Quarto version check ---
REQUIRED_VERSION=$(tr -d '[:space:]' < QUARTO_VERSION)
INSTALLED_VERSION=$(quarto --version 2>/dev/null | tr -d '[:space:]' || echo "not-found")

if [ "$INSTALLED_VERSION" != "$REQUIRED_VERSION" ]; then
  echo "ERROR: Quarto version mismatch."
  echo "  Required : $REQUIRED_VERSION  (declared in QUARTO_VERSION)"
  echo "  Installed: ${INSTALLED_VERSION:-not-found}"
  echo ""
  echo "Install the correct version: https://github.com/quarto-dev/quarto-cli/releases/tag/v$REQUIRED_VERSION"
  exit 1
fi

echo "Quarto $INSTALLED_VERSION — OK"

for pair in english:en german:de french:fr czech:cs norwegian:no; do
  profile="${pair%%:*}"
  lang="${pair#*:}"
  echo "Rendering $profile -> _preview/$lang"
  quarto render --profile "$profile" --output-dir "_preview/$lang"
done

# Create root redirect to English version
cat <<EOF > _preview/index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="refresh" content="0; url=en/index.html" />
    <title>Redirecting to English version...</title>
  </head>
  <body>
    <p>If you are not redirected automatically, <a href="en/index.html">click here</a>.</p>
  </body>
</html>
EOF

echo ""
echo "Preview ready in _preview/. To browse it with working search and listings:"
echo "  python -m http.server 8000 -d _preview   (then open http://localhost:8000)"
