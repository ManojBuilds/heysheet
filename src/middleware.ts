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
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  await auth.protect()

  if (isPublicRoute(req)) {
    if (req.nextUrl.pathname === "/" && userId) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next(); 
  }

  if (!userId) {
    const url = new URL(myConfig.afterSignOutUrl);
    url.searchParams.append('requiredLogin', 'true');
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
