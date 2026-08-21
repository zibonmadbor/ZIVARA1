const fs = require('fs');

const seedContent = fs.readFileSync(__dirname + '/seed.js', 'utf8');
const match = seedContent.match(/const products = (\[[\s\S]*?\]);\s*const categories/);
const products = eval(match[1]);

console.log('=== FULL AUDIT (1 to ' + products.length + ') ===');
products.forEach((p, i) => {
  console.log(`[#${i + 1}] Cat: ${p.category.padEnd(11)} | Sub: ${(p.subcategory||'').padEnd(14)} | Name: "${p.name}"`);
});
