"use client";

import {
  useGetAllDocumentVerifications,
  useUpdateDocumentVerification,
} from "@/hooks/api/document-verification";
import { useQueryParams } from "@/hooks/custom/use-query-params";
import {
  DOCUMENT_TYPES,
  DOCUMENT_VERIFICATION_STATUS,
} from "@/constants/document";
import {
  TDocumentVerification,
  TDocumentVerificationStatus,
} from "@/types/models/document-verification";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Download, CheckCircle, XCircle, ClockAlert } from "lucide-react";
import { Pagination } from "@/components/ui/pagination-with-query-params";

import { format } from "date-fns";
import { useOpenClose } from "@/hooks/custom/use-open-close";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { toast } from "sonner";
import { invalidateQuery } from "@/lib/query-client";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Textarea } from "@/components/ui/textarea";

const DocumentVerificationPage = () => {
  const { params } = useQueryParams();
  const { isOpen, open, close } = useOpenClose();
  const [selectedDocument, setSelectedDocument] =
    useState<TDocumentVerification | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<
    TDocumentVerificationStatus | undefined
  >();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingStatus, setPendingStatus] =
    useState<TDocumentVerificationStatus | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const {
    data: documentVerifications,
    isLoading,
    error,
    isError,
  } = useGetAllDocumentVerifications(
    {
      page: Number(params.page),
    },
    {
      enabled: true,
    }
  );

  const { mutate: updateDocumentVerification } = useUpdateDocumentVerification(
    selectedDocument?.document_id || 0
  );

  const getDocumentTypeLabel = (value: string) => {
    const documentType = DOCUMENT_TYPES.find((type) => type.value === value);
    return documentType?.label || value;
  };

  const getVerificationStatusLabel = (value: string) => {
    const status = DOCUMENT_VERIFICATION_STATUS.find(
      (status) => status.value === value
    );
    return status?.label || value;
  };

  const getStatusBadgeVariant = (status: TDocumentVerificationStatus) => {
    switch (status) {
      case "verified":
        return "default";
      case "rejected":
        return "destructive";
      case "pending_review":
        return "secondary";
      default:
        return "outline";
    }
  };

  const handleViewDocument = (document: TDocumentVerification) => {
    setSelectedDocument(document);
    setSelectedStatus(document.verification_status);
    open();
  };

  const handleStatusChange = (newStatus: TDocumentVerificationStatus) => {
    if (!selectedDocument?.document_id) return;

    setPendingStatus(newStatus);
    setRejectionReason(""); // Reset rejection reason
    setShowConfirmDialog(true);
  };

  const handleConfirmStatusChange = () => {
    if (!selectedDocument?.document_id || !pendingStatus) return;

    // Validate rejection reason if status is rejected
    if (pendingStatus === "rejected" && !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }

    const updateData: Partial<TDocumentVerification> = {
      verification_status: pendingStatus,
    };

    // Add rejection reason if status is rejected
    if (pendingStatus === "rejected" && rejectionReason.trim()) {
      updateData.rejection_reason = rejectionReason.trim();
    }

    updateDocumentVerification(updateData, {
      onSuccess: (data) => {
        toast.success(data.message);
        invalidateQuery({
          queryKey: ["useGetAllDocumentVerifications"],
        });
        setShowConfirmDialog(false);
        setPendingStatus(null);
        setRejectionReason("");
        close();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const handleCancelStatusChange = () => {
    setShowConfirmDialog(false);
    setPendingStatus(null);
    setRejectionReason("");
  };

  const handleCloseSheet = () => {
    close();
    setSelectedDocument(null);
    setSelectedStatus(undefined);
    // Reset confirmation dialog state when closing sheet
    setShowConfirmDialog(false);
    setPendingStatus(null);
    setRejectionReason("");
  };

  const isPdfDocument = (url: string) => {
    return (
      url.toLowerCase().includes(".pdf") || url.toLowerCase().includes("pdf")
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Document Verifications</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Document Verifications</h1>
        <p className="text-red-500">Error: {error?.message}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Document Verifications</h1>

      {documentVerifications?.data?.documents &&
      documentVerifications.data.documents.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profile</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Document Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentVerifications.data.documents.map((document) => (
                <TableRow key={document.document_id}>
                  <TableCell>
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={document.profile_image_url || undefined}
                        alt={`${document.first_name} ${document.last_name}`}
                      />
                      <AvatarFallback>
                        {document.first_name.charAt(0)}
                        {document.last_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">
                    {document.first_name} {document.last_name}
                  </TableCell>
                  <TableCell>
                    {getDocumentTypeLabel(document.document_type)}
                  </TableCell>
                  <TableCell>{document.document_number}</TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusBadgeVariant(
                        document.verification_status
                      )}
                    >
                      {getVerificationStatusLabel(document.verification_status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(document.created_at, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDocument(document)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            pageParamKey="page"
            pagination={documentVerifications.data.pagination}
          />
        </div>
      ) : (
        <p>No document verifications found.</p>
      )}

      <Sheet open={isOpen} onOpenChange={handleCloseSheet}>
        <SheetContent className="md:max-w-2xl w-full">
          <SheetHeader>
            <SheetTitle>Document Verification Details</SheetTitle>
            <SheetDescription>
              Review and manage document verification status
            </SheetDescription>
          </SheetHeader>

          {selectedDocument && (
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* User Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">User Information</h3>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={selectedDocument.profile_image_url || undefined}
                      alt={`${selectedDocument.first_name} ${selectedDocument.last_name}`}
                    />
                    <AvatarFallback className="text-lg">
                      {selectedDocument.first_name.charAt(0)}
                      {selectedDocument.last_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-lg font-medium">
                        {selectedDocument.first_name}{" "}
                        {selectedDocument.last_name}
                      </p>
                      {selectedDocument.verification_status ===
                        "pending_review" && (
                        <Tooltip>
                          <TooltipTrigger>
                            <ClockAlert className="h-4 w-4 text-yellow-600" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              <p className="text-xs">Pending review</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {selectedDocument.verification_status === "verified" && (
                        <Tooltip>
                          <TooltipTrigger>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              <p className="text-xs">
                                Verified by: {selectedDocument.verified_by}
                              </p>
                              <p className="text-xs">
                                Verified at:{" "}
                                {format(
                                  selectedDocument.verified_at!,
                                  "MMM d, yyyy 'at' h:mm a"
                                )}
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {selectedDocument.verification_status === "rejected" && (
                        <Tooltip>
                          <TooltipTrigger>
                            <XCircle className="h-4 w-4 text-red-600" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              <p className="text-xs">
                                Rejection Reason:{" "}
                                {selectedDocument.rejection_reason}
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      User ID: {selectedDocument.user_id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Document Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Document Type
                    </label>
                    <p className="text-sm">
                      {getDocumentTypeLabel(selectedDocument.document_type)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Document Number
                    </label>
                    <p className="text-sm">
                      {selectedDocument.document_number}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Document ID
                    </label>
                    <p className="text-sm">{selectedDocument.document_id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Created At
                    </label>
                    <p className="text-sm">
                      {format(
                        selectedDocument.created_at,
                        "MMM d, yyyy 'at' h:mm a"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Document Preview</h3>
                  {selectedDocument.document_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(selectedDocument.document_url, "_blank")
                      }
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  )}
                </div>

                <div className="border rounded-lg bg-muted/50">
                  {selectedDocument.document_url ? (
                    isPdfDocument(selectedDocument.document_url) ? (
                      <div className="space-y-4">
                        {/* PDF Viewer using iframe */}
                        <div className="p-4">
                          <div className="w-full h-[600px] border rounded-lg overflow-hidden bg-white">
                            <iframe
                              src={`${selectedDocument.document_url}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`}
                              width="100%"
                              height="100%"
                              style={{ border: "none" }}
                              title="PDF Document Viewer"
                              className="rounded-lg"
                            />
                          </div>
                          <div className="mt-4 flex justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(
                                  selectedDocument.document_url,
                                  "_blank"
                                )
                              }
                            >
                              Open in New Tab
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Non-PDF document fallback
                      <div className="p-4 space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Document URL (Non-PDF):
                        </p>
                        <a
                          href={selectedDocument.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 underline break-all"
                        >
                          {selectedDocument.document_url}
                        </a>
                        <div className="mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              window.open(
                                selectedDocument.document_url,
                                "_blank"
                              )
                            }
                          >
                            Open Document
                          </Button>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground">
                        No document URL available
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Verification Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Verification Status</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Current Status
                    </label>
                    <div className="mt-1">
                      <Badge
                        variant={getStatusBadgeVariant(
                          selectedDocument.verification_status
                        )}
                      >
                        {getVerificationStatusLabel(
                          selectedDocument.verification_status
                        )}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Change Status
                    </label>
                    <div className="mt-1">
                      <Select
                        value={selectedStatus}
                        onValueChange={(value: TDocumentVerificationStatus) =>
                          handleStatusChange(value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {DOCUMENT_VERIFICATION_STATUS.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Status Change Confirmation Dialog */}
      <ConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="Confirm Status Change"
        description={
          pendingStatus
            ? `Are you sure you want to change the verification status to "${getVerificationStatusLabel(
                pendingStatus
              )}"?`
            : "Are you sure you want to change the verification status?"
        }
        onConfirm={handleConfirmStatusChange}
        onCancel={handleCancelStatusChange}
        extraContent={
          pendingStatus === "rejected" ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Rejection Reason *
              </label>
              <Textarea
                placeholder="Please provide a reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[100px]"
                required
              />
              {rejectionReason.trim().length === 0 && (
                <p className="text-sm text-red-500">
                  Rejection reason is required when rejecting a document.
                </p>
              )}
            </div>
          ) : null
        }
      />
    </div>
  );
};

export default DocumentVerificationPage;
