import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/form-builder(.*)",
  "/manage-plan",
  "/checkout"
]);

const isPublicApiRoute = createRouteMatcher([
  "/api/s/(.*)"
]);

const isPublicFormRoute = createRouteMatcher([
  "/f/(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  const path = req.nextUrl.pathname;
  console.log('Processing path:', path);

  // // Handle public API routes first (form submissions)
  // if (isPublicApiRoute(req)) {
  //   console.log('🚫 Skip auth for public form submission endpoint', path);
  //   const res = NextResponse.next();

  //   // // Add CORS headers for API endpoints
  //   // res.headers.set("Access-Control-Allow-Origin", "*");
  //   // res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  //   // res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  //   return res;
  // }

  // // Handle public form embed routes (iframe-friendly)
  // if (isPublicFormRoute(req)) {
  //   console.log('🌐 Public form embed route', path);
  //   const res = NextResponse.next();

  //   // // Set iframe-friendly headers for embeds
  //   // res.headers.set("Content-Security-Policy", "frame-ancestors *");
  //   // res.headers.set("X-Frame-Options", "ALLOWALL");
  //   // // Add CORS and CORP headers for public form embeds
  //   // res.headers.set("Access-Control-Allow-Origin", "*");
  //   // res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  //   // res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  //   // res.headers.set("Cross-Origin-Resource-Policy", "cross-origin");

  //   return res;
  // }

  // Protect other routes
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
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
