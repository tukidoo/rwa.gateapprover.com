"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { TApiError } from "@/types/common/api";
import type {
  TUser,
  LoginInput,
  RegisterInput,
  LoginSuccessResponse,
  RegisterSuccessResponse,
} from "@/types/models/user";
import { cookieManager } from "@/lib/cookies";
import { env } from "@/constants/env";

type AuthContextType = {
  session: {
    user: TUser | null;
    token: string | null;
    loading: boolean;
  };
  // Login states and methods
  login: (input: LoginInput) => Promise<LoginSuccessResponse | null>;
  loginLoading: boolean;
  loginError: string | null;
  loginResponse: LoginSuccessResponse | null;
  // Register states and methods
  register: (input: RegisterInput) => Promise<RegisterSuccessResponse | null>;
  registerLoading: boolean;
  registerError: string | null;
  registerResponse: RegisterSuccessResponse | null;
  // Utility methods
  getToken: () => Promise<string | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const usePermissionContext = (): Pick<AuthContextType, "session"> => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("usePermissionContext must be used within an AuthProvider");
  }
  return {
    session: context.session,
  };
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Session state
  const [session, setSession] = useState<AuthContextType["session"]>({
    user: null,
    token: null,
    loading: true,
  });

  // Login states
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginResponse, setLoginResponse] =
    useState<LoginSuccessResponse | null>(null);

  // Register states
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerResponse, setRegisterResponse] =
    useState<RegisterSuccessResponse | null>(null);

  // Helper to map frontend userType to backend user_type
  function mapUserType(userType: RegisterInput["userType"]): string {
    return userType.toLowerCase();
  }

  // Initialize session from stored cookies
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const token = cookieManager.getToken();
        const user = cookieManager.getUser();

        if (token) {
          setSession({
            user,
            token,
            loading: false,
          });
        } else {
          setSession({ user: null, token: null, loading: false });
        }
      } catch (error) {
        console.error("[AuthProvider] Error initializing session", error);
        setSession({ user: null, token: null, loading: false });
      }
    };

    initializeSession();
  }, []);

  async function login(
    input: LoginInput
  ): Promise<LoginSuccessResponse | null> {
    setLoginLoading(true);
    setLoginError(null);
    setLoginResponse(null);

    try {
      const res = await fetch(`${env.backendUrl}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const data = await res.json();

      if (data.success) {
        // Save token and user to cookies
        cookieManager.setToken(data.data.token);
        cookieManager.setUser(data.data.user);

        // Update session state
        setSession({
          user: data.data.user,
          token: data.data.token,
          loading: false,
        });

        setLoginResponse(data);
        return data;
      } else {
        setLoginError(data.message);
        return null;
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setLoginError(errorMessage);
      return null;
    } finally {
      setLoginLoading(false);
    }
  }

  async function register(
    input: RegisterInput
  ): Promise<RegisterSuccessResponse | null> {
    setRegisterLoading(true);
    setRegisterError(null);
    setRegisterResponse(null);

    // Prepare payload matching API expected fields
    const payload = {
      phone: input.phone,
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      password: input.password,
      user_type: mapUserType(input.userType),
    };

    try {
      const res = await fetch(`${env.backendUrl}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Handle 201 Created success response and others
      if (res.status === 201) {
        const data: RegisterSuccessResponse = await res.json();
        setRegisterResponse(data);
        return data;
      } else {
        // Try to parse error response JSON
        let errorData: TApiError | null = null;
        try {
          errorData = await res.json();
        } catch {
          // If parsing fails, set generic error
          setRegisterError("Registration failed with status " + res.status);
          return null;
        }
        if (errorData) {
          setRegisterError(errorData.message || "Registration failed");
        } else {
          setRegisterError("Registration failed");
        }
        return null;
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setRegisterError(errorMessage);
      return null;
    } finally {
      setRegisterLoading(false);
    }
  }

  async function getToken(): Promise<string | null> {
    return cookieManager.getToken() || null;
  }

  async function logout(): Promise<void> {
    cookieManager.clearAuth();
    setSession({ user: null, token: null, loading: false });
    setLoginResponse(null);
    setLoginError(null);
    setRegisterResponse(null);
    setRegisterError(null);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        login,
        loginLoading,
        loginError,
        loginResponse,
        register,
        registerLoading,
        registerError,
        registerResponse,
        getToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
