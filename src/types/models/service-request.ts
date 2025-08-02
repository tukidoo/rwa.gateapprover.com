import {
  SERVICE_REQUEST_PRIORITY,
  SERVICE_REQUEST_STATUS,
  UPDATE_TYPE,
} from "@/constants/service-request";

export type TServiceRequest = {
  id: number;
  ticket_number: string;
  category_id: number;
  requested_by: number;
  unit_id: number;
  title: string;
  description: string;
  priority: typeof SERVICE_REQUEST_PRIORITY[number]["value"];
  location_details?: string;
  preferred_time?: TPreferredTime;
  attachments?: TAttachment[];
  status: typeof SERVICE_REQUEST_STATUS[number]["value"];
  assigned_to?: number;
  assigned_at?: Date;
  resolved_at?: Date;
  closed_at?: Date;
  resolution_notes?: string;
  cost_estimate: number;
  actual_cost: number;
  resident_rating?: number;
  resident_feedback?: string;
  category_name: string;
  department: string;
  category_priority: typeof SERVICE_REQUEST_PRIORITY[number]["value"];
  estimated_resolution_hours: number;
  category_description: string;
  icon_url: string | null;
  color_code: string | null;
  unit_number: string;
  floor_number: number;
  building_name: string;
  requester_name: string;
  requester_surname: string;
  requester_phone: string;
  requester_email: string;
  assigned_to_name: string;
  assigned_to_surname: string;
  assigned_phone: string;
  hours_since_creation: number;
  resolution_time_hours: number | null;
  is_overdue: boolean;
  created_at: Date;
  updated_at: Date;
};

export type TServiceRequestUpdate = {
  id: number;
  request_id: number;
  updated_by: number;
  update_type: typeof UPDATE_TYPE[number]["value"];
  description: string;
  old_value?: string;
  new_value?: string;
  attachments?: TAttachment[];
  created_at: string;
};

export type TPreferredTime = {
  date?: string;
  notes?: string;
  time_slot?: TTimeSlot;
};

export type TAttachment = {
  url: string;
  type: TAttachmentType;
  filename: string;
  description?: string;
};

export type TServiceRequestSLA = {
  estimated_resolution_hours: number;
  time_elapsed_hours: number;
  time_remaining_hours: number;
  sla_breach: boolean;
  urgency_level: string;
  completion_percentage: number;
};

export type TAttachmentType = "image" | "document" | "video" | "audio";

export type TTimeSlot = "any" | "morning" | "afternoon" | "evening";
