$html = (Invoke-WebRequest -Uri 'https://hebergeurmarocain.com/' -UseBasicParsing).Content
$pattern = '(?s)<style[^>]*>(.*?)</style>'
$styleMatches = [regex]::Matches($html, $pattern)
$ids = 'ade6447|aa69353|39d55cc'
foreach ($m in $styleMatches) {
    $c = $m.Groups[1].Value
    if ($c -match $ids) {
        Write-Output "=== STYLE BLOCK ==="
        Write-Output $c
    }
}
