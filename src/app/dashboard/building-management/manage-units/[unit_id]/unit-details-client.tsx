"use client";

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
  Users,
  FileText,
  User,
  Mail,
  Phone,
  Download,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import {
  useGetUnitResidents,
  useGetUnitDocuments,
} from "@/hooks/api/unit-details";

interface UnitDetailsClientProps {
  unitId: string;
}

export function UnitDetailsClient({ unitId }: UnitDetailsClientProps) {
  // Fetch residents and documents data
  const {
    data: residentsData,
    isLoading: residentsLoading,
    error: residentsError,
  } = useGetUnitResidents(unitId);

  const {
    data: documentsData,
    isLoading: documentsLoading,
    error: documentsError,
  } = useGetUnitDocuments(unitId);

  const residents = residentsData?.data || [];
  const documents = documentsData?.data || [];

  const getDocumentTypeBadge = (type: string) => {
    const typeMap: Record<
      string,
      {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline";
      }
    > = {
      tenancy_agreement: { label: "Tenancy Agreement", variant: "default" },
      onboarding_document: {
        label: "Onboarding Document",
        variant: "secondary",
      },
      id_document: { label: "ID Document", variant: "outline" },
      utility_bill: { label: "Utility Bill", variant: "outline" },
    };

    const config = typeMap[type] || {
      label: type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      variant: "outline" as const,
    };

    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  return (
    <>
      {/* Residents Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#7d51ff]" />
            Residents
          </CardTitle>
          <CardDescription>
            Current residents living in this unit
          </CardDescription>
        </CardHeader>
        <CardContent>
          {residentsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#7d51ff]" />
              <span className="ml-2 text-muted-foreground">
                Loading residents...
              </span>
            </div>
          ) : residentsError ? (
            <div className="flex items-center justify-center py-12">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <span className="ml-2 text-destructive">
                Failed to load residents
              </span>
            </div>
          ) : residents.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No residents found for this unit
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {residents.map((resident) => (
                <div
                  key={resident.user_id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {resident.profile_image_url ? (
                      <Image
                        src={resident.profile_image_url}
                        alt={resident.full_name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full object-cover border-2 border-muted"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-[#7d51ff]/10 flex items-center justify-center border-2 border-muted">
                        <User className="h-6 w-6 text-[#7d51ff]" />
                      </div>
                    )}
                  </div>

                  {/* Resident Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {resident.full_name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{resident.email}</span>
                      </div>
                      {resident.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>{resident.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#7d51ff]" />
            Documents
          </CardTitle>
          <CardDescription>Documents associated with this unit</CardDescription>
        </CardHeader>
        <CardContent>
          {documentsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#7d51ff]" />
              <span className="ml-2 text-muted-foreground">
                Loading documents...
              </span>
            </div>
          ) : documentsError ? (
            <div className="flex items-center justify-center py-12">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <span className="ml-2 text-destructive">
                Failed to load documents
              </span>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No documents found for this unit
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((document, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {/* Document Icon */}
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-lg bg-[#7d51ff]/10 flex items-center justify-center border-2 border-muted">
                      <FileText className="h-6 w-6 text-[#7d51ff]" />
                    </div>
                  </div>

                  {/* Document Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getDocumentTypeBadge(document.document_type)}
                      <span className="text-sm text-muted-foreground">
                        {document.document_number}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={document.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        View PDF
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={document.document_url}
                        download
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
