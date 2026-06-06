import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '@/config/api';
import { useSelector } from 'react-redux';
import { selectuser } from '@/Feature/Userslice';
import { UserPlus, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const SuggestedFriends: React.FC = () => {
  const user = useSelector(selectuser);
  const [users, setUsers] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      axios.get(`${API_BASE_URL}/api/users/search?q=`)
        .then(res => {
          // Filter out current user from suggestions
          const filtered = res.data.filter((u: any) => u.uid !== user.uid);
          setUsers(filtered);
        })
        .catch(err => console.error(err));
    }
  }, [user]);

  const sendRequest = async (receiverId: string) => {
    try {
      await axios.post(`${API_BASE_URL}/api/friends/request`, {
        senderUid: user.uid,
        receiverId
      });
      toast.success("Friend request sent!");
      setPendingRequests(prev => new Set(prev).add(receiverId));
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to send request");
    }
  };

  if (!user || users.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold text-gray-900 mb-4 border-b pb-2">Add to your feed</h3>
      <div className="space-y-4">
        {users.map(u => (
          <div key={u._id} className="flex items-center space-x-3">
            <img src={u.photo || "/logo.png"} alt={u.name} className="w-10 h-10 rounded-full" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{u.name}</p>
            </div>
            <button 
              onClick={() => sendRequest(u._id)}
              disabled={pendingRequests.has(u._id)}
              className="p-1.5 rounded-full hover:bg-gray-100 text-blue-600 disabled:text-gray-400"
            >
              {pendingRequests.has(u._id) ? <Clock size={18} /> : <UserPlus size={18} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedFriends;
