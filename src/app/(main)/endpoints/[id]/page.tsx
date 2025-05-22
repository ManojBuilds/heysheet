import { createClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import CodeSnippet from "./CodeSnippet";
import RecentSubmissions from "./RecentSubmissions";

export default async function EndpointDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const supabase = await createClient();
  const { id } = await params;

  // Get endpoint details
  const { data: endpoint, error } = await supabase
    .from("endpoints")
    .select(
      `
      *,
      google_accounts(*)
    `
    )
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error || !endpoint) {
    return notFound();
  }

  // Get recent submissions
  const { data: submissions } = await supabase
    .from("submissions")
    .select("*")
    .eq("endpoint_id", endpoint.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const endpointUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/submit/${endpoint.slug}`;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/dashboard" passHref>
          <Button variant="ghost" size="sm">
            ← Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="bg-card rounded-lg border p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold">{endpoint.name}</h1>
            {endpoint.description && (
              <p className="text-muted-foreground mt-1">
                {endpoint.description}
              </p>
            )}
          </div>

          {/* <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Edit
            </Button>
            <Button variant="outline" size="sm" className="text-destructive">
              Delete
            </Button>
          </div> */}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-medium mb-2">Endpoint Details</h3>
            <dl className="space-y-2">
              <div className="grid grid-cols-3 gap-1">
                <dt className="text-muted-foreground">Status:</dt>
                <dd className="col-span-2 flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      endpoint.is_active ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span>{endpoint.is_active ? "Active" : "Inactive"}</span>
                </dd>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <dt className="text-muted-foreground">Slug:</dt>
                <dd className="col-span-2 font-mono text-sm">
                  {endpoint.slug}
                </dd>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <dt className="text-muted-foreground">Google Account:</dt>
                <dd className="col-span-2">
                  {endpoint.google_accounts?.email || "None"}
                </dd>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <dt className="text-muted-foreground">Sheet Name:</dt>
                <dd className="col-span-2">{endpoint.sheet_name}</dd>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <dt className="text-muted-foreground">Header Row:</dt>
                <dd className="col-span-2">
                  {endpoint.header_row ? "Yes" : "No"}
                </dd>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <dt className="text-muted-foreground">Created:</dt>
                <dd className="col-span-2">
                  {new Date(endpoint.created_at).toLocaleDateString()}
                </dd>
              </div>
            </dl>

            {endpoint.spreadsheet_id && (
              <div className="mt-4">
                <a
                  href={`https://docs.google.com/spreadsheets/d/${endpoint.spreadsheet_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary"
                >
                  <Button>
                    View Google Sheet
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </a>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-medium mb-2">Endpoint URL</h3>
            <div className="bg-muted p-3 rounded font-mono text-sm mb-4 overflow-x-auto">
              {endpointUrl}
            </div>

            <CodeSnippet endpointUrl={endpointUrl} />
          </div>
        </div>
      </div>
      <Link
        href={`/form-builder?endpoint_id=${id}`}
        className={buttonVariants({ variant: "default" })}
      >
        Build form by form builder
      </Link>
      <RecentSubmissions submissions={submissions} />
    </div>
  );
}
