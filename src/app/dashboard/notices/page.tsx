"use client";

import { useGetAllNotices, useGetNoticeAnalytics } from "@/hooks/api/notice";
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
  Loader2,
  MoreHorizontal,
  Pin,
  Trash2,
  Plus,
  Eye,
  TrendingUp,
  BarChart3,
  Activity,
  Archive,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

export default function NoticesPage() {
  const router = useRouter();

  const {
    data: noticesData,
    isLoading,
    error,
  } = useGetAllNotices(
    {
      page: 1,
      page_size: 10,
    },
    {
      enabled: true,
    }
  );

  const {
    data: noticeAnalytics,
    isLoading: isNoticeAnalyticsLoading,
    isError: isNoticeAnalyticsError,
  } = useGetNoticeAnalytics();

  if (error) return <div>Error loading notices</div>;

  return (
    <div className="flex flex-col gap-4">
      {isNoticeAnalyticsLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isNoticeAnalyticsError ? (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              <span>Failed to load analytics data</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 mb-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-lg font-bold">
                    {noticeAnalytics?.data?.overall_stats.total_notices || 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Views</p>
                  <p className="text-lg font-bold">
                    {(
                      noticeAnalytics?.data?.overall_stats.total_views || 0
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Pin className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pinned</p>
                  <p className="text-lg font-bold">
                    {noticeAnalytics?.data?.overall_stats.pinned_notices || 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Archive className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Archived</p>
                  <p className="text-lg font-bold">
                    {noticeAnalytics?.data?.overall_stats.archived_notices || 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Published</p>
                  <p className="text-lg font-bold">
                    {noticeAnalytics?.data?.overall_stats.published_notices ||
                      0}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg Views</p>
                  <p className="text-lg font-bold">
                    {noticeAnalytics?.data?.overall_stats.avg_view_count || 0}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Charts and Top Notices Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Category Distribution - Compact */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ChartContainer
                  config={{
                    notice_count: {
                      label: "Notices",
                      color: "hsl(var(--primary))",
                    },
                  }}
                  className="h-[120px]"
                >
                  <BarChart
                    data={noticeAnalytics?.data?.category_breakdown || []}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <XAxis
                      dataKey="category_name"
                      fontSize={10}
                      tick={{ fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      fontSize={10}
                      tick={{ fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="notice_count"
                      fill="var(--color-notice_count)"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Priority Distribution - Compact */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Priority Split
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ChartContainer
                  config={{
                    urgent: { label: "Urgent", color: "#ef4444" },
                    high: { label: "High", color: "#f97316" },
                    medium: { label: "Medium", color: "#eab308" },
                    low: { label: "Low", color: "#22c55e" },
                  }}
                  className="h-[120px]"
                >
                  <PieChart>
                    <Pie
                      data={noticeAnalytics?.data?.priority_distribution || []}
                      dataKey="count"
                      nameKey="priority"
                      cx="50%"
                      cy="50%"
                      outerRadius={50}
                      fill="#8884d8"
                    >
                      {(noticeAnalytics?.data?.priority_distribution || []).map(
                        (entry, index) => {
                          const colors = [
                            "#ef4444",
                            "#f97316",
                            "#eab308",
                            "#22c55e",
                          ];
                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={colors[index % colors.length]}
                            />
                          );
                        }
                      )}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Top Performing Notices - Compact */}
            {noticeAnalytics?.data?.top_notices &&
              noticeAnalytics.data.top_notices.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Top Notices
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {noticeAnalytics
                        .data!.top_notices.slice(0, 3)
                        .map((notice, index) => (
                          <div
                            key={notice.id}
                            className="flex items-center gap-2 text-xs"
                          >
                            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary font-semibold text-xs">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {notice.title}
                              </p>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Eye className="h-3 w-3" />
                                <span>
                                  {notice.view_count.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>

          {/* Recent Activity - Full Width */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Recent Activity Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ChartContainer
                config={{
                  notices_created: {
                    label: "Created",
                    color: "hsl(var(--primary))",
                  },
                  notices_published: {
                    label: "Published",
                    color: "hsl(var(--secondary))",
                  },
                }}
                className="h-[100px]"
              >
                <LineChart
                  data={noticeAnalytics?.data?.recent_activity || []}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <XAxis
                    dataKey="date"
                    fontSize={10}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    fontSize={10}
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="notices_created"
                    stroke="var(--color-notices_created)"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="notices_published"
                    stroke="var(--color-notices_published)"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}
      <Button asChild className="w-fit ml-auto">
        <Link href="/dashboard/notices/new">
          <Plus className="h-4 w-4" />
          Create Notice
        </Link>
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title &amp; Category</TableHead>
            <TableHead>Effective Date</TableHead>
            <TableHead>Published By</TableHead>
            <TableHead>Published At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              </TableCell>
            </TableRow>
          )}

          {noticesData?.data?.notices.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                <FileText className="h-4 w-4 mx-auto" />
                <span className="text-sm text-muted-foreground">
                  No notices
                </span>
              </TableCell>
            </TableRow>
          )}

          {noticesData?.data?.notices.map((notice) => (
            <TableRow
              key={notice.id}
              onClick={() => {
                router.push(`/dashboard/notices/${notice.id}`);
              }}
            >
              <TableCell className="flex flex-col gap-1">
                <span className="font-semibold">{notice.title}</span>
                <Badge
                  variant="outline"
                  className="text-teal-600 border-teal-600/20 bg-teal-600/5"
                >
                  {notice.category_name}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(notice.effective_from), "MMM dd, yyyy")} -{" "}
                {format(new Date(notice.effective_until), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>
                {notice.published_by_name} {notice.published_by_lastname}
              </TableCell>
              <TableCell>
                {format(new Date(notice.published_at), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>{notice.status}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Pin className="h-4 w-4" />
                      Pin
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
