import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/form-builder(.*)",
  "/manage-plan",
  "/checkout",
]);

export default clerkMiddleware(async (auth, req) => {
  const path = req.nextUrl.pathname;
  console.log("🔎 Processing path:", path);

  if (path === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (path.startsWith("/f/")) {
    console.log("🚪 Skipping Clerk for public form route:", path);
    return NextResponse.next();
  }

  if (path.startsWith("/api/s/")) {
    console.log("🚪 Skipping auth for form submit:", path);
    return NextResponse.next();
  }

  if (isProtectedRoute(req)) {
    console.log("🔒 Protected route:", path);
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Exclude _next, static files, f/, and api/s/
    "/((?!_next|.*\\..*|f\/|api\/s\/).*)",
  ],
};
