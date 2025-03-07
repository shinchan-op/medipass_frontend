export const generateOTP = (length: number = 6): string => {
  const digits = '0123456789';
  let OTP = '';
  
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  
  return OTP;
};

export const isOTPExpired = (expiryDate: Date): boolean => {
  return new Date() > expiryDate;
};

export const generateOTPExpiry = (minutes: number = 5): Date => {
  return new Date(Date.now() + minutes * 60 * 1000);
}; 