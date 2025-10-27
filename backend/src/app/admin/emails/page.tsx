'use client';

import { useState, useEffect } from 'react';

interface EmailLog {
  timestamp: string;
  type: string;
  to: string;
  subject: string;
  content: string;
}

interface Signup {
  id: string;
  name: string;
  email: string;
  birthday: string;
  emailSubscription: boolean;
  createdAt: string;
}

export default function EmailAdminDashboard() {
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'emails' | 'signups'>('emails');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch email logs
      const emailResponse = await fetch('/api/admin/emails');
      const emailData = await emailResponse.json();
      setEmailLogs(emailData.emails || []);

      // Fetch signups
      const signupResponse = await fetch('/api/admin/signups');
      const signupData = await signupResponse.json();
      setSignups(signupData.signups || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getEmailTypeColor = (type: string) => {
    switch (type) {
      case 'signup-notification':
        return 'bg-blue-100 text-blue-800';
      case 'welcome':
        return 'bg-green-100 text-green-800';
      case 'bulk-update':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading email admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">📧 Email Admin Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage email logs and beta signups
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('emails')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'emails'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📬 Email Logs ({emailLogs.length})
              </button>
              <button
                onClick={() => setActiveTab('signups')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'signups'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                👥 Beta Signups ({signups.length})
              </button>
            </nav>
          </div>

          {/* Email Logs Tab */}
          {activeTab === 'emails' && (
            <div className="p-6">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Email Logs</h2>
                <button
                  onClick={fetchData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  🔄 Refresh
                </button>
              </div>

              {emailLogs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No email logs found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {emailLogs.map((log, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEmailTypeColor(log.type)}`}>
                            {log.type}
                          </span>
                          <span className="text-sm text-gray-600">{formatDate(log.timestamp)}</span>
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <p className="font-medium text-gray-900">To: {log.to}</p>
                        <p className="text-sm text-gray-700">Subject: {log.subject}</p>
                      </div>
                      
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{log.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Signups Tab */}
          {activeTab === 'signups' && (
            <div className="p-6">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Beta Signups</h2>
                <button
                  onClick={fetchData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  🔄 Refresh
                </button>
              </div>

              {signups.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No beta signups found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Birthday
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email Subscription
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Signup Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {signups.map((signup) => (
                        <tr key={signup.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {signup.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {signup.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {signup.birthday}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              signup.emailSubscription 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {signup.emailSubscription ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(signup.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
