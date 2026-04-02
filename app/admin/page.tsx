import { createServerSupabase } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { DeleteStudentButton } from '@/components/DeleteStudentButton';

export default async function AdminPortalPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Verify Role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('auth_user_id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-200 max-w-md w-full text-center">
           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 text-2xl font-black">!</div>
           <h2 className="text-xl font-bold text-gray-900">Access Denied</h2>
           <p className="text-gray-500 mt-2 text-sm leading-relaxed mb-6">
             You are logged in as a student. Only authorized administrators can access the command center.
           </p>
           <Link href="/enroll" className="inline-block w-full py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 transition-colors">
             Go back to My Profile
           </Link>
        </div>
      </div>
    );
  }

  // Fetch all students and their logs relationship using Service Role key to bypass RLS restrictions!
  const { createClient } = require('@supabase/supabase-js');
  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: students, error } = await adminSupabase
    .from('profiles')
    .select('*, attendance_logs(id, status)')
    .eq('role', 'student')
    .order('created_at', { ascending: false });

  if (error) {
     console.error("Admin fetch error:", error);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-indigo-600 text-white px-8 py-8 rounded-2xl shadow-md">
          <div>
            <h1 className="text-3xl font-black mb-1">Global Organization Records</h1>
            <p className="text-indigo-200">System-wide registry and attendance overviews.</p>
          </div>
          <div className="bg-white/10 px-6 py-4 rounded-xl text-center border border-indigo-400">
             <div className="text-3xl font-black">{students?.length || 0}</div>
             <div className="text-xs text-indigo-200 uppercase tracking-widest mt-1 font-semibold">Total Students</div>
          </div>
        </header>

        <main className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Registered Student Masterlist</h2>
              <Link 
                href="/admin/add-student"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-500 transition-colors shadow-sm"
              >
                + Register New Student
              </Link>
           </div>

           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100 text-left">
                   <th className="font-semibold px-6 py-4">Student Name</th>
                   <th className="font-semibold px-6 py-4">Department</th>
                   <th className="font-semibold px-6 py-4">Total Logs</th>
                   <th className="font-semibold px-6 py-4">Presence Rate</th>
                   <th className="font-semibold px-6 py-4 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {students?.map(student => {
                   const logs = student.attendance_logs as any[];
                   const total = logs?.length || 0;
                   const present = logs?.filter(l => l.status === 'present').length || 0;
                   const rate = total > 0 ? Math.round((present / total) * 100) : 0;

                   return (
                     <tr key={student.id} className="hover:bg-gray-50/50 transition-colors group">
                       <td className="px-6 py-5">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center text-xs">
                               {student.full_name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                               <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{student.full_name}</div>
                               <div className="text-xs text-gray-500">{student.email}</div>
                            </div>
                         </div>
                       </td>
                       <td className="px-6 py-5 text-gray-500 text-sm">
                         {student.department || 'Undeclared'}
                       </td>
                       <td className="px-6 py-5 text-gray-700 font-mono text-sm">
                         {total} Sessions
                       </td>
                       <td className="px-6 py-5">
                         <div className="flex items-center gap-3 w-full max-w-[120px]">
                           <span className="text-sm font-semibold text-gray-700 w-8">{rate}%</span>
                           <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                             <div className={`h-full ${rate >= 75 ? 'bg-green-500' : rate >= 40 ? 'bg-amber-500' : 'bg-red-500'} rounded-full`} style={{ width: `${rate}%` }}></div>
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-5 text-right">
                         <div className="flex items-center justify-end gap-2">
                           <Link 
                             href={`/students/${student.id}`} 
                             className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 text-sm font-semibold rounded-lg text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors shadow-sm"
                           >
                             View Profile
                           </Link>
                           <DeleteStudentButton profileId={student.id} studentName={student.full_name} />
                         </div>
                       </td>
                     </tr>
                   );
                 })}
                 {(!students || students.length === 0) && (
                   <tr>
                     <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                       No students have registered in the database yet.
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </main>

      </div>
    </div>
  );
}
