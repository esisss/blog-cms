export type ActionErrors =
  | {
      type: "zod";
      data: { formErrors: string[]; fieldErrors: Record<string, string[]> };
    }
  | {
      type: "app";
      code?: string;
      message: string;
      details?: Record<string, string[]>;
    };

export type ActionResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: ActionErrors;
};
