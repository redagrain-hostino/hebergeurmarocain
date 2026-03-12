
# Script: download-images.ps1
# Downloads all hebergeurmarocain.com/wp-content/uploads images used in .astro files
# Saves them to public/images/ and replaces all URLs in source files.

$srcDir    = "c:\devprojects\hebergeurmarocain\src"
$publicDir = "c:\devprojects\hebergeurmarocain\public\images"

if (-not (Test-Path $publicDir)) { New-Item -ItemType Directory -Path $publicDir | Out-Null }

# 1. Collect all unique upload URLs
$allUrls = [System.Collections.Generic.HashSet[string]]::new()
Get-ChildItem -Path $srcDir -Recurse -Filter "*.astro" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $pattern = 'https://hebergeurmarocain\.com/wp-content/uploads/\d{4}/\d{2}/[^"'' \r\n\t\)\`]+'
    [regex]::Matches($content, $pattern) | ForEach-Object { [void]$allUrls.Add($_.Value) }
}

Write-Host "Found $($allUrls.Count) unique image URLs."

# 2. Download each image and build a map URL -> /images/filename
$urlMap = @{}
foreach ($url in $allUrls) {
    $filename = ($url -split '/')[-1]
    # Strip query strings
    $filename = $filename -replace '\?.*', ''
    $destPath = Join-Path $publicDir $filename

    if (-not (Test-Path $destPath)) {
        try {
            Invoke-WebRequest -Uri $url -OutFile $destPath -UseBasicParsing -TimeoutSec 30 -ErrorAction Stop
            Write-Host "Downloaded: $filename"
        } catch {
            Write-Host "FAILED: $url - $_"
        }
    } else {
        Write-Host "Already exists: $filename"
    }
    $urlMap[$url] = "/images/$filename"
}

# 3. Replace all URLs in .astro files
Get-ChildItem -Path $srcDir -Recurse -Filter "*.astro" | ForEach-Object {
    $file = $_
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $original = $content
    foreach ($url in $urlMap.Keys) {
        $content = $content.Replace($url, $urlMap[$url])
    }
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host "Updated: $($file.Name)"
    }
}

Write-Host "`nDone. All images saved to public/images/ and URLs replaced."
