import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { TQueryOpts, TApiSuccess } from "@/types/common/api";
import { TAmenity } from "@/types/models/amenity";

export type TGetBuildingAmenitiesResponse = TAmenity[];

const getBuildingAmenities = (): Promise<
  TApiSuccess<TGetBuildingAmenitiesResponse>
> => {
  return api.get("/rwa/getbuildingamenities");
};

export const useGetBuildingAmenities = (
  options?: TQueryOpts<TGetBuildingAmenitiesResponse>
) => {
  return useQuery({
    queryKey: ["building-amenities"],
    queryFn: () => getBuildingAmenities(),
    ...options,
  });
};
