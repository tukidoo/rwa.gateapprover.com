"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  History,
  ArrowLeft,
  Star,
  Hash,
  Home,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useGetStaffHistory } from "@/hooks/api/staff-history";
import { useGetBuildingStaff } from "@/hooks/api/building-management";
import Link from "next/link";

export default function StaffHistoryPage() {
  const params = useParams();
  const staffId = parseInt(params.staff_id as string);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: historyData, isLoading, error } = useGetStaffHistory(staffId);
  const { data: staffData, isLoading: staffLoading } = useGetBuildingStaff();

  const historyItems = useMemo(() => {
    if (!historyData?.data) return [];

    // Handle both possible data structures
    return Array.isArray(historyData.data)
      ? historyData.data
      : historyData.data?.data || [];
  }, [historyData?.data]);

  const paginatedHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return historyItems.slice(startIndex, startIndex + itemsPerPage);
  }, [historyItems, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(historyItems.length / itemsPerPage);

  // Validate staffId
  if (isNaN(staffId)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="w-full px-4 py-8 space-y-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Invalid Staff ID
              </h3>
              <p className="text-gray-600">
                The staff ID provided is not valid.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate average rating for completed requests
  const completedRequests = historyItems.filter(
    (item) => item.status === "resolved" && item.resident_rating !== null
  );
  const averageRating =
    completedRequests.length > 0
      ? (
          completedRequests.reduce(
            (sum, item) => sum + (item.resident_rating || 0),
            0
          ) / completedRequests.length
        ).toFixed(1)
      : "N/A";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            In Progress
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Resolved
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
      case "urgent":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Urgent
          </Badge>
        );
      case "high":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
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

  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-gray-400">No rating</span>;

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  if (isLoading || staffLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="w-full px-4 py-8 space-y-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="w-full px-4 py-8 space-y-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Error Loading Staff History
              </h3>
              <p className="text-gray-600">
                Failed to load staff history. Please try again later.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Get staff name from staff data
  const currentStaff = staffData?.data?.find(
    (staff) => staff.staff_id === staffId
  );
  const staffName = currentStaff?.full_name || "Unknown Staff";

  return (
    <TooltipProvider>
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
                    <Link href="/dashboard/building-management/manage-staff">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Staff
                      </Button>
                    </Link>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2 animate-fadeIn">
                      {staffName}&apos;s History
                    </h1>
                    <p className="text-purple-100 text-lg animate-slideUp">
                      Service requests handled by {staffName}
                    </p>
                    {currentStaff && (
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-purple-200 text-sm bg-white/20 px-3 py-1 rounded-full">
                          {currentStaff.role_name}
                        </span>
                        <span className="text-purple-200 text-sm bg-white/20 px-3 py-1 rounded-full">
                          {currentStaff.department}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold text-white animate-pulseGlow">
                    {historyItems.length}
                  </div>
                  <div className="text-purple-100 text-lg">Total Requests</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideUp">
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">
                      Total Requests
                    </p>
                    <p className="text-3xl font-bold">{historyItems.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <History className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">
                      Resolved
                    </p>
                    <p className="text-3xl font-bold">
                      {
                        historyItems.filter(
                          (item) => item.status === "resolved"
                        ).length
                      }
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm font-medium">
                      Average Rating
                    </p>
                    <p className="text-3xl font-bold">{averageRating}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Service Requests Table */}
          <Card className="shadow-lg border-0 animate-slideUp">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                <History className="h-5 w-5 mr-2 text-purple-600" />
                Service Requests History
              </CardTitle>
              <CardDescription className="text-gray-600">
                Showing {paginatedHistory.length} of {historyItems.length}{" "}
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
                        Request Info
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Priority
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Status
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Unit
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Rating
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Feedback
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-96 text-center">
                          <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                              <History className="h-8 w-8 text-purple-600" />
                            </div>
                            <div className="space-y-2">
                              <p className="text-lg font-medium text-gray-900">
                                No service requests found
                              </p>
                              <p className="text-sm text-gray-500">
                                This staff member has no service request history
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedHistory.map((item) => (
                        <TableRow
                          key={item.id}
                          className="hover:bg-purple-50/50 transition-colors duration-200 border-b border-gray-100"
                        >
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                                <Hash className="h-5 w-5 text-purple-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900 font-mono">
                                  {item.ticket_number}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Ticket ID
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="space-y-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="text-sm font-medium text-gray-900 max-w-xs cursor-help">
                                    {item.title}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                  <p className="font-medium">{item.title}</p>
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="text-sm text-gray-500 max-w-xs truncate cursor-help">
                                    {item.description}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-md">
                                  <p className="text-sm">{item.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            {getPriorityBadge(item.priority)}
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(item.status)}
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <Home className="h-4 w-4 mr-2 text-gray-400" />
                              Unit {item.unit_number}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            {renderStars(item.resident_rating)}
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs">
                              {item.resident_feedback || (
                                <span className="text-gray-400 italic">
                                  No feedback
                                </span>
                              )}
                            </div>
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
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
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
    </TooltipProvider>
  );
}
