import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TQueryOpts, TApiSuccess } from '@/types/common/api';

export type TAmenityBooking = {
  id: number;
  amenity_id: number;
  unit_id: number;
  booking_code: string;
  booking_date: string;
  booking_time: string;
  duration_hours: number;
  total_cost: string;
  status: string;
  requires_approval: number;
  amenity_name: string;
  unit_number: string;
};

export type TGetAmenitiesBookingsResponse = {
  success: boolean;
  message: string;
  data: TAmenityBooking[];
  timestamp: string;
};

const getAmenitiesBookings = (): Promise<TApiSuccess<TGetAmenitiesBookingsResponse>> => {
  return api.get('/rwa/getamenitiesbookings');
};

export const useGetAmenitiesBookings = (opts?: TQueryOpts<TGetAmenitiesBookingsResponse>) => {
  return useQuery({
    queryKey: ['amenities-bookings'],
    queryFn: () => getAmenitiesBookings(),
    ...opts,
  });
};