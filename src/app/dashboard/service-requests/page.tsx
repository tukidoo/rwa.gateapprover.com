"use client";

import { useGetAllServiceRequests } from "@/hooks/api/service-requests";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  SERVICE_REQUEST_PRIORITY,
  SERVICE_REQUEST_STATUS,
} from "@/constants/service-request";
import { TServiceRequest } from "@/types/models/service-request";
import {
  AlertCircle,
  Clock,
  User,
  CheckCircle2,
  Clipboard,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { Pagination } from "@/components/ui/pagination-with-query-params";
import { useRouter } from "next/navigation";

export default function ServiceRequestPage() {
  const router = useRouter();
  const {
    data: serviceRequests,
    isLoading,
    isError,
    error,
  } = useGetAllServiceRequests();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Service Requests</AlertTitle>
          <AlertDescription>
            {error?.message ||
              "Failed to load service requests. Please try again later."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between mb-8">
          <p className="text-muted-foreground mt-2">
            Manage and track all service requests in your facility
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-semibold">
              {serviceRequests?.data?.requests.length}
            </span>
            <span className="text-muted-foreground">Total Requests</span>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket #</TableHead>
              <TableHead>Title & Requester</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {serviceRequests?.data?.requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-96 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <Clipboard className="h-12 w-12 text-muted-foreground/50" />
                    <div className="space-y-2">
                      <p className="text-lg font-medium">
                        No service requests found
                      </p>
                      <p className="text-sm text-muted-foreground">
                        New requests will appear here
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              serviceRequests?.data?.requests.map((request) => (
                <TableRow
                  key={request.id}
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => {
                    router.push(`/dashboard/service-requests/${request.id}`);
                  }}
                >
                  <TableCell className="font-mono font-medium max-w-20 truncate">
                    {request.ticket_number}
                  </TableCell>
                  <TableCell className="max-w-60">
                    <p className="font-medium truncate">{request.title}</p>
                    <Badge variant="outline">{request.requester_name}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {request.icon_url && (
                        <Image
                          src={request.icon_url}
                          alt={request.category_name || ""}
                          className="w-5 h-5"
                          width={20}
                          height={20}
                        />
                      )}
                      <span className="text-sm">{request.category_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {
                        SERVICE_REQUEST_PRIORITY.find(
                          (priority) => priority.value === request.priority
                        )?.label
                      }
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {
                        SERVICE_REQUEST_STATUS.find(
                          (status) => status.value === request.status
                        )?.label
                      }
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{request.unit_number}</p>
                      <p className="text-muted-foreground">
                        Floor {request.floor_number}, {request.building_name}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {format(request.created_at!, "MMM dd, yyyy")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Pagination pagination={serviceRequests?.data?.pagination} />
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-10 px-4 space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-3">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Card>
            <CardContent className="px-6 py-3">
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-24" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                  <TableHead className="text-right">
                    <Skeleton className="h-4 w-20 ml-auto" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-4 w-20 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
