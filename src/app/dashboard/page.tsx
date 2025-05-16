import { createClient } from "@/lib/supabase/server";
import { getGoogleAuthUrl } from "@/lib/google/auth";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { PlusCircle, RefreshCw, ExternalLink, Copy, Plus } from "lucide-react";
import RecentSubmissions from "../endpoints/[id]/RecentSubmissions";
import NewEndpointForm from "../../components/NewEndpointFormModal";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return <div>Not authenticated</div>;
  }

  const supabase = await createClient();

  // Get user's Google accounts
  const { data: googleAccounts } = await supabase
    .from("google_accounts")
    .select("*")
    .eq("user_id", userId);

  // Get user's endpoints
  const { data: endpoints } = await supabase
    .from("endpoints")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  // Get recent submissions for user's endpoints
  const endpointIds = endpoints?.map((endpoint) => endpoint.id) || [];
  // const { data: submissions } = await supabase
  //   .from('submissions')
  //   .select('id, created_at, status, sheet_row_number, form_data, endpoint_id')
  //   .in('endpoint_id', endpointIds)
  //   .order('created_at', { ascending: false })
  //   .limit(10);
  const { data: submissions } = await supabase
    .from("submissions")
    .select("*")
    .in("endpoint_id", endpointIds)
    .order("created_at", { ascending: false })
    .limit(10);

  // Generate Google auth URL
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;
  const state = JSON.stringify({ redirectUrl: "/dashboard" });
  const googleAuthUrl = getGoogleAuthUrl(redirectUri, state);

  return (
    <div className="container p-8 mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Google Accounts Section */}
        <div className="bg-card rounded-lg border p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Google Accounts</h2>

          {googleAccounts && googleAccounts.length > 0 ? (
            <div className="">
              {googleAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                >
                  <div>
                    <p className="font-medium">{account.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Connected{" "}
                      {new Date(account.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              ))}

              <div className="mt-4">
                <Link href={googleAuthUrl} passHref>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Connect Another Account
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Connect your Google account to create form endpoints
              </p>
              <Link href={googleAuthUrl} passHref>
                <Button>Connect Google Account</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Endpoints Section */}
        <div className="bg-card rounded-lg border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Form Endpoints</h2>
            <Link
              href={"/endpoints/new"}
              className={buttonVariants({ variant: "default" })}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create new endpoint
            </Link>
          </div>

          {endpoints && endpoints.length > 0 ? (
            <div className="space-y-2">
              {endpoints.map((endpoint) => (
                <div key={endpoint.id} className="p-4 border rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{endpoint.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Link href={`/endpoints/${endpoint.id}`} passHref>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">
                    {endpoint.description || "No description"}
                  </p>

                  <div className="bg-muted p-2 rounded text-xs font-mono overflow-x-auto">
                    {`${process.env.NEXT_PUBLIC_APP_URL}/api/submit/${endpoint.slug}`}
                  </div>

                  <div className="mt-3 flex items-center text-sm">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        endpoint.is_active ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span>{endpoint.is_active ? "Active" : "Inactive"}</span>

                    {endpoint.spreadsheet_id && (
                      <a
                        href={`https://docs.google.com/spreadsheets/d/${endpoint.spreadsheet_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-primary flex items-center"
                      >
                        View Sheet
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                {googleAccounts && googleAccounts.length > 0
                  ? "You haven't created any endpoints yet"
                  : "Connect a Google account to create endpoints"}
              </p>

              {googleAccounts && googleAccounts.length > 0 && (
                <Link href="/endpoints/new" passHref>
                  <Button>Create Your First Endpoint</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recent Submissions Section */}
      <div className="mt-8">
        <RecentSubmissions submissions={submissions} />
      </div>
    </div>
  );
}
