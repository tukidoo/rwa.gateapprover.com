export type TUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  preferred_language: string;
  email_verified: number;
  phone_verified: number;
  unit_id: number | null;
  building_id: number | null;
  profile_image_url: string | null;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  userType:
    | "Resident"
    | "Owner"
    | "Tenant"
    | "Security"
    | "Maintenance"
    | "Services"
    | "Helper";
};

export type LoginSuccessResponse = {
  success: true;
  message: string;
  data: {
    token: string;
    user: TUser;
    expires_in: number;
  };
  timestamp: string;
};

export type RegisterSuccessResponse = {
  success: true;
  message: string;
  data: {
    user_id: number;
    verification_required: boolean;
  };
  timestamp: string;
};
