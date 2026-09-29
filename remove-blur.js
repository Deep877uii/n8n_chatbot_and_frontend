import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      if (!file.includes('node_modules') && !file.includes('dist')) {
        results = results.concat(walk(file));
      }
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');

let totalChanges = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Remove expensive backdrop blur effects
  content = content.replace(/\bbackdrop-blur-[a-z0-9-]+\b/g, '');
  content = content.replace(/\bbackdrop-blur\b/g, '');
  
  // Also remove blur on the background blobs if any
  content = content.replace(/\bblur-\[120px\]\b/g, 'opacity-30'); // Make it just low opacity instead of expensive blur

  // Clean up double spaces left from regex replacement
  content = content.replace(/ {2,}/g, ' ');
  content = content.replace(/className=" /g, 'className="');
  content = content.replace(/ className=""/g, '');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Removed blur from', file);
    totalChanges++;
  }
});

console.log('Total files changed:', totalChanges);
