import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '@/config/api';
import { 
  Briefcase, 
  Mail, 
  Send,
  Users,
  BarChart,
  Settings
} from 'lucide-react';
import Link from 'next/link';

const AdminPanel = () => {
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalInternships: 0,
    totalApplications: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/admin/analytics`)
      .then(res => setStatsData(res.data))
      .catch(err => console.error("Failed to fetch admin stats"));
  }, []);

  const stats = [
    { label: 'Total Users', value: statsData.totalUsers, change: '+12%', changeType: 'positive' },
    { label: 'Active Jobs', value: statsData.totalJobs, change: '+3%', changeType: 'positive' },
    { label: 'Active Internships', value: statsData.totalInternships, change: '+24%', changeType: 'positive' },
    { label: 'Total Applications', value: statsData.totalApplications, change: '+8%', changeType: 'positive' },
  ];
    
      const menuItems = [
        {
          title: 'View Applications',
          description: 'View and manage all applications from candidates',
          icon: Mail,
          link: '/applications',
          color: 'bg-blue-600',
        },
        {
          title: 'Post Job',
          description: 'Create and publish new job opportunities',
          icon: Briefcase,
          link: '/postJob',
          color: 'bg-green-600',
        },
        {
          title: 'Post Internship',
          description: 'Create and manage internship positions',
          icon: Send,
          link: '/postInternship',
          color: 'bg-purple-600',
        },
        {
          title: 'Manage Users',
          description: 'View and manage user accounts',
          icon: Users,
          link: '/users',
          color: 'bg-orange-600',
        },
        {
          title: 'Analytics',
          description: 'View detailed reports and statistics',
          icon: BarChart,
          link: '/analytics',
          color: 'bg-red-600',
        },
        {
          title: 'Settings',
          description: 'Configure system preferences',
          icon: Settings,
          link: '/settings',
          color: 'bg-gray-600',
        },
      ];
  return (
    <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your jobs, internships, and applications
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 truncate">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.link}
            className="block bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className={`${item.color} p-3 rounded-lg`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
  )
}

export default AdminPanel