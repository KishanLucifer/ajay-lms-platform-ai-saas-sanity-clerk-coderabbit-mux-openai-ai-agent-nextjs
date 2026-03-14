const fs = require('fs');
const path = require('path');

const DIRECTORIES = ['app', 'components', 'lib'];
const EXTENSIONS = ['.ts', '.tsx', '.css'];

const REPLACEMENTS = [
  // Mesh Background Fixes (removing violet/fuchsia meshes entirely and converting to green/teal)
  { match: /bg-violet-600\/20/g, replace: 'bg-emerald-600/10' },
  { match: /bg-fuchsia-600\/15/g, replace: 'bg-teal-600/10' },
  { match: /bg-cyan-500\/10/g, replace: 'bg-lime-500/10' },
  
  { match: /from-violet-600\/20 via-fuchsia-600\/10 to-cyan-600\/20/g, replace: 'from-emerald-900/40 via-teal-900/20 to-lime-900/40' },
  { match: /from-violet-500\/20 via-fuchsia-500\/20 to-cyan-500\/20/g, replace: 'from-emerald-500/20 via-teal-500/20 to-lime-500/20' },
  
  { match: /from-violet-400 to-fuchsia-400/g, replace: 'from-emerald-400 to-teal-400' },
  { match: /from-fuchsia-400 to-cyan-400/g, replace: 'from-teal-400 to-lime-400' },

  // Background Text Gradient
  { match: /bg-linear-to-r from-violet-400 via-fuchsia-400 to-cyan-400/g, replace: 'bg-linear-to-r from-emerald-400 via-teal-400 to-lime-400' },
  
  // Update icons where imported
  { match: /import \{([^}]*)\} from "lucide-react";/g, replace: (fullMatch, group1) => {
      let imports = group1;
      if (!imports.includes('Cpu')) imports += ', Cpu';
      if (!imports.includes('Zap')) imports += ', Zap';
      if (!imports.includes('Orbit')) imports += ', Orbit';
      if (!imports.includes('Radar')) imports += ', Radar';
      if (!imports.includes('Hexagon')) imports += ', Hexagon';
      if (!imports.includes('Activity')) imports += ', Activity';
      if (!imports.includes('ArrowRightCircle')) imports += ', ArrowRightCircle';
      if (!imports.includes('ChevronRight')) imports += ', ChevronRight';
      if (!imports.includes('Database')) imports += ', Database';
      if (!imports.includes('Network')) imports += ', Network';
      return `import {${imports}} from "lucide-react";`;
  }},
  
  // Icon Swaps throughout code
  { match: /<Play /g, replace: '<Zap ' },
  { match: /<Play\b/g, replace: '<Zap' },
  { match: /icon: Play/g, replace: 'icon: Zap' },
  { match: /<BookOpen /g, replace: '<Database ' },
  { match: /icon: BookOpen/g, replace: 'icon: Database' },
  { match: /<Code2 /g, replace: '<Cpu ' },
  { match: /icon: Code2/g, replace: 'icon: Cpu' },
  { match: /<Rocket /g, replace: '<Radar ' },
  { match: /icon: Rocket/g, replace: 'icon: Radar' },
  { match: /<Crown /g, replace: '<Hexagon ' },
  { match: /icon: Crown/g, replace: 'icon: Hexagon' },
  { match: /<Trophy /g, replace: '<Activity ' },
  { match: /icon: Trophy/g, replace: 'icon: Activity' },
  { match: /<ArrowRight /g, replace: '<ArrowRightCircle ' },
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

  // Append keyframe for infinite scroll down at globals.css
  if (filePath.endsWith('globals.css')) {
     if (!content.includes('scroll {')) {
        newContent += `\n/* Aceternity Carousel Animation */
@keyframes scroll {
  to {
    transform: translate(calc(-50% - 0.5rem));
  }
}

.animate-scroll {
  animation: scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite;
}\n`;
     }
  }

  REPLACEMENTS.forEach((replacement) => {
    if (typeof replacement.replace === 'function') {
        newContent = newContent.replace(replacement.match, replacement.replace);
    } else {
        newContent = newContent.replace(replacement.match, replacement.replace);
    }
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
