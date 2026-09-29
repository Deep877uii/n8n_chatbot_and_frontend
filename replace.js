import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
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

  // Replace durations to be faster
  content = content.replace(/duration-1000/g, 'duration-300');
  content = content.replace(/duration-500/g, 'duration-150');
  content = content.replace(/duration-300/g, 'duration-150');
  content = content.replace(/duration-200/g, 'duration-150');
  
  // Remove animate-fadeUp and animate-fade-in classes (optional, or just rely on CSS speedup)
  content = content.replace(/\banimate-fadeUp\b/g, '');
  content = content.replace(/\banimate-fade-up\b/g, '');
  content = content.replace(/\banimate-fadeIn\b/g, '');
  content = content.replace(/\banimate-fade-in\b/g, '');
  
  // Fix cases where removing a class leaves multiple spaces or leading/trailing spaces
  content = content.replace(/ {2,}/g, ' ');
  content = content.replace(/className=" /g, 'className="');
  content = content.replace(/ className=""/g, '');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
    totalChanges++;
  }
});

console.log('Total files changed:', totalChanges);
