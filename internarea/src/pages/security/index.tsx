import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '@/config/api';
import { useSelector } from 'react-redux';
import { selectuser } from '@/Feature/Userslice';
import ProtectedRoute from '@/Components/ProtectedRoute';
import { Shield, AlertTriangle, Smartphone, Lock, Activity, LogIn } from 'lucide-react';
import { toast } from 'react-toastify';

const SecurityDashboard = () => {
  const user = useSelector(selectuser);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      axios.post(`${API_BASE_URL}/api/auth/login-history`, { uid: user.uid })
        .then(res => setHistory(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const activeSessions = history.filter(h => h.status === 'success').slice(0, 3);
  const suspiciousCount = history.filter(h => h.status === 'blocked').length;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Shield className="mr-2 text-green-600" /> Security Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Monitor your active sessions, trusted devices, and security alerts.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-start space-x-4">
              <div className="bg-blue-50 p-3 rounded-full"><Activity className="text-blue-600" /></div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Logins</h3>
                <p className="text-3xl font-bold text-gray-700">{history.length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-start space-x-4">
              <div className="bg-green-50 p-3 rounded-full"><Smartphone className="text-green-600" /></div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Active Devices</h3>
                <p className="text-3xl font-bold text-gray-700">{activeSessions.length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-start space-x-4">
              <div className="bg-red-50 p-3 rounded-full"><AlertTriangle className="text-red-600" /></div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Security Alerts</h3>
                <p className="text-3xl font-bold text-red-600">{suspiciousCount}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Active Sessions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Current Active Sessions & Trusted Devices</h2>
              </div>
              <div className="p-4 space-y-4">
                {activeSessions.length === 0 ? (
                  <p className="text-gray-500 text-sm">No recent successful sessions found.</p>
                ) : activeSessions.map((session, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <Smartphone className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{session.os} • {session.browser}</p>
                        <p className="text-xs text-gray-500">{session.ip} • {new Date(session.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    {idx === 0 && <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Current</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Account Risk Analysis */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Account Risk Analysis</h2>
              </div>
              <div className="p-6 text-center flex flex-col items-center">
                {suspiciousCount > 0 ? (
                  <>
                    <div className="w-24 h-24 rounded-full border-4 border-red-500 flex items-center justify-center mb-4">
                      <span className="text-3xl font-bold text-red-600">HIGH</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">High Risk Detected</h3>
                    <p className="text-sm text-gray-500 mt-2">We have blocked {suspiciousCount} suspicious login attempts recently. Consider changing your password.</p>
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold flex items-center">
                      <Lock className="w-4 h-4 mr-2" /> Change Password
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center mb-4">
                      <span className="text-3xl font-bold text-green-600">LOW</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Your account is secure</h3>
                    <p className="text-sm text-gray-500 mt-2">No suspicious activity detected. All security measures are currently active.</p>
                  </>
                )}
              </div>
            </div>

          </div>

          {/* Full Login Logs */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-200 flex items-center">
              <LogIn className="mr-2 text-gray-600 w-5 h-5" />
              <h2 className="text-lg font-semibold text-gray-900">Detailed Login Attempts & OTP Activity Logs</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Browser & OS</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location (IP)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-4 text-gray-500">Loading logs...</td></tr>
                  ) : history.length === 0 ? (
                     <tr><td colSpan={5} className="text-center py-4 text-gray-500">No logs found.</td></tr>
                  ) : history.map((log, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.browser} on {log.os}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.ip}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          log.status === 'success' ? 'bg-green-100 text-green-800' :
                          log.status === 'blocked' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {log.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs font-bold ${
                          log.status === 'success' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {log.status === 'success' ? 'LOW' : 'HIGH'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SecurityDashboard;
