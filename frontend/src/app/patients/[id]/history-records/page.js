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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-8">
        <Link href="/dashboard" className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-6 font-bold text-sm">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
        </Link>

        <div className="glass p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="pulse-loader">
                <div></div>
                <div></div>
              </div>
              <p className="mt-4 text-xs font-semibold text-slate-400 animate-pulse">Loading diagnostic reports...</p>
            </div>
          ) : !patient ? (
            <div className="p-8 text-center bg-slate-100 dark:bg-slate-800/40 rounded-xl text-slate-400 text-sm font-semibold border border-dashed border-slate-200 dark:border-slate-700">
              Patient record not found or you do not have permission to view it.
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
                <div>
                  <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <User className="h-6 w-6 text-teal-600" />
                    {patient.name}
                  </h1>
                  <div className="flex gap-4 mt-2 text-sm text-slate-500 font-semibold">
                    <span>Age: {patient.age}</span>
                    <span>Gender: {patient.gender}</span>
                    <span>Contact: {patient.phoneNumber}</span>
                  </div>
                </div>
                <div className="px-3 py-1 bg-teal-500/10 text-teal-600 dark:text-teal-400 font-extrabold text-xs uppercase tracking-widest rounded-lg">
                  ID: {patient.id.slice(0, 8)}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-teal-600" />
                  Clinical Anamnesis / Medical History
                </h3>
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                  {patient.medicalHistory ? patient.medicalHistory : 'No medical history recorded for this patient.'}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mb-4">
                  Past Appointments
                </h3>
                {patient.appointments && patient.appointments.length > 0 ? (
                  <div className="space-y-3">
                    {patient.appointments.map(app => (
                      <div key={app.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-500/5 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                            {new Date(app.appointmentDate).toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-500 font-medium mt-1">
                            Reason: {app.reason || 'None provided'}
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xxs font-extrabold tracking-wide uppercase ${app.status === 'COMPLETED' ? 'bg-teal-500/10 text-teal-600' : app.status === 'CANCELLED' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">No previous appointments found.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
