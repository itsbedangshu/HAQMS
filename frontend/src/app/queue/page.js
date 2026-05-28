'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/common/Navbar';
import { Monitor, RefreshCw, AlertCircle, Bell } from 'lucide-react';

export default function QueueMonitor() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://haqms-hsyp.onrender.com/api';

  const fetchQueueData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/queue`);
      if (!res.ok) throw new Error('Failed to retrieve active token queue.');
      const data = await res.json();
      setTokens(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueData();
    const intervalId = setInterval(() => {
      setRefreshCount((prev) => prev + 1);
      fetchQueueData();
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const groupedTokens = tokens.reduce((groups, token) => {
    const docId = token.doctorId;
    if (!groups[docId]) {
      groups[docId] = {
        doctorName: token.doctor.name,
        specialization: token.doctor.specialization,
        calling: null,
        waiting: [],
      };
    }
    if (token.status === 'CALLING') {
      groups[docId].calling = token;
    } else if (token.status === 'WAITING') {
      groups[docId].waiting.push(token);
    }
    return groups;
  }, {});

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded">
              <Monitor className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Live Public Monitor Board
              </h1>
              <p className="text-sm text-gray-600 font-medium mt-1">
                Real-time physician calling boards. Auto-syncs every 3 seconds.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-200">
              <RefreshCw className="h-4 w-4" />
              Auto Refreshing
            </span>
            <div className="p-2 bg-gray-100 rounded text-gray-600 text-sm font-mono border border-gray-200">
              Polls: {refreshCount}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded bg-red-50 border border-red-200 text-red-600 flex items-center gap-3 text-base">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div><strong>Sync Error:</strong> {error}</div>
          </div>
        )}

        {loading && tokens.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-lg font-medium text-gray-600">Loading active token queues...</div>
          </div>
        ) : Object.keys(groupedTokens).length === 0 ? (
          <div className="bg-white p-12 text-center rounded-lg border border-gray-200">
            <Bell className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-4 text-xl font-bold text-gray-900">No Active Tokens</h3>
            <p className="mt-2 text-gray-600 text-base max-w-md mx-auto">
              There are currently no patient check-ins registered for today.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(groupedTokens).map(([docId, docInfo]) => (
              <div key={docId} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col h-full">
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <h3 className="font-bold text-xl text-gray-900">{docInfo.doctorName}</h3>
                  <p className="text-sm text-blue-600 font-semibold mt-1">{docInfo.specialization}</p>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Now Calling</h4>
                    {docInfo.calling ? (
                      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg text-center shadow-sm">
                        <span className="block text-4xl font-bold text-blue-700">#{docInfo.calling.tokenNumber}</span>
                        <span className="block text-sm font-medium text-gray-700 mt-2">Patient: {docInfo.calling.patient.name}</span>
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg text-center">
                        <span className="block text-xl font-semibold text-gray-500 italic">Idle</span>
                        <span className="block text-sm font-medium text-gray-500 mt-2">No active patients</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Queue List</h4>
                    {docInfo.waiting.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {docInfo.waiting.map((token) => (
                          <div key={token.id} className="px-3 py-1.5 rounded bg-gray-100 border border-gray-300 text-sm font-semibold text-gray-800" title={`Patient: ${token.patient.name}`}>
                            #{token.tokenNumber}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 italic block">No upcoming patients in queue</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
