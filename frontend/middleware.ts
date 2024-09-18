import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/',
]);

export default clerkMiddleware((auth, request) => {
  if(isProtectedRoute(request)) {
    auth().protect(); 
  }

  return NextResponse.next();
})


export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  // Skip Next.js internals and all static files, unless found in search params
  // include for api files
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};