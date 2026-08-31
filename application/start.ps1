# start.ps1 — Inicia a Plataforma Acadêmica TCC no Windows
# Requer: Docker Desktop instalado e rodando

Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Plataforma Acadêmica TCC — Windows     ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verifica se o Docker está rodando
$dockerStatus = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[✗] Docker Desktop não está rodando. Abra o Docker Desktop primeiro." -ForegroundColor Red
    exit 1
}

Write-Host "[→] Subindo os containers..." -ForegroundColor Yellow
docker compose up -d

Write-Host ""
Write-Host "[→] Aguardando o Moodle instalar (pode demorar ~5 min na primeira vez)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Aguarda o Moodle ficar disponível
$maxTentativas = 30
$tentativa = 0
do {
    $tentativa++
    Write-Host "[→] Verificando Moodle... ($tentativa/$maxTentativas)" -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://localhost" -TimeoutSec 5 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            break
        }
    } catch {}
    Start-Sleep -Seconds 10
} while ($tentativa -lt $maxTentativas)

Write-Host ""
Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║        Sistema pronto para uso!          ║" -ForegroundColor Green
Write-Host "╠══════════════════════════════════════════╣" -ForegroundColor Green
Write-Host "║  Moodle:   http://localhost              ║" -ForegroundColor Green
Write-Host "║  Sistema:  http://localhost:5173         ║" -ForegroundColor Green
Write-Host "╠══════════════════════════════════════════╣" -ForegroundColor Green
Write-Host "║  Admin:    admin / Admin@1234            ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "[!] Lembre-se de gerar o token do Moodle e atualizar o docker-compose.yml" -ForegroundColor Yellow
Write-Host "    Acesse: http://localhost/admin/webservice/tokens.php" -ForegroundColor Yellow
