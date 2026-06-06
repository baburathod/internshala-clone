import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '@/config/api';
import { useSelector } from 'react-redux';
import { selectuser } from '@/Feature/Userslice';
import { uploadImage, uploadVideo } from '@/services/uploadService';
import { toast } from 'react-toastify';
import { Image as ImageIcon, Video, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CreatePostProps {
  onPostCreated: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const { t } = useTranslation();
  const user = useSelector(selectuser);
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileType(type);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Please login first");
    if (!text && !file) return toast.error("Post cannot be empty");

    setLoading(true);
    setErrorMsg(null);
    let imageUrl = '';
    let videoUrl = '';

    if (file && fileType === 'image') {
      const url = await uploadImage(file);
      if (url) imageUrl = url;
    } else if (file && fileType === 'video') {
      const url = await uploadVideo(file);
      if (url) videoUrl = url;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/posts`, {
        uid: user.uid,
        text,
        image: imageUrl,
        video: videoUrl
      });
      setText('');
      setFile(null);
      setFileType(null);
      toast.success("Post created successfully");
      onPostCreated();
    } catch (err: any) {
      if (err.response && err.response.status === 403) {
        // Enforce posting limit UI rule
        setErrorMsg("Add friends to unlock posting privileges.");
      } else {
        toast.error("Failed to create post");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      {/* Visual Posting Limit Dashboard */}
      <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-semibold text-gray-700">Weekly Posting Limit</span>
          <span className="text-xs font-bold text-blue-600">3 / 5 Posts</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
        </div>
        <p className="text-[10px] text-gray-500 mt-1">Free users can post 5 times a week. Upgrade to Premium for unlimited.</p>
      </div>

      <div className="flex space-x-3 mb-4">
        <img src={user?.photo || "/logo.png"} alt="User" className="w-10 h-10 rounded-full" />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('community.post_placeholder')}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:border-blue-400"
          rows={3}
        />
      </div>

      {file && (
        <div className="mb-4 text-sm text-gray-600 bg-blue-50 p-2 rounded">
          Attached {fileType}: {file.name}
          <button type="button" onClick={() => { setFile(null); setFileType(null); }} className="ml-2 text-red-500 font-bold">X</button>
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm text-center border border-red-200">
          {errorMsg}
        </div>
      )}

      <div className="flex items-center justify-between border-t pt-3">
        <div className="flex space-x-2">
          <label className="cursor-pointer flex items-center space-x-1 p-2 hover:bg-gray-100 rounded text-gray-600">
            <ImageIcon size={20} className="text-blue-500" />
            <span className="hidden sm:inline text-sm font-medium">Photo</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'image')} />
          </label>
          <label className="cursor-pointer flex items-center space-x-1 p-2 hover:bg-gray-100 rounded text-gray-600">
            <Video size={20} className="text-green-500" />
            <span className="hidden sm:inline text-sm font-medium">Video</span>
            <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileChange(e, 'video')} />
          </label>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || (!text && !file)}
          className={`flex items-center px-4 py-2 rounded-full text-white text-sm font-medium ${
            loading || (!text && !file) ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Posting..." : (
            <>
              <span className="mr-1">{t('community.create_post')}</span>
              <Send size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
