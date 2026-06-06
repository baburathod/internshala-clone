import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import API_BASE_URL from '@/config/api';
import { useSelector } from 'react-redux';
import { selectuser } from '@/Feature/Userslice';
import ProtectedRoute from '@/Components/ProtectedRoute';
import { io, Socket } from 'socket.io-client';
import { Send, User as UserIcon } from 'lucide-react';
import { toast } from 'react-toastify';

const Messages = () => {
  const user = useSelector(selectuser);
  const [friends, setFriends] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Socket and fetch friends
  useEffect(() => {
    if (!user) return;

    // Connect to Socket
    socketRef.current = io(API_BASE_URL);
    socketRef.current.emit("register", user.uid);

    socketRef.current.on("receiveMessage", (msg: any) => {
      // If the message is from the active chat, append it
      if (activeChat && (msg.sender.uid === activeChat.uid || msg.sender._id === activeChat._id)) {
        setMessages(prev => [...prev, msg]);
      } else {
        // Show toast notification for background messages
        toast.info(`New message from ${msg.sender.name}`);
      }
    });

    // Fetch friends list (For messaging)
    axios.get(`${API_BASE_URL}/api/users/sync`, { params: { uid: user.uid } })
      .then(res => {
        // Fallback: If no friends endpoint exists, let's fetch all users for demo purposes
        // In a real app, this should be just the friends list.
        axios.get(`${API_BASE_URL}/api/users/search?q=`)
          .then(searchRes => {
            setFriends(searchRes.data.filter((u: any) => u.uid !== user.uid));
          });
      })
      .catch(err => console.error(err));

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user, activeChat]);

  // Load messages when active chat changes
  useEffect(() => {
    if (user && activeChat) {
      axios.get(`${API_BASE_URL}/api/messages/${user.uid}/${activeChat.uid}`)
        .then(res => {
          setMessages(res.data);
          // Mark as read
          axios.put(`${API_BASE_URL}/api/messages/read/${activeChat.uid}/${user.uid}`);
        })
        .catch(err => console.error(err));
    }
  }, [user, activeChat]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat || !user || !socketRef.current) return;

    const msgData = {
      senderUid: user.uid,
      receiverUid: activeChat.uid,
      text: inputText
    };

    socketRef.current.emit("sendMessage", msgData);

    // Optimistically update UI
    setMessages(prev => [...prev, {
      sender: user,
      receiver: activeChat,
      text: inputText,
      createdAt: new Date().toISOString()
    }]);

    setInputText('');
  };

  return (
    <ProtectedRoute>
      <div className="h-[calc(100vh-64px)] bg-gray-100 flex overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-1/3 md:w-1/4 bg-white border-r flex flex-col">
          <div className="p-4 border-b bg-gray-50 font-bold text-gray-800 text-lg">
            Messages
          </div>
          <div className="flex-1 overflow-y-auto">
            {friends.map(friend => (
              <div 
                key={friend._id}
                onClick={() => setActiveChat(friend)}
                className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 border-b transition ${activeChat?.uid === friend.uid ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
              >
                {friend.photo ? (
                  <img src={friend.photo} alt="" className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserIcon size={20} className="text-gray-500" />
                  </div>
                )}
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-semibold text-gray-900 truncate">{friend.name}</p>
                </div>
              </div>
            ))}
            {friends.length === 0 && (
              <div className="p-4 text-center text-gray-500 text-sm">No connections found.</div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-white border-b flex items-center shadow-sm">
                {activeChat.photo ? (
                  <img src={activeChat.photo} alt="" className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserIcon size={20} className="text-gray-500" />
                  </div>
                )}
                <div className="ml-3">
                  <p className="font-bold text-gray-900">{activeChat.name}</p>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    Send a message to start the conversation!
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isMine = msg.sender?.uid === user.uid || msg.sender === user._id || msg.sender?._id === user._id; // Accommodate populated and unpopulated
                    return (
                      <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMine ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm border'}`}>
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-[10px] mt-1 text-right ${isMine ? 'text-blue-200' : 'text-gray-400'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white border-t">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <button 
                    type="submit"
                    disabled={!inputText.trim()}
                    className="bg-blue-600 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition"
                  >
                    <Send size={18} className="ml-1" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <UserIcon size={64} className="mb-4 text-gray-300" />
              <p className="text-xl font-medium text-gray-500">Select a connection to start messaging</p>
            </div>
          )}
        </div>

      </div>
    </ProtectedRoute>
  );
};

export default Messages;
