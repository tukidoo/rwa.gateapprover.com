"use client";

import { useGetShiftingRequests } from "@/hooks/api/shifting-requests";
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
  Home,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  User,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MoveRequestsPage() {
  const {
    data: shiftingRequestsData,
    isLoading,
    error,
    refetch,
  } = useGetShiftingRequests();

  const moveRequests = shiftingRequestsData?.data || [];

  const getTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case "move-in":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Move-in
          </Badge>
        );
      case "move-out":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            Move-out
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#7d51ff] via-[#9d71ff] to-[#b591ff] p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          <div className="relative">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Move-in/Move-out Requests
            </h1>
            <p className="text-purple-100 text-lg">
              Manage tenant move-in and move-out requests for building units.
            </p>
          </div>
        </div>
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
            <h3 className="text-lg font-medium text-destructive mb-2">
              Failed to load requests
            </h3>
            <p className="text-muted-foreground mb-4">
              There was an error loading the move requests. Please try again.
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
      {/* Page Header with Wow Factor */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#7d51ff] via-[#9d71ff] to-[#b591ff] p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        <div className="relative">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Move-in/Move-out Requests
          </h1>
          <p className="text-purple-100 text-lg">
            Manage tenant move-in and move-out requests for building units.
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
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Total Requests
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {moveRequests.length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">
                  Move-in Requests
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {
                    moveRequests.filter(
                      (r) => r.shift_type.toLowerCase() === "move-in"
                    ).length
                  }
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">
                  Move-out Requests
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {
                    moveRequests.filter(
                      (r) => r.shift_type.toLowerCase() === "move-out"
                    ).length
                  }
                </p>
              </div>
              <XCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Move Requests ({moveRequests.length})
          </CardTitle>
          <CardDescription>
            Manage all move-in and move-out requests from tenants
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2 text-muted-foreground">
                Loading requests...
              </span>
            </div>
          ) : moveRequests.length === 0 ? (
            <div className="text-center py-8">
              <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No move requests found
              </h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first move request.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {moveRequests.map((request) => (
                <Card
                  key={request.user_id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      {/* Unit Number - Prominent */}
                      <div className="flex-shrink-0">
                        <div className="bg-gradient-to-br from-[#7d51ff] to-[#9d71ff] text-white rounded-xl p-4 min-w-[80px] text-center">
                          <div className="text-2xl font-bold">
                            {request.unit_number}
                          </div>
                          <div className="text-xs opacity-90">Unit</div>
                        </div>
                      </div>

                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {request.photo_image_url ? (
                          <Image
                            src={request.photo_image_url}
                            alt={request.user_name}
                            width={56}
                            height={56}
                            className="h-14 w-14 rounded-full object-cover border-2 border-muted"
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center border-2 border-muted">
                            <User className="h-7 w-7 text-primary" />
                          </div>
                        )}
                      </div>

                      {/* Name */}
                      <div className="flex-shrink-0 min-w-[150px]">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request.user_name}
                        </h3>
                      </div>

                      {/* Shift Type */}
                      <div className="flex-shrink-0">
                        {getTypeBadge(request.shift_type)}
                      </div>

                      {/* Date and Time */}
                      <div className="flex-1 flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">
                            {formatDate(request.date)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">
                            {formatTime(request.time)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Request
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
