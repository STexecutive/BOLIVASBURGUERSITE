# Publica o site: carimba a versao dos arquivos, faz commit e envia para o ar.
# Uso: .\publica.ps1 "Mensagem do commit"
#
# O carimbo (?v=...) e o hash do proprio arquivo. Se o CSS mudou, a URL muda e
# o celular baixa a versao nova na hora. Se nao mudou, a URL continua igual e o
# navegador reaproveita o que ja tem (site continua rapido).

param(
    [string]$mensagem = "Update: alteracoes no site"
)

$ErrorActionPreference = "Stop"
$raiz = $PSScriptRoot

function Get-HashCurto($caminho) {
    if (-not (Test-Path $caminho)) { return $null }
    return (Get-FileHash $caminho -Algorithm MD5).Hash.Substring(0, 10).ToLower()
}

Write-Host "Carimbando versao dos arquivos..." -ForegroundColor Yellow

$hashCss = Get-HashCurto (Join-Path $raiz "assets\css\style.css")
$hashJs  = Get-HashCurto (Join-Path $raiz "assets\js\main.js")

Write-Host "  style.css -> $hashCss"
Write-Host "  main.js   -> $hashJs"

$paginas = Get-ChildItem -Path $raiz -Filter "*.html" -File
foreach ($pagina in $paginas) {
    $texto = Get-Content $pagina.FullName -Raw -Encoding UTF8
    $original = $texto

    if ($hashCss) {
        $texto = [regex]::Replace($texto, '(/assets/css/style\.css)(\?v=[^"'']*)?', "`$1?v=$hashCss")
    }
    if ($hashJs) {
        $texto = [regex]::Replace($texto, '(/assets/js/main\.js)(\?v=[^"'']*)?', "`$1?v=$hashJs")
    }

    if ($texto -ne $original) {
        # -NoNewline evita acrescentar uma linha em branco a cada publicacao
        [System.IO.File]::WriteAllText($pagina.FullName, $texto, (New-Object System.Text.UTF8Encoding($false)))
        Write-Host "  atualizado: $($pagina.Name)" -ForegroundColor Green
    }
}

Write-Host "`nEnviando para o GitHub..." -ForegroundColor Yellow

git add -A
git status --short

git commit -m $mensagem
if ($LASTEXITCODE -ne 0) {
    Write-Host "Nenhuma alteracao para publicar." -ForegroundColor Yellow
    exit 0
}

git push
if ($LASTEXITCODE -eq 0) {
    Write-Host "`nPublicado! O site atualiza em poucos segundos." -ForegroundColor Green
    Write-Host "O celular ja vai abrir a versao nova, sem limpar cache." -ForegroundColor Green
} else {
    Write-Host "`nErro ao enviar para o GitHub." -ForegroundColor Red
    exit 1
}
