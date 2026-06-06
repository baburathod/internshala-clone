import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '@/config/api';
import { useSelector } from 'react-redux';
import { selectuser } from '@/Feature/Userslice';
import { ThumbsUp, MessageCircle, Share2, Link as LinkIcon } from 'lucide-react';
import CommentSection from './CommentSection';
import { toast } from 'react-toastify';

interface PostCardProps {
  post: any;
  onPostUpdated: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdated }) => {
  const user = useSelector(selectuser);
  const [showComments, setShowComments] = useState(false);

  // We need user's MongoDB ID, but frontend only has uid.
  // We'll pass uid to the backend.
  const handleLike = async () => {
    if (!user) return toast.error("Please login to like");
    try {
      await axios.put(`${API_BASE_URL}/api/posts/${post._id}/like`, { uid: user.uid });
      onPostUpdated();
    } catch (error) {
      console.error("Error liking post", error);
    }
  };

  const handleShare = async () => {
    const link = `${window.location.origin}/community/post/${post._id}`;
    navigator.clipboard.writeText(link);
    
    if (user) {
      try {
        await axios.post(`${API_BASE_URL}/api/posts/${post._id}/share`, { uid: user.uid });
        onPostUpdated();
      } catch (error) {
        console.error("Error recording share", error);
      }
    }
    
    toast.success("Link copied to clipboard!");
  };

  // Determine if the current user liked this post (requires backend sending populated likes or matching by UID somehow, 
  // but for now we just show count since the backend array has object IDs).
  // A proper implementation would populate likes with user docs, or check if user._id is in likes array.
  // For simplicity, we just use the length.

  return (
    <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center space-x-3">
        <img src={post.user?.photo || "/logo.png"} alt={post.user?.name} className="w-12 h-12 rounded-full" />
        <div>
          <h3 className="font-semibold text-gray-900">{post.user?.name}</h3>
          <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        {post.text && <p className="text-gray-800 whitespace-pre-wrap">{post.text}</p>}
      </div>

      {/* Media */}
      {post.image && (
        <div className="w-full">
          <img src={post.image} alt="Post media" className="w-full object-cover max-h-96" />
        </div>
      )}
      {post.video && (
        <div className="w-full bg-black">
          <video src={post.video} controls className="w-full max-h-96" />
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-2 border-b border-gray-100 flex justify-between text-sm text-gray-500">
        <span>{post.likes?.length || 0} Likes</span>
        <div className="space-x-3">
          <span>{post.comments?.length || 0} Comments</span>
          <span>{post.shares?.length || 0} Shares</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-2 flex justify-between">
        <button onClick={handleLike} className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg flex-1 justify-center transition">
          <ThumbsUp size={20} />
          <span className="font-medium">Like</span>
        </button>
        <button onClick={() => setShowComments(!showComments)} className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg flex-1 justify-center transition">
          <MessageCircle size={20} />
          <span className="font-medium">Comment</span>
        </button>
        <button onClick={handleShare} className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg flex-1 justify-center transition">
          <Share2 size={20} />
          <span className="font-medium">Share</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="px-4 pb-4">
          <CommentSection postId={post._id} comments={post.comments} onCommentAdded={onPostUpdated} />
        </div>
      )}
    </div>
  );
};

export default PostCard;
