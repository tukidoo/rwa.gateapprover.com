"use client";

import { useParams } from "next/navigation";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
  TagIcon,
  FileTextIcon,
  PaperclipIcon,
  Star,
  Loader2,
} from "lucide-react";

import {
  useGetBuildingStaff,
  useGetServiceRequestById,
  useAssignServiceRequest,
} from "@/hooks/api/service-requests";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  STATUS_CONFIG,
  PRIORITY_LEVELS,
  RATING_CONFIG,
} from "@/constants/service-request";
import { format } from "date-fns";
import { toast } from "sonner";
import { invalidateQueries } from "@/lib/query-client";
import { useOpenClose } from "@/hooks/custom/use-open-close";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export default function ServiceRequestDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { isOpen, close, openChange } = useOpenClose();
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);

  // Reset selected staff when dialog opens
  const handleOpenChange = (open: boolean) => {
    openChange(open);
    if (open) {
      setSelectedStaffId(null);
    }
  };

  // Reset selected staff when dialog closes
  const handleClose = () => {
    close();
    setSelectedStaffId(null);
  };

  const { data, isLoading, error } = useGetServiceRequestById({
    id: Number(id),
  });

  const { mutate: assignServiceRequest, isPending: isAssigningServiceRequest } =
    useAssignServiceRequest({
      onSuccess: (data) => {
        toast.success(data.message);
        invalidateQueries({
          queryKey: ["useGetServiceRequestById", { id: Number(id) }],
        });
        close();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { data: buildingStaff, isLoading: isBuildingStaffLoading } =
    useGetBuildingStaff({
      enabled: isOpen,
    });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
              <div className="h-48 bg-gray-200 rounded-xl animate-pulse" />
            </div>
            <div className="space-y-6">
              <div className="h-32 bg-gray-200 rounded-xl animate-pulse" />
              <div className="h-40 bg-gray-200 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.data?.request) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">😞</div>
            <h3 className="text-lg font-semibold mb-2">
              Service Request Not Found
            </h3>
            <p className="text-gray-600 mb-4">
              The service request you&apos;re looking for doesn&apos;t exist or
              you don&apos;t have permission to view it.
            </p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const request = data.data.request;
  const updates = data.data.updates || [];
  const slaMetrics = data.data.sla_metrics;

  const statusConfig =
    STATUS_CONFIG[request.status as keyof typeof STATUS_CONFIG];
  const priorityConfig =
    PRIORITY_LEVELS[request.priority as keyof typeof PRIORITY_LEVELS];

  const renderRating = (rating?: number) => {
    if (!rating) return null;
    const config = RATING_CONFIG[rating as keyof typeof RATING_CONFIG];
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-medium">{config.label}</span>
        <span className="text-lg">{config.emoji}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Service Request Details
            </h1>
            <p className="text-gray-600 mt-1">#{request.ticket_number}</p>
          </div>

          {/* Assigned To Section */}
          <div className="flex items-center gap-4">
            {request.assigned_to_name ? (
              <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 shadow-sm border">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {request.assigned_to_name} {request.assigned_to_surname}
                  </p>
                  <p className="text-xs text-gray-500">Assigned Staff</p>
                </div>
              </div>
            ) : (
              <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-white hover:bg-gray-50"
                  >
                    <UserIcon className="w-4 h-4 mr-2" />
                    Assign Staff
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Assign Staff</AlertDialogTitle>
                    <AlertDialogDescription>
                      Assign a staff to this service request. You can add the
                      assignment logic here later.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="overflow-y-auto max-h-[500px] flex flex-col gap-2">
                    {isBuildingStaffLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    ) : (
                      buildingStaff?.data?.map((staff) => (
                        <div
                          key={staff.id}
                          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            // Toggle selection - only one staff can be selected at a time
                            setSelectedStaffId(
                              selectedStaffId === staff.id ? null : staff.id
                            );
                          }}
                        >
                          <Checkbox
                            checked={selectedStaffId === staff.id}
                            onCheckedChange={() => {
                              // Toggle selection - only one staff can be selected at a time
                              setSelectedStaffId(
                                selectedStaffId === staff.id ? null : staff.id
                              );
                            }}
                          />
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-blue-600" />
                            <p>
                              {staff.first_name} {staff.last_name}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      disabled={isAssigningServiceRequest}
                      onClick={handleClose}
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      disabled={
                        isAssigningServiceRequest || selectedStaffId === null
                      }
                      onClick={() => {
                        if (selectedStaffId) {
                          assignServiceRequest({
                            id: Number(id),
                            assigned_to: selectedStaffId,
                          });
                        }
                      }}
                    >
                      {isAssigningServiceRequest ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Assigning...
                        </>
                      ) : (
                        "Assign"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Overview */}
            <Card
              className="border-l-4"
              style={{ borderLeftColor: statusConfig?.color }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <CardTitle className="text-xl">{request.title}</CardTitle>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="secondary"
                        className="text-white border-0"
                        style={{
                          backgroundColor: statusConfig?.color,
                          color: "white",
                        }}
                      >
                        {statusConfig?.label}
                      </Badge>
                      <Badge
                        variant="outline"
                        style={{
                          borderColor: priorityConfig?.color,
                          color: priorityConfig?.color,
                          backgroundColor: priorityConfig?.bgColor,
                        }}
                      >
                        {priorityConfig?.label} Priority
                      </Badge>
                      {request.is_overdue && (
                        <Badge variant="destructive">Overdue</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>
                      Created: {format(request.created_at!, "MMM dd, yyyy")}
                    </div>
                    {request.resolved_at && (
                      <div>
                        Resolved: {format(request.resolved_at!, "MMM dd, yyyy")}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FileTextIcon className="w-4 h-4" />
                      Description
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {request.description}
                    </p>
                  </div>

                  {request.location_details && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4" />
                        Location Details
                      </h4>
                      <p className="text-gray-700">
                        {request.location_details}
                      </p>
                    </div>
                  )}

                  {request.preferred_time && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        Preferred Time
                      </h4>
                      <div className="text-gray-700">
                        {request.preferred_time.date && (
                          <p>
                            Date:{" "}
                            {format(
                              request.preferred_time.date,
                              "MMM dd, yyyy"
                            )}
                          </p>
                        )}
                        {request.preferred_time.time_slot && (
                          <p>Time Slot: {request.preferred_time.time_slot}</p>
                        )}
                        {request.preferred_time.notes && (
                          <p>Notes: {request.preferred_time.notes}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {request.attachments && request.attachments.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <PaperclipIcon className="w-4 h-4" />
                        Attachments
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {request.attachments.map((attachment, index) => (
                          <div
                            key={index}
                            className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                          >
                            <p className="font-medium text-sm">
                              {attachment.filename}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {attachment.type}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {request.resolution_notes && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Resolution Notes
                      </h4>
                      <p className="text-gray-700">
                        {request.resolution_notes}
                      </p>
                    </div>
                  )}

                  {request.resident_rating && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Resident Feedback
                      </h4>
                      {renderRating(request.resident_rating)}
                      {request.resident_feedback && (
                        <p className="text-gray-700 mt-2">
                          {request.resident_feedback}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Updates Timeline */}
            {updates.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Updates & Activity</CardTitle>
                  <CardDescription>
                    Timeline of all changes and updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {updates.map((update) => (
                      <div
                        key={update.id}
                        className="flex gap-4 pb-4 border-b last:border-b-0"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        </div>
                        <div className="w-full">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {update.update_type
                                ?.replace("_", " ")
                                .toUpperCase()}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {format(update.created_at!, "MMM dd, yyyy")}
                            </span>
                          </div>
                          <p className="w-full">{update.description}</p>
                          {update.old_value && update.new_value && (
                            <div className="mt-2 text-sm">
                              <span className="text-gray-500">From:</span>{" "}
                              <span className="line-through text-gray-400">
                                {update.old_value}
                              </span>
                              {" → "}
                              <span className="font-medium text-green-600">
                                {update.new_value}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Request Details */}
            <Card>
              <CardHeader>
                <CardTitle>Request Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <TagIcon className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{request.category_name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium">{request.department}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <ClockIcon className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">
                      Hours Since Creation
                    </p>
                    <p className="font-medium">
                      {request.hours_since_creation}h
                    </p>
                  </div>
                </div>

                {request.resolution_time_hours && (
                  <div className="flex items-center gap-3">
                    <ClockIcon className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500">Resolution Time</p>
                      <p className="font-medium text-green-600">
                        {request.resolution_time_hours}h
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Requester Information */}
            <Card>
              <CardHeader>
                <CardTitle>Requester Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <UserIcon className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">
                      {request.requester_name} {request.requester_surname}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <PhoneIcon className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{request.requester_phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MailIcon className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{request.requester_email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPinIcon className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Unit</p>
                    <p className="font-medium">
                      {request.building_name} - Unit {request.unit_number}
                    </p>
                    <p className="text-sm text-gray-500">
                      Floor {request.floor_number}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Information */}
            {((request.cost_estimate && request.cost_estimate > 0) ||
              (request.actual_cost && request.actual_cost > 0)) && (
              <Card>
                <CardHeader>
                  <CardTitle>Cost Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {request.cost_estimate && request.cost_estimate > 0 && (
                    <div>
                      <p className="text-sm text-gray-500">Estimated Cost</p>
                      <p className="font-medium text-lg">
                        ${request.cost_estimate.toFixed(2)}
                      </p>
                    </div>
                  )}

                  {request.actual_cost && request.actual_cost > 0 && (
                    <div>
                      <p className="text-sm text-gray-500">Actual Cost</p>
                      <p className="font-medium text-lg text-green-600">
                        ${request.actual_cost.toFixed(2)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* SLA Metrics */}
            {slaMetrics && (
              <Card>
                <CardHeader>
                  <CardTitle>SLA Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{slaMetrics.completion_percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${slaMetrics.completion_percentage}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Time Remaining</p>
                    <p
                      className={`font-medium ${
                        slaMetrics.time_remaining_hours &&
                        slaMetrics.time_remaining_hours < 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {Math.abs(slaMetrics.time_remaining_hours!)}h{" "}
                      {slaMetrics.time_remaining_hours &&
                      slaMetrics.time_remaining_hours < 0
                        ? "overdue"
                        : "remaining"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Urgency Level</p>
                    <Badge
                      variant={
                        slaMetrics.sla_breach ? "destructive" : "secondary"
                      }
                    >
                      {slaMetrics.urgency_level}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
