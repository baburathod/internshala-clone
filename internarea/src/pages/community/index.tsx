import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/Components/ProtectedRoute';
import FriendSidebar from '@/Components/community/FriendSidebar';
import FriendRequestList from '@/Components/community/FriendRequestList';
import SuggestedFriends from '@/Components/community/SuggestedFriends';
import CreatePost from '@/Components/community/CreatePost';
import PostCard from '@/Components/community/PostCard';
import axios from 'axios';
import API_BASE_URL from '@/config/api';
import { useSelector } from 'react-redux';
import { selectuser } from '@/Feature/Userslice';

const Community: React.FC = () => {
  const user = useSelector(selectuser);
  const [posts, setPosts] = useState<any[]>([]);

  const [feedType, setFeedType] = useState<'recent' | 'trending'>('recent');

  const fetchPosts = () => {
    axios.get(`${API_BASE_URL}/api/posts`)
      .then(res => setPosts(res.data))
      .catch(err => console.error("Error fetching posts", err));
  };

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const displayedPosts = [...posts].sort((a, b) => {
    if (feedType === 'trending') {
      const aScore = (a.likes?.length || 0) + (a.comments?.length || 0);
      const bScore = (b.likes?.length || 0) + (b.comments?.length || 0);
      return bScore - aScore;
    }
    // recent is default from backend, but let's ensure descending order by date
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Sidebar - Hidden on mobile, visible on md+ */}
            <div className="hidden md:block md:col-span-3">
              <FriendSidebar />
              <FriendRequestList />
            </div>

            {/* Center Feed */}
            <div className="col-span-1 md:col-span-6">
              <CreatePost onPostCreated={fetchPosts} />
              
              <div className="flex justify-between items-center mb-4 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                <h2 className="font-semibold text-gray-800">Your Feed</h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setFeedType('recent')}
                    className={`px-3 py-1 text-sm font-medium rounded-full ${feedType === 'recent' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    Recent
                  </button>
                  <button 
                    onClick={() => setFeedType('trending')}
                    className={`px-3 py-1 text-sm font-medium rounded-full ${feedType === 'trending' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    Trending 🔥
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {displayedPosts.map(post => (
                  <PostCard key={post._id} post={post} onPostUpdated={fetchPosts} />
                ))}
                {displayedPosts.length === 0 && (
                  <div className="text-center py-10 bg-white rounded-lg shadow text-gray-500">
                    No posts yet. Be the first to start a conversation!
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar - Hidden on mobile, visible on md+ */}
            <div className="hidden md:block md:col-span-3">
              <SuggestedFriends />
            </div>

            {/* Mobile Fallbacks for sidebars at the bottom */}
            <div className="md:hidden col-span-1 space-y-6 mt-6">
              <FriendSidebar />
              <FriendRequestList />
              <SuggestedFriends />
            </div>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Community;
