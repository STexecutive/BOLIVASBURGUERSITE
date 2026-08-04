# 🚀 GUIA: Deploy Automático Instantâneo

**Objetivo**: Toda vez que você faz `git push`, o site na Hostinger atualiza **automaticamente em segundos**.

---

## 📋 PRÉ-REQUISITOS

- ✅ Acesso ao painel Hostinger
- ✅ Credenciais SFTP
- ✅ Repositório GitHub (já tem)
- ✅ GitHub Actions (já configurado)

---

## 🔧 CONFIGURAÇÃO (4 PASSOS)

### **PASSO 1: Deploy Key no GitHub**

1. Abra um terminal e gere uma chave SSH (sem passphrase):
   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/deploy_key -N ""
   ```

2. Copie a chave pública:
   ```bash
   cat ~/.ssh/deploy_key.pub
   ```

3. No GitHub:
   - Vá para: Settings → Deploy keys → Add deploy key
   - Cole a chave pública
   - ✅ Marque "Allow write access"
   - Clique em "Add key"

4. Copie a chave **privada** (você vai precisar depois):
   ```bash
   cat ~/.ssh/deploy_key
   ```

---

### **PASSO 2: Configurar Deploy Key na Hostinger**

1. Acesse a Hostinger via SFTP com suas credenciais
2. Navegue até: `/home/seu-usuario/.ssh/`
3. Se a pasta não existir, crie-a
4. Crie um arquivo `authorized_keys`:
   - Cole a chave pública que você copiou
   - Salve o arquivo
5. Verifique as permissões:
   ```bash
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```

---

### **PASSO 3: Fazer Git Clone do Repositório**

1. Conecte via SSH à Hostinger:
   ```bash
   ssh seu-usuario@seu-host.hostinger.com
   ```

2. Navegue até public_html:
   ```bash
   cd public_html
   ```

3. Se já houver arquivos, faça backup:
   ```bash
   mv ./* /tmp/backup/
   ```

4. Clone o repositório:
   ```bash
   git clone git@github.com:STexecutive/BOLIVASBURGUERSITE.git .
   ```

5. Configure Git:
   ```bash
   git config user.email "seu-email@github.com"
   git config user.name "GitHub Deploy"
   ```

---

### **PASSO 4: Upload do deploy.php**

1. Via SFTP, copie o arquivo `deploy.php` para:
   ```
   /home/seu-usuario/public_html/deploy.php
   ```

2. Gere um "secret" seguro (para autenticação):
   ```bash
   openssl rand -base64 32
   ```
   Copie o resultado (ex: `abc123xyz...`)

3. Edite `deploy.php`:
   - Substitua `/home/...seu-usuario.../public_html` pelo caminho real
   - Substitua `seu-secret-aqui` pelo secret que você gerou
   - Salve o arquivo

---

### **PASSO 5: Configurar Webhook no GitHub**

1. No GitHub, vá para:
   **Settings → Webhooks → Add webhook**

2. Preencha:
   - **Payload URL**: `https://www.bolivasburguer.com.br/deploy.php`
   - **Content type**: `application/json`
   - **Secret**: Cole o secret que você gerou no Passo 4
   - **Events**: Selecione "Push events"
   - ✅ Marque "Active"

3. Clique em "Add webhook"

4. Teste clicando em "Recent Deliveries" (deve ver status 200)

---

## ✅ PRONTO!

Agora quando você faz:
```bash
git push
```

Acontece:
1. ✅ Push para GitHub
2. ✅ GitHub Actions roda testes
3. ✅ Webhook dispara para `/deploy.php`
4. ✅ `deploy.php` faz `git pull` na Hostinger
5. ✅ **Site atualizado em ~5 segundos!** 🚀

---

## 📊 Monitorar Deploys

### Ver logs na Hostinger:
```bash
tail -f /home/seu-usuario/logs/deploy.log
```

### Ver na GitHub:
- Vá para **Settings → Webhooks → deploy.php**
- Clique em **Recent Deliveries**
- Veja o status e resposta de cada deploy

---

## 🔒 Segurança

- ✅ Deploy key é específica e pode ser revogada
- ✅ Secret HMAC previne abusos
- ✅ Apenas branch `main` dispara deploy
- ✅ Logs registram todos os deploys

---

## ⚠️ Troubleshooting

**Deploy não funciona?**

1. Verificar status do webhook:
   ```
   GitHub → Settings → Webhooks → deploy.php → Recent Deliveries
   ```

2. Checar logs:
   ```bash
   tail -f /home/seu-usuario/logs/deploy.log
   ```

3. Verificar SSH key:
   ```bash
   ssh -i ~/.ssh/deploy_key seu-usuario@seu-host.hostinger.com
   ```

4. Testar git pull manual:
   ```bash
   cd /home/seu-usuario/public_html && git pull origin main
   ```

---

## 📝 Depois, para Publicar:

```bash
# 1. Fazer alterações
# 2. Adicionar e fazer commit
git add .
git commit -m "Update: descrição da mudança"

# 3. Fazer push (isso dispara o deploy!)
git push

# 4. Pronto! Site atualiza automaticamente
```

---

**Data**: 2026-08-03  
**Status**: Pronto para configuração
