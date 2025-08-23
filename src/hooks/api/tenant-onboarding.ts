import { TPagination } from "@/types/common/pagination";
import { api } from "@/lib/api";
import { TApiSuccess, TMutationOpts, TQueryOpts } from "@/types/common/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TDocumentVerification } from "@/types/models/document-verification";
import { TUser } from "@/types/models/user";

export type TGetTenantOnboardingResponseData = Pick<
  TUser,
  "id" | "first_name" | "last_name" | "profile_image_url"
>[];

export type TGetSubmittedDocumentsResponseData = {
  user: Pick<
    TUser,
    "id" | "first_name" | "last_name" | "profile_image_url" | "unit_id"
  >;
  documents: Pick<
    TDocumentVerification,
    "document_id" | "document_type" | "verification_status" | "document_url"
  >[];
};

export type TPostFinishOnboardingPayload = {
  user_id: number;
  unit_id: number;
  relationship_type: string;
  start_date: string;
  end_date: string;
};

export type TGetTenantOnboardingQueryParams = Partial<TPagination>;

const getAllTenantOnboarding = (
  params: TGetTenantOnboardingQueryParams
): Promise<TApiSuccess<TGetTenantOnboardingResponseData>> => {
  return api.get("/rwa/getuserrequestlist", { params });
};

const getSubmittedDocumentsById = (
  id: number
): Promise<TApiSuccess<TGetSubmittedDocumentsResponseData>> => {
  return api.get(`/rwa/getsubmitteddocuments/${id}`);
};

const postFinishOnboarding = (
  payload: TPostFinishOnboardingPayload
): Promise<TApiSuccess<undefined>> => {
  return api.post(`/rwa/finishonboarding`, payload);
};

export const useGetAllTenantOnboarding = (
  params: TGetTenantOnboardingQueryParams,
  options?: TQueryOpts<TGetTenantOnboardingResponseData>
) => {
  return useQuery({
    queryKey: ["useGetAllTenantOnboarding", params],
    queryFn: () => getAllTenantOnboarding(params),
    ...options,
  });
};

export const useGetSubmittedDocumentsById = (
  id: number,
  options?: TQueryOpts<TGetSubmittedDocumentsResponseData>
) => {
  return useQuery({
    queryKey: ["useGetSubmittedDocumentsById", id],
    queryFn: () => getSubmittedDocumentsById(id),
    ...options,
  });
};

export const usePostFinishOnboarding = (
  options?: TMutationOpts<TPostFinishOnboardingPayload, undefined>
) => {
  return useMutation({
    mutationFn: (payload: TPostFinishOnboardingPayload) =>
      postFinishOnboarding(payload),
    ...options,
  });
};
