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

export type TNoticeAnalytics = {
  overall_stats: {
    total_notices: number;
    published_notices: number;
    draft_notices: number;
    archived_notices: number;
    pinned_notices: number;
    avg_view_count: string;
    total_views: number;
  };
  category_breakdown: {
    category_name: string;
    color_code: string;
    notice_count: number;
    avg_views: number;
    urgent_count: number;
    high_count: number;
  }[];
  recent_activity: {
    date: string;
    notices_created: number;
    notices_published: number;
  }[];
  priority_distribution: {
    priority: string;
    count: number;
    avg_views: number;
  }[];
  top_notices: {
    id: number;
    title: string;
    priority: string;
    view_count: number;
    published_at: string;
    category_name: string;
  }[];
  engagement_stats: {
    active_readers: number;
    avg_views_per_notice: string;
    notices_with_views: number;
  };
};

const getAllNotices = (
  params: TGetNoticesQueryParams
): Promise<TApiSuccess<TGetNoticesResponseData>> => {
  return api.get("/notices", { params });
};

const getNoticeById = (id: number): Promise<TApiSuccess<TNotice>> => {
  return api.get(`/notices/${id}`);
};

const addNotice = (data: Partial<TNotice>): Promise<TApiSuccess<TNotice>> => {
  return api.post("/notices", data);
};

const updateNotice = (
  id: number,
  data: Partial<TNotice>
): Promise<TApiSuccess<TNotice>> => {
  return api.put(`/notices/${id}`, data);
};

const getNoticeAnalytics = (): Promise<TApiSuccess<TNoticeAnalytics>> => {
  return api.get("/notices/analytics");
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

export const useAddNotice = (
  options?: TMutationOpts<Partial<TNotice>, TNotice>
) => {
  return useMutation({
    mutationKey: ["useAddNotice"],
    mutationFn: (data: Partial<TNotice>) => addNotice(data),
    ...options,
  });
};

export const useUpdateNotice = (
  id: number,
  options?: TMutationOpts<Partial<TNotice>, TNotice>
) => {
  return useMutation({
    mutationKey: ["useUpdateNotice"],
    mutationFn: (data: Partial<TNotice>) => updateNotice(id, data),
    ...options,
  });
};

export const useGetNoticeAnalytics = (
  options?: TQueryOpts<TNoticeAnalytics>
) => {
  return useQuery({
    queryKey: ["useGetNoticeAnalytics"],
    queryFn: () => getNoticeAnalytics(),
    ...options,
  });
};
