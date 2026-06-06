import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '@/config/api';
import { useSelector } from 'react-redux';
import { selectuser } from '@/Feature/Userslice';
import ProtectedRoute from '@/Components/ProtectedRoute';
import { Briefcase, Users, FileText, CheckCircle, Clock, XCircle, Search } from 'lucide-react';
import { toast } from 'react-toastify';

const EmployerDashboard = () => {
  const user = useSelector(selectuser);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchApplications = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/application/employer/${user.uid}`);
      setApplications(res.data);
    } catch (err: any) {
      if (err.response?.status === 400) {
        toast.info("Please set up your Company Name in settings first to view applications.");
      } else {
        toast.error("Failed to load applications");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await axios.put(`${API_BASE_URL}/api/application/status/${id}`, { status: newStatus });
      toast.success(`Application updated to ${newStatus}`);
      fetchApplications();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'interview': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'hired': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApps = filter === 'All' ? applications : applications.filter(app => app.status === filter.toLowerCase());

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Briefcase className="mr-2 text-blue-600" /> Employer ATS Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your applicants and track hiring progress.
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg p-5">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg"><Users className="text-blue-600" /></div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 truncate">Total Applicants</p>
                  <p className="text-2xl font-semibold text-gray-900">{applications.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg p-5">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-lg"><Clock className="text-yellow-600" /></div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 truncate">Pending Review</p>
                  <p className="text-2xl font-semibold text-gray-900">{applications.filter(a => a.status === 'pending').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg p-5">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg"><FileText className="text-purple-600" /></div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 truncate">In Interviews</p>
                  <p className="text-2xl font-semibold text-gray-900">{applications.filter(a => a.status === 'interview').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg p-5">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg"><CheckCircle className="text-green-600" /></div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 truncate">Hired</p>
                  <p className="text-2xl font-semibold text-gray-900">{applications.filter(a => a.status === 'hired').length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Kanban / Table View */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
              <div className="flex space-x-2">
                {['All', 'Pending', 'Reviewing', 'Interview', 'Hired', 'Rejected'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full ${filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading applicants...</div>
              ) : filteredApps.length === 0 ? (
                <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                  <Users className="w-12 h-12 text-gray-300 mb-3" />
                  <p>No applicants found for this category.</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied For</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApps.map((app) => (
                      <tr key={app._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full" src={app.user?.photo || '/logo.png'} alt="" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{app.user?.name}</div>
                              <div className="text-sm text-gray-500">{app.user?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-semibold">{app.Application?.title}</div>
                          <div className="text-xs text-gray-500 uppercase">{app.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(app.status)}`}>
                            {app.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <select 
                            value={app.status}
                            onChange={(e) => updateStatus(app._id, e.target.value)}
                            className="border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 p-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="interview">Interview</option>
                            <option value="hired">Hired</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default EmployerDashboard;
