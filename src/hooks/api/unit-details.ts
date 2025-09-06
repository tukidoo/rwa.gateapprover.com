import { api } from "@/lib/api";
import { TApiSuccess, TQueryOpts } from "@/types/common/api";
import { useQuery } from "@tanstack/react-query";

export type TUnitResident = {
  user_id: number;
  full_name: string;
  profile_image_url: string | null;
  email: string;
  phone: string | null;
};

export type TGetUnitResidentsResponse = TUnitResident[];

export type TUnitDocument = {
  document_type: string;
  document_number: string;
  document_url: string;
};

export type TGetUnitDocumentsResponse = TUnitDocument[];

const getUnitResidents = (unitId: string): Promise<TApiSuccess<TGetUnitResidentsResponse>> => {
  return api.get(`/rwa/${unitId}/getunitresidents`);
};

const getUnitDocuments = (unitId: string): Promise<TApiSuccess<TGetUnitDocumentsResponse>> => {
  return api.get(`/rwa/${unitId}/getunitdocuments`);
};

export const useGetUnitResidents = (
  unitId: string,
  options?: TQueryOpts<TGetUnitResidentsResponse>
) => {
  return useQuery({
    queryKey: ["useGetUnitResidents", unitId],
    queryFn: () => getUnitResidents(unitId),
    enabled: !!unitId,
    ...options,
  });
};

export const useGetUnitDocuments = (
  unitId: string,
  options?: TQueryOpts<TGetUnitDocumentsResponse>
) => {
  return useQuery({
    queryKey: ["useGetUnitDocuments", unitId],
    queryFn: () => getUnitDocuments(unitId),
    enabled: !!unitId,
    ...options,
  });
};


