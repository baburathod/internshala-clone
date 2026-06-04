import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectuser } from '@/Feature/Userslice';
import axios from 'axios';
import API_BASE_URL from '@/config/api';

const FriendSidebar: React.FC = () => {
  const user = useSelector(selectuser);
  const [friendCount, setFriendCount] = useState(0);

  useEffect(() => {
    if (user) {
      // Fetch user details from DB to get friends array length
      axios.post(`${API_BASE_URL}/users/sync`, { uid: user.uid })
        .then(res => setFriendCount(res.data.friends?.length || 0))
        .catch(err => console.error(err));
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-16"></div>
      <div className="px-4 py-4 relative">
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
          <img src={user.photo || "/logo.png"} alt="User" className="w-16 h-16 rounded-full border-4 border-white shadow-sm" />
        </div>
        <div className="mt-8 text-center">
          <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
          <p className="text-sm text-gray-500 mt-1">{user.email}</p>
        </div>
        <div className="mt-6 border-t border-gray-100 pt-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-sm font-medium text-gray-600">Friends</span>
            <span className="text-sm font-bold text-blue-600">{friendCount}</span>
          </div>
          <div className="mt-2 flex justify-between items-center px-2">
            <span className="text-sm font-medium text-gray-600">Posts Today limit</span>
            <span className="text-xs text-gray-500">
              {friendCount === 0 ? "0" : friendCount === 1 ? "1" : friendCount <= 10 ? "2" : "Unlimited"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendSidebar;
