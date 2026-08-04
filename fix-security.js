const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Adicionar noreferrer aos links externos que não sejam do mesmo domínio
// e que não o tenham já
html = html.replace(
  /(<a [^>]*href="https?:\/\/(?!www\.bolivasburguer\.com\.br)[^"]*"[^>]*)(target="_blank"[^>]*rel="noopener")([^>]*>)/g,
  '$1$2 noreferrer$3'
);

// Para links que têm rel="noopener" mas não noreferrer
html = html.replace(
  /rel="noopener"(?! noreferrer)/g,
  'rel="noopener noreferrer"'
);

// Adicionar loading="lazy" a imagens que não o têm
html = html.replace(
  /(<img [^>]*src="\/assets\/images\/[^"]*"[^>]*)(?!.*loading="lazy")([^>]*>)/g,
  '$1 loading="lazy"$2'
);

fs.writeFileSync('index.html', html);
console.log('✓ Segurança e lazy loading adicionados');
