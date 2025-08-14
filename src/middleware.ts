import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { config as myConfig } from "./config";

const isPublicRoute = createRouteMatcher([
  "/",
  "/f/(.*)",
  "/api/s/(.*)",
  "/api/webhooks/(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/checkout(.*)",
  "/api/auth/(.*)",
  "/api/subscriptions"
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const url = new URL(myConfig.afterSignOutUrl);
  url.searchParams.append("requiredLogin", "true");
  if (isPublicRoute(req)) {
    if (req.nextUrl.pathname === "/" && userId) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    if (req.nextUrl.pathname === "/" && !userId) {
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (!userId) {
    return NextResponse.redirect(url);
  }

  if (req.nextUrl.pathname.startsWith("/f/")) {
    const response = NextResponse.next();
    response.headers.delete("x-frame-options");
    return response;
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    "/((?!.*\\..*|_next).*)",
    // Re-include the root route
    "/",
  ],
};
