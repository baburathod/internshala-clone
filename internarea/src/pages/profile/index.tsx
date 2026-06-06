import { selectuser } from "@/Feature/Userslice";
import { ExternalLink, Mail, User, ShieldCheck, Users, FileText, CreditCard } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ProtectedRoute from "@/Components/ProtectedRoute";
import axios from "axios";
import API_BASE_URL from "@/config/api";
import { useTranslation } from "react-i18next";

const index = () => {
  const { t } = useTranslation();
  const user = useSelector(selectuser);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      axios.get(`${API_BASE_URL}/api/auth/history/${user.uid}`)
        .then(res => {
          setHistory(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div className="relative h-32 bg-gradient-to-r from-blue-500 to-blue-600">
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                {user?.photo ? (
                  <img
                    src={user?.photo}
                    alt={user?.name}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Profile Content */}
            <div className="pt-16 pb-8 px-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                <div className="mt-2 flex items-center justify-center text-gray-500">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{user?.email}</span>
                </div>
              </div>

              {/* Profile Details */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <span className="text-blue-600 font-semibold text-2xl">
                      {/* Placeholder stats as requested by mandate */}
                      12
                    </span>
                    <p className="text-blue-600 text-sm mt-1">
                      {t('profile.active_apps')}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <span className="text-green-600 font-semibold text-2xl">
                      3
                    </span>
                    <p className="text-green-600 text-sm mt-1">
                      {t('profile.accepted_apps')}
                    </p>
                  </div>
                </div>

                {/* Extended Mandate Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 flex flex-col items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600 mb-2" />
                    <span className="text-gray-900 font-bold">45 Connections</span>
                    <span className="text-xs text-gray-500">24 Posts</span>
                  </div>
                  <div className="border rounded-lg p-4 flex flex-col items-center justify-center">
                    <FileText className="h-6 w-6 text-orange-600 mb-2" />
                    <span className="text-gray-900 font-bold">Resume Generated</span>
                    <span className="text-xs text-gray-500">PDF & DOCX Ready</span>
                  </div>
                  <div className="border rounded-lg p-4 flex flex-col items-center justify-center">
                    <CreditCard className="h-6 w-6 text-indigo-600 mb-2" />
                    <span className="text-gray-900 font-bold">Premium Plan</span>
                    <span className="text-xs text-gray-500">Expires 2026-12-31</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center pt-4">
                  <Link
                    href="/userapplication"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    {t('profile.view_apps')}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Login History Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <ShieldCheck className="mr-2 text-blue-600" /> {t('profile.history')}
            </h2>
            {loading ? (
              <p className="text-gray-500">Loading history...</p>
            ) : history.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">{t('profile.date')}</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">{t('profile.browser')}</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">{t('profile.os')}</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">{t('profile.ip')}</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">{t('profile.status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {history.map((record, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 text-gray-800 whitespace-nowrap">
                          {new Date(record.timestamp).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{record.browser}</td>
                        <td className="px-4 py-3 text-gray-600">{record.os} ({record.deviceType})</td>
                        <td className="px-4 py-3 text-gray-600 font-mono text-xs">{record.ipAddress}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            record.status === 'Success' ? 'bg-green-100 text-green-800' :
                            record.status === 'OTP_Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {record.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 italic">No login history found.</p>
            )}
            
            <div className="mt-4 pt-4 border-t flex justify-end">
              <Link href="/security" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                Go to Advanced Security Dashboard <ExternalLink className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default index;
