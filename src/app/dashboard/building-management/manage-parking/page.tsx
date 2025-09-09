"use client";

import { useState, useMemo, useEffect } from "react";
import { useGetBuildingParkings } from "@/hooks/api/building-parkings";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Car,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  ParkingCircle,
  ArrowLeft,
  MapPin,
  Hash,
  Settings,
  AlertCircle,
  CheckCircle2,
  Clock,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function ManageParkingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: parkingsData, isLoading, error } = useGetBuildingParkings();

  const filteredParkings = useMemo(() => {
    const parkings = parkingsData?.data?.data || parkingsData?.data || [];
    if (!Array.isArray(parkings)) return [];

    return parkings.filter((parking) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        (parking.slot_number?.toLowerCase() || "").includes(searchLower) ||
        (parking.zone_name_zone_type?.toLowerCase() || "").includes(
          searchLower
        ) ||
        (parking.floor_level?.toLowerCase() || "").includes(searchLower) ||
        (parking.name?.toLowerCase() || "").includes(searchLower) ||
        (parking.unit_number?.toLowerCase() || "").includes(searchLower) ||
        (parking.vehicle_number?.toLowerCase() || "").includes(searchLower) ||
        (parking.vehicle_make?.toLowerCase() || "").includes(searchLower) ||
        (parking.vehicle_model?.toLowerCase() || "").includes(searchLower) ||
        (parking.vehicle_color?.toLowerCase() || "").includes(searchLower);

      return matchesSearch;
    });
  }, [parkingsData, searchQuery]);

  const paginatedParkings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredParkings.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredParkings, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredParkings.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const getStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="outline">-</Badge>;

    switch (status.toLowerCase()) {
      case "occupied":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <Car className="h-3 w-3 mr-1" />
            Occupied
          </Badge>
        );
      case "available":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Available
          </Badge>
        );
      case "reserved":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Reserved
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAllocationBadge = (allocationType: string | null) => {
    if (!allocationType) return <Badge variant="outline">-</Badge>;

    switch (allocationType.toLowerCase()) {
      case "permanent":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Permanent
          </Badge>
        );
      case "temporary":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            Temporary
          </Badge>
        );
      case "visitor":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            Visitor
          </Badge>
        );
      default:
        return <Badge variant="outline">{allocationType}</Badge>;
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "-";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="w-full px-4 py-8 space-y-8">
        {/* Header Skeleton */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 opacity-90"></div>
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative px-8 py-12">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="h-8 w-32 bg-white/20 rounded animate-pulse"></div>
                <div className="h-12 w-64 bg-white/20 rounded animate-pulse"></div>
                <div className="h-6 w-96 bg-white/20 rounded animate-pulse"></div>
              </div>
              <div className="text-right">
                <div className="h-16 w-16 bg-white/20 rounded animate-pulse"></div>
                <div className="h-6 w-24 bg-white/20 rounded animate-pulse mt-2"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search Skeleton */}
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-10 bg-muted rounded"></div>
          </CardContent>
        </Card>

        {/* Table Skeleton */}
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-32 bg-muted rounded"></div>
            <div className="h-4 w-48 bg-muted rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="w-full py-10 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 text-red-600 mb-4">
              <AlertCircle className="h-5 w-5" />
              <span>Error loading parking data</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Debug API response structure
  console.log("Parkings Data:", parkingsData);

  const parkings = parkingsData?.data?.data || parkingsData?.data || [];
  const totalSlots = Array.isArray(parkings) ? parkings.length : 0;
  const occupiedSlots = Array.isArray(parkings)
    ? parkings.filter((p) => p.status === "occupied").length
    : 0;
  const availableSlots = Array.isArray(parkings)
    ? parkings.filter((p) => p.status === "available").length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="w-full px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 opacity-90"></div>
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative px-8 py-12">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Link href="/dashboard/building-management">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Building Management
                    </Button>
                  </Link>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2 animate-fadeIn">
                    Manage Parking
                  </h1>
                  <p className="text-purple-100 text-lg animate-slideUp">
                    Manage parking spaces, assignments, and visitor parking
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold text-white animate-pulseGlow">
                  {totalSlots}
                </div>
                <div className="text-purple-100 text-lg">Total Slots</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideUp mt-8">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Total Slots
                  </p>
                  <p className="text-3xl font-bold">{totalSlots}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <ParkingCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Occupied</p>
                  <p className="text-3xl font-bold">{occupiedSlots}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Car className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Available
                  </p>
                  <p className="text-3xl font-bold">{availableSlots}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <Card className="shadow-lg border-0 animate-slideUp mt-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search parking slots, residents, vehicles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
                {searchQuery && (
                  <div className="text-sm text-gray-500 mt-1">
                    {filteredParkings.length} slot
                    {filteredParkings.length !== 1 ? "s" : ""} found
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Parking Slot
                </Button>
                <Button
                  variant="outline"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parking Table */}
        <Card className="shadow-lg border-0 animate-slideUp mt-8">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
              <ParkingCircle className="h-5 w-5 mr-2 text-purple-600" />
              Parking Slots
            </CardTitle>
            <CardDescription className="text-gray-600">
              Showing {paginatedParkings.length} of {filteredParkings.length}{" "}
              slots
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">
                      Slot Details
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Resident
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Vehicle
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Location
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Allocation
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedParkings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-96 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                            <ParkingCircle className="h-8 w-8 text-purple-600" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-lg font-medium text-gray-900">
                              No parking slots found
                            </p>
                            <p className="text-sm text-gray-500">
                              {searchQuery
                                ? "Try adjusting your search criteria"
                                : "Get started by adding parking slots to your building"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedParkings.map((parking) => (
                      <TableRow
                        key={parking.id}
                        className="hover:bg-purple-50/50 transition-colors duration-200 border-b border-gray-100"
                      >
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                              <Hash className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {parking.slot_number || "-"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {parking.floor_level || "-"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                              <span className="text-xs font-medium text-gray-600">
                                {getInitials(parking.name)}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {parking.name || "-"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {parking.unit_number || "-"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-gray-900">
                              {parking.vehicle_number || "-"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {parking.vehicle_make && parking.vehicle_model
                                ? `${parking.vehicle_make} ${parking.vehicle_model}`
                                : "-"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {parking.vehicle_color || "-"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            {parking.zone_name_zone_type || "-"}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(parking.status)}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          {getAllocationBadge(parking.allocation_type)}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="h-8 w-8 p-0 hover:bg-gray-100 rounded-md flex items-center justify-center">
                              <MoreHorizontal className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="cursor-pointer">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Slot
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <User className="h-4 w-4 mr-2" />
                                Assign Resident
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove Slot
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center animate-slideUp">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={
                        currentPage === page
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "border-purple-200 text-purple-700 hover:bg-purple-50"
                      }
                    >
                      {page}
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
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
