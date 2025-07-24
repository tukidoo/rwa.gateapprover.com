import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import type { TPagination } from "./pagination";

export type TQueryOpts<TResponse = undefined> = Omit<
  UseQueryOptions<TApiSuccess<TResponse>, TApiError>,
  "queryKey" | "queryFn"
>;

export type TMutationOpts<TVariables = void, TResponse = undefined> = Omit<
  UseMutationOptions<TApiSuccess<TResponse>, TApiError, TVariables>,
  "mutationKey" | "mutationFn"
>;

export type TApiPromise<TData = undefined> =
  | Promise<TApiSuccess<TData>>
  | Promise<TApiError>;

export type TApiSuccess<TData = null> = {
  success: true;
  message: string;
  data?: TData;
  pagination?: TPagination;
  timestamp: string;
};

export type TApiError = {
  success: false;
  message: string;
  error_code: string | null;
  timestamp: string;
};

export type TApiResponse<T> = TApiSuccess<T> | TApiError;
