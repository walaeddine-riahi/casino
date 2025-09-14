export type BaseResponse = {
  status: number;
  message: string;
  errors?: Record<string, unknown>;
};
