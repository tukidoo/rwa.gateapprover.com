type Env = {
  port: number;
  backendUrl: string;
};

export const env: Env = {
  port: parseInt(process.env.PORT || "3000"),
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "",
};
