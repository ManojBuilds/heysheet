import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { config as myConfig } from "./config";

// These routes are publicly accessible and do not require authentication.
const isPublicRoute = createRouteMatcher([
  "/",
  "/f/(.*)",
  "/api/s/(.*)",
  "/api/webhooks/(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/checkout(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  if (req.nextUrl.pathname.startsWith("/f/")) {
    const response = NextResponse.next();
    response.headers.delete("x-frame-options");
    return response;
  }

  if (req.nextUrl.pathname === "/") {
    const { userId } = await auth();
    if (userId) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL(myConfig.afterSignOutUrl, req.url));
    }
  }
});

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    "/((?!.*\\..*|_next).*)",
    // Re-include the root route
    "/",
  ],
};
