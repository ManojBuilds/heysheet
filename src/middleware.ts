import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/form-builder(.*)",
  "/manage-plan",
  "/checkout"
]);

export default clerkMiddleware(async (auth, req, event) => {
  const path = req.nextUrl.pathname;
  console.log('Processing path:', path);

  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    console.log('🔒 Protected route, requiring auth', path);
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes except /api/s/
    "/(api|trpc)(?!.*\\/api\\/s\\/).*",
    // Exclude /f/ routes from middleware
    "/((?!f\\/).*)",
  ],
};
