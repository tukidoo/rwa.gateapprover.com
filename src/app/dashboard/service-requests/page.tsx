"use client";

import { useState, useMemo } from "react";
import { useGetAllServiceRequests } from "@/hooks/api/service-requests";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  Clipboard,
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Eye,
  ArrowLeft,
  Hash,
  Building,
  Calendar,
  Settings,
  Wrench,
  Home,
  Filter,
  Zap,
  Droplets,
  Shield,
  Trash2,
  Wifi,
  Car,
  Lock,
  Lightbulb,
  Thermometer,
  Camera,
  Key,
  Hammer,
  Cog,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

export default function ServiceRequestPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: serviceRequests,
    isLoading,
    isError,
    error,
  } = useGetAllServiceRequests();

  const filteredRequests = useMemo(() => {
    if (!serviceRequests?.data?.requests) return [];

    return serviceRequests.data.requests.filter((request) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        (request.ticket_number?.toLowerCase() || "").includes(searchLower) ||
        (request.title?.toLowerCase() || "").includes(searchLower) ||
        (request.requester_name?.toLowerCase() || "").includes(searchLower) ||
        (request.category_name?.toLowerCase() || "").includes(searchLower) ||
        (request.unit_number?.toLowerCase() || "").includes(searchLower) ||
        (request.building_name?.toLowerCase() || "").includes(searchLower);

      const matchesStatus =
        statusFilter === "all" || request.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || request.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [
    serviceRequests?.data?.requests,
    searchQuery,
    statusFilter,
    priorityFilter,
  ]);

  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRequests, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Open
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            In Progress
          </Badge>
        );
      case "pending_approval":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            Pending Approval
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Resolved
          </Badge>
        );
      case "closed":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Closed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status || "-"}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Low
          </Badge>
        );
      default:
        return <Badge variant="secondary">{priority || "-"}</Badge>;
    }
  };

  const getCategoryIcon = (categoryName: string | null) => {
    if (!categoryName) return <Wrench className="h-5 w-5 text-gray-400" />;

    const category = categoryName.toLowerCase();

    if (
      category.includes("electrical") ||
      category.includes("electric") ||
      category.includes("power")
    ) {
      return <Zap className="h-5 w-5 text-yellow-600" />;
    }
    if (
      category.includes("plumbing") ||
      category.includes("water") ||
      category.includes("pipe")
    ) {
      return <Droplets className="h-5 w-5 text-blue-600" />;
    }
    if (
      category.includes("security") ||
      category.includes("safety") ||
      category.includes("cctv")
    ) {
      return <Shield className="h-5 w-5 text-red-600" />;
    }
    if (
      category.includes("cleaning") ||
      category.includes("sanitation") ||
      category.includes("waste")
    ) {
      return <Trash2 className="h-5 w-5 text-green-600" />;
    }
    if (
      category.includes("internet") ||
      category.includes("wifi") ||
      category.includes("network")
    ) {
      return <Wifi className="h-5 w-5 text-purple-600" />;
    }
    if (
      category.includes("parking") ||
      category.includes("vehicle") ||
      category.includes("garage")
    ) {
      return <Car className="h-5 w-5 text-gray-600" />;
    }
    if (
      category.includes("door") ||
      category.includes("lock") ||
      category.includes("access")
    ) {
      return <Lock className="h-5 w-5 text-orange-600" />;
    }
    if (
      category.includes("light") ||
      category.includes("lamp") ||
      category.includes("bulb")
    ) {
      return <Lightbulb className="h-5 w-5 text-yellow-500" />;
    }
    if (
      category.includes("hvac") ||
      category.includes("air") ||
      category.includes("heating") ||
      category.includes("cooling")
    ) {
      return <Thermometer className="h-5 w-5 text-cyan-600" />;
    }
    if (
      category.includes("camera") ||
      category.includes("surveillance") ||
      category.includes("monitoring")
    ) {
      return <Camera className="h-5 w-5 text-indigo-600" />;
    }
    if (
      category.includes("key") ||
      category.includes("access") ||
      category.includes("card")
    ) {
      return <Key className="h-5 w-5 text-amber-600" />;
    }
    if (
      category.includes("maintenance") ||
      category.includes("repair") ||
      category.includes("fix")
    ) {
      return <Hammer className="h-5 w-5 text-slate-600" />;
    }
    if (
      category.includes("general") ||
      category.includes("other") ||
      category.includes("misc")
    ) {
      return <Cog className="h-5 w-5 text-gray-600" />;
    }

    // Default fallback
    return <Wrench className="h-5 w-5 text-gray-400" />;
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="w-full py-10 px-4">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Service Requests</AlertTitle>
            <AlertDescription>
              {error?.message ||
                "Failed to load service requests. Please try again later."}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const totalRequests = serviceRequests?.data?.requests.length || 0;
  const pendingRequests =
    serviceRequests?.data?.requests.filter(
      (r) => r.status === "open" || r.status === "pending_approval"
    ).length || 0;
  const completedRequests =
    serviceRequests?.data?.requests.filter(
      (r) => r.status === "resolved" || r.status === "closed"
    ).length || 0;

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
                  <Link href="/dashboard">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Dashboard
                    </Button>
                  </Link>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2 animate-fadeIn">
                    Service Requests
                  </h1>
                  <p className="text-purple-100 text-lg animate-slideUp">
                    Manage and track all service requests in your facility
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold text-white animate-pulseGlow">
                  {totalRequests}
                </div>
                <div className="text-purple-100 text-lg">Total Requests</div>
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
                    Total Requests
                  </p>
                  <p className="text-3xl font-bold">{totalRequests}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Clipboard className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold">{pendingRequests}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Completed
                  </p>
                  <p className="text-3xl font-bold">{completedRequests}</p>
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
                  placeholder="Search requests, requester, category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="pending_approval">
                      Pending Approval
                    </SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  New Request
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

        {/* Service Requests Table */}
        <Card className="shadow-lg border-0 animate-slideUp mt-8">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
              <Wrench className="h-5 w-5 mr-2 text-purple-600" />
              Service Requests
            </CardTitle>
            <CardDescription className="text-gray-600">
              Showing {paginatedRequests.length} of {filteredRequests.length}{" "}
              requests
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">
                      Ticket Details
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Requester
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Category
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Priority
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Location
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Created
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-96 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                            <Clipboard className="h-8 w-8 text-purple-600" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-lg font-medium text-gray-900">
                              No service requests found
                            </p>
                            <p className="text-sm text-gray-500">
                              {searchQuery ||
                              statusFilter !== "all" ||
                              priorityFilter !== "all"
                                ? "Try adjusting your search criteria"
                                : "New requests will appear here"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedRequests.map((request) => (
                      <TableRow
                        key={request.id}
                        className="hover:bg-purple-50/50 transition-colors duration-200 border-b border-gray-100"
                      >
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                              <Hash className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 font-mono">
                                {request.ticket_number || "-"}
                              </div>
                              <div className="text-sm text-gray-500">
                                Ticket ID
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {request.title || "-"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {request.requester_name || "-"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {request.icon_url ? (
                              <Image
                                src={request.icon_url}
                                alt={request.category_name || ""}
                                className="w-5 h-5"
                                width={20}
                                height={20}
                              />
                            ) : (
                              getCategoryIcon(request.category_name || null)
                            )}
                            <span className="text-sm text-gray-900">
                              {request.category_name || "-"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          {getPriorityBadge(request.priority || "")}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(request.status || "")}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-900">
                              <Home className="h-4 w-4 mr-2 text-gray-400" />
                              Unit {request.unit_number || "-"}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Building className="h-4 w-4 mr-2 text-gray-400" />
                              Floor {request.floor_number || "-"},{" "}
                              {request.building_name || "-"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            {request.created_at
                              ? format(request.created_at, "MMM dd, yyyy")
                              : "-"}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(
                                    `/dashboard/service-requests/${request.id}`
                                  )
                                }
                                className="cursor-pointer"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Request
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

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="w-full px-4 py-8 space-y-8">
        {/* Header Skeleton */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 opacity-90"></div>
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative px-8 py-12">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <Skeleton className="h-8 w-32 bg-white/20" />
                <Skeleton className="h-10 w-64 bg-white/20" />
                <Skeleton className="h-6 w-96 bg-white/20" />
              </div>
              <div className="text-right">
                <Skeleton className="h-12 w-20 bg-white/20 mb-2" />
                <Skeleton className="h-6 w-32 bg-white/20" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search Skeleton */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <Skeleton className="h-10 w-full max-w-md" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table Skeleton */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <TableHead key={i}>
                        <Skeleton className="h-4 w-20" />
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Skeleton className="h-5 w-5" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-3 w-28" />
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <Skeleton className="h-8 w-8 rounded" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
