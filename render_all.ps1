$ErrorActionPreference = "Stop"

# Local preview of the full multilingual site.
#
# Renders all five languages into _preview/ (git-ignored), NOT into docs/.
# docs/ is the published site and is generated only by the
# "Re-render site after merge" workflow after a PR is merged into main.
# Never commit docs/ or _preview/.

# --- Quarto version check ---
$requiredVersion = (Get-Content 'QUARTO_VERSION' -Raw).Trim()
$installedVersion = (quarto --version 2>$null) | Select-Object -First 1
if (-not $installedVersion) { $installedVersion = 'not-found' }

if ($installedVersion.Trim() -ne $requiredVersion) {
    Write-Error @"
Quarto version mismatch.
  Required : $requiredVersion  (declared in QUARTO_VERSION)
  Installed: $installedVersion

Install the correct version: https://github.com/quarto-dev/quarto-cli/releases/tag/v$requiredVersion
"@
    exit 1
}

Write-Host "Quarto $installedVersion -- OK"

$profiles = [ordered]@{
    english   = "en"
    german    = "de"
    french    = "fr"
    czech     = "cs"
    norwegian = "no"
}

foreach ($profileName in $profiles.Keys) {
    $outDir = "_preview/$($profiles[$profileName])"
    Write-Host "Rendering $profileName -> $outDir"
    # Quarto writes progress to stderr; in Windows PowerShell 5.1 that becomes
    # an error record when output is redirected, so judge success by exit code.
    $ErrorActionPreference = "Continue"
    quarto render --profile $profileName --output-dir $outDir
    $ErrorActionPreference = "Stop"
    if ($LASTEXITCODE -ne 0) {
        throw "Quarto render failed for profile '$profileName'."
    }
}

$redirectHtml = @"
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
"@

[System.IO.File]::WriteAllText(
  (Join-Path (Get-Location) "_preview/index.html"),
  $redirectHtml,
  [System.Text.UTF8Encoding]::new($false)
)

Write-Host ""
Write-Host "Preview ready in _preview/. To browse it with working search and listings:"
Write-Host "  python -m http.server 8000 -d _preview   (then open http://localhost:8000)"
