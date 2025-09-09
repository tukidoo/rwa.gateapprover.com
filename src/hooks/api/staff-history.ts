import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { TQueryOpts, TApiSuccess } from "@/types/common/api";

export type TStaffHistoryItem = {
  id: number;
  ticket_number: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  resident_rating: number | null;
  resident_feedback: string | null;
  unit_number: string;
};

export type TGetStaffHistoryResponse = {
  success: boolean;
  message: string;
  data: TStaffHistoryItem[];
  timestamp: string;
};

const getStaffHistory = (staffId: number): Promise<TApiSuccess<TGetStaffHistoryResponse>> => {
  return api.get(`/rwa/getbuildingstaff/${staffId}/getstaffhistory`);
};

export const useGetStaffHistory = (staffId: number, opts?: TQueryOpts<TGetStaffHistoryResponse>) => {
  return useQuery({
    queryKey: ["staff-history", staffId],
    queryFn: () => getStaffHistory(staffId),
    enabled: !!staffId,
    ...opts,
  });
};