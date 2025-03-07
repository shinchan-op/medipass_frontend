import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter object
let transporter: nodemailer.Transporter | null = null;

// Only initialize email transporter if valid credentials are provided
if (process.env.EMAIL_HOST && 
    process.env.EMAIL_PORT && 
    process.env.EMAIL_USER && 
    process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: parseInt(process.env.EMAIL_PORT, 10) === 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
} else {
  console.log('Valid email credentials not found. Email service will use mock mode.');
}

/**
 * Send OTP verification email
 * @param email Recipient's email address
 * @param otp One-time password
 */
export const sendOtpEmail = async (email: string, otp: string): Promise<boolean> => {
  try {
    if (!transporter) {
      // Mock implementation for development
      console.log(`[MOCK EMAIL] Sending OTP ${otp} to ${email}`);
      return true;
    }

    await transporter.sendMail({
      from: `"Medipass Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Medipass Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #3f51b5;">Medipass</h1>
          </div>
          <p>Hello,</p>
          <p>Your verification code for Medipass is:</p>
          <div style="background-color: #f5f5f5; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This code is valid for 5 minutes. If you didn't request this code, please ignore this email.</p>
          <p>Thank you,<br>The Medipass Team</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    return false;
  }
};

/**
 * Send welcome email to new users
 * @param email Recipient's email address
 * @param name User's name
 */
export const sendWelcomeEmail = async (email: string, name: string): Promise<boolean> => {
  try {
    if (!transporter) {
      // Mock implementation for development
      console.log(`[MOCK EMAIL] Sending welcome email to ${name} at ${email}`);
      return true;
    }

    await transporter.sendMail({
      from: `"Medipass" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Medipass!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #3f51b5;">Medipass</h1>
          </div>
          <p>Hello ${name},</p>
          <p>Welcome to Medipass! Your healthcare data is now secure and accessible in one place.</p>
          <p>With Medipass, you can:</p>
          <ul>
            <li>Access your medical records securely</li>
            <li>Schedule appointments with healthcare providers</li>
            <li>Manage prescriptions and medications</li>
            <li>Share your health information with authorized providers</li>
          </ul>
          <p>If you have any questions, please don't hesitate to contact our support team.</p>
          <p>Thank you,<br>The Medipass Team</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
};

/**
 * Send password reset email
 * @param email Recipient's email address
 * @param resetToken Password reset token
 */
export const sendPasswordResetEmail = async (email: string, resetToken: string): Promise<boolean> => {
  try {
    if (!transporter) {
      // Mock implementation for development
      console.log(`[MOCK EMAIL] Sending password reset email with token ${resetToken} to ${email}`);
      return true;
    }

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: `"Medipass Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your Medipass Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #3f51b5;">Medipass</h1>
          </div>
          <p>Hello,</p>
          <p>We received a request to reset your Medipass password. If you didn't make this request, please ignore this email.</p>
          <p>To reset your password, click the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #3f51b5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
          </div>
          <p>This link will expire in 1 hour.</p>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; font-size: 12px;">${resetLink}</p>
          <p>Thank you,<br>The Medipass Team</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return false;
  }
}; 