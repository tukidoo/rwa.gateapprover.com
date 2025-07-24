"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetNoticeById, useUpdateNotice } from "@/hooks/api/notice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ArrowLeft, Edit, Pin, PinOff, Trash2, Save, X } from "lucide-react";
import Image from "next/image";
import { PRIORITY, TARGET_AUDIENCE } from "@/constants/common";
import { toast } from "sonner";
import { invalidateQuery } from "@/lib/query-client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TNotice } from "@/types/models/notice";

export default function NoticeDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const noticeId = Number(params.id);

  const { data: noticeData, isLoading, error } = useGetNoticeById(noticeId);

  const { mutate: updateNotice } = useUpdateNotice(noticeId, {
    onSuccess: (data) => {
      toast.success(data.message);
      invalidateQuery({
        queryKey: ["useGetNoticeById"],
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    content: "",
    priority: "",
    target_audience: "",
    target_units: "",
    target_floors: "",
    effective_from: "",
    effective_until: "",
  });

  // Initialize form data when notice data is loaded
  useEffect(() => {
    if (noticeData?.data && !isEditing) {
      setEditFormData({
        title: noticeData.data.title || "",
        content: noticeData.data.content || "",
        priority: noticeData.data.priority || "",
        target_audience: noticeData.data.target_audience || "",
        target_units: noticeData.data.target_units?.join(", ") || "",
        target_floors: noticeData.data.target_floors?.join(", ") || "",
        effective_from: noticeData.data.effective_from
          ? format(
              new Date(noticeData.data.effective_from),
              "yyyy-MM-dd'T'HH:mm"
            )
          : "",
        effective_until: noticeData.data.effective_until
          ? format(
              new Date(noticeData.data.effective_until),
              "yyyy-MM-dd'T'HH:mm"
            )
          : "",
      });
    }
  }, [noticeData, isEditing]);

  const handleGoBack = () => {
    router.push("/dashboard/notices");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data to original values
    if (noticeData?.data) {
      setEditFormData({
        title: noticeData.data.title || "",
        content: noticeData.data.content || "",
        priority: noticeData.data.priority || "",
        target_audience: noticeData.data.target_audience || "",
        target_units: noticeData.data.target_units?.join(", ") || "",
        target_floors: noticeData.data.target_floors?.join(", ") || "",
        effective_from: noticeData.data.effective_from
          ? format(
              new Date(noticeData.data.effective_from),
              "yyyy-MM-dd'T'HH:mm"
            )
          : "",
        effective_until: noticeData.data.effective_until
          ? format(
              new Date(noticeData.data.effective_until),
              "yyyy-MM-dd'T'HH:mm"
            )
          : "",
      });
    }
  };

  const handleSaveEdit = () => {
    const formData = { ...editFormData };

    // Convert comma-separated strings to arrays for target_units and target_floors
    const updateData: Partial<TNotice> = {
      title: formData.title,
      content: formData.content,
      priority: formData.priority,
      target_audience: formData.target_audience,
      effective_from: formData.effective_from,
      effective_until: formData.effective_until,
    };

    // Add target_units as array if target_audience is specific_units
    if (
      formData.target_audience === "specific_units" &&
      formData.target_units
    ) {
      updateData.target_units = formData.target_units
        .split(",")
        .map((unit) => parseInt(unit.trim()))
        .filter((unit) => !isNaN(unit));
    }

    // Add target_floors as array if target_audience is specific_floors
    if (
      formData.target_audience === "specific_floors" &&
      formData.target_floors
    ) {
      updateData.target_floors = formData.target_floors
        .split(",")
        .map((floor) => parseInt(floor.trim()))
        .filter((floor) => !isNaN(floor));
    }

    updateNotice(updateData);
  };

  const handleFormChange = (field: string, value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTogglePin = () => {
    updateNotice({
      is_pinned: !noticeData?.data?.is_pinned,
    });
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    if (confirm("Are you sure you want to delete this notice?")) {
      console.log("Delete notice:", noticeId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Notice not found
          </h2>
          <p className="text-gray-600">
            The requested notice could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy 'at' HH:mm");
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "published":
        return "default";
      case "draft":
        return "secondary";
      case "expired":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Navigation and Actions */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Notices
        </Button>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={handleSaveEdit}
                className="gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                className="gap-2 cursor-pointer"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="gap-2 cursor-pointer"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleTogglePin}
                className="gap-2"
              >
                {noticeData?.data?.is_pinned ? (
                  <Tooltip>
                    <TooltipTrigger>
                      <PinOff className="w-4 h-4" fill="currentColor" />
                    </TooltipTrigger>
                    <TooltipContent>Unpin</TooltipContent>
                  </Tooltip>
                ) : (
                  <Tooltip>
                    <TooltipTrigger>
                      <Pin className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent>Pin</TooltipContent>
                  </Tooltip>
                )}
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <Input
                    value={editFormData.title}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                    placeholder="Enter notice title"
                    className="text-xl font-bold"
                  />
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                  {noticeData?.data?.title}
                </h1>
                <p className="text-gray-600 mt-2">
                  {noticeData?.data?.preview}
                </p>
              </>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            {isEditing ? (
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <Select
                    value={editFormData.priority}
                    onValueChange={(value) =>
                      handleFormChange("priority", value)
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Target Audience
                  </label>
                  <Select
                    value={editFormData.target_audience}
                    onValueChange={(value) =>
                      handleFormChange("target_audience", value)
                    }
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Audience" />
                    </SelectTrigger>
                    <SelectContent>
                      {TARGET_AUDIENCE.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Conditional input for specific units */}
                {editFormData.target_audience === "specific_units" && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Target Units (comma-separated)
                    </label>
                    <Input
                      value={editFormData.target_units}
                      onChange={(e) =>
                        handleFormChange("target_units", e.target.value)
                      }
                      placeholder="e.g., 101, 102, 103"
                      className="w-[150px]"
                    />
                  </div>
                )}
                {/* Conditional input for specific floors */}
                {editFormData.target_audience === "specific_floors" && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Target Floors (comma-separated)
                    </label>
                    <Input
                      value={editFormData.target_floors}
                      onChange={(e) =>
                        handleFormChange("target_floors", e.target.value)
                      }
                      placeholder="e.g., 1, 2, 3"
                      className="w-[150px]"
                    />
                  </div>
                )}
              </div>
            ) : (
              noticeData?.data?.priority && (
                <Badge variant="secondary">
                  {noticeData?.data?.priority} Priority
                </Badge>
              )
            )}
          </div>
        </div>

        {/* Status and Category */}
        <div className="flex items-center gap-3 text-sm">
          {noticeData?.data?.effective_from && (
            <Badge variant={getStatusVariant(noticeData?.data?.status)}>
              {noticeData?.data?.status}
            </Badge>
          )}
          <div className="flex items-center gap-2">
            {noticeData?.data?.category_icon_url && (
              <Image
                src={noticeData?.data.category_icon_url}
                alt={noticeData?.data.category_name}
                className="w-4 h-4"
                width={16}
                height={16}
              />
            )}
            <span
              className="px-2 py-1 rounded text-xs font-medium"
              style={{
                backgroundColor: `${noticeData?.data?.category_color_code}20`,
                color: noticeData?.data?.category_color_code,
              }}
            >
              {noticeData?.data?.category_name}
            </span>
          </div>
          {noticeData?.data?.urgency_indicator && (
            <Badge variant="destructive" className="animate-pulse">
              🚨 {noticeData?.data.urgency_indicator}
            </Badge>
          )}
        </div>
      </div>

      <Separator />

      {/* Content Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Content</h2>
          {isEditing ? (
            <div>
              <Textarea
                value={editFormData.content}
                onChange={(e) => handleFormChange("content", e.target.value)}
                placeholder="Enter notice content"
                className="min-h-[200px]"
              />
            </div>
          ) : (
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              {noticeData?.data?.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-3">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Date Range - Only show in edit mode */}
        {isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Effective From
              </label>
              <Input
                type="datetime-local"
                value={editFormData.effective_from}
                onChange={(e) =>
                  handleFormChange("effective_from", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Effective Until
              </label>
              <Input
                type="datetime-local"
                value={editFormData.effective_until}
                onChange={(e) =>
                  handleFormChange("effective_until", e.target.value)
                }
              />
            </div>
          </div>
        )}

        {/* Attachments */}
        {noticeData?.data?.attachments &&
          noticeData?.data.attachments.length > 0 && (
            <>
              <Separator />
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Attachments ({noticeData?.data.attachment_count})
                </h2>
                <div className="space-y-2">
                  {noticeData?.data.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-sm">
                          📎{" "}
                          <span className="font-medium">
                            {attachment.filename}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {attachment.file_type.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {(attachment.file_size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
      </div>

      <Separator />

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
        {/* Publishing Info */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Publishing</h3>
          <div className="space-y-2 text-gray-600">
            <div>
              <span className="font-medium">Published by:</span>
              <br />
              {noticeData?.data?.published_by_name}{" "}
              {noticeData?.data?.published_by_lastname}
            </div>
            {noticeData?.data?.published_at && (
              <div>
                <span className="font-medium">Published:</span>
                <br />
                {formatDate(noticeData?.data?.published_at)}
              </div>
            )}
            {noticeData?.data?.created_at && (
              <div>
                <span className="font-medium">Created:</span>
                <br />
                {formatDate(noticeData?.data?.created_at)}
              </div>
            )}
          </div>
        </div>

        {/* Validity Period */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Validity</h3>
          <div className="space-y-2 text-gray-600">
            {noticeData?.data?.effective_from && (
              <div>
                <span className="font-medium">Effective from:</span>
                <br />
                {formatDate(noticeData?.data?.effective_from)}
              </div>
            )}
            {noticeData?.data?.effective_until && (
              <div>
                <span className="font-medium">Effective until:</span>
                <br />
                {formatDate(noticeData?.data?.effective_until)}
              </div>
            )}
            {noticeData?.data?.is_expired && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                {noticeData?.data?.is_expired ? (
                  <Badge variant="outline" className="text-red-600">
                    Expired
                  </Badge>
                ) : (
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800"
                  >
                    Active
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Statistics</h3>
          <div className="space-y-2 text-gray-600">
            <div>
              <span className="font-medium">Views:</span>{" "}
              {noticeData?.data?.view_count?.toLocaleString()}
            </div>
            <div>
              <span className="font-medium">Reading time:</span>{" "}
              {noticeData?.data?.reading_time_minutes} min
            </div>
            <div>
              <span className="font-medium">Content length:</span>{" "}
              {noticeData?.data?.content_length?.toLocaleString()} chars
            </div>
            <div>
              <span className="font-medium">Hours since published:</span>{" "}
              {noticeData?.data?.hours_since_published}h
            </div>
          </div>
        </div>

        {/* Targeting */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Targeting</h3>
          <div className="space-y-2 text-gray-600">
            <div>
              <span className="font-medium">Audience:</span>
              <br />
              {noticeData?.data?.target_audience}
            </div>
            {noticeData?.data?.target_units &&
              noticeData?.data?.target_units.length > 0 && (
                <div>
                  <span className="font-medium">Target units:</span>
                  <br />
                  {noticeData?.data?.target_units.join(", ")}
                </div>
              )}
            {noticeData?.data?.target_floors && (
              <div>
                <span className="font-medium">Target floors:</span>
                <br />
                {noticeData?.data?.target_floors.join(", ")}
              </div>
            )}
          </div>
        </div>

        {/* Reading Status */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Reading Status</h3>
          <div className="space-y-2 text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">Read:</span>
              {noticeData?.data?.is_read ? (
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  ✓ Read
                </Badge>
              ) : (
                <Badge variant="outline" className="text-orange-600">
                  ● Unread
                </Badge>
              )}
            </div>
            {noticeData?.data?.viewed_at && (
              <div>
                <span className="font-medium">Viewed at:</span>
                <br />
                {formatDate(noticeData?.data?.viewed_at)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
