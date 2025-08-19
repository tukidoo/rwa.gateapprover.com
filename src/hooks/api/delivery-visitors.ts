import { TApiResponse } from "@/types/common/api";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

type TDeliveryVisitorsPayload = {
  visitor_name: string;
  visitor_phone: string;
  visitor_company: string;
  visitor_vehicle: string;
  visitor_id_type: string;
  visitor_id_number: string;
  unit_id: number;
  visit_purpose: string;
  visitor_location: string;
  expected_duration_minutes: number;
  expiration_minutes: number;
  category_id: number;
};

type TDeliveryVisitorsResponse = TApiResponse<{
  approval_id: number;
  visitor_id: number;
  expires_at: string;
  notifications_sent: boolean;
}>;