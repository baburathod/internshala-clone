import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '@/config/api';
import { useSelector } from 'react-redux';
import { selectuser } from '@/Feature/Userslice';
import { Check, X } from 'lucide-react';
import { toast } from 'react-toastify';

const FriendRequestList: React.FC = () => {
  const user = useSelector(selectuser);
  const [requests, setRequests] = useState<any[]>([]);

  const fetchRequests = () => {
    if (user) {
      axios.get(`${API_BASE_URL}/api/friends/requests/${user.uid}`)
        .then(res => setRequests(res.data))
        .catch(err => console.error(err));
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const handleAction = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      await axios.put(`${API_BASE_URL}/api/friends/${action}`, { requestId });
      toast.success(`Request ${action}ed`);
      fetchRequests();
    } catch (error) {
      toast.error(`Failed to ${action} request`);
    }
  };

  if (!user || requests.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6">
      <h3 className="font-semibold text-gray-900 mb-4 border-b pb-2">Pending Requests</h3>
      <div className="space-y-4">
        {requests.map(req => (
          <div key={req._id} className="flex items-center space-x-3">
            <img src={req.sender?.photo || "/logo.png"} alt={req.sender?.name} className="w-10 h-10 rounded-full" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{req.sender?.name}</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => handleAction(req._id, 'accept')}
                className="p-1.5 rounded-full hover:bg-gray-100 text-green-600"
              >
                <Check size={18} />
              </button>
              <button 
                onClick={() => handleAction(req._id, 'reject')}
                className="p-1.5 rounded-full hover:bg-gray-100 text-red-600"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendRequestList;
