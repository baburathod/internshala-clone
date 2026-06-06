import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '@/config/api';
import { useSelector } from 'react-redux';
import { selectuser } from '@/Feature/Userslice';

interface Comment {
  _id: string;
  user: { name: string; photo: string };
  text: string;
  createdAt: string;
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onCommentAdded: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, comments, onCommentAdded }) => {
  const user = useSelector(selectuser);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !text.trim()) return;

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/posts/${postId}/comment`, {
        uid: user.uid,
        text
      });
      setText('');
      onCommentAdded();
    } catch (error) {
      console.error("Error adding comment", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="flex space-x-2 mb-4">
        <img src={user?.photo || "/logo.png"} alt="User" className="w-8 h-8 rounded-full" />
        <form onSubmit={handleSubmit} className="flex-1 flex">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-gray-100 rounded-l-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-full text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400"
          >
            Post
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment._id} className="flex space-x-2">
            <img src={comment.user.photo || "/logo.png"} alt={comment.user.name} className="w-8 h-8 rounded-full" />
            <div className="bg-gray-100 rounded-2xl px-4 py-2 flex-1">
              <div className="font-semibold text-sm">{comment.user.name}</div>
              <div className="text-sm text-gray-700">{comment.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
