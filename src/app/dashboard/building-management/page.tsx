"use client";

import Link from "next/link";
import Image from "next/image";
import {
  useGetBuildingStats,
  useGetBuildingStaff,
  TBuildingStaff,
} from "@/hooks/api/building-management";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building,
  Users,
  Home,
  Settings,
  Plus,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle,
  Loader2,
  XCircle,
  User,
  Shield,
  Car,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function BuildingManagementPage() {
  const [activeTab, setActiveTab] = useState<"active" | "engaged" | "absent">(
    "active"
  );

  const {
    data: buildingStatsData,
    isLoading,
    error,
    refetch,
  } = useGetBuildingStats();

  const {
    data: buildingStaffData,
    isLoading: isStaffLoading,
    error: staffError,
    refetch: refetchStaff,
  } = useGetBuildingStaff();

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <XCircle className="h-12 w-12 text-destructive" />
            <div>
              <h3 className="text-lg font-semibold text-destructive">
                Failed to load building data
              </h3>
              <p className="text-sm text-muted-foreground">
                Please try again later
              </p>
            </div>
            <Button onClick={() => refetch()} variant="outline">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const buildings = buildingStatsData?.data || [];
  const staff = buildingStaffData?.data || [];
  const totalUnits = buildings.reduce(
    (sum, building) => sum + building.total_units,
    0
  );
  const occupiedUnits = buildings.reduce(
    (sum, building) => sum + building.occupied_units,
    0
  );
  const totalResidents = buildings.reduce(
    (sum, building) => sum + building.total_residents,
    0
  );

  // Categorize staff by status
  const activeTodayStaff = staff.filter(
    (member) => member.staff_status === "active"
  );
  const currentlyEngagedStaff = staff.filter(
    (member) => member.staff_status === "engaged"
  );
  const absentStaff = staff.filter(
    (member) => member.staff_status === "absent"
  );

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "engaged":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Clock className="h-3 w-3 mr-1" />
            Engaged
          </Badge>
        );
      case "absent":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <XCircle className="h-3 w-3 mr-1" />
            Absent
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Compact staff row component
  const StaffRow = ({ member }: { member: TBuildingStaff }) => (
    <div className="flex items-center justify-between p-3 bg-white border border-purple-100 rounded-lg hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          {member.profile_image_url ? (
            <Image
              src={member.profile_image_url}
              alt={member.full_name}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover border-2 border-purple-200"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center border-2 border-purple-200">
              <User className="h-4 w-4 text-[#7d51ff]" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">
            {member.full_name}
          </p>
          <p className="text-xs text-gray-600 truncate">
            {member.role_name} • {member.department}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {getStatusBadge(member.staff_status)}
        <span className="text-xs text-gray-500 capitalize">
          {member.shift_type}
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header with Wow Factor */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#7d51ff] via-[#9d71ff] to-[#b591ff] p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        <div className="relative">
          <h1 className="text-5xl font-bold tracking-tight mb-2 animate-fade-in">
            {buildings.length > 0 ? buildings[0].name : "Building Management"}
          </h1>
          <p className="text-purple-100 text-xl">
            Complete building management and property oversight
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Stats with Wow Factor */}

      {/* Stats Section */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Residents
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {totalResidents}
                </p>
                <p className="text-xs text-gray-500">
                  Current building residents
                </p>
              </div>
              <Users className="h-8 w-8 text-[#7d51ff]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Units</p>
                <p className="text-3xl font-bold text-gray-800">{totalUnits}</p>
                <p className="text-xs text-gray-500">
                  Available units in building
                </p>
              </div>
              <Home className="h-8 w-8 text-[#7d51ff]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Occupied Units
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {occupiedUnits}
                </p>
                <p className="text-xs text-gray-500">
                  Currently occupied units
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-[#7d51ff]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Button
            className="h-16 bg-gradient-to-r from-[#7d51ff] to-[#9d71ff] hover:from-[#9d71ff] hover:to-[#b591ff] text-white shadow-lg hover:shadow-xl transition-all duration-300"
            asChild
          >
            <a href="/dashboard/building-management/manage-staff">
              <Users className="h-5 w-5 mr-2" />
              Manage Staff
            </a>
          </Button>
          <Button
            className="h-16 bg-gradient-to-r from-[#7d51ff] to-[#9d71ff] hover:from-[#9d71ff] hover:to-[#b591ff] text-white shadow-lg hover:shadow-xl transition-all duration-300"
            asChild
          >
            <Link href="/dashboard/building-management/manage-units">
              <Home className="h-5 w-5 mr-2" />
              Manage Units
            </Link>
          </Button>
          <Button
            className="h-16 bg-gradient-to-r from-[#7d51ff] to-[#9d71ff] hover:from-[#9d71ff] hover:to-[#b591ff] text-white shadow-lg hover:shadow-xl transition-all duration-300"
            asChild
          >
            <a href="/dashboard/building-management/manage-amenities">
              <Settings className="h-5 w-5 mr-2" />
              Manage Amenities
            </a>
          </Button>
          <Button
            className="h-16 bg-gradient-to-r from-[#7d51ff] to-[#9d71ff] hover:from-[#9d71ff] hover:to-[#b591ff] text-white shadow-lg hover:shadow-xl transition-all duration-300"
            asChild
          >
            <a href="/dashboard/building-management/manage-parking">
              <Car className="h-5 w-5 mr-2" />
              Manage Parking
            </a>
          </Button>
          <Button
            className="h-16 bg-gradient-to-r from-[#7d51ff] to-[#9d71ff] hover:from-[#9d71ff] hover:to-[#b591ff] text-white shadow-lg hover:shadow-xl transition-all duration-300"
            asChild
          >
            <a href="/dashboard/building-management/resident-directory">
              <Users className="h-5 w-5 mr-2" />
              Resident Directory
            </a>
          </Button>
          <Button
            className="h-16 bg-gradient-to-r from-[#7d51ff] to-[#9d71ff] hover:from-[#9d71ff] hover:to-[#b591ff] text-white shadow-lg hover:shadow-xl transition-all duration-300"
            asChild
          >
            <a href="/dashboard/building-management/building-settings">
              <Settings className="h-5 w-5 mr-2" />
              Building Settings
            </a>
          </Button>
        </div>
      </div>

      {/* Staff Sections - 50% width each */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Building Staff Card with Tabs */}
        <Card className="border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-200">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Users className="h-5 w-5 text-[#7d51ff]" />
              Building Staff
            </CardTitle>
            <CardDescription className="text-gray-600">
              Current staff members and their status
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            {isStaffLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">
                  Loading staff...
                </span>
              </div>
            ) : staffError ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
                <p className="text-sm text-destructive">
                  Failed to load staff data
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetchStaff()}
                  className="mt-2"
                >
                  Retry
                </Button>
              </div>
            ) : staff.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No staff members found
                </p>
              </div>
            ) : (
              <div className="w-full">
                {/* Custom Tab Navigation */}
                <div className="grid grid-cols-3 gap-1 bg-purple-50 border border-purple-200 rounded-lg p-1 mb-4">
                  <Button
                    variant={activeTab === "active" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("active")}
                    className={`text-xs ${
                      activeTab === "active"
                        ? "bg-[#7d51ff] text-white hover:bg-[#9d71ff]"
                        : "text-gray-700 hover:bg-purple-100"
                    }`}
                  >
                    Active Today ({activeTodayStaff.length})
                  </Button>
                  <Button
                    variant={activeTab === "engaged" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("engaged")}
                    className={`text-xs ${
                      activeTab === "engaged"
                        ? "bg-[#7d51ff] text-white hover:bg-[#9d71ff]"
                        : "text-gray-700 hover:bg-purple-100"
                    }`}
                  >
                    Currently Engaged ({currentlyEngagedStaff.length})
                  </Button>
                  <Button
                    variant={activeTab === "absent" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("absent")}
                    className={`text-xs ${
                      activeTab === "absent"
                        ? "bg-[#7d51ff] text-white hover:bg-[#9d71ff]"
                        : "text-gray-700 hover:bg-purple-100"
                    }`}
                  >
                    Absent ({absentStaff.length})
                  </Button>
                </div>

                {/* Tab Content */}
                <div className="space-y-2">
                  {activeTab === "active" && (
                    <>
                      {activeTodayStaff.length === 0 ? (
                        <div className="text-center py-6">
                          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            No active staff today
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {activeTodayStaff.slice(0, 6).map((member) => (
                            <StaffRow key={member.staff_id} member={member} />
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === "engaged" && (
                    <>
                      {currentlyEngagedStaff.length === 0 ? (
                        <div className="text-center py-6">
                          <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            No staff currently engaged
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {currentlyEngagedStaff.slice(0, 6).map((member) => (
                            <StaffRow key={member.staff_id} member={member} />
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === "absent" && (
                    <>
                      {absentStaff.length === 0 ? (
                        <div className="text-center py-6">
                          <XCircle className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            All staff are present
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {absentStaff.slice(0, 6).map((member) => (
                            <StaffRow key={member.staff_id} member={member} />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-purple-100">
              <Button className="w-full" variant="outline" asChild>
                <a href="/dashboard/building-management/manage-staff">
                  <Users className="h-4 w-4 mr-2" />
                  View All Staff
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Guards Card */}
        <Card className="border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-200">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Shield className="h-5 w-5 text-[#7d51ff]" />
              Security Guards
            </CardTitle>
            <CardDescription className="text-gray-600">
              Security personnel and their details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isStaffLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">
                  Loading security...
                </span>
              </div>
            ) : staffError ? (
              <div className="text-center py-4">
                <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
                <p className="text-sm text-destructive">
                  Failed to load security data
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetchStaff()}
                  className="mt-2"
                >
                  Retry
                </Button>
              </div>
            ) : (
              (() => {
                const securityStaff = staff.filter(
                  (member) =>
                    member.department.toLowerCase().includes("security") ||
                    member.department.toLowerCase().includes("guard")
                );
                return securityStaff.length === 0 ? (
                  <div className="text-center py-4">
                    <Shield className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No security guards found
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {securityStaff.slice(0, 4).map((member) => (
                      <div
                        key={member.staff_id}
                        className="flex items-center justify-between p-3 bg-white border border-purple-100 rounded-lg hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {member.profile_image_url ? (
                              <Image
                                src={member.profile_image_url}
                                alt={member.full_name}
                                width={32}
                                height={32}
                                className="h-8 w-8 rounded-full object-cover border-2 border-purple-200"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center border-2 border-purple-200">
                                <Shield className="h-4 w-4 text-[#7d51ff]" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {member.full_name}
                            </p>
                            <p className="text-xs text-gray-600 truncate">
                              {member.role_name} • {member.department}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(member.staff_status)}
                          <span className="text-xs text-gray-500">
                            ID: {member.employee_id}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()
            )}

            <div className="mt-4 pt-4 border-t border-purple-100">
              <Button className="w-full" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Security Guard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Buildings List */}
      <Card className="border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-200">
          <CardTitle className="text-gray-800">Buildings</CardTitle>
          <CardDescription className="text-gray-600">
            Overview of all managed properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          {buildings.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No buildings found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {buildings.map((building) => (
                <div
                  key={building.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{building.name}</h3>
                        {getStatusBadge(building.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {building.address}, {building.city}, {building.emirate}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Home className="h-3 w-3" />
                          {building.total_units} units •{" "}
                          {building.occupied_units} occupied
                        </span>
                        <span className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {building.total_floors} floors
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {building.total_residents} residents
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right text-sm">
                      <div className="flex items-center gap-1 mb-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {building.contact_email}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {building.contact_phone}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
