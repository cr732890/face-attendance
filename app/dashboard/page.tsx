import { createServerSupabase } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ScannerClient } from '@/components/ScannerClient';

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_user_id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ScannerClient profile={profile} />
    </div>
  );
}
