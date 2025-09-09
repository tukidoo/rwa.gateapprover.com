"use client";

import { useGetBuildingStaff } from "@/hooks/api/building-management";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  UserPlus,
  ArrowLeft,
  User,
  Shield,
  Phone,
  Mail,
  Loader2,
  AlertTriangle,
  Calendar,
  Clock,
  Globe,
  UserCheck,
  History,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function ManageStaffPage() {
  const {
    data: buildingStaffData,
    isLoading,
    error,
    refetch,
  } = useGetBuildingStaff();

  const staff = buildingStaffData?.data || [];

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDepartmentBadge = (department: string) => {
    switch (department.toLowerCase()) {
      case "maintenance":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Maintenance
          </Badge>
        );
      case "security":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Security
          </Badge>
        );
      case "cleaning":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Cleaning
          </Badge>
        );
      default:
        return <Badge variant="outline">{department}</Badge>;
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
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
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
            <h3 className="text-lg font-medium text-destructive mb-2">
              Failed to load staff data
            </h3>
            <p className="text-muted-foreground mb-4">
              There was an error loading the staff information. Please try
              again.
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-gray-800 hover:text-gray-900 hover:bg-purple-50"
        >
          <a
            href="/dashboard/building-management"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Building Management
          </a>
        </Button>
      </div>

      {/* Page Header with Wow Factor */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#7d51ff] via-[#9d71ff] to-[#b591ff] p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        <div className="relative">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Manage Staff
          </h1>
          <p className="text-purple-100 text-lg">
            Manage building staff members, roles, and permissions.
          </p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      {/* Staff List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Staff Members ({staff.length})
          </CardTitle>
          <CardDescription>
            Manage all building staff members and their roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2 text-muted-foreground">
                Loading staff...
              </span>
            </div>
          ) : staff.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No staff members found
              </h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first staff member to the building.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Staff Member
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {staff.map((member) => (
                <Card
                  key={member.staff_id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Avatar Section */}
                      <div className="flex-shrink-0">
                        {member.profile_image_url ? (
                          <Image
                            src={member.profile_image_url}
                            alt={member.full_name}
                            width={64}
                            height={64}
                            className="h-16 w-16 rounded-full object-cover border-2 border-muted"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-muted">
                            <User className="h-8 w-8 text-primary" />
                          </div>
                        )}
                      </div>

                      {/* Main Info Section */}
                      <div className="flex-1 min-w-0">
                        {/* Header Row */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">
                              {member.full_name}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-sm">
                                {member.role_name}
                              </Badge>
                              {getDepartmentBadge(member.department)}
                              {getStatusBadge(member.staff_status)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/dashboard/building-management/manage-staff/${member.staff_id}/history`}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-purple-600 border-purple-200 hover:bg-purple-50"
                              >
                                <History className="h-4 w-4 mr-2" />
                                History
                              </Button>
                            </Link>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <User className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Contact Information */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              Contact Information
                            </h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span className="truncate">{member.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <span>{member.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Globe className="h-3 w-3 text-muted-foreground" />
                                <span>{member.lang_known}</span>
                              </div>
                            </div>
                          </div>

                          {/* Employment Details */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                              <UserCheck className="h-3 w-3" />
                              Employment Details
                            </h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <Shield className="h-3 w-3 text-muted-foreground" />
                                <span>ID: {member.employee_id}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span>Shift: {member.shift_type}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span>
                                  Hired:{" "}
                                  {member.hire_date !== "0000-00-00"
                                    ? member.hire_date
                                    : "Not set"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Emergency Contact */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              Emergency Contact
                            </h4>
                            <div className="space-y-1 text-sm">
                              {member.emergency_contact_name ? (
                                <>
                                  <div className="flex items-center gap-2">
                                    <User className="h-3 w-3 text-muted-foreground" />
                                    <span>{member.emergency_contact_name}</span>
                                  </div>
                                  {member.emergency_contact_phone && (
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-3 w-3 text-muted-foreground" />
                                      <span>
                                        {member.emergency_contact_phone}
                                      </span>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <span className="text-muted-foreground italic">
                                  No emergency contact set
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
