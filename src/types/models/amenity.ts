export type TAmenity = {
  id: number;
  name: string;
  description: string;
  location_details: string;
  capacity: number;
  booking_advance_days: number;
  min_booking_duration_hours: number;
  max_booking_duration_hours: number;
  hourly_rate: string;
  maintenance_fee: string;
  requires_approval: number;
  available_days: string;
  available_hours: string;
  images: string | null;
  rules_and_regulations: string;
  equipment_included: string | null;
};
