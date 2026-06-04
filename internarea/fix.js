const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Replace template literals: `https://internshala-clone-y2p2.onrender.com/api...`
  content = content.replace(/`https:\/\/internshala-clone-y2p2\.onrender\.com/g, '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}');
  
  // Replace normal strings: "https://internshala-clone-y2p2.onrender.com/api/..." -> (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/..."
  content = content.replace(/"https:\/\/internshala-clone-y2p2\.onrender\.com([^"]*)"/g, '(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "$1"');
  
  // Single quotes just in case
  content = content.replace(/'https:\/\/internshala-clone-y2p2\.onrender\.com([^']*)'/g, "(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '$1'");
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log("Fixed", file);
  }
});
