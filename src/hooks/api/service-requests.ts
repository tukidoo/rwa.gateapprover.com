import { useMutation, useQuery } from "@tanstack/react-query";

import type {
  TApiSuccess,
  TMutationOpts,
  TQueryOpts,
} from "@/types/common/api";
import type { TPagination } from "@/types/common/pagination";
import type {
  TServiceRequest,
  TServiceRequestSLA,
  TServiceRequestUpdate,
} from "@/types/models/service-request";

import { api } from "@/lib/api";

type TGetAllServiceRequestsQParams = TPagination & {
  search?: string;
  status?: string;
  priority?: string;
  category_id?: number;
  assigned_to?: number;
};

type TServiceRequestId = {
  id: TServiceRequest["id"];
};

type TGetServiceRequestByIdQParams = {
  id: TServiceRequest["id"];
};

type TGetAllServiceRequestsResponse = {
  requests: Partial<TServiceRequest>[];
  pagination: TPagination;
  stats: TServiceRequestStats;
};

type TGetServiceRequestByIdResponse = {
  request: Partial<TServiceRequest>;
  updates: Partial<TServiceRequestUpdate>[];
  sla_metrics: Partial<TServiceRequestSLA>;
};

type TServiceRequestStats = {
  total_requests: number;
  open_requests: string;
  in_progress_requests: string;
  pending_approval_requests: string;
  resolved_requests: string;
  closed_requests: string;
  cancelled_requests: string;
  urgent_requests: string;
  overdue_requests: string;
  avg_resolution_hours: number;
  avg_rating: number;
  total_cost: string;
};

type TAssignServiceRequestPayload = {
  id: TServiceRequest["id"];
  assigned_to: TServiceRequest["assigned_to"];
};

type TBuildingStaff = {
  id: number;
  first_name: string;
  last_name: string;
  profile_image_url: string | null;
  department: string;
};

type TUpdateServiceRequestPayload = Partial<TServiceRequest>;

const getAllServiceRequests = (
  params?: TGetAllServiceRequestsQParams
): Promise<TApiSuccess<TGetAllServiceRequestsResponse>> => {
  return api.get("/service-requests", { params });
};

const getServiceRequestById = ({
  id,
  ...params
}: TServiceRequestId & TGetServiceRequestByIdQParams): Promise<
  TApiSuccess<TGetServiceRequestByIdResponse>
> => {
  return api.get(`/service-requests/${id}`, { params });
};

const updateServiceRequest = ({
  id,
  ...params
}: TUpdateServiceRequestPayload): Promise<TApiSuccess<TServiceRequest>> => {
  return api.put(`/service-requests/${id}`, params);
};

const assignServiceRequest = ({
  id,
  assigned_to,
}: TAssignServiceRequestPayload): Promise<TApiSuccess<TServiceRequest>> => {
  return api.put(`/service-requests/${id}/assign`, { assigned_to });
};

const getBuildingStaff = (): Promise<TApiSuccess<TBuildingStaff[]>> => {
  return api.get("/custom/getbuildingstaff");
};

export const useGetAllServiceRequests = (
  params?: TGetAllServiceRequestsQParams,
  options?: TQueryOpts<TGetAllServiceRequestsResponse>
) => {
  return useQuery({
    queryKey: ["useGetAllServiceRequests", params],
    queryFn: () => getAllServiceRequests(params),
    ...options,
  });
};

export const useGetServiceRequestById = (
  params: TServiceRequestId & TGetServiceRequestByIdQParams,
  options?: TQueryOpts<TGetServiceRequestByIdResponse>
) => {
  return useQuery({
    queryKey: ["useGetServiceRequestById", params],
    queryFn: () => getServiceRequestById(params),
    ...options,
  });
};

export const useUpdateServiceRequest = (
  options?: TMutationOpts<TUpdateServiceRequestPayload, TServiceRequest>
) => {
  return useMutation({
    mutationKey: ["useUpdateServiceRequest"],
    mutationFn: (payload: TUpdateServiceRequestPayload) =>
      updateServiceRequest(payload),
    ...options,
  });
};

export const useAssignServiceRequest = (
  options?: TMutationOpts<TAssignServiceRequestPayload, TServiceRequest>
) => {
  return useMutation({
    mutationKey: ["useAssignServiceRequest"],
    mutationFn: (payload: TAssignServiceRequestPayload) =>
      assignServiceRequest(payload),
    ...options,
  });
};

export const useGetBuildingStaff = (options?: TQueryOpts<TBuildingStaff[]>) => {
  return useQuery({
    queryKey: ["useGetBuildingStaff"],
    queryFn: () => getBuildingStaff(),
    ...options,
  });
};
