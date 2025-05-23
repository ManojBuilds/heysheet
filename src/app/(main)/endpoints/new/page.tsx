import { createClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import NewEndpointForm from '@/components/NewEndpointFormModal';

export default async function NewEndpointPage() {
  const { userId } = await auth();
  
  if (!userId) {
    return redirect('/sign-in');
  }
  
  const supabase = await createClient();
  
  const { data: googleAccounts, error } = await supabase
    .from('google_accounts')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching Google accounts:', error);
    return <div>Error loading Google accounts</div>;
  }
  
  if (!googleAccounts || googleAccounts.length === 0) {
    return redirect('/dashboard?error=no_google_account');
  }
  
  return (
    <div className="container mx-auto py-8 max-w-lg">
      <div className="mb-6">
        <Link href="/dashboard" passHref>
          <Button variant="ghost" size="sm">
            ← Back to Dashboard
          </Button>
        </Link>
      </div>
      
      <div className="bg-card rounded-lg border p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Endpoint</h1>
        <NewEndpointForm/>
      </div>
    </div>
  );
}