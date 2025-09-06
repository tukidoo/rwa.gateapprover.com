import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TQueryOpts, TApiSuccess } from '@/types/common/api';

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

export type TGetBuildingAmenitiesResponse = {
  success: boolean;
  message: string;
  data: TAmenity[];
  timestamp: string;
};

const getBuildingAmenities = (): Promise<TApiSuccess<TGetBuildingAmenitiesResponse>> => {
  return api.get('/rwa/getbuildingamenities');
};

export const useGetBuildingAmenities = (opts?: TQueryOpts<TGetBuildingAmenitiesResponse>) => {
  return useQuery({
    queryKey: ['building-amenities'],
    queryFn: () => getBuildingAmenities(),
    ...opts,
  });
};
