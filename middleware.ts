import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define the protected route
const isProtectedRoute = createRouteMatcher(["/", "/scan-product"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Protect the homepage route
    "/",
    "/scan-product",
    "/history",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
