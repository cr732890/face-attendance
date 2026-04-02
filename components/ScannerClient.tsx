'use client';
import { useState } from 'react';
import { WebcamAttendance } from '@/components/WebcamAttendance';
import Link from 'next/link';

export function ScannerClient({ profile }: { profile: any }) {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isScanning, setIsScanning] = useState(false);

  // Example class ID for now
  const classId = "class-123-demo";
  const sessionId = `session-${selectedDate}`;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      <header className="flex items-center justify-between bg-white px-8 py-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Instructor Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {profile?.full_name || 'Instructor'}</p>
        </div>
        <div className="flex items-center gap-4">
           {isScanning && (
             <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20 animate-pulse">
               ● Session Active
             </span>
           )}
           <Link 
             href={`/dashboard/session/${sessionId}`}
             className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-500 transition-colors shadow-sm"
           >
             📊 View Results for {selectedDate}
           </Link>
        </div>
      </header>

      <main className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Virtual Classroom Door</h2>
            <p className="text-gray-500 mt-1">Students passing by the camera are securely verified and marked as present automatically.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Target Date</label>
              <input 
                 type="date" 
                 value={selectedDate}
                 onChange={(e) => setSelectedDate(e.target.value)}
                 disabled={isScanning}
                 className="block w-full rounded-lg border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:opacity-50"
              />
            </div>
            <button
               onClick={() => setIsScanning(!isScanning)}
               className={`mt-5 px-6 py-2 text-white font-semibold rounded-lg shadow-sm transition-colors ${
                 isScanning ? 'bg-red-500 hover:bg-red-400' : 'bg-indigo-600 hover:bg-indigo-500'
               }`}
            >
               {isScanning ? 'Stop Camera' : 'Start Camera'}
            </button>
          </div>
        </div>
        
        {isScanning ? (
          <WebcamAttendance classId={classId} sessionId={sessionId} />
        ) : (
        <div className="h-[480px] w-[640px] max-w-full mx-auto bg-gray-900 rounded-2xl flex flex-col items-center justify-center text-gray-500 border-4 border-gray-800 shadow-inner gap-4">
           <div className="w-16 h-16 mb-2 rounded-full bg-gray-800 flex items-center justify-center text-3xl">🎥</div>
           <p className="font-medium text-lg text-gray-400">Camera Offline</p>
           <p className="text-sm">Select a date and click Start Camera to begin the session.</p>
           <Link 
             href={`/dashboard/session/${sessionId}`}
             className="mt-4 px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-500 transition-colors shadow-sm text-sm"
           >
             📊 View Session Results for {selectedDate}
           </Link>
        </div>
        )}
      </main>

    </div>
  );
}
