"use client";

import { useState, useMemo } from "react";
import {
  useGetAllNotices,
  useGetNoticeAnalytics,
  usePublishNotice,
  useArchiveNotice,
  useDeleteNotice,
} from "@/hooks/api/notice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreHorizontal,
  Trash2,
  Plus,
  Eye,
  Archive,
  Globe,
  FileText,
  Search,
  ArrowLeft,
  Calendar,
  User,
  Settings,
  Filter,
  AlertCircle,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";

export default function NoticesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: noticesData,
    isLoading,
    error,
    refetch: refetchNotices,
  } = useGetAllNotices(
    {
      page: 1,
      page_size: 50, // Increased to show more notices
    },
    {
      enabled: true,
    }
  );

  const { refetch: refetchAnalytics } = useGetNoticeAnalytics();

  const publishNoticeMutation = usePublishNotice({
    onSuccess: () => {
      toast.success("Notice published successfully!");
      refetchNotices();
      refetchAnalytics();
    },
    onError: (error) => {
      toast.error("Failed to publish notice. Please try again.");
      console.error("Publish error:", error);
    },
  });

  const archiveNoticeMutation = useArchiveNotice({
    onSuccess: () => {
      toast.success("Notice archived successfully!");
      refetchNotices();
      refetchAnalytics();
    },
    onError: (error) => {
      toast.error("Failed to archive notice. Please try again.");
      console.error("Archive error:", error);
    },
  });

  const deleteNoticeMutation = useDeleteNotice({
    onSuccess: () => {
      toast.success("Notice deleted successfully!");
      refetchNotices();
      refetchAnalytics();
    },
    onError: (error) => {
      toast.error("Failed to delete notice. Please try again.");
      console.error("Delete error:", error);
    },
  });

  const handlePublish = (noticeId: number) => {
    publishNoticeMutation.mutate(noticeId);
  };

  const handleArchive = (noticeId: number) => {
    archiveNoticeMutation.mutate(noticeId);
  };

  const handleDelete = (noticeId: number) => {
    deleteNoticeMutation.mutate(noticeId);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "published":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <Globe className="h-3 w-3 mr-1" />
            Published
          </Badge>
        );
      case "draft":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <FileText className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        );
      case "archived":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <Archive className="h-3 w-3 mr-1" />
            Archived
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const canPublish = (status: string) => {
    return status.toLowerCase() === "draft";
  };

  const filteredNotices = useMemo(() => {
    if (!noticesData?.data?.notices) return [];

    return noticesData.data.notices.filter((notice) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        (notice.title?.toLowerCase() || "").includes(searchLower) ||
        (notice.content?.toLowerCase() || "").includes(searchLower);

      const matchesStatus =
        statusFilter === "all" || notice.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [noticesData?.data?.notices, searchQuery, statusFilter]);

  const paginatedNotices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredNotices.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredNotices, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);

  const canArchive = (status: string) => {
    const statusLower = status.toLowerCase();
    return statusLower === "draft" || statusLower === "published";
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
              <span>Error loading notices</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalNotices = noticesData?.data?.notices.length || 0;
  const publishedNotices =
    noticesData?.data?.notices.filter((n) => n.status === "published").length ||
    0;
  const draftNotices =
    noticesData?.data?.notices.filter((n) => n.status === "draft").length || 0;

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
                    Notices
                  </h1>
                  <p className="text-purple-100 text-lg animate-slideUp">
                    Manage building notices, announcements, and communications
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold text-white animate-pulseGlow">
                  {totalNotices}
                </div>
                <div className="text-purple-100 text-lg">Total Notices</div>
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
                    Total Notices
                  </p>
                  <p className="text-3xl font-bold">{totalNotices}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Published
                  </p>
                  <p className="text-3xl font-bold">{publishedNotices}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Globe className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Drafts</p>
                  <p className="text-3xl font-bold">{draftNotices}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6" />
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
                  placeholder="Search notices, title, content..."
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
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  New Notice
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

        {/* Notices Table */}
        <Card className="shadow-lg border-0 animate-slideUp mt-8">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-purple-600" />
              Notices
            </CardTitle>
            <CardDescription className="text-gray-600">
              Showing {paginatedNotices.length} of {filteredNotices.length}{" "}
              notices
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">
                      Notice Details
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Category
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Priority
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
                  {paginatedNotices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-96 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                            <FileText className="h-8 w-8 text-purple-600" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-lg font-medium text-gray-900">
                              No notices found
                            </p>
                            <p className="text-sm text-gray-500">
                              {searchQuery || statusFilter !== "all"
                                ? "Try adjusting your search criteria"
                                : "Get started by creating your first notice"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedNotices.map((notice) => (
                      <TableRow
                        key={notice.id}
                        className="hover:bg-purple-50/50 transition-colors duration-200 border-b border-gray-100"
                      >
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                              <FileText className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                {notice.title || "-"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {notice.content
                                  ? `${notice.content.substring(0, 50)}...`
                                  : "-"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline" className="text-xs">
                            {notice.category_name || "-"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(notice.status)}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={
                              notice.priority === "high"
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {notice.priority || "-"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            {notice.created_at
                              ? format(notice.created_at, "MMM dd, yyyy")
                              : "-"}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="h-8 w-8 p-0 hover:bg-gray-100 rounded-md flex items-center justify-center">
                              <MoreHorizontal className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(`/dashboard/notices/${notice.id}`)
                                }
                                className="cursor-pointer"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(
                                    `/dashboard/notices/${notice.id}/edit`
                                  )
                                }
                                className="cursor-pointer"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Notice
                              </DropdownMenuItem>
                              {canPublish(notice.status) && (
                                <DropdownMenuItem
                                  onClick={() => handlePublish(notice.id)}
                                  disabled={publishNoticeMutation.isPending}
                                >
                                  <Globe className="h-4 w-4 mr-2" />
                                  {publishNoticeMutation.isPending
                                    ? "Publishing..."
                                    : "Publish"}
                                </DropdownMenuItem>
                              )}
                              {canArchive(notice.status) && (
                                <DropdownMenuItem
                                  onClick={() => handleArchive(notice.id)}
                                  disabled={archiveNoticeMutation.isPending}
                                >
                                  <Archive className="h-4 w-4 mr-2" />
                                  {archiveNoticeMutation.isPending
                                    ? "Archiving..."
                                    : "Archive"}
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleDelete(notice.id)}
                                disabled={deleteNoticeMutation.isPending}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {deleteNoticeMutation.isPending
                                  ? "Deleting..."
                                  : "Delete"}
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
