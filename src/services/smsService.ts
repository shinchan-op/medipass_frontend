import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Twilio client with conditional check
let twilioClient: twilio.Twilio | null = null;

// Only initialize Twilio if valid credentials are provided
if (process.env.TWILIO_ACCOUNT_SID?.startsWith('AC') && 
    process.env.TWILIO_AUTH_TOKEN && 
    process.env.TWILIO_PHONE_NUMBER) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
} else {
  console.log('Valid Twilio credentials not found. SMS service will use mock mode.');
}

/**
 * Send SMS with OTP
 * @param phoneNumber The recipient's phone number
 * @param otp One-time password
 */
export const sendOtpSms = async (phoneNumber: string, otp: string): Promise<boolean> => {
  try {
    if (!twilioClient) {
      // Mock implementation for development
      console.log(`[MOCK SMS] Sending OTP ${otp} to ${phoneNumber}`);
      return true;
    }
    
    await twilioClient.messages.create({
      body: `Your Medipass verification code is: ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER || '',
      to: phoneNumber
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send OTP SMS:', error);
    return false;
  }
};

/**
 * Send welcome SMS
 * @param phoneNumber The recipient's phone number
 * @param name User's name
 */
export const sendWelcomeSms = async (phoneNumber: string, name: string): Promise<boolean> => {
  try {
    if (!twilioClient) {
      // Mock implementation for development
      console.log(`[MOCK SMS] Sending welcome message to ${name} at ${phoneNumber}`);
      return true;
    }
    
    await twilioClient.messages.create({
      body: `Welcome to Medipass, ${name}! Your healthcare account is now active.`,
      from: process.env.TWILIO_PHONE_NUMBER || '',
      to: phoneNumber
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send welcome SMS:', error);
    return false;
  }
};

/**
 * Send login alert SMS
 * @param phoneNumber The recipient's phone number
 * @param location Login location
 * @param device Device information
 */
export const sendLoginAlertSms = async (
  phoneNumber: string,
  location: string,
  device: string
): Promise<boolean> => {
  try {
    if (!twilioClient) {
      // Mock implementation for development
      console.log(`[MOCK SMS] Sending login alert to ${phoneNumber} for login from ${device} at ${location}`);
      return true;
    }
    
    await twilioClient.messages.create({
      body: `Medipass security alert: New login detected from ${device} at ${location}. If this wasn't you, please contact support immediately.`,
      from: process.env.TWILIO_PHONE_NUMBER || '',
      to: phoneNumber
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send login alert SMS:', error);
    return false;
  }
}; 