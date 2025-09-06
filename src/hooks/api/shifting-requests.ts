import { api } from "@/lib/api";
import { TApiSuccess, TQueryOpts } from "@/types/common/api";
import { useQuery } from "@tanstack/react-query";

export type TShiftingRequest = {
  user_id: number;
  user_name: string;
  photo_image_url: string | null;
  unit_id: number;
  unit_number: string;
  shift_type: string;
  date: string;
  time: string;
};

export type TGetShiftingRequestsResponse = TShiftingRequest[];

const getShiftingRequests = (): Promise<TApiSuccess<TGetShiftingRequestsResponse>> => {
  return api.get("/rwa/getshiftingrequests");
};

export const useGetShiftingRequests = (
  options?: TQueryOpts<TGetShiftingRequestsResponse>
) => {
  return useQuery({
    queryKey: ["useGetShiftingRequests"],
    queryFn: () => getShiftingRequests(),
    ...options,
  });
};
