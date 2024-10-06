export interface ICreateOtpCommand {
  emailAddress: string;
  device?: string | null
}

export interface ICreateOtpResponse {
  success: boolean;
  message: string;
}

export interface IValidateOtpCommand {
  email: string,
  code: string,
  device?: string | null
}

export interface IValidateOtpResponse {
  success: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface IRefreshTokenCommand {
  tokenId: string,
  device?: string
}

export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
