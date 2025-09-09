"use client";

import {
  useGetUnitsList,
  useUpdateOccupancy,
} from "@/hooks/api/building-management";
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
import { Input } from "@/components/ui/input";
import {
  Home,
  Plus,
  Search,
  MoreHorizontal,
  Building,
  ArrowLeft,
  ArrowRight,
  Loader2,
  AlertTriangle,
  User,
  UserX,
  Wrench,
  Phone,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import Link from "next/link";

export default function ManageUnitsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: unitsData, isLoading, error, refetch } = useGetUnitsList();

  const updateOccupancyMutation = useUpdateOccupancy();

  const allUnits = unitsData?.data || [];

  // Filter units based on search query
  const filteredUnits = useMemo(() => {
    if (!searchQuery.trim()) {
      return allUnits;
    }

    const query = searchQuery.toLowerCase().trim();
    return allUnits.filter((unit) => {
      // Search by unit number
      const unitNumberMatch = unit.unit_number.toLowerCase().includes(query);

      // Search by tenant name (if exists)
      const tenantNameMatch =
        unit.user_name && unit.user_name.toLowerCase().includes(query);

      return unitNumberMatch || tenantNameMatch;
    });
  }, [unitsData?.data, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUnits = filteredUnits.slice(startIndex, endIndex);

  // Reset to first page when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "occupied":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100">
            <User className="h-3 w-3 mr-1" />
            Occupied
          </Badge>
        );
      case "vacant":
        return (
          <Badge className="bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-100">
            <UserX className="h-3 w-3 mr-1" />
            Vacant
          </Badge>
        );
      case "maintenance":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">
            <Wrench className="h-3 w-3 mr-1" />
            Maintenance
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-100 text-slate-800 border-slate-200">
            {status}
          </Badge>
        );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "occupied":
        return <User className="h-4 w-4 text-emerald-600" />;
      case "vacant":
        return <UserX className="h-4 w-4 text-slate-600" />;
      case "maintenance":
        return <Wrench className="h-4 w-4 text-amber-600" />;
      default:
        return <Home className="h-4 w-4 text-slate-500" />;
    }
  };

  const handleStatusUpdate = async (
    unitId: number,
    unitNumber: string,
    newStatus: "occupied" | "vacant" | "maintenance"
  ) => {
    try {
      const requestData = {
        unit_id: unitId.toString(),
        occupancy_status: newStatus,
      };

      console.log("Sending update request:", requestData);

      await updateOccupancyMutation.mutateAsync(requestData);
      toast.success(`Unit ${unitNumber} status updated to ${newStatus}`);
      refetch();
    } catch (error) {
      console.error("Error updating unit status:", error);
      console.error("Request data was:", {
        unit_id: unitId.toString(),
        occupancy_status: newStatus,
      });
      toast.error("Failed to update unit status");
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-[#6e2e3a] hover:text-[#8b3a4a] hover:bg-red-50"
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
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
            <h3 className="text-lg font-medium text-destructive mb-2">
              Failed to load units data
            </h3>
            <p className="text-muted-foreground mb-4">
              There was an error loading the units information. Please try
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

      {/* Page Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#7d51ff] via-[#9d71ff] to-[#b591ff] p-8 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="relative">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Manage Units
          </h1>
          <p className="text-purple-100 text-lg">
            Manage building units, occupancy status, and tenant assignments.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
          <Input
            placeholder="Search by unit number or tenant name..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-10 border-purple-200 focus:border-[#7d51ff] focus:ring-[#7d51ff]/20"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
              onClick={() => handleSearchChange("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Unit
        </Button>
      </div>

      {/* Units List */}
      <Card className="border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-200">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Home className="h-5 w-5 text-[#7d51ff]" />
            Building Units ({filteredUnits.length}
            {searchQuery && ` of ${allUnits.length}`})
          </CardTitle>
          <CardDescription className="text-gray-600">
            {searchQuery
              ? `Search results for "${searchQuery}"`
              : "Manage all units in the building and their occupancy status"}
            {totalPages > 1 && (
              <span className="ml-2 text-sm font-medium">
                • Page {currentPage} of {totalPages}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2 text-muted-foreground">
                Loading units...
              </span>
            </div>
          ) : allUnits.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No units found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding units to your building.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Unit
              </Button>
            </div>
          ) : filteredUnits.length === 0 ? (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No units found</h3>
              <p className="text-muted-foreground mb-4">
                No units match your search for &quot;{searchQuery}&quot;. Try a
                different search term.
              </p>
              <Button variant="outline" onClick={() => handleSearchChange("")}>
                <X className="h-4 w-4 mr-2" />
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedUnits.map((unit) => (
                <Card
                  key={unit.id}
                  className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-200 hover:border-l-[#7d51ff]"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Unit Icon */}
                      <div className="flex-shrink-0">
                        <div
                          className={`h-16 w-16 rounded-xl flex items-center justify-center border-2 ${
                            unit.status === "occupied"
                              ? "bg-emerald-50 border-emerald-200"
                              : unit.status === "vacant"
                              ? "bg-slate-50 border-slate-200"
                              : "bg-amber-50 border-amber-200"
                          }`}
                        >
                          {getStatusIcon(unit.status)}
                        </div>
                      </div>

                      {/* Main Info Section */}
                      <div className="flex-1 min-w-0">
                        {/* Header Row */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">
                              Unit {unit.unit_number}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusBadge(unit.status)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/dashboard/building-management/manage-units/${unit.id}`}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-[#7d51ff] border-[#7d51ff] hover:bg-[#7d51ff] hover:text-white"
                              >
                                <ArrowRight className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                            </Link>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={updateOccupancyMutation.isPending}
                                >
                                  {updateOccupancyMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <MoreHorizontal className="h-4 w-4" />
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusUpdate(
                                      unit.id,
                                      unit.unit_number,
                                      "occupied"
                                    )
                                  }
                                  disabled={
                                    unit.status === "occupied" ||
                                    updateOccupancyMutation.isPending
                                  }
                                  className="text-emerald-700 hover:bg-emerald-50 focus:bg-emerald-50"
                                >
                                  <User className="h-4 w-4 mr-2 text-emerald-600" />
                                  Mark as Occupied
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusUpdate(
                                      unit.id,
                                      unit.unit_number,
                                      "vacant"
                                    )
                                  }
                                  disabled={
                                    unit.status === "vacant" ||
                                    updateOccupancyMutation.isPending
                                  }
                                  className="text-slate-700 hover:bg-slate-50 focus:bg-slate-50"
                                >
                                  <UserX className="h-4 w-4 mr-2 text-slate-600" />
                                  Mark as Vacant
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusUpdate(
                                      unit.id,
                                      unit.unit_number,
                                      "maintenance"
                                    )
                                  }
                                  disabled={
                                    unit.status === "maintenance" ||
                                    updateOccupancyMutation.isPending
                                  }
                                  className="text-amber-700 hover:bg-amber-50 focus:bg-amber-50"
                                >
                                  <Wrench className="h-4 w-4 mr-2 text-amber-600" />
                                  Mark for Maintenance
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Unit Information */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                              <Home className="h-3 w-3" />
                              Unit Information
                            </h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Status:</span>
                                <span className="capitalize">
                                  {unit.status}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Tenant Information */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                              <User className="h-3 w-3" />
                              Tenant Information
                            </h4>
                            <div className="space-y-1 text-sm">
                              {unit.user_id ? (
                                <>
                                  <div className="flex items-center gap-2">
                                    <User className="h-3 w-3 text-muted-foreground" />
                                    <span className="truncate">
                                      {unit.user_name}
                                    </span>
                                  </div>
                                  {unit.contact_no && (
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-3 w-3 text-muted-foreground" />
                                      <span>{unit.contact_no}</span>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <span className="text-muted-foreground italic">
                                  No tenant assigned
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Tenant Photo */}
                        {unit.user_id && unit.photo_url && (
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex items-center gap-3">
                              <Image
                                src={unit.photo_url}
                                alt={unit.user_name}
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded-full object-cover border-2 border-muted"
                              />
                              <div>
                                <p className="text-sm font-medium">
                                  {unit.user_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Tenant Photo
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-purple-200 bg-gradient-to-r from-purple-50/50 to-violet-50/50">
            <div className="text-sm text-gray-700 font-medium">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredUnits.length)} of{" "}
              {filteredUnits.length} units
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="border-purple-200 text-gray-700 hover:bg-purple-50 disabled:opacity-50"
              >
                Previous
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 p-0 ${
                        currentPage === pageNum
                          ? "bg-[#7d51ff] hover:bg-[#9d71ff] text-white"
                          : "border-purple-200 text-gray-700 hover:bg-purple-50"
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="border-purple-200 text-gray-700 hover:bg-purple-50 disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
