// Resource: https://clerk.com/docs/nextjs/middleware#auth-middleware
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  // An array of public routes that don't require authentication.
  publicRoutes: ["/", "/api/webhook/clerk"],

  // An array of routes to be ignored by the authentication middleware.
  ignoredRoutes: ["/api/webhook/clerk"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
