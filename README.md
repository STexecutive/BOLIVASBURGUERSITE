# Site Bolivas Burguer Artesanal

Site institucional de página única para www.bolivasburguer.com.br, com botões que
direcionam para o cardápio digital: https://bolivasburguer.menudino.com

## Estrutura de arquivos

```
index.html                     Página principal (única página do site)
404.html                       Página de erro personalizada
politica-de-privacidade.html   Política de privacidade (link no rodapé)
robots.txt                     Libera indexação e aponta para o sitemap
sitemap.xml                    Mapa do site para o Google
assets/css/style.css           Estilo visual (preto, branco, dourado, laranja, amarelo)
assets/js/main.js              Menu mobile, ano automático no rodapé, animações de entrada
assets/images/                 Logo, arte do Hero, fachada e fotos dos produtos
```

## Imagens já aplicadas (fotos reais da Bolivas Burguer)

Todas as fotos enviadas (pasta `bolivas fotos 2026` no Desktop) foram otimizadas
em WebP e já estão em uso no site:

- `logo.webp` — logo oficial, usada no cabeçalho, rodapé, favicon e apple-touch-icon
- `hero-art.webp` — arte oficial completa usada como fundo da primeira tela (Hero);
  os elementos clicáveis (menu, Pedir Agora, apps, Ver Local, WhatsApp) são áreas
  transparentes posicionadas por JavaScript exatamente sobre o desenho da arte
- `loja.webp` — fachada real da loja, na seção "Conheça nossa loja"
- `produto-classico.webp`, `produto-duplo-batata.webp`, `produto-combo-casal.webp`,
  `produto-familia.webp` — as quatro artes promocionais oficiais (pasta `promoção/`)
  usadas na seção "Nosso Cardápio". São artes quadradas prontas, com o nome e os
  detalhes já desenhados, por isso ocupam o card inteiro sem moldura
- `og-image.jpg` — imagem usada ao compartilhar o link em
  WhatsApp/Instagram/Facebook

O número de WhatsApp (`5561981399884`) foi lido diretamente da placa da fachada
(foto `loja.jpeg`, telefone "98139-9884" + DDD 61 de Brasília/DF). Confirme se
esse é o número correto antes de publicar.

## Dados do negócio já aplicados

- **Endereço**: Av. Central Conjunto 19, casa 06 - Sobradinho II, Brasília/DF,
  CEP 73062-819 (na seção "Localização", no mapa, nos botões "Como Chegar" /
  "Ver Local" e nos dados estruturados Schema.org).
- **Horário**: terça a domingo, 17h30 às 23h (fechado às segundas).
- **WhatsApp**: 5561981399884.
- **Coordenadas exatas**: -15.6472883, -47.81827 (no bloco `geo` do Schema.org,
  no mapa incorporado e nos botões "Como Chegar", que abrem a rota direto).
- **Ficha no Google**: `https://maps.google.com/?cid=10908204776365090355`
  (usada em "Ver Local" e no "📍 Mapa" do rodapé).
- **Avaliações**: o botão "Ver todas as avaliações no Google" abre a aba de
  avaliações da ficha do estabelecimento.

## O que ainda falta preencher antes de publicar

1. **Google Analytics 4** — o código está comentado em `index.html`
   (procure por `G-XXXXXXXXXX`). Crie uma propriedade GA4, pegue o ID de
   medição e descomente o bloco.
4. **Google Search Console** — procure a linha comentada
   `<meta name="google-site-verification" ...>` em `index.html` e cole o
   código de verificação fornecido pelo Google (ou use o método de
   verificação por DNS, que não exige editar o HTML).

## Configurações que precisam ser feitas na hospedagem/DNS (fora do código)

Estas dependem do provedor de hospedagem e registrador de domínio, então
precisam ser feitas por quem tem acesso a essas contas:

- Apontar o domínio `bolivasburguer.com.br` para a hospedagem escolhida.
- Emitir certificado SSL e forçar HTTPS.
- Definir `www.bolivasburguer.com.br` como domínio principal e redirecionar
  `bolivasburguer.com.br` (sem www) para ele com redirecionamento 301.
- Confirmar que **nenhum redirecionamento automático para o MenuDino**
  existe mais no domínio (o site deve abrir normalmente).
- Publicar os arquivos deste projeto na raiz do site, garantindo que
  `404.html` seja configurado como página de erro 404 no painel de
  hospedagem (em muitos provedores isso é automático ao detectar o arquivo,
  em outros precisa ser configurado manualmente).
- Verificar a propriedade do site no Google Search Console e enviar o
  `sitemap.xml`.

## Observação sobre a imagem do Hero

O banner oficial enviado tem proporção larga (1600x640), pensado originalmente
como arte para redes sociais. No site ele cobre a tela toda como plano de
fundo do Hero (`object-fit: cover`), o que é ótimo em telas largas, mas em
celulares na vertical a imagem é ampliada e cortada nas laterais (mantendo o
centro com os hambúrgueres em foco). Funciona bem, mas se no futuro vocês
tiverem uma foto vertical/quadrada em alta resolução dedicada ao hero, o
resultado fica ainda mais nítido em todos os tamanhos de tela.

## Como testar localmente

Basta abrir o arquivo `index.html` num navegador, ou rodar um servidor
simples na pasta do projeto, por exemplo:

```bash
npx serve .
```

## Observação sobre o conteúdo

Todos os textos foram escritos originalmente para este projeto (sem cópia
de outros sites), seguindo a única tag H1 ("Bolivas Burguer Artesanal") e H2
para as demais seções, conforme pedido.
