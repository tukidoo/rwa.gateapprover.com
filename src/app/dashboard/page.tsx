"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import {
  Users,
  FileText,
  Bell,
  Settings,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function DashboardPage() {
  const { session } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {session.user?.first_name}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your account today.
        </p>
      </div>

      {/* Notice Analytics Cards */}

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Profile Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Name:</span>
                <span className="text-sm text-muted-foreground">
                  {session.user?.first_name} {session.user?.last_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm text-muted-foreground">
                  {session.user?.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">User Type:</span>
                <span className="text-sm text-muted-foreground capitalize">
                  {session.user?.user_type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">User ID:</span>
                <span className="text-sm text-muted-foreground">
                  #{session.user?.id}
                </span>
              </div>
            </div>
            <Button className="w-full" variant="outline">
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Account Status Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
            <CardDescription>Verification and account health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email Verified</span>
                <div className="flex items-center space-x-1">
                  {session.user?.email_verified ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {session.user?.email_verified ? "Verified" : "Not Verified"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Phone Verified</span>
                <div className="flex items-center space-x-1">
                  {session.user?.phone_verified ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {session.user?.phone_verified ? "Verified" : "Not Verified"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Language</span>
                <span className="text-sm text-muted-foreground capitalize">
                  {session.user?.preferred_language || "English"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Building ID</span>
                <span className="text-sm text-muted-foreground">
                  {session.user?.building_id || "Not assigned"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Unit ID</span>
                <span className="text-sm text-muted-foreground">
                  {session.user?.unit_id || "Not assigned"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              View Documents
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Bell className="w-4 h-4 mr-2" />
              Check Notifications
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Account Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest actions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Profile updated</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Successfully logged in</p>
                <p className="text-xs text-muted-foreground">Just now</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Password change requested</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
