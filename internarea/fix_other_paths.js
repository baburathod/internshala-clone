const fs = require('fs');
const path = require('path');

const files = [
  'src/Components/Navbar.tsx',
  'src/pages/forgot-password/index.tsx',
  'src/pages/resume-builder/index.tsx',
  'src/pages/subscriptions/index.tsx'
];

files.forEach(f => {
  const fullPath = path.join(__dirname, f);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    // Replace ${API_BASE_URL}/whatever with ${API_BASE_URL}/api/whatever
    // using regex
    content = content.replace(/\$\{API_BASE_URL\}\/(language|password|resume|subscription|users)/g, '${API_BASE_URL}/api/$1');
    fs.writeFileSync(fullPath, content);
    console.log('Fixed', f);
  }
});
