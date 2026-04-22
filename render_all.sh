#!/bin/bash

# Render the MEMELAND site in English
quarto render --profile english

# Render the MEMELAND site in German
quarto render --profile german

# Render the MEMELAND site in French
quarto render --profile french

# Render the MEMELAND site in Czech
quarto render --profile czech

# Render the MEMELAND site in Norwegian
quarto render --profile norwegian

# Create root redirect to English version
cat <<EOF > docs/index.html
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
