"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Save,
  Building,
  Phone,
  Mail,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";

export default function BuildingSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Back Link */}
      <div>
        <Button variant="ghost" size="sm" asChild>
          <a
            href="/dashboard/building-management"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Building Management
          </a>
        </Button>
      </div>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Building Settings</h1>
        <p className="text-muted-foreground mt-1.5">
          Configure building information, contact details, and system settings.
        </p>
      </div>

      {/* Building Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Building Information
          </CardTitle>
          <CardDescription>
            Update basic building details and information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Settings Coming Soon</h3>
            <p className="text-muted-foreground mb-4">
              Building settings and configuration options will be available
              here.
            </p>
            <Button disabled>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Information
          </CardTitle>
          <CardDescription>
            Manage building contact details and emergency information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Contact Settings</h3>
            <p className="text-muted-foreground mb-4">
              Configure contact information and emergency contacts.
            </p>
            <Button disabled>
              <Save className="h-4 w-4 mr-2" />
              Update Contacts
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            System Settings
          </CardTitle>
          <CardDescription>
            Configure system preferences and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">System Configuration</h3>
            <p className="text-muted-foreground mb-4">
              Advanced system settings and configuration options.
            </p>
            <Button disabled>
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
