import {
  TNotice,
  TNoticesStats,
  TUserTargetingInfo,
} from "@/types/models/notice";
import { TPagination } from "@/types/common/pagination";
import { api } from "@/lib/api";
import { TApiSuccess, TMutationOpts, TQueryOpts } from "@/types/common/api";
import { useMutation, useQuery } from "@tanstack/react-query";

export type TGetNoticesResponseData = {
  notices: TNotice[];
  pagination: TPagination;
  stats: TNoticesStats;
  user_targeting_info: TUserTargetingInfo;
};

export type TGetNoticesQueryParams = {
  page?: number;
  page_size?: number;
  category_id?: number;
  priority?: string;
  unread_only?: boolean;
  pinned_only?: boolean;
  active_only?: boolean;
  date_from?: string;
  date_to?: string;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
};

const getAllNotices = (
  params: TGetNoticesQueryParams
): Promise<TApiSuccess<TGetNoticesResponseData>> => {
  return api.get("/notices", { params });
};

const getNoticeById = (id: number): Promise<TApiSuccess<TNotice>> => {
  return api.get(`/notices/${id}`);
};

const updateNotice = (
  id: number,
  data: Partial<TNotice>
): Promise<TApiSuccess<TNotice>> => {
  return api.put(`/notices/${id}`, data);
};

export const useGetAllNotices = (
  params: TGetNoticesQueryParams,
  options?: TQueryOpts<TGetNoticesResponseData>
) => {
  return useQuery({
    queryKey: ["useGetAllNotices", params],
    queryFn: () => getAllNotices(params),
    ...options,
  });
};

export const useGetNoticeById = (id: number, options?: TQueryOpts<TNotice>) => {
  return useQuery({
    queryKey: ["useGetNoticeById", id],
    queryFn: () => getNoticeById(id),
    ...options,
  });
};

export const useUpdateNotice = (
  id: number,
  options?: TMutationOpts<Partial<TNotice>, TNotice>
) => {
  return useMutation({
    mutationFn: (data: Partial<TNotice>) => updateNotice(id, data),
    ...options,
  });
};
