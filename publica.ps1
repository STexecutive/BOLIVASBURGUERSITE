# Script para publicar alterações no site
# Uso: .\publica.ps1 "Mensagem do commit"

param(
    [string]$mensagem = "Update: alterações no site"
)

# Cores
$verde = "Green"
$amarelo = "Yellow"
$vermelho = "Red"

Write-Host "🚀 Publicando site..." -ForegroundColor $verde

# 1. Verificar status
Write-Host "`n📋 Status atual:" -ForegroundColor $amarelo
git status --short

# 2. Adicionar todas as mudanças
Write-Host "`n📦 Adicionando arquivos..." -ForegroundColor $amarelo
git add -A

# 3. Verificar o que vai ser commitado
Write-Host "`n✅ Alterações a serem commitadas:" -ForegroundColor $amarelo
git status --short

# 4. Fazer o commit
Write-Host "`n💾 Fazendo commit: '$mensagem'" -ForegroundColor $amarelo
git commit -m $mensagem

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Nenhuma alteração para fazer commit" -ForegroundColor $amarelo
    exit
}

# 5. Fazer o push
Write-Host "`n📤 Enviando para GitHub..." -ForegroundColor $amarelo
git push

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Site publicado com sucesso!" -ForegroundColor $verde
    Write-Host "⏳ A Hostinger vai atualizar em alguns minutos..." -ForegroundColor $amarelo
} else {
    Write-Host "`n❌ Erro ao enviar para GitHub!" -ForegroundColor $vermelho
}
