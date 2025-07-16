export type TApiSuccess<T = null> = {
  success: true;
  message: string;
  data: T;
  timestamp: string;
};

export type TApiError = {
  success: false;
  message: string;
  error_code: string | null;
  timestamp: string;
};

export type TApiResponse<T> = TApiSuccess<T> | TApiError;
