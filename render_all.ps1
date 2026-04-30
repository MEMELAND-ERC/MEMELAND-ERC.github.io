$ErrorActionPreference = "Stop"

# --- Quarto version check ---
$requiredVersion = (Get-Content 'QUARTO_VERSION' -Raw).Trim()
$installedVersion = (quarto --version 2>$null) | Select-Object -First 1
if (-not $installedVersion) { $installedVersion = 'not-found' }

if ($installedVersion -ne $requiredVersion) {
    Write-Error @"
Quarto version mismatch.
  Required : $requiredVersion  (declared in QUARTO_VERSION)
  Installed: $installedVersion

Install the correct version: https://quarto.org/docs/download/
"@
    exit 1
}

Write-Host "Quarto $installedVersion -- OK"

$profiles = @(
    "english",
    "german",
    "french",
    "czech",
    "norwegian"
)

foreach ($profile in $profiles) {
    quarto render --profile $profile
    if ($LASTEXITCODE -ne 0) {
        throw "Quarto render failed for profile '$profile'."
    }
}

$redirectHtml = @"
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
"@

[System.IO.File]::WriteAllText(
  "docs/index.html",
  $redirectHtml,
  [System.Text.UTF8Encoding]::new($false)
)