import { api } from "@/lib/api";
import { TApiSuccess, TQueryOpts } from "@/types/common/api";
import { useQuery, useMutation } from "@tanstack/react-query";

export type TBuildingStats = {
  id: number;
  name: string;
  address: string;
  city: string;
  emirate: string;
  postal_code: string;
  total_floors: number;
  total_units: number;
  building_type: string;
  contact_email: string;
  contact_phone: string;
  emergency_contact: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  total_units_actual: number;
  occupied_units: number;
  total_floors_actual: number;
  total_residents: number;
};

export type TBuildingStaff = {
  staff_id: number;
  building_id: number;
  user_id: number;
  role_name: string;
  department: string;
  shift_type: string;
  hire_date: string;
  staff_status: string;
  employee_id: string;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  profile_image_url: string | null;
  lang_known: string;
};

export type TGetBuildingStatsResponse = TBuildingStats[];
export type TGetBuildingStaffResponse = TBuildingStaff[];

const getBuildingStats = (): Promise<TApiSuccess<TGetBuildingStatsResponse>> => {
  return api.get("/rwa/getbuildingstats");
};

const getBuildingStaff = (): Promise<TApiSuccess<TGetBuildingStaffResponse>> => {
  return api.get("/rwa/getbuildingstaff");
};

export const useGetBuildingStats = (
  options?: TQueryOpts<TGetBuildingStatsResponse>
) => {
  return useQuery({
    queryKey: ["useGetBuildingStats"],
    queryFn: () => getBuildingStats(),
    ...options,
  });
};

export const useGetBuildingStaff = (
  options?: TQueryOpts<TGetBuildingStaffResponse>
) => {
  return useQuery({
    queryKey: ["useGetBuildingStaff"],
    queryFn: () => getBuildingStaff(),
    ...options,
  });
};

export type TBuildingUnit = {
  id: number;
  unit_number: string;
  status: string;
  user_id: number | null;
  user_name: string;
  photo_url: string | null;
  contact_no: string | null;
};

export type TGetUnitsListResponse = TBuildingUnit[];

export type TUpdateOccupancyRequest = {
  unit_id: string;
  occupancy_status: 'occupied' | 'vacant' | 'maintenance';
};

export type TUpdateOccupancyResponse = {
  success: boolean;
  message: string;
};

const getUnitsList = (): Promise<TApiSuccess<TGetUnitsListResponse>> => {
  return api.get("/rwa/getunitslist");
};

const updateOccupancy = (data: TUpdateOccupancyRequest): Promise<TApiSuccess<TUpdateOccupancyResponse>> => {
  return api.put("/rwa/updateoccupancy", data);
};

export const useGetUnitsList = (
  options?: TQueryOpts<TGetUnitsListResponse>
) => {
  return useQuery({
    queryKey: ["useGetUnitsList"],
    queryFn: () => getUnitsList(),
    ...options,
  });
};

export const useUpdateOccupancy = () => {
  return useMutation({
    mutationFn: updateOccupancy,
  });
};
