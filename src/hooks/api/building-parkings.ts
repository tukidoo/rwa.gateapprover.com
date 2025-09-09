import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TQueryOpts, TApiSuccess } from '@/types/common/api';

export type TParkingSlot = {
  id: number;
  building_id: number;
  slot_number: string | null;
  zone_id: number;
  floor_level: string | null;
  status: string | null;
  allocation_type: string | null;
  unit_id: number | null;
  user_id: number | null;
  vehicle_id: number | null;
  created_at: string;
  updated_at: string;
  zone_name_zone_type: string | null;
  name: string | null;
  unit_number: string | null;
  vehicle_number: string | null;
  vehicle_make: string | null;
  vehicle_model: string | null;
  vehicle_color: string | null;
  photo_image_url: string | null;
};

export type TGetBuildingParkingsResponse = {
  success: boolean;
  message: string;
  data: TParkingSlot[];
  timestamp: string;
};

const getBuildingParkings = (): Promise<TApiSuccess<TGetBuildingParkingsResponse>> => {
  return api.get('/rwa/getbuildingparkings');
};

export const useGetBuildingParkings = (opts?: TQueryOpts<TGetBuildingParkingsResponse>) => {
  return useQuery({
    queryKey: ['building-parkings'],
    queryFn: () => getBuildingParkings(),
    ...opts,
  });
};