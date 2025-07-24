"use client";

import { useGetAllNotices } from "@/hooks/api/notice"; // updated hook name
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
import { Loader2, MoreHorizontal, Pin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";

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

  console.log(noticesData);

  if (error) return <div>Error loading notices</div>;

  return (
    <div className="overflow-x-auto">
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
