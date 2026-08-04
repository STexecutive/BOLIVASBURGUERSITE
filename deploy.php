<?php
/**
 * Deploy Webhook Receiver para GitHub
 *
 * Este arquivo recebe notificações de push do GitHub e atualiza o site automaticamente.
 *
 * Segurança: Verifica a assinatura HMAC do GitHub
 */

// ===== CONFIGURAÇÃO =====
$SECRET = getenv('GITHUB_WEBHOOK_SECRET') ?: 'seu-secret-aqui'; // Será preenchido depois
$REPO_PATH = '/home/...seu-usuario.../public_html'; // Será preenchido depois

// ===== SEGURANÇA: Verificar assinatura =====
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';

if (!$signature) {
    http_response_code(401);
    die(json_encode(['error' => 'Sem assinatura de verificação']));
}

// Verificar HMAC
$hash = 'sha256=' . hash_hmac('sha256', $payload, $SECRET);
if (!hash_equals($hash, $signature)) {
    http_response_code(401);
    die(json_encode(['error' => 'Assinatura inválida']));
}

// ===== PROCESSAR PUSH =====
$data = json_decode($payload, true);

if ($data['ref'] === 'refs/heads/main') {
    // Log de audit
    $log_file = '/home/...seu-usuario.../logs/deploy.log';
    $timestamp = date('Y-m-d H:i:s');

    // Executar deploy
    $output = shell_exec("cd {$REPO_PATH} && git pull origin main 2>&1");

    // Registrar
    file_put_contents(
        $log_file,
        "[{$timestamp}] Deploy realizado\n{$output}\n\n",
        FILE_APPEND
    );

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Site atualizado com sucesso!',
        'timestamp' => $timestamp
    ]);
} else {
    http_response_code(200);
    echo json_encode(['status' => 'ignored', 'message' => 'Branch diferente de main']);
}
?>
