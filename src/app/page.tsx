"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { session } = useAuth();
  const router = useRouter();

  // Redirect logged in users to dashboard
  useEffect(() => {
    if (session.user && !session.loading) {
      router.replace("/dashboard");
    }
  }, [session.user, session.loading, router]);

  // Show loading if checking auth or redirecting
  if (session.loading || session.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to RWA
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Please sign in to access your dashboard
          </p>
          <div className="space-y-4">
            <Button onClick={() => router.push("/login")} className="w-full">
              Sign In
            </Button>
            <Button
              onClick={() => router.push("/register")}
              variant="outline"
              className="w-full"
            >
              Create Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
