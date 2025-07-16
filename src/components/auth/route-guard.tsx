"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

interface RouteGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function RouteGuard({
  children,
  redirectTo = "/login",
}: RouteGuardProps) {
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!session.loading && !session.user) {
      router.replace(redirectTo);
    }
  }, [session.loading, session.user, router, redirectTo]);

  // Show loading spinner while checking auth
  if (session.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!session.user) {
    return null;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}
