// import { createClient } from "@/lib/supabase/server";
// import { auth } from "@clerk/nextjs/server";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
import ManagePlanPage from "./MangePlanPage";

export default async function ManagePlan() {
  // await auth.protect();
  // const { userId } = await auth();
  // const supabase = await createClient();

  // const { data: userData, error: userError } = await supabase
  //   .from("users")
  //   .select("paddle_customer_id")
  //   .eq("clerk_user_id", userId)
  //   .single();

  // const { data: subscriptionData, error: subscriptionError } = await supabase
  //   .from("subscriptions")
  //   .select("plan, status, current_period_end")
  //   .eq("clerk_user_id", userId)
  //   .single();

  // const hasError = userError || !userData?.paddle_customer_id || subscriptionError || !subscriptionData;

  return <ManagePlanPage/>

  // return (
  //   <div className="w-full max-w-4xl px-6 py-10 space-y-6">
  //     <div className="flex items-center justify-between">
  //       <h1 className="text-2xl font-semibold">Plan & Billing</h1>
  //     </div>

  //     <Card>
  //       <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
  //         <div>
  //           <CardTitle>Current Plan</CardTitle>
  //           <p className="text-sm text-muted-foreground">Your usage is renewed every month</p>
  //         </div>
  //         {!hasError && (
  //           <div className="space-x-2">
  //             <Button variant="outline">Cancel Subscription</Button>
  //             <Button variant="outline">Manage Payments</Button>
  //             <Button>Change Plan</Button>
  //           </div>
  //         )}
  //       </CardHeader>

  //       <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  //         {hasError ? (
  //           <p className="text-red-600 col-span-full">
  //             {userError || !userData?.paddle_customer_id
  //               ? "Paddle customer ID not found."
  //               : "No active subscription found."}
  //           </p>
  //         ) : (
  //           <>
  //             <div>
  //               <p className="text-sm text-muted-foreground mb-1">Monthly plan</p>
  //               <p className="text-lg font-medium">₹50/monthly</p>
  //               <Badge variant="secondary" className="mt-1">Hobby</Badge>
  //               <Badge variant="default" className="ml-2 mt-1">Active</Badge>
  //             </div>

  //             <div>
  //               <p className="text-sm text-muted-foreground mb-1">Renew at</p>
  //               <p className="text-lg font-medium">
  //                 {new Date(subscriptionData.current_period_end).toLocaleDateString(undefined, {
  //                   year: "numeric",
  //                   month: "short",
  //                   day: "numeric",
  //                 })}
  //               </p>
  //             </div>

  //             <div>
  //               <p className="text-sm text-muted-foreground mb-2">Chat credits</p>
  //               <p className="text-base font-medium">100 of 2000</p>
  //               <Progress value={(3000 / 2000) * 100} className="mt-1" />
  //             </div>

  //             <div>
  //               <p className="text-sm text-muted-foreground mb-2">Chatbots</p>
  //               <p className="text-base font-medium">{3} of 3</p>
  //               <Progress value={(2 / 3) * 100} className="mt-1" />
  //             </div>

  //             <div>
  //               <p className="text-sm text-muted-foreground mb-2">Document pages</p>
  //               <p className="text-base font-medium">{2} of 1000</p>
  //               <Progress value={(2000 / 1000) * 100} className="mt-1" />
  //             </div>

  //             <div>
  //               <form action="/api/paddle/customer-portal" method="GET">
  //                 <Button className="w-full">Open Customer Portal</Button>
  //               </form>
  //             </div>
  //           </>
  //         )}
  //       </CardContent>
  //     </Card>
  //   </div>
  // );
}
