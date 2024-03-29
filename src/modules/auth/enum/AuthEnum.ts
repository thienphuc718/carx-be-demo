export enum RequestOTPMethodEnum {
  SMS = 'SMS',
  EMAIL = 'EMAIL'
}

export enum ForgetPasswordMethodEnum {
  SMS_OTP = 'SMS_OTP',
  EMAIL_OTP = 'EMAIL_OTP'
}

export enum AuthMethodEnum {
  PHONE_NUMBER_OTP = 'PHONE_NUMBER_OTP',
  EMAIL_PASSWORD = 'EMAIL_PASSWORD',
  PHONE_NUMBER_PASSWORD = 'PHONE_NUMBER_PASSWORD'
}

export enum SignInMethodEnum {
  EMAIL_PASSWORD = 'EMAIL_PASSWORD',
  PHONE_NUMBER_OTP = 'PHONE_NUMBER_OTP',
  PHONE_NUMBER_PASSWORD = 'PHONE_NUMBER_PASSWORD',
  GOOGLE = 'GOOGLE',
}
