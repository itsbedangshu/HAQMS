'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/common/Navbar';
import { ArrowLeft, FileText, User } from 'lucide-react';
import Link from 'next/link';

export default function PatientHistoryRecords({ params }) {
  const { id } = params;
  const { user, token, API_BASE_URL } = useAuth();
  const router = useRouter();
  
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchPatientData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/patients/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setPatient(data);
        }
      } catch (err) {
        console.error('Failed to fetch patient records:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id, user, token, API_BASE_URL, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto p-6">
        <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-semibold text-base">
          <ArrowLeft className="h-5 w-5 mr-1" /> Back to Dashboard
        </Link>

        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-base font-medium text-gray-600">Loading diagnostic reports...</p>
            </div>
          ) : !patient ? (
            <div className="p-8 text-center bg-gray-100 rounded-lg text-gray-600 text-base font-medium border border-gray-300">
              Patient record not found or you do not have permission to view it.
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-start justify-between border-b border-gray-200 pb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <User className="h-8 w-8 text-blue-600" />
                    {patient.name}
                  </h1>
                  <div className="flex gap-4 mt-3 text-base text-gray-600 font-medium">
                    <span>Age: {patient.age}</span>
                    <span>Gender: {patient.gender}</span>
                    <span>Contact: {patient.phoneNumber}</span>
                  </div>
                </div>
                <div className="px-3 py-1 bg-blue-50 text-blue-700 font-bold text-sm uppercase rounded border border-blue-200">
                  ID: {patient.id.slice(0, 8)}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                  Clinical Anamnesis / Medical History
                </h3>
                <div className="p-5 rounded bg-gray-50 border border-gray-200 text-base leading-relaxed text-gray-800 font-normal">
                  {patient.medicalHistory ? patient.medicalHistory : 'No medical history recorded for this patient.'}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Past Appointments
                </h3>
                {patient.appointments && patient.appointments.length > 0 ? (
                  <div className="space-y-3">
                    {patient.appointments.map(app => (
                      <div key={app.id} className="p-4 rounded-lg border border-gray-200 bg-gray-50 flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-gray-900 text-base">
                            {new Date(app.appointmentDate).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Reason: {app.reason || 'None provided'}
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${app.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' : app.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-800'}`}>
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-base text-gray-600 italic">No previous appointments found.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
