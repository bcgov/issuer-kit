export interface TokenValidationResponse {
  token: string;
  issued?: boolean;
  expired?: boolean;
  data?: any;
}
