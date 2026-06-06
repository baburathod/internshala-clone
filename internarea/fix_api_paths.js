const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/community/index.tsx',
  'src/Components/community/CommentSection.tsx',
  'src/Components/community/CreatePost.tsx',
  'src/Components/community/FriendRequestList.tsx',
  'src/Components/community/FriendSidebar.tsx',
  'src/Components/community/PostCard.tsx',
  'src/Components/community/SuggestedFriends.tsx'
];

files.forEach(f => {
  const fullPath = path.join(__dirname, f);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    // Replace ${API_BASE_URL}/posts with ${API_BASE_URL}/api/posts
    content = content.replace(/\$\{API_BASE_URL\}\/(posts|friends|users)/g, '${API_BASE_URL}/api/$1');
    fs.writeFileSync(fullPath, content);
    console.log('Fixed', f);
  }
});
