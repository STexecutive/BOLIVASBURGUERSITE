const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('index.html', 'utf8');

// === SEO TÉCNICO ===
console.log('\n=== SEO TÉCNICO ===');
const seoChecks = {
  'Title': /<title>/.test(html),
  'Meta description': /name="description"/.test(html),
  'Meta robots': /name="robots"/.test(html),
  'Canonical': /rel="canonical"/.test(html),
  'Favicon': /rel="icon"/.test(html),
  'Apple touch icon': /rel="apple-touch-icon"/.test(html),
  'og:type': /property="og:type"/.test(html),
  'og:title': /property="og:title"/.test(html),
  'og:image': /property="og:image"/.test(html),
  'Twitter card': /name="twitter:card"/.test(html),
  'Schema.org Restaurant': /"@type": "Restaurant"/.test(html),
  'H1 tag': /<h1>/.test(html),
  'Viewport': /name="viewport"/.test(html),
  'Language pt-BR': /lang="pt-BR"/.test(html),
};

Object.entries(seoChecks).forEach(([name, present]) => {
  console.log(`${present ? '✓' : '✗'} ${name}`);
});

// === ANÁLISE DE ESTRUTURA ===
console.log('\n=== ESTRUTURA HTML ===');
const h1Count = (html.match(/<h1>/g) || []).length;
const h2Count = (html.match(/<h2>/g) || []).length;
const h3Count = (html.match(/<h3>/g) || []).length;
const aCount = (html.match(/<a [^>]*>/g) || []).length;
const imgCount = (html.match(/<img [^>]*>/g) || []).length;

console.log(`H1: ${h1Count} (ideal: 1)`);
console.log(`H2: ${h2Count}`);
console.log(`H3: ${h3Count}`);
console.log(`Links: ${aCount}`);
console.log(`Imagens: ${imgCount}`);

// === ACESSIBILIDADE ===
console.log('\n=== ACESSIBILIDADE ===');
const imgs = html.match(/<img [^>]*>/g) || [];
let altlessCount = 0;
imgs.forEach(img => {
  if (!img.includes('alt=')) {
    altlessCount++;
    console.log(`⚠️  Imagem sem ALT: ${img.substring(0, 80)}...`);
  }
});
if (altlessCount === 0) console.log('✓ Todas as imagens têm ALT');

// === SCHEMA.ORG ===
console.log('\n=== SCHEMA.ORG ===');
const schemas = {
  'Restaurant': /"@type": "Restaurant"/.test(html),
  'PostalAddress': /"@type": "PostalAddress"/.test(html),
  'GeoCoordinates': /"@type": "GeoCoordinates"/.test(html),
  'OpeningHoursSpecification': /"@type": "OpeningHoursSpecification"/.test(html),
};

Object.entries(schemas).forEach(([name, present]) => {
  console.log(`${present ? '✓' : '✗'} ${name}`);
});

// === LINKS ===
console.log('\n=== ANÁLISE DE LINKS ===');
const internalLinks = (html.match(/href="#[^"]*"/g) || []).length;
const externalLinks = (html.match(/href="https?:\/\/[^"]*"/g) || []).length;
const telLinks = (html.match(/href="tel:[^"]*"/g) || []).length;
const waLinks = (html.match(/href="https:\/\/wa\.me\/[^"]*"/g) || []).length;

console.log(`Links internos: ${internalLinks}`);
console.log(`Links externos: ${externalLinks}`);
console.log(`Links telefone: ${telLinks}`);
console.log(`Links WhatsApp: ${waLinks}`);

// === PERFORMANCE ===
console.log('\n=== OTIMIZAÇÕES DE PERFORMANCE ===');
const lazyCount = (html.match(/loading="lazy"/g) || []).length;
const preconnect = (html.match(/rel="preconnect"/g) || []).length;
const preload = (html.match(/rel="preload"/g) || []).length;

console.log(`${lazyCount > 0 ? '✓' : '✗'} Loading lazy (${lazyCount} elementos)`);
console.log(`${preconnect > 0 ? '✓' : '✗'} Preconnect (${preconnect} linhas)`);
console.log(`${preload > 0 ? '✗' : '?'} Preload (${preload} linhas)`);

// === SEGURANÇA ===
console.log('\n=== SEGURANÇA ===');
const noopener = (html.match(/rel="noopener"/g) || []).length;
const noreferrer = (html.match(/rel="noreferrer"/g) || []).length;

console.log(`Atributos noopener: ${noopener}`);
console.log(`Atributos noreferrer: ${noreferrer}`);

// === ARQUIVO .htaccess ===
console.log('\n=== CONFIGURAÇÃO DO SERVIDOR ===');
if (fs.existsSync('.htaccess')) {
  const htaccess = fs.readFileSync('.htaccess', 'utf8');
  const checks = {
    'HTTPS redirect': /RewriteRule.*https/i.test(htaccess),
    'Compression': /mod_deflate/i.test(htaccess),
    'Cache headers': /Cache-Control|Expires/i.test(htaccess),
    'MIME types': /AddType/i.test(htaccess),
  };
  Object.entries(checks).forEach(([name, present]) => {
    console.log(`${present ? '✓' : '✗'} ${name}`);
  });
} else {
  console.log('⚠️  .htaccess não encontrado');
}

// === SITEMAPS ===
console.log('\n=== SITEMAPS ===');
const files = fs.readdirSync('.');
['sitemap.xml', 'sitemap-images.xml', 'robots.txt'].forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✓' : '✗'} ${file}`);
});

console.log('\n=== FIM DA AUDITORIA ===\n');
