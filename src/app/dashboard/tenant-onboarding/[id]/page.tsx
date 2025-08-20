"use client";

import { useGetSubmittedDocumentsById } from "@/hooks/api/tenant-onboarding";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  FileText,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useOpenClose } from "@/hooks/custom/use-open-close";
import { Separator } from "@/components/ui/separator";
import { DateInput } from "@/components/ui/date-input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormItem,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RELATIONSHIP_TYPE } from "@/constants/common";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const formSchema = z.object({
  relationship_type: z.enum(RELATIONSHIP_TYPE.map((type) => type.value)),
  start_date: z.date(),
  end_date: z.date(),
});

const TenantOnboardingDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isOpen, open, close } = useOpenClose();
  const [selectedDocument, setSelectedDocument] = useState<{
    document_id: number;
    document_type: string;
    verification_status: string;
    document_url: string;
  } | null>(null);

  const [isDocumentPending, setIsDocumentPending] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      start_date: new Date(),
      end_date: new Date(),
    },
  });

  const {
    data: getSubmittedDocumentsById,
    isLoading,
    isError,
    error,
  } = useGetSubmittedDocumentsById(Number(id), {
    enabled: !!id,
  });

  const submittedDocuments = getSubmittedDocumentsById?.data;

  useEffect(() => {
    if (submittedDocuments) {
      setIsDocumentPending(
        submittedDocuments.documents.some(
          (document) => document.verification_status === "pending_review"
        )
      );
    }
  }, [submittedDocuments]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "pending_review":
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 hover:bg-green-100"
          >
            Verified
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending_review":
      default:
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
          >
            Pending Review
          </Badge>
        );
    }
  };

  const formatDocumentType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleViewDocument = (document: {
    document_id: number;
    document_type: string;
    verification_status: string;
    document_url: string;
  }) => {
    setSelectedDocument(document);
    open();
  };

  const handleCloseSheet = () => {
    close();
    setSelectedDocument(null);
  };

  const isPdfDocument = (url: string) => {
    return (
      url.toLowerCase().includes(".pdf") || url.toLowerCase().includes("pdf")
    );
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log({
      ...data,
      user_id: Number(id),
      unit_id: submittedDocuments?.user.unit_id,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-8 w-48" />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/tenant-onboarding">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tenant Onboarding
            </Button>
          </Link>
        </div>

        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load tenant onboarding details.{" "}
            {error?.message || "Please try again later."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!submittedDocuments) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/tenant-onboarding">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tenant Onboarding
            </Button>
          </Link>
        </div>

        <Alert>
          <AlertDescription>
            No tenant onboarding data found for this ID.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { user, documents } = submittedDocuments;

  return (
    <div className="container mx-auto flex flex-col gap-4">
      {/* User Information Card */}
      <div>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={user.profile_image_url || undefined}
              alt={`${user.first_name} ${user.last_name}`}
            />
            <AvatarFallback className="font-medium">
              {user.first_name.charAt(0)}
              {user.last_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-medium">
            {user.first_name} {user.last_name}
          </h3>
        </div>
      </div>

      {/* Documents Section */}
      <div className="flex flex-col gap-4">
        <h2 className="font-medium">Submitted Documents</h2>

        {documents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 text-center">
                No documents have been submitted yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((document) => (
              <Card
                key={document.document_id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <CardTitle>
                        {formatDocumentType(document.document_type)}
                      </CardTitle>
                    </div>
                    {getStatusIcon(document.verification_status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    {getStatusBadge(document.verification_status)}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Document ID:</span>
                    <span className="text-sm font-mono">
                      #{document.document_id}
                    </span>
                  </div>

                  {document.document_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleViewDocument(document)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Document
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Separator />

      <div className="flex flex-col gap-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="relationship_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship Type</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="single"
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      {RELATIONSHIP_TYPE.map((type) => (
                        <ToggleGroupItem
                          key={type.value}
                          value={type.value}
                          className="cursor-pointer border"
                        >
                          {type.label}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DateInput {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <p className="text-sm text-muted-foreground">To</p>
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DateInput {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button className="w-max" disabled={isDocumentPending}>
              Complete Onboarding
            </Button>
          </form>
        </Form>
      </div>

      {/* Document Viewing Dialog */}
      <Sheet open={isOpen} onOpenChange={handleCloseSheet}>
        <SheetContent className="md:max-w-4xl w-full">
          <SheetHeader>
            <SheetTitle>Document Viewer</SheetTitle>
            <SheetDescription>
              View and download the submitted document
            </SheetDescription>
          </SheetHeader>

          {selectedDocument && (
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
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
                            window.open(selectedDocument.document_url, "_blank")
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
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TenantOnboardingDetailsPage;
