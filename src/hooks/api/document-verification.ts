import { TPagination } from "@/types/common/pagination";
import { api } from "@/lib/api";
import { TApiSuccess, TMutationOpts, TQueryOpts } from "@/types/common/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TDocumentVerification } from "@/types/models/document-verification";

export type TGetDocumentVerificationsResponseData = {
  documents: TDocumentVerification[];
  pagination: TPagination;
};

export type TGetDocumentVerificationsQueryParams = Partial<TPagination> & {
  user_id?: number;
  document_type?: string;
  document_number?: string;
};

const getAllDocumentVerifications = (
  params: TGetDocumentVerificationsQueryParams
): Promise<TApiSuccess<TGetDocumentVerificationsResponseData>> => {
  return api.get("/rwa/documentapprovals", { params });
};

const getDocumentVerificationById = (
  id: number
): Promise<TApiSuccess<TDocumentVerification>> => {
  return api.get(`/rwa/documentapprovals/${id}`);
};

const addDocumentVerification = (
  data: Partial<TDocumentVerification>
): Promise<TApiSuccess<TDocumentVerification>> => {
  return api.post("/rwa/documentapprovals", data);
};

const updateDocumentVerification = (
  document_id: number,
  data: Partial<TDocumentVerification>
): Promise<TApiSuccess<TDocumentVerification>> => {
  return api.put(`/rwa/verificationstatus/${document_id}`, data);
};

export const useGetAllDocumentVerifications = (
  params: TGetDocumentVerificationsQueryParams,
  options?: TQueryOpts<TGetDocumentVerificationsResponseData>
) => {
  return useQuery({
    queryKey: ["useGetAllDocumentVerifications", params],
    queryFn: () => getAllDocumentVerifications(params),
    ...options,
  });
};

export const useGetDocumentVerificationById = (
  id: number,
  options?: TQueryOpts<TDocumentVerification>
) => {
  return useQuery({
    queryKey: ["useGetDocumentVerificationById", id],
    queryFn: () => getDocumentVerificationById(id),
    ...options,
  });
};

export const useAddDocumentVerification = (
  options?: TMutationOpts<Partial<TDocumentVerification>, TDocumentVerification>
) => {
  return useMutation({
    mutationKey: ["useAddDocumentVerification"],
    mutationFn: (data: Partial<TDocumentVerification>) =>
      addDocumentVerification(data),
    ...options,
  });
};

export const useUpdateDocumentVerification = (
  document_id: number,
  options?: TMutationOpts<Partial<TDocumentVerification>, TDocumentVerification>
) => {
  return useMutation({
    mutationKey: ["useUpdateDocumentVerification"],
    mutationFn: (data: Partial<TDocumentVerification>) =>
      updateDocumentVerification(document_id, data),
    ...options,
  });
};
