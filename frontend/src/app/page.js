'use client';

import Link from 'next/link';
import { Activity, ShieldAlert, MonitorPlay, Users, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen justify-between bg-gray-50 py-12 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full text-center mt-12 sm:mt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-100 text-blue-700 text-sm font-semibold mb-6 border border-blue-200">
          <Activity className="h-4 w-4" />
          Live Queue Tracking Enabled
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900">
          HAQMS
        </h1>
        <p className="text-xl sm:text-2xl font-semibold mt-4 text-blue-600">
          Hospital Appointment & Queue Management System
        </p>
        
        <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto">
          Welcome to the HAQMS testing environment. This portal serves as a deliberately flawed, 
          fully functional reference application designed to evaluate software engineering candidates.
        </p>

        {/* Action Cards */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 max-w-2xl mx-auto">
          {/* Card 1: Staff Portal */}
          <Link href="/login" className="group block">
            <div className="bg-white p-8 rounded-lg shadow border border-gray-200 text-left hover:border-blue-300 hover:shadow-md transition-all duration-200">
              <div className="p-3 bg-blue-50 text-blue-600 rounded w-fit group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                <Users className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-xl font-bold text-gray-900 flex items-center gap-2">
                Staff Portal
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </h2>
              <p className="mt-2 text-gray-600 text-base">
                Access your specialized dashboard. Supports role-based workflows for Administrators, Doctors, and Receptionists.
              </p>
            </div>
          </Link>

          {/* Card 2: Public Queue Monitor */}
          <Link href="/queue" className="group block">
            <div className="bg-white p-8 rounded-lg shadow border border-gray-200 text-left hover:border-blue-300 hover:shadow-md transition-all duration-200">
              <div className="p-3 bg-blue-50 text-blue-600 rounded w-fit group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                <MonitorPlay className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-xl font-bold text-gray-900 flex items-center gap-2">
                Live Public Monitor
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </h2>
              <p className="mt-2 text-gray-600 text-base">
                Real-time active queue board tracking patient check-ins and calling tokens by physician. Built with live refresh.
              </p>
            </div>
          </Link>
        </div>

        {/* Assessment Notice Box */}
        <div className="mt-16 bg-white max-w-xl mx-auto p-6 rounded-lg border border-red-200 shadow-sm flex gap-4 text-left">
          <div className="p-2 bg-red-50 text-red-600 rounded h-fit">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Assessment Environment Notice</h3>
            <p className="mt-1 text-gray-600 text-base">
              This repository contains critical architectural, database performance, frontend memory, and security bugs. 
              Your evaluation criteria will measure your ability to identify, trace, profile, and fix these issues systematically.
            </p>
          </div>
        </div>
      </div>

      <footer className="text-center text-gray-500 text-sm mt-12">
        HAQMS v1.0.0-deliberate-bugs &copy; {new Date().getFullYear()} Candidate Evaluation Framework.
      </footer>
    </div>
  );
}
