const fs = require('fs');
const path = require('path');

const DIRECTORIES = ['app', 'components', 'lib'];
const EXTENSIONS = ['.ts', '.tsx', '.css'];

const REPLACEMENTS = [
  { match: /from-cyan-400 to-blue-500/g, replace: 'from-lime-400 to-green-500' },
  { match: /from-cyan-500 to-blue-600/g, replace: 'from-lime-500 to-green-600' },
  { match: /from-cyan-300 hover:to-blue-400/g, replace: 'from-lime-300 hover:to-green-400' },
  { match: /from-cyan-400 to-blue-600/g, replace: 'from-lime-400 to-green-600' },
  { match: /from-violet-500 to-fuchsia-600/g, replace: 'from-green-400 to-emerald-500' },
  { match: /from-violet-600\/20 to-fuchsia-600\/20/g, replace: 'from-green-600/20 to-emerald-600/20' },
  { match: /from-violet-500\/20 to-fuchsia-500\/20/g, replace: 'from-green-500/20 to-emerald-500/20' },
  { match: /from-amber-400 to-orange-500/g, replace: 'from-lime-500 to-emerald-600' },
  { match: /from-blue-500 to-indigo-600/g, replace: 'from-emerald-400 to-teal-600' },
  { match: /shadow-cyan-400\/25/g, replace: 'shadow-lime-400/25' },
  { match: /shadow-cyan-400\/20/g, replace: 'shadow-lime-400/20' },
  { match: /shadow-cyan-500\/30/g, replace: 'shadow-lime-500/30' },
  { match: /shadow-violet-500\/25/g, replace: 'shadow-green-500/25' },
  { match: /shadow-violet-500\/40/g, replace: 'shadow-green-500/40' },
  { match: /shadow-violet-500\/20/g, replace: 'shadow-green-500/20' },
  { match: /shadow-violet-500/g, replace: 'shadow-green-500' },
  { match: /ring-violet-500\/20/g, replace: 'ring-green-500/20' },
  { match: /border-violet-500\/30/g, replace: 'border-green-500/30' },
  { match: /border-violet-500\/50/g, replace: 'border-green-500/50' },
  { match: /from-cyan-500\/10 via-blue-500\/10 to-cyan-500\/10/g, replace: 'from-lime-500/10 via-green-500/10 to-lime-500/10' },
  { match: /from-cyan-500\/20 to-blue-500\/20/g, replace: 'from-lime-500/20 to-green-500/20' },
  { match: /from-violet-400 via-fuchsia-400 to-cyan-400/g, replace: 'from-lime-400 via-green-400 to-emerald-400' },
  { match: /bg-violet-500\/10/g, replace: 'bg-green-500/10' },
  { match: /text-violet-300/g, replace: 'text-green-300' },
  { match: /hover:bg-blue-500\/10/g, replace: 'hover:bg-green-500/10' },
  { match: /rgb\(139 92 246\)/g, replace: 'rgb(34 197 94)' }, // violet-500 to green-500
  { match: /rgb\(192 132 252\)/g, replace: 'rgb(16 185 129)' }, // fuchsia-400 to emerald-500
];

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(filePath) {
  if (!EXTENSIONS.some(ext => filePath.endsWith(ext))) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;

  // Apply css variables replacement if globals.css
  if (filePath.endsWith('globals.css')) {
    newContent = newContent.replace(/--primary: oklch\(0\.5 0\.25 240\);/g, '--primary: oklch(0.65 0.25 140);');
    newContent = newContent.replace(/--ring: oklch\(0\.5 0\.25 240\);/g, '--ring: oklch(0.65 0.25 140);');
    newContent = newContent.replace(/--chart-1: oklch\(0\.5 0\.25 240\);/g, '--chart-1: oklch(0.65 0.25 140);');
    
    // Dark mode deep black bg
    newContent = newContent.replace(/--background: oklch\(0\.15 0 0\);/g, '--background: oklch(0.12 0 0);');
    
    newContent = newContent.replace(/--primary: oklch\(0\.65 0\.25 240\);/g, '--primary: oklch(0.7 0.25 140);');
    newContent = newContent.replace(/--ring: oklch\(0\.65 0\.25 240\);/g, '--ring: oklch(0.7 0.25 140);');
    newContent = newContent.replace(/--chart-1: oklch\(0\.5 0\.25 240\);/g, '--chart-1: oklch(0.7 0.25 140);');
  }

  REPLACEMENTS.forEach(({ match, replace }) => {
    newContent = newContent.replace(match, replace);
  });

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

DIRECTORIES.forEach(dir => {
  walkDir(path.join(__dirname, dir), processFile);
});
console.log('Script completed.');
