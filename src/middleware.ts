import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define which routes are protected
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/form-builder(.*)",
  "/manage-plan",
  "/checkout"
]);

export default clerkMiddleware(async (auth, req) => {
  const path = req.nextUrl.pathname;
  console.log("🔎 Processing path:", path);

  // ✅ Skip Clerk auth for public form submit API
  if (path.startsWith("/api/s/")) {
    console.log("🚪 Skipping auth for form submit:", path);
    return NextResponse.next();
  }

  // 🔒 Protect defined routes
  if (isProtectedRoute(req)) {
    console.log("🔒 Protected route:", path);
    await auth.protect()
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Run middleware for all app routes except static files
    "/((?!_next|.*\\..*|f\\/).*)",
    // But explicitly skip /api/s/*
    "/api/:path*",
  ],
};
