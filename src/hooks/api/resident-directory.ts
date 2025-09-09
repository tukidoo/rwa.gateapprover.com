import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TQueryOpts, TApiSuccess } from '@/types/common/api';

export type TResident = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  profile_image_url: string | null;
  unit_number: string;
  is_primary: number;
  association_status: string;
  specialisation: string | null;
};

export type TGetResidentDirectoryResponse = TResident[];

const getResidentDirectory = (): Promise<TApiSuccess<TGetResidentDirectoryResponse>> => {
  return api.get('/rwa/getresidentdirectory');
};

export const useGetResidentDirectory = (opts?: TQueryOpts<TGetResidentDirectoryResponse>) => {
  return useQuery({
    queryKey: ['resident-directory'],
    queryFn: () => getResidentDirectory(),
    ...opts,
  });
};
