import { DOCUMENT_VERIFICATION_STATUS } from "@/constants/document";
import { TUser } from "./user";

export type TDocumentVerification = {
  user_id: TUser["id"];
  first_name: TUser["first_name"];
  last_name: TUser["last_name"];
  profile_image_url: string | null;
  document_id: number;
  document_type: string;
  document_number: string;
  document_url: string;
  verification_status: TDocumentVerificationStatus;
  verified_by: TUser["id"] | null;
  verified_at: string | null;
  rejection_reason: string | null;
  created_at: string;
};

export type TDocumentVerificationStatus =
  (typeof DOCUMENT_VERIFICATION_STATUS)[number]["value"];
